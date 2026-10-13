// GERADO; não editar.
window.MolecularCatalog = {
  "hash": "b5a5198761fb34d54976319794a2e5de39e09cec74d8e5bab15698bc8d035add",
  "elements": {
    "Ca": {
      "nome": "Cálcio",
      "color": "#0891b2",
      "raio": 0.45,
      "textColor": "#a5f3fc"
    },
    "K": {
      "nome": "Potássio",
      "color": "#7c3aed",
      "raio": 0.43,
      "textColor": "#c4b5fd"
    },
    "Na": {
      "nome": "Sódio",
      "color": "#a855f7",
      "raio": 0.35,
      "textColor": "#d8b4fe"
    },
    "S": {
      "nome": "Enxofre",
      "color": "#eab308",
      "raio": 0.44,
      "textColor": "#fde68a"
    },
    "C": {
      "nome": "Carbono",
      "color": "#475569",
      "raio": 0.38,
      "textColor": "#b9c7dc"
    },
    "B": {
      "nome": "Boro",
      "color": "#d97786",
      "raio": 0.38,
      "textColor": "#ffc1ce"
    },
    "O": {
      "nome": "Oxigênio",
      "color": "#ef4444",
      "raio": 0.35,
      "textColor": "#ffa8a8"
    },
    "H": {
      "nome": "Hidrogênio",
      "color": "#cbd5e1",
      "raio": 0.25,
      "textColor": "#edf3fc"
    },
    "N": {
      "nome": "Nitrogênio",
      "color": "#2563eb",
      "raio": 0.38,
      "textColor": "#8cbcff"
    },
    "Cl": {
      "nome": "Cloro",
      "color": "#16a34a",
      "raio": 0.43,
      "textColor": "#a7f3d0"
    },
    "F": {
      "nome": "Flúor",
      "color": "#84cc16",
      "raio": 0.32,
      "textColor": "#d9f99d"
    },
    "Br": {
      "nome": "Bromo",
      "color": "#b45309",
      "raio": 0.46,
      "textColor": "#fdba74"
    },
    "I": {
      "nome": "Iodo",
      "color": "#9333ea",
      "raio": 0.5,
      "textColor": "#e9d5ff"
    }
  },
  "compounds": [
    {
      "id": 1,
      "code": "HCl",
      "formula": "HCl",
      "displayFormula": "HCl",
      "name": "Ácido Clorídrico",
      "molarMass": 36.46,
      "geometry": "Linear",
      "description": "Modelo da molécula de cloreto de hidrogênio. Sua solução aquosa é chamada ácido clorídrico.",
      "note": "Molécula de cloreto de hidrogênio. A solução aquosa é chamada ácido clorídrico.",
      "imageFile": "1.jpg",
      "atoms": [
        {
          "element": "H",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            230,
            150
          ],
          "charge": 0
        },
        {
          "element": "Cl",
          "position3D": [
            1.275,
            0,
            0
          ],
          "position2D": [
            370,
            150
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "HCl\n  Explorador Molecular\n\n  2  1  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.2750    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 2,
      "code": "H2SO4",
      "formula": "H2SO4",
      "displayFormula": "H₂SO₄",
      "name": "Ácido Sulfúrico",
      "molarMass": 98.08,
      "geometry": "Tetraédrica ao redor do enxofre",
      "description": "O enxofre está ligado a quatro oxigênios, dois deles pertencentes a grupos OH. Modelo didático da molécula isolada, com coordenadas aproximadas e representação convencional das ligações.",
      "note": "Representação estrutural convencional da molécula isolada. O desenho 2D mostra a conectividade; não representa a geometria espacial.",
      "imageFile": "2.jpg",
      "atoms": [
        {
          "element": "S",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            300,
            150
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            0.82,
            0.82,
            0.82
          ],
          "position2D": [
            300,
            55
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            0.82,
            -0.82,
            -0.82
          ],
          "position2D": [
            300,
            245
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            -0.91,
            0.91,
            -0.91
          ],
          "position2D": [
            180,
            150
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            -0.91,
            -0.91,
            0.91
          ],
          "position2D": [
            420,
            150
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -1.84,
            0.65,
            -0.83
          ],
          "position2D": [
            85,
            150
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -1.84,
            -0.65,
            0.83
          ],
          "position2D": [
            515,
            150
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          2
        ],
        [
          0,
          2,
          2
        ],
        [
          0,
          3,
          1
        ],
        [
          0,
          4,
          1
        ],
        [
          3,
          5,
          1
        ],
        [
          4,
          6,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "H2SO4\n  Explorador Molecular\n\n  7  6  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n    0.8200    0.8200    0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.8200   -0.8200   -0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.9100    0.9100   -0.9100 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.9100   -0.9100    0.9100 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.8400    0.6500   -0.8300 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.8400   -0.6500    0.8300 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  2  0  0  0  0\n  1  4  1  0  0  0  0\n  1  5  1  0  0  0  0\n  4  6  1  0  0  0  0\n  5  7  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 3,
      "code": "NaOH",
      "formula": "NaOH",
      "displayFormula": "NaOH",
      "name": "Hidróxido de Sódio",
      "molarMass": 40,
      "geometry": "Composto iônico — íons Na⁺ e OH⁻",
      "description": "Representação de um íon sódio (Na⁺) e um íon hidróxido (OH⁻). Dentro do hidróxido, oxigênio e hidrogênio possuem uma ligação covalente. A separação entre os íons é ilustrativa; não representa a rede cristalina.",
      "note": "Íons Na⁺ e OH⁻. A ligação O–H pertence ao hidróxido. O espaço entre os íons é ilustrativo; não representa a rede cristalina.",
      "imageFile": "3.jpg",
      "atoms": [
        {
          "element": "Na",
          "position3D": [
            -1.8,
            0,
            0
          ],
          "position2D": [
            145,
            150
          ],
          "charge": 1
        },
        {
          "element": "O",
          "position3D": [
            1,
            0,
            0
          ],
          "position2D": [
            365,
            150
          ],
          "charge": -1
        },
        {
          "element": "H",
          "position3D": [
            1.97,
            0,
            0
          ],
          "position2D": [
            475,
            150
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          1,
          2,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "NaOH\n  Explorador Molecular\n\n  3  1  0  0  0  0            999 V2000\n   -1.8000    0.0000    0.0000 Na  0  0  0  0  0  0  0  0  0  0  0  0\n    1.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9700    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  2  3  1  0  0  0  0\nM  CHG  2   1   1   2  -1\nM  END\n$$$$\n"
    },
    {
      "id": 4,
      "code": "HNO3",
      "formula": "HNO3",
      "displayFormula": "HNO₃",
      "name": "Ácido Nítrico",
      "molarMass": 63.01,
      "geometry": "Trigonal plana ao redor do nitrogênio",
      "description": "Modelo didático da molécula isolada, com coordenadas aproximadas. Mostra uma das formas de ressonância: o nitrogênio tem carga formal +1 e um oxigênio, −1. A distribuição real das ligações envolve ressonância.",
      "note": "Uma forma de ressonância: N com carga formal +1 e O terminal com −1. A distribuição eletrônica real envolve ressonância.",
      "imageFile": "4.jpg",
      "atoms": [
        {
          "element": "N",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            300,
            140
          ],
          "charge": 1
        },
        {
          "element": "O",
          "position3D": [
            0,
            1.21,
            0
          ],
          "position2D": [
            300,
            45
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            1.08,
            -0.62,
            0
          ],
          "position2D": [
            420,
            210
          ],
          "charge": -1
        },
        {
          "element": "O",
          "position3D": [
            -1.2,
            -0.69,
            0
          ],
          "position2D": [
            180,
            210
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -2.03,
            -0.19,
            0
          ],
          "position2D": [
            80,
            210
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          2
        ],
        [
          0,
          2,
          1
        ],
        [
          0,
          3,
          1
        ],
        [
          3,
          4,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "HNO3\n  Explorador Molecular\n\n  5  4  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    1.2100    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.0800   -0.6200    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.2000   -0.6900    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.0300   -0.1900    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  4  5  1  0  0  0  0\nM  CHG  2   1   1   3  -1\nM  END\n$$$$\n"
    },
    {
      "id": 5,
      "code": "NH3",
      "formula": "NH3",
      "displayFormula": "NH₃",
      "name": "Amônia",
      "molarMass": 17.03,
      "geometry": "Piramidal trigonal",
      "description": "Um nitrogênio ligado a três hidrogênios. O par de elétrons não ligantes não está representado.",
      "note": "Conectividade da amônia. A geometria espacial é piramidal trigonal; o par de elétrons não ligantes não está desenhado.",
      "imageFile": "5.jpg",
      "atoms": [
        {
          "element": "N",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            300,
            145
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            0.938,
            0,
            -0.381
          ],
          "position2D": [
            195,
            215
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -0.469,
            0.812,
            -0.381
          ],
          "position2D": [
            405,
            215
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -0.469,
            -0.812,
            -0.381
          ],
          "position2D": [
            300,
            45
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ],
        [
          0,
          2,
          1
        ],
        [
          0,
          3,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "NH3\n  Explorador Molecular\n\n  4  3  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    0.9380    0.0000   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.4690    0.8120   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.4690   -0.8120   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 6,
      "code": "NH4OH",
      "formula": "NH4OH",
      "displayFormula": "NH₄OH (notação usual)",
      "name": "Hidróxido de Amônio",
      "molarMass": 35.05,
      "geometry": "NH₃ piramidal e H₂O angular",
      "description": "A solução apresenta o equilíbrio: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻. Esta cena mostra apenas uma molécula de amônia e uma de água, ilustrando o lado esquerdo do equilíbrio. Não representa uma molécula isolada de NH₄OH nem as proporções da solução.",
      "note": "NH₃ + H₂O ⇌ NH₄⁺ + OH⁻. Assim como o modelo 3D, este desenho mostra NH₃ e H₂O, o lado esquerdo do equilíbrio. Não existe aqui uma molécula isolada de NH₄OH. A massa indicada corresponde à fórmula nominal NH₄OH, não à massa molar da solução.",
      "imageFile": "6.jpg",
      "atoms": [
        {
          "element": "N",
          "position3D": [
            -1.8,
            0,
            0
          ],
          "position2D": [
            170,
            145
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -0.862,
            0,
            -0.381
          ],
          "position2D": [
            70,
            210
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -2.269,
            0.812,
            -0.381
          ],
          "position2D": [
            270,
            210
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -2.269,
            -0.812,
            -0.381
          ],
          "position2D": [
            170,
            45
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            1.8,
            0,
            0
          ],
          "position2D": [
            440,
            145
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            2.557,
            0.586,
            0
          ],
          "position2D": [
            360,
            220
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            1.043,
            0.586,
            0
          ],
          "position2D": [
            520,
            220
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ],
        [
          0,
          2,
          1
        ],
        [
          0,
          3,
          1
        ],
        [
          4,
          5,
          1
        ],
        [
          4,
          6,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "NH4OH\n  Explorador Molecular\n\n  7  5  0  0  0  0            999 V2000\n   -1.8000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.8620    0.0000   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.2690    0.8120   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.2690   -0.8120   -0.3810 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.5570    0.5860    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.0430    0.5860    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  5  6  1  0  0  0  0\n  5  7  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 7,
      "code": "NaCl",
      "formula": "NaCl",
      "displayFormula": "NaCl",
      "name": "Cloreto de Sódio",
      "molarMass": 58.44,
      "geometry": "Composto iônico — sem molécula isolada",
      "description": "Representação de um íon sódio (Na⁺) e um íon cloreto (Cl⁻), na proporção 1:1. No sólido, esses íons formam uma rede cristalina. A distância mostrada é apenas ilustrativa.",
      "note": "Íons Na⁺ e Cl⁻ na proporção 1:1. Representação de uma unidade de fórmula, não de uma molécula isolada ou da rede cristalina.",
      "imageFile": "7.jpg",
      "atoms": [
        {
          "element": "Na",
          "position3D": [
            -1.8,
            0,
            0
          ],
          "position2D": [
            200,
            150
          ],
          "charge": 1
        },
        {
          "element": "Cl",
          "position3D": [
            1.8,
            0,
            0
          ],
          "position2D": [
            400,
            150
          ],
          "charge": -1
        }
      ],
      "bonds": [],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "NaCl\n  Explorador Molecular\n\n  2  0  0  0  0  0            999 V2000\n   -1.8000    0.0000    0.0000 Na  0  0  0  0  0  0  0  0  0  0  0  0\n    1.8000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\nM  CHG  2   1   1   2  -1\nM  END\n$$$$\n"
    },
    {
      "id": 8,
      "code": "KCl",
      "formula": "KCl",
      "displayFormula": "KCl",
      "name": "Cloreto de Potássio",
      "molarMass": 74.55,
      "geometry": "Composto iônico — sem molécula isolada",
      "description": "Representação de um íon potássio (K⁺) e um íon cloreto (Cl⁻), na proporção 1:1. No sólido, esses íons formam uma rede cristalina. A distância mostrada é apenas ilustrativa.",
      "note": "Íons K⁺ e Cl⁻ na proporção 1:1. Representação de uma unidade de fórmula, não de uma molécula isolada ou da rede cristalina.",
      "imageFile": "8.jpg",
      "atoms": [
        {
          "element": "K",
          "position3D": [
            -1.8,
            0,
            0
          ],
          "position2D": [
            200,
            150
          ],
          "charge": 1
        },
        {
          "element": "Cl",
          "position3D": [
            1.8,
            0,
            0
          ],
          "position2D": [
            400,
            150
          ],
          "charge": -1
        }
      ],
      "bonds": [],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "KCl\n  Explorador Molecular\n\n  2  0  0  0  0  0            999 V2000\n   -1.8000    0.0000    0.0000 K   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\nM  CHG  2   1   1   2  -1\nM  END\n$$$$\n"
    },
    {
      "id": 9,
      "code": "CaOH2",
      "formula": "Ca(OH)2",
      "displayFormula": "Ca(OH)₂",
      "name": "Hidróxido de Cálcio",
      "molarMass": 74.09,
      "geometry": "Composto iônico — Ca²⁺ e dois OH⁻",
      "description": "Representação de um íon cálcio (Ca²⁺) e dois íons hidróxido (OH⁻). Cada hidróxido possui uma ligação O–H. As posições são ilustrativas e não representam a rede cristalina.",
      "note": "Um íon Ca²⁺ e dois íons OH⁻. Cada hidróxido possui uma ligação O–H. A separação entre os íons é ilustrativa.",
      "imageFile": "9.jpg",
      "atoms": [
        {
          "element": "Ca",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            120,
            150
          ],
          "charge": 2
        },
        {
          "element": "O",
          "position3D": [
            -2,
            0,
            0
          ],
          "position2D": [
            350,
            85
          ],
          "charge": -1
        },
        {
          "element": "H",
          "position3D": [
            -2.97,
            0,
            0
          ],
          "position2D": [
            470,
            85
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            2,
            0,
            0
          ],
          "position2D": [
            350,
            225
          ],
          "charge": -1
        },
        {
          "element": "H",
          "position3D": [
            2.97,
            0,
            0
          ],
          "position2D": [
            470,
            225
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          1,
          2,
          1
        ],
        [
          3,
          4,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "CaOH2\n  Explorador Molecular\n\n  5  2  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 Ca  0  0  0  0  0  0  0  0  0  0  0  0\n   -2.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.9700    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    2.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.9700    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  2  3  1  0  0  0  0\n  4  5  1  0  0  0  0\nM  CHG  3   1   2   2  -1   4  -1\nM  END\n$$$$\n"
    },
    {
      "id": 10,
      "code": "NH4Cl",
      "formula": "NH4Cl",
      "displayFormula": "NH₄Cl",
      "name": "Cloreto de Amônio",
      "molarMass": 53.49,
      "geometry": "Tetraédrica no íon NH₄⁺",
      "description": "Representação de um íon amônio (NH₄⁺) separado de um íon cloreto (Cl⁻). No amônio, o nitrogênio está ligado a quatro hidrogênios em disposição tetraédrica. Não representa a rede cristalina.",
      "note": "Íons NH₄⁺ e Cl⁻. No amônio, N se liga a quatro H; sua geometria é tetraédrica. O desenho 2D mostra apenas a conectividade.",
      "imageFile": "10.jpg",
      "atoms": [
        {
          "element": "N",
          "position3D": [
            -1.2,
            0,
            0
          ],
          "position2D": [
            210,
            150
          ],
          "charge": 1
        },
        {
          "element": "H",
          "position3D": [
            -0.6,
            0.6,
            0.6
          ],
          "position2D": [
            210,
            45
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -0.6,
            -0.6,
            -0.6
          ],
          "position2D": [
            210,
            255
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -1.8,
            0.6,
            -0.6
          ],
          "position2D": [
            105,
            150
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -1.8,
            -0.6,
            0.6
          ],
          "position2D": [
            315,
            150
          ],
          "charge": 0
        },
        {
          "element": "Cl",
          "position3D": [
            2,
            0,
            0
          ],
          "position2D": [
            485,
            150
          ],
          "charge": -1
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ],
        [
          0,
          2,
          1
        ],
        [
          0,
          3,
          1
        ],
        [
          0,
          4,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "NH4Cl\n  Explorador Molecular\n\n  6  4  0  0  0  0            999 V2000\n   -1.2000    0.0000    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.6000    0.6000    0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.6000   -0.6000   -0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.8000    0.6000   -0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.8000   -0.6000    0.6000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    2.0000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  1  5  1  0  0  0  0\nM  CHG  2   1   1   6  -1\nM  END\n$$$$\n"
    },
    {
      "id": 11,
      "code": "HBr",
      "formula": "HBr",
      "displayFormula": "HBr",
      "name": "Ácido Bromídrico",
      "molarMass": 80.91,
      "geometry": "Linear",
      "description": "Modelo da molécula de brometo de hidrogênio. Sua solução aquosa é chamada ácido bromídrico.",
      "note": "Molécula de brometo de hidrogênio. A solução aquosa é chamada ácido bromídrico.",
      "imageFile": "11.jpg",
      "atoms": [
        {
          "element": "H",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            230,
            150
          ],
          "charge": 0
        },
        {
          "element": "Br",
          "position3D": [
            1.414,
            0,
            0
          ],
          "position2D": [
            370,
            150
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "HBr\n  Explorador Molecular\n\n  2  1  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4140    0.0000    0.0000 Br  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 12,
      "code": "HI",
      "formula": "HI",
      "displayFormula": "HI",
      "name": "Ácido Iodídrico",
      "molarMass": 127.91,
      "geometry": "Linear",
      "description": "Modelo da molécula de iodeto de hidrogênio. Sua solução aquosa é chamada ácido iodídrico.",
      "note": "Molécula de iodeto de hidrogênio. A solução aquosa é chamada ácido iodídrico.",
      "imageFile": "12.jpg",
      "atoms": [
        {
          "element": "H",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            230,
            150
          ],
          "charge": 0
        },
        {
          "element": "I",
          "position3D": [
            1.609,
            0,
            0
          ],
          "position2D": [
            370,
            150
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "HI\n  Explorador Molecular\n\n  2  1  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.6090    0.0000    0.0000 I   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 13,
      "code": "HF",
      "formula": "HF",
      "displayFormula": "HF",
      "name": "Ácido Fluorídrico",
      "molarMass": 20.01,
      "geometry": "Linear",
      "description": "Modelo da molécula de fluoreto de hidrogênio. Sua solução aquosa é chamada ácido fluorídrico.",
      "note": "Molécula de fluoreto de hidrogênio. A solução aquosa é chamada ácido fluorídrico.",
      "imageFile": "13.jpg",
      "atoms": [
        {
          "element": "H",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            230,
            150
          ],
          "charge": 0
        },
        {
          "element": "F",
          "position3D": [
            0.917,
            0,
            0
          ],
          "position2D": [
            370,
            150
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "HF\n  Explorador Molecular\n\n  2  1  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    0.9170    0.0000    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 14,
      "code": "HClO4",
      "formula": "HClO4",
      "displayFormula": "HClO₄",
      "name": "Ácido Perclórico",
      "molarMass": 100.46,
      "geometry": "Tetraédrica ao redor do cloro",
      "description": "Modelo didático da molécula isolada: um cloro ligado a quatro oxigênios, sendo um deles pertencente ao grupo OH. Coordenadas aproximadas e representação convencional com três ligações duplas Cl=O e uma ligação simples Cl–OH.",
      "note": "Representação convencional com três ligações Cl=O e um grupo O–H. A geometria ao redor do cloro é tetraédrica; este desenho mostra a conectividade.",
      "imageFile": "14.jpg",
      "atoms": [
        {
          "element": "Cl",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            300,
            150
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            0.82,
            0.82,
            0.82
          ],
          "position2D": [
            300,
            45
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            0.82,
            -0.82,
            -0.82
          ],
          "position2D": [
            300,
            255
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            -0.82,
            0.82,
            -0.82
          ],
          "position2D": [
            180,
            150
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            -0.95,
            -0.95,
            0.95
          ],
          "position2D": [
            420,
            150
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -1.88,
            -0.69,
            0.87
          ],
          "position2D": [
            525,
            150
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          2
        ],
        [
          0,
          2,
          2
        ],
        [
          0,
          3,
          2
        ],
        [
          0,
          4,
          1
        ],
        [
          4,
          5,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "HClO4\n  Explorador Molecular\n\n  6  5  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    0.8200    0.8200    0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.8200   -0.8200   -0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.8200    0.8200   -0.8200 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.9500   -0.9500    0.9500 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.8800   -0.6900    0.8700 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  2  0  0  0  0\n  1  4  2  0  0  0  0\n  1  5  1  0  0  0  0\n  5  6  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 15,
      "code": "H2CO3",
      "formula": "H2CO3",
      "displayFormula": "H₂CO₃",
      "name": "Ácido Carbônico",
      "molarMass": 62.03,
      "geometry": "Trigonal plana ao redor do carbono",
      "description": "Um carbono ligado a um oxigênio por ligação dupla e a dois grupos OH por ligações simples. Modelo didático com coordenadas aproximadas.",
      "note": "Molécula de H₂CO₃: um grupo C=O e dois grupos O–H. O desenho não representa as proporções das espécies em solução.",
      "imageFile": "15.jpg",
      "atoms": [
        {
          "element": "C",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            300,
            140
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            0,
            1.2,
            0
          ],
          "position2D": [
            300,
            45
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            -1.16,
            -0.67,
            0
          ],
          "position2D": [
            185,
            210
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            1.16,
            -0.67,
            0
          ],
          "position2D": [
            415,
            210
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -1.99,
            -0.18,
            0
          ],
          "position2D": [
            80,
            210
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            1.99,
            -0.18,
            0
          ],
          "position2D": [
            520,
            210
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          2
        ],
        [
          0,
          2,
          1
        ],
        [
          0,
          3,
          1
        ],
        [
          2,
          4,
          1
        ],
        [
          3,
          5,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "H2CO3\n  Explorador Molecular\n\n  6  5  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000    1.2000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.1600   -0.6700    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.1600   -0.6700    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.9900   -0.1800    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9900   -0.1800    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  3  5  1  0  0  0  0\n  4  6  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 16,
      "code": "H3BO3",
      "formula": "H3BO3",
      "displayFormula": "H₃BO₃",
      "name": "Ácido Bórico",
      "molarMass": 61.83,
      "geometry": "Trigonal plana ao redor do boro",
      "description": "Um átomo de boro ligado a três grupos OH. Modelo didático com coordenadas aproximadas; pares de elétrons não ligantes não exibidos.",
      "note": "B(OH)₃: o boro está ligado a três grupos O–H. A geometria ao redor do boro é trigonal plana.",
      "imageFile": "16.jpg",
      "atoms": [
        {
          "element": "B",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            300,
            145
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            1.36,
            0,
            0
          ],
          "position2D": [
            300,
            60
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            1.7,
            0.9,
            0
          ],
          "position2D": [
            405,
            60
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            -0.68,
            1.178,
            0
          ],
          "position2D": [
            180,
            220
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -1.629,
            1.022,
            0
          ],
          "position2D": [
            75,
            220
          ],
          "charge": 0
        },
        {
          "element": "O",
          "position3D": [
            -0.68,
            -1.178,
            0
          ],
          "position2D": [
            420,
            220
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            -0.071,
            -1.922,
            0
          ],
          "position2D": [
            525,
            220
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ],
        [
          1,
          2,
          1
        ],
        [
          0,
          3,
          1
        ],
        [
          3,
          4,
          1
        ],
        [
          0,
          5,
          1
        ],
        [
          5,
          6,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "H3BO3\n  Explorador Molecular\n\n  7  6  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 B   0  0  0  0  0  0  0  0  0  0  0  0\n    1.3600    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7000    0.9000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.6800    1.1780    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.6290    1.0220    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.6800   -1.1780    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.0710   -1.9220    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  1  6  1  0  0  0  0\n  6  7  1  0  0  0  0\nM  END\n$$$$\n"
    },
    {
      "id": 17,
      "code": "HClO",
      "formula": "HClO",
      "displayFormula": "HClO",
      "name": "Ácido Hipocloroso",
      "molarMass": 52.46,
      "geometry": "Angular",
      "description": "O oxigênio liga o hidrogênio ao cloro, formando uma estrutura angular. Modelo didático com coordenadas aproximadas; pares não ligantes não exibidos.",
      "note": "Conectividade H–O–Cl. O oxigênio está entre o hidrogênio e o cloro; a estrutura é angular.",
      "imageFile": "17.jpg",
      "atoms": [
        {
          "element": "O",
          "position3D": [
            0,
            0,
            0
          ],
          "position2D": [
            300,
            115
          ],
          "charge": 0
        },
        {
          "element": "H",
          "position3D": [
            0.97,
            0,
            0
          ],
          "position2D": [
            190,
            210
          ],
          "charge": 0
        },
        {
          "element": "Cl",
          "position3D": [
            -0.4,
            1.642,
            0
          ],
          "position2D": [
            410,
            210
          ],
          "charge": 0
        }
      ],
      "bonds": [
        [
          0,
          1,
          1
        ],
        [
          0,
          2,
          1
        ]
      ],
      "provenance": {
        "molarMass": {
          "kind": "MANUAL",
          "source": "Cadastro Excel do autor, transcrito no complemento.js original",
          "reviewed": false
        },
        "structure": {
          "kind": "CUSTOM_DIDACTIC",
          "source": "Estruturas originais do autor; coordenadas aproximadas; ligações explícitas preservadas",
          "reviewed": false
        },
        "geometry": {
          "kind": "MANUAL",
          "source": "script.js original",
          "reviewed": false
        },
        "references": [
          "https://openstax.org/books/chemistry-2e/pages/7-4-formal-charges-and-resonance"
        ]
      },
      "sdf": "HClO\n  Explorador Molecular\n\n  3  2  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.9700    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.4000    1.6420    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\nM  END\n$$$$\n"
    }
  ]
};
