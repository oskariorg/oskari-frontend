Oskari.registerLocalization(
{
    "lang": "nl",
    "key": "Printout",
    "value": {
        "title": "Kaartbeeld afdrukken",
        "flyouttitle": "Kaartbeeld afdrukken",
        "desc": "",
        "btnTooltip": "Afdrukken",
        "BasicView": {
            "title": "Kaartbeeld afdrukken",
            "name": {
                "label": "Kaartnaam",
                "placeholder": "vereist",
                "tooltip": "Geef je kaart een beschrijvende naam. Let op de taal van de gebruikersinterface."
            },
            "language": {
                "label": "Taal",
                "options": {
                    "fi": "Fins",
                    "sv": "Zweeds",
                    "en": "Engels"
                },
                "tooltip": "Kies de taal van de kaartinterface en kaartgegevens."
            },
            "size": {
                "label": "Grootte",
                "tooltip": "Kies afdrukindeling. Voorbeeldkaart wordt dienovereenkomstig aangepast.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 staand",
                        "classForPreview": "preview-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 liggend",
                        "classForPreview": "preview-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3 staand",
                        "classForPreview": "preview-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 liggend",
                        "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Voorbeeld",
                "tooltip": "Klik op het kleine voorbeeld om een groter voorbeeld te openen",
                "pending": "Voorbeeld zal binnenkort worden bijgewerkt",
                "notes": {
                    "extent": "Voorbeeld kan worden gebruikt om er achter te komen wat de kaartomvang is voor de afdruk",
                    "restriction": "Niet alle kaartlagen worden getoond in het voorbeeld"
                }
            },
            "buttons": {
                "save": "Krijg afdruk",
                "ok": "OK",
                "back": "Vorige",
                "cancel": "Annuleren"
            },
            "location": {
                "label": "Locatie en het zoomniveau",
                "tooltip": "Afdruk schaal komt overeen met de schaal van de kaart in de browser.",
                "zoomlevel": "Zoomniveau"
            },
            "settings": {
                "label": "Meer instellingen",
                "tooltip": "Maak extra instellingen, zoals formaat, titel en de schaal"
            },
            "format": {
                "label": "Formaat",
                "tooltip": "Selecteer bestandsformaat",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG afbeelding"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF document"
                    }
                ]
            },
            "mapTitle": {
                "label": "Voeg titel toe",
                "tooltip": "Voeg een titel toe aan de kaart"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Voeg het Oskari logo toe",
                        "tooltip": "U kunt het logo indien nodig verbergen",
                        "checked": "checked"
                    },
                    {
                        "id": "pageScale",
                        "label": "Voeg schaal toe aan de kaart",
                        "tooltip": "Voeg schaal toe aan de kaart",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Voeg datum toe",
                        "tooltip": "U kunt de datum toevoegen aan de afdruk",
                        "checked": "checked"
                    }
                ]
            },
            "help": "Help",
            "error": {
                "title": "Fout",
                "size": "Fout in grootte definities",
                "name": "Naam is vereiste informatie",
                "nohelp": "Er is geen hulp beschikbaar",
                "saveFailed": "Kaart afdrukken mislukt. Probeer het later opnieuw.",
                "nameIllegalCharacters": "De naam bevat niet-toegestane tekens. Toegestane tekens zijn de letters a-z, evenals å, ä and ö, nummers, backspace en koppeltekens."
            }
        },
        "StartView": {
            "text": "U kunt de kaartweergave die u zojuist gemaakt heeft gemaakt afdrukken.",
            "info": {
                "maxLayers": "U kunt maximaal 8 lagen in één keer afdrukken",
                "printoutProcessingTime": "Verwerking van de afdruk zal enige tijd duren wanneer meerdere lagen geselecteerd zijn."
            },
            "buttons": {
                "continue": "Doorgaan",
                "cancel": "Annuleren"
            }
        }
    }
});
