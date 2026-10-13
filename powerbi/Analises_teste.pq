let
    Fonte = Sql.Database("localhost\SQLEXPRESS", "ExploradorMolecularTest"),
    excel_Analises = Fonte{[Schema="excel",Item="AnalisesAtivas"]}[Data]
in
    excel_Analises
