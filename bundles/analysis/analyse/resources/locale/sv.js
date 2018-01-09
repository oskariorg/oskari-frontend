Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "Analyse",
    "value": {
        "title": "Analys",
        "flyouttitle": "Analys",
        "desc": "",
        "btnTooltip": "Analys",
        "NotLoggedView": {
            "text": "Med häjlp av Analys funktion man kan göra enkla geografiska analys. Analyser kan göras för data produkter. Endast inloggade användare kan göra analys. Logga in <a href=\"/web/sv/login\">här</a>.",
            "signup": "Logga in",
            "register": "Registrera dig"
        },
        "AnalyseView": {
            "title": "Analys",
            "content": {
                "label": "Kartlager",
                "drawToolsLabel": "Objekt verktyg",
                "tooltip": "Välj ett karlager för en grund av analys. Om något kartlager är inte på listan, klicka \"Mera kartlager\". Om du vill fokusera kartan till en särkild plats, klicka \"Sök platser\". För att flitrera objekt klicka filterknapp. Ta bort kartlager från kartvyn genom att klicka korsknapp.",
                "drawToolsTooltip": "Tilllägg tillfälliga objekt, klippa befintliga objekt eller välj objekt genom att begränsa dem med geometriska mönster som du ritar.",
                "features": {
                    "title": "Tillägg objekt",
                    "buttons": {
                        "cancel": "Avbryt",
                        "finish": "Färdig"
                    },
                    "tooltips": {
                        "point": "Tilllägg en tillfällig punkt för en grund av analys.",
                        "line": "Tilllägg en tillfällig linje för en grund av analys.",
                        "area": "Tilllägg ett tillfällig område för en grund av analys."
                    },
                    "modes": {
                        "area": "Tillfälligt område",
                        "line": "Tillfällig linje",
                        "point": "Tillfällig punkt"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Tilllägg tillfällig punkt",
                        "add": "Rita en punkt (eller punkter). Klicka en position du vill. Tryck \"Färdig\". Punkten visas på \"Kartlager\" listan med namn \"Tillfällig punkt x\". X är punktens ordningstal. Ta punkt(er) bort genom att klicka \"Avbryt\"."
                    },
                    "line": {
                        "title": "Tilllägg tillfällig linje",
                        "add": "Rita en linje (eller linjer). Klicka brytpunkter (bl.a. startpunkt) på kartan. Till slut dubbelklicka en slutpunkt och tryck \"Färdig\". Linjen visas på \"Kartlager\" listan med namn \"Tillfällig linje x\". X är linjens ordningstal. Ta linj(er) bort genom att klicka \"Avbryt\"."
                    },
                    "area": {
                        "title": "Tilllägg tillfällig region",
                        "add": "Rita en linje (eller linjer). Klicka hörnpunkter (bl.a. startpunkt) på kartan. Du kan också göra ett hål till området genom att hålla nere ALT-tangenten. Till slut dubbelklicka en slutpunkt och tryck \"Färdig\". Linjen visas på \"Kartlager\" listan med namn \"Tillfällig linje x\". X är linjens ordningstal. Ta linj(er) bort genom att klicka \"Avbryt\"."
                    }
                },
                "drawFilter": {
                    "title": "Klippning",
                    "buttons": {
                        "cancel": "Avbryt",
                        "finish": "Färdig"
                    },
                    "tooltip": {
                        "point": "Klippa utvalda linjen med en punkt",
                        "line": "Klippa utvalda regionen med en linje",
                        "edit": "Klippa utvalda regionen med en annan region",
                        "remove": "Ta bort klippning"
                    },
                    "dialog": {
                        "modes": {
                            "point": {
                                "title": "Klippa linjen med en punkt",
                                "message": "Klippa en del av linjen. Klippningspunkter är antecknade med röda snedrutor. Om linjen agerar en cirkel, punkter är på varandra. Flytta punkter genom att dra dem med en datormus. Resultaten har antecknats med en röd linje. Till slut klicka \"Färdig\"."
                            },
                            "line": {
                                "title": "Klippa regionen med en linje",
                                "message": "Rita en linje över regionen. Klicka brytpunkter av kantlinjen och slutligen dubbelklicka slutpunkten. Flytta brytpunkter genom att dra dem med en datormus. Resultaten har antecknats med en blå region. Om du vill byta resultatsregionen, klicka en region du vill. Till slut klicka \"Färdig\"."
                            },
                            "edit": {
                                "title": "Klicka regionen med en annan region",
                                "message": "Rita en region ovanpå en klippandes region. Klicka hörnpunkter och till slut dubbelklicka en sista hörnpunkt. Flytta hörnpunkter genom att dra dem med datormus. Resultaten har antecknats med en blå region. Om du vill byta resultatsregionen, klicka en region du vill. Till slut klicka \"Färdig\"."
                            }
                        }
                    }
                },
                "selectionTools": {
                    "title": "Välj objekt",
                    "description": "Välj objekt genom att begränsa dem med geometriska monstret du ritar. Klippande objket väljas. Valet avses endast utvalda kartlagret.",
                    "button": {
                        "empty": "Ta bort valen"
                    }
                },
                "search": {
                    "title": "Sök platser",
                    "resultLink": "Använd i analys"
                }
            },
            "method": {
                "label": "Metod",
                "tooltip": "Välj en metod som du anväder i analys funktionen. Klicka i-symbol bredvid metodnamn om du vill läsa mera information om mefoden.",
                "options": [
                    {
                        "id": "oskari_analyse_buffer",
                        "label": "Zon",
                        "classForMethod": "buffer",
                        "selected": true,
                        "tooltip": "Tilllägg en zon omkring sina utvalda objekt. Du kan använda zoner i andra analys efteråt."
                    },
                    {
                        "id": "oskari_analyse_aggregate",
                        "label": "Statistiska mått",
                        "classForPreview": "aggregate",
                        "tooltip": "Beräkna statistiska mått för sina utvalda objekt. Skyddade objekt tas inte med i beräkning."
                    },
                    {
                        "id": "oskari_analyse_union",
                        "label": "Union",
                        "classForPreview": "union",
                        "tooltip": "Kombinera sina utvalda objekt till en ny objekt."
                    },
                    {
                        "id": "oskari_analyse_clip",
                        "label": "Klippning",
                        "classForPreview": "clip",
                        "tooltip": "Klippa sina jutvalda objekt med objekt frän ett annat kartlager. Resultaten innehåller objekt som år inom objekt av klippande karlager."
                    },
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Geometrisk filter",
                        "classForPreview": "intersect",
                        "tooltip": "Välj objekt på grund av klippandes kartlagret. Objekt som väljas är delvis eller helt inom klippande objekt."
                    },
                    {
                        "id": "oskari_analyse_layer_union",
                        "label": "Union av analyslager",
                        "classForPreview": "layer_union",
                        "tooltip": "Kombinera sina utvalda kartlager. Kartlager måste ha samma attribut."
                    },
                    {
                        "id": "oskari_analyse_areas_and_sectors",
                        "label": "Zoner och sektorer",
                        "classForPreview": "areas_and_sectors",
                        "tooltip": "Tilllägg flera zoner och sektorer omkring sina utvalda objekter."
                    },
                    {
                        "id": "oskari_analyse_difference",
                        "label": "Förändringsberäkning",
                        "classForPreview": "difference",
                        "tooltip": "Beräkna förandring mellan två kartlager. Kartlager har samma data från olika tider."
                    },
                    {
                        "id": "oskari_analyse_spatial_join",
                        "label": "Spatial join",
                        "classForPreview": "spatial_join",
                        "tooltip": "Kombinera attribut data frå två olika kartlager. Attributer kombineras baserad på geografisk position."
                    }
                ]
            },
            "aggregate": {
                "label": "Statistiska mått",
                "labelTooltip": "Välj statistiska mått som beräknas på grund av attribut data.",
                "options": [
                    {
                        "id": "oskari_analyse_Count",
                        "label": "Antal objekt",
                        "selected": true
                    },
                    {
                        "id": "oskari_analyse_Sum",
                        "label": "Summa"
                    },
                    {
                        "id": "oskari_analyse_Min",
                        "label": "Minsta värde"
                    },
                    {
                        "id": "oskari_analyse_Max",
                        "label": "Största värde"
                    },
                    {
                        "id": "oskari_analyse_Average",
                        "label": "Medelvärde"
                    },
                    {
                        "id": "oskari_analyse_StdDev",
                        "label": "Standardavvikelse"
                    },
                    {
                        "id": "oskari_analyse_Median",
                        "label": "Median"
                    },
                    {
                        "id": "oskari_analyse_NoDataCnt",
                        "label": "Skyddade objekt"
                    }
                ],
                "attribute": "Välj en attribut",
                "footer": "Skyddade objekt tas inte med i beräkning.",
                "aggregateAdditionalInfo": "Obs! Du har valt attribut data som innehåller text. Endast antal objekt kan beräknas för dem. Om antal objekt inte har valts, textlig attributdata tas inte med i analysresultatet."
            },
            "buffer_size": {
                "label": "Zon storlek",
                "labelTooltip": "Ge zon storlek som meter eller kilometer.",
                "tooltip": "Zon storlek"
            },
            "buffer_units": {
                "m": "meter",
                "km": "kilometer"
            },
            "analyse_name": {
                "label": "Analys namn",
                "labelTooltip": "Ge analys namn som beskriver resultaten.",
                "tooltip": "Analys namn"
            },
            "settings": {
                "label": "Parameter",
                "tooltip": "Ge parameter för analys. Parameter beror på sin utvald metod och filter."
            },
            "showFeatureData": "Öppna objekt data efter analys är färdig.",
            "showValuesCheckbox": "Visa beräknade värde utom att spara resultat.",
            "intersect": {
                "target": "Lager som klippas",
                "targetLabelTooltip": "Välj ett kartlager vars objekt klippas på grund av objekt på klippande kartlager.",
                "label": "Klippande lager",
                "labelTooltip": "Välj ett kartlager vars objekt klipper objekt på klippandes kartlager."
            },
            "union": {
                "label": "Kombinerande analyslager"
            },
            "layer_union": {
                "label": "Kombinerande analyslager",
                "labelTooltip": "Välj kombinerande analyslager. Objekt från dessa lager ska kombineras till ett analyslager.",
                "notAnalyseLayer": "Vald kartlager kan inte användas i en analys funktion. Välj ett annat lager.",
                "noLayersAvailable": "Valda analyslager har inte samma attribut. Välj lager som har samma attribut."
            },
            "areas_and_sectors": {
                "label": "Zoner och sektorer",
                "labelTooltip": "Ge zon antal och storlek, och sektor storlek.",
                "area_count": "Zon antal",
                "area_count_tooltip": "Antal mellan 0-12",
                "area_size": "Zon storlek",
                "area_size_tooltip": "Storlek",
                "sector_count": "Sektor antal",
                "sector_count_tooltip": "Antal mellan 0-12"
            },
            "difference": {
                "firstLayer": "Tidigare tidspunkt",
                "firstLayerTooltip": "Välj ett kartlager som innehåller ursprunglig data.",
                "firstLayerFieldTooltip": "Välj en attribut från tidigare kartlager. Data ska jämföras med data från senare kartlager.",
                "secondLayer": "Senare tidspunkt",
                "secondLayerTooltip": "Välj ett kartlager som innehåller förändrade data.",
                "secondLayerFieldTooltip": "Välj en attribut från senare kartlager. Data ska jämföras med data från tidigare kartlager.",
                "field": "Jämförbar attribut",
                "keyField": "Kombinerande attribut",
                "keyFieldTooltip": "Välj en kombinerande attribut. Det bestämmer entydigt vilka objekt ska jämföras."
            },
            "spatial": {
                "label": "Resultat objekt",
                "target": "Ursprunglig kartlager",
                "targetTooltip": "Välj ett kartlager som innehåller ursprunglig data. Objekt ska klippas med objekt från klippande kartlager.",
                "intersectingLayer": "Klippande kartlager",
                "intersectingLayerTooltip": "Välj ett klippande kartlager. Objekt på ursprunglig kartlager ska klippas på grund av det här kartlagret.",
                "labelTooltipIntersect": "Välj om resultaten innehåller klippande eller ingående objekt.",
                "options": [
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Klippande objekt",
                        "selected": true
                    },
                    {
                        "id": "oskari_analyse_contains",
                        "label": "Ingående"
                    }
                ]
            },
            "spatial_join": {
                "firstLayer": "Objektlager",
                "firstLayerTooltip": "Välj ett kartlager som objektlager. Attribut data ska kombineras med attribut data från källlager.",
                "firstLayerFieldTooltip": "Resultat attribut från objektlager",
                "secondLayer": "Källlager",
                "secondLayerTooltip": "Välj ett kartlager som källlager. Attribut data ska kombineras med attribut data från objektlager.",
                "secondLayerFieldTooltip": "Resultat attribut från källlager",
                "mode": "Välj metodstyp",
                "modeTooltip": "Välj om du vill använda statistiska mått i analys.",
                "normalMode": "Normal spatial join",
                "aggregateMode": "Statistiska mått",
                "backend_locale": [
                    {
                        "id": "count",
                        "label": "Objekt antal"
                    },
                    {
                        "id": "sum",
                        "label": "Summa"
                    },
                    {
                        "id": "min",
                        "label": "Minsta värde"
                    },
                    {
                        "id": "max",
                        "label": "Största värde"
                    },
                    {
                        "id": "avg",
                        "label": "Medelvärde"
                    },
                    {
                        "id": "stddev",
                        "label": "Standardavvikelse"
                    }
                ]
            },
            "params": {
                "label": "Resultat attribut",
                "aggreLabel": "Attribut data för statistiska mått",
                "aggreLabelTooltip": "Välj högst 10 attributer. Statistiska mått beräknas till dem.",
                "labelTooltip": "Välj högst 10 attributer som tas med i resultaten.",
                "tooltip": "",
                "options": [
                    {
                        "id": "oskari_analyse_all",
                        "selected": true,
                        "label": "Alla"
                    },
                    {
                        "id": "oskari_analyse_none",
                        "label": "Inga"
                    },
                    {
                        "id": "oskari_analyse_select",
                        "label": "Välj från listan"
                    }
                ]
            },
            "output": {
                "label": "Utseende",
                "color_label": "Välj stil:",
                "colorset_tooltip": "Välj stil för punkter, linjer och område.",
                "tooltip": "Välj en passande stil för punkter, linjer och område.",
                "random_color_label": "Slumpmässiga färg"
            },
            "buttons": {
                "save": "Lagra och sluta",
                "analyse": "Gör analys",
                "data": "Mera kartlager"
            },
            "help": "Anvisning",
            "success": {
                "layerAdded": {
                    "title": "Analys lyckades.",
                    "message": "Analys är färdig. Ett nyt analyslager {layer} har tilllagt. Du kan hitta sen på \"Egen data\" menu."
                }
            },
            "error": {
                "title": "Fel på analys",
                "invalidSetup": "Parameter är felaktiga.",
                "noParameters": "Kartlager eller parameter saknas. Välj ett kartlager för analys och parameter för utvald metod, och försök igen.",
                "noLayer": "Kartlager saknas. Välj ett kartlager för analys och försök igen.",
                "noAnalyseUnionLayer": "För att göra union av analyslager du behöver åtminstone två kartlager. Välj ett annat kartlager.",
                "invalidMethod": "Metod fanns inte. Välj en befintlig metod.",
                "bufferSize": "Zon storlek är felaktig. Fixa storlek och försök igen.",
                "illegalCharacters": "Zon storlek innehåller förbjudna symboler. Använd endast nummer, inte bokstäver, och försök igen.",
                "nohelp": "Anvisning fanns inte.",
                "saveFailed": "Resultat kunde inte lagras.",
                "loadLayersFailed": "Kartlager kunde inte laddas.",
                "loadLayerTypesFailed": "Behövliga objekt data kunde inte laddas.",
                "Analyse_parameter_missing": "Behövliga parameter saknas. Ge parameter och försök igen.",
                "Unable_to_parse_analysis": "Givna parameter är felaktiga. Fixa parameter och försök igen.",
                "Unable_to_get_WPS_features": "Ursprungsdata kunde inte laddas.",
                "WPS_execute_returns_Exception": "Analys utförning misslyckades.",
                "WPS_execute_returns_no_features": "Resultat har inga objekt.",
                "Unable_to_process_aggregate_union": "Statistiska mått kunde inte beräknas för unionen.",
                "Unable_to_get_features_for_union": "Ursprungsdata kunde inte laddas.",
                "Unable_to_store_analysis_data": "Resultaten kunde inte lagras.",
                "Unable_to_get_analysisLayer_data": "Ursprungsdata kunde inte laddas.",
                "timeout": "Analys misslyckades beroende på tidsutlösning.",
                "error": "Analys misslyckades.",
                "parsererror": "Det finns fel i resultaten."
            },
            "infos": {
                "title": "För många attributer",
                "layer": "Analyslager",
                "over10": "har över 10 attribut. Välj högst 10 attribut för analys. Du hittar en lista av attribut i meny \"Parameter\" när du har valt en analysmetod."
            },
            "aggregatePopup": {
                "title": "Analys resultat",
                "property": "Egenskap",
                "store": "Lagra",
                "store_tooltip": "Lagra geometri som tillfällig lager",
                "close": "Stäng"
            }
        },
        "StartView": {
            "text": "Med hjälp av Analys funktionen du kan göra enkla analys för kartlager som innehåller objekt data. Färdiga analys du kan hitta på \"Egna data\".",
            "layersWithFeatures": "Du kan göra välja objekt endast från ett kartlager. Välj ett kartlager. Märk att andra valen tas bort.",
            "infoseen": {
                "label": "Visa inte det här meddelande igen."
            },
            "buttons": {
                "continue": "Börja analys",
                "cancel": "Avbryt"
            }
        },
        "categoryform": {
            "name": {
                "label": "Namn",
                "placeholder": "Skriv analyslager namn."
            },
            "drawing": {
                "label": "",
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
                "delete": "Ta bort"
            },
            "title": "Analyser",
            "confirmDeleteMsg": "Vill du ta bort analyslager \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Avbryt",
                "delete": "Ta bort"
            },
            "notification": {
                "deletedTitle": "Ta bort analyslager",
                "deletedMsg": "Analyslager har tagit bort."
            },
            "error": {
                "title": "Fel!",
                "generic": "Systemfel skedde. Analys kunde inte avgöras."
            }
        }
    }
});
