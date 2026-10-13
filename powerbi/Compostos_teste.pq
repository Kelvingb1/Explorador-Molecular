let
    Fonte = Sql.Database("localhost\SQLEXPRESS", "ExploradorMolecularTest"),
    excel_Compostos = Fonte{[Schema="excel",Item="CompostosAtivos"]}[Data],
    #"Personalização Adicionada" = Table.AddColumn(
        excel_Compostos,
        "ImagemURL",
        each if [Estrutura] = null then
            null
        else
            let
                Base64 = Binary.ToText([Estrutura], BinaryEncoding.Base64),
                Tipo = if Text.StartsWith(Base64, "iVBORw0KGgo")
                       then "image/png"
                       else "image/jpeg"
            in
                "data:" & Tipo & ";base64," & Base64
    ),
    #"Tipo Alterado" = Table.TransformColumnTypes(
        #"Personalização Adicionada",
        {
            {"ImagemURL", type text},
            {"CodigoExplorador", type text},
            {"Ativo", type logical}
        }
    ),
    #"Colunas Removidas" = Table.RemoveColumns(#"Tipo Alterado", {"Estrutura"})
in
    #"Colunas Removidas"
