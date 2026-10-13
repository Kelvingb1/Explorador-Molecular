# Contrato da importação

1. Recalcular planilha; validar cadastro oficial, IDs únicos, linhas sem ID, imagens e assinatura PNG/JPEG.
2. Conectar; exigir schema versão 3 previamente instalado; registrar `RUNNING`.
3. Iniciar transação serializable; carregar três tabelas temporárias de snapshot com parâmetros ADO.
4. Adquirir lock de aplicação; verificar IDs/códigos, proveniência, FKs, imagens, versão do catálogo e proibir reutilização de IDs.
5. Atualizar linhas alteradas, inserir ausentes e inativar linhas fora da fonte, sem excluir fisicamente.
6. Comparar fonte e destino ativos nos dois sentidos via `EXCEPT`, incluindo bytes das imagens e todos os campos importados, sob os tipos/precisões e collation do schema.
7. Registrar contadores, SHA-256 da fonte normalizada e resultado; commit; exibir sucesso.

Qualquer falha cancela a transação. A atualização de `FAILED` é tentada depois do rollback na mesma conexão. Falhas antes da conexão aparecem na mensagem da macro; perda da conexão pode deixar um run `RUNNING`, que deve ser investigado. `Rejected=NULL` significa que a quantidade de linhas rejeitadas não foi determinada; o lote inteiro foi revertido. Contadores são agregados entre as três tabelas. `Updated` inclui reativações.

A ausência na fonte significa `Ativo=0`. Importação de referências/análises vazias inativa todas dessas tabelas; isso é uma semântica de snapshot completo. O cadastro de compostos não pode estar vazio. Power BI deve filtrar `Ativo=true` nas três tabelas, ou usar as views `*Ativas`. IDs inativos e seus vínculos permanecem para consulta histórica. Nenhuma rotina altera `dbo.Analises`.

A staging aplica os tipos SQL: massa/temperatura DECIMAL(10,3), concentração DECIMAL(18,6), pH/diferença DECIMAL(8,3). Células numéricas inválidas são rejeitadas; somente vazio e as duas observações de condição pendente reconhecidas viram NULL. Imagens são resolvidas pela coluna G e uma única pasta configurada, sem aliases ou escolha manual.

As 17 imagens originais foram recuperadas do XLSM como JPEGs, sem recompressão, e vinculadas por ID em ImagemArquivo. O manifesto registra SHA-256 e origem. Excel/SQL usam esses mesmos bytes. Desenhos auxiliares gerados do grafo web ficam em assets/images-generated; eles não substituem os originais e não devem ser confundidos com eles.
