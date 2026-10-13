import test from 'node:test';
import assert from 'node:assert/strict';
import {app} from './dom-fixture.mjs';
const title=a=>a.document.getElementById('titulo-molecula').textContent;
const panel=a=>a.document.getElementById('painel-estrutura-2d');
for(const engine of ['missing','create-failure','model-failure','ok'])test(`seleção e 2D coerentes com engine ${engine}`,()=>{
    const a=app({query:'?composto=H2SO4&origem=powerbi',engine});
    assert.match(title(a),/Sulfúrico/);assert.equal(panel(a).querySelectorAll('.atomo-2d').length,7);
    a.select('NH3');assert.match(title(a),/Amônia/);assert.equal(panel(a).querySelectorAll('.atomo-2d').length,4);
    const url=new URL(a.location.href);assert.equal(url.searchParams.get('composto'),'NH3');assert.equal(url.searchParams.get('origem'),'powerbi');
    assert.equal(a.document.getElementById('rotacao').disabled,engine!=='ok');
});
test('query desconhecida ou semelhante a propriedade do objeto tem fallback seguro',()=>{for(const query of ['?composto=invalido','?composto=constructor','?composto=__proto__'])assert.match(title(app({query})),/Amônia/);});
test('todos os compostos têm texto, desenho e grafo 3D coerentes',()=>{
    const a=app({engine:'ok'});
    for(const c of a.window.MolecularCatalog.compounds){a.select(c.code);assert.equal(panel(a).querySelectorAll('.atomo-2d').length,c.atoms.length);assert.equal(a.state.model.format,'sdf');assert.equal(a.state.model.options.keepH,true);assert.match(a.document.getElementById('ficha').children[7].textContent,/g\/mol/);}
});
test('teclado seleciona átomo e anuncia carga formal',()=>{const a=app({query:'?composto=NaOH'});const atom=panel(a).querySelectorAll('.atomo-2d')[0];let prevented=false;atom.dispatchEvent({type:'keydown',key:'Enter',preventDefault:()=>prevented=true});assert.ok(prevented);assert.equal(atom.getAttribute('aria-pressed'),'true');assert.match(panel(a).querySelector('.detalhe-2d').textContent,/Sódio.*\+1/);});
test('movimento reduzido, visibilidade, rotação e reset',()=>{
    const a=app({engine:'ok',reduced:true});assert.ok(!a.state.spins.includes('vy'));
    a.document.getElementById('rotacao').dispatchEvent({type:'click'});assert.equal(a.state.spins.at(-1),'vy');
    a.document.hidden=true;a.document.dispatchEvent({type:'visibilitychange'});assert.equal(a.state.spins.at(-1),false);
    a.document.hidden=false;a.document.dispatchEvent({type:'visibilitychange'});assert.equal(a.state.spins.at(-1),'vy');
    a.preference.dispatchEvent({type:'change',matches:true});assert.equal(a.state.spins.at(-1),false);
    a.document.getElementById('restaurar').dispatchEvent({type:'click'});assert.equal(a.state.resets,1);
});
