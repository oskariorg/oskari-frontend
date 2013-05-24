Oskari.registerLocalization({
    "lang" : "fi",
    "key" : "Analyse",
    "value" : {
        "title" : "Analyysi",
        "flyouttitle" : "Analyysi",
        "desc" : "",
        "btnTooltip" : "Analyysi",
        "AnalyseView" : {
            "title" : "Analyysi",
            "content" : {
                "label" : "Aineisto",
                "tooltip" : "Lisää tietoaineisto painamalla [lisää tietoaineisto] painiketta"
            },
            "method" : {
                "label" : "Menetelmä",
                "tooltip" : "Vyöhyke-menetelmä: Lisää valittujen kohteiden ympärille vyöhykkeet ja käyttää näitä vyöhyke-geometrioita (buffer) analyysissä -+- Koostetyökalu: Laskee kohteen ominaisuuksille aggregointiominaisuuksia esim. summat -+- Unioni: kohteiden yhdistäminen taulukosta valitsemalla tai yhteisten ominaisuustietoarvojen perusteella -+- Leikkaus: Valitaan uudet kohteet leikkaamalla leikkaavan tason kohteilla leikattavaa tasoa",
                "options" : [{
                    "id" : "oskari_analyse_buffer",
                    "label" : "Vyöhyke",
                    "classForMethod" : "buffer",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_aggregate",
                    "label" : "Koostetyökalu",
                    "classForPreview" : "aggregate"
                }, {
                    "id" : "oskari_analyse_union",
                    "label" : "Unioni",
                    "classForPreview" : "union"
                }, {
                    "id" : "oskari_analyse_intersect",
                    "label" : "Leikkaus",
                    "classForPreview" : "intersect"
                }]
            },
            "aggregate" : {
                "label" : "Valittu aggrekointifunktio",
                "options" : [{
                    "id" : "oskari_analyse_sum",
                    "label" : "Summa",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_count",
                    "label" : "Lkm"
                }, {
                    "id" : "oskari_analyse_min",
                    "label" : "Minimi"
                }, {
                    "id" : "oskari_analyse_max",
                    "label" : "Maximi"
                }, {
                    "id" : "oskari_analyse_med",
                    "label" : "Keskiarvo"
                }]
            },
            "buffer_size" : {
                "label" : "Vyöhykkeen koko (m)",
                "tooltip" : "Anna vyöhykkeen koko"
            },
            "analyse_name" : {
                "label" : "Analyysin nimi",
                "tooltip" : "Anna analyysin nimi"
            },
            "settings" : {
                "label" : "Parametrit",
                "tooltip" : "Anna parametrit analyysia varten. Parametrit riippuvat valitusta suodattimesta ja menetelmästä"
            },
            "intersect" : {
                "label" : "Valittu leikkaava taso"
            },
            "spatial" : {
                "label" : "Valittu spatial operaattori",
                "options" : [{
                    "id" : "oskari_analyse_intersect",
                    "label" : "Leikkaa",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_contains",
                    "label" : "Sisältää"
                }]
            },
            "params" : {
                "label" : "Valitut ominaisuustiedot",
                "tooltip" : "",
                "options" : [{
                    "id" : "oskari_analyse_all",
                    "selected" : true,
                    "label" : "Kaikki"
                }, {
                    "id" : "oskari_analyse_none",
                    "label" : "Ei mitään"
                }, {
                    "id" : "oskari_analyse_select",
                    "label" : "Valitse listalta"
                }]
            },
            "output" : {
                "label" : "Ulkoasu",
                "color_label" : "Valitse tyylit:",
                "colorset_tooltip" : "Valitse tyylit eri geometria tyyleille",
                "tooltip" : "Voit valita analyysin tuloksille sivuillesi sopivan tyylimaailman"
            },
            "buttons" : {
                "save" : "Tallenna",
                "analyse" : "Jatka analyysia",
                "data" : "Päivitä tietoaineisto",
                "cancel" : "Poistu"
            },
            "help" : "Ohje",
            "error" : {
                "title" : "Virhe",
                "size" : "Virhe vyöhykkeen koossa",
                "nohelp" : "Ohjetta ei löytynyt",
                "saveFailed" : "Analyysin tallennus epäonnistui. Yritä myöhemmin uudelleen.",
                "IllegalCharacters" : "ei kirjaimia - käytä numeroita"
            }
        },
        "StartView" : {
            "text" : "Voit analysoida valitsemiasi tietotuotteita ja paikkatietoja saatavilla olevilla analyysimenetelmillä ja tallentaa analyysin tulokset myöhempää käyttöä varten",
            "infoseen" : {
                "label" : "Älä näytä tätä viestiä uudelleen"
            },
            "buttons" : {
                "continue" : "Aloita analyysi",
                "cancel" : "Poistu"
            }
        },
        "categoryform" : {
            "name" : {
                "label" : "Nimi",
                "placeholder" : "Anna tasolle nimi"
            },
            "drawing" : {
                "label" : "  ",
                "point" : {
                    "label" : "Piste",
                    "color" : "Väri",
                    "size" : "Koko"
                },
                "line" : {
                    "label" : "Viiva",
                    "color" : "Väri",
                    "size" : "Paksuus"
                },
                "area" : {
                    "label" : "Alue",
                    "fillcolor" : "Täyttöväri",
                    "linecolor" : "Viivan väri",
                    "size" : "Viivan paksuus"
                }
            },
            "edit" : {
                "title" : "Muokkaa karttatasoa",
                "save" : "Tallenna",
                "cancel" : "Peruuta"
            }
        }

    }
});
