SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE Version=1)
    THROW 51000, 'Execute 001_initial.sql antes.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE Version=2)
BEGIN
    ALTER TABLE excel.Compostos ADD
        CodigoExplorador NVARCHAR(30) COLLATE Latin1_General_100_BIN2 NULL,
        ImagemArquivo NVARCHAR(255) NULL,
        CatalogHash CHAR(64) NULL,
        Ativo BIT NOT NULL CONSTRAINT DF_Compostos_Ativo DEFAULT 1;
    ALTER TABLE excel.ReferenciaPH ADD
        Ativo BIT NOT NULL CONSTRAINT DF_ReferenciaPH_Ativo DEFAULT 1,
        SourceKind NVARCHAR(30) NULL,
        SourceReference NVARCHAR(2000) NULL,
        Reviewed BIT NOT NULL CONSTRAINT DF_ReferenciaPH_Reviewed DEFAULT 0;
    ALTER TABLE excel.Analises ADD Ativo BIT NOT NULL CONSTRAINT DF_Analises_Ativo DEFAULT 1;
    CREATE TABLE excel.ImportRun (
        RunID UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        StartedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        FinishedAt DATETIME2 NULL,
        SourceHash VARBINARY(32) NULL,
        CatalogHash CHAR(64) NULL,
        Inserted INT NOT NULL DEFAULT 0,
        Updated INT NOT NULL DEFAULT 0,
        Deactivated INT NOT NULL DEFAULT 0,
        Rejected INT NULL,
        Reconciled BIT NOT NULL DEFAULT 0,
        Status VARCHAR(20) NOT NULL,
        ErrorMessage NVARCHAR(2000) NULL
    );
    INSERT dbo.SchemaVersion(Version) VALUES(2);
END;
COMMIT;
GO
-- Após ALTER, execute este lote separado para compilação das novas colunas.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id=OBJECT_ID('excel.Compostos') AND name='UX_Compostos_Codigo')
    CREATE UNIQUE INDEX UX_Compostos_Codigo ON excel.Compostos(CodigoExplorador) WHERE CodigoExplorador IS NOT NULL;
