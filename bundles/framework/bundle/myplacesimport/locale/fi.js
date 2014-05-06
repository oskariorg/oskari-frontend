Oskari.registerLocalization({
    "lang": "fi",
    "key": "MyPlacesImport",
    "value": {
        "title": "Omien aineistojen tuonti",
        "desc": "",
        "tool": {
            "tooltip": "Tuo oma aineisto"
        },
        "flyout": {
            "title": "Omien aineistojen tuonti",
            "description": "Voit tuoda omia aineistoja shape-formaatissa zip-muodossa tai kml/kmz tiedostoja.",
            "help": "Anna tämän toiminnon lähtöaineistoksi (Browse...) zip tiedoston nimi tai url-linkki vastaavaan tiedostoon. \nZip-tiedoston saat lataamalla koneellesi shape-siirtoformaatissa olevan aineiston \nja muodostamalla näistä tiedostoista (.shp, . shx, .dbf, .prj) zip-tiedosto \ntai lataa koneellesi Googlen kml/kmz tiedostoja. \ntai käytä tiedoston url-linkkiä. ",
            "actions": {
                "cancel": "Peruuta",
                "next": "Seuraava"
            },
            "file": {
                "submit": "Lähetä"
            },
            "layer": {
                "title": "Tallenna tason tiedot:",
                "name": "Nimi",
                "desc": "Kuvaus",
                "source": "Tietolähde",
                "style": "Tason tyyli"
            },
            "validations": {
                "error": {
                    "title": "Virhe",
                    "message": "Tiedosto ja tason nimi puuttuvat."
                }
            },
            "finish": {
                "success": {
                    "title": "Tason tuonti onnistui",
                    "message": "Löydät tason omat tiedot -valikosta"
                },
                "failure": {
                    "message": "Tason tuonti epäonnistui. Yritä myöhemmin uudelleen."
                }
            }
        },
        "tab": {
            "title": "Aineistot",
            "grid": {
                "name": "Nimi",
                "description": "Kuvaus",
                "source": "Tietolähde",
                "remove": " "
            },
            "confirmDeleteMsg": "Haluatko poistaa tason:",
            "buttons": {
                "ok": "OK",
                "cancel": "Peruuta",
                "delete": "Poista"
            },
            "notification": {
                "deletedTitle": "Karttatason poisto",
                "deletedMsg": "Karttataso poistettu."
            },
            "error": {
                "title": "Virhe!",
                "generic": "Järjestelmässä tapahtui virhe. Yritä uudelleen myöhemmin."
            }
        },
        "layer": {
            "organization": "Omat aineistot",
            "inspire": "Omat aineistot"
        }
    }
});
