Oskari.registerLocalization({
    "lang": "fi",
    "key": "hierarchical-layerlist",
    "value": {
        "title": "Karttatasot",
        "desc": "Karttatasot",
        "errors": {
            "generic": "Järjestelmässä tapahtui virhe.",
            "loadFailed": "Karttatasojen lataaminen epäonnistui. Päivitä sivu selaimessasi ja valitse karttatasot uudelleen.",
            "noResults": "Hakutuloksia ei löytynyt. Tarkista hakusana ja yritä uudelleen.",
            "noResultsForKeyword": "Karttatasoja ei löytynyt. Tarkista hakusana ja yritä uudelleen."
        },
        "loading": "Haetaan...",

        "filter": {
            "text": "Hae karttatasoja",
            "shortDescription": "Hae karttatasoa karttatason nimen, tiedontuottajan nimen tai avainsanan perusteella.",
            "description": "Voit hakea karttatasoa karttatason nimen, tiedontuottajan nimen tai avainsanan perusteella. Voit kirjoittaa nimen kokonaan tai vain osan nimestä. Hakusanassa on oltava vähintään neljä merkkiä.",
            "allLayers": "Kaikki tasot",
            "didYouMean": "Tarkoititko:"
        },
        "tooltip": {
            "type-base": "Taustakartta",
            "type-wms": "Karttataso",
            "type-wfs": "Tietotuote",
            "type-wfs-manual": "Päivitä kohdetiedot kartalla klikkaamalla Kohdetiedot- tai Päivitä-painiketta karttanäkymässä."
        },
        "backendStatus": {
            "OK": {
                "tooltip": "Karttataso on käytettävissä tällä hetkellä.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "Karttataso ei tällä hetkellä käytettävissä.",
                "iconClass": "backendstatus-down"
            },
            "ERROR": {
                "tooltip": "Karttataso ei tällä hetkellä käytettävissä.",
                "iconClass": "backendstatus-error"
            },
            "MAINTENANCE": {
                "tooltip": "Karttataso voi olla ajoittain poissa käytöstä lähipäivinä.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-unknown"
            },
            "UNSTABLE": {
                "tooltip": "",
                "iconClass": "backendstatus-unstable"
            }
        },
        "buttons": {
            "ok": "OK"
        },
        "layerFilter": {
            "buttons": {
                "newest": "Uusimmat",
                "featuredata": "Vektoritasot"
            },
            "tooltips": {
                "newest": "Näytä ## uusinta karttatasoa",
                "featuredata": "Näytä vain vektoritasot",
                "remove": "Poista suodatus"
            }
        },
        "guidedTour": {
            "title": "Karttatasot",
            "message": "Karttatasot-valikosta löydät kaikki karttapalvelussa saatavilla olevat karttatasot. <br/><br/> Hae karttatasoja karttatason nimen, tiedontuottajan nimen tai avainsanan perusteella. Löydät uusimmat karttatasot, vektoritasot ja julkaistavissa olevat karttatasot valmiiksi määritellyiltä listoilta. <br/><br/>  Avoinna olevat karttatasot voit tarkistaa Valitut tasot -välilehdeltä.",
            "openLink": "Näytä Karttatasot",
            "closeLink": "Piilota Karttatasot",
            "tileText": "Karttatasot"
        },
        "SelectedLayersTab": {
            "title": "Valitut tasot",
            "style": "Tyyli",
            "show": "Näytä",
            "hide": "Piilota",
            "rights": {
                "can_be_published_map_user": "Julkaistavissa"
            },
            "tooltips": {
                "removeLayer": "Poista taso valituista",
                "openLayerTools": "Avaa tason toiminnot",
                "closeLayerTools": "Sulje tason toiminnot",
                "zoomToLayerExtent": "Sovita taso karttanäkymään",
                "can_be_published_map_user": "Karttatason voi julkaista upotetussa kartassa. Viikottainen käyttömäärä voi olla rajoitettu."
            }
        },
        "manyLayersWarning": {
            "title": "Huomio!",
            "text": "Olet lisäämässä kartalle 10 tai enemmän karttasoa. Jos jatkat, saattaa karttatason lisääminen aiheuttaa suorituskykyongelmia!"
        },
        "manyLayersWarningAlready": {
            "text": "Kartalla on tällä hetkellä 10 tai enemmän karttasoa. Jos jatkat, saattaa karttatason lisääminen aiheuttaa suorituskykyongelmia!"
        }
    }
});