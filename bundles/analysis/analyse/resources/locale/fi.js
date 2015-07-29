Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Analyse",
    "value": {
        "title": "Analyysi <font color=red>(BETA)</font>",
        "flyouttitle": "Analyysi <font color=red>(BETA)</font>",
        "desc": "",
        "btnTooltip": "Analyysi",
        "NotLoggedView": {
            "text": "Voit käyttää Analyysitoimintoa kirjauduttuasi palveluun.",
            "signup": "Kirjaudu sisään",
            "signupUrl": "/web/fi/login",
            "register": "Rekisteröidy",
            "registerUrl": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "AnalyseView": {
            "title": "Analyysi",
            "content": {
                "label": "Karttatasot",
                "drawToolsLabel": "Kohdetyökalut",
                "tooltip": "Valitse yksi aineisto analyysin pohjaksi. Lisää karttatasoja voit hakea \"Lisää karttatasoja\"-painikkeella aukeavalta listalta. Kohdista karttanäkymä haluamaasi paikkaan joko siirtämällä karttaa hiirellä tai klikkaamalla \"Hae paikkahaulla\" ja hakemalla haluamasi paikka.",
                "drawToolsTooltip": "Kohdetyökalujen avulla voit lisätä väliaikaisen kohteen analyysin tekemistä varten tai leikata olemassaolevaa kohdetta rajaamalla siitä vain osan. Voit lisätä pistemäisen, viivamaisen tai aluemaisen kohteen. Myös leikkaus onnistuu eri tyyppisille kohteille.",
                "features": {
                    "title": "Lisäys",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "tooltips": {
                        "point": "Lisää väliaikainen pistekohde analyysia varten.",
                        "line": "Lisää väliaikainen viivakohde analyysia varten.",
                        "area": "Lisää väliaikainen aluekohde analyysia varten."
                    },
                    "modes": {
                        "area": "Väliaikainen alue",
                        "line": "Väliaikainen viiva",
                        "point": "Väliaikainen piste"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Pisteen lisäys",
                        "add": "Lisää piste (tai useita pisteitä) klikkaamalla karttaa ja paina sen jälkeen \"Valmis\". \"Peruuta\"-painikkeen avulla voit poistaa piirtämäsi pisteet tallentamatta niitä. Painettuasi \"Valmis\"-painiketta lisäämäsi pisteet ilmestyvät aineistolistaan \"Väliaikainen piste X\"-nimellä, jossa X on lisäämäsi pisteen järjestysnumero."
                    },
                    "line": {
                        "title": "Viivan lisäys",
                        "add": "Lisää viiva klikkaamalla viivan taitepisteitä (m.l. alkupiste). Lopeta viivan piirto tuplaklikkaamalla. Voit lisätä myös useita viivoja. Paina lopuksi \"Valmis\". \"Peruuta\"-painikkeen avulla voit poistaa piirtämäsi viivat tallentamatta niitä. Painettuasi \"Valmis\"-painiketta lisäämäsi viivat ilmestyvät aineistolistaan \"Väliaikainen viiva X\"-nimellä, jossa X on lisäämäsi viivan järjestysnumero."
                    },
                    "area": {
                        "title": "Alueen lisäys",
                        "add": "Lisää alue klikkaamalla alueen reunaviivan taitepisteitä (m.l. alkupiste). Lopeta alueen piirto tuplaklikkaamalla. Voit lisätä myös useita alueita ja voit piirtää alueeseen reiän pitämällä pohjassa ALT-näppäintä. Paina lopuksi \"Valmis\". \"Peruuta\"-painikkeen avulla voit poistaa piirtämäsi alueet tallentamatta niitä. Painettuasi \"Valmis\"-painiketta lisäämäsi alueet ilmestyvät aineistolistaan \"Väliaikainen alue X\"-nimellä, jossa X on lisäämäsi alueen järjestysnumero."
                    }
                },
                "drawFilter": {
                    "title": "Leikkaus",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "tooltip": {
                        "point": "Määrittele leikkauspisteet ja leikkaa viiva niiden perusteella.",
                        "line": "Määrittele leikkausviiva ja leikkaa alue sen perusteella.",
                        "edit": "Määrittele leikkausalue ja leikkaa alue sen perusteella.",
                        "remove": "Poista leikkaus"
                    },
                    "dialog": {
                        "modes": {
                            "point": {
                                "title": "Viivan leikkaus pisteillä",
                                "message": "Valitulla viivalla näkyy punainen \"salmiakkikuvioinen\" karttamerkintä sekä viivan alku- että päätepisteessä. Jos viiva muodostaa ympyrän, karttamerkinnät ovat päällekkäin. Karttamerkintä osoittaa viivan leikkauspisteet. Siirtämällä karttamerkintää voit rajata viivasta vain osan. Rajattu viiva muuttuu punaiseksi. Kun olet valinnut haluamasi osan viivasta, paina \"Valmis\". Nyt voit käyttää leikattua viivan osaa analyyseissasi."
                            },
                            "line": {
                                "title": "Alueen leikkaus viivalla",
                                "message": "Piirrä viiva leikattavan alueen yli klikkaamalla viivan taitepisteitä (m.l. alku- ja loppupiste). Lopeta viivan piirto tuplaklikkaamalla. Voit siirtää taitepisteitä raahaamalla niitä hiirellä. Näin alue on jaettu kahteen alueeseen. Leikkauksen lopputulos on merkitty sinisellä. Voit vaihtaa toiseen alueeseen klikkaamalla sitä. Kun olet valinnut haluamasi osan alueesta, paina \"Valmis\". Nyt voit käyttää leikattua alueen osaa analyyseissasi."
                            },
                            "edit": {
                                "title": "Alueen leikkaus toisella alueella",
                                "message": "Piirrä alue leikattavan alueen päälle klikkaamalla viivan taitepisteitä (m.l. alkupiste). Lopeta viivan piirto tuplaklikkaamalla. Voit siirtää taitepisteitä raahaamalla niitä hiirellä. Näin alue on jaettu kahteen alueeseen. Leikkauksen lopputulos on merkitty sinisellä. Voit vaihtaa toiseen alueeseen klikkaamalla sitä. Kun olet valinnut haluamasi osan alueesta, paina \"Valmis\". Nyt voit käyttää leikattua alueen osaa analyyseissasi."
                            }
                        }
                    }
                },
                "selectionTools": {
                    "title": "Valinta",
                    "description": "Valinta kohdistuu vain valittuun karttatasoon",
                    "button": {
                        "empty": "Poista valinnat"
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
                "options": [
                    {
                        "id": "oskari_analyse_buffer",
                        "label": "Vyöhyke",
                        "classForMethod": "buffer",
                        "selected": true,
                        "tooltip": "Vyöhyke-menetelmän avulla käyttäjä voi lisätä valittujen kohteiden ympärille haluamansa kokoiset vyöhykkeet ja käyttää niitä myöhemmin muiden analyysien pohjana."
                    },
                    {
                        "id": "oskari_analyse_aggregate",
                        "label": "Tunnuslukujen laskenta",
                        "classForPreview": "aggregate",
                        "tooltip": "Tunnuslukujen laskenta -menetelmän avulla käyttäjä voi laskea valitsemistaan kohteista tunnuslukuja, kuten keskiarvon ja lukumäärän.\nTietosuojatut kohteet eivät ole mukana laskennassa."
                    },
                    {
                        "id": "oskari_analyse_union",
                        "label": "Yhdiste",
                        "classForPreview": "union",
                        "tooltip": "Yhdiste-menetelmän avulla käyttäjä voi yhdistää valitsemansa kohteet yhdeksi kohteeksi."
                    },
                    {
                        "id": "oskari_analyse_clip",
                        "label": "Leikkaus",
                        "classForPreview": "clip",
                        "tooltip": "Leikkaus-menetelmän avulla käyttäjä voi leikata kohteita toisen karttatason kohteilla. Analyysin lopputulokseen otetaan mukaan ne leikattavan tason kohteet, jotka sisältyvät leikkaavan tason kohteiden alueisiin."
                    },
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Leikkaavien kohteiden suodatus",
                        "classForPreview": "intersect",
                        "tooltip": "Leikkaavien kohteiden suodatus -menetelmän avulla käyttäjä voi valita leikattavalta tasolta ne kohteet, jotka sisältyvät tai leikkaavat (sisältyvät osittain) leikkaavan tason kohteiden alueita. Käyttäjä voi itse valita, otetaanko mukaan ainoastaan sisältyvät vai myös leikkaavat kohteet."
                    },
                    {
                        "id": "oskari_analyse_layer_union",
                        "label": "Analyysitasojen yhdiste",
                        "classForPreview": "layer_union",
                        "tooltip": "Analyysitasojen yhdiste -menetelmän avulla käyttäjä voi yhdistää analyysitasoja, joilla on samat ominaisuustiedot."
                    },
                    {
                        "id": "oskari_analyse_areas_and_sectors",
                        "label": "Monivyöhyke",
                        "classForPreview": "areas_and_sectors",
                        "tooltip": "Monivyöhyke-menetelmän avulla käyttäjä voi muodostaa valitsemiensa kohteiden ympärille useita eri vyöhykkeitä. Käyttäjä voi itse määrittää vyöhykkeiden koon ja lukumäärän."
                    }, {
                        "id": "oskari_analyse_difference",
                        "label": "Muutoksen laskenta",
                        "classForPreview": "difference",
                        "tooltip": ""
                    }, {
                        "id": "oskari_analyse_spatial_join",
                        "label": "Yhdistäminen sijainnin perusteella",
                        "classForPreview": "spatial_join",
                        "tooltip": ""
                    }]
            },
            "aggregate": {
                "label": "Tunnusluku",
                "labelTooltip": "Tunnusluvut, jotka lasketaan kohteiden ominaisuustietojen perusteella.",
                "options": [
                    {
                        "id": "oskari_analyse_Count",
                        "label": "Kohteiden lukumäärä",
                        "selected": true
                    },
                    {
                        "id": "oskari_analyse_Sum",
                        "label": "Summa"
                    },
                    {
                        "id": "oskari_analyse_Min",
                        "label": "Pienin arvo"
                    },
                    {
                        "id": "oskari_analyse_Max",
                        "label": "Suurin arvo"
                    },
                    {
                        "id": "oskari_analyse_Average",
                        "label": "Keskiarvo"
                    },
                    {
                        "id": "oskari_analyse_StdDev",
                        "label": "Keskihajonta"
                    },
                    {
                        "id": "oskari_analyse_Median",
                        "label": "Mediaani"
                    },
                    {
                        "id": "oskari_analyse_NoDataCnt",
                        "label": "Tietosuojattujen kohteiden lukumäärä"
                    }
                ],
                "attribute": "Valitse ominaisuustieto",
                "footer" : "Tietosuojatut kohteet eivät ole mukana laskennassa"
            },
            "buffer_size": {
                "label": "Vyöhykkeen koko",
                "labelTooltip": "Vyöhykkeen koko metreinä tai kilometreinä.",
                "tooltip": "Anna vyöhykkeen koko."
            },
            "buffer_units": {
                "m": "metriä",
                "km": "kilometriä"
            },
            "analyse_name": {
                "label": "Analyysin nimi",
                "labelTooltip": "Analyysiä kuvaava nimi",
                "tooltip": "Anna analyysin nimi."
            },
            "settings": {
                "label": "Parametrit",
                "tooltip": "Anna parametrit analyysia varten. Parametrit riippuvat valitusta suodattimesta ja menetelmästä."
            },
            "showFeatureData" : "Avaa kohdetietotaulukko analyysin valmistuttua",
            "showValuesCheckbox" : "Näytä lasketut arvot tallentamatta tulosta",
            "featureDataPopup" : "Lasketut tunnusluvut",
            "intersect": {
                "target": "Leikattava taso",
                "targetLabelTooltip": "Analyysitaso, jonka kohteita leikataan leikkaavan tason kohteilla.",
                "label": "Leikkaava taso",
                "labelTooltip": "Analyysitaso, jonka kohteilla leikattavan tason kohteita leikataan."
            },
            "union": {
                "label": "Yhdistettävä taso"
            },
            "layer_union": {
                "label": "Yhdistettävät tasot",
                "labelTooltip": "Analyysitasot, joiden kohteet viedään samalle tasolle.",
                "notAnalyseLayer": "Valitse analyysitaso.",
                "noLayersAvailable": "Tasoja, joilla on samat ominaisuustiedot, ei löytynyt. Hae \"Valitse karttatasot\"-painikkeella analyysiin mukaan analyysitaso, jossa on samat ominaisuudet kuin nyt valitussa tasossa."
            },
            "areas_and_sectors": {
                "label" : "Vyöhykkeet ja sektorit",
                "labelTooltip": "Vyöhykkeiden koko metreinä tai kilometreinä sekä vyöhykkeiden ja sektorien lukumäärä.",
                "area_count": "Vyöhykkeiden lukumäärä",
                "area_count_tooltip": "Anna vyöhykkeiden lukumäärä.",
                "area_size": "Vyöhykkeiden koko",
                "area_size_tooltip": "Anna vyöhykkeiden koko.",
                "sector_count": "Sektoreiden lukumäärä",
                "sector_count_tooltip": "Anna sektoreiden lukumäärä."
            },
            "difference": {
                "firstLayer": "Aikaisempi ajankohta",
                "firstLayerTooltip": "Alkuperäiset tiedot sisältävä analyysitaso.",
                "firstLayerFieldTooltip": "Vertailtava ominaisuustieto ensimmäiseltä tasolta.",
                "secondLayer": "Myöhempi ajankohta",
                "secondLayerTooltip": "Muuttuneet tiedot sisältävä analyysitaso.",
                "secondLayerFieldTooltip": "Vertailtava ominaisuustieto toiselta tasolta.",
                "field": "Valitse ominaisuustieto",
                "keyField": "Yhdistävä ominaisuustieto",
                "keyFieldTooltip": "Ensimmäisen ja toisen tason kohteet yhdistävä ominaisuustieto, joka on yksikäsitteinen."
            },
            "spatial": {
                "label": "Lopputuloksen mukaan otettavat kohteet",
                "target": "Leikattava taso",
                "targetTooltip": "Analyysitaso, jolta valitaan kohteita leikkaavan tason kohteiden perusteella.",
                "intersectingLayer": "Leikkaava taso",
                "intersectingLayerTooltip": "Analyysitaso, jonka kohteiden perusteella leikattavalta tasolta valitaan kohteita.",
                "labelTooltipIntersect": "Analyysiin mukaan otettavat leikattavan tason kohteet. Leikkaavat kohteet ovat ainakin osittain leikkaavan tason kohteiden alueilla, sisältyvät kohteet ovat kokonaan.",
                "options": [
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Leikkaavat kohteet",
                        "selected": true
                    },
                    {
                        "id": "oskari_analyse_contains",
                        "label": "Sisältyvät kohteet"
                    }
                ]
            },
            "spatial_join": {
                "firstLayer": "Ensimmäinen taso",
                "firstLayerTooltip": "Ensimmäinen yhdistettävä taso, jolta ominaisuustiedot haetaan.",
                "firstLayerFieldTooltip": "Ensimmäisen tason ominaisuustiedot, jotka otetaan analyysiin mukaan. Valitse enintään 10 ominaisuustietoa.",
                "secondLayer": "Toinen taso",
                "secondLayerTooltip": "Toinen yhdistettävä taso, jolta ominaisuustiedot haetaan.",
                "secondLayerFieldTooltip": "Toisen tason ominaisuustiedot, jotka otetaan lopputulokseen mukaan. Valitse enintään 10 ominaisuustietoa.",
                "mode": "Analyysimenetelmän tyyppi",
                "modeTooltip": "Valitse haluatko käyttää analyysissä tunnuslukujen laskentaa",
                "normalMode": "Tavallinen menetelmä",
                "aggregateMode": "Tunnuslukujen laskenta"
            },
            "params": {
                "label": "Lopputulokseen mukaan otettavat ominaisuustiedot",
                "aggreLabel": "Ominaisuustiedot joille tunnusluvut lasketaan",
                "aggreLabelTooltip": "Ominaisuustiedot, jotka otetaan analyysiin mukaan. Valitse enintään 10 ominaisuustietoa.",
                "labelTooltip": "Ominaisuustiedot, jotka otetaan analyysiin mukaan. Valitse enintään 10 ominaisuustietoa.",
                "tooltip": "",
                "options": [
                    {
                        "id": "oskari_analyse_all",
                        "selected": true,
                        "label": "Kaikki"
                    },
                    {
                        "id": "oskari_analyse_none",
                        "label": "Ei mitään"
                    },
                    {
                        "id": "oskari_analyse_select",
                        "label": "Valitse listalta"
                    }
                ]
            },
            "output": {
                "label": "Ulkoasu",
                "color_label": "Kohteiden esitystapa",
                "colorset_tooltip": "Valitse esitystavat geometrialtaan eri tyyppisille kohteille.",
                "tooltip": "Valitse analyysin lopputuloksen esittämiseen sopiva esitystapa kohteille.",
                "random_color_label": "Satunnaiset värit"
            },
            "buttons": {
                "save": "Tallenna ja lopeta",
                "analyse": "Tee analyysi",
                "data": "Lisää karttatasoja"
            },
            "filter": {
                "title": "Suodatus",
                "description": "Suodatus tasolle:",
                "cancelButton": "Poistu",
                "clearButton": "Tyhjennä valinnat",
                "refreshButton": "Päivitä suodatin",
                "addFilter": "Lisää uusi suodatin.",
                "removeFilter": "Poista suodatin.",
                "content": {
                    "title": "Aluerajaus"
                },
                "bbox": {
                    "on": "Ota mukaan vain kartalla näkyvät kohteet.",
                    "off": "Ota mukaan kaikki kohteet."
                },
                "clickedFeatures": {
                    "clickedFeaturesLabel": "Ota mukaan vain tasolta valitut kohteet.",
                    "filterByGeometryLabel": "Ota mukaan vain kohteet, jotka",
                    "filterByGeometryIntersect": "leikkaavat valittua kohdetta",
                    "filterByGeometryContains": "ovat valitun kohteen sisällä"
                },
                "values": {
                    "title": "Suodata kohteet ominaisuustietojen perusteella",
                    "placeholders": {
                        "case-sensitive": "Kirjainkoko vaikuttaa valintoihin.",
                        "attribute": "Ominaisuustieto",
                        "boolean": "Looginen operaattori",
                        "operator": "Operaattori",
                        "attribute-value": "Arvo"
                    },
                    "info": {
                        "bboxOff":"Ilman maantieteellistä rajausta analyysi kohdistuu koko aineistoon. Lisää vähintään yksi ominaisuustietojen mukaan tehtävä suodatus.",
                        "filterByGeometrySelected":"Voit suodattaa ominaisuustiedoilla vain, jos et käytä valittujen kohteiden suodatusta"
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
                    "attribute_missing": "Ominaisuustieto puuttuu.",
                    "operator_missing": "Operaattori puuttuu.",
                    "value_missing": "Arvo puuttuu.",
                    "boolean_operator_missing": "Looginen operaattori puuttuu.",
                    "bbox_selected_with_no_properties":"Ilman maantieteellistä rajausta analyysi kohdistuu koko aineistoon.<br/> 1) Lisää ominaisuustietosuodatin tai<br/> 2) Käytä kartalla näkyviä kohteita."
                }
            },
            "help": "Ohje",
            "success": {
                "layerAdded": {
                    "title": "Analyysi onnistui.",
                    "message": "Lisätty uusi analyysitaso: {layer}"
                }
            },
            "error": {
                "title": "Virhe",
                "invalidSetup": "Annetuissa parametreissä on virheitä.",
                "noParameters": "Analyysissa käytettävää aineistoa ja menetelmän parametrejä ei ole valittu.",
                "noLayer": "Analyysissa käytettävää aineistoa ei ole valittu.",
                "noAnalyseUnionLayer": "Analyysia varten tarvitaan vähintään kaksi analyysitasoa. Valitse toinen analyysitaso.",
                "invalidMethod": "Tuntematon analyysimenetelmä:",
                "bufferSize": "Vyöhykkeen koko on virheellinen.",
                "illegalCharacters": "Anna vyöhykkeen koko numeroina.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Analyysin tallennus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayersFailed": "Analyysitasojen lataus epäonnistui. Yritä myöhemmin uudelleen.",
                "loadLayerTypesFailed": "Analyysitasojen kohdetietotyyppien haku epäonnistui. Yritä myöhemmin uudelleen.",
                "Analyse_parameter_missing": "Parametrit puuttuvat. Anna analyysissä tarvittavat parametrit.",
                "Unable_to_parse_analysis": "Annetut parametrit ovat virheellisiä. Anna parametrit uudelleen.",
                "Unable_to_get_WPS_features": "Analyysin WPS input kohteiden haku epäonnistui.",
                "WPS_execute_returns_Exception": "Analyysin prosessointi epäonnistui. Yritä myöhemmin uudelleen.",
                "WPS_execute_returns_no_features": "Analyysi ei palauta yhtään kohdetta.",
                "Unable_to_process_aggregate_union": "Tunnuslukujen laskenta yhdisteelle epäonnistui. Yritä myöhemmin uudelleen.",
                "Unable_to_get_features_for_union": "Koosteen input kohteiden haku epäonnistui.",
                "Unable_to_store_analysis_data": "Analyysin tallennus epäonnistui. Yritä myöhemmin uudelleen.",
                "Unable_to_get_analysisLayer_data": "Analyysitasojen tietojen lukeminen epäonnistui. Yritä myöhemmin uudelleen.",
                "timeout": "Analyysi epäonnistui aikakatkaisun vuoksi. Yritä myöhemmin uudelleen.",
                "error": "Analyysi epäonnistui. Yritä myöhemmin uudelleen.",
                "parsererror": "Analyysin lopputuloksessa on virheitä."
            },
            "infos": {
                "title": "Tiedoksi",
                "layer": "Tason",
                "over10": "kohteilla on yli 10 ominaisuustietoa. Valitse analyysiin mukaan  korkeintaan 10 ominaisuustietoa. Lista ominaisuustiedoista löytyy Parametrit-valikosta valittuasi analyysimenetelmän."
            }
        },
        "StartView": {
            "text": "Analyysi-toiminnon avulla voit tehdä valitsemillesi kohdetietoja sisältäville paikkatietotuotteille tilastollisia analyyseja. Tallentamalla analyysin voit käyttää sitä myös myöhemmin.",
            "layersWithFeatures": "Analyysissä voi tehdä valintoja vain yhdeltä tasolta kerrallaan. Valitse miltä tasolta haluat tehdä valinnat. Huom! Muut valinnat poistetaan.",
            "infoseen": {
                "label": "Älä näytä tätä viestiä uudelleen."
            },
            "buttons": {
                "continue": "Aloita analyysi",
                "cancel": "Poistu"
            }
        },
        "categoryform": {
            "name": {
                "label": "Nimi",
                "placeholder": "Anna karttatasolle nimi."
            },
            "drawing": {
                "label": "NOT TRANSLATED",
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
                    "linecolor": "Reunaviivan väri",
                    "size": "Reunaviivan paksuus"
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
                "delete": "Poista"
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
                "deletedMsg": "Karttataso on poistettu."
            },
            "error": {
                "title": "Virhe!",
                "generic": "Järjestelmässä tapahtui virhe. Yritä myöhemmin uudelleen."
            }
        }
    }
}
);