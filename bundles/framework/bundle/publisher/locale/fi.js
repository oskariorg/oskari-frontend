Oskari.registerLocalization({
    "lang": "fi",
    "key": "Publisher",
    "value": {
        "title": "Julkaise kartta",
        "flyouttitle": "Siirry julkaisemaan",
        "desc": "",
        "published": {
            "title": "Kartta julkaistu",
            "desc": "Voit liittää kartan internet-sivustollesi lisäämällä sinne alla olevan HTML-koodin:"
        },
        "edit": {
            "popup": {
                "title": "Muokataan julkaisua",
                "msg": "Päivitetään aiemmin julkaistun kartan tietoja"
            }
        },
        "BasicView": {
            "title": "Julkaise kartta",
            "titleEdit": "Muokkaa julkaisua",
            "domain": {
                "title": "Julkaisupaikka",
                "label": "Sivusto, jolla kartta julkaistaan",
                "placeholder": "ilman http- tai www-etuliitteitä",
                "tooltip": "Kirjoita sivuston www-osoite eli domain-nimi ilman http- ja www-etuliitteitä tai alasivun osoitetta. Esimerkiksi omakotisivu.com."
            },
            "name": {
                "label": "Kartan nimi",
                "placeholder": "pakollinen",
                "tooltip": "Anna kartalle kuvaileva nimi. Huomioi käyttöliittymän kieli."
            },
            "language": {
                "label": "Kieli",
                "options": {
                    "fi": "Suomi",
                    "sv": "Ruotsi",
                    "en": "Englanti"
                },
                "tooltip": "Valitse kartan käyttöliittymän ja aineiston kieli."
            },
            "size": {
                "label": "Koko",
                "tooltip": "Valitse tai määrittele kartalle koko, jossa haluat esittää sen sivuillasi. Näet vaikutuksen esikatselukartassa."
            },
            "tools": {
                "label": "Näytettävät työkalut",
                "tooltip": "Valitse kartalla näytettävät työkalut. Näet niiden sijoittelun esikatselukartassa.",
                "ScaleBarPlugin": "Mittakaavajana",
                "IndexMapPlugin": "Indeksikartta",
                "PanButtons": "Panorointitoiminto",
                "Portti2Zoombar": "Mittakaavasäädin",
                "ControlsPlugin": "Kartan liikuttaminen",
                "SearchPlugin": "Osoite- ja paikannimihaku",
                "FeaturedataPlugin": "Kohdetiedot",
                "GetInfoPlugin": "Kohdetietojen kyselytyökalu",
                "PublisherToolbarPlugin": "Karttatyökalut",
                "selectDrawLayer" : "Valitse piirtotaso"
            },
            "toolbarToolNames": {
                "history_back": "Siirry taaksepäin",
                "history_forward": "Siirry eteenpäin",
                "measureline": "Mittaa etäisyyttä",
                "measurearea": "Mittaa aluetta",
                "drawTools" : "Piirtotyökalut",
                "point" : "Salli pisteet",
                "line" : "Salli viivat",
                "area" : "Salli alueet"
            },
            "toollayout": {
                "label": "Työkalujen asettelu",
                "tooltip": "Valitse kartalla näytettävien työkalujen asettelu",
                "lefthanded": "Vasenkätinen",
                "righthanded": "Oikeakätinen",
                "userlayout" : "Oma asettelu",
                "usereditmode": "Muokkaustila päälle",
                "usereditmodeoff": "Poistu muokkaustilasta"
            },
            "data": {
                "label":                "Tilastot",
                "tooltip":              "Näytä karttaan liittyvä taulukko.",
                "grid":                 "Näytä tilastotaulukko",
                "allowClassification":  "Salli luokittelu"
            },
            "layout": {
                "label": "Ulkoasu",
                "fields": {
                    "colours": {
                        "label": "Värimaailma",
                        "placeholder": "Valitse värimaailma",
                        "buttonLabel": "Vaihda",
                        "light_grey": "Vaalean harmaa",
                        "dark_grey": "Tumman harmaa",
                        "blue": "Sininen",
                        "red": "Punainen",
                        "green": "Vihreä",
                        "yellow": "Keltainen",
                        "custom": "Omat värit",
                        "customLabels": {
                            "bgLabel": "Tunnisteen tausta",
                            "titleLabel": "Tunnisteen teksti",
                            "headerLabel": "Otsikon teksti",
                            "iconLabel": "Ikoni",
                            "iconCloseLabel": "Tumma",
                            "iconCloseWhiteLabel": "Vaalea"
                        }
                    },
                    "fonts": {
                        "label": "Valitse fontti"
                    },
                    "toolStyles": {
                        "label": "Työkalujen tyyli",
                        "default": "Oletustyyli",
                        "rounded-dark": "Pyöristetty (tumma)",
                        "rounded-light": "Pyöristetty (vaalea)",
                        "sharp-dark": "Kulmikas (tumma)",
                        "sharp-light": "Kulmikas (vaalea)",
                        "3d-dark": "3D (tumma)",
                        "3d-light": "3D (vaalea)"
                    }
                },
                "popup": {
                    "title": "Värimaailman valinta",
                    "close": "Sulje",
                    "gfiDialog": {
                        "title": "Kohteen tiedot",
                        "featureName": "Esikatselu",
                        "featureDesc": "Värimaailman valinta vaikuttaa ainoastaan kohdetietolaatikon ja karttatasovalikon väritykseen"
                    }
                }
            },
            "layers": {
                "add": "Luo uusi piirtotaso",
                "addselect": "Lisää piirtotaso karttatasoksi",
                "label": "Karttatasot",
                "defaultLayer": "(Oletusvalinta)",
                "useAsDefaultLayer": "Käytä oletuksena"
            },
            "myplaces": {
                "label": "Omat tasot"
            },
            "sizes": {
                "small": "Pieni",
                "medium": "Keskikokoinen",
                "large": "Suuri",
                "custom": "Määritä oma koko",
                "width": "leveys",
                "height": "korkeus"
            },
            "buttons": {
                "save": "Tallenna",
                "saveNew": "Tallenna uusi",
                "ok": "OK",
                "replace": "Korvaa",
                "cancel": "Peruuta",
                "add": "Lisää karttataso"
            },
            "confirm": {
                "replace": {
                    "title": "Haluatko korvata julkaisun?",
                    "msg": "Korvaamalla muutokset näkyvät suoraan julkaisemassasi kartassa. Sinun ei tarvitse lisätä koodia verkkosivuillesi uudelleen."
                }
            },
            "layerselection": {
                "label": "Näytä karttatasot valikossa",
                "info": "Valitse karttapohjat. Voit tehdä oletusvalinnan esikatselunäkymästä.",
                "tooltip": "Karttapohja näkyy kartan alimmaisena kerroksena. Kun valitset karttatasoja karttapohjaksi, vain yksi valituista tasoista näkyy kerralla ja käyttäjä voi vaihdella niiden välillä. Oletusvalinnan voit tehdä esikatselukartassa.",
                "promote": "Haluatko näyttää myös ilmakuvia?"
            },
            "preview": "Julkaistavan kartan esikatselu",
            "location": "Sijainti ja mittakaavataso",
            "zoomlevel": "Mittakaavataso",
            "help": "Ohje",
            "error": {
                "title": "Virhe!",
                "size": "Virhe kokomäärityksissä",
                "domain": "Sivusto on pakollinen tieto",
                "domainStart": "Anna sivusto ilman http- tai www-etuliitteitä",
                "name": "Nimi on pakollinen tieto",
                "nohelp": "Ohjetta ei löytynyt",
                "saveFailed": "Kartan julkaisu epäonnistui. Yritä myöhemmin uudelleen.",
                "nameIllegalCharacters": "Nimessä on luvattomia merkkejä. Sallittuja merkkejä ovat kaikki suomen kielen aakkoset, numerot sekä välilyönti ja yhdysmerkki.",
                "domainIllegalCharacters": "Sivuston nimessä on luvattomia merkkejä. Sallittuja merkkejä ovat kaikki suomen kielen aakkoset, numerot sekä välilyönti ja yhdysmerkki."
            }
        },
        "NotLoggedView": {
            "text": "Voit käyttää julkaisutoimintoa kirjauduttuasi palveluun.",
            "signup": "Kirjaudu sisään",
            "signupUrl": "/web/fi/login",
            "register": "Rekisteröidy",
            "registerUrl": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "StartView": {
            "text": "Voit julkaista tässä tekemäsi karttanäkymän osana esim. omaa tai yrityksesi sivustoa.",
            "touLink": "Näytä karttajulkaisun käyttöehdot",
            "layerlist_title": "Julkaistavissa olevat karttatasot",
            "layerlist_empty": "Valitsemiasi karttatasoja ei voida julkaista. Valitut karttatasot -valikosta näet, voiko karttatason julkaista.",
            "layerlist_denied": "Ei julkaistavissa",
            "denied_tooltip": "Kartta-aineistojen tuottajat eivät ole antaneet näille aineistoilleen julkaisuoikeutta muissa verkkopalveluissa. Tarkista julkaisuoikeus Valitut karttatasot -valikosta ennen julkaisua.",
            "myPlacesDisclaimer": "Huom. Olet julkaisemassa omaa karttatasoa.",
            "buttons": {
                "continue": "Jatka",
                "continueAndAccept": "Hyväksy ehdot ja jatka",
                "cancel": "Peruuta",
                "close": "Sulje"
            },
            "tou": {
                "notfound": "Käyttöehtoja ei löytynyt",
                "reject": "Hylkää",
                "accept": "Hyväksy"
            }
        },
        "layer": {
            "show": "Näytä",
            "hide": "Piilota",
            "hidden": "Karttataso on tilapäisesti piilotettu.",
            "selectAsBaselayer": "Valitse pohjakartaksi",
            "rights": {
                "can_be_published_map_user": {
                    "label": "Julkaistavissa",
                    "tooltip": "Karttatason voi julkaista upotetussa karttaikkunassa. Viikoittainen käyttömäärä voi olla rajoitettu."
                }
            }
        }
    }
});