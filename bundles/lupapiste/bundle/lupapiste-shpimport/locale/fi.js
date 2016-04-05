Oskari.registerLocalization({
    "lang": "fi",
    "key": "ShpImport",
    "value": {
        "title": "Omien aineistojen tuonti",
        "desc": "",
        "tool": {
            "tooltip": "Tuo oma aineisto"
        },
        "flyout": {
            "title": "Omien aineistojen tuonti",
            "description": "Voit tuoda omia aineistoja shape-formaatissa zip-muodossa (ETRS89 / ETRS-TM35FIN, EPSG:3067) ja kmz-tiedostoja (WGS 84, EPSG:4326).",
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
                "source": "Tietolähde"
            }
        },
        "layer": {
            "organization": "Omat aineistot",
            "inspire": "Omat aineistot"
        }
    }
});
