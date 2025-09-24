Oskari.registerLocalization(
{
    "lang": "de",
    "key": "MyFeatures",
    "value": {
        "title": "Datensatz importieren",
        "desc": "Eigene Datensätze können in den Formaten shp, gpx oder mif/mid in eine ZIP-Datei oder KMZ-Datei (zipped kml) importiert werden.",
        "tool": {
            "tooltip": "Eigenen Datensatz importieren"
        },
        "flyout": {
            "title": "Datensatz importieren",
            "description": "Eigene Datensätze können in den Formaten shp-, gpx oder mif/mid in eine ZIP-Datei oder KMZ-Datei (zipped kml) importiert werden. Die Datei darf maximal 5000 Objekte enthalten.",
            "help": "",
            "actions": {
                "cancel": "Abbrechen",
                "next": "Weiter",
                "close": "",
                "submit": "Senden"
            },
            "layer": {
                "title": "Informationen zum Datensatz speichern:",
                "name": "Name",
                "desc": "Beschreibung",
                "source": "Datenquelle",
                "style": "Festlegung des Datensatzstils:"
            },
            "validations": {
                "error": {
                    "title": "Fehler",
                    "message": "Datei wurde nicht ausgewählt und Name der Kartenebene fehlt."
                }
            },
            "finish": {
                "success": {
                    "title": "Datensatz wurde erfolgreich importiert.",
                    "message": "Kartenebene befindet sich unter dem Menüpunkt \"Meine Daten\"."
                },
                "failure": {
                    "title": "Import des Datensatzes fehlgeschlagen. Bitte versuchen Sie es später noch einmal."
                }
            }
        },
        "tab": {
            "title": "Datensatz",
            "grid": {
                "name": "Name",
                "desc": "Beschreibung",
                "source": "Datenquelle",
                "remove": "Löschen",
                "removeButton": "Löschen"
            },
            "confirmDeleteMsg": "Möchten Sie folgendes löschen \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Abbrechen",
                "delete": "Löschen"
            },
            "notification": {
                "deletedTitle": "Datensatz löschen",
                "deletedMsg": "Der datensatz wurde gelöscht."
            },
            "error": {
                "title": "Fehler!",
                "generic": "Systemfehler. Bitte versuchen Sie es später noch einmal."
            }
        },
        "layer": {
            "organization": "Eigener Datensatz",
            "inspire": "Eigener Datensatz"
        }
    }
});
