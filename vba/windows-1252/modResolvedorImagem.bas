Attribute VB_Name = "modResolvedorImagem"
Option Explicit

' Unico caminho de imagem usado por Excel e SQL: coluna G + IMAGE_PATH.
Public Function ResolverImagemComposto(ByVal ws As Worksheet, ByVal linha As Long) As String
    Dim fso As Object, nome As String, extensao As String, caminho As String
    Set fso = CreateObject("Scripting.FileSystemObject")
    nome = Trim$(CStr(ws.Cells(linha, "G").Value2))
    If nome = "" Or nome <> fso.GetFileName(nome) Or InStr(nome, "..") > 0 Or InStr(nome, ":") > 0 Then _
        Err.Raise vbObjectError + 820, , "ImagemArquivo deve ser um nome simples, linha " & linha
    extensao = LCase$(fso.GetExtensionName(nome))
    If extensao <> "png" And extensao <> "jpg" And extensao <> "jpeg" Then _
        Err.Raise vbObjectError + 821, , "Formato de imagem invalido: " & nome
    caminho = fso.BuildPath(ConfigValor("IMAGE_PATH"), nome)
    If Not fso.FileExists(caminho) Then Err.Raise vbObjectError + 822, , "Imagem ausente: " & caminho
    If fso.GetFile(caminho).Size = 0 Then Err.Raise vbObjectError + 823, , "Imagem vazia: " & caminho
    ResolverImagemComposto = caminho
End Function

Public Function LerImagemComposto(ByVal caminho As String) As Variant
    Dim fluxo As Object, bytes As Variant, extensao As String
    Set fluxo = CreateObject("ADODB.Stream")
    fluxo.Type = 1
    fluxo.Open
    fluxo.LoadFromFile caminho
    bytes = fluxo.Read
    fluxo.Close
    extensao = LCase$(CreateObject("Scripting.FileSystemObject").GetExtensionName(caminho))
    If UBound(bytes) - LBound(bytes) + 1 < 8 Then GoTo Invalida
    If extensao = "png" Then
        If bytes(0) <> 137 Or bytes(1) <> 80 Or bytes(2) <> 78 Or bytes(3) <> 71 Or _
           bytes(4) <> 13 Or bytes(5) <> 10 Or bytes(6) <> 26 Or bytes(7) <> 10 Then GoTo Invalida
    Else
        If bytes(0) <> 255 Or bytes(1) <> 216 Or bytes(2) <> 255 Then GoTo Invalida
    End If
    LerImagemComposto = bytes
    Exit Function
Invalida:
    Err.Raise vbObjectError + 824, , "Assinatura PNG/JPEG invalida: " & caminho
End Function
