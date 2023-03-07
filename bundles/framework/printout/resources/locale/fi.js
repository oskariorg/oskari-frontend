Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Printout",
    "value": {
        "title": "Tulostus",
        "flyouttitle": "Tulostus",
        "desc": "",
        "btnTooltip": "Tulosta nykyinen karttanäkymä png-kuvaksi tai pdf-tiedostoon.",
        "BasicView": {
            "title": "Tulosta karttanäkymä",
            "size": {
                "label": "Koko ja suunta",
                "tooltip": "Valitse tulosteen arkkikoko ja suunta. Tarkista muutokset esikatselukuvasta.",
                "options": {
                    "A4": "A4 pystysuunta",
                    "A4_Landscape": "A4 vaakasuunta",
                    "A3": "A3 pystysuunta",
                    "A3_Landscape": "A3 vaakasuunta"
                }
            },
            "preview": {
                "label": "Esikatselu",
                "pending": "Esikatselukuva päivitetään hetken kuluttua.",
                "notes": {
                    "extent": "Tarkista tulosteen kattavuusalue esikatselukuvasta."
                }
            },
            "settings": {
                "label": "Lisäasetukset",
                "tooltip": "Valitse asetukset karttatulosteelle."
            },
            "format": {
                "label": "Tiedostomuoto",
                "tooltip": "Valitse tiedostomuoto, jossa haluat tulosteen.",
                "options": {
                    "png": "PNG-kuva",
                    "pdf": "PDF-dokumentti"
                }
            },
            "content": {
                "label": "Näytettävät tiedot",
                "tooltip": "Valitse tulosteessa näytettävät tiedot.",
                "pngNote": "PNG-tulosteelle ei lisätä alla olevia tietoja.",
                "mapTitle": {
                    "placeholder": "Otsikko"
                },
                "pageScale": {
                    "label": "Näytä mittakaava",
                    "tooltip": "Näytä tulosteessa kartan mittakaava."
                },
                "pageDate": {
                    "label": "Näytä päivämäärä",
                    "tooltip": "Näytä tulosteessa sen laatimispäivämäärä."
                },
                "pageTimeSeriesTime": {
                    "label": "Näytä aikasarjan ajanhetki",
                    "tooltip": "Näytä tulosteessa aikasarjan ajanhetki.",
                    "printLabel": "Aikasarjan ajanhetki"
                },
                "coordinates": {
                    "label": "Näytä koordinaatit",
                    "position": {
                        "label": "Sijainti",
                        "options": {
                            "center": "Kartan keskipiste",
                            "corners": "Nurkkapisteet"
                        }
                    },
                    "projection": {
                        "label": "Projektio",
                        "options": {
                            "map": "Kartan projektio",
                            "EPSG:4326": "WGS84"
                        }
                    }
                }
            },
            "error": {
                "saveFailed": "Tulostus epäonnistui."
            },
            "scale": {
                "label": "Mittakaava",
                "tooltip": "Määritä tulostuksessa käytettävä mittakaava",
                "map": "Käytä kartan mittakaavaa",
                "configured": "Valitse mittakaava",
                "unsupportedLayersMessage": "Seuraavat tasot eivät tulostu mittakaava valinnalla"
            }
        },
        "StartView": {
            "info": {
                "maxLayers": "Tulosteessa voi olla enintään kahdeksan karttatasoa.",
                "printoutProcessingTime": "Tulostus voi kestää hetken, jos valittuna on useita karttatasoja."
            }
        }
    }
});
