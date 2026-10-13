-- Diagnostico somente leitura; nao apaga dbo.Analises.
SELECT OBJECT_SCHEMA_NAME(referencing_id) AS Esquema, OBJECT_NAME(referencing_id) AS Objeto
FROM sys.sql_expression_dependencies WHERE referenced_id=OBJECT_ID(N'dbo.Analises');
SELECT OBJECT_SCHEMA_NAME(object_id) AS Esquema, OBJECT_NAME(object_id) AS Objeto, definition
FROM sys.sql_modules WHERE definition LIKE '%dbo.Analises%';
-- Esses resultados nao cobrem SQL dinamico nem clientes externos.
-- Confira PBIX, consultas Excel, jobs no msdb e aplicacoes antes de qualquer remocao.
