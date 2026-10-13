SET XACT_ABORT ON;
IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE Version=2)
    THROW 51000, 'Execute 002_integrity.sql antes.', 1;
GO
CREATE OR ALTER PROCEDURE excel.ReconciliarImportacao @RunID UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF @@TRANCOUNT=0 THROW 51001, 'Reconciliacao exige transacao externa.', 1;
    IF NOT EXISTS (SELECT 1 FROM excel.ImportRun WHERE RunID=@RunID AND Status='RUNNING')
        THROW 51002, 'ImportRun ausente ou finalizado.', 1;
    -- Um unico importador por vez. Lock liberado no commit/rollback.
    DECLARE @LockResult INT;
    EXEC @LockResult=sys.sp_getapplock @Resource='ExploradorMolecular.Import', @LockMode='Exclusive', @LockOwner='Transaction', @LockTimeout=15000;
    IF @LockResult<0 THROW 51003, 'Outra importacao esta em andamento.', 1;
    IF NOT EXISTS (SELECT 1 FROM #FonteCompostos) THROW 51004, 'Snapshot de compostos vazio.', 1;
    IF EXISTS (SELECT IDComposto FROM #FonteCompostos GROUP BY IDComposto HAVING COUNT(*)>1)
       OR EXISTS (SELECT CodigoExplorador FROM #FonteCompostos GROUP BY CodigoExplorador HAVING COUNT(*)>1)
       OR EXISTS (SELECT IDReferencia FROM #FonteReferenciaPH GROUP BY IDReferencia HAVING COUNT(*)>1)
       OR EXISTS (SELECT IDAnalise FROM #FonteAnalises GROUP BY IDAnalise HAVING COUNT(*)>1)
        THROW 51005, 'IDs ou codigos duplicados.', 1;
    IF EXISTS (SELECT 1 FROM #FonteCompostos WHERE CodigoExplorador IS NULL OR LEN(CodigoExplorador)=0 OR DATALENGTH(Estrutura)=0 OR MassaMolar IS NULL OR MassaMolar<=0 OR ImagemArquivo IS NULL OR LEN(ImagemArquivo)=0 OR CatalogHash IS NULL OR LEN(CatalogHash)<>64)
        THROW 51006, 'Cadastro ou imagem incompletos.', 1;
    IF EXISTS (SELECT 1 FROM #FonteReferenciaPH r LEFT JOIN #FonteCompostos c ON c.IDComposto=r.IDComposto WHERE c.IDComposto IS NULL)
        THROW 51007, 'Referencia sem composto na fonte.', 1;
    IF EXISTS (SELECT 1 FROM #FonteAnalises a LEFT JOIN #FonteReferenciaPH r ON r.IDReferencia=a.IDReferencia AND r.IDComposto=a.IDComposto WHERE r.IDReferencia IS NULL)
        THROW 51008, 'Analise sem referencia do mesmo composto.', 1;
    IF EXISTS (SELECT 1 FROM #FonteReferenciaPH WHERE SourceKind NOT IN ('MANUAL','CUSTOM_DIDACTIC','EXPERIMENTAL','PUBCHEM') OR SourceKind IS NULL OR SourceReference IS NULL OR LEN(SourceReference)=0)
        THROW 51012, 'Proveniencia da referencia ausente.', 1;
    IF (SELECT COUNT(DISTINCT CatalogHash) FROM #FonteCompostos)<>1
        THROW 51013, 'Snapshot mistura versoes do catalogo.', 1;
    IF EXISTS (SELECT 1 FROM #FonteCompostos s JOIN excel.Compostos t ON t.IDComposto=s.IDComposto WHERE t.CodigoExplorador IS NOT NULL AND t.CodigoExplorador<>s.CodigoExplorador)
        THROW 51014, 'Nao reutilize IDComposto para outro codigo.', 1;
    -- IDs historicos de referencia nao podem ser reutilizados para outro composto.
    IF EXISTS (SELECT 1 FROM #FonteReferenciaPH s JOIN excel.ReferenciaPH t ON t.IDReferencia=s.IDReferencia WHERE t.IDComposto<>s.IDComposto)
        THROW 51009, 'Nao reutilize IDReferencia para outro composto.', 1;
    DECLARE @Inserted INT=0, @Updated INT=0, @Deactivated INT=0;
    -- Compostos: atualizar somente linhas cujo conteudo ou estado mudou.
    UPDATE t SET [Formula]=s.[Formula], [Nomenclatura]=s.[Nomenclatura], [Estrutura]=s.[Estrutura], [MassaMolar]=s.[MassaMolar], [CodigoExplorador]=s.[CodigoExplorador], [ImagemArquivo]=s.[ImagemArquivo], [CatalogHash]=s.[CatalogHash], Ativo=1
    FROM excel.Compostos t JOIN #FonteCompostos s ON t.[IDComposto]=s.[IDComposto]
    WHERE t.Ativo=0 OR EXISTS (SELECT s.[IDComposto], s.[Formula], s.[Nomenclatura], s.[Estrutura], s.[MassaMolar], s.[CodigoExplorador], s.[ImagemArquivo], s.[CatalogHash] EXCEPT SELECT t.[IDComposto], t.[Formula], t.[Nomenclatura], t.[Estrutura], t.[MassaMolar], t.[CodigoExplorador], t.[ImagemArquivo], t.[CatalogHash]);
    SET @Updated=@Updated+@@ROWCOUNT;
    INSERT excel.Compostos ([IDComposto], [Formula], [Nomenclatura], [Estrutura], [MassaMolar], [CodigoExplorador], [ImagemArquivo], [CatalogHash], Ativo)
    SELECT s.[IDComposto], s.[Formula], s.[Nomenclatura], s.[Estrutura], s.[MassaMolar], s.[CodigoExplorador], s.[ImagemArquivo], s.[CatalogHash], 1 FROM #FonteCompostos s
    WHERE NOT EXISTS (SELECT 1 FROM excel.Compostos t WHERE t.[IDComposto]=s.[IDComposto]);
    SET @Inserted=@Inserted+@@ROWCOUNT;
    -- ReferenciaPH: atualizar somente linhas cujo conteudo ou estado mudou.
    UPDATE t SET [IDComposto]=s.[IDComposto], [Composto]=s.[Composto], [Concentracao]=s.[Concentracao], [Temperatura]=s.[Temperatura], [PH teorico]=s.[PH teorico], [Metodo]=s.[Metodo], [Condicao]=s.[Condicao], [SourceKind]=s.[SourceKind], [SourceReference]=s.[SourceReference], [Reviewed]=s.[Reviewed], Ativo=1
    FROM excel.ReferenciaPH t JOIN #FonteReferenciaPH s ON t.[IDReferencia]=s.[IDReferencia]
    WHERE t.Ativo=0 OR EXISTS (SELECT s.[IDReferencia], s.[IDComposto], s.[Composto], s.[Concentracao], s.[Temperatura], s.[PH teorico], s.[Metodo], s.[Condicao], s.[SourceKind], s.[SourceReference], s.[Reviewed] EXCEPT SELECT t.[IDReferencia], t.[IDComposto], t.[Composto], t.[Concentracao], t.[Temperatura], t.[PH teorico], t.[Metodo], t.[Condicao], t.[SourceKind], t.[SourceReference], t.[Reviewed]);
    SET @Updated=@Updated+@@ROWCOUNT;
    INSERT excel.ReferenciaPH ([IDReferencia], [IDComposto], [Composto], [Concentracao], [Temperatura], [PH teorico], [Metodo], [Condicao], [SourceKind], [SourceReference], [Reviewed], Ativo)
    SELECT s.[IDReferencia], s.[IDComposto], s.[Composto], s.[Concentracao], s.[Temperatura], s.[PH teorico], s.[Metodo], s.[Condicao], s.[SourceKind], s.[SourceReference], s.[Reviewed], 1 FROM #FonteReferenciaPH s
    WHERE NOT EXISTS (SELECT 1 FROM excel.ReferenciaPH t WHERE t.[IDReferencia]=s.[IDReferencia]);
    SET @Inserted=@Inserted+@@ROWCOUNT;
    -- Analises: atualizar somente linhas cujo conteudo ou estado mudou.
    UPDATE t SET [DataAnalise]=s.[DataAnalise], [Lote]=s.[Lote], [IDComposto]=s.[IDComposto], [Nomenclatura]=s.[Nomenclatura], [IDReferencia]=s.[IDReferencia], [Concentracao]=s.[Concentracao], [Temperatura]=s.[Temperatura], [PHMedido]=s.[PHMedido], [ReferenciaAplicavel]=s.[ReferenciaAplicavel], [PHTeorico]=s.[PHTeorico], [DiferencaPH]=s.[DiferencaPH], [Status]=s.[Status], Ativo=1
    FROM excel.Analises t JOIN #FonteAnalises s ON t.[IDAnalise]=s.[IDAnalise]
    WHERE t.Ativo=0 OR EXISTS (SELECT s.[IDAnalise], s.[DataAnalise], s.[Lote], s.[IDComposto], s.[Nomenclatura], s.[IDReferencia], s.[Concentracao], s.[Temperatura], s.[PHMedido], s.[ReferenciaAplicavel], s.[PHTeorico], s.[DiferencaPH], s.[Status] EXCEPT SELECT t.[IDAnalise], t.[DataAnalise], t.[Lote], t.[IDComposto], t.[Nomenclatura], t.[IDReferencia], t.[Concentracao], t.[Temperatura], t.[PHMedido], t.[ReferenciaAplicavel], t.[PHTeorico], t.[DiferencaPH], t.[Status]);
    SET @Updated=@Updated+@@ROWCOUNT;
    INSERT excel.Analises ([IDAnalise], [DataAnalise], [Lote], [IDComposto], [Nomenclatura], [IDReferencia], [Concentracao], [Temperatura], [PHMedido], [ReferenciaAplicavel], [PHTeorico], [DiferencaPH], [Status], Ativo)
    SELECT s.[IDAnalise], s.[DataAnalise], s.[Lote], s.[IDComposto], s.[Nomenclatura], s.[IDReferencia], s.[Concentracao], s.[Temperatura], s.[PHMedido], s.[ReferenciaAplicavel], s.[PHTeorico], s.[DiferencaPH], s.[Status], 1 FROM #FonteAnalises s
    WHERE NOT EXISTS (SELECT 1 FROM excel.Analises t WHERE t.[IDAnalise]=s.[IDAnalise]);
    SET @Inserted=@Inserted+@@ROWCOUNT;
    UPDATE t SET Ativo=0 FROM excel.Analises t
    WHERE t.Ativo=1 AND NOT EXISTS (SELECT 1 FROM #FonteAnalises s WHERE s.[IDAnalise]=t.[IDAnalise]);
    SET @Deactivated=@Deactivated+@@ROWCOUNT;
    UPDATE t SET Ativo=0 FROM excel.ReferenciaPH t
    WHERE t.Ativo=1 AND NOT EXISTS (SELECT 1 FROM #FonteReferenciaPH s WHERE s.[IDReferencia]=t.[IDReferencia]);
    SET @Deactivated=@Deactivated+@@ROWCOUNT;
    UPDATE t SET Ativo=0 FROM excel.Compostos t
    WHERE t.Ativo=1 AND NOT EXISTS (SELECT 1 FROM #FonteCompostos s WHERE s.[IDComposto]=t.[IDComposto]);
    SET @Deactivated=@Deactivated+@@ROWCOUNT;
    -- Comparacao bidirecional de TODOS os valores, nao somente contagens.
    IF EXISTS (SELECT [IDComposto], [Formula], [Nomenclatura], [Estrutura], [MassaMolar], [CodigoExplorador], [ImagemArquivo], [CatalogHash] FROM #FonteCompostos EXCEPT SELECT [IDComposto], [Formula], [Nomenclatura], [Estrutura], [MassaMolar], [CodigoExplorador], [ImagemArquivo], [CatalogHash] FROM excel.Compostos WHERE Ativo=1)
       OR EXISTS (SELECT [IDComposto], [Formula], [Nomenclatura], [Estrutura], [MassaMolar], [CodigoExplorador], [ImagemArquivo], [CatalogHash] FROM excel.Compostos WHERE Ativo=1 EXCEPT SELECT [IDComposto], [Formula], [Nomenclatura], [Estrutura], [MassaMolar], [CodigoExplorador], [ImagemArquivo], [CatalogHash] FROM #FonteCompostos)
        THROW 51010, 'Reconciliacao de Compostos falhou.', 1;
    -- Comparacao bidirecional de TODOS os valores, nao somente contagens.
    IF EXISTS (SELECT [IDReferencia], [IDComposto], [Composto], [Concentracao], [Temperatura], [PH teorico], [Metodo], [Condicao], [SourceKind], [SourceReference], [Reviewed] FROM #FonteReferenciaPH EXCEPT SELECT [IDReferencia], [IDComposto], [Composto], [Concentracao], [Temperatura], [PH teorico], [Metodo], [Condicao], [SourceKind], [SourceReference], [Reviewed] FROM excel.ReferenciaPH WHERE Ativo=1)
       OR EXISTS (SELECT [IDReferencia], [IDComposto], [Composto], [Concentracao], [Temperatura], [PH teorico], [Metodo], [Condicao], [SourceKind], [SourceReference], [Reviewed] FROM excel.ReferenciaPH WHERE Ativo=1 EXCEPT SELECT [IDReferencia], [IDComposto], [Composto], [Concentracao], [Temperatura], [PH teorico], [Metodo], [Condicao], [SourceKind], [SourceReference], [Reviewed] FROM #FonteReferenciaPH)
        THROW 51010, 'Reconciliacao de ReferenciaPH falhou.', 1;
    -- Comparacao bidirecional de TODOS os valores, nao somente contagens.
    IF EXISTS (SELECT [IDAnalise], [DataAnalise], [Lote], [IDComposto], [Nomenclatura], [IDReferencia], [Concentracao], [Temperatura], [PHMedido], [ReferenciaAplicavel], [PHTeorico], [DiferencaPH], [Status] FROM #FonteAnalises EXCEPT SELECT [IDAnalise], [DataAnalise], [Lote], [IDComposto], [Nomenclatura], [IDReferencia], [Concentracao], [Temperatura], [PHMedido], [ReferenciaAplicavel], [PHTeorico], [DiferencaPH], [Status] FROM excel.Analises WHERE Ativo=1)
       OR EXISTS (SELECT [IDAnalise], [DataAnalise], [Lote], [IDComposto], [Nomenclatura], [IDReferencia], [Concentracao], [Temperatura], [PHMedido], [ReferenciaAplicavel], [PHTeorico], [DiferencaPH], [Status] FROM excel.Analises WHERE Ativo=1 EXCEPT SELECT [IDAnalise], [DataAnalise], [Lote], [IDComposto], [Nomenclatura], [IDReferencia], [Concentracao], [Temperatura], [PHMedido], [ReferenciaAplicavel], [PHTeorico], [DiferencaPH], [Status] FROM #FonteAnalises)
        THROW 51010, 'Reconciliacao de Analises falhou.', 1;
    IF EXISTS (SELECT 1 FROM excel.Compostos WHERE Ativo=1 AND (Estrutura IS NULL OR DATALENGTH(Estrutura)=0))
        THROW 51011, 'Imagem ausente apos importacao.', 1;
    DECLARE @Source NVARCHAR(MAX);
    SET @Source=CONVERT(NVARCHAR(MAX),(SELECT * FROM #FonteCompostos ORDER BY IDComposto FOR XML RAW, BINARY BASE64))
        +CONVERT(NVARCHAR(MAX),(SELECT * FROM #FonteReferenciaPH ORDER BY IDReferencia FOR XML RAW, BINARY BASE64))
        +CONVERT(NVARCHAR(MAX),(SELECT * FROM #FonteAnalises ORDER BY IDAnalise FOR XML RAW, BINARY BASE64));
    UPDATE excel.ImportRun SET FinishedAt=SYSUTCDATETIME(), SourceHash=HASHBYTES('SHA2_256',@Source),
        CatalogHash=(SELECT MIN(CatalogHash) FROM #FonteCompostos),
        Inserted=@Inserted, Updated=@Updated, Deactivated=@Deactivated, Rejected=0, Reconciled=1, Status='SUCCESS'
    WHERE RunID=@RunID;
END;
GO
IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE Version=3)
    INSERT dbo.SchemaVersion(Version) VALUES(3);
GO
CREATE OR ALTER VIEW excel.CompostosAtivos AS SELECT * FROM excel.Compostos WHERE Ativo=1;
GO
CREATE OR ALTER VIEW excel.ReferenciaPHAtivas AS SELECT * FROM excel.ReferenciaPH WHERE Ativo=1;
GO
CREATE OR ALTER VIEW excel.AnalisesAtivas AS SELECT * FROM excel.Analises WHERE Ativo=1;
