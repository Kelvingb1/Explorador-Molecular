# Autoridade dos dados e fluxo

O cadastro canônico é `data/compounds.json`. Ele define ID, código, fórmula, nome, massa, átomos, cargas, ligações, coordenadas 2D/3D, arquivo de imagem e proveniência. Excel e SQL não são autoridades concorrentes sobre esse cadastro.

`npm run generate` deriva `catalog.js`, `data/Compostos.csv` e `vba/modCatalogoGerado.bas`. O validator rejeita cadastro incompleto; `npm run check` detecta projeções antigas. `python tools/extract-workbook-images.py` extrai os 17 JPEGs originais por ID, sem recompressão; o manifesto registra origem e SHA-256, conferidos pelos testes. Esses desenhos não são gerados do grafo web. `python tools/generate-images.py` gera PNGs auxiliares em outra pasta, sem substituir os originais. `python tools/export-vba.py` produz os módulos importáveis pelo Excel.

A planilha é a autoridade de entrada para referências de pH e análises. SQL é sua projeção reconciliada. Edições diretas no SQL serão substituídas na próxima importação. Não há sincronização bidirecional. Para adicionar/remover um composto: editar JSON, gerar projeções/imagens/módulos, atualizar cadastro Excel, ajustar referências/análises relacionadas, importar e atualizar Power BI. Não reutilizar IDs históricos para outra entidade.

No navegador, um controlador atualiza ficha e URL e emite `compoundchange`. O painel 2D escuta esse evento. O 3D consome SDF gerado com conectividade explícita, isolando falhas do WebGL. O site usa o catálogo versionado; não consulta SQL nem se atualiza em tempo real com o Excel.

`excel.Analises.Nomenclatura`, concentração, temperatura, referência aplicável, pH teórico, diferença e status são snapshots informados pelo Excel para aquela análise. Uma correção explícita da linha atualiza o snapshot; não são colunas derivadas automaticamente do cadastro atual. Para histórico imutável seriam necessárias revisões de análises, fora deste ajuste.

Há proveniência estruturada de massa, geometria e estrutura no JSON, e `SourceKind`, `SourceReference`, `Reviewed` nas referências SQL. As coordenadas são aproximações didáticas; `reviewed=false` não deve ser convertido para verdadeiro sem revisão. Não foram inventados CIDs PubChem ou referências experimentais.
