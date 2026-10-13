SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.SchemaVersion', N'U') IS NULL
    CREATE TABLE dbo.SchemaVersion (Version INT PRIMARY KEY, AppliedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME());
IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE Version = 1)
BEGIN
IF SCHEMA_ID(N'excel') IS NULL
    EXEC('CREATE SCHEMA excel');

-- ------------------------------------------------------------
-- excel.Compostos
-- Cadastro de cada composto: fórmula, nomenclatura, a imagem
-- reduzida da estrutura (armazenada como bytes) e a massa molar
-- já calculada manualmente a partir da fórmula.
-- ------------------------------------------------------------
IF OBJECT_ID(N'excel.Compostos', N'U') IS NULL
CREATE TABLE excel.Compostos (
    IDComposto      INT             NOT NULL PRIMARY KEY,
    Formula         NVARCHAR(30)    NOT NULL,
    Nomenclatura    NVARCHAR(100)   NOT NULL,
    Estrutura       VARBINARY(MAX)  NOT NULL,   -- imagem reduzida (bytes)
    MassaMolar      DECIMAL(10,3)   NULL        -- g/mol
);

-- ------------------------------------------------------------
-- excel.ReferenciaPH
-- Um ou mais cenários de referência por composto (concentração,
-- temperatura, pH teórico e o método/hipótese usados para chegar
-- nele). Cada referência pertence a exatamente um composto.
-- ------------------------------------------------------------
IF OBJECT_ID(N'excel.ReferenciaPH', N'U') IS NULL
CREATE TABLE excel.ReferenciaPH (
    IDReferencia    INT             NOT NULL PRIMARY KEY,
    IDComposto      INT             NOT NULL,
    Composto        NVARCHAR(100)   NOT NULL,
    Concentracao    DECIMAL(18,6)   NULL,       -- mol/L
    Temperatura     DECIMAL(10,3)   NULL,       -- °C
    [PH teorico]    DECIMAL(8,3)    NULL,       -- NULL para os casos pendentes (Ca(OH)2, H2CO3)
    Metodo          NVARCHAR(200)   NULL,       -- ex.: "ácido fraco, equilíbrio com Ka"
    Condicao        NVARCHAR(200)   NULL,       -- hipótese/observação por trás do cálculo

    CONSTRAINT UQ_ReferenciaPH_Referencia_Composto
        UNIQUE (IDReferencia, IDComposto),

    CONSTRAINT FK_ReferenciaPH_Compostos
        FOREIGN KEY (IDComposto)
        REFERENCES excel.Compostos (IDComposto)
);

-- ------------------------------------------------------------
-- excel.Analises
-- Uma análise simulada de laboratório, ligada a uma referência
-- específica do mesmo composto (não a qualquer referência do
-- composto) através da chave estrangeira composta abaixo.
-- ------------------------------------------------------------
IF OBJECT_ID(N'excel.Analises', N'U') IS NULL
CREATE TABLE excel.Analises (
    IDAnalise           INT             NOT NULL PRIMARY KEY,
    DataAnalise         DATE            NOT NULL,
    Lote                NVARCHAR(30)    NULL,
    IDComposto          INT             NOT NULL,
    Nomenclatura        NVARCHAR(100)   NULL,
    IDReferencia        INT             NOT NULL,
    Concentracao        DECIMAL(18,6)   NULL,
    Temperatura         DECIMAL(10,3)   NULL,
    PHMedido            DECIMAL(8,3)    NULL,
    ReferenciaAplicavel NVARCHAR(100)   NULL,
    PHTeorico           DECIMAL(8,3)    NULL,
    DiferencaPH         DECIMAL(8,3)    NULL,   -- PHMedido - PHTeorico
    Status              NVARCHAR(100)   NULL,   -- "Acima do teórico" / "Abaixo do teórico" / "Igual ao teórico" / "Não aplicável"

    -- Garante que a referência usada nesta análise pertence ao
    -- mesmo composto da análise (não a outro composto qualquer
    -- que por acaso tenha esse IDReferencia).
    CONSTRAINT FK_Analises_ReferenciaPH
        FOREIGN KEY (IDReferencia, IDComposto)
        REFERENCES excel.ReferenciaPH (IDReferencia, IDComposto)
);


INSERT dbo.SchemaVersion(Version) VALUES(1);
END;
COMMIT;
