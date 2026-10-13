Attribute VB_Name = "modImportacaoSQL"
Option Explicit

Public Sub ImportarLaboratorioSQL()

    Dim cn As Object
    Dim imagens As Object
    Dim wsC As Worksheet, wsR As Worksheet, wsA As Worksheet
    Dim r As Long, id As Long
    Dim transacao As Boolean
    Dim etapa As String, mensagem As String
    Dim observacao As String
    Dim runID As String, rs As Object, cmdLog As Object
    Dim resumo As String, erroDescricao As String
    Dim totalC As Long, totalR As Long, totalA As Long

    On Error GoTo Falha

    Set wsC = ThisWorkbook.Worksheets("Compostos")
    Set wsR = ThisWorkbook.Worksheets("ReferênciaPH")
    Set wsA = ThisWorkbook.Worksheets("Analises")

    etapa = "Conferência dos IDs"

    Application.CalculateFull
    ValidarCatalogoPlanilha wsC
    ValidarIDs wsC, 1, 3
    ValidarIDs wsR, 1, 2
    ValidarIDs wsA, 2, 3

    'Carrega todas as imagens antes de iniciar a importação.
    Set imagens = CreateObject("Scripting.Dictionary")

    For r = 3 To wsC.Cells(wsC.Rows.Count, "A").End(xlUp).Row

        If Len(Trim$(CStr(wsC.Cells(r, "A").Value2))) > 0 Then

            id = CLng(wsC.Cells(r, "A").Value2)
            etapa = "Imagem do composto ID " & id

            imagens.Add CStr(id), LerImagemComposto(ResolverImagemComposto(wsC, r))

        End If

    Next r

    etapa = "Conexão com o SQL Server"

    Set cn = CreateObject("ADODB.Connection")

    cn.ConnectionTimeout = 15
    cn.CommandTimeout = 60

    cn.Open ConexaoSQL()
    VerificarSchema cn
    Set rs = cn.Execute("SELECT CONVERT(varchar(36), NEWID()) AS RunID")
    runID = CStr(rs.Fields(0).Value)
    rs.Close
    cn.Execute "INSERT excel.ImportRun(RunID, Status) VALUES('" & runID & "','RUNNING')"

    cn.Execute "SET XACT_ABORT ON;"
    cn.Execute "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;"

    cn.BeginTrans
    transacao = True

    etapa = "Preparacao do snapshot"
    PrepararSnapshot cn

    '1. COMPOSTOS
    For r = 3 To wsC.Cells(wsC.Rows.Count, "A").End(xlUp).Row

        If Len(Trim$(CStr(wsC.Cells(r, "A").Value2))) > 0 Then

            id = CLng(wsC.Cells(r, "A").Value2)
            etapa = "Compostos, linha " & r

            GravarRegistro cn, "#FonteCompostos", _
                Array("IDComposto", "Formula", "Nomenclatura", _
                      "Estrutura", "MassaMolar", "CodigoExplorador", _
                      "ImagemArquivo", "CatalogHash"), _
                Array(id, wsC.Cells(r, "B").Value2, _
                      wsC.Cells(r, "C").Value2, _
                      imagens(CStr(id)), _
                      NumeroSQL(wsC.Cells(r, "E").Value2), _
                      wsC.Cells(r, "F").Value2, wsC.Cells(r, "G").Value2, CATALOGO_HASH), _
                Array(3, 202, 202, 205, 131, 202, 202, 202)

            totalC = totalC + 1

        End If

    Next r

    '2. REFERÊNCIAS DE PH
    For r = 2 To wsR.Cells(wsR.Rows.Count, "A").End(xlUp).Row

        If Len(Trim$(CStr(wsR.Cells(r, "A").Value2))) > 0 Then

            etapa = "ReferênciaPH, linha " & r
            observacao = ""

            If IsError(wsR.Cells(r, "F").Value2) Then Err.Raise vbObjectError + 836, , "Erro de formula no PH teorico. Linha " & r
            If Not IsNumeric(wsR.Cells(r, "F").Value2) Then
                observacao = CStr(wsR.Cells(r, "F").Value2)
            End If

            GravarRegistro cn, "#FonteReferenciaPH", _
                Array("IDReferencia", "IDComposto", "Composto", _
                      "Concentracao", "Temperatura", "PH teorico", _
                      "Metodo", "Condicao", "SourceKind", "SourceReference", "Reviewed"), _
                Array(CLng(wsR.Cells(r, "A").Value2), _
                      IDValido(wsR.Cells(r, "B").Value2), _
                      wsR.Cells(r, "C").Value2, _
                      NumeroSQL(wsR.Cells(r, "D").Value2), _
                      NumeroSQL(wsR.Cells(r, "E").Value2), _
                      NumeroSQL(wsR.Cells(r, "F").Value2), _
                      wsR.Cells(r, "G").Value2, observacao, _
                      wsR.Cells(r, "H").Value2, wsR.Cells(r, "I").Value2, _
                      RevisadoValido(wsR.Cells(r, "J").Value2)), _
                Array(3, 3, 202, 131, 131, 131, 202, 202, 202, 202, 11)

            totalR = totalR + 1

        End If

    Next r

    '3. ANÁLISES
    For r = 3 To wsA.Cells(wsA.Rows.Count, "B").End(xlUp).Row

        If Len(Trim$(CStr(wsA.Cells(r, "B").Value2))) > 0 Then

            etapa = "Analises, linha " & r

            If Not IsDate(wsA.Cells(r, "A").Value) Then
                Err.Raise vbObjectError + 100, , "Data inválida."
            End If

            GravarRegistro cn, "#FonteAnalises", _
                Array("IDAnalise", "DataAnalise", "Lote", _
                      "IDComposto", "Nomenclatura", "IDReferencia", _
                      "Concentracao", "Temperatura", "PHMedido", _
                      "ReferenciaAplicavel", "PHTeorico", _
                      "DiferencaPH", "Status"), _
                Array(CLng(wsA.Cells(r, "B").Value2), _
                      CDate(wsA.Cells(r, "A").Value), _
                      CStr(wsA.Cells(r, "C").Value2), _
                      IDValido(wsA.Cells(r, "D").Value2), _
                      wsA.Cells(r, "E").Value2, _
                      IDValido(wsA.Cells(r, "F").Value2), _
                      NumeroSQL(wsA.Cells(r, "G").Value2), _
                      NumeroSQL(wsA.Cells(r, "H").Value2), _
                      NumeroSQL(wsA.Cells(r, "I").Value2), _
                      wsA.Cells(r, "J").Value2, _
                      NumeroSQL(wsA.Cells(r, "K").Value2), _
                      NumeroSQL(wsA.Cells(r, "L").Value2), _
                      wsA.Cells(r, "M").Value2), _
                Array(3, 133, 202, 3, 202, 3, 131, 131, 131, _
                      202, 131, 131, 202)

            totalA = totalA + 1

        End If

    Next r

    etapa = "Validacao e reconciliacao"
    cn.Execute "EXEC excel.ReconciliarImportacao @RunID='" & runID & "'"
    Set rs = cn.Execute("SELECT Inserted, Updated, Deactivated, Reconciled, Status FROM excel.ImportRun WHERE RunID='" & runID & "'")
    If rs.EOF Then Err.Raise vbObjectError + 830, , "Resultado da importacao ausente."
    If Not CBool(rs.Fields("Reconciled").Value) Or rs.Fields("Status").Value <> "SUCCESS" Then _
        Err.Raise vbObjectError + 831, , "Snapshot nao reconciliado."
    resumo = "Inseridos: " & rs.Fields("Inserted").Value & vbCrLf & _
             "Atualizados/reativados: " & rs.Fields("Updated").Value & vbCrLf & _
             "Inativados: " & rs.Fields("Deactivated").Value
    rs.Close
    cn.CommitTrans
    transacao = False
    cn.Close

    MsgBox "Importação concluída!" & vbCrLf & vbCrLf & _
           "Compostos: " & totalC & vbCrLf & _
           "Referências: " & totalR & vbCrLf & _
           "Análises: " & totalA & vbCrLf & resumo & vbCrLf & "Execucao: " & runID, vbInformation

    Exit Sub

Falha:
    mensagem = "Etapa: " & etapa & vbCrLf & _
               "Erro " & Err.Number & ": " & Err.Description

    erroDescricao = mensagem
    On Error Resume Next

    If Not cn Is Nothing Then
        If transacao Then cn.RollbackTrans
        If cn.State <> 0 Then
            If runID <> "" Then
                Set cmdLog = CreateObject("ADODB.Command")
                Set cmdLog.ActiveConnection = cn
                cmdLog.CommandType = 1
                cmdLog.CommandText = "UPDATE excel.ImportRun SET FinishedAt=SYSUTCDATETIME(), Status='FAILED', Rejected=NULL, ErrorMessage=? WHERE RunID='" & runID & "'"
                AdicionarParametro cmdLog, 202, Left$(erroDescricao, 2000), "ErrorMessage"
                cmdLog.Execute , , 128
            End If
            cn.Close
        End If
    End If

    On Error GoTo 0

    MsgBox mensagem & vbCrLf & vbCrLf & _
           "A importação não foi concluída.", vbExclamation

End Sub


Private Sub VerificarSchema(ByVal cn As Object)
    Dim rs As Object
    Set rs = cn.Execute("SELECT CASE WHEN OBJECT_ID('dbo.SchemaVersion') IS NULL THEN 0 ELSE 1 END")
    If rs.Fields(0).Value = 0 Then Err.Raise vbObjectError + 832, , "Execute sql/Modelagem_Dados_SQL.sql antes da macro."
    rs.Close
    Set rs = cn.Execute("SELECT MAX(Version) FROM dbo.SchemaVersion")
    If IsNull(rs.Fields(0).Value) Then Err.Raise vbObjectError + 833, , "Schema sem versao."
    If CLng(rs.Fields(0).Value) <> 3 Then Err.Raise vbObjectError + 834, , "Schema esperado: versao 3. Aplique migrations."
    rs.Close
End Sub

Private Sub PrepararSnapshot(ByVal cn As Object)
    cn.Execute "SELECT TOP (0) IDComposto, Formula, Nomenclatura, Estrutura, MassaMolar, CodigoExplorador, ImagemArquivo, CatalogHash INTO #FonteCompostos FROM excel.Compostos"
    cn.Execute "SELECT TOP (0) IDReferencia, IDComposto, Composto, Concentracao, Temperatura, [PH teorico], Metodo, Condicao, SourceKind, SourceReference, Reviewed INTO #FonteReferenciaPH FROM excel.ReferenciaPH"
    cn.Execute "SELECT TOP (0) IDAnalise, DataAnalise, Lote, IDComposto, Nomenclatura, IDReferencia, Concentracao, Temperatura, PHMedido, ReferenciaAplicavel, PHTeorico, DiferencaPH, Status INTO #FonteAnalises FROM excel.Analises"
End Sub

Private Sub GravarRegistro(ByVal cn As Object, _
                           ByVal tabela As String, _
                           ByVal campos As Variant, _
                           ByVal valores As Variant, _
                           ByVal tipos As Variant)

    Dim cmd As Object, rs As Object
    Dim sql As String, colunas As String, marcas As String
    Dim existe As Boolean
    Dim i As Long

    'O ID é validado como inteiro antes de entrar no SQL.
    Set rs = cn.Execute( _
        "SELECT [" & campos(0) & "] FROM " & tabela & _
        " WHERE [" & campos(0) & "]=" & _
        CStr(IDValido(valores(0))))

    existe = Not rs.EOF
    rs.Close

    Set cmd = CreateObject("ADODB.Command")
    Set cmd.ActiveConnection = cn
    cmd.CommandType = 1
    cmd.CommandTimeout = 60

    If existe Then

        sql = "UPDATE " & tabela & " SET "

        For i = 1 To UBound(campos)

            If i > 1 Then sql = sql & ","

            sql = sql & "[" & campos(i) & "]=?"
            AdicionarParametro cmd, CLng(tipos(i)), valores(i), CStr(campos(i))

        Next i

        sql = sql & " WHERE [" & campos(0) & "]=?"
        AdicionarParametro cmd, 3, valores(0)

    Else

        For i = 0 To UBound(campos)

            If i > 0 Then
                colunas = colunas & ","
                marcas = marcas & ","
            End If

            colunas = colunas & "[" & campos(i) & "]"
            marcas = marcas & "?"

            AdicionarParametro cmd, CLng(tipos(i)), valores(i), CStr(campos(i))

        Next i

        sql = "INSERT INTO " & tabela & _
              " (" & colunas & ") VALUES (" & marcas & ")"

    End If

    cmd.CommandText = sql
    cmd.Execute , , 128

End Sub


Private Sub AdicionarParametro(ByVal cmd As Object, _
                               ByVal tipo As Long, _
                               ByVal valor As Variant, _
                               Optional ByVal campo As String = "")

    Dim p As Object
    Dim tamanho As Long
    Dim nome As String

    nome = "p" & cmd.Parameters.Count

    Select Case tipo

        Case 202  'Texto Unicode
            If IsError(valor) Then
                Err.Raise vbObjectError + 101, , _
                          "Uma célula contém erro de fórmula."
            End If

            tamanho = Len(CStr(valor))
            If tamanho = 0 Then tamanho = 1

            Set p = cmd.CreateParameter( _
                nome, tipo, 1, tamanho, CStr(valor))

        Case 205  'Imagem em bytes
            tamanho = UBound(valor) - LBound(valor) + 1

            Set p = cmd.CreateParameter( _
                nome, tipo, 1, tamanho, valor)

        Case 131  'adNumeric: contrato DECIMAL do schema
            Set p = cmd.CreateParameter(nome, tipo, 1)
            Select Case campo
                Case "Concentracao": p.Precision = 18: p.NumericScale = 6
                Case "MassaMolar", "Temperatura": p.Precision = 10: p.NumericScale = 3
                Case Else: p.Precision = 8: p.NumericScale = 3
            End Select
            If IsNull(valor) Then
                p.Value = Null
            Else
                p.Value = CDec(valor)
            End If

        Case Else  'Inteiro, numero ou data
            Set p = cmd.CreateParameter(nome, tipo, 1)
            p.Value = valor

    End Select

    cmd.Parameters.Append p

End Sub


Private Function NumeroSQL(ByVal valor As Variant) As Variant

    Dim texto As String

    If IsError(valor) Then
        Err.Raise vbObjectError + 102, , _
                  "Uma célula numérica contém erro de fórmula."
    End If

    texto = Trim$(CStr(valor))

    If texto <> "" And IsNumeric(valor) Then
        NumeroSQL = CDec(valor)
        Exit Function
    End If

    texto = Replace(texto, """", "")
    texto = Trim$(texto)

    Select Case LCase$(texto)

        Case "", "condição precisa ser revista", _
                 "condição precisa ser definida"
            NumeroSQL = Null

        Case Else
            Err.Raise vbObjectError + 103, , _
                      "Valor numérico inválido: " & CStr(valor)

    End Select

End Function


Private Function IDValido(ByVal valor As Variant) As Long
    IDValido = IDPositivo(valor)
End Function

Private Sub ValidarIDs(ByVal ws As Worksheet, _
                       ByVal coluna As Long, _
                       ByVal primeiraLinha As Long)

    Dim vistos As Object
    Dim r As Long, id As Long

    Set vistos = CreateObject("Scripting.Dictionary")

    For r = primeiraLinha To UltimaLinhaDados(ws)

        If IsError(ws.Cells(r, coluna).Value2) Then
            Err.Raise vbObjectError + 105, , _
                      "Erro no ID: " & ws.Name & ", linha " & r
        End If

        If Len(Trim$(CStr(ws.Cells(r, coluna).Value2))) = 0 And Application.CountA(ws.Rows(r)) > 0 Then
            Err.Raise vbObjectError + 835, , "Linha com dados e sem ID: " & ws.Name & ", linha " & r
        End If
        If Len(Trim$(CStr(ws.Cells(r, coluna).Value2))) > 0 Then

            id = IDValido(ws.Cells(r, coluna).Value2)

            If vistos.Exists(CStr(id)) Then
                Err.Raise vbObjectError + 106, , _
                          "ID repetido em " & ws.Name & ": " & id
            End If

            vistos.Add CStr(id), True

        End If

    Next r

End Sub



Private Function RevisadoValido(ByVal valor As Variant) As Boolean
    If VarType(valor) = vbBoolean Then
        RevisadoValido = CBool(valor)
    ElseIf IsNumeric(valor) Then
        If CDbl(valor) <> 0 And CDbl(valor) <> 1 Then Err.Raise vbObjectError + 837, , "Reviewed deve ser 0 ou 1."
        RevisadoValido = (CDbl(valor) = 1)
    Else
        Err.Raise vbObjectError + 838, , "Reviewed deve ser booleano ou 0/1."
    End If
End Function
