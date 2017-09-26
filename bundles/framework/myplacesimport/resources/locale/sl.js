Oskari.registerLocalization(
{
    "lang": "sl",
    "key": "MyPlacesImport",
    "value": {
        "title": "Uvoz nabora podatkov",
        "desc": "Lahko uvoziš lasten nabor podatkov v shp-, gpx- in mif/mid formatu v zip datoteki ali v kmz formatu (stisnjen kml).",
        "tool": {
            "tooltip": "Uvoz lastnega nabora podatkov"
        },
        "flyout": {
            "title": "Uvoz nabora podatkov",
            "description": "Lahko uvoziš lasten nabor podatkov v shp-, gpx- in mif/mid formatu v zip datoteki ali v kmz formatu (stisnjen kml). Lahko uvoziš podatke, ki vsebujejo največ do 5000 pojavov.",
            "help": "Upload a dataset from your computer as a zipped file. Please check that all the files are in the correct file format and coordinate reference system.",
            "actions": {
                "cancel": "Prekliči",
                "next": "Naslednji"
            },
            "file": {
                "submit": "Pošlji",
                "fileOverSizeError": {
                    "title": "Napaka",
                    "message": "Izbrana datoteka je prevelika. B+velikost je omejena na  <xx> mb.",
                    "close": "Zapri"
                }
            },
            "layer": {
                "title": "Shrani informacije o naboru podatkov",
                "name": "Ime",
                "desc": "Opis",
                "source": "Vir podatkov",
                "style": "Opis opredelitve sloga"
            },
            "validations": {
                "error": {
                    "title": "Napaka",
                    "message": "Datoteke ni bila izbrana in manjka ime sloja karte"
                }
            },
            "finish": {
                "success": {
                    "title": "Uspešen uvoz nabora podatkov",
                    "message": "Sloj karte lahko poiščeš v meniju ''Moji podatki''."
                },
                "failure": {
                    "title": "Uvoz nabora podatkov ni uspel. Prosim poskusi kasneje."
                }
            }
        },
        "tab": {
            "title": "Nabor podatkov",
            "grid": {
                "name": "Ime",
                "description": "Opis",
                "source": "Vir podatkov",
                "remove": "Briši",
                "removeButton": "Briši"
            },
            "confirmDeleteMsg": "Ali želiš izbrisati \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Prekliči",
                "delete": "Izbriši"
            },
            "notification": {
                "deletedTitle": "Izbriši nabor podatkov",
                "deletedMsg": "Nabor podatkov je zbrisan"
            },
            "error": {
                "title": "Napaka!",
                "generic": "Prišlo je do sistemske napake. Prosim poskusi kasneje."
            }
        },
        "layer": {
            "organization": "Lasten nabor podatkov",
            "inspire": "Lasten nabor podatkov"
        }
    }
});
