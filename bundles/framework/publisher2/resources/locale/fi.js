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
            "desc": "Kartta on valmis. Julkaise kartta verkkosivulla liittämällä alla oleva html-koodi verkkosivun koodiin:",
            "copy": "Kopioi leikepöydälle"
        },
        "edit": {
            "popup": {
                "title": "Päivitetään upotettua karttaa…",
                "msg": "Päivitetään upotetun kartan tietoja…",
                "published": {
                    "msg": "Avataan upotettua karttaa muokattavaksi. Odota hetki, ole hyvä!",
                    "error": {
                        "title": "Virhe",
                        "common": "Upotetun kartan avaaminen epäonnistui.",
                        "login": "Kirjaudu sisään muokataksesi karttajulkaisua."
                    }
                }
            }
        },
        "BasicView": {
            "title": "Julkaise kartta",
            "titleEdit": "Muokkaa karttaa",
            "transfer": {
                "label": "Siirrä konfiguraatio",
                "PublishTransfer": "Salli siirto"
            },
            "domain": {
                "title": "Julkaisutiedot",
                "label": "Rajoita kartan upotus vain seuraavaan verkko-osoitteeseen:",
                "placeholder": "Sivuston osoite",
                "tooltip": "Anna verkkosivuston osoite eli domain-nimi ilman http- tai www-etuliitettä tai alasivun osoitetta. Esimerkiksi: omakotisivu.com.",
                "inputWarning": "Tarkista syötetty verkko-osoite"
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
                "tooltip": "Valitse kartan koko. Suositus on käyttää skaalautuvaa vaihtoehtoa \"Skaalautuva / tilan täyttävä\". Muussa tapauksessa leveyden on oltava välillä {minWidth} ja {maxWidth} pikseliä ja korkeuden {minHeight} ja {maxHeight} pikseliä."
            },
            "maptools": {
                "label": "Lisätyökalut",
                "tooltip": "Valitse kartalla käytettävissä olevat työkalut. Tarkista asettelu esikatselukartasta.",
                "GetInfoPlugin": "Kohdetietojen kyselytyökalu",
                "selectDrawLayer": "Valitse tallennustaso",
                "LayerSelectionPlugin": "Karttatasovalikko",
                "MapLegend": "Näytä karttaselitteet",
                "MapRotator": "Salli kartan pyörittäminen",
                "toolbarToolNames": {
                    "history": "Siirtyminen edelliseen ja seuraavaan näkymään",
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
                    "selectAsBaselayer": "Valitse taustakartaksi",
                },
                "mylocation": {
                    "modes": {
                        "single": "Yksittäinen",
                        "continuous": "Jatkuva"
                    },
                    "titles": {
                        "mode": "Toiminto",
                        "mobileOnly": "Käytä toimintoja vain mobiililaitteissa",
                        "centerMapAutomatically": "Keskitä käyttäjän sijaintiin automaattisesti kartan käynnistyessä"
                    }
                },
            },
            "toollayout": {
                "label": "Työkalujen asettelu kartalla",
                "tooltip": "Valitse, miten työkalut asetellaan kartalle.",
                "swapUI": "Vaihda puolet",
                "userlayout": "Oma asettelu",
                "usereditmode": "Muokkaa asettelua",
                "usereditmodeoff": "Lopeta muokkaus"
            },
            "statsgrid": {
                "label": "Teemakartat",
                "tooltip": "Näytä tilastotiedot taulukossa kartan yhteydessä."
            },
            /* for deprecated statsgrid2016 */
            "data": {
                "label": "Teemakartat",
                "tooltip": "Näytä tilastotiedot taulukossa kartan yhteydessä.",
                "grid": "Näytä tilastotiedot taulukossa",
                "allowClassification": "Salli luokittelu",
                "transparent": "Aseta luokittelun tausta läpinäkyväksi",
                "displayDiagram" : "Näytä pylväsdiagrammi",
                "allowHidingClassification" : "Salli luokittelun piilottaminen",
                "allowHidingSeriesControl" : "Salli sarjatoistimen piilottaminen"
            },
            "layout": {
                "label": "Ulkoasu",
                "title": {
                    "popup": "Ponnahdusikkuna",
                    "buttons": "Painikkeet"
                },
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
                        "rounded-dark": "Pyöristetty (tumma)",
                        "rounded-light": "Pyöristetty (vaalea)",
                        "sharp-dark": "Kulmikas (tumma)",
                        "sharp-light": "Kulmikas (vaalea)",
                        "3d-dark": "Kolmiulotteinen (tumma)",
                        "3d-light": "Kolmiulotteinen (vaalea)"
                    },
                    "popupHeaderColor": "Otsikon taustaväri",
                    "popupHeaderTextColor": "Otsikon väri",
                    "buttonBackgroundColor": "Taustaväri",
                    "buttonTextColor": "Ikonien väri",
                    "buttonAccentColor": "Ikonien tehosteväri",
                    "buttonRounding": "Painikkeiden pyöristys",
                    "effect": "Efekti",
                    "3d": "3D",
                    "presets": "Valmiit tyylimääritykset"
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
                    "msg": "Haluatko päivittää upotetun kartan? Päivitykset näkyvät välittömästi upotetussa kartassa. Sinun ei tarvitse muuttaa html-koodia paitsi jos olet muuttanut kartan kokoa."
                }
            },
            "layerselection": {
                "label": "Karttatasovalikko",
                "info": "Valitse taustakarttoina näytettävät karttatasot. Oletusvalinnan voit tehdä esikatselukartassa.",
                "tooltip": "Valitse julkaistavalla kartalla näytettävät karttatasot.",
                "promote": "Haluatko näyttää kartalla myös ilmakuvia?"
            },
            "rpc": {
                "label": "Ohjelmallinen käyttö (RPC-rajapinta)",
                "info": "RPC-rajapinnan avulla voit hyödyntää julkaistuja karttoja. Lisätietoa https://oskari.org/documentation/features/rpc/"
            },
            "mapLayers": {
                "label": "Karttatasot",
                "otherLayers": "Muut kartat",
                "selectLayers": "Valitse tasot",
                "layersDisplay": "Tasojen esitystapa",
                "baseLayers": "Taustakartat",
                "noBaseLayers": "Ei valittuja taustakarttoja",
                "noLayers": "Ei valittuja karttatasoja"
            },
            "tools": {
                "label": "Kartalla näytettävät työkalut"
            },
            "preview": "Kartan esikatselu",
            "location": "Sijainti ja mittakaavataso",
            "zoomlevel": "Mittakaavataso",
            "help": "Ohje",
            "error": {
                "title": "Virhe",
                "size": "Kartan koko on virheellinen. Leveyden on oltava välillä {minWidth} ja {maxWidth} pikseliä ja korkeuden {minHeight} ja {maxHeight} pikseliä.",
                "domain": "Verkkosivuston osoite on pakollinen tieto. Anna sivuston osoite ja yritä uudelleen.",
                "domainStart": "Verkkosivuston osoite on väärässä muodossa. Anna osoite ilman http- tai www-etuliitteitä ja yritä uudelleen.",
                "name": "Kartan nimi on pakollinen tieto. Anna kartalle nimi ja yritä uudelleen.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Kartan tallennus epäonnistui.",
                "nameIllegalCharacters": "Kartan nimessä on kiellettyjä merkkejä (esim. html-tagit). Poista kielletyt merkit ja yritä uudelleen.",
                "domainIllegalCharacters": "Verkkosivuston osoitteessa on kiellettyjä merkkejä. Anna verkkosivuston osoite eli domain-nimi ilman http- tai www-etuliitettä tai alasivun osoitetta. Esimerkiksi: omakotisivu.com. Sallittuja merkkejä ovat aakkoset (a-z, A-Z), numerot (0-9) sekä yhdysviiva (-), alaviiva (_), piste (.), huutomerkki (!), aaltoviiva (~), asteriski (*), puolilainausmerkki (') ja sulut ().",
                "enablePreview": "Virheitä esikatselun avaamisessa. Esikatselu ei täysin vastaa julkaistua karttaa.",
                "disablePreview": "Virheitä esikatselusta palautumisessa. Sivu kannattaa ladata uudestaan.",
            },
            "noUI": "Piilota käyttöliittymä (käytä RPC-rajapinnan kautta)"
        },
        "NotLoggedView": {
            "text": "\"Julkaise kartta\" -toiminnon avulla voit julkaista upotetun kartan omalla verkkosivulla. Upotetussa kartassa näkyy valitsemasi karttanäkymä ja työkalut. Kartan julkaisu vaatii kirjautumisen palveluun.",
            "signup": "Kirjaudu sisään",
            "register": "Rekisteröidy"
        },
        "StartView": {
            "text": "Tervetuloa karttajulkaisuun. Toiminnon avulla voit julkaista upotetun kartan omalla verkkosivulla.",
            "touLink": "Näytä karttajulkaisun käyttöehdot",
            "layerlist_title": "Avoinna olevat karttatasot, jotka ovat julkaistavissa",
            "layerlist_empty": "Avoinna olevat karttatasot eivät ole julkaistavissa. Tarkista Valitut tasot -valikosta, mitkä karttatasot ovat julkaistavissa.",
            "layerlist_denied": "Avoinna olevat karttatasot, jotka eivät ole julkaistavissa",
            "denied_tooltip": "Karttatasot eivät ole julkaistavissa upotetussa kartassa. Tiedontuottaja ei ole antanut lupaa julkaista karttatasoa muissa verkkopalveluissa tai tasoa ei voida näyttää tässä karttaprojektiossa. Tarkista karttatason julkaisuoikeudet Valitut tasot -valikosta.",
            "myPlacesDisclaimer": "HUOM! Jos käytät karttatasoa karttajulkaisussa, karttatasosta tulee julkinen.",
            "noRights": "ei julkaisuoikeutta",
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
        },
        "guidedTour": {
            "title": "Karttajulkaisu",
            "message": "Karttajulkaisu-toiminnolla voit julkaista karttoja omalla verkkosivullasi. <br/><br/> Valitse kartalla näytettävät karttatasot, kerro missä aiot julkaista kartan, valitse työkalut ja määrittele kartan ulkoasu. Paina Tallenna ja kartta on valmis julkaistavaksi. Kopioi vain saamasi html-koodi verkkosivullesi. <br/><br/> Voit myöhemmin päivittää karttaa Omat tiedot -valikon kautta. Muutokset näkyvät heti myös omalla verkkosivullasi.<br/><br/> Vain kirjautuneet käyttäjät voivat julkaista karttoja.",
            "openLink": "Näytä Karttajulkaisu",
            "closeLink": "Piilota Karttajulkaisu",
            "tileText": "Karttajulkaisu"
        }
    }
});