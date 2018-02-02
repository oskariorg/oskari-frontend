Oskari.registerLocalization(
{
    "lang": "nb",
    "key": "Printout",
    "value": {
        "title": "Skriv ut kartvisning",
        "flyouttitle": "Skriv ut kartvisning",
        "desc": "",
        "btnTooltip": "Skriv ut",
        "BasicView": {
            "title": "Skriv ut kartvisning",
            "name": {
                "label": "Kartnavn",
                "placeholder": "påkrevd",
                "tooltip": "Gi kartet ditt et beskrivende navn. Legg merke til språket i grensesnittet."
            },
            "language": {
                "label": "Språk",
                "options": {
                    "fi": "finsk",
                    "sv": "svensk",
                    "en": "engelsk"
                },
                "tooltip": "Velg hvilket språk som skal brukes i utskriften. Legg merke til språket i grensesnittet og datasettet"
            },
            "size": {
                "label": "Størrelse",
                "tooltip": "Velg utskriftsstørrelse. Oppdateringer vises i forhåndsvisningen",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 portrett",
                        "classForPreview": "forhåndsvisning-portrett",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 landskap",
                        "classForPreview": "forhåndsvisning-landskap"
                    },
                    {
                        "id": "A3",
                        "label": "A3 portrett",
                        "classForPreview": "forhåndsvisning-portrett"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 landskap",
                        "classForPreview": "forhåndsvisning-landskap"
                    }
                ]
            },
            "preview": {
                "label": "Forhåndsvisning",
                "tooltip": "Du kan forstørre forhåndsvisningen ved å klikke på bildet",
                "pending": "Forhåndsvisningen vil bli oppdatert",
                "notes": {
                    "extent": "Du kan sjekke kartutstrekningen for utskriften i forhåndsvisningen",
                    "restriction": "Ikke alle kartlag vises i forhåndsvisningen"
                }
            },
            "buttons": {
                "save": "Hent utskrift",
                "ok": "OK",
                "back": "Forrige",
                "cancel": "Avbryt"
            },
            "location": {
                "label": "Posisjon og zoomnivå",
                "tooltip": "Utskriftsmålestokk er den samme som i nettleseren",
                "zoomlevel": "Utskriftsmålestokk"
            },
            "settings": {
                "label": "Flere innstillinger",
                "tooltip": "Velg filformat, tittel, målestokk og dato for utskrift"
            },
            "format": {
                "label": "Filformat",
                "tooltip": "Velg filformat",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG bildefil"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF-dokument"
                    }
                ]
            },
            "mapTitle": {
                "label": "Kartnavn",
                "tooltip": "Legg til navn på kartet"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Vis logoen til den finske geoportalen Paikkatietoikkuna i utskriften",
                        "tooltip": "Du kan skjule logoen til den finske geoportalen Paikkatietoikkuna om nødvendig",
                        "checked": "kontrollert"
                    },
                    {
                        "id": "pageScale",
                        "label": "Legg til målestokk til kartutskriften",
                        "tooltip": "Legg til målestokk til kartet dersom det er ønskelig",
                        "checked": "kontrollert"
                    },
                    {
                        "id": "pageDate",
                        "label": "Vis dato i kartutskriften",
                        "tooltip": "Du kan legge til dato i utskriften",
                        "checked": "kontrollert"
                    }
                ]
            },
            "help": "Hjelp",
            "error": {
                "title": "Feil",
                "size": "Feil størrelse",
                "name": "Navn er påkrevd",
                "nohelp": "Ingen hjelpefunksjon er tilgjengelig",
                "saveFailed": "Utskrift feilet. Vennligst prøv igjen seinere",
                "nameIllegalCharacters": "Navnet inneholder ugyldige tegn. Tillatte tegn er bokstavene a-z samt å, ä og ö, tall og bindestreker."
            }
        },
        "StartView": {
            "text": "Du kan skrive ut kartutsnittet ditt som PNG eller PDF",
            "info": {
                "maxLayers": "Du kan bruke maksimalt åtte kartlag i utskriften",
                "printoutProcessingTime": "Utskrift kan ta noe tid når mange lag er valgt"
            },
            "buttons": {
                "continue": "Fortsett",
                "cancel": "Avbryt"
            }
        }
    }
});
