const area = document.getElementById("visualizador");
const seletor = document.getElementById("seletor-composto");
const titulo = document.getElementById("titulo-molecula");
const descricao = titulo.nextElementSibling;
const informacoes = document.querySelector(
    'section[aria-labelledby="titulo-informacoes"] dl'
);

// Modelos didáticos: coordenadas aproximadas em angstroms.
// Representam moléculas isoladas, não sua dissociação na água.
const compostos = {
        CaOH2: {
        nome: "Hidróxido de Cálcio",
        formula: "Ca(OH)₂",
        geometria: "Composto iônico — Ca²⁺ e dois OH⁻",
        atomos: 5,
        formato: "sdf",
        simbolos: ["Ca", "O", "H"],
        descricao:
            "Representação de um íon cálcio (Ca²⁺) e dois " +
            "íons hidróxido (OH⁻). Cada hidróxido possui " +
            "uma ligação O–H. As posições são ilustrativas " +
            "e não representam a rede cristalina.",
        estrutura: `Hidroxido de calcio
  Explorador Molecular

  5  2  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 Ca  0  0  0  0  0  0  0  0  0  0  0  0
   -2.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.9700    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.9700    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  2  3  1  0  0  0  0
  4  5  1  0  0  0  0
M  CHG  3   1   2   2  -1   4  -1
M  END
$$$$
`
    },

    NH4Cl: {
        nome: "Cloreto de Amônio",
        formula: "NH₄Cl",
        geometria: "Tetraédrica no íon NH₄⁺",
        atomos: 6,
        formato: "sdf",
        simbolos: ["N", "H", "Cl"],
        descricao:
            "Representação de um íon amônio (NH₄⁺) separado " +
            "de um íon cloreto (Cl⁻). No amônio, o nitrogênio " +
            "está ligado a quatro hidrogênios em disposição " +
            "tetraédrica. Não representa a rede cristalina.",
        estrutura: `Cloreto de amonio
  Explorador Molecular

  6  4  0  0  0  0            999 V2000
   -1.2000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6000    0.6000    0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6000   -0.6000   -0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8000    0.6000   -0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8000   -0.6000    0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
M  CHG  2   1   1   6  -1
M  END
$$$$
`
    },

    NH4OH: {
        nome: "Hidróxido de Amônio — amônia aquosa",
        formula: "NH₄OH (notação usual)",
        geometria: "NH₃ piramidal e H₂O angular",
        atomos: 7,
        formato: "sdf",
        simbolos: ["N", "O", "H"],
        descricao:
            "A solução apresenta o equilíbrio: " +
            "NH₃ + H₂O ⇌ NH₄⁺ + OH⁻. " +
            "Esta cena mostra apenas uma molécula de amônia " +
            "e uma de água, ilustrando o lado esquerdo " +
            "do equilíbrio. Não representa uma molécula " +
            "isolada de NH₄OH nem as proporções da solução.",
        estrutura: `Amonia e agua - esquema didatico
  Explorador Molecular

  7  5  0  0  0  0            999 V2000
   -1.8000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8620    0.0000   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0
   -2.2690    0.8120   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0
   -2.2690   -0.8120   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.8000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.5570    0.5860    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.0430    0.5860    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  5  6  1  0  0  0  0
  5  7  1  0  0  0  0
M  END
$$$$
`
    },
        NaOH: {
        nome: "Hidróxido de Sódio",
        formula: "NaOH",
        geometria: "Composto iônico — íons Na⁺ e OH⁻",
        atomos: 3,
        formato: "sdf",
        simbolos: ["Na", "O", "H"],
        descricao:
            "Representação de um íon sódio (Na⁺) e um íon " +
            "hidróxido (OH⁻). Dentro do hidróxido, oxigênio " +
            "e hidrogênio possuem uma ligação covalente. " +
            "A separação entre os íons é ilustrativa; " +
            "não representa a rede cristalina.",
        estrutura: `Hidroxido de sodio
  Explorador Molecular

  3  1  0  0  0  0            999 V2000
   -1.8000    0.0000    0.0000 Na  0  0  0  0  0  0  0  0  0  0  0  0
    1.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.9700    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  2  3  1  0  0  0  0
M  CHG  2   1   1   2  -1
M  END
$$$$
`
    },
        KCl: {
        nome: "Cloreto de Potássio",
        formula: "KCl",
        geometria: "Composto iônico — sem molécula isolada",
        atomos: 2,
        formato: "sdf",
        simbolos: ["K", "Cl"],
        descricao:
            "Representação de um íon potássio (K⁺) e um íon " +
            "cloreto (Cl⁻), na proporção 1:1. No sólido, " +
            "esses íons formam uma rede cristalina. " +
            "A distância mostrada é apenas ilustrativa.",
        estrutura: `Cloreto de potassio
  Explorador Molecular

  2  0  0  0  0  0            999 V2000
   -1.8000    0.0000    0.0000 K   0  0  0  0  0  0  0  0  0  0  0  0
    1.8000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
M  CHG  2   1   1   2  -1
M  END
$$$$
`
    },
        NaCl: {
        nome: "Cloreto de Sódio",
        formula: "NaCl",
        geometria: "Composto iônico — sem molécula isolada",
        atomos: 2,
        formato: "sdf",
        simbolos: ["Na", "Cl"],
        descricao:
            "Representação de um íon sódio (Na⁺) e um íon " +
            "cloreto (Cl⁻), na proporção 1:1. No sólido, " +
            "esses íons formam uma rede cristalina. " +
            "A distância mostrada é apenas ilustrativa.",
        estrutura: `Cloreto de sodio
  Explorador Molecular

  2  0  0  0  0  0            999 V2000
   -1.8000    0.0000    0.0000 Na  0  0  0  0  0  0  0  0  0  0  0  0
    1.8000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
M  CHG  2   1   1   2  -1
M  END
$$$$
`
    },
        HClO4: {
        nome: "Ácido Perclórico",
        formula: "HClO₄",
        geometria: "Tetraédrica ao redor do cloro",
        atomos: 6,
        formato: "sdf",
        simbolos: ["Cl", "O", "H"],
        descricao:
            "Modelo didático da molécula isolada: um cloro " +
            "ligado a quatro oxigênios, sendo um deles " +
            "pertencente ao grupo OH. Coordenadas aproximadas " +
            "e representação convencional com três ligações " +
            "duplas Cl=O e uma ligação simples Cl–OH.",
        estrutura: `Acido perclorico
  Explorador Molecular

  6  5  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
    0.8200    0.8200    0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.8200   -0.8200   -0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8200    0.8200   -0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.9500   -0.9500    0.9500 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8800   -0.6900    0.8700 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  1  3  2  0  0  0  0
  1  4  2  0  0  0  0
  1  5  1  0  0  0  0
  5  6  1  0  0  0  0
M  END
$$$$
`
    },
        HNO3: {
        nome: "Ácido Nítrico",
        formula: "HNO₃",
        geometria: "Trigonal plana ao redor do nitrogênio",
        atomos: 5,
        formato: "sdf",
        simbolos: ["N", "O", "H"],
        descricao:
            "Modelo didático da molécula isolada, com coordenadas " +
            "aproximadas. Mostra uma das formas de ressonância: " +
            "o nitrogênio tem carga formal +1 e um oxigênio, −1. " +
            "A distribuição real das ligações envolve ressonância.",
        estrutura: `Acido nitrico
  Explorador Molecular

  5  4  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    1.2100    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.0800   -0.6200    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.2000   -0.6900    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.0300   -0.1900    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  4  5  1  0  0  0  0
M  CHG  2   1   1   3  -1
M  END
$$$$
`
    },
        H2SO4: {
        nome: "Ácido Sulfúrico",
        formula: "H₂SO₄",
        geometria: "Tetraédrica ao redor do enxofre",
        atomos: 7,
        formato: "sdf",
        simbolos: ["S", "O", "H"],
        descricao:
            "O enxofre está ligado a quatro oxigênios, " +
            "dois deles pertencentes a grupos OH. " +
            "Modelo didático da molécula isolada, com coordenadas " +
            "aproximadas e representação convencional das ligações.",
        estrutura: `Acido sulfurico
  Explorador Molecular

  7  6  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0
    0.8200    0.8200    0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.8200   -0.8200   -0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.9100    0.9100   -0.9100 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.9100   -0.9100    0.9100 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8400    0.6500   -0.8300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8400   -0.6500    0.8300 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  1  3  2  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  4  6  1  0  0  0  0
  5  7  1  0  0  0  0
M  END
$$$$
`
    },
        H2CO3: {
        nome: "Ácido Carbônico",
        formula: "H₂CO₃",
        geometria: "Trigonal plana ao redor do carbono",
        atomos: 6,
        formato: "sdf",
        simbolos: ["C", "O", "H"],
        descricao:
            "Um carbono ligado a um oxigênio por ligação dupla " +
            "e a dois grupos OH por ligações simples. " +
            "Modelo didático com coordenadas aproximadas.",
        estrutura: `Acido carbonico
  Explorador Molecular

  6  5  0  0  0  0            999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    1.2000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.1600   -0.6700    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.1600   -0.6700    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.9900   -0.1800    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.9900   -0.1800    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  3  5  1  0  0  0  0
  4  6  1  0  0  0  0
M  END
$$$$
`
    },
        H3BO3: {
        nome: "Ácido Bórico",
        formula: "H₃BO₃",
        geometria: "Trigonal plana ao redor do boro",
        atomos: 7,
        descricao:
            "Um átomo de boro ligado a três grupos OH. " +
            "Modelo didático com coordenadas aproximadas; " +
            "pares de elétrons não ligantes não exibidos.",
        estrutura: `7
Acido borico - modelo aproximado
B    0.000   0.000   0.000
O    1.360   0.000   0.000
H    1.700   0.900   0.000
O   -0.680   1.178   0.000
H   -1.629   1.022   0.000
O   -0.680  -1.178   0.000
H   -0.071  -1.922   0.000
`
    },
        HClO: {
        nome: "Ácido Hipocloroso",
        formula: "HClO",
        geometria: "Angular",
        atomos: 3,
        descricao:
            "O oxigênio liga o hidrogênio ao cloro, formando " +
            "uma estrutura angular. Modelo didático com " +
            "coordenadas aproximadas; pares não ligantes não exibidos.",
        estrutura: `3
Acido hipocloroso - modelo aproximado
O    0.000   0.000   0.000
H    0.970   0.000   0.000
Cl  -0.400   1.642   0.000
`
    },
    NH3: {
        nome: "Amônia",
        formula: "NH₃",
        geometria: "Piramidal trigonal",
        atomos: 4,
        descricao:
            "Um nitrogênio ligado a três hidrogênios. " +
            "O par de elétrons não ligantes não está representado.",
        estrutura: `4
Amonia
N   0.000   0.000   0.000
H   0.938   0.000  -0.381
H  -0.469   0.812  -0.381
H  -0.469  -0.812  -0.381
`
    },

    HCl: {
        nome: "Ácido Clorídrico",
        formula: "HCl",
        geometria: "Linear",
        atomos: 2,
        descricao:
            "Modelo da molécula de cloreto de hidrogênio. " +
            "Sua solução aquosa é chamada ácido clorídrico.",
        estrutura: `2
Cloreto de hidrogenio
H    0.000   0.000   0.000
Cl   1.275   0.000   0.000
`
    },

    HF: {
        nome: "Ácido Fluorídrico",
        formula: "HF",
        geometria: "Linear",
        atomos: 2,
        descricao:
            "Modelo da molécula de fluoreto de hidrogênio. " +
            "Sua solução aquosa é chamada ácido fluorídrico.",
        estrutura: `2
Fluoreto de hidrogenio
H   0.000   0.000   0.000
F   0.917   0.000   0.000
`
    },

    HBr: {
        nome: "Ácido Bromídrico",
        formula: "HBr",
        geometria: "Linear",
        atomos: 2,
        descricao:
            "Modelo da molécula de brometo de hidrogênio. " +
            "Sua solução aquosa é chamada ácido bromídrico.",
        estrutura: `2
Brometo de hidrogenio
H    0.000   0.000   0.000
Br   1.414   0.000   0.000
`
    },

    HI: {
        nome: "Ácido Iodídrico",
        formula: "HI",
        geometria: "Linear",
        atomos: 2,
        descricao:
            "Modelo da molécula de iodeto de hidrogênio. " +
            "Sua solução aquosa é chamada ácido iodídrico.",
        estrutura: `2
Iodeto de hidrogenio
H   0.000   0.000   0.000
I   1.609   0.000   0.000
`
    }
};

// Cores e tamanhos usados para desenhar os átomos.
const elementos = { 
    Ca: { nome: "Cálcio", color: "#0891b2", raio: 0.45 },
    K: { nome: "Potássio", color: "#7c3aed", raio: 0.43 },
    Na: { nome: "Sódio", color: "#a855f7", raio: 0.35 },
    S: { nome: "Enxofre", color: "#eab308", raio: 0.44 },
    C: { nome: "Carbono", color: "#475569", raio: 0.38 },
    B: { nome: "Boro", color: "#d97786", raio: 0.38 },
    O: { nome: "Oxigênio", color: "#ef4444", raio: 0.35 },
    H:  { nome: "Hidrogênio", color: "#cbd5e1", raio: 0.25 },
    N:  { nome: "Nitrogênio", color: "#2563eb", raio: 0.38 },
    Cl: { nome: "Cloro",      color: "#16a34a", raio: 0.43 },
    F:  { nome: "Flúor",      color: "#84cc16", raio: 0.32 },
    Br: { nome: "Bromo",      color: "#b45309", raio: 0.46 },
    I:  { nome: "Iodo",       color: "#9333ea", raio: 0.50 }
};

function iniciarExplorador() {
    if (typeof $3Dmol === "undefined") {
        area.textContent =
            "Não foi possível carregar o 3D. Confira a internet e atualize.";
        return;
    }

    area.replaceChildren();

    const visualizador = $3Dmol.createViewer(area, {
    backgroundColor: "#060c18",
    backgroundAlpha: 0
});

// O fundo transparente permite enxergar as estrelas do CSS.
visualizador.setBackgroundColor("#060c18", 0);

// Respeita a preferência de reduzir animações do computador.
const preferenciaMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let rotacaoAtiva = !preferenciaMovimento.matches;

const botaoRotacao = document.createElement("button");
botaoRotacao.type = "button";
area.after(botaoRotacao);

function atualizarRotacao() {
    // Encerra qualquer rotação anterior.
    visualizador.spin(false);

    if (rotacaoAtiva && !document.hidden) {
        // Gira lentamente ao redor do eixo vertical da tela.
        visualizador.spin("vy", 0.35);
    }

    botaoRotacao.textContent = rotacaoAtiva
        ? "Pausar rotação"
        : "Iniciar rotação";

    botaoRotacao.setAttribute(
        "aria-pressed",
        String(rotacaoAtiva)
    );
}

botaoRotacao.addEventListener("click", function () {
    rotacaoAtiva = !rotacaoAtiva;
    atualizarRotacao();
});

// Evita manter a animação rodando quando a aba está oculta.
document.addEventListener("visibilitychange", atualizarRotacao);

preferenciaMovimento.addEventListener("change", function (evento) {
    rotacaoAtiva = !evento.matches;
    atualizarRotacao();
});

atualizarRotacao();

    // Instruções abaixo da área 3D.
    const instrucoes = document.createElement("p");
    instrucoes.textContent =
        "Arraste para girar • Use a rodinha para zoom • Clique em um átomo";
    area.after(instrucoes);
    const legenda = document.createElement("div");
legenda.className = "legenda";

area.before(legenda);
    const botaoRestaurar = document.createElement("button");

botaoRestaurar.textContent = "Restaurar visualização";
botaoRestaurar.type = "button";

instrucoes.after(botaoRestaurar);

    function mostrarComposto(codigo) {
        const composto = compostos[codigo];

        if (!composto) return;
        // Obtém os elementos presentes no modelo XYZ.
const linhas = composto.estrutura.trim().split("\n").slice(2);

const simbolos = composto.simbolos || [...new Set(
    linhas.map(linha => linha.trim().split(/\s+/)[0])
)];

legenda.replaceChildren();

simbolos.forEach(function (simbolo) {
    const elemento = elementos[simbolo];

    const item = document.createElement("span");
    item.className = "item-legenda";

    const cor = document.createElement("span");
    cor.className = "cor-legenda";
    cor.style.backgroundColor = elemento.color;
    cor.setAttribute("aria-hidden", "true");

    item.append(cor, `${elemento.nome} (${simbolo})`);
    legenda.append(item);
});

        // Atualiza os textos da página.
        titulo.textContent = `${composto.nome} — ${composto.formula}`;
        descricao.textContent = composto.descricao;

        informacoes.replaceChildren();

        const campos = [
        ["Fórmula química", composto.formula],
        ["Geometria / organização estrutural", composto.geometria],
        ["Átomos representados", composto.atomos]
];

        campos.forEach(function ([nome, valor]) {
            const termo = document.createElement("dt");
            const detalhe = document.createElement("dd");

            termo.textContent = nome;
            detalhe.textContent = valor;

            informacoes.append(termo, detalhe);
        });

        // Limpa a molécula e os rótulos anteriores.
        visualizador.removeAllModels();
        visualizador.removeAllLabels();

       visualizador.addModel(
    composto.estrutura,
    composto.formato || "xyz"
);

        // Aplica a aparência de cada elemento.
        Object.entries(elementos).forEach(function ([simbolo, dados]) {
            visualizador.setStyle(
                { elem: simbolo },
                {
                   sphere: {
    radius: dados.raio * 1.15,
    color: dados.color
},
stick: {
    radius: 0.085,
    color: dados.color
}
                }
            );
        });

        // Permite clicar nos átomos para identificá-los.
        visualizador.setClickable({}, true, function (atomo) {
            const elemento = elementos[atomo.elem];

            visualizador.removeAllLabels();

            visualizador.addLabel(
                `${elemento.nome} (${atomo.elem})${
    atomo.properties?.formalCharge
        ? " | Carga formal: " +
          (atomo.properties.formalCharge > 0 ? "+" : "") +
          atomo.properties.formalCharge
        : ""
}`,
                {
                    position: {
                        x: atomo.x,
                        y: atomo.y,
                        z: atomo.z
                    },
                    backgroundColor: "#16324f",
                    fontColor: "white",
                    fontSize: 16,
                    showBackground: true
                }
            );

            visualizador.render();
        });

        visualizador.zoomTo();
        visualizador.render();

// Guarda a posição inicial desta molécula.
const vistaInicial = visualizador.getView();

botaoRestaurar.onclick = function () {
    visualizador.setView(vistaInicial);
    visualizador.render();
};
    }

    // Executa a troca quando você escolhe uma opção.
    seletor.addEventListener("change", function () {
        mostrarComposto(seletor.value);
    });

    window.addEventListener("resize", function () {
        visualizador.resize();
        visualizador.render();
    });

    // Mostra a opção selecionada ao abrir a página.
    // Lê o composto informado no endereço da página.
const parametros = new URLSearchParams(window.location.search);
const compostoSolicitado = parametros.get("composto");

// Só aceita valores que existem no seletor.
const opcaoExiste = Array.from(seletor.options).some(
    opcao => opcao.value === compostoSolicitado
);

if (opcaoExiste) {
    seletor.value = compostoSolicitado;
}

mostrarComposto(seletor.value);
}

try {
    iniciarExplorador();
} catch (erro) {
    area.textContent =
        "Não foi possível iniciar o explorador. Veja o console do navegador.";
    console.error(erro);
}