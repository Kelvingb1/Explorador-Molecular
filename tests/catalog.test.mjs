import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {root,loadCatalog,validate,projections,sdf} from '../tools/catalog.mjs';
const original=loadCatalog();
test('projeções refletem exatamente o catálogo',()=>{
    for(const [file,content] of Object.entries(projections(original)))assert.equal(fs.readFileSync(path.join(root,file),'utf8'),content,file);
});
test('SDF de todos os compostos preserva coordenadas, cargas e ligações explícitas',()=>{
    for(const c of original.compounds){
        const lines=sdf(c).split('\n');assert.equal(Number(lines[3].slice(0,3)),c.atoms.length);assert.equal(Number(lines[3].slice(3,6)),c.bonds.length);
        c.atoms.forEach((a,i)=>{const row=lines[i+4];assert.equal(row.slice(31,34).trim(),a.element);a.position3D.forEach((v,j)=>assert.equal(Number(row.slice(j*10,(j+1)*10)),v));});
        c.bonds.forEach(([a,b,o],i)=>{const row=lines[4+c.atoms.length+i];assert.deepEqual([Number(row.slice(0,3))-1,Number(row.slice(3,6))-1,Number(row.slice(6,9))],[a,b,o]);});
        const charges=new Map();for(const row of lines.filter(l=>l.startsWith('M  CHG'))){const tokens=row.trim().split(/\s+/).slice(3).map(Number);for(let i=0;i<tokens.length;i+=2)charges.set(tokens[i]-1,tokens[i+1]);}
        c.atoms.forEach((a,i)=>assert.equal(charges.get(i)||0,a.charge));
    }
});
for(const [name,mutate] of [
    ['IDs duplicados',c=>c.compounds[1].id=c.compounds[0].id],
    ['códigos duplicados',c=>c.compounds[1].code=c.compounds[0].code],
    ['massa não positiva',c=>c.compounds[0].molarMass=0],
    ['elemento desconhecido',c=>c.compounds[0].atoms[0].element='Xx'],
    ['ligação fora da estrutura',c=>c.compounds[0].bonds[0][1]=999],
    ['proveniência ausente',c=>delete c.compounds[0].provenance],
    ['fórmula divergente',c=>c.compounds[0].formula='H2Cl'],
    ['caminho de imagem inseguro',c=>c.compounds[0].imageFile='../1.png'],
    ['átomos ausentes',c=>c.compounds[0].atoms.pop()]
]) test(`validator rejeita ${name}`,()=>{const c=structuredClone(original);mutate(c);assert.throws(()=>validate(c));});
