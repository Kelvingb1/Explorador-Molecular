/* Controlador: texto, URL e evento funcionam mesmo se WebGL/3Dmol falhar. */
(() => {
    'use strict';
    const catalog = window.MolecularCatalog;
    const area = document.getElementById('visualizador');
    const select = document.getElementById('seletor-composto');
    if (!catalog?.compounds?.length) {
        area.textContent = 'Catálogo indisponível. Recarregue a página.';
        return;
    }
    const byCode = new Map(catalog.compounds.map(c => [c.code,c]));
    const rotationButton = document.getElementById('rotacao');
    const resetButton = document.getElementById('restaurar');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let viewer = null, initialView = null, rotating = !preference.matches, selected;
    for (const c of catalog.compounds) select.add(new Option(`${c.name} — ${c.displayFormula}`,c.code));
    const legend = document.getElementById('legenda');
    function disable3D(error) {
        try { viewer?.spin(false); } catch { /* Falha restrita ao 3D. */ }
        viewer = null;
        rotationButton.disabled = resetButton.disabled = true;
        area.replaceChildren();
        const message = document.createElement('p');
        message.textContent = 'Visualização 3D indisponível. Consulte a estrutura 2D e a descrição textual abaixo.';
        area.append(message);
        area.dataset.state = 'unavailable';
        if (error) console.error('Falha no painel 3D:',error);
    }
    function rotate() {
        rotationButton.textContent = rotating ? 'Pausar rotação' : 'Iniciar rotação';
        rotationButton.setAttribute('aria-pressed',String(rotating));
        if (!viewer) return;
        try { viewer.spin(false); if (rotating && !document.hidden) viewer.spin('vy',0.35); }
        catch (error) { disable3D(error); }
    }
    function render3D(c) {
        if (!viewer) return;
        try {
            viewer.removeAllModels(); viewer.removeAllLabels();
            const model = viewer.addModel(c.sdf,'sdf',{keepH:true});
            if (model.selectedAtoms({}).length !== c.atoms.length) throw new Error('Contagem 3D divergente');
            for (const [symbol,e] of Object.entries(catalog.elements)) viewer.setStyle({elem:symbol},{sphere:{radius:e.raio*1.15,color:e.color},stick:{radius:0.085,color:e.color}});
            viewer.setClickable({},true,atom => {
                const e=catalog.elements[atom.elem];
                // SDF atom indices are zero-based in the viewer; no serial/index guessing.
                const charge=c.atoms[atom.index]?.charge ?? 0;
                const text=`${e.nome} (${atom.elem}), carga formal ${charge>0?'+':''}${charge}`;
                document.getElementById('detalhe-3d').textContent=text;
                viewer.removeAllLabels();
                viewer.addLabel(text,{position:atom,backgroundColor:'#16324f',fontColor:'white',fontSize:16});
                viewer.render();
            });
            viewer.zoomTo(); viewer.render(); initialView=viewer.getView();
            area.dataset.state='ready'; rotate();
        } catch (error) { disable3D(error); }
    }
    function info(c) {
        document.getElementById('titulo-molecula').textContent=`${c.name} — ${c.displayFormula}`;
        document.getElementById('descricao-composto').textContent=c.description;
        document.getElementById('detalhe-3d').textContent='Arraste para girar, use a rodinha para zoom ou clique em um átomo.';
        const dl=document.getElementById('ficha'); dl.replaceChildren();
        const mass=new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(c.molarMass);
        for (const [label,value] of [['Fórmula química',c.displayFormula],['Geometria / organização estrutural',c.geometry],['Átomos representados',c.atoms.length],[c.code==='NH4OH'?'Massa molar da fórmula nominal NH₄OH':'Massa molar',`${mass} g/mol`],['Origem dos dados','Cadastro original do autor; modelos didáticos; revisão química pendente']]) {
            const dt=document.createElement('dt'),dd=document.createElement('dd'); dt.textContent=label;dd.textContent=value;dl.append(dt,dd);
        }
        legend.replaceChildren();
        for (const symbol of new Set(c.atoms.map(a=>a.element))) {
            const e=catalog.elements[symbol],item=document.createElement('span'),color=document.createElement('span');
            item.className='item-legenda';color.className='cor-legenda';color.style.backgroundColor=e.color;color.setAttribute('aria-hidden','true');
            item.append(color,`${e.nome} (${symbol})`);legend.append(item);
        }
        const text=document.getElementById('estrutura-textual');text.replaceChildren();
        for (const [i,a] of c.atoms.entries()) {
            const li=document.createElement('li');li.textContent=`Átomo ${i+1}: ${catalog.elements[a.element].nome} (${a.element}), carga formal ${a.charge>0?'+':''}${a.charge}.`;text.append(li);
        }
        const bonds=document.createElement('li');
        bonds.textContent=c.bonds.length?'Ligações: '+c.bonds.map(([a,b,o])=>`${a+1}–${b+1} (${['','simples','dupla','tripla'][o]})`).join('; ')+'.':'Sem ligações covalentes entre os íons representados.';
        text.append(bonds);
    }
    function choose(code,{writeURL=true}={}) {
        selected=byCode.has(code)?code:(byCode.has('NH3')?'NH3':catalog.compounds[0].code);
        select.value=selected; const c=byCode.get(selected);
        info(c);
        // A single explicit event follows the complete textual update.
        document.dispatchEvent(new CustomEvent('compoundchange',{detail:{code:selected,compound:c}}));
        if (writeURL) {
            const url=new URL(location.href);url.searchParams.set('composto',selected);
            try {history.replaceState({compound:selected},'',url);} catch { /* file:// may disallow history changes. */ }
        }
        render3D(c);
    }
    select.addEventListener('change',()=>choose(select.value));
    window.addEventListener('popstate',()=>choose(new URL(location.href).searchParams.get('composto')));
    rotationButton.addEventListener('click',()=>{rotating=!rotating;rotate();});
    resetButton.addEventListener('click',()=>{try {if(viewer&&initialView){viewer.setView(initialView);viewer.render();}} catch(error){disable3D(error);}});
    document.addEventListener('visibilitychange',rotate);
    preference.addEventListener('change',event=>{rotating=!event.matches;rotate();});
    window.addEventListener('resize',()=>{try{viewer?.resize();viewer?.render();}catch(error){disable3D(error);}});
    window.MolecularExplorer={get selectedCode(){return selected;},select:choose};
    // Select the requested compound before attempting to create a WebGL viewer.
    choose(new URL(location.href).searchParams.get('composto'));
    try {
        if (!window.$3Dmol) { disable3D();return; }
        area.replaceChildren();viewer=window.$3Dmol.createViewer(area,{backgroundColor:'#060c18',backgroundAlpha:0});
        rotationButton.disabled=resetButton.disabled=false;
        render3D(byCode.get(selected));
    } catch(error){disable3D(error);}
})();
