Attribute VB_Name = "modImagensCompostos"
Option Explicit

' Excel Windows. Importar no arquivo XLSM pelo menu Arquivo > Importar arquivo.
' Executar ImportarImagensCompostos com Alt+F8.
' Aba Compostos: A=IDComposto, B=Formula, C=Nomenclatura, D=Estrutura 2D.
' Escolher a pasta Solucoes ou a pasta com as imagens reduzidas.
' Nomes aceitos: nomenclatura, formula ou ID. Extensoes: PNG, JPG, JPEG.
' O desenho fica sobre a celula, incorporado ao arquivo (Shape).
' Ajustar a altura/largura NO EXCEL nao reduz os bytes do arquivo de imagem.
' Reexecutar usando a pasta reduzida para substituir as imagens desta macro.
' Nao apaga desenhos de outras macros. Nao altera nomes de colunas.

Public Sub ImportarImagensCompostos()
    Dim ws As Worksheet, fso As Object, pasta As Object, arquivo As Object
    Dim seletor As Object, arquivos As Collection, ids As Object
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

    Set seletor = Application.FileDialog(4) ' msoFileDialogFolderPicker
    With seletor
        .Title = "Selecione a pasta das imagens de solucoes"
        .AllowMultiSelect = False
        If .Show <> -1 Then Exit Sub
        pastaEscolhida = .SelectedItems(1)
    End With
    Set fso = CreateObject("Scripting.FileSystemObject")
    Set pasta = fso.GetFolder(pastaEscolhida)
    Set arquivos = New Collection
    For Each arquivo In pasta.Files
        Select Case LCase$(fso.GetExtensionName(arquivo.Name))
            Case "png", "jpg", "jpeg": arquivos.Add arquivo
        End Select
    Next arquivo

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
            caminho = ProcurarImagem(arquivos, fso, id, formula, nome, motivo)
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
        If Left$(anterior.AlternativeText, Len("CompostoID=" & id & "|")) <> "CompostoID=" & id & "|" Then
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

Private Function ProcurarImagem(ByVal arquivos As Collection, ByVal fso As Object, _
    ByVal id As String, ByVal formula As String, ByVal nome As String, _
    ByRef motivo As String) As String
    Dim arq As Object, base As String, encontrados As Long, resultado As String
    Dim chaveNome As String, chaveFormula As String
    chaveNome = Normalizar(nome)
    chaveFormula = Normalizar(formula)
    For Each arq In arquivos
        base = Normalizar(fso.GetBaseName(arq.Name))
        If base = chaveNome Or base = chaveFormula Or base = id Then
            encontrados = encontrados + 1
            resultado = arq.Path
        End If
    Next arq
    If encontrados = 1 Then
        ProcurarImagem = resultado
    ElseIf encontrados = 0 Then
        motivo = "Arquivo nao encontrado. Use o nome do composto, a formula ou o ID."
    Else
        motivo = "Mais de um arquivo corresponde. Deixe uma unica versao desse composto na pasta escolhida."
    End If
End Function

Private Function ValidarID(ByVal valor As Variant) As String
    Dim numero As Double
    If IsError(valor) Or IsEmpty(valor) Then Err.Raise vbObjectError + 717, , "IDComposto vazio ou com erro."
    If Not IsNumeric(valor) Then Err.Raise vbObjectError + 718, , "IDComposto deve ser inteiro positivo."
    numero = CDbl(valor)
    If numero < 1 Or numero > 2147483647# Or numero <> Fix(numero) Then
        Err.Raise vbObjectError + 719, , "IDComposto invalido: " & CStr(valor)
    End If
    ValidarID = CStr(CLng(numero))
End Function

Private Function Normalizar(ByVal valor As Variant) As String
    Dim t As String, i As Long, caractere As String, resultado As String
    If IsError(valor) Then Exit Function
    t = LCase$(Trim$(CStr(valor)))
    For i = 224 To 229: t = Replace(t, ChrW(i), "a"): Next i
    For i = 232 To 235: t = Replace(t, ChrW(i), "e"): Next i
    For i = 236 To 239: t = Replace(t, ChrW(i), "i"): Next i
    For i = 242 To 246: t = Replace(t, ChrW(i), "o"): Next i
    For i = 249 To 252: t = Replace(t, ChrW(i), "u"): Next i
    t = Replace(t, ChrW(231), "c")
    For i = 1 To Len(t)
        caractere = Mid$(t, i, 1)
        If caractere Like "[a-z0-9]" Then resultado = resultado & caractere
    Next i
    ' Alias para as grafias encontradas no arquivo do usuario.
    If resultado = "acidocloridico" Then resultado = "acidocloridrico"
    If resultado = "hcio" Then resultado = "hclo"
    Normalizar = resultado
End Function
