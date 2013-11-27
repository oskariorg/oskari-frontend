Oskari.registerLocalization({
    "lang": "sv",
    "key": "StatsGrid",
    "value": {
        "title": "patiopoc",
        "desc": "",
        "tile": {
            "title": "Tematiska kartor"
        },
        "view": {
            "title": "patiopoc",
            "message": "patiopoc"
        },
        "tab": {
            "title": "Indikatorer",
            "grid": {
                "name": "Titeln",
                "description": "Beskrivning"
            },
            "newIndicator": "Ny indikator"
        },
        "gender": "Kön",
        "genders": {
            "male": "män",
            "female": "kvinnor",
            "total": "totalt"
        },
        "addColumn": "Hämta data",
        "removeColumn": "Radera",
        "indicators": "Indikator",
        "cannotDisplayIndicator": "Indikaattorilla ei ole kuntapohjaisia arvoja, joten sitä ei voi näyttää taulukossa.",
        "year": "År",
        "buttons": {
            "ok": "OK",
            "cancel": "Avbryta",
            "filter": "Filter"
        },
        "sotka": {
            "municipality": "Kommun",
            "code": "Kod",
            "errorTitle": "Fel",
            "regionDataError": "Fel att få Sotka regionen data.",
            "regionDataXHRError": "Fel vid laddning av Sotka regionen data",
            "indicatorsDataError": "Fel att få Sotka indikatorer.",
            "indicatorsDataXHRError": "Fel vid laddning av Sotka indikatorer.",
            "indicatorMetaError": "Fel att få Sotka indikator metadata",
            "indicatorMetaXHRError": "Fel vid laddning av Sotka indikator metadata",
            "indicatorDataError": "Fel att få Sotka indikator data",
            "indicatorDataXHRError": "Fel vid laddning av Sotka indikator data",
            "descriptionTitle": "Beskrivning",
            "sourceTitle": "Upphov"

        },
        "classify": {
            "classify": "Klassificera",
            "classifymethod": "Metod",
            "classes": "Klasser",
            "jenks": "Jenks intervall",
            "quantile": "Quantile intervall",
            "eqinterval": "Eqintervall",
            "manual": "Manuell klassificering",
            "manualPlaceholder": "Ange siffrorna, separerade med kommatecken.",
            "manualRangeError": "Det bör vara minst {min} och högst {max} siffror!",
            "nanError": "Ett värde var inte ett nummer!",
            "infoTitle": "Manuell klassificering",
            "info": "Ange siffrorna separerade med kommatecken. Punkt fungerar som ett decimaltecken. Först in den nedre gränsen, då gränserna klass och slutligen den övre gränsen. T.ex. genom att skriva \"0, 10,5, 24, 30,2, 57, 73,1\" du får fem klasser med nedre och övre gränsen satt till 0 och 73,1 och klass gränser mellan dem. Värden kvar utanför gränserna kommer att uteslutas.",
            "mode": "Klass gränsen",
            "modes": {
                "distinct": "Kontinuerlig",
                "discontinuous": "Diskontinuerlig"
            }
        },
        "colorset": {
            "button": "Färger",
            "flipButton": "Vända färger",
            "themeselection": "Välj färgtema",
            "setselection": "Välj färgset",
            "sequential": "Kvantitiv",
            "qualitative": "Kvalitativ",
            "divergent": "Divergent",
            "info2": "Vända färger - använd muspekaren för att välja en färg från sekvensen färgskalan",
            "cancel": "Avsluta"

        },
        "statistic": {
            "avg": "genomsnitt",
            "max": "Maximivärde",
            "mde": "Modus",
            "mdn": "Median",
            "min": "Minimivärde",
            "std": "Standardavvikelse",
            "sum": "Summa"
        },
        "values": "värden",
        "municipality": "Kommuner",
        "selectRows": "Markera rader",
        "select4Municipalities": "Välj minst 4 kommuner",
        "showSelected": "Visa endast utvalda områden på nätet",
        "not_included": "Inte inlcuded kommuner",
        "noMatch": "Inga matchade indikatorer",
        "selectIndicator": "Välja en indikator",
        "filterTitle"           : "Filtrera kolumndata",
        "indicatorFilterDesc"   : "Filtrerade värdena kommer att väljas i tabellen. Du kan ställa in filtrering separat för varje kolumn.",
        "filterIndicator"       : "Indikator:",
        "filterCondition"       : "Filter:",
        "filterSelectCondition" : "välj filter",
        "filterGT"              : "Större (>)",
        "filterGTOE"            : "Större än eller lika med (>=)",
        "filterE"               : "Lika med (=)",
        "filterLTOE"            : "Mindre än eller lika med (<=)",
        "filterLT"              : "Mindre (<)",
        "filterBetween"         : "Värdeintervallet",
        "filter"                : "Filter",
        "filterByValue"         : "Med värde",
        "filterByRegion"        : "Med region",

        "selectRegionCategory"  : "Aluejako:",
        "regionCatPlaceholder"  : "Valitse aluejako",
        "selectRegion"          : "Alue:",
        "chosenRegionText"      : "Valitse alueita",
        "noRegionFound"         : "Aluetta ei löytynyt",
        "regionCategories"      : {
            "ALUEHALLINTOVIRASTO"   : "Aluehallintovirasto",
            "MAAKUNTA"              : "Maakunta",
            "NUTS1"                 : "Manner-Suomi ja Ahvenanmaa",
            "SAIRAANHOITOPIIRI"     : "Sairaanhoitopiiri",
            "SEUTUKUNTA"            : "Seutukunta",
            "SUURALUE"              : "Suuralue"
        },
        "addDataButton" : "Lisää oma"
    }
});
