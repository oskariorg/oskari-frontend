Oskari.registerLocalization(
{
    "lang": "et",
    "key": "MyPlacesImport",
    "value": {
        "title": "Andmete import",
        "desc": "",
        "tool": {
            "tooltip": "Impordi oma andmed"
        },
        "flyout": {
            "title": "Andmete import",
            "description": "Impordi andmed oma arvutist kokkupakituna(*.zip failina). Toetatavad amdeformaadid on: Shapefile(*.shp, *.shx, *.dbf, *.prj); GPS-fail(*.gpx); MapInfo(*.mif, *.mid); Google Maps(*.kml, *.kmz). Veendu, et andmete koordinaatsüsteem on õige.",
            "help": "Impordi andmed oma arvutist kokkupakituna(*.zip failina). Enne iportimist veendu et andmed oleks õiges formaadis ja koordinaatsüsteemis.",
            "actions": {
                "cancel": "Tühista",
                "next": "Järgmine"
            },
            "file": {
                "submit": "Impordi",
                "fileOverSizeError": {
                    "title": "Viga",
                    "message": "Lisatav fail on liiga suur. Maksimum <xx> mb.",
                    "close": "Sulge"
                }
            },
            "layer": {
                "title": "Andmestiku info",
                "name": "Nimi",
                "desc": "Kirjaldus",
                "source": "Andmeallikas",
                "style": "Muuda stiili"
            },
            "validations": {
                "error": {
                    "title": "Viga",
                    "message": "Andmeid ei imporditud. Fail ja nimi on puudu. Eemalda vead ja proovi uuesti."
                }
            },
            "finish": {
                "success": {
                    "title": "Andmesiku import õnnestus.",
                    "message": "Andmestik on inporditud.  Leiad need \"Minu andmed\" manüü alt."
                },
                "failure": {
                    "title": "Andmestikku ei imporditud."
                }
            }
        },
        "tab": {
            "title": "Andmestikud",
            "grid": {
                "name": "Nimi",
                "description": "Kirjeldus",
                "source": "Andmeallikas",
                "remove": "Kustuta",
                "removeButton": "Kustuta"
            },
            "confirmDeleteMsg": "Kas tahad kustutada andmestikku \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Tühista",
                "delete": "Kustuta"
            },
            "notification": {
                "deletedTitle": "Andmestiku kustutamine",
                "deletedMsg": "Andmestik on kustutatud"
            },
            "error": {
                "title": "Viga",
                "generic": "Süsteemiviga esines"
            }
        },
        "layer": {
            "organization": "Minu andmestikud",
            "inspire": "Minu andmestikud"
        }
    }
});
