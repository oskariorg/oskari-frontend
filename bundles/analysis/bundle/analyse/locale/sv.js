Oskari.registerLocalization({
    "lang" : "sv",
    "key" : "Analyse",
    "value" : {
        "title" : "Analys",
        "flyouttitle" : "Analys",
        "desc" : "",
        "btnTooltip" : "Analys",
        "AnalyseView" : {
            "title" : "Analys",
            "content" : {
                "label" : "Material",
                "tooltip" : "Tillsätta material - trycka  [tillsätta material] knappen"
            },
            "method" : {
                "label" : "Metod",
                "tooltip" : "Väljä först material och efter det metods är till hands",
                "options" : [{
                    "id" : "oskari_analyse_buffer",
                    "label" : "zon",
                    "classForMethod" : "buffer",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_aggregate",
                    "label" : "Sammandrag",
                    "classForPreview" : "aggregate"
                }, {
                    "id" : "oskari_analyse_union",
                    "label" : "Union",
                    "classForPreview" : "union"
                }, {
                    "id" : "oskari_analyse_intersect",
                    "label" : "Sektion",
                    "classForPreview" : "intersect"
                }]
            },
             "aggregate" : {
                 "label" : "Aggregate funktion",
                "options" : [{
                    "id" : "oskari_analyse_sum",
                    "label" : "Summa",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_count",
                    "label" : "Antal"
                }, {
                    "id" : "oskari_analyse_min",
                    "label" : "Minimum"
                },{
                    "id" : "oskari_analyse_max",
                    "label" : "Maximum"
                },{
                    "id" : "oskari_analyse_med",
                    "label" : "Medeltal"
                }  ]
            },
            "buffer_size" : {
                "label" : "Zon storlek (m)",
                "tooltip" : "Passa zon storlek"
            },
            "analyse_name" : {
                "label" : "Analys namn",
                "tooltip" : "Ge analys namn"
            },
            "settings" : {
                "label" : "Parameter",
                "tooltip" : "Passa parameterna för analys"
            },
            "intersect" : {
                "label" : "Intersect lag"
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
            "params" : {
                "label" : "Väljad attribut data",
                "tooltip" : "",
                "options" : [{
                    "id" : "oskari_analyse_all",
                    "selected" : true,
                    "label" : "alla"
                }, {
                    "id" : "oskari_analyse_none",
                    "label" : "Ingenting"
                }, {
                    "id" : "oskari_analyse_select",
                    "label" : "Använda list"
                }]
            },
            "output" : {
                "label" : "Layout",
                "color_label" : "Väljä färg:",
                "colorset_tooltip" : "Ändra färg inställning",
                "tooltip" : "Passa färg för analys layout"
            },

            "buttons" : {
                "save" : "Lagra",
                "analyse" : "Fortsätta analys",
                "data" : "Öka data",
                "cancel" : "Avbryta"
            },
            "help" : "Anvisning",
            "error" : {
                "title" : "Fel",
                "bufferSize" : "Fel i zon storlek",
                "nohelp" : "ingen anvisning",
                "saveFailed" : "Fel i analys lagring. Försök senare igen.",
                "illegalCharacters" : "ingen bokstaver - använda sifror"
            }

        },
        "StartView" : {
            "text" : "Analys data och lagra analysen",
            "infoseen" : {
                "label" : "Inte see denna dialog i fortsätting "
            },
            "buttons" : {
                "continue" : "Starta analys",
                "cancel" : "Avbryta"
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
