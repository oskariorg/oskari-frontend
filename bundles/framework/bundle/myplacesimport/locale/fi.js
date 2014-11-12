Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "MyPlacesImport",
    "value": {
        "title": "Omien aineistojen tuonti",
        "desc": "Voit tuoda omia aineistoja shp-, gpx- tai mif/mid-tiedostomuodossa zip-pakattuna tai kmz-tiedostomuodossa (pakattu kml).",
        "help": "Valitse aineiston sisältävä tiedosto tai anna linkki vastaavaan tiedostoon. Tiedosto voi olla joko shp-, zip- tai kml/kmx-tiedostomuodossa. Voit luoda shapefile (shp) -siirtoformaatissa olevasta aineistosta zip-tiedoston pakkaamalla ko. aineistoon liittyvät shp-, shx-, dbf- ja prj-päätteiset tiedostot yhteen zip-tiedostoon. Myös Googlen karttapalvelusta saatavat kml/kmz-tiedostot on mahdollista pakata zip-tiedostoon.",
        "tool": {
            "tooltip": "Omien aineistojen tuonti"
        },
        "flyout": {
            "title": "Omien aineistojen tuonti",
            "description": "Voit tuoda omia aineistoja shp-, gpx- tai mif/mid-tiedostomuodossa zip-pakattuna tai kmz-tiedostomuodossa (pakattu kml). Tuotava tiedosto voi sisältää enintään 5000 kohdetta.",
            "actions": {
                "cancel": "Peruuta",
                "next": "Seuraava"
            },
            "file": {
                "submit": "Lähetä"
            },
            "layer": {
                "title": "Tallenna karttatason tiedot:",
                "name": "Nimi",
                "desc": "Kuvaus",
                "source": "Tietolähde",
                "style": "Aineiston tyylimäärittelyt"
            },
            "validations": {
                "error": {
                    "title": "Virhe",
                    "message": "Tiedostoa ei ole valittu ja karttatason nimi puuttuu."
                }
            },
            "finish": {
                "success": {
                    "title": "Aineiston tuonti onnistui.",
                    "message": "Aineisto löytyy Omat tiedot -valikon Aineistot-välilehdeltä."
                },
                "failure": {
                    "title": "Aineiston tuonti epäonnistui. Yritä myöhemmin uudelleen."
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
                "deletedTitle": "Aineiston poisto",
                "deletedMsg": "Aineisto on poistettu."
            },
            "error": {
                "title": "Virhe!",
                "generic": "Järjestelmässä tapahtui virhe. Yritä myöhemmin uudelleen."
            }
        },
        "layer": {
            "organization": "Omat aineistot",
            "inspire": "Omat aineistot"
        }
    }
}
);