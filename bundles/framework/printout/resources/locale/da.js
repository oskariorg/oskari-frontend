Oskari.registerLocalization(
{
    "lang": "da",
    "key": "Printout",
    "value": {
        "title": "Udskriv kortvisning",
        "flyouttitle": "Udskriv kortvisning",
        "desc": "",
        "btnTooltip": "",
        "BasicView": {
            "title": "Udskriv kortvisning",
            "name": {
                "label": "",
                "placeholder": "",
                "tooltip": ""
            },
            "language": {
                "label": "",
                "options": {
                    "fi": "",
                    "sv": "",
                    "en": ""
                },
                "tooltip": ""
            },
            "size": {
                "label": "Størrelse",
                "tooltip": "Vælg udskriftslayout │Forhåndsvisning af kort opdateres i overensstemmelse hermed",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 portræt",
                        "classForPreview": "forhåndsvisning af portræt",
                        "selected": "Filename"
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 landskab",
                        "classForPreview": "forhåndsvisning af landskab"
                    },
                    {
                        "id": "A3",
                        "label": "A3 portræt",
                        "classForPreview": "forhåndsvisning af portræt"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 landskab",
                        "classForPreview": "forhåndsvisning af landskab"
                    }
                ]
            },
            "preview": {
                "label": "Forhåndsvisning",
                "tooltip": "Klik på den lille forhåndsvisning for at åbne en større forhåndsvisning",
                "pending": "Forhåndsvisning opdateres inden længe",
                "notes": {
                    "extent": "Forhåndsvisning kan bruges til at bedømme kortstørrelsen til udskrift",
                    "restriction": "Ikke alle kortlag vises i forhåndsvisning"
                }
            },
            "buttons": {
                "save": "Foretag udskrift",
                "ok": "OK",
                "back": "",
                "cancel": "Annullér"
            },
            "location": {
                "label": "Placering og zoomniveau",
                "tooltip": "Udskriftsskalering svarer til skaleringen af kortet i browseren",
                "zoomlevel": "Zoomniveau"
            },
            "settings": {
                "label": "Flere indstillinger",
                "tooltip": "Foretag yderligere indstillinger såsom format, titel og skalering"
            },
            "format": {
                "label": "Format",
                "tooltip": "Vælg filformat",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG image"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": "Filename",
                        "label": "PDF document"
                    }
                ]
            },
            "mapTitle": {
                "label": "Tilføj titel",
                "tooltip": "tilføj en titel til kortet"
            },
            "content": {
                "options": [
                    {
                        "id": "sideLogo",
                        "label": "Tilføj Oskari logo",
                        "tooltip": "Det er muligt at skjule logoet om nødvendigt",
                        "checked": "afkrydset"
                    },
                    {
                        "id": "sideSkalering",
                        "label": "Tilføj skalering til kortet",
                        "tooltip": "Tilføj skalering til kortet",
                        "checked": "afkrydset"
                    },
                    {
                        "id": "sideDato",
                        "label": "Tilføj dato",
                        "tooltip": "Du kan tilføje dato på udskriften",
                        "checked": "afkrydset"
                    }
                ]
            },
            "help": "Hjælp",
            "error": {
                "title": "Fejl",
                "size": "",
                "name": "",
                "nohelp": "Ingen hjælp tilgængelig",
                "saveFailed": "Kortudskrift mislykket│Prøv igen senere",
                "nameIllegalCharacters": ""
            }
        },
        "StartView": {
            "text": "Du kan udskrive den kortvisning, du lige har lavet",
            "info": {
                "maxLayers": "Du kan maksimalt udskrive 8 lag på én gang",
                "printoutProcessingTime": "Udskrivning tager lægere tid når der er valgt flere lag"
            },
            "buttons": {
                "continue": "Fortsæt",
                "cancel": "Annullér"
            }
        }
    }
});
