// DOM mínimo para testes de integração do controlador. Não substitui um navegador.
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import {root} from '../tools/catalog.mjs';
class Target {
    events=new Map();
    addEventListener(type,listener){const list=this.events.get(type)||[];list.push(listener);this.events.set(type,list);}
    dispatchEvent(event){for(const fn of this.events.get(event.type)||[])fn(event);return true;}
}
class Element extends Target {
    children=[];attributes={};dataset={};style={};textContent='';disabled=false;value='';
    constructor(tag,document){super();this.tagName=tag;this.document=document;}
    append(...nodes){for(const node of nodes){if(typeof node!=='object')continue;node.parent=this;this.children.push(node);if(node.id)this.document.ids.set(node.id,node);}}
    add(node){this.append(node);}
    replaceChildren(...nodes){this.children=[];this.append(...nodes);}
    setAttribute(key,value){this.attributes[key]=String(value);if(key==='class')this.className=value;if(key==='id'){this.id=value;this.document.ids.set(value,this);}}
    getAttribute(key){return this.attributes[key]??null;}
    get options(){return this.children;}
    get selectedOptions(){return this.children.filter(n=>n.value===this.value);}
    querySelectorAll(selector){const all=[];const walk=n=>{for(const child of n.children){if((selector.startsWith('.')&&child.className?.split(' ').includes(selector.slice(1)))||child.tagName===selector)all.push(child);walk(child);}};walk(this);return all;}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
    set innerHTML(value){this.children=[];for(const match of value.matchAll(/<(div|p|h2)[^>]*(?:class="([^"]+)"|id="([^"]+)")[^>]*>/g)){const e=new Element(match[1],this.document);if(match[2])e.className=match[2];if(match[3])e.setAttribute('id',match[3]);this.append(e);}}
}
export function app({query='',engine='missing',reduced=false}={}){
    const document=new Target();document.ids=new Map();document.readyState='complete';document.hidden=false;
    document.createElement=tag=>new Element(tag,document);document.createElementNS=(_,tag)=>document.createElement(tag);
    document.getElementById=id=>document.ids.get(id)||null;
    const main=document.createElement('main'),dl=document.createElement('dl');
    document.querySelector=selector=>selector==='main'?main:selector.includes(' dl')?dl:null;
    for(const id of ['visualizador','seletor-composto','titulo-molecula','descricao-composto','rotacao','restaurar','legenda','detalhe-3d','estrutura-textual']){const e=document.createElement(id==='seletor-composto'?'select':'div');e.setAttribute('id',id);main.append(e);}
    dl.setAttribute('id','ficha');main.append(dl);
    const preference=new Target();preference.matches=reduced;
    const state={spins:[],model:null,rendered:0,errors:[],view:[0,1,2],resets:0};
    const location={href:'http://localhost:5500/index.html'+query};
    const window=new Target();window.document=document;window.location=location;window.matchMedia=()=>preference;
    if(engine!=='missing')window.$3Dmol={createViewer:()=>{if(engine==='create-failure')throw Error('WebGL indisponível');return {
        removeAllModels(){state.model=null;},removeAllLabels(){},
        addModel(s,format,options){if(engine==='model-failure')throw Error('modelo inválido');state.model={s,format,options};return {selectedAtoms:()=>Array(Number(s.split('\n')[3].slice(0,3))).fill({})};},
        setStyle(){},setClickable(_,__,fn){state.click=fn;},zoomTo(){},render(){state.rendered++;},getView(){return state.view;},setView(view){state.resets++;state.view=view;},spin(value){state.spins.push(value);},resize(){},addLabel(){}
    };}};
    const context=vm.createContext({window,document,location,URL,URLSearchParams,Intl,console:{error:(...args)=>state.errors.push(args)},Option:function(text,value){const e=document.createElement('option');e.textContent=text;e.value=value;return e;},CustomEvent:function(type,{detail}){this.type=type;this.detail=detail;},history:{replaceState:(_,__,url)=>{location.href=String(url);}}});
    for(const file of ['catalog.js','complemento.js','script.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
    return {document,window,state,preference,location,select:code=>{const select=document.getElementById('seletor-composto');select.value=code;select.dispatchEvent({type:'change'});}};
}
