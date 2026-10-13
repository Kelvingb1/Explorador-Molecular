let
    Fonte = Sql.Database("localhost\SQLEXPRESS", "ExploradorMolecularTest"),
    excel_ReferenciaPH = Fonte{[Schema="excel",Item="ReferenciaPHAtivas"]}[Data]
in
    excel_ReferenciaPH
