// Consulta de funcao; nao habilitar carga.
(bytes as nullable binary) as nullable text =>
    if bytes = null then null
    else
        let
            prefixo = Binary.ToList(Binary.Range(bytes, 0, List.Min({8, Binary.Length(bytes)}))),
            png = List.FirstN(prefixo, 8) = {137,80,78,71,13,10,26,10},
            jpeg = List.FirstN(prefixo, 3) = {255,216,255},
            mime = if png then "image/png" else if jpeg then "image/jpeg" else error "Imagem deve ser PNG ou JPEG.",
            texto = "data:" & mime & ";base64," & Binary.ToText(bytes, BinaryEncoding.Base64)
        in texto
