"""Rasteriza o grafo web como imagens didáticas auxiliares, sem substituir as originais."""
from pathlib import Path
import json, math, hashlib
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin
root=Path(__file__).resolve().parent.parent
catalog=json.loads((root/'data/compounds.json').read_text(encoding='utf-8'))
out=root/'assets/images-generated';out.mkdir(parents=True,exist_ok=True)
# Hash é o da projeção web, calculado pelo gerador Node.
web=(root/'catalog.js').read_text(encoding='utf-8').split('window.MolecularCatalog = ',1)[1].rstrip(';\n')
hash_catalog=json.loads(web)['hash']
manifest={'catalogHash':hash_catalog,'kind':'GENERATED','source':'data/compounds.json; grafo 2D didatico; sem revisao quimica independente','files':{}}
for c in catalog['compounds']:
    im=Image.new('RGB',(600,350),'#0b1220');draw=ImageDraw.Draw(im)
    font=ImageFont.load_default(size=25);small=ImageFont.load_default(size=15)
    for a,b,order in c['bonds']:
        x1,y1=c['atoms'][a]['position2D'];x2,y2=c['atoms'][b]['position2D']
        length=math.hypot(x2-x1,y2-y1);ux=(x2-x1)/length;uy=(y2-y1)/length
        offsets={1:[0],2:[-4,4],3:[-7,0,7]}[order]
        for off in offsets:draw.line((x1+27*ux-off*uy,y1+27*uy+off*ux,x2-27*ux-off*uy,y2-27*uy+off*ux),fill='#c5d5ed',width=3)
    for a in c['atoms']:
        x,y=a['position2D'];draw.ellipse((x-25,y-25,x+25,y+25),fill='#0b1220')
        draw.text((x,y),a['element'],fill=catalog['elements'][a['element']]['textColor'],font=font,anchor='mm')
        if a['charge']:
            q=a['charge'];label=(str(abs(q)) if abs(q)>1 else '')+('+' if q>0 else '-')
            draw.text((x+17,y-22),label,fill='white',font=small)
    draw.text((15,315),c['code']+' | Modelo didatico | Revisao quimica pendente',fill='#c5d5ed',font=small)
    meta=PngImagePlugin.PngInfo();meta.add_text('CatalogHash',hash_catalog);meta.add_text('CompoundCode',c['code'])
    filename=str(c['id'])+'.png'
    file=out/filename;im.save(file,pnginfo=meta)
    manifest['files'][filename]=hashlib.sha256(file.read_bytes()).hexdigest()
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(catalog["compounds"])} imagens 2D geradas do catalogo.')
