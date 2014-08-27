Oskari.registerLocalization({
    "lang": "it",
    "key": "Analyse",
    "value": {
        "title": "Analisi <font color=red>(BETA)</font>",
        "flyouttitle": "Analisi <font color=red>(BETA)</font>",
        "desc": "",
        "btnTooltip": "Analisi",
        "notLoggedIn": "Solo gli utenti registrati possono fare analisi. <a href='/web/en/login'>Log in</a>.",
        "AnalyseView": {
            "title": "Analisi",
            "content": {
                "label": "Dati",
                "tooltip": "Aggiungi dati da analizzare",
                "features": {
                    "title": "Draw a feature",
                    "buttons": {
                        "cancel": "Cancel",
                        "finish": "Done"
                    },
                    "modes": {
                        "area": "Area",
                        "line": "Line",
                        "point": "Point"
                    }
                },
                "search": {
                    "title": "Search places",
                    "resultLink": "Add to analyse"
                }
            },

            "method": {
                "label": "Metodo",
                "tooltip": "Seleziona prima i dati, poi il metodo",
                "options": [{
                    "id": "oskari_analyse_buffer",
                    "label": "Buffer",
                    "classForMethod": "buffer",
                    "selected": true,
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_aggregate",
                    "label": "Aggregate",
                    "classForPreview": "aggregate",
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_union",
                    "label": "Union",
                    "classForPreview": "union",
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_intersect",
                    "label": "Intersect",
                    "classForPreview": "intersect",
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_layer_union",
                    "label": "Union of analyse layers",
                    "classForPreview": "layer_union",
                    "tooltip": "Unifica i layer con gli stessi attributi"
                }, {
                    "id": "oskari_analyse_areas_and_sectors",
                    "label": "Areas and sectors",
                    "classForPreview": "areas_and_sectors",
                    "tooltip": "NOT TRANSLATED"
                }, {
                    "id": "oskari_analyse_difference",
                    "label": "Difference computation",
                    "classForPreview": "difference",
                    "tooltip": ""
                }]
            },
            "aggregate": {
                "label": "Aggregate function",
                "options": [{
                    "id": "oskari_analyse_Count",
                    "label": "Conta",
                    "selected": true
                }, {
                    "id": "oskari_analyse_Sum",
                    "label": "Somma"
                }, {
                    "id": "oskari_analyse_Min",
                    "label": "Minimo"
                }, {
                    "id": "oskari_analyse_Max",
                    "label": "Massimo"
                }, {
                    "id": "oskari_analyse_Average",
                    "label": "Media"
                }, {
                    "id": "oskari_analyse_StdDev",
                    "label": "Deviazione standard"
                }, {
                    "id": "oskari_analyse_Median",
                    "label": "NOT TRANSLATED"
                }, {
                    "id": "oskari_analyse_NoDataCnt",
                    "label": "Unauthorized features"
                }],
                "attribute": "Scegli un attributo"
            },
            "buffer_size": {
                "label": "Dimensione Buffer",
                "tooltip": "Enter buffer size"
            },
            "buffer_units": {
                "m": "Metri",
                "km": "Chilometri"
            },
            "analyse_name": {
                "label": "Nome dell'analisi",
                "tooltip": "Inserisci il nome"
            },
            "settings": {
                "label": "Parametri",
                "tooltip": "Inserisci i parametri dell'analisi"
            },
            "intersect": {
                "target": "Layer di base",
                "label": "Layer da incrociare"
            },
            "union": {
                "label": "Secondo layer per l'unione"
            },
            "layer_union": {
                "label": "Scegli un layer per l'unione",
                "notAnalyseLayer": "Scegli un layer da analizzare",
                "noLayersAvailable": "Nessun layer trovato con gli stessi attributi"
            },
            "areas_and_sectors": {
                "area_count": "NOT TRANSLATED",
                "area_count_tooltip": "NOT TRANSLATED",
                "area_size": "NOT TRANSLATED",
<<<<<<< HEAD
                "area_size_tooltip": "NOT TRANSLATED",
                "sector_count": "NOT TRANSLATED",
=======
                "sector_count": "NOT TRANSLATED",
                "area_count_tooltip": "NOT TRANSLATED",
                "area_size_tooltip": "NOT TRANSLATED",
>>>>>>> release/1.23.0
                "sector_count_tooltip": "NOT TRANSLATED"
            },
            "spatial": {
                "label": "Operatore spaziale",
                "options": [{
                    "id": "oskari_analyse_intersect",
                    "label": "Intersect",
                    "selected": true
                }, {
                    "id": "oskari_analyse_contains",
                    "label": "Contains"
                }]
            },
            "params": {
                "label": "Selected columns",
                "aggreLabel": "Aggregate attributes",
                "tooltip": "",
                "options": [{
                    "id": "oskari_analyse_all",
                    "selected": true,
                    "label": "All"
                }, {
                    "id": "oskari_analyse_none",
                    "label": "None"
                }, {
                    "id": "oskari_analyse_select",
                    "label": "Scegli.."
                }]
            },
            "output": {
                "label": "Layout",
                "color_label": "Scegli i colori:",
                "colorset_tooltip": "Modifica colori",
                "tooltip": "Scegli i colori per il layout di analisi",
                "random_color_label": "Colori casuali"
            },
            "buttons": {
                "save": "Salva",
                "analyse": "Analizza",
                "data": "Aggiungi dati",
                "cancel": "Annulla",
                "ok": "OK"
            },
            "filter": {
                "title": "Filtri",
                "description": "Filtro per il layer ",
                "clearButton": "Cancella filtri",
                "refreshButton": "Aggiorna filtri",
                "addFilter": "Aggiungi un nuovo filtro",
                "removeFilter": "Rimuovi filtri",
                "bbox": {
                    "title": "Mappa dei filtri",
                    "on": "In uso",
                    "off": "Non in uso"
                },
                "clickedFeatures": {
                    "title": "Filtri sulle feature",
                    "label": "Includi solo le feature selezionate"
                },
                "values": {
                    "title": "Filter",
                    "placeholders": {
                        "case-sensitive": "",
                        "attribute": "Attributo",
                        "boolean": "Operatore logico",
                        "operator": "Operatore",
                        "attribute-value": "Valore"
                    },
                    "equals": "=",
                    "like": "~=",
                    "notEquals": "≠",
                    "notLike": "~≠",
                    "greaterThan": ">",
                    "lessThan": "<",
                    "greaterThanOrEqualTo": "≥",
                    "lessThanOrEqualTo": "≤"
                },
                "validation": {
                    "title": "I seguenti errori impediscono l'aggiornamento del filtro:",
                    "attribute_missing": "Manca l'attributo",
                    "operator_missing": "Manca l'operatore",
                    "value_missing": "Manca il valore",
                    "boolean_operator_missing": "Manca l'operatore logico"
                }
            },
            "help": "Help",
            "success": {
                "layerAdded": {
                    "title": "Analisi OK",
                    "message": "Un nuovo layer {layer} e' stato aggiunto"
                }
            },
            "error": {
                "title": "Errore",
                "invalidSetup": "Parametri errati",
                "noParameters": "Nessun dato di ingresso",
                "noLayer": "Nessun layer of feature selezionati",
                "noAnalyseUnionLayer": "Scegli almeno un altro layer da analizzare",
                "invalidMethod": "Metodo sconosciuto: ",
                "bufferSize": "Errore nella dimensione del buffer",
                "illegalCharacters": "Usa solo cifre",
                "nohelp": "Guida non trovata",
                "saveFailed": "Memorizzazione dell'analisi fallita: riprova fra un minutino.",
                "loadLayersFailed": "Fallito il caricamento del layer",
                "loadLayerTypesFailed": "Richiesta del dato WFS fallita",
                "Analyse_parameter_missing": "Mancano i parametri dell'analisi",
                "Unable_to_parse_analysis": "Impossibile fare il parsing dell'analisi",
                "Unable_to_get_WPS_features": "Impossibile leggere la feature WPS",
                "WPS_execute_returns_Exception": "WPS ritorna un eccezione",
                "WPS_execute_returns_no_features": "WPS non ritorna nessuna feature",
                "Unable_to_process_aggregate_union": "Impossibile processare l'unione",
                "Unable_to_get_features_for_union": "Impossibile ottenere feature dall'unione",
                "Unable_to_store_analysis_data": "Impossibile memorizzare i parametri dell'analisi",
                "Unable_to_get_analysisLayer_data": "Impossibile ottenere i dati del layer da analizzare",
                "timeout": "Analysis request timed out",
                "error": "Analysis failed for an unknown reason",
                "parsererror": "Server returned invalid analysis data"
            },
            "infos": {
                "title": "Info",
                "layer": "Layer ",
                "over10": " sopra i 10 attributi - seleziona un massimo di 10 attributi"
            }
        },
        "StartView": {
            "text": "Seleziona il layer ed i dati. Salva i risultati dell'analisi",
            "infoseen": {
                "label": "Non mostrare ancora questo messaggio"
            },
            "buttons": {
                "continue": "Inizia l'analisi",
                "cancel": "Annulla"
            }
        },
        "categoryform": {
            "name": {
                "label": "Nome",
                "placeholder": "Dai un nome al layer"
            },
            "drawing": {
                "label": "  ",
                "point": {
                    "label": "Punto",
                    "color": "Colore",
                    "size": "Dimensione"
                },
                "line": {
                    "label": "Linea",
                    "color": "Colore",
                    "size": "Spessore"
                },
                "area": {
                    "label": "Area",
                    "fillcolor": "Colore di riempimento",
                    "linecolor": "Colore del bordo",
                    "size": "Spessore del bordo"
                }
            },
            "edit": {
                "title": "Modifica il layer della mappa",
                "save": "Salve",
                "cancel": "Indietro"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Nome",
                "delete": "Cancella"
            },
            "title": "Analisi",
            "confirmDeleteMsg": "Vuoi cancellare:",
            "buttons": {
                "ok": "OK",
                "cancel": "Annulla",
                "delete": "Cancella"
            },
            "notification": {
                "deletedTitle": "Cancella layer di mappa",
                "deletedMsg": "Layer di mappa cancellato"
            },
            "error": {
                "title": "Errore!",
                "generic": "Errore di sistema; riprova fra qualche secondo."
            }
        }
    }
});
