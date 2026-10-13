-- Execute APENAS em banco de teste vazio, depois das migrations.
-- sqlcmd -S SERVIDOR -d ExploradorMolecularTest -E -b -i TestarImportacao.sql
SET NOCOUNT ON;
SET XACT_ABORT ON;
IF DB_NAME() NOT LIKE '%Test%' THROW 52000, 'Use banco de teste cujo nome contenha Test.', 1;
IF EXISTS(SELECT 1 FROM excel.Compostos) OR EXISTS(SELECT 1 FROM excel.ReferenciaPH) OR EXISTS(SELECT 1 FROM excel.Analises)
    THROW 52001, 'Teste exige tabelas vazias.', 1;
BEGIN TRY
    BEGIN TRANSACTION;
    SELECT TOP (0) IDComposto, Formula, Nomenclatura, Estrutura, MassaMolar, CodigoExplorador, ImagemArquivo, CatalogHash INTO #FonteCompostos FROM excel.Compostos;
    SELECT TOP (0) IDReferencia, IDComposto, Composto, Concentracao, Temperatura, [PH teorico], Metodo, Condicao, SourceKind, SourceReference, Reviewed INTO #FonteReferenciaPH FROM excel.ReferenciaPH;
    SELECT TOP (0) IDAnalise, DataAnalise, Lote, IDComposto, Nomenclatura, IDReferencia, Concentracao, Temperatura, PHMedido, ReferenciaAplicavel, PHTeorico, DiferencaPH, Status INTO #FonteAnalises FROM excel.Analises;
    INSERT #FonteCompostos VALUES (1,N'HCl',N'Teste HCl',0x89504E470D0A1A0A,36.46,N'HCl',N'1.png',REPLICATE('a',64)),(2,N'NH3',N'Teste NH3',0x89504E470D0A1A0A,17.03,N'NH3',N'2.png',REPLICATE('a',64));
    INSERT #FonteReferenciaPH VALUES (1,1,N'Teste HCl',0.1,25,1,N'Modelo teste',NULL,N'CUSTOM_DIDACTIC',N'Fixture sintetico',0);
    INSERT #FonteAnalises VALUES (1,'2026-10-01',N'TESTE',1,N'Teste HCl',1,0.1,25,1,N'Sim',1,0,N'Igual ao teorico');
    DECLARE @Run UNIQUEIDENTIFIER=NEWID();
    INSERT excel.ImportRun(RunID,Status) VALUES(@Run,'RUNNING');
    EXEC excel.ReconciliarImportacao @Run;
    IF NOT EXISTS(SELECT 1 FROM excel.ImportRun WHERE RunID=@Run AND Inserted=4 AND Reconciled=1 AND Status='SUCCESS') THROW 52002,'Insercao nao reconciliada.',1;
    SET @Run=NEWID();INSERT excel.ImportRun(RunID,Status) VALUES(@Run,'RUNNING');
    EXEC excel.ReconciliarImportacao @Run;
    IF NOT EXISTS(SELECT 1 FROM excel.ImportRun WHERE RunID=@Run AND Inserted=0 AND Updated=0 AND Deactivated=0) THROW 52003,'Importacao identica nao e idempotente.',1;
    UPDATE #FonteAnalises SET PHMedido=1.1,DiferencaPH=0.1,Status=N'Acima do teorico';
    DELETE #FonteCompostos WHERE IDComposto=2;
    SET @Run=NEWID();INSERT excel.ImportRun(RunID,Status) VALUES(@Run,'RUNNING');
    EXEC excel.ReconciliarImportacao @Run;
    IF NOT EXISTS(SELECT 1 FROM excel.Compostos WHERE IDComposto=2 AND Ativo=0) THROW 52004,'Ausente nao inativado.',1;
    IF NOT EXISTS(SELECT 1 FROM excel.Analises WHERE IDAnalise=1 AND PHMedido=1.1) THROW 52005,'Alteracao nao reconciliada.',1;
    ROLLBACK;
    PRINT 'PASS: insercao, idempotencia, atualizacao e inativacao; banco revertido.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT>0 ROLLBACK;
    THROW;
END CATCH;
GO
-- FK negativa em nova transacao: fonte com analise vinculada a outro composto.
BEGIN TRANSACTION;
SELECT TOP (0) IDComposto, Formula, Nomenclatura, Estrutura, MassaMolar, CodigoExplorador, ImagemArquivo, CatalogHash INTO #FonteCompostos FROM excel.Compostos;
SELECT TOP (0) IDReferencia, IDComposto, Composto, Concentracao, Temperatura, [PH teorico], Metodo, Condicao, SourceKind, SourceReference, Reviewed INTO #FonteReferenciaPH FROM excel.ReferenciaPH;
SELECT TOP (0) IDAnalise, DataAnalise, Lote, IDComposto, Nomenclatura, IDReferencia, Concentracao, Temperatura, PHMedido, ReferenciaAplicavel, PHTeorico, DiferencaPH, Status INTO #FonteAnalises FROM excel.Analises;
INSERT #FonteCompostos VALUES(1,N'HCl',N'Teste HCl',0x89504E470D0A1A0A,36.46,N'HCl',N'1.png',REPLICATE('a',64));
INSERT #FonteReferenciaPH VALUES(1,1,N'Teste HCl',0.1,25,1,N'Modelo teste',NULL,N'CUSTOM_DIDACTIC',N'Fixture sintetico',0);
INSERT #FonteAnalises VALUES(1,'2026-10-01',N'TESTE',2,N'Composto errado',1,0.1,25,1,N'Sim',1,0,N'Igual');
DECLARE @RunErro UNIQUEIDENTIFIER=NEWID();
INSERT excel.ImportRun(RunID,Status) VALUES(@RunErro,'RUNNING');
BEGIN TRY
    EXEC excel.ReconciliarImportacao @RunErro;
    ROLLBACK;
    THROW 52006,'Falha de FK deveria ter sido rejeitada.',1;
END TRY
BEGIN CATCH
    DECLARE @Error INT=ERROR_NUMBER();
    IF @@TRANCOUNT>0 ROLLBACK;
    IF @Error<>51008 THROW;
    IF EXISTS(SELECT 1 FROM excel.Compostos) THROW 52007,'Rollback deixou dados.',1;
    PRINT 'PASS: fonte com FK invalida rejeitada sem persistir dados.';
END CATCH;
