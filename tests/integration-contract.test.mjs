import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {root,loadCatalog,projections} from '../tools/catalog.mjs';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
test('conexao ADO usa os nomes documentados de criptografia e certificado',()=>{
    const vba=read('vba/modConfiguracao.bas');
    assert.match(vba,/;Use Encryption for Data=/);
    assert.match(vba,/;Trust Server Certificate=/);
    assert.doesNotMatch(vba,/;Encrypt=|;TrustServerCertificate=/);
    assert.match(vba,/ConfigValor\("SQL_TRUST_SERVER_CERTIFICATE", "False"\)/);
});
test('JPEGs originais têm origem por ID e integridade registrada no catálogo atual',()=>{
    const c=loadCatalog(), web=JSON.parse(projections(c)['catalog.js'].split('window.MolecularCatalog = ')[1].slice(0,-2));
    const manifest=JSON.parse(read('assets/images/manifest.json'));assert.equal(manifest.catalogHash,web.hash);
    assert.equal(manifest.kind,'USER_IMPORTED');
    assert.equal(manifest.reviewed,false);
    for(const compound of c.compounds){const bytes=fs.readFileSync(path.join(root,'assets/images',compound.imageFile));assert.equal(bytes.subarray(0,3).toString('hex'),'ffd8ff');assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),manifest.files[compound.imageFile]);assert.equal(manifest.origins[compound.id].name,`imgCmp_${compound.id}`);}
});
test('atribuições SQL de UPDATE e staging VBA têm contrato compatível',()=>{
    const sql=read('sql/migrations/003_import_pipeline.sql'),vba=read('vba/modImportacaoSQL.bas');
    for(const match of sql.matchAll(/UPDATE t SET ([^\n]+)\n\s+FROM excel\.(\w+)/g)) {
        const assignments=match[1].split(',');for(const item of assignments)assert.match(item.trim(),/^(?:\[[^\]]+\]|Ativo)\s*=/,item);
        const table=match[2];const staging=vba.match(new RegExp('SELECT TOP \\(0\\) (.+?) INTO #Fonte'+table));assert.ok(staging,table);
        const stagedFields=staging[1].split(',').map(x=>x.trim().replace(/[\[\]]/g,''));
        const fields=assignments.filter(x=>!x.trim().startsWith('Ativo')).map(x=>x.match(/^\s*\[([^\]]+)\]/)[1]);
        for(const field of fields)assert.ok(stagedFields.includes(field),`${table}.${field} não está no staging`);
        assert.equal(new Set(fields).size,fields.length);
    }
});
test('DAX usa código do cadastro, configuração e estado ativo; não mapeamento por ID',()=>{
    const dax=read('dax/LinkExplorador.dax');assert.ok(!/SWITCH\s*\(/.test(dax));assert.match(dax,/SELECTEDVALUE\('excel Compostos'\[CodigoExplorador\]\)/);assert.match(dax,/ConfigExplorador\[WebBaseURL\]/);assert.match(dax,/NOT\(Ativo\)/);
});
