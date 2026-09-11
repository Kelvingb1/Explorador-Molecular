Attribute VB_Name = "modImportacaoSQL"
Option Explicit

Public Sub ImportarLaboratorioSQL()

    Const SERVIDOR As String = "localhost\SQLEXPRESS"
    Const BANCO As String = "Laboratório"
    Const pasta As String = _
        "C:\Users\kelvin\OneDrive\Imagens\Soluções_Reduzidas\"

    Dim cn As Object
    Dim imagens As Object
    Dim wsC As Worksheet, wsR As Worksheet, wsA As Worksheet
    Dim r As Long, id As Long
    Dim transacao As Boolean
    Dim etapa As String, mensagem As String
    Dim observacao As String
    Dim totalC As Long, totalR As Long, totalA As Long

    On Error GoTo Falha

    Set wsC = ThisWorkbook.Worksheets("Compostos")
    Set wsR = ThisWorkbook.Worksheets("ReferênciaPH")
    Set wsA = ThisWorkbook.Worksheets("Analises")

    etapa = "Conferência dos IDs"

    ValidarIDs wsC, 1, 3
    ValidarIDs wsR, 1, 2
    ValidarIDs wsA, 2, 3

    Application.CalculateFull

    'Carrega todas as imagens antes de iniciar a importação.
    Set imagens = CreateObject("Scripting.Dictionary")

    For r = 3 To wsC.Cells(wsC.Rows.Count, "A").End(xlUp).Row

        If Len(Trim$(CStr(wsC.Cells(r, "A").Value2))) > 0 Then

            id = CLng(wsC.Cells(r, "A").Value2)
            etapa = "Imagem do composto ID " & id

            imagens.Add CStr(id), LerImagem( _
                LocalizarImagem(pasta, id, _
                CStr(wsC.Cells(r, "C").Value2)))

        End If

    Next r

    etapa = "Conexão com o SQL Server"

    Set cn = CreateObject("ADODB.Connection")

    cn.ConnectionTimeout = 15
    cn.CommandTimeout = 60

    cn.Open "Provider=SQLOLEDB;" & _
            "Data Source=" & SERVIDOR & ";" & _
            "Initial Catalog=" & BANCO & ";" & _
            "Integrated Security=SSPI;"

    cn.Execute "SET XACT_ABORT ON;"
    cn.Execute "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;"

    cn.BeginTrans
    transacao = True

    etapa = "Criação das tabelas"
    PrepararTabelas cn

    '1. COMPOSTOS
    For r = 3 To wsC.Cells(wsC.Rows.Count, "A").End(xlUp).Row

        If Len(Trim$(CStr(wsC.Cells(r, "A").Value2))) > 0 Then

            id = CLng(wsC.Cells(r, "A").Value2)
            etapa = "Compostos, linha " & r

            GravarRegistro cn, "[excel].[Compostos]", _
                Array("IDComposto", "Formula", "Nomenclatura", _
                      "Estrutura", "MassaMolar"), _
                Array(id, wsC.Cells(r, "B").Value2, _
                      wsC.Cells(r, "C").Value2, _
                      imagens(CStr(id)), _
                      NumeroSQL(wsC.Cells(r, "E").Value2)), _
                Array(3, 202, 202, 205, 5)

            totalC = totalC + 1

        End If

    Next r

    '2. REFERÊNCIAS DE PH
    For r = 2 To wsR.Cells(wsR.Rows.Count, "A").End(xlUp).Row

        If Len(Trim$(CStr(wsR.Cells(r, "A").Value2))) > 0 Then

            etapa = "ReferênciaPH, linha " & r
            observacao = ""

            If Not IsNumeric(wsR.Cells(r, "F").Value2) Then
                observacao = CStr(wsR.Cells(r, "F").Value2)
            End If

            GravarRegistro cn, "[excel].[ReferenciaPH]", _
                Array("IDReferencia", "IDComposto", "Composto", _
                      "Concentracao", "Temperatura", "PH teorico", _
                      "Metodo", "Condicao"), _
                Array(CLng(wsR.Cells(r, "A").Value2), _
                      IDValido(wsR.Cells(r, "B").Value2), _
                      wsR.Cells(r, "C").Value2, _
                      NumeroSQL(wsR.Cells(r, "D").Value2), _
                      NumeroSQL(wsR.Cells(r, "E").Value2), _
                      NumeroSQL(wsR.Cells(r, "F").Value2), _
                      wsR.Cells(r, "G").Value2, observacao), _
                Array(3, 3, 202, 5, 5, 5, 202, 202)

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

            GravarRegistro cn, "[excel].[Analises]", _
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
                Array(3, 133, 202, 3, 202, 3, 5, 5, 5, _
                      202, 5, 5, 202)

            totalA = totalA + 1

        End If

    Next r

    cn.CommitTrans
    transacao = False
    cn.Close

    MsgBox "Importação concluída!" & vbCrLf & vbCrLf & _
           "Compostos: " & totalC & vbCrLf & _
           "Referências: " & totalR & vbCrLf & _
           "Análises: " & totalA, vbInformation

    Exit Sub

Falha:
    mensagem = "Etapa: " & etapa & vbCrLf & _
               "Erro " & Err.Number & ": " & Err.Description

    On Error Resume Next

    If Not cn Is Nothing Then
        If transacao Then cn.RollbackTrans
        If cn.State <> 0 Then cn.Close
    End If

    On Error GoTo 0

    MsgBox mensagem & vbCrLf & vbCrLf & _
           "A importação não foi concluída.", vbExclamation

End Sub


Private Sub PrepararTabelas(ByVal cn As Object)

    cn.Execute _
        "IF SCHEMA_ID(N'excel') IS NULL " & _
        "EXEC(N'CREATE SCHEMA excel');"

    cn.Execute _
        "IF OBJECT_ID(N'excel.Compostos', N'U') IS NULL " & _
        "CREATE TABLE [excel].[Compostos] (" & _
        "[IDComposto] int NOT NULL PRIMARY KEY," & _
        "[Formula] nvarchar(30) NOT NULL," & _
        "[Nomenclatura] nvarchar(100) NOT NULL," & _
        "[Estrutura] varbinary(max) NOT NULL," & _
        "[MassaMolar] decimal(10,3) NULL);"

    cn.Execute _
        "IF OBJECT_ID(N'excel.ReferenciaPH', N'U') IS NULL " & _
        "CREATE TABLE [excel].[ReferenciaPH] (" & _
        "[IDReferencia] int NOT NULL PRIMARY KEY," & _
        "[IDComposto] int NOT NULL," & _
        "[Composto] nvarchar(100) NOT NULL," & _
        "[Concentracao] decimal(18,6) NULL," & _
        "[Temperatura] decimal(10,3) NULL," & _
        "[PH teorico] decimal(8,3) NULL," & _
        "[Metodo] nvarchar(200) NULL," & _
        "[Condicao] nvarchar(200) NULL," & _
        "UNIQUE ([IDReferencia], [IDComposto])," & _
        "FOREIGN KEY ([IDComposto]) " & _
        "REFERENCES [excel].[Compostos]([IDComposto]));"

    cn.Execute _
        "IF OBJECT_ID(N'excel.Analises', N'U') IS NULL " & _
        "CREATE TABLE [excel].[Analises] (" & _
        "[IDAnalise] int NOT NULL PRIMARY KEY," & _
        "[DataAnalise] date NOT NULL," & _
        "[Lote] nvarchar(30) NULL," & _
        "[IDComposto] int NOT NULL," & _
        "[Nomenclatura] nvarchar(100) NULL," & _
        "[IDReferencia] int NOT NULL," & _
        "[Concentracao] decimal(18,6) NULL," & _
        "[Temperatura] decimal(10,3) NULL," & _
        "[PHMedido] decimal(8,3) NULL," & _
        "[ReferenciaAplicavel] nvarchar(100) NULL," & _
        "[PHTeorico] decimal(8,3) NULL," & _
        "[DiferencaPH] decimal(8,3) NULL," & _
        "[Status] nvarchar(100) NULL," & _
        "FOREIGN KEY ([IDReferencia], [IDComposto]) " & _
        "REFERENCES [excel].[ReferenciaPH]" & _
        "([IDReferencia], [IDComposto]));"

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
            AdicionarParametro cmd, CLng(tipos(i)), valores(i)

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

            AdicionarParametro cmd, CLng(tipos(i)), valores(i)

        Next i

        sql = "INSERT INTO " & tabela & _
              " (" & colunas & ") VALUES (" & marcas & ")"

    End If

    cmd.CommandText = sql
    cmd.Execute , , 128

End Sub


Private Sub AdicionarParametro(ByVal cmd As Object, _
                               ByVal tipo As Long, _
                               ByVal valor As Variant)

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

        Case Else  'Inteiro, número ou data
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
        NumeroSQL = CDbl(valor)
        Exit Function
    End If

    texto = Replace(texto, """", "")
    texto = Trim$(Replace(texto, "-", ""))

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

    If IsError(valor) Then GoTo Invalido
    If Not IsNumeric(valor) Then GoTo Invalido
    If CDbl(valor) < 1 Then GoTo Invalido
    If CDbl(valor) > 2147483647# Then GoTo Invalido
    If CDbl(valor) <> Fix(CDbl(valor)) Then GoTo Invalido

    IDValido = CLng(valor)
    Exit Function

Invalido:
    Err.Raise vbObjectError + 104, , _
              "O ID deve ser um número inteiro positivo."

End Function


Private Sub ValidarIDs(ByVal ws As Worksheet, _
                       ByVal coluna As Long, _
                       ByVal primeiraLinha As Long)

    Dim vistos As Object
    Dim r As Long, id As Long

    Set vistos = CreateObject("Scripting.Dictionary")

    For r = primeiraLinha To _
        ws.Cells(ws.Rows.Count, coluna).End(xlUp).Row

        If IsError(ws.Cells(r, coluna).Value2) Then
            Err.Raise vbObjectError + 105, , _
                      "Erro no ID: " & ws.Name & ", linha " & r
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


Private Function LocalizarImagem(ByVal pasta As String, _
                                 ByVal id As Long, _
                                 ByVal nomenclatura As String) As String

    Dim caminho As String
    Dim extensao As Variant
    Dim nomes As Variant, nome As Variant
    Dim escolha As Variant

    Select Case id

        Case 4
            nomes = Array("Acido_Nitrico")

        Case 6
            nomes = Array("Hidroxido_de_Amonio")

        Case 1
            nomes = Array(nomenclatura, "Ácido Clorídico")

        Case 2
            nomes = Array(nomenclatura, _
                          "Ácido Sulfurico", "Ácido Súlfurico")

        Case Else
            nomes = Array(nomenclatura)

    End Select

    For Each nome In nomes

        For Each extensao In Array(".jpg", ".jpeg", ".png")

            caminho = pasta & CStr(nome) & CStr(extensao)

            If Dir(caminho) <> "" Then
                LocalizarImagem = caminho
                Exit Function
            End If

        Next extensao

    Next nome

    'Se o nome do arquivo for diferente, permite selecioná-lo.
    escolha = Application.GetOpenFilename( _
        FileFilter:="Imagens (*.jpg;*.jpeg;*.png),*.jpg;*.jpeg;*.png", _
        Title:="Selecione a imagem reduzida: " & nomenclatura)

    If VarType(escolha) = vbBoolean Then
        Err.Raise vbObjectError + 107, , _
                  "Seleção da imagem cancelada: " & nomenclatura
    End If

    LocalizarImagem = CStr(escolha)

End Function


Private Function LerImagem(ByVal caminho As String) As Variant

    Dim fluxo As Object

    Set fluxo = CreateObject("ADODB.Stream")

    fluxo.Type = 1
    fluxo.Open
    fluxo.LoadFromFile caminho

    If fluxo.Size = 0 Then
        fluxo.Close
        Err.Raise vbObjectError + 108, , _
                  "Arquivo de imagem vazio: " & caminho
    End If

    LerImagem = fluxo.Read
    fluxo.Close

End Function
    


