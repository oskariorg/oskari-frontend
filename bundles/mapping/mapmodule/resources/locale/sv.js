Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "MapModule",
    "value": {
        "status_update_map": "Laddar kartan…",
        "zoombar_tooltip": {
            "zoomLvl-0": "Bakgrundskarta",
            "zoomLvl-1": "Land",
            "zoomLvl-2": "provins",
            "zoomLvl-3": "",
            "zoomLvl-4": "Stad",
            "zoomLvl-5": "",
            "zoomLvl-6": "",
            "zoomLvl-7": "Stadsdel",
            "zoomLvl-8": "",
            "zoomLvl-9": "",
            "zoomLvl-10": "Gata",
            "zoomLvl-11": "",
            "zoomLvl-12": ""
        },
        "styles": {
            "defaultTitle": "Standard stil"
        },
        "plugin": {
            "LogoPlugin": {
                "terms": "Användarvillkor",
                "dataSources": "Datakällor",
                "layersHeader": "Kartlager"
            },
            "DataSourcePlugin": {
                "link": "Datakälla",
                "popup": {
                    "title": "Datakällor",
                    "content": "INTE ÖVERSATT"
                },
                "button": {
                    "close": "Stäng"
                }
            },
            "BackgroundLayerSelectionPlugin": {
                "emptyOption": "Inget val"
            },
            "LayerSelectionPlugin": {
                "title": "Kartlager",
                "chooseDefaultBaseLayer": "Välj bakgrundskarta",
                "headingBaseLayer": "Bakgrundskarta",
                "chooseOtherLayers": "Välj andra kartlager",
                "style": "Stil"
            },
            "SearchPlugin": {
                "placeholder": "Sök plats/adress",
                "search": "Sök",
                "title": "Sökresultat",
                "close": "Stäng sökresultat.",
                "noresults": "Inga resultat hittades. Vänligen avgränsa din sökning.",
                "searchResultCount": "Din sökning gav {count} resultat.",
                "searchMoreResults": "Sökordet gav flera träffar än kunde visas ({count}). Specificera sökordet för bättre resultat.",
                "autocompleteInfo": "Motsvarande sökvillkor",
                "column_name": "Namn",
                "column_region": "Region",
                "column_village": "Kommun",
                "column_type": "Typ",
                "options": {
                    "title": "Search options",
                    "description": "Refine search criteria by choosing data sources"
                },
                "resultBox": {
                    "close": "Stäng",
                    "title": "Sökresultat",
                    "alternatives": "Den här platsen har följande alternativa namn:"
                }
            },
            "GetInfoPlugin": {
                "title": "Objektuppgifter",
                "layer": "Kartlager",
                "places": "Egenskaper",
                "description": "Beskrivning",
                "link": "URL-address",
                "name": "Namn",
                "noAttributeData": "Inga attributer att visa, vänligen öppna objektuppgifterna för att se de dolda attributerna."
            },
            "PublisherToolbarPlugin": {
                "history": {
                    "reset": "Gå tillbaka till standardvyn för kartvyn",
                    "back": "Tillbaka till föregående vy",
                    "next": "Flytta till nästa vy"
                },
                "measure": {
                    "line": "Mät avstånd",
                    "area": "Mät areal"
                }
            },
            "MarkersPlugin": {
                "title": "Kartmarkör",
                "tooltip": "Kartmarkör",
                "form": {
                    "style": "Punktens stil",
                    "message": {
                        "label": "Placera text på kartan",
                        "hint": "Skriv ett meddelande"
                    }
                },
                "dialog": {
                    "message": "Välj en ny plats för markören genom att klicka på kartan.",
                    "clear": "Ta bort alla markörer"
                }
            },
            "MyLocationPlugin": {
                "tooltip": "Centrera kartan till din plats",
                "error": {
                    "title": "Fel vid sökning av plats!",
                    "timeout": "Att söka platsen tar längre tid än förväntat...",
                    "denied": "Sidan har blockerat platsen. Vänligen möjliggör att din plats visas och försök på nytt.",
                    "noLocation": "Definiering av plats misslyckades",
                    "close": "Stäng"
                }
            },
            "PanButtonsPlugin": {
                "center" : {
                    "tooltip": "Gå tillbaka till standardvyn för kartvyn",
                    "confirmReset": "Vill du gå tillbaka till standardvyn för kartvyn?"
                }
            },
            "Tiles3DLayerPlugin": {
                "layerFilter": {
                    "text": "3D kartlager",
                    "tooltip": "Visa endast 3D-datamängder"
                }
            },
            "WfsVectorLayerPlugin": {
                "editLayer": "Editera kartlager",
                "layerFilter": {
                    "tooltip": "Visa endast kartlager med vektorgrafik",
                    "featuredata": "Vektorlager"
                }
            }
        },
        "layerVisibility": {
            "notInScale": "\"{name}\" kartlagrets objekter kan inte visas i denna skala. Välj en lämplig skalnivå.",
            "notInGeometry": "Kartlagret \"{name}\" har inga objekter i detta område. Gå till en annan vy på kartan."
        },
        "layerUnsupported": {
            "common": "Denna kartlager kan inte visas.",
            "srs": "Denna kartlager kan inte visas med den aktuella kartprojektionen.",
            "dimension": "Vissa kartlager i denna kartvy kan inte visas med {dimension}.",
            "mapLayerUnavailable": 'Kartlagret "{name}" kan inte visas.'
        },
        "guidedTour": {
            "help1": {
                "title": "Panorera kartvyn",
                "message": "Du kan flytta vyn på kartan genom att klicka och dra eller med panoreringskontrollerna. Återgå till standardvyn genom att klicka på knappen i mitten av panoringskontrollerna. Tips: Du kan även panorera kartan med piltangenterna på tangentbordet."
            },
            "help2": {
                "title": "Zooma in och zooma ut",
                "message": "Du kan zooma in och ut på kartan med skalans glidreglage eller med hjälp av plus- och minusknapparna bredvid glidreglaget. Tips: Du kan även zooma genom att använda plus och minus på tangentbordet eller med rullhjulet på musen. Du kan också zooma in genom att dubbelklicka på kartan."
            }
        },
        "layerCoverageTool": {
            "name": "Visa kartlagrets utsträckning",
            "removeCoverageFromMap": "Göm kartlagrets utsträckning"
        },
        "publisherTools": {
            "ScaleBarPlugin": "Skalstock",
            "MyLocationPlugin": {
                "toolLabel": "Centrera kartan på användarens position",
                "modes": {
                    "single": "Enskild",
                    "continuous": "Fortsatt"
                },
                "titles": {
                    "mode": "Funktion",
                    "mobileOnly": "Tillåt funktionen endast för mobilapparater",
                    "centerMapAutomatically": "Centrera kartan till användarens plats vid start"
                }
            },
            "PanButtons": {
                "toolLabel": "Gå tillbaka till standardvyn för kartvyn",
                "titles": {
                    "showArrows": "Panoreringsverktyg"
                }
            },
            "GetInfoPlugin": {
                "toolLabel": "Frågverktyg för visande av objektuppgifter"
            },
            "IndexMapPlugin": {
                "toolLabel": "Indexkarta"
            },
            "Zoombar": {
                "toolLabel": "Skalans glidreglage"
            },
            "CrosshairTool": {
                "toolLabel": "Visa kartans mittpunkt"
            },
            "LayerSelection": {
                "toolLabel": "Kartlagermeny",
                "selectAsBaselayer": "Välj bakgrundskartlager",
                "allowStyleChange": "Tillåt val av visningsstil",
                "showMetadata": "Visa länkar för metadata",
                "noMultipleStyles": "Endast en visningsstil är tillgänglig för valda kartlager.",
                "noMetadata": "Metadatalänkar är inte tillgängliga på valda kartlager"
            },
            "SearchPlugin": {
                "toolLabel": "Adress- och ortnamnssökning"
            },
            "ControlsPlugin": {
                "toolLabel": "Flytta kartvyn med musen"
            },
            "PublisherToolbarPlugin": {
                "toolLabel": "Kartverktyg",
                "history": "Gå bakåt eller framåt",
                "measureline": "Mät avstånd",
                "measurearea": "Mät område"
            }
        }
    }
});