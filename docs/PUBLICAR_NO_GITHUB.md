# Atualizar o projeto no GitHub

O projeto está publicado no [repositório Explorador-Molecular](https://github.com/Kelvingb1/Explorador-Molecular). O explorador online é público. Este guia é para manutenção do repositório pelo autor.

1. Abra a pasta clonada do repositório e atualize os arquivos desejados.
2. Ao substituir um arquivo, coloque a nova versão na pasta antes de preparar o commit. Confirme o nome exato, especialmente `README.md`.
3. Use `git status` e `git diff` para conferir as alterações. Para Excel e Power BI, confirme os arquivos no aplicativo correspondente.
4. Adicione somente os arquivos que pretende atualizar, crie o commit e envie com `git push`.
5. Confira a nova execução na aba Actions, os links do README, o GIF e os diagramas Mermaid.

Exemplo para uma alteração no README:

```bash
git add README.md
git commit -m "Atualiza documentacao do projeto"
git push
```

O upload dos arquivos do projeto não publica sua instância local do SQL Server. Mudanças no código do explorador enviadas ao GitHub também precisam ser publicadas na hospedagem do site para aparecerem no endereço online.
