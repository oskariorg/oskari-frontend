Oskari.registerLocalization(
{
    "lang": "it",
    "key": "MyPlacesImport",
    "value": {
        "title": "Importa il dataset",
        "desc": "È possibile importare i propri dataset in formato shp-, GPX- o MIF/ MID file zip o in formato KMZ (kml compresso).",
        "tool": {
            "tooltip": "Importa il tuo dataset"
        },
        "flyout": {
            "title": "Importa il dataset",
            "description": "È possibile importare i propri dataset in formato shp-, GPX- o MIF/ MID file zip o in formato KMZ (kml compresso).",
            "help": "Seleziona un file dal tuo computer o fornisci un link al file che contiene il dataset. Il file può essere in formato shp, zip o kml/kmz. Puoi comprimere uno shapefile inserendo tutti i suoi file (suffisso shp, shx, dbf e prj) nello stesso file compresso. \r\nAnche i kml / kmz file ottenuti da Google Maps possono essere compressi allo stesso modo._x000D_\r\nI file MIF / MID devono essere nello stesso CRS della mappa - cerca CRS disponibili sotto la barra dello zoom",
            "actions": {
                "cancel": "Cancella",
                "next": "Avanti"
            },
            "file": {
                "submit": "Invia",
                "fileOverSizeError": {
                    "title": "Errore",
                    "message": "Il dataset è troppo grande. La dimensione massima del dataset da importare è <xx> mb",
                    "close": "Chiudi"
                }
            },
            "layer": {
                "title": "Salva le informazioni del dataset",
                "name": "Nome",
                "desc": "Descrizione",
                "source": "Sorgente del dato",
                "style": "Definizioni dello stile del dataset:"
            },
            "validations": {
                "error": {
                    "title": "Errore",
                    "message": "Il file non è stato selezionato e manca il nome del layer"
                }
            },
            "finish": {
                "success": {
                    "title": "L'importazione del dataset è riuscita.",
                    "message": "È possibile trovare il layer nel menu \"I miei dati\"."
                },
                "failure": {
                    "title": "L'importazione del dataset non è riuscita. Si prega di riprovare più tardi."
                }
            }
        },
        "tab": {
            "title": "Datasets",
            "grid": {
                "name": "Nome",
                "description": "Descrizione",
                "source": "Sorgente del dato",
                "remove": "Elimina",
                "removeButton": "Elimina"
            },
            "confirmDeleteMsg": "Vuoi eliminare \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Cancella",
                "delete": "Elimina"
            },
            "notification": {
                "deletedTitle": "Elimina il dataset",
                "deletedMsg": "Il dataset è stato eliminato"
            },
            "error": {
                "title": "Errore!",
                "generic": "Errore di sistema. Si prega di riprovare più tardi."
            }
        },
        "layer": {
            "organization": "I miei datasets",
            "inspire": "I miei datasets"
        }
    }
});
