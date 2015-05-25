Oskari.registerLocalization({
    "lang" : "hr",
    "key" : "Printout",
    "value" : {
        "title" : "Ispis prikaza karte",
        "flyouttitle" : "Ispis prikaza karte",
        "desc" : "",
        "btnTooltip" : "Ispis",
        "BasicView" : {
            "title" : "Ispis prikaza karte",
            "name" : {
                "label" : "Naziv karte",
                "placeholder" : "NOT TRANSLATED",
                "tooltip" : "Dajte karti opisni naziv. Jezik korisničkog sučelja"
            },
            "language" : {
                "label" : "Jezik",
                "options" : {
                    "fi" : "Finski",
                    "sv" : "Švedski",
                    "en" : "Engleski"
                },
                "tooltip" : "Odaberi jezik sučelja karte i podataka o karti"
            },
            "size" : {
                "label" : "Veličina",
                "tooltip" : "Odabir izgleda ispisa Prethodni pregled se ažurira.",
                "options" : [{
                    "id" : "A4",
                    "label" : "A4 portret",
                    "classForPreview" : "preview-portrait",
                    "selected" : true
                }, {
                    "id" : "A4_Landscape",
                    "label" : "A4 pejzaž",
                    "classForPreview" : "preview-landscape"
                }, {
                    "id" : "A3",
                    "label" : "A3 portret",
                    "classForPreview" : "preview-portrait"
                }, {
                    "id" : "A3_Landscape",
                    "label" : "A3 pejzaž",
                    "classForPreview" : "preview-landscape"
                }]
            },
            "preview" : {
                "label" : "Pregled",
                "tooltip" : "Klikni na mali pregled za otvaranje velikog pregleda",
                "pending" : "Pregled će se uskoro ažurirati.",
                "notes" : {
                    "extent" : "Pregled može poslužiti za ocjenu veličine karte koja se ispisuje",
                    "restriction" : "Svi slojevi karte se ne prikazuju u pregledniku."
                }

            },

            "buttons" : {
                "save" : "Ispiši",
                "ok" : "OK",
                "back" : "NOT TRANSLATED",
                "cancel" : "Poništi"
            },
            "location" : {
                "label" : "Lokacija i stupanj zumiranja",
                "tooltip" : "Razmjer ispisa odgovara razmjeru karte u pregledniku.",
                "zoomlevel" : "Stupanj zumiranja"
            },
            "settings" : {
                "label" : "Daljnje postavke",
                "tooltip" : "Dodatne postavke poput formata, naziva i razmjera"
            },
            "format" : {
                "label" : "Format",
                "tooltip" : "Odabir formata datoteke",
                "options" : [{
                    "id" : "png",
                    "format" : "image/png",
                    "label" : "PNG slika"
                }, {
                    "id" : "pdf",
                    "format" : "application/pdf",
                    "selected" : true,
                    "label" : "PDF dokument"
                }]
            },
            "mapTitle" : {
                "label" : "Dodaj naziv",
                "tooltip" : "dodaj naziv karte"
            },
            "content" : {
                "options" : [{
                    "id" : "pageLogo",
                    "label" : "Dodaj logo Oskari",
                    "tooltip" : "Ako je potrebno, logo se može sakriti",
                        "checked" : "checked"
                }, {
                    "id" : "pageScale",
                    "label" : "Dodaj mjerilo na kartu",
                    "tooltip" : "Dodaj mjerilo na kartu",
                        "checked" : "checked"
                }, {
                    "id" : "pageDate",
                    "label" : "Dodaj datum",
                    "tooltip" : "Možete dodati datum ispisu",
                        "checked" : "checked"
                }]
            },
                "legend" : {
                "label" : "NOT TRANSLATED",
                "tooltip" : "NOT TRANSLATED",
                "options" : [{
                        "id" : "oskari_legend_NO",
                        "loca" : "NO",
                        "label" : "NOT TRANSLATED",
                        "tooltip" : "NOT TRANSLATED",
                        "selected" : true

                    },{
                        "id" : "oskari_legend_LL",
                        "loca" : "LL",
                        "label" : "NOT TRANSLATED",
                        "tooltip" : "NOT TRANSLATED"

                    },{
                        "id" : "oskari_legend_LU",
                         "loca" : "LU",
                        "label" : "NOT TRANSLATED",
                        "tooltip" : "NOT TRANSLATED"

                    },{
                        "id" : "oskari_legend_RU",
                         "loca" : "RU",
                        "label" : "NOT TRANSLATED",
                        "tooltip" : "NOT TRANSLATED"

                    },{
                        "id" : "oskari_legend_RL",
                         "loca" : "RL",
                        "label" : "NOT TRANSLATED",
                        "tooltip" : "NOT TRANSLATED"

                    }
                ]
            },
            "help" : "Pomoć",
            "error" : {
                "title" : "Greška",
                "size" : "NOT TRANSLATED",
                "name" : "NOT TRANSLATED",
                "nohelp" : "Nema dostupne pomoći",
                "saveFailed" : "Greška u ispisu karte Pokušajte ponovno kasnije",
                "nameIllegalCharacters" : "NOT TRANSLATED"
            }
        },
        "StartView" : {
            "text" : "Možete ispisati kartu koju ste upravo izradili.",
            "info" : {
                "maxLayers" : "Odjednom možete ispisati najviše 8 slojeva",
                "printoutProcessingTime" : "Kod odabira nekoliko slojeva obrada ispisa traje dulje."
            },
            "buttons" : {
                "continue" : "Nastavi",
                "cancel" : "Poništi"
            }
        }
    }
});
