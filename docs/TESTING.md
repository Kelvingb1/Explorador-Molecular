# Verificação da distribuição CFA

## Verificações locais

- ZIP interno do XLSM e PBIX sem erro de integridade.
- XML da planilha legível, quatro abas e projeto VBA presentes; nenhum erro nas células com valor de erro armazenado.
- Inspeção de fonte VBA: cinco módulos instalados, ausência do antigo Módulo1 e de código de importação em Planilha2; conexão ADO com `Use Encryption for Data` e `Trust Server Certificate`.
- Layout PBIX legível: seis visuais na página principal e segunda página vazia.
- Preservação byte a byte dos três arquivos enviados; SHA-256 em `ARQUIVOS_RECEBIDOS.sha256`.
- `npm run check` e `npm test`: catálogo e projeções coerentes, 23 testes aprovados.

Os testes Node verificam o catálogo, a lógica do controlador com DOM mínimo, contratos VBA/SQL/DAX e imagens. Eles não substituem renderização WebGL nem execução nativa do Excel, SQL Server ou Power BI.

## Resultados relatados pelo autor

- Migrações SQL versões 1, 2 e 3 aplicadas no banco local ExploradorMolecularTest.
- Teste SQL com PASS para inserção, idempotência, atualização e inativação, com rollback; PASS para rejeição de FK inválida sem persistência.
- Importação da macro concluída no Excel.
- Seleção automática de amônia pelo explorador e abertura a partir do botão Power BI.
- Em 13/10/2026, confirmação de que o botão funciona com o endereço público, seguida do envio dos arquivos CFA.

Esses resultados nativos foram informados pelo autor. Não houve acesso direto ao SQL Server ou aos aplicativos Windows dele. Os contadores da segunda importação da planilha não foram fornecidos. O modelo binário do PBIX foi preservado, não regravado ou inspecionado como consultas M/DAX extraídas.

## Testes opcionais

`sql/TestarImportacao.sql` testa o fluxo com rollback em um banco de teste vazio e exige `Test` no nome. Execute após as migrações e antes de importar a planilha nesse banco vazio.

`tests/browser-smoke.mjs` contém testes de navegador que dependem de Playwright e Chromium; eles não foram executados nesta etapa. O uso relatado pelo autor é confirmação manual do fluxo no seu computador.
