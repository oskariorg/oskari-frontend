Oskari.registerLocalization({
    "lang": "sv",
    "key": "Analyse",
    "value": {
        "title": "Analys",
        "flyouttitle": "Analys",
        "desc": "",
        "btnTooltip": "Analys",
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
                    }
                ]
            },
             "aggregate" : {
                 "label" : "Aggregate funktion",
                "options" : [{
                    "id" : "oskari_analyse_Sum",
                    "label" : "Summa",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_Count",
                    "label" : "Antal"
                }, {
                    "id" : "oskari_analyse_Min",
                    "label" : "Minimum"
                },{
                    "id" : "oskari_analyse_Max",
                    "label" : "Maximum"
                },{
                    "id" : "oskari_analyse_Average",
                    "label" : "Medeltal"
                },{
                    "id" : "oskari_analyse_StdDev",
                    "label" : "Medel spridning"
                },{
                    "id" : "oskari_analyse_Median",
                    "label" : "Mediaan"
                }]
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
             "union" : {
                "label" : "Andra lag för union input"
            },
            "spatial" : {
                "label" : "Spatial operator",
                "options" : [{
                    "id" : "oskari_analyse_intersect",
                    "label" : "Klip",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_contains",
                    "label" : "Inkludera"
                }  ]
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
                    }
                ]
            },
            "output": {
                "label": "Layout",
                "color_label": "Väljä färg:",
                "colorset_tooltip": "Ändra färg inställning",
                "tooltip": "Passa färg för analys layout"
            },
            "buttons" : {
                "save" : "Lagra",
                "analyse" : "Fortsätta analys",
                "data" : "Öka data",
                "cancel" : "Avbryta",
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
            "help" : "Anvisning",
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
                "illegalCharacters": "ingen bokstaver - använda sifror"
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
        }
    }
});
