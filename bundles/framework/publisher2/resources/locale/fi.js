Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Publisher2",
    "value": {
        "tile": {
            "title": "Karttajulkaisu"
        },
        "flyout": {
            "title": "Karttajulkaisu"
        },
        "published": {
            "title": "Upotettu kartta on valmis",
            "desc": "Kartta on valmis. Julkaise kartta verkkosivulla liittämällä alla oleva html-koodi verkkosivun koodiin:"
        },
        "edit": {
            "popup": {
                "title": "Päivitetään upotettua karttaa…",
                "msg": "Päivitetään upotetun kartan tietoja…"
            }
        },
        "BasicView": {
            "title": "Julkaise kartta",
            "titleEdit": "Muokkaa karttaa",
            "domain": {
                "title": "Julkaisutiedot",
                "label": "Verkkosivuston osoite (ilman http- ja www-etuliitteitä)",
                "placeholder": "Sivuston osoite",
                "tooltip": "Anna verkkosivuston osoite eli domain-nimi ilman http- tai www-etuliitettä tai alasivun osoitetta. Esimerkiksi: omakotisivu.com."
            },
            "name": {
                "label": "Kartan nimi (pakollinen tieto)",
                "placeholder": "Kartan nimi",
                "tooltip": "Anna kartalle nimi. Ota huomioon kartalla käytössä oleva kieli."
            },
            "language": {
                "label": "Kieli",
                "options": {
                    "fi": "suomi",
                    "sv": "ruotsi",
                    "en": "englanti"
                },
                "tooltip": "Valitse kartalla käytettävä kieli. Valinta vaikuttaa käyttöliittymään ja kartalla näkyviin teksteihin. Huom! Kielivalinnat eivät näy esikatselukartalla.",
                "languageChangedDisclaimer": "Huom! Kielivalinnat eivät näy esikatselukartalla."
            },
            "size": {
                "label": "Kartan koko",
                "tooltip": "Valitse kartan koko. Leveyden on oltava vähintään 30 pikseliä ja korkeuden vähintään 20 pikseliä. Erota desimaalit pilkulla. Näet muutokset esikatselukartassa."
            },
            "maptools": {
                "label": "Kartalla näytettävät työkalut",
                "tooltip": "Valitse kartalla käytettävissä olevat työkalut. Tarkista asettelu esikatselukartasta.",
                "ScaleBarPlugin": "Mittakaavajana",
                "IndexMapPlugin": "Indeksikartta",
                "PanButtons": "Kartan liikuttaminen nuolipainikkeilla",
                "Portti2Zoombar": "Mittakaavasäädin",
                "MyLocationPlugin": "Käyttäjän sijaintiin keskittäminen",
                "ControlsPlugin": "Kartan liikuttaminen hiirellä raahaamalla",
                "SearchPlugin": "Osoite- ja paikannimihaku",
                "FeaturedataPlugin": "Kohdetietotaulukko",
                "GetInfoPlugin": "Kohdetietojen kyselytyökalu",
                "PublisherToolbarPlugin": "Karttatyökalut",
                "selectDrawLayer": "Valitse tallennustaso",
                "LayerSelectionPlugin": "Karttatasovalikko",
                "CoordinateToolPlugin": "Koordinaattityökalu",
                "FeedbackServiceTool": "Palautteen antaminen (Open311)",
                "CrosshairTool": "Näytä kartan keskipiste",
                "toolbarToolNames": {
                    "history_back": "Siirtyminen edelliseen näkymään",
                    "history_forward": "Siirtyminen seuraavaan näkymään",
                    "measureline": "Matkan mittaus",
                    "measurearea": "Pinta-alan mittaus",
                    "drawTools": "Omien kohteiden tallennus",
                    "point": "Salli pisteiden tallennus.",
                    "line": "Salli viivojen tallennus.",
                    "area": "Salli alueiden tallennus."
                },
                "layers": {
                    "add": "Luo kohteille uusi tallennustaso",
                    "label": "Näytettävät karttatasot",
                    "addselect": "Lisää tallennustaso näytettäviin karttatasoihin",
                    "defaultLayer": "(Oletusvalinta)",
                    "useAsDefaultLayer": "Käytä oletuksena"
                },
                "myplaces": {
                    "label": "Omat karttatasot"
                },
                "layerselection": {
                    "info": "Valitse taustakarttoina näytettävät karttatasot. Oletusvalinnan voit tehdä esikatselukartassa.",
                    "selectAsBaselayer": "Taustakarttataso"
                }
            },
            "toollayout": {
                "label": "Työkalujen asettelu kartalla",
                "tooltip": "Valitse, miten työkalut asetellaan kartalle.",
                "lefthanded": "Vasenkätinen",
                "righthanded": "Oikeakätinen",
                "userlayout": "Oma asettelu",
                "usereditmode": "Muokkaa asettelua",
                "usereditmodeoff": "Lopeta muokkaus"
            },
            "data": {
                "label": "Teemakartat",
                "tooltip": "Näytä tilastotiedot taulukossa kartan yhteydessä.",
                "grid": "Näytä tilastotiedot taulukossa",
                "allowClassification": "Salli luokittelu"
            },
            "layout": {
                "label": "Ulkoasu",
                "fields": {
                    "colours": {
                        "label": "Värimaailma",
                        "placeholder": "Värimaailma",
                        "buttonLabel": "Valitse",
                        "light_grey": "Vaaleanharmaa",
                        "dark_grey": "Tummanharmaa",
                        "blue": "Sininen",
                        "red": "Punainen",
                        "green": "Vihreä",
                        "yellow": "Keltainen",
                        "custom": "Omat värit",
                        "customLabels": {
                            "bgLabel": "Otsikon tausta",
                            "titleLabel": "Otsikon teksti",
                            "headerLabel": "Oman kohteen nimi",
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
                        "3d-dark": "Kolmiulotteinen (tumma)",
                        "3d-light": "Kolmiulotteinen (vaalea)"
                    }
                },
                "popup": {
                    "title": "Valitse värimaailma",
                    "close": "Sulje",
                    "gfiDialog": {
                        "title": "Kohteen tiedot",
                        "featureName": "Esikatselu",
                        "featureDesc": "Värimaailma vaikuttaa kohdetietojen, omien kohteiden tietojen ja karttatasolaatikon väreihin."
                    }
                }
            },
            "sizes": {
                "small": "Pieni",
                "medium": "Keskikokoinen",
                "large": "Suuri",
                "fill": "Tilan täyttävä",
                "custom": "Määritä oma koko",
                "width": "leveys",
                "height": "korkeus",
                "separator": "x"
            },
            "buttons": {
                "save": "Tallenna",
                "saveNew": "Tallenna uusi",
                "ok": "OK",
                "replace": "Päivitä",
                "cancel": "Peruuta",
                "add": "Lisää karttataso"
            },
            "confirm": {
                "replace": {
                    "title": "Haluatko päivittää upotetun kartan?",
                    "msg": "Päivitykset näkyvät välittömästi upotetussa kartassa. Sinun ei tarvitse muuttaa html-koodia."
                }
            },
            "layerselection": {
                "label": "Karttatasovalikko",
                "info": "Valitse taustakarttoina näytettävät karttatasot. Oletusvalinnan voit tehdä esikatselukartassa.",
                "tooltip": "Valitse julkaistavalla kartalla näytettävät karttatasot.",
                "promote": "Haluatko näyttää kartalla myös ilmakuvia?"
            },
            "preview": "Kartan esikatselu",
            "location": "Sijainti ja mittakaavataso",
            "zoomlevel": "Mittakaavataso",
            "help": "Ohje",
            "error": {
                "title": "Virhe",
                "size": "Kartan koko on virheellinen. Leveyden on oltava vähintään 30 pikseliä ja korkeuden vähintään 20 pikseliä. Desimaalierottimena on piste.",
                "domain": "Verkkosivuston osoite on pakollinen tieto. Anna sivuston osoite ja yritä uudelleen.",
                "domainStart": "Verkkosivuston osoite on väärässä muodossa. Anna osoite ilman http- tai www-etuliitteitä ja yritä uudelleen.",
                "name": "Kartan nimi on pakollinen tieto. Anna kartalle nimi ja yritä uudelleen.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Kartan tallennus epäonnistui.",
                "nameIllegalCharacters": "Kartan nimessä on kiellettyjä merkkejä (esim. html-tagit). Poista kielletyt merkit ja yritä uudelleen.",
                "domainIllegalCharacters": "Verkkosivuston osoitteessa on kiellettyjä merkkejä. Anna verkkosivuston osoite eli domain-nimi ilman http- tai www-etuliitettä tai alasivun osoitetta. Esimerkiksi: omakotisivu.com. Sallittuja merkkejä ovat aakkoset (a-z, A-Z), numerot (0-9) sekä yhdysviiva (-), alaviiva (_), piste (.), huutomerkki (!), aaltoviiva (~), asteriski (*), puolilainausmerkki (') ja sulut ()."
            }
        },
        "NotLoggedView": {
            "text": "\"Julkaise kartta\" -toiminnon avulla voit julkaista upotetun kartan omalla verkkosivulla. Upotetussa kartassa näkyy valitsemasi karttanäkymä ja työkalut. Kartan julkaisu vaatii kirjautumisen palveluun.",
            "signup": "Kirjaudu sisään",
            "signupUrl": "/web/fi/login",
            "register": "Rekisteröidy",
            "registerUrl": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "StartView": {
            "text": "Tervetuloa karttajulkaisuun. Toiminnon vaulla voit julkaista upotetun kartan omalla verkkosivulla.",
            "touLink": "Näytä karttajulkaisun käyttöehdot",
            "layerlist_title": "Avoinna olevat karttatasot, jotka ovat julkaistavissa",
            "layerlist_empty": "Avoinna olevat karttatasot eivät ole julkaistavissa. Tarkista Valitut tasot -valikosta, mitkä karttatasot ovat julkaistavissa.",
            "layerlist_denied": "Avoinna olevat karttatasot, jotka eivät ole julkaistavissa",
            "denied_tooltip": "Karttatasot eivät ole julkaistavissa upotetussa kartassa. Tiedontuottaja ei ole antanut lupaa julkaista karttatasoa muissa verkkopalveluissa. Tarkista karttatason julkaisuoikeudet Valitut tasot -valikosta.",
            "myPlacesDisclaimer": "HUOM! Jos käytät karttatasoa karttajulkaisussa, karttatasosta tulee julkinen.",
            "buttons": {
                "continue": "Jatka",
                "continueAndAccept": "Hyväksy ehdot ja jatka",
                "cancel": "Peruuta",
                "close": "Sulje"
            },
            "tou": {
                "notfound": "Käyttöehtoja ei löytynyt.",
                "reject": "Hylkää",
                "accept": "Hyväksy"
            }
        },
        "layer": {
            "show": "Näytä",
            "hide": "Piilota",
            "hidden": "Karttataso on piilotettu tilapäisesti.",
            "rights": {
                "can_be_published_map_user": {
                    "label": "Julkaistavissa",
                    "tooltip": "Karttataso on julkaistavissa upotetussa kartassa. Viikoittainen käyttömäärä voi olla rajoitettu."
                }
            }
        },
        "layerFilter": {
            "buttons": {
                "publishable": "Julkaistavissa"
            },
            "tooltips": {
                "publishable": "Näytä vain julkaistavissa olevat karttatasot"
            }
        }
    }
});
