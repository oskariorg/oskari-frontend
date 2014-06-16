Oskari.registerLocalization({
    "lang": "fi",
    "key": "Analyse",
    "value": {
        "title": "Analyysi",
        "flyouttitle": "Analyysi",
        "desc": "",
        "btnTooltip": "Analyysi",
        "notLoggedIn": "Vain kirjautunut käyttäjä voi tehdä WFS tasoille analyysejä. <a href='/web/fi/login'>Kirjaudu palveluun</a>.",
        "AnalyseView": {
            "title": "Analyysi",
            "content": {
                "label": "Aineisto",
                "drawToolsLabel": "Kohdetyökalut",
                "tooltip": "Lisää tietoaineisto painamalla [valitse karttatasot] painiketta",
                "drawToolsTooltip": "Voit lisätä oman kohteen, jolle voit tehdä analyysin.\nKohdetta leikkaamalla voit jakaa kohteen kahdeksi eri kohteeksi. Tämän jälkeen voit tehdä analyysin toiselle kohteista",
                "features": {
                    "title": "Kohteen lisäys",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "tooltips": {
                        "point": "Lisää piste",
                        "line": "Lisää viiva",
                        "area": "Lisää alue"
                    },
                    "modes": {
                        "area": "Alue",
                        "line": "Viiva",
                        "point": "Piste"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Pisteen lisäys",
                        "add": "Lisää piste klikkaamalla karttaa."
                    },
                    "line": {
                        "title": "Viivan lisäys",
                        "add": "Lisää viivan taitepiste klikkaamalla karttaa.\nLopeta piirto tuplaklikkauksella."
                    },
                    "area": {
                        "title": "Alueen lisäys",
                        "add": "Lisää alueen taitepisteet klikkaamalla karttaa.\nLopeta piirto tuplaklikkauksella.\nVoit piirtää alueeseen reiän pitämällä pohjassa Alt-näppäintä."
                    }
                },
                "drawFilter": {
                    "title": "Kohteen leikkaus",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "tooltip": {
                        "point": "Viivarajaus",
                        "line": "Aluerajaus viivalla",
                        "edit": "Alueen leikkaus",
                        "remove": "Rajauksen poistaminen"
                    },
                    "dialog": {
                        "modes": {
                            "point": {
                                "title": "Viivarajaus",
                                "message": "Valitse rajattava viiva siirtämällä markereita."
                            },
                            "line": {
                                "title": "Aluerajaus viivalla",
                                "message": "Jaa alue viivalla. Lopeta viivapiirto kaksoisklikkaamalla. Tämän jälkeen voit muokata halkaisuviivaa sekä siirtää leikkauspisteitä ulkoreunaa pitkin."
                            },
                            "edit": {
                                "title": "Alueen leikkaus",
                                "message": "Leikkaa alue toisella alueella."
                            }
                        }
                    }
                },
                "search": {
                    "title": "Hae paikkahaulla",
                    "resultLink": "Tuo analyysiin"
                }
            },
            "method": {
                "label": "Menetelmä",
                "tooltip": "Vyöhyke-menetelmä: Lisää valittujen kohteiden ympärille vyöhykkeet ja käyttää näitä vyöhyke-geometrioita (buffer) analyysissä -+- Koostetyökalu: Laskee kohteen ominaisuuksille aggregointiominaisuuksia esim. summat -+- Unioni: kohteiden yhdistäminen taulukosta valitsemalla tai yhteisten ominaisuustietoarvojen perusteella -+- Leikkaus: Valitaan uudet kohteet leikkaamalla leikkaavan tason kohteilla leikattavaa tasoa",
                "options": [{
                    "id": "oskari_analyse_buffer",
                    "label": "Vyöhyke",
                    "classForMethod": "buffer",
                    "selected": true,
                    "tooltip": "Lisää valittujen kohteiden ympärille vyöhykkeet ja käyttää näitä vyöhyke-geometrioita (buffer) analyysissä"
                }, {
                    "id": "oskari_analyse_aggregate",
                    "label": "Kooste",
                    "classForPreview": "aggregate",
                    "tooltip": "Laskee kohteen ominaisuuksille aggregointiominaisuuksia esim. summat"
                }, {
                    "id": "oskari_analyse_union",
                    "label": "Yhdiste",
                    "classForPreview": "union",
                    "tooltip": "Kohteiden yhdistäminen taulukosta valitsemalla tai yhteisten ominaisuustietoarvojen perusteella"

                }, {
                    "id": "oskari_analyse_clip",
                    "label": "Leikkaus",
                    "classForPreview": "clip",
                    "tooltip": ""
                }, {
                    "id": "oskari_analyse_intersect",
                    "label": "Leikkaavien kohteiden suodatus",
                    "classForPreview": "intersect",
                    "tooltip": "Valitaan uudet kohteet leikkaamalla leikkaavan tason kohteilla leikattavaa tasoa"
                }, {
                    "id": "oskari_analyse_layer_union",
                    "label": "Analyysitasojen yhdiste",
                    "classForPreview": "layer_union",
                    "tooltip": "Yhdistää analyysitasoja, joilla on samat ominaisuustietokentät"
                }, {
                    "id": "oskari_analyse_areas_and_sectors",
                    "label": "Vyöhykkeet ja sektorit",
                    "classForPreview": "areas_and_sectors",
                    "tooltip": "NOT TRANSLATED"
                }]
            },
            "aggregate": {
                "label": "Aggregointifunktio",
                "options": [{
                    "id": "oskari_analyse_Count",
                    "label": "Lukumäärä",
                    "selected": true
                }, {
                    "id": "oskari_analyse_Sum",
                    "label": "Summa"
                }, {
                    "id": "oskari_analyse_Min",
                    "label": "Pienin arvo"
                }, {
                    "id": "oskari_analyse_Max",
                    "label": "Suurin arvo"
                }, {
                    "id": "oskari_analyse_Average",
                    "label": "Keskiarvo"
                }, {
                    "id": "oskari_analyse_StdDev",
                    "label": "Keskihajonta"
                }, {
                    "id": "oskari_analyse_Median",
                    "label": "Mediaani"
                },{
                    "id": "oskari_analyse_NoDataCount",
                    "label": "Tietosuojatut kohteet"
                  }],
                "attribute": "Valitse ominaisuustieto"
            },
            "buffer_size": {
                "label": "Vyöhykkeen koko",
                "tooltip": "Anna vyöhykkeen koko"
            },
            "buffer_units": {
                "m": "Metriä",
                "km": "Kilometriä"
            },
            "analyse_name": {
                "label": "Analyysin nimi",
                "tooltip": "Anna analyysin nimi"
            },
            "settings": {
                "label": "Parametrit",
                "tooltip": "Anna parametrit analyysia varten. Parametrit riippuvat valitusta suodattimesta ja menetelmästä"
            },
            "intersect": {
                "label": "Leikkaava taso"
            },
            "union": {
                "label": "Valittu yhdistettävä taso"
            },
            "layer_union": {
                "label": "Valitut yhdistettävät tasot",
                "notAnalyseLayer": "Valitse jokin analyysitaso",
                "noLayersAvailable": "Tasoja, joilla on samat ominaisuustietokentät ei löytynyt"
            },
            "areas_and_sectors": {
                "area_count": "Vyöhykkeiden lukumäärä",
                "area_count_tooltip": "Anna vyöhykkeiden lukumäärä",
                "area_size": "Vyöhykkeiden koko",
                "area_size_tooltip": "Anna vyöhykkeiden koko",
                "sector_count": "Sektoreiden lukumäärä",
                "sector_count_tooltip": "Anna sektoreiden lukumäärä",
            },
            "spatial": {
                "label": "Spatiaalinen operaattori",
                "options": [{
                    "id": "oskari_analyse_intersect",
                    "label": "Leikkaa",
                    "selected": true
                }, {
                    "id": "oskari_analyse_contains",
                    "label": "Sisältää"
                }]
            },
            "params": {
                "label": "Säilytettävät ominaisuustiedot",
                "aggreLabel": "Koostettavat ominaisuustiedot",
                "tooltip": "",
                "options": [{
                    "id": "oskari_analyse_all",
                    "selected": true,
                    "label": "Kaikki"
                }, {
                    "id": "oskari_analyse_none",
                    "label": "Ei mitään"
                }, {
                    "id": "oskari_analyse_select",
                    "label": "Valitse listalta"
                }]
            },
            "output": {
                "label": "Ulkoasu",
                "color_label": "Valitse tyylit:",
                "colorset_tooltip": "Valitse tyylit eri geometria tyyleille",
                "tooltip": "Voit valita analyysin tuloksille sivuillesi sopivan tyylimaailman",
                "random_color_label": "Satunnaiset värit"
            },
            "buttons": {
                "save": "Tallenna",
                "analyse": "Jatka analyysia",
                "data": "Valitse karttatasot",
                "cancel": "Poistu",
                "ok": "OK"
            },
            "filter": {
                "title": "Suodatus",
                "description": "Suodatin tasolle ",
                "clearButton": "Tyhjennä suodatin",
                "refreshButton": "Päivitä suodatin",
                "addFilter": "Lisää uusi suodatin",
                "removeFilter": "Poista suodatin",
                "bbox": {
                    "title": "Ikkunarajaus",
                    "on": "Käytössä",
                    "off": "Pois käytöstä"
                },
                "clickedFeatures": {
                    "title": "Kohderajaus",
                    "label": "Sisällytä vain kartalta valitut kohteet"
                },
                "values": {
                    "title": "Suodatin",
                    "placeholders": {
                        "case-sensitive": "Case sensitive",
                        "attribute": "Attribuutti",
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
                "validation": {
                    "title": "Seuraavat virheet estivät suodattimen päivityksen:",
                    "attribute_missing": "Attribuutti puuttuu",
                    "operator_missing": "Operaattori puuttuu",
                    "value_missing": "Arvo puuttuu",
                    "boolean_operator_missing": "Looginen operaattori puuttuu"
                }
            },
            "help": "Ohje",
            "success": {
                "layerAdded": {
                    "title": "Analyysi OK",
                    "message": "Lisätty uusi analyysitaso -- {layer} --"
                }
            },
            "error": {
                "title": "Virhe",
                "invalidSetup": "Virheellisiä parametrejä",
                "noParameters": "Ei tietoaineistoa, ei parametrejä",
                "noLayer": "Ei valittua tasoa",
                "noAnalyseUnionLayer": "Valitse ainakin toinen analyysitaso",
                "invalidMethod": "Tuntematon menetelmä: ",
                "bufferSize": "Virhe vyöhykkeen koossa",
                "illegalCharacters": "ei kirjaimia - käytä numeroita",
                "nohelp": "Ohjetta ei löytynyt",
                "saveFailed": "Analyysin tallennus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayersFailed": "Analyysitasojen lataus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayerTypesFailed": "Analyysi- tai WFS-tason tietotyyppien haku epäonnistui ",
                "Analyse_parameter_missing": "Analyysin parametrit puuttuvat",
                "Unable_to_parse_analysis": "Analyysin parametrit väärin",
                "Unable_to_get_WPS_features": "Analyysin WPS input kohteiden haku epäonnistui",
                "WPS_execute_returns_Exception": "Analyysin prosessointi epäonnistui",
                "WPS_execute_returns_no_features": "Analyysi ei palauta yhtään kohdetta",
                "Unable_to_process_aggregate_union": "Yhdisteen koosteen prosessointi epäonnistui",
                "Unable_to_get_features_for_union": "Koosteen input kohteiden haku epäonnistui",
                "Unable_to_store_analysis_data": "Analyysin tallennus epäonnistui",
                "Unable_to_get_analysisLayer_data": "Analyysitason tietojen parsinta epäonnistui"

            },
            "infos": {
                "title": "Tiedoksi",
                "layer": "Tasolla ",
                "over10": " on yli kymmenen ominaisuustietoa - valitse listalta korkeintaan 10"
            }
        },
        "StartView": {
            "text": "Voit analysoida valitsemiasi tietotuotteita ja paikkatietoja saatavilla olevilla analyysimenetelmillä ja tallentaa analyysin tulokset myöhempää käyttöä varten",
            "infoseen": {
                "label": "Älä näytä tätä viestiä uudelleen"
            },
            "buttons": {
                "continue": "Aloita analyysi",
                "cancel": "Poistu"
            }
        },
        "categoryform": {
            "name": {
                "label": "Nimi",
                "placeholder": "Anna tasolle nimi"
            },
            "drawing": {
                "label": "  ",
                "point": {
                    "label": "Piste",
                    "color": "Väri",
                    "size": "Koko"
                },
                "line": {
                    "label": "Viiva",
                    "color": "Väri",
                    "size": "Paksuus"
                },
                "area": {
                    "label": "Alue",
                    "fillcolor": "Täyttöväri",
                    "linecolor": "Viivan väri",
                    "size": "Viivan paksuus"
                }
            },
            "edit": {
                "title": "Muokkaa karttatasoa",
                "save": "Tallenna",
                "cancel": "Peruuta"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Nimi",
                "delete": " "
            },
            "title": "Analyysit",
            "confirmDeleteMsg": "Haluatko poistaa analyysin:",
            "buttons": {
                "ok": "OK",
                "cancel": "Peruuta",
                "delete": "Poista"
            },
            "notification": {
                "deletedTitle": "Karttatason poisto",
                "deletedMsg": "Karttataso poistettu."
            },
            "error": {
                "title": "Virhe!",
                "generic": "Järjestelmässä tapahtui virhe. Yritä uudelleen myöhemmin."
            }
        }
    }
});
