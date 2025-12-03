Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Publisher2",
    "value": {
        "tile": {
            "title": "Karttajulkaisu"
        },
        "flyout": {
            "title": "Julkaise kartta verkkosivuille"
        },
        "published": {
            "title": "Upotettava kartta on valmis julkaistavaksi",
            "desc": "Julkaise kartta liittämällä alla oleva HTML-koodi verkkosivuillesi:",
            "copy": "Kopioi leikepöydälle"
        },
        "snippet": {
            "title": "HTML-koodi",
            "desc": "Lisää alla oleva koodi html-koodiin verkkosivullasi. Kartta tulee näkyviin verkkosivullesi.",
            "params": "Käytä karttaupotusta nykyisellä sijainnilla ja mittakaavatasolla",
            "paramsTip": "Oletusarvoisesti karttaikkunan keskipiste on se, joka karttaikkunassa on julkaisuhetkellä."
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
            "title": "Karttajulkaisu",
            "titleEdit": "Muokkaa julkaistua karttaa",
            "transfer": {
                "label": "Siirrä konfiguraatio",
                "PublishTransfer": "Salli siirto"
            },
            "generalInfo": {
                "label": "Julkaisutiedot",
                "domain": {
                    "label": "Salli julkaisu vain seuraavassa verkko-osoitteessa",
                    "placeholder": "Sivuston osoite",
                    "tooltip": "Anna verkkosivuston osoite eli domain-nimi ilman http-etuliitettä tai alasivun osoitetta. Esimerkiksi: omakotisivu.com.",
                    "inputWarning": "Tarkista syötetty verkko-osoite"
                },
                "name": {
                    "label": "Kartan nimi (pakollinen)",
                    "placeholder": "Kartan nimi",
                    "tooltip": "Anna kartalle nimi. Ota huomioon kartalla käytössä oleva kieli."
                },
                "language": {
                    "label": "Käyttöliittymän kieli",
                    "options": {
                        "fi": "suomi",
                        "sv": "ruotsi",
                        "en": "englanti"
                    },
                    "tooltip": "Valitse kartalla käytettävä kieli. Valinta vaikuttaa käyttöliittymään ja kartalla näkyviin teksteihin. Huom! Kielivalinnat eivät näy esikatselukartalla.",
                    "languageChangedDisclaimer": "Huom! Kielivalinnat eivät näy esikatselukartalla."
                }
            },
            "mapPreview": {
                "label": "Kartan koko",
                "tooltip": "Valitse kartan koko. Suositus on käyttää skaalautuvaa vaihtoehtoa \"Tilan täyttävä\". Muussa tapauksessa leveyden on oltava välillä {minWidth} ja {maxWidth} pikseliä ja korkeuden {minHeight} ja {maxHeight} pikseliä."
            },
            "tools": {
                "label": "Työkalut",
                "additional": "Lisätyökalut",
                "tooltip": "Valitse kartalla käytettävissä olevat työkalut. Tarkista asettelu esikatselukartasta."
            },
            "toolLayout": {
                "label": "Työkalujen asettelu kartalla",
                "tooltip": "Valitse, miten työkalut asetellaan kartalle.",
                "swapUI": "Vaihda puolet",
                "userlayout": "Oma asettelu",
                "usereditmodeoff": "Tallenna asettelu"
            },
            "statsgrid": {
                "label": "Teemakartat",
                "tooltip": "Näytä tilastotiedot taulukossa kartan yhteydessä."
            },
            "layout": {
                "label": "Ulkoasu",
                "title": {
                    "popup": "Ponnahdusikkuna",
                    "buttons": "Painikkeet",
                    "infobox": "Kohdetietojen kyselytyökalu"
                },
                "fields": {
                    "toolStyles": {
                        "rounded-dark": "Pyöristetty (tumma)",
                        "rounded-light": "Pyöristetty (vaalea)",
                        "sharp-dark": "Kulmikas (tumma)",
                        "sharp-light": "Kulmikas (vaalea)",
                        "3d-dark": "3D (tumma)",
                        "3d-light": "3D (vaalea)"
                    },
                    "font": "Fontti",
                    "popupHeaderColor": "Otsikon taustaväri",
                    "popupHeaderTextColor": "Otsikon väri",
                    "infoboxHeaderColor": "Otsikon taustaväri",
                    "infoboxHeaderTextColor": "Otsikon fontin väri",
                    "infoboxPreview": "Esikatselu",
                    "buttonBackgroundColor": "Taustaväri",
                    "buttonTextColor": "Ikonien väri",
                    "buttonAccentColor": "Ikonien tehosteväri",
                    "buttonRounding": "Painikkeiden pyöristys",
                    "effect": "Efekti",
                    "3d": "3D",
                    "presets": "Valmiit tyylit"
                },
                "gfiDialog": {
                    "title": "Kohdetiedot",
                    "featureName": "Esikatselu",
                    "featureDesc": "Ulkoasuvalinnat vaikuttavat kohdetietojen ja karttatasovalikon ulkoasuun."
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
                "replace": "Päivitä"
            },
            "confirm": {
                "replace": {
                    "title": "Haluatko päivittää upotetun kartan?",
                    "msg": "Haluatko päivittää upotetun kartan? Päivitykset näkyvät välittömästi upotetussa kartassa. Sinun ei tarvitse muuttaa html-koodia paitsi jos olet muuttanut kartan kokoa."
                }
            },
            "rpc": {
                "label": "Ohjelmallinen käyttö (RPC-rajapinta)",
                "tooltip": "RPC-rajapinnan avulla voit hyödyntää julkaistuja karttoja. Lisätietoa https://oskari.org/documentation/features/rpc/"
            },
            "layers": {
                "label": "Karttatasot",
                "tools": "Työkalut",
                "selectAsBaselayer": "Valitse taustakartaksi",
                "otherLayers": "Valitut karttatasot",
                "selectLayers": "Valitse tasot",
                "layersDisplay": "Muokkaa tasoja",
                "baseLayers": "Taustakartat",
                "noBaseLayers": "Ei valittuja taustakarttoja",
                "noLayers": "Ei valittuja karttatasoja"
            },
            "error": {
                "title": "Virhe",
                "size": "Kartan koko on virheellinen. Leveyden on oltava {minWidth} - {maxWidth} pikseliä ja korkeuden {minHeight} - {maxHeight} pikseliä.",
                "domain": "Verkkosivuston osoite on pakollinen tieto. Anna sivuston osoite ja yritä uudelleen.",
                "domainStart": "Verkkosivuston osoite on väärässä muodossa. Anna osoite ilman http-etuliitteitä ja yritä uudelleen.",
                "name": "Kartan nimi on pakollinen tieto.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Kartan tallennus epäonnistui.",
                "nameIllegalCharacters": "Kartan nimessä on kiellettyjä merkkejä (esim. html-tagit). Poista kielletyt merkit ja yritä uudelleen.",
                "domainIllegalCharacters": "Verkkosivuston osoitteessa on kiellettyjä merkkejä. Anna verkkosivuston osoite eli domain-nimi ilman http- tai www-etuliitettä tai alasivun osoitetta. Esimerkiksi: omakotisivu.com. Sallittuja merkkejä ovat aakkoset (a-z, A-Z), numerot (0-9) sekä yhdysviiva (-), alaviiva (_), piste (.), huutomerkki (!), aaltoviiva (~), asteriski (*), puolilainausmerkki (') ja sulut ().",
                "enablePreview": "Virheitä esikatselun avaamisessa. Esikatselu ei täysin vastaa julkaistua karttaa.",
                "disablePreview": "Virheitä esikatselusta palautumisessa. Sivu kannattaa ladata uudestaan."
            },
            "noUI": "Piilota käyttöliittymä (käytä RPC-rajapinnan kautta)"
        },
        "NotLoggedView": {
            "text": "Luo upotettava kartta ja julkaise se omalla verkkosivullasi. Upotetussa kartassa näkyy valitsemasi karttanäkymä ja työkalut. Kartan julkaisu vaatii kirjautumisen palveluun.",
            "signup": "Kirjaudu sisään",
            "register": "Rekisteröidy"
        },
        "StartView": {
            "text": "Luo upotettava kartta ja julkaise se omalla verkkosivullasi.",
            "touLink": "Karttajulkaisun käyttöehdot",
            "layerlist_title": "Avoinna olevat karttatasot, jotka ovat julkaistavissa",
            "layerlist_empty": "Avoinna olevat karttatasot eivät ole julkaistavissa. Tarkista Valitut tasot -valikosta, mitkä karttatasot ovat julkaistavissa.",
            "layerlist_denied": "Avoinna olevat karttatasot, jotka eivät ole julkaistavissa",
            "denied_tooltip": "Karttatasot eivät ole julkaistavissa upotetussa kartassa. Tiedontuottaja ei ole antanut lupaa julkaista karttatasoa muissa verkkopalveluissa tai tasoa ei voida näyttää tässä karttaprojektiossa. Tarkista karttatason julkaisuoikeudet Valitut tasot -valikosta.",
            "userDataLayerDisclaimer": "HUOM! Jos käytät karttatasoa karttajulkaisussa, karttatasosta tulee julkinen.",
            "hasUserDataDisclaimer": "HUOM! Jos käytät omia karttatasoja karttajulkaisussa, karttatasoista tulee julkisia.",
            "noRights": "ei julkaisuoikeutta",
            "buttons": {
                "continue": "Jatka",
                "continueAndAccept": "Hyväksy ehdot ja jatka"
            },
            "tou": {
                "title": "Käyttöehdot",
                "notfound": "Käyttöehtoja ei löytynyt.",
                "reject": "Hylkää",
                "accept": "Hyväksy"
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
