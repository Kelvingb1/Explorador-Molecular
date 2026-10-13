import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function validate(catalog) {
    const fail = message => { throw new Error(message); };
    if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.compounds) || !catalog.compounds.length) fail('Catálogo vazio ou versão inválida');
    const ids = new Set(), codes = new Set(), images = new Set();
    for (const c of catalog.compounds) {
        if (!Number.isInteger(c.id) || c.id < 1 || c.id > 2147483647 || ids.has(c.id)) fail('ID inválido/repetido');
        if (!/^[A-Za-z][A-Za-z0-9]{0,29}$/.test(c.code) || codes.has(c.code)) fail('Código inválido/repetido');
        ids.add(c.id); codes.add(c.code);
        for (const field of ['name','formula','displayFormula','geometry','description','note']) if (typeof c[field] !== 'string' || !c[field].trim()) fail(`${c.code}: ${field} ausente`);
        if (c.name.length > 100 || c.formula.length > 30 || c.code.length > 30) fail('Campo excede SQL');
        if (!Number.isFinite(c.molarMass) || c.molarMass <= 0 || c.molarMass >= 10000000) fail('Massa inválida');
        if (!/^\d+\.(png|jpe?g)$/i.test(c.imageFile) || images.has(c.imageFile.toLowerCase())) fail('Imagem inválida/repetida');
        images.add(c.imageFile.toLowerCase());
        if (!c.atoms?.length || !Array.isArray(c.bonds)) fail('Estrutura ausente');
        for (const a of c.atoms) {
            if (!Object.hasOwn(catalog.elements,a.element)) fail('Elemento desconhecido');
            for (const [key,n] of [['position2D',2],['position3D',3]]) if (a[key]?.length !== n || !a[key].every(Number.isFinite)) fail('Coordenada inválida');
            if (!Number.isInteger(a.charge) || Math.abs(a.charge)>8) fail('Carga inválida');
            if (a.position2D[0]<30 || a.position2D[0]>570 || a.position2D[1]<30 || a.position2D[1]>280) fail('Layout fora do desenho');
        }
        const bonds = new Set();
        for (const [a,b,order] of c.bonds) {
            if (![a,b,order].every(Number.isInteger) || a<0 || b<0 || a>=c.atoms.length || b>=c.atoms.length || a===b || ![1,2,3].includes(order)) fail('Ligação inválida');
            const key=[a,b].sort((x,y)=>x-y).join(':'); if (bonds.has(key)) fail('Ligação repetida'); bonds.add(key);
            if (c.atoms[a].position2D.every((x,i)=>x===c.atoms[b].position2D[i])) fail('Ligação de comprimento zero');
        }
        for (const key of ['molarMass','structure','geometry']) if (!c.provenance?.[key]?.source || typeof c.provenance[key].reviewed !== 'boolean') fail('Proveniência ausente');
        // NH4OH is explicitly represented as ammonia + water, not its nominal formula.
        const formula=c.code==='NH4OH'?'NH5O':c.formula.replace(/\(([A-Z][a-z]?)H\)(\d+)/g,(_,e,n)=>`${e}${n}H${n}`);
        const expected={}; for (const m of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) expected[m[1]]=(expected[m[1]]||0)+Number(m[2]||1);
        const actual={};for (const a of c.atoms) actual[a.element]=(actual[a.element]||0)+1;
        if (JSON.stringify(Object.entries(expected).sort())!==JSON.stringify(Object.entries(actual).sort())) fail(`${c.code}: fórmula e átomos divergentes`);
    }
    for (const e of Object.values(catalog.elements)) if (!e.nome || !/^#[0-9a-f]{6}$/i.test(e.color) || !/^#[0-9a-f]{6}$/i.test(e.textColor) || !(e.raio>0)) fail('Metadados de elemento inválidos');
    return catalog;
}
export function sdf(c) {
    const int=n=>String(n).padStart(3);
    const lines=[c.code,'  Explorador Molecular','',`${int(c.atoms.length)}${int(c.bonds.length)}  0  0  0  0            999 V2000`];
    for (const a of c.atoms) lines.push(a.position3D.map(x=>x.toFixed(4).padStart(10)).join('')+' '+a.element.padEnd(3)+' 0  0  0  0  0  0  0  0  0  0  0  0');
    for (const [a,b,o] of c.bonds) lines.push(`${int(a+1)}${int(b+1)}${int(o)}  0  0  0  0`);
    const charges=c.atoms.flatMap((a,i)=>a.charge?[[i+1,a.charge]]:[]);
    for (let i=0;i<charges.length;i+=8) {const group=charges.slice(i,i+8);lines.push('M  CHG'+int(group.length)+group.map(([a,q])=>' '+int(a)+' '+int(q)).join(''));}
    return [...lines,'M  END','$$$$',''].join('\n');
}
export const loadCatalog=()=>validate(JSON.parse(fs.readFileSync(path.join(root,'data/compounds.json'),'utf8')));
export function projections(catalog) {
    const hash=crypto.createHash('sha256').update(JSON.stringify(catalog)).digest('hex');
    const web={hash,elements:catalog.elements,compounds:catalog.compounds.map(c=>({...c,sdf:sdf(c)}))};
    const quote=s=>'"'+String(s).replaceAll('"','""')+'"';
    const csv=['IDComposto,Formula,Nomenclatura,Estrutura2D,MassaMolar,CodigoExplorador,ImagemArquivo',...catalog.compounds.map(c=>[c.id,c.formula,c.name,'',c.molarMass,c.code,c.imageFile].map(quote).join(','))].join('\r\n')+'\r\n';
    const vb=s=>'"'+String(s).replaceAll('"','""')+'"';
    const bas=['Attribute VB_Name = "modCatalogoGerado"','Option Explicit',"' GERADO. Edite data/compounds.json e execute node tools/generate.mjs.",`Public Const CATALOGO_HASH As String = "${hash}"`,'Public Function CatalogoOficial() As Object','    Dim d As Object','    Set d = CreateObject("Scripting.Dictionary")'];
    // Numeric literals are locale-independent in VBA source.
    for (const c of catalog.compounds) bas.push(`    d.Add "${c.id}", Array(${vb(c.formula)}, ${vb(c.name)}, ${c.molarMass}#, ${vb(c.code)}, ${vb(c.imageFile)})`);
    bas.push('    Set CatalogoOficial = d','End Function','');
    return {'catalog.js':'// GERADO; não editar.\nwindow.MolecularCatalog = '+JSON.stringify(web,null,2)+';\n','data/Compostos.csv':csv,'vba/modCatalogoGerado.bas':bas.join('\r\n')};
}
