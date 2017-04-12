Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "MyPlacesImport",
    "value": {
        "title": "Omien aineistojen tuonti",
        "desc": "",
        "tool": {
            "tooltip": "Omien aineistojen tuonti"
        },
        "flyout": {
            "title": "Omien aineistojen tuonti",
            "description": "Lataa aineisto tietokoneeltasi pakattuna zip-tiedostoon. Aineiston on oltava jossakin seuraavista tiedostomuodoista: <br/>\r\nShapefile (*.shp, *.shx, *dbf, *prj) <br/>\r\nGPX-siirtotiedosto (*.gpx) <br/>\r\nMapInfo (*.mif, *mid) <br/>\r\nGoogle Map (*.kml, *.kmz) <br/>\r\nTarkista, että kaikki tiedot ovat oikeassa koordinaattijärjestelmässä.",
            "help": "Lataa aineisto tietokoneeltasi pakattuna zip-tiedostoon. Tarkista, että aineisto on oikeassa tiedostomuodossa ja koordinaattijärjestelmässä.",
            "actions": {
                "cancel": "Peruuta",
                "next": "Seuraava"
            },
            "file": {
                "submit": "Tuo aineisto",
                "fileOverSizeError": {
                    "title": "Virhe",
                    "message": "Valitsemasi tiedosto on liian suuri. Enimmäiskoko on <xx> mb.",
                    "close": "Sulje"
                }
            },
            "layer": {
                "title": "Tallenna karttatason tiedot:",
                "name": "Nimi",
                "desc": "Kuvaus",
                "source": "Tietolähde",
                "style": "Tyylimäärittelyt"
            },
            "validations": {
                "error": {
                    "title": "Virhe",
                    "message": "Aineiston tuonti epäonnistui. Valitse ensin tiedosto ja anna karttatasolle nimi. Yritä sitten uudelleen."
                }
            },
            "finish": {
                "success": {
                    "title": "Aineiston tuonti onnistui.",
                    "message": "Voit tarkastella aineistoa Omat tiedot -valikon Omat aineistot -välilehden kautta."
                },
                "failure": {
                    "title": "Aineiston tuonti epäonnistui."
                }
            }
        },
        "tab": {
            "title": "Aineistot",
            "grid": {
                "name": "Nimi",
                "description": "Kuvaus",
                "source": "Tietolähde",
                "remove": "Poista",
                "removeButton": "Poista"
            },
            "confirmDeleteMsg": "Haluatko poistaa aineiston:",
            "buttons": {
                "ok": "OK",
                "cancel": "Peruuta",
                "delete": "Poista"
            },
            "notification": {
                "deletedTitle": "Poista aineisto",
                "deletedMsg": "Aineisto on poistettu."
            },
            "error": {
                "title": "Virhe",
                "generic": "Aineiston lataus epäonnistui järjestelmässä tapahtuneen virheen vuoksi."
            }
        },
        "layer": {
            "organization": "Omat aineistot",
            "inspire": "Omat aineistot"
        }
    }
});
