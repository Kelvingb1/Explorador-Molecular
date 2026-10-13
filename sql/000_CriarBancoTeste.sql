-- Banco de desenvolvimento usado nos exemplos. Não apaga banco existente.
USE [master];
GO
IF DB_ID(N'ExploradorMolecularTest') IS NULL
    EXEC(N'CREATE DATABASE [ExploradorMolecularTest]');
GO
USE [ExploradorMolecularTest];
GO
-- Execute agora migrations/001_initial.sql, 002_integrity.sql e 003_import_pipeline.sql.
