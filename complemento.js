/*
 * Explorador Molecular — massa molar e estrutura 2D interativa.
 * Carregue DEPOIS de script.js, antes de </body>.
 * Massas: valores do cadastro Excel enviado pelo autor, em g/mol.
 * São uma cópia local; este arquivo não consulta nem atualiza o SQL Server.
 * Desenhos estruturais didáticos, sem pares de elétrons não ligantes.
 * Referência conceitual para cargas formais e ressonância:
 * https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance
 */
(() => {
    "use strict";

    // Cada átomo: [símbolo, posição X, posição Y, carga formal opcional].
    // Cada ligação: [índice do átomo inicial, índice final, ordem].
    // Os índices começam em zero. As posições são apenas para desenhar em 2D.
    const cadastro = {
        HCl: {
            massa: 36.46,
            atomos: [["H", 230, 150], ["Cl", 370, 150]],
            ligacoes: [[0, 1, 1]],
            nota: "Molécula de cloreto de hidrogênio. A solução aquosa é chamada ácido clorídrico."
        },
        H2SO4: {
            massa: 98.08,
            atomos: [["S",300,150],["O",300,55],["O",300,245],
                ["O",180,150],["H",85,150],["O",420,150],["H",515,150]],
            ligacoes: [[0,1,2],[0,2,2],[0,3,1],[3,4,1],[0,5,1],[5,6,1]],
            nota: "Representação estrutural convencional da molécula isolada. O desenho 2D mostra a conectividade; não representa a geometria espacial."
        },
        NaOH: {
            massa: 40.00,
            atomos: [["Na",145,150,1],["O",365,150,-1],["H",475,150]],
            ligacoes: [[1,2,1]],
            nota: "Íons Na⁺ e OH⁻. A ligação O–H pertence ao hidróxido. O espaço entre os íons é ilustrativo; não representa a rede cristalina."
        },
        HNO3: {
            massa: 63.01,
            atomos: [["N",300,140,1],["O",300,45],["O",420,210,-1],
                ["O",180,210],["H",80,210]],
            ligacoes: [[0,1,2],[0,2,1],[0,3,1],[3,4,1]],
            nota: "Uma forma de ressonância: N com carga formal +1 e O terminal com −1. A distribuição eletrônica real envolve ressonância."
        },
        NH3: {
            massa: 17.03,
            atomos: [["N",300,145],["H",195,215],["H",405,215],["H",300,45]],
            ligacoes: [[0,1,1],[0,2,1],[0,3,1]],
            nota: "Conectividade da amônia. A geometria espacial é piramidal trigonal; o par de elétrons não ligantes não está desenhado."
        },
        NH4OH: {
            massa: 35.05,
            atomos: [["N",170,145],["H",70,210],["H",270,210],["H",170,45],
                ["O",440,145],["H",360,220],["H",520,220]],
            ligacoes: [[0,1,1],[0,2,1],[0,3,1],[4,5,1],[4,6,1]],
            nota: "NH₃ + H₂O ⇌ NH₄⁺ + OH⁻. Assim como o modelo 3D, este desenho mostra NH₃ e H₂O, o lado esquerdo do equilíbrio. Não existe aqui uma molécula isolada de NH₄OH. A massa indicada corresponde à fórmula nominal NH₄OH, não à massa molar da solução."
        },
        NaCl: {
            massa: 58.44,
            atomos: [["Na",200,150,1],["Cl",400,150,-1]],
            ligacoes: [],
            nota: "Íons Na⁺ e Cl⁻ na proporção 1:1. Representação de uma unidade de fórmula, não de uma molécula isolada ou da rede cristalina."
        },
        KCl: {
            massa: 74.55,
            atomos: [["K",200,150,1],["Cl",400,150,-1]],
            ligacoes: [],
            nota: "Íons K⁺ e Cl⁻ na proporção 1:1. Representação de uma unidade de fórmula, não de uma molécula isolada ou da rede cristalina."
        },
        CaOH2: {
            massa: 74.09,
            atomos: [["Ca",120,150,2],["O",350,85,-1],["H",470,85],
                ["O",350,225,-1],["H",470,225]],
            ligacoes: [[1,2,1],[3,4,1]],
            nota: "Um íon Ca²⁺ e dois íons OH⁻. Cada hidróxido possui uma ligação O–H. A separação entre os íons é ilustrativa."
        },
        NH4Cl: {
            massa: 53.49,
            atomos: [["N",210,150,1],["H",210,45],["H",210,255],
                ["H",105,150],["H",315,150],["Cl",485,150,-1]],
            ligacoes: [[0,1,1],[0,2,1],[0,3,1],[0,4,1]],
            nota: "Íons NH₄⁺ e Cl⁻. No amônio, N se liga a quatro H; sua geometria é tetraédrica. O desenho 2D mostra apenas a conectividade."
        },
        HBr: {
            massa: 80.91,
            atomos: [["H",230,150],["Br",370,150]],
            ligacoes: [[0,1,1]],
            nota: "Molécula de brometo de hidrogênio. A solução aquosa é chamada ácido bromídrico."
        },
        HI: {
            massa: 127.91,
            atomos: [["H",230,150],["I",370,150]],
            ligacoes: [[0,1,1]],
            nota: "Molécula de iodeto de hidrogênio. A solução aquosa é chamada ácido iodídrico."
        },
        HF: {
            massa: 20.01,
            atomos: [["H",230,150],["F",370,150]],
            ligacoes: [[0,1,1]],
            nota: "Molécula de fluoreto de hidrogênio. A solução aquosa é chamada ácido fluorídrico."
        },
        HClO4: {
            massa: 100.46,
            atomos: [["Cl",300,150],["O",300,45],["O",300,255],
                ["O",180,150],["O",420,150],["H",525,150]],
            ligacoes: [[0,1,2],[0,2,2],[0,3,2],[0,4,1],[4,5,1]],
            nota: "Representação convencional com três ligações Cl=O e um grupo O–H. A geometria ao redor do cloro é tetraédrica; este desenho mostra a conectividade."
        },
        H2CO3: {
            massa: 62.03,
            atomos: [["C",300,140],["O",300,45],["O",185,210],
                ["H",80,210],["O",415,210],["H",520,210]],
            ligacoes: [[0,1,2],[0,2,1],[2,3,1],[0,4,1],[4,5,1]],
            nota: "Molécula de H₂CO₃: um grupo C=O e dois grupos O–H. O desenho não representa as proporções das espécies em solução."
        },
        H3BO3: {
            massa: 61.83,
            atomos: [["B",300,145],["O",300,60],["H",405,60],
                ["O",180,220],["H",75,220],["O",420,220],["H",525,220]],
            ligacoes: [[0,1,1],[1,2,1],[0,3,1],[3,4,1],[0,5,1],[5,6,1]],
            nota: "B(OH)₃: o boro está ligado a três grupos O–H. A geometria ao redor do boro é trigonal plana."
        },
        HClO: {
            massa: 52.46,
            atomos: [["O",300,115],["H",190,210],["Cl",410,210]],
            ligacoes: [[0,1,1],[0,2,1]],
            nota: "Conectividade H–O–Cl. O oxigênio está entre o hidrogênio e o cloro; a estrutura é angular."
        }
    };

    const nomes = {
        H: "Hidrogênio", B: "Boro", C: "Carbono", N: "Nitrogênio",
        O: "Oxigênio", F: "Flúor", Na: "Sódio", S: "Enxofre",
        Cl: "Cloro", K: "Potássio", Ca: "Cálcio", Br: "Bromo", I: "Iodo"
    };
    // Símbolos e nomes identificam os elementos mesmo sem distinguir as cores.
    const cores = {
        H: "#edf3fc", B: "#ffc1ce", C: "#b9c7dc", N: "#8cbcff",
        O: "#ffa8a8", F: "#d9f99d", Na: "#d8b4fe", S: "#fde68a",
        Cl: "#a7f3d0", K: "#c4b5fd", Ca: "#a5f3fc", Br: "#fdba74", I: "#e9d5ff"
    };
    const NS = "http://www.w3.org/2000/svg";
    const formatoMassa = new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });

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

        const estilo = document.createElement("style");
        estilo.textContent = `
            #painel-estrutura-2d { grid-column: 1 / -1; }
            #painel-estrutura-2d .cabecalho-2d { display:flex; flex-wrap:wrap;
                justify-content:space-between; align-items:center; gap:12px; }
            #painel-estrutura-2d h2 { margin:0; }
            #painel-estrutura-2d .composto-2d { color:#c5d5ed; margin:0; }
            #painel-estrutura-2d .moldura-2d { margin:18px 0; border:1px solid #354766;
                border-radius:14px; background:#0b1220; overflow:hidden; }
            #painel-estrutura-2d svg { display:block; width:100%; max-width:800px;
                height:auto; margin:auto; font-family:'Segoe UI',Arial,sans-serif; }
            #painel-estrutura-2d .atomo-2d { cursor:pointer; outline:none; }
            #painel-estrutura-2d .alvo-2d { fill:#0b1220; stroke:transparent; stroke-width:3; }
            #painel-estrutura-2d .atomo-2d:hover .alvo-2d { stroke:#8bcaff; }
            #painel-estrutura-2d .atomo-2d[aria-pressed="true"] .alvo-2d {
                stroke:#f8fafc; fill:#233c59; }
            #painel-estrutura-2d .atomo-2d:focus-visible .alvo-2d {
                stroke:#fde68a; stroke-dasharray:5 3; }
            #painel-estrutura-2d .detalhe-2d { min-height:3em; padding:14px 16px;
                border:1px solid #405577; border-radius:10px; background:#15243b; color:#f1f5ff; }
            #painel-estrutura-2d .nota-2d { font-size:14px; margin-bottom:0; }
            #massa-molar-complemento { font-weight:700; color:#bfe0ff; }
        `;
        document.head.append(estilo);

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
            // O script original recria a ficha ao trocar o composto.
            dl.querySelectorAll("[data-complemento-massa]").forEach(no => no.remove());
            moldura.replaceChildren();
            painel.querySelector(".composto-2d").textContent = seletor.selectedOptions[0]?.textContent || codigo;
            if (!dados) {
                detalhe.textContent = "Desenho 2D e massa molar ainda não cadastrados para este composto.";
                nota.textContent = "";
                return;
            }
            const termo = document.createElement("dt");
            termo.dataset.complementoMassa = "true";
            termo.textContent = codigo === "NH4OH" ? "Massa molar da fórmula nominal NH₄OH" : "Massa molar";
            const massa = document.createElement("dd");
            massa.dataset.complementoMassa = "true";
            massa.id = "massa-molar-complemento";
            massa.textContent = formatoMassa.format(dados.massa) + " g/mol";
            dl.append(termo, massa);
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
                for (const deslocamento of (ordem === 2 ? [-4,4] : [0])) {
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
        // Aguarda os handlers do visualizador original terminarem a atualização.
        seletor.addEventListener("change", () => queueMicrotask(atualizar));
        atualizar();
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarComplemento, {once:true});
    } else {
        iniciarComplemento();
    }
})();
