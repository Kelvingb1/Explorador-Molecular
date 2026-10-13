Attribute VB_Name = "modCatalogoGerado"
Option Explicit
' GERADO. Edite data/compounds.json e execute node tools/generate.mjs.
Public Const CATALOGO_HASH As String = "b5a5198761fb34d54976319794a2e5de39e09cec74d8e5bab15698bc8d035add"
Public Function CatalogoOficial() As Object
    Dim d As Object
    Set d = CreateObject("Scripting.Dictionary")
    d.Add "1", Array("HCl", "Ácido Clorídrico", 36.46#, "HCl", "1.jpg")
    d.Add "2", Array("H2SO4", "Ácido Sulfúrico", 98.08#, "H2SO4", "2.jpg")
    d.Add "3", Array("NaOH", "Hidróxido de Sódio", 40#, "NaOH", "3.jpg")
    d.Add "4", Array("HNO3", "Ácido Nítrico", 63.01#, "HNO3", "4.jpg")
    d.Add "5", Array("NH3", "Amônia", 17.03#, "NH3", "5.jpg")
    d.Add "6", Array("NH4OH", "Hidróxido de Amônio", 35.05#, "NH4OH", "6.jpg")
    d.Add "7", Array("NaCl", "Cloreto de Sódio", 58.44#, "NaCl", "7.jpg")
    d.Add "8", Array("KCl", "Cloreto de Potássio", 74.55#, "KCl", "8.jpg")
    d.Add "9", Array("Ca(OH)2", "Hidróxido de Cálcio", 74.09#, "CaOH2", "9.jpg")
    d.Add "10", Array("NH4Cl", "Cloreto de Amônio", 53.49#, "NH4Cl", "10.jpg")
    d.Add "11", Array("HBr", "Ácido Bromídrico", 80.91#, "HBr", "11.jpg")
    d.Add "12", Array("HI", "Ácido Iodídrico", 127.91#, "HI", "12.jpg")
    d.Add "13", Array("HF", "Ácido Fluorídrico", 20.01#, "HF", "13.jpg")
    d.Add "14", Array("HClO4", "Ácido Perclórico", 100.46#, "HClO4", "14.jpg")
    d.Add "15", Array("H2CO3", "Ácido Carbônico", 62.03#, "H2CO3", "15.jpg")
    d.Add "16", Array("H3BO3", "Ácido Bórico", 61.83#, "H3BO3", "16.jpg")
    d.Add "17", Array("HClO", "Ácido Hipocloroso", 52.46#, "HClO", "17.jpg")
    Set CatalogoOficial = d
End Function
