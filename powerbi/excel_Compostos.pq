// Substituir os passos da consulta existente chamada exatamente "excel Compostos".
let
    Fonte = Sql.Database(ServidorSQL, BancoSQL),
    Ativos = Fonte{[Schema="excel",Item="CompostosAtivos"]}[Data],
    Tipos = Table.TransformColumnTypes(Ativos, {{"IDComposto",Int64.Type},{"CodigoExplorador",type text},{"Ativo",type logical},{"MassaMolar",type number}}),
    Imagens = Table.AddColumn(Tipos, "ImagemURL", each fxImagemURL([Estrutura]), type text)
in Imagens
