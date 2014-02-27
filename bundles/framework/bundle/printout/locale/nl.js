Oskari.registerLocalization({
    "lang": "nl",
    "key": "Printout",
    "value": {
        "title": "Print kaartbeeld",
        "flyouttitle": "Print kaartbeeld",
        "desc": "",
        "btnTooltip": "Print",
        "BasicView": {
            "title": "Print kaartbeeld",
            "name": {
                "label": "Kaartnaam",
                "placeholder": "NOT TRANSLATED",
                "tooltip": "NOT TRANSLATED"
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
                "tooltip": "Kies afdrukindeling| Voorbeeldkaart wordt dienovereenkomstig aangepast.",
                "options": [{
                    "id": "A4",
                    "label": "A4 staand",
                    "classForPreview": "preview-portrait",
                    "selected": true
                }, {
                    "id": "A4_Landscape",
                    "label": "A4 liggend",
                    "classForPreview": "preview-landscape"
                }, {
                    "id": "A3",
                    "label": "A3 staand",
                    "classForPreview": "preview-portrait"
                }, {
                    "id": "A3_Landscape",
                    "label": "A3 liggend",
                    "classForPreview": "preview-landscape"
                }]
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
                "options": [{
                    "id": "png",
                    "format": "image/png",
                    "label": "PNG afbeelding"
                }, {
                    "id": "pdf",
                    "format": "application/pdf",
                    "selected": true,
                    "label": "PDF document"
                }]
            },
            "mapTitle": {
                "label": "Voeg titel toe",
                "tooltip": "Voeg een titel toe aan de kaart"
            },
            "content": {
                "options": [{
                    "id": "pageLogo",
                    "label": "Voeg het Oskari logo toe",
                    "tooltip": "U kunt het logo indien nodig verbergen",
                    "checked": "checked"
                }, {
                    "id": "pageScale",
                    "label": "Voeg schaal toe aan de kaart",
                    "tooltip": "Voeg schaal toe aan de kaart",
                    "checked": "checked"
                }, {
                    "id": "pageDate",
                    "label": "Voeg datum toe",
                    "tooltip": "U kunt de datum toevoegen aan de afdruk",
                    "checked": "checked"
                }]
            },
            "legend": {
                "label": "NOT TRANSLATED",
                "tooltip": "NOT TRANSLATED",
                "options": [{
                    "id": "oskari_legend_NO",
                    "loca": "NO",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED",
                    "selected": true

                }, {
                    "id": "oskari_legend_LL",
                    "loca": "LL",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }, {
                    "id": "oskari_legend_LU",
                    "loca": "LU",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }, {
                    "id": "oskari_legend_RU",
                    "loca": "RU",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }, {
                    "id": "oskari_legend_RL",
                    "loca": "RL",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }]
            },
            "help": "Help",
            "error": {
                "title": "Fout",
                "size": "NOT TRANSLATED",
                "name": "NOT TRANSLATED",
                "nohelp": "Er is geen hulp beschikbaar",
                "saveFailed": "Kaart uitpinten mislukt. Probeer het later opnieuw.",
                "nameIllegalCharacters": "NOT TRANSLATED"
            }
        },
        "StartView": {
            "text": "U kunt de kaartweergave die u zojuist gemaakt heeft gemaakt printen.",
            "info": {
                "maxLayers": "U kunt maximaal 8 lagen in één keer uitprinten",
                "printoutProcessingTime": "Verwerking van de afdruk zal enige tijd duren wanneer meerdere lagen geselecteerd zijn."
            },
            "buttons": {
                "continue": "Doorgaan",
                "cancel": "Annuleren"
            }
        }
    }
});
