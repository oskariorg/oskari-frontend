Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "LayerSelection",
    "value": {
        "title": "Valitut tasot",
        "desc": "",
        "layer": {
            "style": "Tyyli",
            "show": "Näytä",
            "hide": "Piilota",
            "hidden": "Karttataso on tilapäisesti piilotettu.",
            "unsupported-projection": "Karttatsoa ei voida näyttää tässä karttaprojektiossa.",
            "change-projection": "Vaihda karttaprojektiota",
            "out-of-scale": "Karttatasoa ei voida näyttää valitulla mittakaavatasolla.",
            "move-to-scale": "Siirry sopivalle mittakaavatasolle.",
            "out-of-content-area": "Karttatasolla ei ole kohteita karttanäkymän alueella.",
            "move-to-content-area": "Paikanna kohteet",
            "description": "Kuvaus",
            "object-data": "Kohdetiedot",
            "rights": {
                "notavailable": "Ei julkaistavissa",
                "guest": "Kirjaudu sisään, jos haluat julkaista karttatason upotetussa kartassa.",
                "loggedin": "Julkaistavissa",
                "official": "Julkaistavisssa viranomaiskäyttöön",
                "need-login": "Ainoastaan viranomaiset voivat julkaista karttatason upotetussa kartassa. Jos olet viranomainen, ota yhteyttä palvelun ylläpitoon.",
                "can_be_published_by_provider": {
                    "label": "Julkaistavissa tiedontuottajana",
                    "tooltip": "Ainoastaan tiedontuottajat voivat julkaista karttatason upotetussa kartassa. Jos olet tiedontuottaja, ota yhteyttä palvelun ylläpitoon."
                },
                "can_be_published": {
                    "label": "Julkaistavissa",
                    "tooltip": "Karttatason voi julkaista upotetussa kartassa. Käyttömäärää ei ole rajoitettu."
                },
                "can_be_published_map_user": {
                    "label": "Julkaistavissa",
                    "tooltip": "Karttatason voi julkaista upotetussa kartassa. Viikottainen käyttömäärä voi olla rajoitettu."
                },
                "no_publication_permission": {
                    "label": "Ei julkaistavissa",
                    "tooltip": "Karttatasoa ei voi julkaista upotetussa kartassa. Tiedontuottaja ei ole antanut lupaa julkaisemiselle."
                },
                "can_be_published_by_authority": {
                    "label": "Julkaistavissa",
                    "tooltip": "Karttatason voi julkaista upotetussa kartassa viranomaiskäyttöön.  Käyttömäärää ei ole rajoitettu."
                }
            },
            "tooltip": {
                "type-base": "Taustakartta",
                "type-wms": "Karttataso",
                "type-wfs": "Tietotuote"
            },
            "refresh_load": {
                "tooltip": "Päivitä karttatason tiedot. Tiedot eivät päivity automaattisesti kartalle."
            },
            "filter": {
                "title": "Valitse kohteita",
                "description": "Valitse kohteita karttatasolta:",
                "cancelButton": "Poistu",
                "clearButton": "Tyhjennä valinnat",
                "refreshButton": "Päivitä valinnat",
                "addFilter": "Lisää uusi ehto",
                "removeFilter": "Poista ehto",
                "bbox": {
                    "title": "Ikkunarajaus",
                    "on": "Ota mukaan vain kartalla näkyvät kohteet.",
                    "off": "Ota mukaan kaikki kohteet."
                },
                "clickedFeatures": {
                    "title": "Kohderajaus",
                    "label": "Ota mukaan vain kartalta valitut kohteet."
                },
                "values": {
                    "title": "Valitse kohteet seuraavien ehtojen perusteella:",
                    "placeholders": {
                        "case-sensitive": "Kirjainkoko vaikuttaa valintoihin.",
                        "attribute": "Ominaisuustieto",
                        "boolean": "Looginen operaattori",
                        "operator": "Operaattori",
                        "attribute-value": "Arvo"
                    },
                    "equals": "on yhtäsuuri kuin",
                    "like": "on likimäärin yhtäsuuri kuin",
                    "notEquals": "on erisuuri kuin",
                    "notLike": "on likimäärin erisuuri kuin",
                    "greaterThan": "on suurempi kuin",
                    "lessThan": "on pienempi kuin",
                    "greaterThanOrEqualTo": "on suurempi tai yhtä suuri kuin",
                    "lessThanOrEqualTo": "on pienempi tai yhtä pieni kuin"
                },
                "aggregateAnalysisFilter": {
                    "addAggregateFilter": "Käytä tunnuslukua",
                    "aggregateValueSelectTitle": "Valitse käytettävät tunnusluvut",
                    "selectAggregateAnalyse": "Valitse analyysitaso",
                    "selectIndicator": "Valitse ominaisuustieto",
                    "selectReadyButton": "Sulje",
                    "getAggregateAnalysisFailed": "Tunnuslukujen haku epäonnistui.",
                    "noAggregateAnalysisPopupTitle": "Kyseiselle tasolle ei ole laskettu tunnuslukuja.",
                    "noAggregateAnalysisPopupContent": "Kyseiselle tasolle ei ole laskettu tunnuslukuja. Voit laskea tunnusluvut haluamallesi aineistolle Analyysi-toiminnon avulla. Tämän jälkeen tunnusluvut ovat käytettävissä suodatuksessa."
                },
                "validation": {
                    "title": "Suodatusta ei voitu tehdä. Antamissasi tiedoissa on puutteita:",
                    "attribute_missing": "Ominaisuustieto puuttuu.",
                    "operator_missing": "Operaattori puuttuu.",
                    "value_missing": "Arvo puuttuu.",
                    "boolean_operator_missing": "Looginen operaattori puuttuu."
                }
            }
        },
        "guidedTour": {
            "title": "Valitut tasot",
            "message": "Valitut tasot -valikossa näet avoinna olevat karttatasot ja voit määritellä, miten ne esitetään karttanäkymässä. <br/> Raahaa karttatasot uuteen järjestykseen. <br/> Säädä tasojen läpinäkyvyyttä. <br/> Valitse karttatasolle toinen tyyli, jos karttatasolle on määritelty useampia tyylejä. <br/> Avaa tietotuotteiden kohdetiedot taulukkomuodossa. <br/> Näytä tai piilota karttataso tilapäisesti.",
            "openLink": "Näytä Valitut tasot",
            "closeLink": "Piilota Valitut tasot",
            "tileText": "Valitut tasot"
        }
    }
});