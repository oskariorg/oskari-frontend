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
            "description": "Lataa aineisto tietokoneeltasi yhdeksi zip-tiedostoksi pakattuna, joka sisältää tarvittavat tiedostot jostain seuraavasta tiedostomuodosta:<ul><li>Shapefile (.shp, .shx ja .dbf sekä mahdolliset .prj ja .cpg)</li><li>GPX-siirtotiedosto (.gpx)</li><li>MapInfo (.mif ja .mid)</li><li>Google Map (.kml tai .kmz)</li></ul>Zip-tiedosto saa sisältää vain yhden karttatason ja sen maksimikoko on <xx> Mt.",
            "help": "Lataa aineisto tietokoneeltasi pakattuna zip-tiedostoon. Tarkista, että aineisto on oikeassa tiedostomuodossa ja koordinaattijärjestelmässä.",
            "actions": {
                "cancel": "Peruuta",
                "next": "Seuraava",
                "close": "Sulje"
            },
            "file": {
                "submit": "Tuo aineisto",
                "fileOverSizeError": {
                    "title": "Virhe",
                    "message": "Valitsemasi tiedosto on liian suuri. Enimmäiskoko on <xx> Mt."
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
                    "message": "Aineistosta tuotiin <xx> kohdetta onnistuneesti. Voit tarkastella aineistoa Omat tiedot -valikon Omat aineistot -välilehden kautta."
                },
                "failure": {
                    "title": "Aineiston tuonti epäonnistui."
                }

            },
            "error":{
                "title": "Aineiston tuonti epäonnistui",
                "unknown_projection":"Aineiston käyttämää koordinaattijärjestelmää ei tunnistettu. Tarkista, että aineisto on joko kartan käyttämässä koordinaattijärjestelmässä tai varmista, että aineisto sisältää muunnosta varten tarvittavan koordinaattijärjestelmä tiedot.",
                "invalid_file":"Järjestelmän tukemaa tiedostoa ei löytynyt. Tarkista, että käyttämäsi tiedostomuoto on tuettu ja aineisto on pakattuna zip-tiedostoon.",
                "unable_to_store_data":"Aineiston kohteita ei voitu tallentaa. Tarkista, että kaikki tiedostomuodon tarvitsemat tiedostot ovat zip-tiedostossa sekä tarkista ettei aineiston kohdetiedot ole virheellisiä.",
                "short_file_prefix":"Zip-tiedostosta ei onnistuttu hakemaan aineiston tiedostoja. Tarkista, ettei pakattujen tiedostojen nimet ole alle kolmen merkin pituisia.",
                "file_over_size":"Valitsemasi tiedosto on liian suuri. Enimmäiskoko on <xx> Mt.",
                "no_features":"Aineistosta ei löytynyt kohdetietoja. Tarkista, että aineiston kohdetiedoilla on koordinaatit määritetty.",
                "malformed":"Tarkista, ettei tiedostonimissä ole käytetty ääkkösiä.",
                "kml":"Karttatasoa ei onnistuttu luomaan KML-tiedostosta",
                "shp":"Karttatasoa ei onnistuttu luomaan SHP-tiedostosta",
                "mif":"Karttatasoa ei onnistuttu luomaan MIF-tiedostosta",
                "gpx":"Karttatasoa ei onnistuttu luomaan GPX-tiedostosta",
                "timeout":"Aineiston tuonti keskeytyi aikakatkaisun vuoksi.",
                "abort": "Aineiston tuonti keskeytettiin.",
                "parsererror": "Aineiston jäsentämisessä tapahtui virhe.",
                "generic": "Järjestelmässä tapahtui tunnistamaton virhe."
            },
            "warning":{
                "features_skipped":"Huomio! Aineiston tuonnissa <xx> kohdetta hylättiin puuttuvien tai viallisten koordinaattien tai geometrian vuoksi."
            },
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
            "confirmDeleteMsg": "Haluatko poistaa aineiston \"{name}\"?",
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
