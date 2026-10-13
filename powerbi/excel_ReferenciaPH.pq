// Preservar o nome da tabela "excel ReferenciaPH"; conferir o nome existente no modelo.
let
    Fonte = Sql.Database(ServidorSQL, BancoSQL),
    Ativos = Fonte{[Schema="excel",Item="ReferenciaPHAtivas"]}[Data],
    Tipos = Table.TransformColumnTypes(Ativos, {{"IDReferencia",Int64.Type},{"IDComposto",Int64.Type},{"Ativo",type logical},{"Reviewed",type logical}})
in Tipos
