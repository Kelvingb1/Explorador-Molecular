#!/usr/bin/env bash
# Acrescenta destaques do vídeo e do PDF ao README existente.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
for arquivo in README.md assets/videos/Explorador_Molecular.mp4 assets/cfa-video-capa.jpg assets/cfa-visao-geral.png docs/apresentacoes/Explorador_Molecular_CFA.pdf; do
  [[ -f "$arquivo" ]] || { echo "Arquivo ausente: $arquivo. Extraia o pacote na raiz do projeto." >&2; exit 1; }
done
arquivo_temporario="$(mktemp ./cfa-readme.XXXXXX)"
trap 'rm -f "$arquivo_temporario"' EXIT
awk '
FNR==NR {
  if (/<!-- cfa-visao-geral -->/) pdf=1
  if (/<!-- cfa-video -->/) video=1
  next
}
{
  print
  if (!ancora && /!\[Demonstração do Explorador Molecular\]\(assets\/demo.gif\)/) {
    ancora=1
    if (!video) {
      print ""
      print "<!-- cfa-video -->"
      print "## Conheça o projeto em vídeo"
      print ""
      print "[![Visão geral em vídeo do Explorador Molecular CFA](assets/cfa-video-capa.jpg)](https://explorador-molecular-cfa.smokycamel65.chatgpt.site/video.html)"
      print ""
      print "[**Assistir ao vídeo (6 min 12 s)**](https://explorador-molecular-cfa.smokycamel65.chatgpt.site/video.html)"
      print ""
      print "Uma visão geral da integração entre Excel/VBA, SQL Server, Power BI e o explorador molecular."
      print "<!-- /cfa-video -->"
    }
    if (!pdf) {
      print ""
      print "<!-- cfa-visao-geral -->"
      print "## Visão geral em PDF"
      print ""
      print "[![Visão geral do Explorador Molecular CFA](assets/cfa-visao-geral.png)](docs/apresentacoes/Explorador_Molecular_CFA.pdf)"
      print ""
      print "[**Ler a visão geral do projeto (PDF)**](docs/apresentacoes/Explorador_Molecular_CFA.pdf)"
      print ""
      print "Conheça a arquitetura, a integração entre as ferramentas e os limites dos exemplos químicos em 15 páginas."
      print "<!-- /cfa-visao-geral -->"
    }
  }
}
END {
  if (!ancora && !(pdf && video)) {
    print "O GIF esperado não foi encontrado no README. O arquivo original foi preservado." > "/dev/stderr"
    exit 2
  }
}' README.md README.md > "$arquivo_temporario"
if cmp -s README.md "$arquivo_temporario"; then
  echo 'O vídeo e o PDF já estão destacados no README.'
else
  mv "$arquivo_temporario" README.md
  echo 'Destaques adicionados. Confira com: git diff -- README.md'
fi
