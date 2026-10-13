// Substituir os passos da consulta existente "excel Analises".
let
    Fonte = Sql.Database(ServidorSQL, BancoSQL),
    Ativos = Fonte{[Schema="excel",Item="AnalisesAtivas"]}[Data],
    Tipos = Table.TransformColumnTypes(Ativos, {{"IDAnalise",Int64.Type},{"IDComposto",Int64.Type},{"IDReferencia",Int64.Type},{"DataAnalise",type date},{"Ativo",type logical}})
in Tipos
