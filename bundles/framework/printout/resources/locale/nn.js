Oskari.registerLocalization(
{
    "lang": "nn",
    "key": "Printout",
    "value": {
        "title": "Skriv ut kartvisning",
        "flyouttitle": "Skriv ut kartvisning",
        "desc": "",
        "btnTooltip": "Skriv ut",
        "BasicView": {
            "title": "Skriv ut kartvisning",
            "name": {
                "label": "Kartnamn",
                "placeholder": "påkravd",
                "tooltip": "Gi kartet ditt eit beskrivande namn. Legg merke til språket i grensesnittet."
            },
            "language": {
                "label": "Språk",
                "options": {
                    "fi": "finsk",
                    "sv": "svensk",
                    "en": "engelsk"
                },
                "tooltip": "Vel kva for eit språk som skal brukast i utskriften. Legg merke til språket i grensesnittet og datasettet"
            },
            "size": {
                "label": "Storleik",
                "tooltip": "Velg utskriftsstørrelse. Oppdateringer vises i forhåndsvisningen",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 portrett",
                        "classForPreview": "førehandsvisning-portrett",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 landskap",
                        "classForPreview": "førehandsvisning-landskap"
                    },
                    {
                        "id": "A3",
                        "label": "A3 portrett",
                        "classForPreview": "førehandsvisning-portrett"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 landskap",
                        "classForPreview": "førehandsvisning-landskap"
                    }
                ]
            },
            "preview": {
                "label": "Førehandsvisning",
                "tooltip": "Du kan forstørre førehandsvisninga ved å klikke på biletet",
                "pending": "Førehandsvisninga vil bli oppdatert",
                "notes": {
                    "extent": "Du kan sjekke kartutstrekninga for utskrifta i førehandsvisninga",
                    "restriction": "Ikkje alle kartlag blir vist i førehandsvisninga"
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
                "tooltip": "Utskriftsmålestokk er den same som i nettlesaren",
                "zoomlevel": "Utskriftsmålestokk"
            },
            "settings": {
                "label": "Fleire innstillingar",
                "tooltip": "Vel filformat, tittel, målestokk og dato for utskrift"
            },
            "format": {
                "label": "Filformat",
                "tooltip": "Vel filformat",
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
                "label": "Kartnamn",
                "tooltip": "Legg til namn på kartet"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Vis logoen til den finske geoportalen Paikkatietoikkuna i utskrifta",
                        "tooltip": "Du kan skjule logoen til den finske geoportalen Paikkatietoikkuna om naudsynt",
                        "checked": "kontrollert"
                    },
                    {
                        "id": "pageScale",
                        "label": "Legg til målestokk til kartutskrifta",
                        "tooltip": "Legg til målestokk til kartet dersom det er ynskjeleg",
                        "checked": "kontrollert"
                    },
                    {
                        "id": "pageDate",
                        "label": "Vis dato i kartutskrifta",
                        "tooltip": "Du kan legge til dato i utskrifta",
                        "checked": "kontrollert"
                    }
                ]
            },
            "help": "Hjelp",
            "error": {
                "title": "Feil",
                "size": "Feil storleik",
                "name": "Namn er påkravd",
                "nohelp": "Ingen hjelpefunksjon er tilgjengeleg",
                "saveFailed": "Utskrift feila. Ver grei og prøv om att seinare",
                "nameIllegalCharacters": "Namnet inneheld ugyldige teikn. Tillatne teikn er bokstavane a-z samt å, ä og ö, tal og bindestrekar."
            }
        },
        "StartView": {
            "text": "Du kan skrive ut kartutsnittet ditt som PNG eller PDF",
            "info": {
                "maxLayers": "Du kan bruke maksimalt åtte kartlag i utskrifta",
                "printoutProcessingTime": "Utskrift kan ta noko tid når mange lag er valde"
            },
            "buttons": {
                "continue": "Hald fram",
                "cancel": "Avbryt"
            }
        }
    }
});
