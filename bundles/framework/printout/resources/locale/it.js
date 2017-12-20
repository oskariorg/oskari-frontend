Oskari.registerLocalization(
{
    "lang": "it",
    "key": "Printout",
    "value": {
        "title": "Stampa la vista della mappa",
        "flyouttitle": "Stampa la vista della mappa",
        "desc": "",
        "btnTooltip": "Stampa",
        "BasicView": {
            "title": "Stampa la vista della mappa",
            "name": {
                "label": "Nome della mappa",
                "placeholder": "Obbligatorio",
                "tooltip": "Assegna un nome descrittivo alla tua mappa. Si prega di far riferimento alla lingua dell'interfaccia utente"
            },
            "language": {
                "label": "Lingua",
                "options": {
                    "fi": "Finlandese",
                    "sv": "Svedese",
                    "en": "Inglese"
                },
                "tooltip": "Seleziona la lingua da usare nella stampa. Si prega di fare riferimento alla lingua dell'interfaccia utente e del dataset."
            },
            "size": {
                "label": "Dimensione",
                "tooltip": "Scegli la dimensione di stampa. Gli aggiornamenti sono mostrati nell'anteprima",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 portrait",
                        "classForPreview": "Anteprima-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 landscape",
                        "classForPreview": "Anteprima-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3 portrait",
                        "classForPreview": "Anteprima-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 landscape",
                        "classForPreview": "Anteprima-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Anteprima",
                "tooltip": "Puoi ingrandire l'anteprima cliccando su di essa.",
                "pending": "L'anteprima sarà aggiornata a breve.",
                "notes": {
                    "extent": "Puoi controllare l'area di stampadella mappa nell'anteprima",
                    "restriction": "Non tutti i layers sono mostrati nell'anteprima"
                }
            },
            "buttons": {
                "save": "Avvia la stampa",
                "ok": "OK",
                "back": "Indietro",
                "cancel": "Cancella"
            },
            "location": {
                "label": "Posizione e livello di zoom",
                "tooltip": "La scala della stampa corrisponde alla scala della mappa nel browser",
                "zoomlevel": "Scala della stampa"
            },
            "settings": {
                "label": "Altre impostazioni",
                "tooltip": "Scegli un formato di file, un titolo, una scala e una data per la mappa da stampare"
            },
            "format": {
                "label": "Formato del file",
                "tooltip": "Scegli un formato di file",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG image"
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
                "label": "Titolo della mappa",
                "tooltip": "Aggiungi un titolo alla mappa"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Mostra il logo del geoportale finlandese Paikkatietoikkuna nella stampa.",
                        "tooltip": "Puoi nascondere il logo del geoportale finlandese Paikkatietoikkuna se necessario.",
                        "checked": "Verificato"
                    },
                    {
                        "id": "pageScale",
                        "label": "Aggiungi la scala alla mappa da stampare",
                        "tooltip": "Puoi aggiungere la scala alla mappa",
                        "checked": "Verificato"
                    },
                    {
                        "id": "pageDate",
                        "label": "Mostra la data nella mappa da stampare",
                        "tooltip": "Puoi aggiungere la data di stampa",
                        "checked": "Verificato"
                    }
                ]
            },
            "help": "Aiuto",
            "error": {
                "title": "Errore",
                "size": "Errore nella scelta della dimensione",
                "name": "Il nome è un'informazione obbligatoria",
                "nohelp": "Non vi è alcun aiuto disponibile",
                "saveFailed": "La stampa della vista della mappa non è riuscita. SI prega di riprovare più tardi",
                "nameIllegalCharacters": "Il nome contiene caratteri non consentiti. I caratteri consentiti sono le lettere dalla a alla z, nonché å, ä and ö,numeri, spazi e trattini."
            }
        },
        "StartView": {
            "text": "È possibile stampare la vista della mappa appena creata come immagine PNG o un file PDF.",
            "info": {
                "maxLayers": "È possibile utilizzare un massimo di otto layer nella stampa.",
                "printoutProcessingTime": "La stampa della mappa potrebbe richiedere più tempo quando si selezionano più layers"
            },
            "buttons": {
                "continue": "Continua",
                "cancel": "Cancella"
            }
        }
    }
});
