Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Publisher",
    "value": {
        "title": "Karttajulkaisu",
        "flyouttitle": "Karttajulkaisu",
        "desc": "",
        "published": {
            "title": "Upotettava kartta valmis",
            "desc": "Julkaise upotettava kartta verkkosivullesi liittämällä alla oleva HTML-koodi verkkosivun koodiin:"
        },
        "edit": {
            "popup": {
                "title": "Muokataan upotettua karttaa...",
                "msg": "Päivitetään aiemmin luodun upotetun kartan tietoja."
            }
        },
        "BasicView": {
            "title": "Julkaise kartta",
            "titleEdit": "Muokkaa upotettua karttaa",
            "domain": {
                "title": "Julkaisutiedot",
                "label": "Verkkosivuston, jolla kartta julkaistaan, nimi ilman http- tai www-etuliitteitä",
                "placeholder": "Kirjoita sivuston nimi tähän.",
                "tooltip": "Anna verkkosivuston osoite eli domain-nimi ilman http- tai www-etuliitettä tai alasivun osoitetta. Esimerkiksi: omakotivu.com."
            },
            "name": {
                "label": "Kartan nimi (pakollinen tieto)",
                "placeholder": "Kirjoita kartan nimi tähän.",
                "tooltip": "Anna kartalle kuvaileva nimi. Muista huomioida käyttöliittymän kieli."
            },
            "language": {
                "label": "Kieli",
                "options": {
                    "fi": "suomi",
                    "sv": "ruotsi",
                    "en": "englanti"
                },
                "tooltip": "Valitse kieli, jota upotetussa kartassa käytetään. Valinta vaikuttaa sekä käyttöliittymään että kartta-aineistoon."
            },
            "size": {
                "label": "Kartan koko",
                "tooltip": "Valitse koko, jossa upotettu kartta esitetään verkkosivulla. Leveyden on oltava vähintään 30 pikseliä ja korkeuden vähintään 20 pikseliä. Desimaalierottimena on piste. Valinnan tulokset esitetään esikatselukartassa."
            },
            "tools": {
                "label": "Kartalla näytettävät työkalut",
                "tooltip": "Valitse työkalut, jotka näytetään upotetussa kartassa. Näet työkalujen asettelun esikatselukartassa.",
                "ScaleBarPlugin": "Mittakaavajana",
                "IndexMapPlugin": "Indeksikartta",
                "PanButtons": "Kartan liikuttaminen nuolipainikkeilla",
                "Portti2Zoombar": "Mittakaavasäädin",
                "ControlsPlugin": "Kartan liikuttaminen hiirellä raahaamalla",
                "SearchPlugin": "Osoite- ja paikannimihaku",
                "FeaturedataPlugin": "Kohdetietotaulukko",
                "GetInfoPlugin": "Kohdetietojen kyselytyökalu",
                "PublisherToolbarPlugin": "Karttatyökalut",
                "selectDrawLayer": "Valitse tallennustaso"
            },
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
            "toollayout": {
                "label": "Työkalujen asettelu kartalla",
                "tooltip": "Valitse kartalla näytettävien työkalujen asettelu.",
                "lefthanded": "Vasenkätinen",
                "righthanded": "Oikeakätinen",
                "userlayout": "Oma asettelu",
                "usereditmode": "Muokkaa asettelua",
                "usereditmodeoff": "Lopeta muokkaus"
            },
            "data": {
                "label": "Teemakartat",
                "tooltip": "Näytä karttaan liittyvä taulukko",
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
                    "title": "Värimaailman valinta",
                    "close": "Sulje",
                    "gfiDialog": {
                        "title": "Kohteen tiedot",
                        "featureName": "Esikatselu",
                        "featureDesc": "Värimaailma vaikuttaa kohdetietojen, omien kohteiden tietojen ja karttatasolaatikon väreihin."
                    }
                }
            },
            "layers": {
                "add": "Luo uusi tallennustaso",
                "label": "Näytettävät karttatasot",
                "addselect": "Lisää tallennustaso karttatasoihin",
                "defaultLayer": "(Oletusvalinta)",
                "useAsDefaultLayer": "Käytä oletuksena"
            },
            "myplaces": {
                "label": "Omat karttatasot"
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
                    "msg": "Päivitykset näkyvät suoraan upotetussa kartassa. Sinun ei tarvitse muuttaa HTML-koodia verkkosivuillasi."
                }
            },
            "layerselection": {
                "label": "Näytä karttatasovalikko upotetussa kartassa.",
                "info": "Valitse taustakarttoina näytettävät karttatasot. Oletusvalinnan voit tehdä esikatselukartassa.",
                "tooltip": "Taustakarttataso näkyy karttanäkymässä alimmaisena. Jos valitset useampia karttatasoja taustakarttatasoksi, kartalla näkyy kerralla vain yksi taustakarttataso. Käyttäjä voi halutessaan vaihtaa taustakarttatasoa. Oletusvalinnan voit tehdä esikatselukartassa.",
                "promote": "Haluatko näyttää kartalla myös ilmakuvia?"
            },
            "preview": "Upotettavan kartan esikatselu",
            "location": "Koordinaatit ja mittakaavataso",
            "zoomlevel": "Mittakaavataso",
            "help": "Ohje",
            "error": {
                "title": "Virhe!",
                "size": "Kartan koko on virheellinen. Leveyden on oltava vähintään 30 pikseliä ja korkeuden vähintään 20 pikseliä. Desimaalierottimena on piste.",
                "domain": "Sivuston nimi on pakollinen tieto.",
                "domainStart": "Anna sivuston nimi ilman http- tai www-etuliitteitä.",
                "name": "Kartan nimi on pakollinen tieto.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Upotettavan kartan tallennus epäonnistui. Yritä myöhemmin uudelleen.",
                "nameIllegalCharacters": "Kartan nimessä on kiellettyjä merkkejä. Sallittuja merkkejä ovat aakkoset (a-ö, A-Ö), numerot (0-9), välilyönti ja yhdysmerkki (-).",
                "domainIllegalCharacters": "Sivuston nimessä on kiellettyjä merkkejä. Sallittuja merkkejä ovat aakkoset (a-ö, A-Ö), numerot (0-9), välilyönti ja yhdysmerkki (-)."
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
            "text": "Julkaise kartta -toiminnon avulla voit julkaista upotettavan kartan omalla verkkosivulla. Toiminnon avulla voit määritellä kartalla näytettävän karttanäkymän ja kartalla käytössä olevat työkalut sekä niiden ulkoasun. Kun määrittely on valmis, voit julkaista kartan liittämällä saamasi html-koodin verkkosivuillesi.",
            "touLink": "Näytä karttajulkaisun käyttöehdot",
            "layerlist_title": "Julkaistavissa olevat karttatasot",
            "layerlist_empty": "Valitsemiasi karttatasoja ei voida julkaista. Karttatasojen julkaisuoikeudet voi tarkistaa \"Valitut karttatasot\"-valikosta.",
            "layerlist_denied": "Ei julkaistavissa",
            "denied_tooltip": "Karttatasoa ei voi julkaista upotetussa kartassa, koska tiedontuottaja ei ole antanut lupaa julkaista karttatasoa muissa verkkopalveluissa. Karttatasojen julkaisuoikeudet voit tarkistaa \"Valitut karttatasot\"-valikosta.",
            "myPlacesDisclaimer": "Huom! Julkaistessasi tämän kartan myös karttatasostasi tulee julkinen.",
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
            "hidden": "Karttataso on tilapäisesti piilotettu.",
            "selectAsBaselayer": "Taustakarttataso",
            "rights": {
                "can_be_published_map_user": {
                    "label": "Julkaistavissa",
                    "tooltip": "Karttatason voi julkaista upotetussa kartassa. Viikoittainen käyttömäärä voi olla rajoitettu."
                }
            }
        }
    }
}
);