Oskari.registerLocalization({
    "lang": "sv",
    "key": "Analyse",
    "value": {
        "title": "Analys",
        "flyouttitle": "Analys",
        "desc": "",
        "btnTooltip": "Analys",
        "notLoggedIn": "Endast loggad andvändare can göra analys . <a href='/web/sv/login'>Logga in</a>.",
        "AnalyseView": {
            "title": "Analys",
            "content": {
                "label": "Material",
                "tooltip": "Tillsätta material - trycka  [tillsätta material] knappen"
            },
            "method": {
                "label": "Metod",
                "tooltip": "Väljä först material och efter det metods är till hands",
                "options": [{
                    "id": "oskari_analyse_buffer",
                    "label": "zon",
                    "classForMethod": "buffer",
                    "selected": true,
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_aggregate",
                    "label": "Sammandrag",
                    "classForPreview": "aggregate",
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_union",
                    "label": "Union",
                    "classForPreview": "union",
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_intersect",
                    "label": "Sektion",
                    "classForPreview": "intersect",
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_layer_union",
                    "label": "Analyysitasojen yhdiste",
                    "classForPreview": "layer_union",
                    "tooltip": "Yhdistää analyysitasoja, joilla on samat ominaisuustietokentät"
                }]
            },
            "aggregate": {
                "label": "Aggregate funktion",
                "options": [{
                    "id": "oskari_analyse_Count",
                    "label": "Antal",
                    "selected": true
                }, {
                    "id": "oskari_analyse_Sum",
                    "label": "Summa"
                }, {
                    "id": "oskari_analyse_Min",
                    "label": "Minimum"
                }, {
                    "id": "oskari_analyse_Max",
                    "label": "Maximum"
                }, {
                    "id": "oskari_analyse_Average",
                    "label": "Medeltal"
                }, {
                    "id": "oskari_analyse_StdDev",
                    "label": "Medel spridning"
                }],
                "attribute": "Välj ett attribut"
            },
            "buffer_size": {
                "label": "Zon storlek (m)",
                "tooltip": "Passa zon storlek"
            },
            "analyse_name": {
                "label": "Analys namn",
                "tooltip": "Ge analys namn"
            },
            "settings": {
                "label": "Parameter",
                "tooltip": "Passa parameterna för analys"
            },
            "intersect": {
                "label": "Intersect lag"
            },
            "union": {
                "label": "Andra lag för union input"
            },
            "layer_union": {
                "label": "Andra lager för union input",
                "notAnalyseLayer": "Välj ett analys lag",
                "noLayersAvailable": "Tasoja, joilla on samat ominaisuustietokentät ei löytynyt"
            },
            "spatial": {
                "label": "Spatial operator",
                "options": [{
                    "id": "oskari_analyse_intersect",
                    "label": "Klip",
                    "selected": true
                }, {
                    "id": "oskari_analyse_contains",
                    "label": "Inkludera"
                }]
            },
            "params": {
                "label": "Väljad attribut data",
                "tooltip": "",
                "options": [{
                    "id": "oskari_analyse_all",
                    "selected": true,
                    "label": "alla"
                }, {
                    "id": "oskari_analyse_none",
                    "label": "Ingenting"
                }, {
                    "id": "oskari_analyse_select",
                    "label": "Använda list"
                }]
            },
            "output": {
                "label": "Layout",
                "color_label": "Väljä färg:",
                "colorset_tooltip": "Ändra färg inställning",
                "tooltip": "Passa färg för analys layout",
                "random_color_label": "Satunnaiset värit"
            },
            "buttons": {
                "save": "Lagra",
                "analyse": "Fortsätta analys",
                "data": "Öka data",
                "cancel": "Avbryta",
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
            "help": "Anvisning",
            "success": {
                "layerAdded": {
                    "title": "Karttataso {layer} lisätty",
                    "message": "Löydät tason Aineisto-paneelista"
                }
            },
            "error": {
                "title": "Fel",
                "bufferSize": "Fel i zon storlek",
                "nohelp": "ingen anvisning",
                "saveFailed": "Fel i analys lagring. Försök senare igen.",
                "illegalCharacters": "ingen bokstaver - använda sifror",
                "loadLayersFailed": "Fel i analys ladda ner",
                "loadLayerTypesFailed": "Analys eller WFS data typ request fel",
                "invalidSetup": "Virheellisiä parametrejä",
                "noParameters": "Ei parametrejä",
                "noLayer": "Ei valittua tasoa",
                "noAnalyseUnionLayer": "Valitse ainakin toinen analyysitaso",
                "invalidMethod": "Tuntematon menetelmä: "
            }

        },
        "StartView": {
            "text": "Analys data och lagra analysen",
            "infoseen": {
                "label": "Inte see denna dialog i fortsätting "
            },
            "buttons": {
                "continue": "Starta analys",
                "cancel": "Avbryta"
            }
        },
        "categoryform": {
            "name": {
                "label": "Namn",
                "placeholder": "Namnge kartlagret"
            },
            "drawing": {
                "label": "  ",
                "point": {
                    "label": "Punkt",
                    "color": "Färg",
                    "size": "Storlek"
                },
                "line": {
                    "label": "Linje",
                    "color": "Färg",
                    "size": "Tjocklek"
                },
                "area": {
                    "label": "Område",
                    "fillcolor": "Ifyllnadsfärg",
                    "linecolor": "Linjens färg",
                    "size": "Linjens tjocklek"
                }
            },
            "edit": {
                "title": "Editera kartlagret",
                "save": "Lagra",
                "cancel": "Tillbaka"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Namn",
                "delete": " "
            },
            "title": "Analyser",
            "confirmDeleteMsg": "Vill du ta bort:",
            "buttons": {
                "ok": "OK",
                "cancel": "Avbryta",
                "delete": "Ta bort"
            },
            "notification": {
                "deletedTitle": "Ta bort kartlager",
                "deletedMsg": "Kartlagret borttaget"
            },
            "error": {
                "title": "Fel!",
                "generic": "Systemfel. Försök på nytt senare."
            }
        }
    }
});