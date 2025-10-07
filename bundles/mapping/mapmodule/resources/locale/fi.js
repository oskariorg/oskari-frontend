Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "MapModule",
    "value": {
        "status_update_map": "Päivitetään karttaa…",
        "zoombar_tooltip": {
            "zoomLvl-0": "Taustakartta",
            "zoomLvl-1": "Koko maa",
            "zoomLvl-2": "Maakunta",
            "zoomLvl-3": "",
            "zoomLvl-4": "Kunta",
            "zoomLvl-5": "",
            "zoomLvl-6": "",
            "zoomLvl-7": "Kunnanosa",
            "zoomLvl-8": "",
            "zoomLvl-9": "",
            "zoomLvl-10": "Katu",
            "zoomLvl-11": "",
            "zoomLvl-12": ""
        },
        "styles": {
            "defaultTitle" : "Oletustyyli"
        },
        "plugin": {
            "LogoPlugin": {
                "terms": "Käyttöehdot",
                "dataSources": "Tietolähteet",
                "layersHeader": "Karttatasot"
            },
            "DataSourcePlugin": {
                "link": "Tietolähde",
                "popup": {
                    "title": "Tietolähteet",
                    "content": ""
                },
                "button": {
                    "close": "Sulje"
                }
            },
            "BackgroundLayerSelectionPlugin": {
                "emptyOption": "Ei valintaa"
            },
            "LayerSelectionPlugin": {
                "title": "Karttatasot",
                "chooseDefaultBaseLayer": "Valitse taustakartta",
                "headingBaseLayer": "Taustakartta",
                "chooseOtherLayers": "Valitse muut karttatasot",
                "style": "Tyyli"
            },
            "SearchPlugin": {
                "placeholder": "Paikkahaku",
                "search": "Hae",
                "title": "Hakutulokset",
                "close": "Sulje hakutulokset",
                "noresults": "Antamallasi hakusanalla ei löytynyt yhtään kohdetta.",
                "searchResultCount": "Hakusanalla löytyi {count, plural, one {# hakutulos} other {# hakutulosta}}.",
                "searchMoreResults": "Haulla löytyi enemmän tuloksia kuin näytetään ({count}). Tarkenna hakusanaa rajataksesi tulosta.",
                "autocompleteInfo": "Vastaavia hakuehdotuksia",
                "column_name": "Nimi",
                "column_region": "Alue",
                "column_village": "Kunta",
                "column_type": "Tyyppi",

                "selectResult": "Näytä tulos kartalla",
                "deselectResult": "Poista tulos kartalta",
                "selectResultAll": "Näytä kaikki kartalla",
                "deselectResultAll": "Poista kaikki kartalta",

                "options": {
                    "title": "Hakuvalinnat",
                    "description": "Tarkenna hakuehtoja valitsemalla tietolähteet"
                },
                "resultBox": {
                    "close": "Sulje",
                    "title": "Hakutulokset",
                    "alternatives": "Tällä paikalla on seuraavia vaihtoehtoisia nimiä:"
                }
            },
            "GetInfoPlugin": {
                "title": "Kohdetiedot",
                "layer": "Karttataso",
                "places": "Kohteet",
                "description": "Kuvaus",
                "link": "Verkko-osoite",
                "name": "Nimi",
                "noAttributeData": "Ei näytettäviä ominaisuustietoja. Avaa kohdetiedot nähdäksesi piilotetut ominaisuustiedot."
            },
            "PublisherToolbarPlugin": {
                "history": {
                    "back": "Siirry edelliseen näkymään",
                    "next": "Siirry seuraavaan näkymään"
                },
                "measure": {
                    "line": "Mittaa etäisyys",
                    "area": "Mittaa pinta-ala"
                }
            },
            "MarkersPlugin": {
                "title": "Karttamerkintä",
                "tooltip": "Tee karttamerkintä",
                "form": {
                    "style": "Karttamerkinnän esitystapa",
                    "message": {
                        "label": "Kartalla näkyvä teksti",
                        "hint": "Nimi tai kuvaus"
                    }
                },
                "dialog": {
                    "message": "Valitse karttamerkinnälle uusi sijainti klikkaamalla pistettä kartalla.",
                    "clear": "Poista kaikki merkinnät"
                }
            },
            "MyLocationPlugin": {
                "tooltip": "Keskitä kartta omaan sijaintiisi.",
                "error": {
                    "title": "Virhe paikannuksessa!",
                    "timeout": "Paikannuksessa kestää odotettua kauemmin...",
                    "denied": "Sivustolta on estetty paikannus. Salli paikannus ja yritä uudelleen",
                    "noLocation": "Sijainnin määritys epäonnistui",
                    "close": "Sulje"
                }
            },
            "PanButtonsPlugin": {
                "center" : {
                    "tooltip": "Palaa alkutilaan",
                    "confirmReset": "Haluatko palata alkutilaan?"
                }
            },
            "Tiles3DLayerPlugin": {
                "layerFilter": {
                    "text": "3D-tasot",
                    "tooltip": "Näytä vain 3D-aineistot"
                }
            },
            "WfsVectorLayerPlugin": {
                "editLayer": "Muokkaa tasoa",
                "layerFilter": {
                    "tooltip": "Näytä vain vektoritasot",
                    "featuredata": "Vektoritasot"
                }
            }
        },
        "layerVisibility": {
            "notInScale": "Karttatason \"{name}\" kohteet eivät näy tässä mittakaavassa. Siirry soveltuvalle mittakaavatasolle.",
            "notInGeometry": "Karttatasolla \"{name}\" ei ole kohteita tällä alueella. Siirry kohteeseen kartalla."
        },
        "layerUnsupported": {
            "common": "Karttatasoa ei voida näyttää.",
            "srs": "Karttatasoa ei voida näyttää tässä karttaprojektiossa.",
            "dimension": "Karttatasoa ei voida näyttää {dimension}-karttanäkymässä.",
            "unavailable": 'Karttatasoa "{name}" ei voida näyttää.'
        },
        "guidedTour": {
            "help1": {
                "title": "Kartan liikuttaminen",
                "message": "Kartan liikuttaminen onnistuu kahdella eri tavalla. <br/> Raahaa karttaa hiirellä, kun käsi-työkalu on valittuna. <br/> Liikuta karttaa näppäimistön nuolinäppäimillä."
            },
            "help2": {
                "title": "Lähentäminen ja loitontaminen",
                "message": "Lähentämällä voit tarkentaa karttanäkymää. Loitontamalla saat näkyviin suuremman alueen. Nämä onnistuvat usealla eri tavalla. <br/> <br/> Valitse mittakaava mittakaavasäätimestä. Voit myös käyttää (+)- ja (-)-painikkeita mittakaavasäätimen päissä. <br/> <br/>  Käytä näppäimistön (+)- ja (-)-painikkeita. <br/> <br/>  Kaksoisklikkaa karttanäkymää tai käytä suurennuslasi-työkalua lähentääksesi karttaa."
            }
        },
        "layerCoverageTool": {
            "name": "Näytä kattavuusalue",
            "removeCoverageFromMap": "Piilota kattavuusalue"
        },
        "publisherTools": {
            "ScaleBarPlugin": "Mittakaavajana",
            "MyLocationPlugin": {
                "toolLabel": "Käyttäjän sijaintiin keskittäminen",
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
            "PanButtons": {
                "toolLabel": "Palaa alkutilaan",
                "titles": {
                    "showArrows": "Kartan liikuttaminen nuolipainikkeilla"
                }
            },
            "GetInfoPlugin": {
                "toolLabel": "Kohdetietojen kyselytyökalu"
            },
            "IndexMapPlugin": {
                "toolLabel": "Indeksikartta"
            },
            "Zoombar": {
                "toolLabel": "Mittakaavasäädin"
            },
            "CrosshairTool": {
                "toolLabel": "Näytä kartan keskipiste"
            },
            "LayerSelection": {
                "toolLabel": "Karttatasovalikko",
                "noMultipleStyles": "Vain yksi esitystyyli saatavilla valituilla karttatasoilla.",
                "allowStyleChange": "Salli esitystyylin valinta",
                "noMetadata": "Metatietolinkkejä ei saatavilla valituilla karttatasoilla",
                "showMetadata": "Näytä metatietolinkit",
                "selectAsBaselayer": "Valitse taustakartaksi",
            },
            "SearchPlugin": {
                "toolLabel": "Osoite- ja paikannimihaku"
            },
            "ControlsPlugin": {
                "toolLabel": "Kartan liikuttaminen hiirellä raahaamalla",
            },
            "PublisherToolbarPlugin": {
                "toolLabel": "Karttatyökalut",
                "history": "Siirtyminen edelliseen ja seuraavaan näkymään",
                "measureline": "Matkan mittaus",
                "measurearea": "Pinta-alan mittaus"
            }

        }
    }
});