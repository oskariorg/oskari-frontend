Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "Printout",
    "value": {
        "title": "Skriv ut kartvyn",
        "flyouttitle": "Skriv ut kartvyn",
        "desc": "",
        "btnTooltip": "Skriv ut",
        "BasicView": {
            "title": "Skriv ut kartvyn",
            "size": {
                "label": "Storlek",
                "tooltip": "Välj utskriftsstorlek. Uppdateringar visas i förhandsgranskningsbilden.",
                "options": {
                    "A4": "A4 porträtt",                        
                    "A4_Landscape": "A4 landskap",
                    "A3": "A3 porträtt",
                    "A3_Landscape": "A3 landskap"        
                }
            },
            "preview": {
                "label": "Förhandsgranska",
                "pending": "Förhandsgransningsvyn uppdateras inom kort.",
                "notes": {
                    "extent": "Du kan kontrollera kartans omfattning för utskriften i förhandsgranskningsbilden."
                }
            },
            "settings": {
                "label": "Fler inställningar",
                "tooltip": "Välj ett filformat, en titel, en skala och ett datum för kartutskriften."
            },
            "format": {
                "label": "Filformat",
                "tooltip": "Välj fil format",
                "options": {
                    "png": "PNG bild",
                    "pdf": "PDF dokument"
                }
            },
            "content": {
                "label": "Synlig information",
                "tooltip": "",
                "pngNote": "Tilläggsinformationen ingår ej i PNG-utskriftet.",
                "mapTitle": {
                    "placeholder": "Rubrik"
                },
                "pageScale": {
                    "label": "Lägg en skala till kartutskriften",
                    "tooltip": "Lägg till skala till kartan, om du vill."
                },
                "pageDate": {
                    "label": "Visa ett datum i kartutskriften",
                    "tooltip": "Du kan lägga till ett datum till utskriften."
                },
                "pageTimeSeriesTime": {
                    "label": "Visa tidpunkten av tidsserien",
                    "tooltip": "Visa tiden för dess tidsserie på utskriften.",
                    "printLabel": "Tidpunkten av tidsserien"
                },
                "coordinates": {
                    "label": "Visa koordinaterna",
                    "position": {
                        "label": "Placering",
                        "options": {
                            "center": "Kartans mittpunkt",
                            "corners": "Knutpunkter"
                        }
                    },
                    "projection": {
                        "label": "Projektion",
                        "options": {
                            "map": "Kartans projektion",
                            "EPSG:4326": "WGS84"
                        }
                    }
                }
            },
            "error": {
                "saveFailed": "Utskriften av kartvyn lyckades inte. Försök igen senare."
            },
            "scale": {
                "label": "Skala",
                "tooltip": "Ange skalan som ska användas för utskrift",
                "map": "Använd kartskalan",
                "defined": "Välj en skala",
                "unsupportedLayersMessage": "Följande kartläggare visas inte på utskriften"
            }
        },
        "StartView": {
            "info": {
                "maxLayers": "Du kan använda högst åtta kartlager i utskriften.",
                "printoutProcessingTime": "Utskriften av kartvyn kan ta lite tid när flera lager är markerade."
            }
        }
    }
});
