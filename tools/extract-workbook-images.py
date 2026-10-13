"""Extrai, sem recomprimir, as imagens ancoradas em Compostos de um XLSM."""
from pathlib import Path
import sys, json, zipfile, xml.etree.ElementTree as E, hashlib, re, posixpath
root=Path(__file__).resolve().parent.parent
source=Path(sys.argv[1]) if len(sys.argv)>1 else root/'excel/Lab_EXCELCFA.xlsm'
catalog=json.loads((root/'data/compounds.json').read_text())
web=json.loads((root/'catalog.js').read_text().split('window.MolecularCatalog = ',1)[1].rstrip(';\n'))
ns={'xdr':'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
out=root/'assets/images';out.mkdir(parents=True,exist_ok=True)
files={};origins={}
with zipfile.ZipFile(source) as z:
 rels={n.attrib['Id']:n.attrib['Target'] for n in E.fromstring(z.read('xl/drawings/_rels/drawing1.xml.rels'))}
 for anchor in E.fromstring(z.read('xl/drawings/drawing1.xml')):
  info=anchor.find('.//xdr:cNvPr',ns)
  if info is None:continue
  m=re.fullmatch(r'imgCmp_(\d+)',info.attrib.get('name',''))
  if not m:continue
  id=int(m[1]);c=next(c for c in catalog['compounds'] if c['id']==id)
  assert id not in origins,'Imagem duplicada'
  assert int(anchor.find('xdr:from/xdr:row',ns).text)==id+1,'Ancora inesperada'
  assert info.attrib.get('descr','').startswith((f'IDComposto={id}|',f'CompostoID={id}|')),'Origem inesperada'
  blip=anchor.find('.//a:blip',ns);target=rels[blip.attrib['{'+ns['r']+'}embed']]
  member=posixpath.normpath(posixpath.join('xl/drawings',target)) if not target.startswith('/') else target.lstrip('/')
  data=z.read(member);assert data[:3]==b'\xff\xd8\xff','JPEG esperado'
  assert c['imageFile']==f'{id}.jpg'
  (out/c['imageFile']).write_bytes(data)
  files[c['imageFile']]=hashlib.sha256(data).hexdigest();origins[str(id)]={'member':member,'name':info.attrib['name'],'description':info.attrib['descr']}
assert len(files)==len(catalog['compounds'])==17
manifest={'catalogHash':web['hash'],'kind':'USER_IMPORTED','source':'Lab_EXCEL2Coluna.xlsm: imagens originais, sem recompressao; nao sao geradas do grafo web','reviewed':False,'files':files,'origins':origins}
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('17 JPEGs originais extraidos e verificados.')
