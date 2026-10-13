"""Deriva cópias Windows-1252 importáveis pelo editor VBA do Excel Windows."""
from pathlib import Path
root=Path(__file__).resolve().parent.parent
out=root/'vba/windows-1252';out.mkdir(parents=True,exist_ok=True)
for source in (root/'vba').glob('*.bas'):
    (out/source.name).write_bytes(source.read_text(encoding='utf-8').replace('\r\n','\n').replace('\n','\r\n').encode('cp1252'))
print('Módulos VBA Windows-1252 exportados.')
