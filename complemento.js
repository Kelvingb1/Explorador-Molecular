/* Estrutura 2D derivada do mesmo grafo do catálogo 3D. */
(() => {
    "use strict";

    // Cada átomo: [símbolo, posição X, posição Y, carga formal opcional].
    // Cada ligação: [índice do átomo inicial, índice final, ordem].
    // Os índices começam em zero. As posições são apenas para desenhar em 2D.
    const catalog = window.MolecularCatalog;
    const cadastro = Object.fromEntries(catalog.compounds.map(c => [c.code, {
        atomos: c.atoms.map(a => [a.element, ...a.position2D, a.charge]),
        ligacoes: c.bonds, nota: c.note
    }]));
    const nomes = Object.fromEntries(Object.entries(catalog.elements).map(([s,e]) => [s,e.nome]));
    const cores = Object.fromEntries(Object.entries(catalog.elements).map(([s,e]) => [s,e.textColor]));
    const NS = "http://www.w3.org/2000/svg";
    function svgElemento(nome, atributos = {}, texto) {
        const no = document.createElementNS(NS, nome);
        Object.entries(atributos).forEach(([chave, valor]) => no.setAttribute(chave, valor));
        if (texto !== undefined) no.textContent = texto;
        return no;
    }

    function iniciarComplemento() {
        const seletor = document.getElementById("seletor-composto");
        const main = document.querySelector("main");
        const dl = document.querySelector('section[aria-labelledby="titulo-informacoes"] dl');
        if (!seletor || !main || !dl || document.getElementById("painel-estrutura-2d")) return;

        const painel = document.createElement("section");
        painel.id = "painel-estrutura-2d";
        painel.setAttribute("aria-labelledby", "titulo-estrutura-2d");
        // Somente marcação fixa; nenhum parâmetro da URL é inserido como HTML.
        painel.innerHTML = `
            <div class="cabecalho-2d">
                <h2 id="titulo-estrutura-2d">Estrutura 2D interativa</h2>
                <p class="composto-2d"></p>
            </div>
            <p>Clique em um átomo para identificá-lo. No teclado, use Tab e Enter ou Espaço.</p>
            <div class="moldura-2d"></div>
            <p class="detalhe-2d" role="status" aria-live="polite" aria-atomic="true"></p>
            <p class="nota-2d"></p>
        `;
        main.append(painel);

        function atualizar() {
            const codigo = seletor.value;
            const dados = Object.prototype.hasOwnProperty.call(cadastro, codigo) ? cadastro[codigo] : null;
            const moldura = painel.querySelector(".moldura-2d");
            const detalhe = painel.querySelector(".detalhe-2d");
            const nota = painel.querySelector(".nota-2d");
            moldura.replaceChildren();
            painel.querySelector(".composto-2d").textContent = seletor.selectedOptions[0]?.textContent || codigo;
            if (!dados) {
                detalhe.textContent = "Desenho 2D e massa molar ainda não cadastrados para este composto.";
                nota.textContent = "";
                return;
            }
            detalhe.textContent = "Selecione um átomo no desenho.";
            nota.textContent = dados.nota + " Pares de elétrons não ligantes não exibidos.";

            const svg = svgElemento("svg", {
                viewBox: "0 0 600 310", role: "group",
                "aria-labelledby": "nome-desenho-2d"
            });
            svg.append(svgElemento("title", {id:"nome-desenho-2d"},
                "Estrutura 2D: " + seletor.selectedOptions[0].textContent));

            for (const [inicio, fim, ordem] of dados.ligacoes) {
                const [,x1,y1] = dados.atomos[inicio];
                const [,x2,y2] = dados.atomos[fim];
                const comprimento = Math.hypot(x2-x1, y2-y1);
                const ux = (x2-x1)/comprimento, uy = (y2-y1)/comprimento;
                for (const deslocamento of (ordem === 3 ? [-7,0,7] : ordem === 2 ? [-4,4] : [0])) {
                    svg.append(svgElemento("line", {
                        x1:x1+27*ux-deslocamento*uy, y1:y1+27*uy+deslocamento*ux,
                        x2:x2-27*ux-deslocamento*uy, y2:y2-27*uy+deslocamento*ux,
                        stroke:"#c5d5ed", "stroke-width":3, "stroke-linecap":"round",
                        "aria-hidden":"true"
                    }));
                }
            }

            dados.atomos.forEach(([simbolo,x,y,carga=0],indice) => {
                const cargaTexto = carga > 0 ? "+"+carga : String(carga).replace("-","−");
                const grupo = svgElemento("g", {
                    class:"atomo-2d", transform:`translate(${x},${y})`,
                    role:"button", tabindex:0, "aria-pressed":"false",
                    "aria-label":`${nomes[simbolo]} (${simbolo}), átomo ${indice+1}, carga formal ${cargaTexto}`,
                    "data-simbolo":simbolo, "data-carga":carga
                });
                grupo.append(svgElemento("circle", {r:25,class:"alvo-2d"}));
                grupo.append(svgElemento("text", {
                    "text-anchor":"middle", "dominant-baseline":"central",
                    "font-size":25, "font-weight":600, fill:cores[simbolo], "aria-hidden":"true"
                }, simbolo));
                if (carga) {
                    const sinal = carga > 0 ? "+" : "−";
                    const rotulo = (Math.abs(carga) === 1 ? "" : Math.abs(carga)) + sinal;
                    grupo.append(svgElemento("text", {
                        x:simbolo.length===1?14:22, y:-17, "font-size":16,
                        fill:"#f1f5ff", "aria-hidden":"true"
                    }, rotulo));
                }
                function selecionar() {
                    svg.querySelectorAll(".atomo-2d").forEach(no => no.setAttribute("aria-pressed","false"));
                    grupo.setAttribute("aria-pressed","true");
                    const quantidade = dados.atomos.filter(a => a[0] === simbolo).length;
                    detalhe.textContent = `${nomes[simbolo]} (${simbolo}) — carga formal: ${cargaTexto}. `+
                        `Átomos deste elemento no desenho: ${quantidade}.`;
                }
                grupo.addEventListener("click", selecionar);
                grupo.addEventListener("keydown", evento => {
                    if (evento.key === "Enter" || evento.key === " ") {
                        evento.preventDefault(); selecionar();
                    }
                });
                svg.append(grupo);
            });
            moldura.append(svg);
        }
        document.addEventListener("compoundchange", atualizar);
        atualizar();
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarComplemento, {once:true});
    } else {
        iniciarComplemento();
    }
})();
