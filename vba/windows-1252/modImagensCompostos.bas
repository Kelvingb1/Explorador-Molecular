Attribute VB_Name = "modImagensCompostos"
Option Explicit

' Excel Windows. Importar no arquivo XLSM pelo menu Arquivo > Importar arquivo.
' Executar ImportarImagensCompostos com Alt+F8.
' Aba Compostos: A=IDComposto, B=Formula, C=Nomenclatura, D=Estrutura 2D.
' IMAGE_PATH na aba Config e ImagemArquivo na coluna G.
' Arquivo exato do catalogo; nao ha aliases nem escolha manual.
' O desenho fica sobre a celula, incorporado ao arquivo (Shape).
' Ajustar a altura/largura NO EXCEL nao reduz os bytes do arquivo de imagem.
' Reexecutar usando a pasta reduzida para substituir as imagens desta macro.
' Nao apaga desenhos de outras macros. Nao altera nomes de colunas.

Public Sub ImportarImagensCompostos()
    Dim ws As Worksheet, fso As Object
    Dim ids As Object, bytesImagem As Variant
    Dim ultima As Long, linha As Long, id As String, nome As String
    Dim formula As String, caminho As String, motivo As String
    Dim inseridas As Long, pendentes As Long, grandes As Long
    Dim bytesTotal As Double, detalhes As String, pastaEscolhida As String
    Dim telaAnterior As Boolean, eventosAnteriores As Boolean

    telaAnterior = Application.ScreenUpdating
    eventosAnteriores = Application.EnableEvents
    On Error GoTo FalhaGeral
    Set ws = ThisWorkbook.Worksheets("Compostos")

    If Normalizar(ws.Range("A2").Value2) <> "idcomposto" Or _
       Normalizar(ws.Range("B2").Value2) <> "formula" Or _
       Normalizar(ws.Range("C2").Value2) <> "nomenclatura" Or _
       Normalizar(ws.Range("D2").Value2) <> "estrutura2d" Then
        Err.Raise vbObjectError + 710, , "Cabecalhos diferentes do arquivo revisado. Confira A2:D2 em Compostos."
    End If
    If ws.ProtectContents Or ws.ProtectDrawingObjects Then
        Err.Raise vbObjectError + 711, , "A aba Compostos esta protegida. Desproteja-a antes de inserir imagens."
    End If

    ultima = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    Set ids = CreateObject("Scripting.Dictionary")
    For linha = 3 To ultima
        If Len(Trim$(CStr(ws.Cells(linha, "A").Value2))) > 0 Then
            id = ValidarID(ws.Cells(linha, "A").Value2)
            If ids.Exists(id) Then Err.Raise vbObjectError + 712, , "IDComposto repetido: " & id
            ids.Add id, True
        End If
    Next linha
    If ids.Count = 0 Then Err.Raise vbObjectError + 713, , "Nao ha compostos cadastrados."

    ValidarCatalogoPlanilha ws
    pastaEscolhida = ConfigValor("IMAGE_PATH")
    Set fso = CreateObject("Scripting.FileSystemObject")

    Application.ScreenUpdating = False
    Application.EnableEvents = False
    ws.Columns("D").ColumnWidth = 24
    Debug.Print "IMAGENS COMPOSTOS - " & Now & " - " & pastaEscolhida

    For linha = 3 To ultima
        If Len(Trim$(CStr(ws.Cells(linha, "A").Value2))) > 0 Then
            id = ValidarID(ws.Cells(linha, "A").Value2)
            formula = CStr(ws.Cells(linha, "B").Value2)
            nome = CStr(ws.Cells(linha, "C").Value2)
            motivo = ""
            caminho = ResolverImagemComposto(ws, linha)
            bytesImagem = LerImagemComposto(caminho)
            If Len(caminho) > 0 Then
                If InserirImagem(ws, linha, id, nome, caminho, motivo) Then
                    inseridas = inseridas + 1
                    bytesTotal = bytesTotal + CDbl(fso.GetFile(caminho).Size)
                    If CDbl(fso.GetFile(caminho).Size) > 20# * 1024# Then grandes = grandes + 1
                    Debug.Print "OK | ID " & id & " | " & caminho
                Else
                    pendentes = pendentes + 1
                End If
            Else
                pendentes = pendentes + 1
            End If
            If Len(motivo) > 0 Then
                Debug.Print "PENDENTE | ID " & id & " | " & nome & " | " & motivo
                detalhes = detalhes & vbCrLf & "ID " & id & ": " & motivo
            End If
        End If
    Next linha

    Application.EnableEvents = eventosAnteriores
    Application.ScreenUpdating = telaAnterior
    MsgBox "Imagens inseridas/atualizadas: " & inseridas & vbCrLf & _
           "Pendentes: " & pendentes & vbCrLf & _
           "Total dos arquivos usados: " & Format$(bytesTotal / 1024#, "0.0") & " KiB" & vbCrLf & _
           "Acima de 20 KiB: " & grandes & vbCrLf & _
           "Salve o XLSM com Ctrl+S. Antes do SQL, usaremos copias reduzidas." & _
           IIf(pendentes > 0, vbCrLf & "Detalhes completos: Alt+F11, Ctrl+G." & Left$(detalhes, 400), ""), vbInformation
    Exit Sub

FalhaGeral:
    motivo = Err.Description
    Application.EnableEvents = eventosAnteriores
    Application.ScreenUpdating = telaAnterior
    MsgBox "Importacao interrompida: " & motivo, vbExclamation
End Sub

Private Function InserirImagem(ByVal ws As Worksheet, ByVal linha As Long, _
    ByVal id As String, ByVal nome As String, ByVal caminho As String, _
    ByRef motivo As String) As Boolean
    Dim celula As Range, nova As Shape, anterior As Shape
    Dim nomeShape As String, fator As Double, fatorAltura As Double
    Dim alturaAnterior As Double
    On Error GoTo Falha
    Set celula = ws.Cells(linha, "D")
    If celula.MergeCells Then Err.Raise vbObjectError + 714, , "Celula D mesclada. Desmescle antes de importar."
    If ws.Rows(linha).Hidden Then Err.Raise vbObjectError + 715, , "Linha oculta ou filtrada. Exiba a linha e execute novamente."
    nomeShape = "imgCmp_" & id
    On Error Resume Next
    Set anterior = ws.Shapes(nomeShape)
    On Error GoTo Falha
    If Not anterior Is Nothing Then
        If Left$(anterior.AlternativeText, Len("CompostoID=" & id & "|")) <> "CompostoID=" & id & "|" And _
           Left$(anterior.AlternativeText, Len("IDComposto=" & id & "|")) <> "IDComposto=" & id & "|" Then
            Err.Raise vbObjectError + 716, , "Ja existe um desenho de outra origem com o nome " & nomeShape
        End If
    End If

    alturaAnterior = ws.Rows(linha).RowHeight
    ws.Rows(linha).RowHeight = 110
    Set nova = ws.Shapes.AddPicture(Filename:=caminho, LinkToFile:=msoFalse, _
        SaveWithDocument:=msoTrue, Left:=celula.Left, Top:=celula.Top, Width:=-1, Height:=-1)
    With nova
        .LockAspectRatio = msoTrue
        fator = (celula.Width - 8) / .Width
        fatorAltura = (celula.Height - 8) / .Height
        If fatorAltura < fator Then fator = fatorAltura
        .Width = .Width * fator
        .Left = celula.Left + (celula.Width - .Width) / 2
        .Top = celula.Top + (celula.Height - .Height) / 2
        .Placement = xlMoveAndSize
        .AlternativeText = "CompostoID=" & id & "|" & nome & "|Arquivo=" & caminho
    End With
    If Not anterior Is Nothing Then anterior.Delete
    nova.Name = nomeShape
    InserirImagem = True
    Exit Function
Falha:
    motivo = Err.Description
    On Error Resume Next
    If Not nova Is Nothing Then nova.Delete
    If alturaAnterior > 0 Then ws.Rows(linha).RowHeight = alturaAnterior
    On Error GoTo 0
End Function

Private Function ValidarID(ByVal valor As Variant) As String
    ValidarID = CStr(IDPositivo(valor))
End Function

Private Function Normalizar(ByVal valor As Variant) As String
    Normalizar = NormalizarNome(valor)
End Function
