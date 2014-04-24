Oskari.registerLocalization({
    "lang": "fi",
    "key": "Analyse",
    "value": {
        "title": "Analyysi",
        "flyouttitle": "Analyysi",
        "desc": "",
        "btnTooltip": "Analyysi",
        "notLoggedIn": "Vain kirjautunut käyttäjä voi tehdä WFS tasoille analyysejä. <a href='/web/fi/login'>Kirjaudu palveluun</a>.",
        "AnalyseView": {
            "title": "Analyysi",
            "content": {
                "label": "Aineisto",
                "tooltip": "Lisää tietoaineisto painamalla [lisää tietoaineisto] painiketta",
                "features": {
                    "title": "Piirrä kohde",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "modes": {
                        "area": "Alue",
                        "line": "Viiva",
                        "point": "Piste"
                    }
                },
                "drawFilter": {
                    "title": "Kohteen leikkaus",
                    "buttons": {
                        "finish": "Valmis"
                    },
                    "modes": {
                        "mark": "Pistemäinen viivamaisen kohteen rajaus",
                        "split": "Alueen tai pisteeen aluerajaus ",
                        "cut": "Alueen leikkaus",
                        "clear": "Rajauksen poistaminen"
                    }
                },
                "search": {
                    "title": "Hae paikkahaulla",
                    "resultLink": "Tuo analyysiin"
                }
            },
            "method": {
                "label": "Menetelmä",
                "tooltip": "Vyöhyke-menetelmä: Lisää valittujen kohteiden ympärille vyöhykkeet ja käyttää näitä vyöhyke-geometrioita (buffer) analyysissä -+- Koostetyökalu: Laskee kohteen ominaisuuksille aggregointiominaisuuksia esim. summat -+- Unioni: kohteiden yhdistäminen taulukosta valitsemalla tai yhteisten ominaisuustietoarvojen perusteella -+- Leikkaus: Valitaan uudet kohteet leikkaamalla leikkaavan tason kohteilla leikattavaa tasoa",
                "options": [{
                    "id": "oskari_analyse_buffer",
                    "label": "Vyöhyke",
                    "classForMethod": "buffer",
                    "selected": true,
                    "tooltip": "Lisää valittujen kohteiden ympärille vyöhykkeet ja käyttää näitä vyöhyke-geometrioita (buffer) analyysissä"
                }, {
                    "id": "oskari_analyse_aggregate",
                    "label": "Kooste",
                    "classForPreview": "aggregate",
                    "tooltip": "Laskee kohteen ominaisuuksille aggregointiominaisuuksia esim. summat"
                }, {
                    "id": "oskari_analyse_union",
                    "label": "Yhdiste",
                    "classForPreview": "union",
                    "tooltip": "Kohteiden yhdistäminen taulukosta valitsemalla tai yhteisten ominaisuustietoarvojen perusteella"
                }, {
                    "id": "oskari_analyse_intersect",
                    "label": "Leikkaavien kohteiden suodatus",
                    "classForPreview": "intersect",
                    "tooltip": "Valitaan uudet kohteet leikkaamalla leikkaavan tason kohteilla leikattavaa tasoa"
                }, {
                    "id": "oskari_analyse_layer_union",
                    "label": "Analyysitasojen yhdiste",
                    "classForPreview": "layer_union",
                    "tooltip": "Yhdistää analyysitasoja, joilla on samat ominaisuustietokentät"
                }]
            },
            "aggregate": {
                "label": "Aggregointifunktio",
                "options": [{
                    "id": "oskari_analyse_Count",
                    "label": "Lukumäärä",
                    "selected": true
                }, {
                    "id": "oskari_analyse_Sum",
                    "label": "Summa"
                }, {
                    "id": "oskari_analyse_Min",
                    "label": "Minimi"
                }, {
                    "id": "oskari_analyse_Max",
                    "label": "Maksimi"
                }, {
                    "id": "oskari_analyse_Average",
                    "label": "Keskiarvo"
                }, {
                    "id": "oskari_analyse_StdDev",
                    "label": "Keskihajonta"
                }],
                "attribute": "Valitse ominaisuustieto"
            },
            "buffer_size": {
                "label": "Vyöhykkeen koko (m)",
                "tooltip": "Anna vyöhykkeen koko"
            },
            "analyse_name": {
                "label": "Analyysin nimi",
                "tooltip": "Anna analyysin nimi"
            },
            "settings": {
                "label": "Parametrit",
                "tooltip": "Anna parametrit analyysia varten. Parametrit riippuvat valitusta suodattimesta ja menetelmästä"
            },
            "intersect": {
                "label": "Leikkaava taso"
            },
            "union": {
                "label": "Valittu yhdistettävä taso"
            },
            "layer_union": {
                "label": "Valitut yhdistettävät tasot",
                "notAnalyseLayer": "Valitse jokin analyysitaso",
                "noLayersAvailable": "Tasoja, joilla on samat ominaisuustietokentät ei löytynyt"
            },
            "spatial": {
                "label": "Spatiaalinen operaattori",
                "options": [{
                    "id": "oskari_analyse_intersect",
                    "label": "Leikkaa",
                    "selected": true
                }, {
                    "id": "oskari_analyse_contains",
                    "label": "Sisältää"
                }]
            },
            "params": {
                "label": "Säilytettävät ominaisuustiedot",
                "tooltip": "",
                "options": [{
                    "id": "oskari_analyse_all",
                    "selected": true,
                    "label": "Kaikki"
                }, {
                    "id": "oskari_analyse_none",
                    "label": "Ei mitään"
                }, {
                    "id": "oskari_analyse_select",
                    "label": "Valitse listalta"
                }]
            },
            "output": {
                "label": "Ulkoasu",
                "color_label": "Valitse tyylit:",
                "colorset_tooltip": "Valitse tyylit eri geometria tyyleille",
                "tooltip": "Voit valita analyysin tuloksille sivuillesi sopivan tyylimaailman",
                "random_color_label": "Satunnaiset värit"
            },
            "buttons": {
                "save": "Tallenna",
                "analyse": "Jatka analyysia",
                "data": "Päivitä tietoaineisto",
                "cancel": "Poistu",
                "ok": "OK"
            },
            "filter": {
                "title": "Suodatus",
                "description": "Suodatin tasolle ",
                "clearButton": "Tyhjennä suodatin",
                "refreshButton": "Päivitä suodatin",
                "addFilter": "Lisää uusi suodatin",
                "removeFilter": "Poista suodatin",
                "bbox": {
                    "title": "Ikkunarajaus",
                    "on": "Käytössä",
                    "off": "Pois käytöstä"
                },
                "clickedFeatures": {
                    "title": "Kohderajaus",
                    "label": "Sisällytä vain kartalta valitut kohteet"
                },
                "values": {
                    "title": "Suodatin",
                    "placeholders": {
                        "case-sensitive": "Case sensitive",
                        "attribute": "Attribuutti",
                        "boolean": "Looginen operaattori",
                        "operator": "Operaattori",
                        "attribute-value": "Arvo"
                    }
                },
                "validation": {
                    "title": "Seuraavat virheet estivät suodattimen päivityksen:",
                    "attribute_missing": "Attribuutti puuttuu",
                    "operator_missing": "Operaattori puuttuu",
                    "value_missing": "Arvo puuttuu",
                    "boolean_operator_missing": "Looginen operaattori puuttuu"
                }
            },
            "help": "Ohje",
            "success": {
                "layerAdded": {
                    "title": "Analyysi OK",
                    "message": "Lisätty uusi analyysitaso -- {layer} --"
                }
            },
            "error": {
                "title": "Virhe",
                "invalidSetup": "Virheellisiä parametrejä",
                "noParameters": "Ei tietoaineistoa, ei parametrejä",
                "noLayer": "Ei valittua tasoa",
                "noAnalyseUnionLayer": "Valitse ainakin toinen analyysitaso",
                "invalidMethod": "Tuntematon menetelmä: ",
                "bufferSize": "Virhe vyöhykkeen koossa",
                "illegalCharacters": "ei kirjaimia - käytä numeroita",
                "nohelp": "Ohjetta ei löytynyt",
                "saveFailed": "Analyysin tallennus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayersFailed": "Analyysitasojen lataus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayerTypesFailed": "Analyysi- tai WFS-tason tietotyyppien haku epäonnistui ",
                "Analyse_parameter_missing": "Analyysin parametrit puuttuvat",
                "Unable_to_parse_analysis": "Analyysin parametrit väärin",
                "Unable_to_get_WPS_features": "Analyysin WPS input kohteiden haku epäonnistui",
                "WPS_execute_returns_Exception": "Analyysin prosessointi epäonnistui",
                "WPS_execute_returns_no_features": "Analyysi ei palauta yhtään kohdetta",
                "Unable_to_process_aggregate_union": "Yhdisteen koosteen prosessointi epäonnistui",
                "Unable_to_get_features_for_union": "Koosteen input kohteiden haku epäonnistui",
                "Unable_to_store_analysis_data": "Analyysin tallennus epäonnistui",
                "Unable_to_get_analysisLayer_data": "Analyysitason tietojen parsinta epäonnistui"

            },
            "infos": {
                "title": "Tiedoksi",
                "layer": "Tasolla -",
                "over10": "- yli kymmenen ominaisuutta - Valitse listalta korkeintaan 10"
            }
        },
        "StartView": {
            "text": "Voit analysoida valitsemiasi tietotuotteita ja paikkatietoja saatavilla olevilla analyysimenetelmillä ja tallentaa analyysin tulokset myöhempää käyttöä varten",
            "infoseen": {
                "label": "Älä näytä tätä viestiä uudelleen"
            },
            "buttons": {
                "continue": "Aloita analyysi",
                "cancel": "Poistu"
            }
        },
        "categoryform": {
            "name": {
                "label": "Nimi",
                "placeholder": "Anna tasolle nimi"
            },
            "drawing": {
                "label": "  ",
                "point": {
                    "label": "Piste",
                    "color": "Väri",
                    "size": "Koko"
                },
                "line": {
                    "label": "Viiva",
                    "color": "Väri",
                    "size": "Paksuus"
                },
                "area": {
                    "label": "Alue",
                    "fillcolor": "Täyttöväri",
                    "linecolor": "Viivan väri",
                    "size": "Viivan paksuus"
                }
            },
            "edit": {
                "title": "Muokkaa karttatasoa",
                "save": "Tallenna",
                "cancel": "Peruuta"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Nimi",
                "delete": " "
            },
            "title": "Analyysit",
            "confirmDeleteMsg": "Haluatko poistaa analyysin:",
            "buttons": {
                "ok": "OK",
                "cancel": "Peruuta",
                "delete": "Poista"
            },
            "notification": {
                "deletedTitle": "Karttatason poisto",
                "deletedMsg": "Karttataso poistettu."
            },
            "error": {
                "title": "Virhe!",
                "generic": "Järjestelmässä tapahtui virhe. Yritä uudelleen myöhemmin."
            }
        }
    }
});