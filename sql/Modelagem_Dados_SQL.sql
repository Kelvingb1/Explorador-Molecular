-- Entrada para sqlcmd (ou habilite "Modo SQLCMD" no SSMS).
-- Execute na pasta sql: sqlcmd -S SERVIDOR -d BANCO -E -b -i Modelagem_Dados_SQL.sql
-- Banco selecionado pelo operador; nenhum nome de banco fixo.
:r migrations/001_initial.sql
:r migrations/002_integrity.sql
:r migrations/003_import_pipeline.sql
