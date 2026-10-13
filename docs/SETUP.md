# Configurar a atualização dos dados

Para somente visualizar o relatório, abra `powerbi/LAB_BI_CFA.pbix` e use os dados já salvos. Este guia é para quem quer importar dados do Excel e atualizar o Power BI em seu próprio computador.

## 1. Extrair o projeto

Extraia a pasta inteira. A planilha e as imagens devem permanecer disponíveis em disco. O pacote contém a planilha atual `excel/Lab_EXCELCFA.xlsm`; seus módulos VBA já estão incorporados.

Requisitos do fluxo: Excel desktop no Windows com VBA/ADO, SQL Server, SSMS ou sqlcmd, Microsoft OLE DB Driver 19 e Power BI Desktop. A conexão VBA usa autenticação integrada do Windows.

## 2. Criar e preparar o banco

Use uma instância de desenvolvimento e um banco dedicado. O nome usado pelo autor é `ExploradorMolecularTest`. O script `sql/000_CriarBancoTeste.sql` cria esse banco quando ele não existe, sem apagar um banco existente.

No SSMS, selecione o banco desejado e execute os arquivos nesta ordem:

1. `sql/migrations/001_initial.sql`
2. `sql/migrations/002_integrity.sql`
3. `sql/migrations/003_import_pipeline.sql`

Alternativamente, abra um terminal na pasta `sql` e execute, ajustando a instância:

```powershell
sqlcmd -S ".\SQLEXPRESS" -d ExploradorMolecularTest -E -b -i Modelagem_Dados_SQL.sql
```

Confirme as versões 1, 2 e 3:

```sql
SELECT Version FROM dbo.SchemaVersion ORDER BY Version;
```

`sql/consultas/SQLQuery1Lab.sql` é o script original enviado pelo autor. Ele não substitui as migrações e não é a entrada recomendada para instalação.

## 3. Configurar o Excel

Abra `excel/Lab_EXCELCFA.xlsm`. Se necessário para executar a importação, habilite as macros desse arquivo conforme a configuração do seu Excel.

Na aba `Config`, ajuste:

| Chave | Valor para seu ambiente |
| --- | --- |
| `SQL_SERVER` | Sua instância, por exemplo `.\SQLEXPRESS`, com uma barra invertida. |
| `DATABASE` | Banco em que foram aplicadas as migrações. |
| `IMAGE_PATH` | Caminho completo da pasta `assets\images` extraída. |
| `SQL_PROVIDER` | `MSOLEDBSQL19`, para o driver 19. |
| `SQL_ENCRYPT` | `Mandatory`. |
| `SQL_TRUST_SERVER_CERTIFICATE` | `False` com certificado confiável. O arquivo enviado contém `True`, usado no teste local com certificado próprio. |
| `WEB_BASE_URL` | `https://explorador-molecular-cfa.smokycamel65.chatgpt.site`. |

Os caminhos salvos na planilha pertencem ao computador do autor e não são ajustados automaticamente ao baixar. `WEB_BASE_URL` do Excel está vazio no anexo; essa chave é independente de `ConfigExplorador` do Power BI. Preenchê-la mantém a configuração documentada consistente.

Com `SQL_TRUST_SERVER_CERTIFICATE=True`, a conexão continua criptografada, mas aceita o certificado sem validar a identidade do servidor. Essa foi a configuração do teste local do autor. Use um certificado confiável e `False` no ambiente definitivo.

O texto `VBA_STATUS` ainda indica compilação pendente no anexo; ele não é uma verificação automática. Os cinco módulos foram encontrados na inspeção do arquivo. Antes de editar ou executar novas alterações, confira a compilação pelo editor VBA do Excel.

Preserve IDs, cabeçalhos e colunas. O cadastro oficial vem de `data/compounds.json`; referências e análises são editadas na planilha. Os CSVs `*.sample.csv` são exemplos e não devem substituir os IDs existentes.

Após configurar o ambiente:

1. Execute `ImportarImagensCompostos`, caso precise reconstruir as imagens na planilha.
2. Execute `ImportarLaboratorioSQL` para reconciliar a planilha com o banco.
3. Confira a mensagem de sucesso e a execução registrada:

```sql
SELECT TOP (10) * FROM excel.ImportRun ORDER BY StartedAt DESC;
```

A importação trata a planilha como snapshot completo: registros ausentes são inativados. Edições diretas no SQL podem ser substituídas pela próxima importação. Consulte `IMPORT_PIPELINE.md` antes de modificar esse comportamento.

## 4. Atualizar o Power BI

Abra `powerbi/LAB_BI_CFA.pbix`. Em **Transformar dados**, ajuste as consultas existentes para a instância e o banco que você configurou. Mantenha seus nomes para preservar os visuais e a medida:

| Consulta no relatório | View SQL |
| --- | --- |
| `excel Compostos` | `excel.CompostosAtivos` |
| `excel Analises` | `excel.AnalisesAtivas` |
| `excel ReferenciaPH` | `excel.ReferenciaPHAtivas` |

Os arquivos `powerbi/Compostos_teste.pq`, `Analises_teste.pq` e `ReferenciaPH_teste.pq` contêm exemplos para `localhost\SQLEXPRESS` e `ExploradorMolecularTest`. Ajuste os valores se seu ambiente for outro. Os arquivos `excel_*.pq` são alternativas parametrizadas, que exigem os parâmetros `ServidorSQL`, `BancoSQL` e a função `fxImagemURL` quando referenciada.

Na tabela `ConfigExplorador`, preserve uma única linha em `WebBaseURL` com:

```text
https://explorador-molecular-cfa.smokycamel65.chatgpt.site
```

Essa configuração é desconectada; não crie relacionamento para ela. A medida existente `LinkExplorador` já está em `dax/LinkExplorador.dax`. Ela retorna vazio quando não há um único código ou quando o composto está inativo. No botão do relatório, a ação URL da Web deve usar essa medida.

Clique em **Fechar e aplicar**, atualize e salve o PBIX. Teste a seleção de amônia com **Ctrl + clique** no botão. O site online não depende do SQL Server local para carregar o catálogo.

## Desenvolvimento do catálogo

Com Node.js 20 ou superior, execute `npm run generate`, `npm run check` e `npm test` após alterar `data/compounds.json`. Para exportar os módulos importáveis pelo Excel, use `python tools/export-vba.py`; importe os arquivos de `vba/windows-1252/` somente se estiver atualizando o código VBA. Não há necessidade de reinstalar os módulos da planilha recebida para apenas configurá-la.
