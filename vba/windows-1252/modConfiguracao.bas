Attribute VB_Name = "modConfiguracao"
Option Explicit

' Verificacao local: nao conecta ao SQL nem modifica dados.
Public Function VerificarInstalacao() As Boolean
    ValidarCatalogoPlanilha ThisWorkbook.Worksheets("Compostos")
    VerificarInstalacao = True
End Function

Public Function ConfigValor(ByVal chave As String, Optional ByVal padrao As String = "") As String
    Dim ws As Worksheet, r As Long, n As Long, resultado As String
    On Error Resume Next
    Set ws = ThisWorkbook.Worksheets("Config")
    On Error GoTo 0
    If ws Is Nothing Then Err.Raise vbObjectError + 800, , "Crie a aba Config conforme docs/SETUP.md."
    For r = 2 To ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
        If StrComp(Trim$(CStr(ws.Cells(r, 1).Value2)), chave, vbTextCompare) = 0 Then
            n = n + 1
            resultado = Trim$(CStr(ws.Cells(r, 2).Value2))
        End If
    Next r
    If n > 1 Then Err.Raise vbObjectError + 801, , "Configuracao duplicada: " & chave
    If resultado = "" Then resultado = padrao
    If resultado = "" Then Err.Raise vbObjectError + 802, , "Configuracao ausente: " & chave
    ConfigValor = resultado
End Function

Public Function ConexaoSQL() As String
    Dim servidor As String, banco As String, provider As String
    Dim criptografia As String, certificado As String
    servidor = ConfigValor("SQL_SERVER")
    banco = ConfigValor("DATABASE")
    provider = ConfigValor("SQL_PROVIDER", "MSOLEDBSQL19")
    criptografia = ConfigValor("SQL_ENCRYPT", "Mandatory")
    certificado = ConfigValor("SQL_TRUST_SERVER_CERTIFICATE", "False")
    If provider <> "MSOLEDBSQL19" And provider <> "MSOLEDBSQL" Then _
        Err.Raise vbObjectError + 803, , "Use MSOLEDBSQL19 ou MSOLEDBSQL instalado."
    If InStr(servidor, ";") Or InStr(banco, ";") Or InStr(servidor, """") Or InStr(banco, """") Then _
        Err.Raise vbObjectError + 804, , "Servidor/banco contem caractere invalido."
    If criptografia <> "Mandatory" And criptografia <> "Optional" And criptografia <> "Strict" Then _
        Err.Raise vbObjectError + 805, , "SQL_ENCRYPT invalido."
    If certificado <> "True" And certificado <> "False" Then _
        Err.Raise vbObjectError + 806, , "SQL_TRUST_SERVER_CERTIFICATE deve ser True ou False."
    If provider = "MSOLEDBSQL" Then
        If criptografia = "Strict" Then Err.Raise vbObjectError + 807, , "Strict exige driver 19."
        criptografia = IIf(criptografia = "Mandatory", "True", "False")
    End If
    ConexaoSQL = "Provider=" & provider & ";Data Source=" & servidor & _
        ";Initial Catalog=" & banco & ";Integrated Security=SSPI;Use Encryption for Data=" & _
        criptografia & ";Trust Server Certificate=" & certificado & ";"
End Function

Public Sub ValidarCatalogoPlanilha(ByVal ws As Worksheet)
    Dim d As Object, vistos As Object, r As Long, id As String, item As Variant
    Dim cabecalhos As Variant, i As Long
    Set d = CatalogoOficial()
    Set vistos = CreateObject("Scripting.Dictionary")
    cabecalhos = Array("IDComposto", "Formula", "Nomenclatura", "Estrutura2D", "MassaMolar", "CodigoExplorador", "ImagemArquivo")
    For i = 0 To UBound(cabecalhos)
        If NormalizarNome(ws.Cells(2, i + 1).Value2) <> NormalizarNome(cabecalhos(i)) Then
            If Not (i = 4 And NormalizarNome(ws.Cells(2, i + 1).Value2) = "massamolargmol") Then _
                Err.Raise vbObjectError + 808, , "Cabecalho invalido em Compostos: " & cabecalhos(i)
        End If
    Next i
    For r = 3 To UltimaLinhaDados(ws)
        If Len(Trim$(CStr(ws.Cells(r, 1).Value2))) > 0 Then
            id = CStr(IDPositivo(ws.Cells(r, 1).Value2))
            If Not d.Exists(id) Then Err.Raise vbObjectError + 809, , "ID fora do catalogo: " & id
            If vistos.Exists(id) Then Err.Raise vbObjectError + 810, , "ID repetido: " & id
            vistos.Add id, True
            item = d(id)
            If CStr(ws.Cells(r, 2).Value2) <> item(0) Or CStr(ws.Cells(r, 3).Value2) <> item(1) Or _
               CStr(ws.Cells(r, 6).Value2) <> item(3) Or CStr(ws.Cells(r, 7).Value2) <> item(4) Then _
                Err.Raise vbObjectError + 811, , "Cadastro divergente do catalogo na linha " & r & ". Regenere e importe data/Compostos.csv."
            If Not IsNumeric(ws.Cells(r, 5).Value2) Then Err.Raise vbObjectError + 812, , "Massa nao numerica, linha " & r
            If Abs(CDbl(ws.Cells(r, 5).Value2) - CDbl(item(2))) > 0.0000001 Then _
                Err.Raise vbObjectError + 813, , "Massa divergente do catalogo, linha " & r
        ElseIf Application.CountA(ws.Range(ws.Cells(r, 2), ws.Cells(r, 7))) > 0 Then
            Err.Raise vbObjectError + 814, , "Linha com dados e sem ID: " & r
        End If
    Next r
    If vistos.Count <> d.Count Then Err.Raise vbObjectError + 815, , "Compostos ausentes do snapshot oficial."
End Sub

Public Function IDPositivo(ByVal valor As Variant) As Long
    If IsError(valor) Then GoTo Invalido
    If Not IsNumeric(valor) Then GoTo Invalido
    If CDbl(valor) < 1 Or CDbl(valor) > 2147483647# Then GoTo Invalido
    If CDbl(valor) <> Fix(CDbl(valor)) Then GoTo Invalido
    IDPositivo = CLng(valor)
    Exit Function
Invalido:
    Err.Raise vbObjectError + 816, , "ID deve ser inteiro positivo."
End Function

Public Function NormalizarNome(ByVal valor As Variant) As String
    Dim t As String, i As Long, c As String, resultado As String
    If IsError(valor) Then Exit Function
    t = LCase$(Trim$(CStr(valor)))
    For i = 0 To 9: t = Replace(t, ChrW(8320 + i), CStr(i)): Next i
    For i = 224 To 229: t = Replace(t, ChrW(i), "a"): Next i
    For i = 232 To 235: t = Replace(t, ChrW(i), "e"): Next i
    For i = 236 To 239: t = Replace(t, ChrW(i), "i"): Next i
    For i = 242 To 246: t = Replace(t, ChrW(i), "o"): Next i
    For i = 249 To 252: t = Replace(t, ChrW(i), "u"): Next i
    t = Replace(t, ChrW(231), "c")
    For i = 1 To Len(t)
        c = Mid$(t, i, 1)
        If c Like "[a-z0-9]" Then resultado = resultado & c
    Next i
    NormalizarNome = resultado
End Function

Public Function UltimaLinhaDados(ByVal ws As Worksheet) As Long
    Dim encontrada As Range
    Set encontrada = ws.Cells.Find(What:="*", After:=ws.Cells(1, 1), LookIn:=xlFormulas, _
        LookAt:=xlPart, SearchOrder:=xlByRows, SearchDirection:=xlPrevious, MatchCase:=False)
    If encontrada Is Nothing Then
        UltimaLinhaDados = 1
    Else
        UltimaLinhaDados = encontrada.Row
    End If
End Function
