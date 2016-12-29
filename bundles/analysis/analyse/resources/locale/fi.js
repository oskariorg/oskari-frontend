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
            "text": "Analyysi-toiminnon avulla voit tehdä yksinkertaisia paikkatietoanalyyseja kohdetietoja sisältäville karttatasoille. Toiminto edellyttää kirjautumista.",
            "signup": "Kirjaudu sisään",
            "signupUrl": "/web/fi/login",
            "register": "Rekisteröidy",
            "registerUrl": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "AnalyseView": {
            "title": "Analyysi <font color=red>(BETA)</font>",
            "content": {
                "label": "Karttatasot",
                "drawToolsLabel": "Kohdetyökalut",
                "tooltip": "Valitse yksi aineisto analyysin pohjaksi. Lisää karttatasoja voit hakea \"Lisää karttatasoja\"-painikkeella aukeavalta listalta. Kohdista karttanäkymä haluamaasi paikkaan joko siirtämällä karttaa hiirellä tai klikkaamalla \"Hae paikkahaulla\" ja hakemalla haluamasi paikka.",
                "drawToolsTooltip": "Lisää väliaikainen kohde, leikkaa olemassa olevaa kohdetta tai valitse kohteita rajaamalla niitä piirtämilläsi kuvioilla.",
                "features": {
                    "title": "Lisäys",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "tooltips": {
                        "point": "Lisää väliaikainen piste käytettäväksi analyysin pohjana.",
                        "line": "Lisää väliaikainen piste käytettäväksi analyysin pohjana.",
                        "area": "Lisää väliaikainen piste käytettäväksi analyysin pohjana."
                    },
                    "modes": {
                        "area": "Väliaikainen alue",
                        "line": "Väliaikainen viiva",
                        "point": "Väliaikainen piste"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Lisää väliaikainen piste",
                        "add": "Piirrä piste (tai pisteitä). Klikkaa haluamaasi sijaintia. Paina Valmis-painiketta. Tämän jälkeen piste näkyy Karttatasot-listalla nimellä Väliaikainen piste x, jossa x on pisteen järjestysnumero. Poista pisteet painamalla Peruuta -painiketta."
                    },
                    "line": {
                        "title": "Lisää väliaikainen viiva",
                        "add": "Piirrä viiva (tai viivoja). Klikkaa alkupistettä ja taitepisteitä. Lopuksi kaksoisklikkaa päätepistettä. Paina Valmis-painiketta. Tämän jälkeen viiva näkyy Karttatasot-listalla nimellä Väliaikainen viiva x, jossa x on viivan järjestysnumero. Poista viivat painamalla Peruuta -painiketta."
                    },
                    "area": {
                        "title": "Lisää väliaikainen alue",
                        "add": "Piirrä alue (tai alueita). Klikkaa kulmapisteitä. Lopuksi kaksoisklikkaa päätepistettä. Voit tehdä alueeseen reiällä pitämällä pohjassa ALT-näppäintä. Paina Valmis-painiketta. Tämän jälkeen alue näkyy Karttatasot-listalla nimellä Väliaikainen alue x, jossa x on alueen järjestysnumero. Poista alueet painamalla Peruuta -painiketta."
                    }
                },
                "drawFilter": {
                    "title": "Leikkaus",
                    "buttons": {
                        "cancel": "Peruuta",
                        "finish": "Valmis"
                    },
                    "tooltip": {
                        "point": "Leikkaa valittua viivaa pisteellä.",
                        "line": "Leikkaa valittua aluetta viivalla.",
                        "edit": "Leikkaa valittua aluetta toisella alueella.",
                        "remove": "Poista leikkaus"
                    },
                    "dialog": {
                        "modes": {
                            "point": {
                                "title": "Leikkaa viivaa pisteellä",
                                "message": "Leikkaa osa viivasta. Leikkauspisteet on merkitty punaisilla vinoneliöillä. Jos viiva muodostaa ympyrän, pisteet ovat päällekkäin. Siirrä pisteitä raahaamalla niitä hiirellä.  Leikkauksen lopputulos on merkitty punaisella. Lopuksi paina Valmis-painiketta."
                            },
                            "line": {
                                "title": "Leikkaa aluetta viivalla",
                                "message": "Piirrä viiva leikattavan alueen yli. Klikkaa viivan taitepisteitä (mukaan lukien alkupiste) ja lopuksi kaksoisklikkaa päätepistettä. Siirrä taitepisteitä raahaamalla niitä hiirellä. Leikkauksen lopputulos on merkitty sinisellä. Jos haluat vaihtaa toiseen alueeseen, klikkaa sitä. Lopuksi paina Valmis-painiketta."
                            },
                            "edit": {
                                "title": "Leikkaa aluetta toisella alueella",
                                "message": "Piirrä alue leikattavan alueen päälle. Klikkaa alueen kulmapisteitä ja lopuksi kaksoisklikkaamalla viimeistä kulmapistettä. Siirrä kulmapisteitä raahaamalla niitä hiirellä. Leikkauksen lopputulos on merkitty sinisellä. Jos haluat vaihtaa toiseen alueeseen, klikkaa sitä. Lopuksi paina Valmis-painiketta."
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
                    "title": "Hae kohteita",
                    "resultLink": "Käytä analyysissa."
                }
            },
            "method": {
                "label": "Menetelmä",
                "tooltip": "Valitse menetelmä, jota käytät analyysissa. Kunkin menetelmän kuvauksen voit lukea menetelmän kohdalta i-painikkeella.",
                "options": [
                    {
                        "id": "oskari_analyse_buffer",
                        "label": "Vyöhyke",
                        "classForMethod": "buffer",
                        "selected": true,
                        "tooltip": "Lisää vyöhyke valittujen kohteiden ympärille. Voit käyttää vyöhykkeitä muiden analyysien pohjana."
                    },
                    {
                        "id": "oskari_analyse_aggregate",
                        "label": "Tunnuslukujen laskenta",
                        "classForPreview": "aggregate",
                        "tooltip": "Laske tunnusluvut valituille kohteille. Tietosuojatut kohteet eivät ole mukana laskennassa."
                    },
                    {
                        "id": "oskari_analyse_union",
                        "label": "Yhdiste",
                        "classForPreview": "union",
                        "tooltip": "Yhdistä valitut kohteet yhdeksi kohteeksi."
                    },
                    {
                        "id": "oskari_analyse_clip",
                        "label": "Leikkaus",
                        "classForPreview": "clip",
                        "tooltip": "Leikkaa kohteita toisen tason kohteilla. Lopputulokseen otetaan mukaan ne kohteet, jotka ovat leikkaavan tason kohteiden sisäpuolella."
                    },
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Leikkaavien kohteiden suodatus",
                        "classForPreview": "intersect",
                        "tooltip": "Valitse leikattavalta tasolta ne kohteet, jotka ovat osittain tai kokonaan leikkaavan tason kohteiden sisällä."
                    },
                    {
                        "id": "oskari_analyse_layer_union",
                        "label": "Analyysitasojen yhdiste",
                        "classForPreview": "layer_union",
                        "tooltip": "Yhdistä valitut tasot. Tasoilla on oltavat samat ominaisuustiedot."
                    },
                    {
                        "id": "oskari_analyse_areas_and_sectors",
                        "label": "Vyöhykkeet ja sektorit",
                        "classForPreview": "areas_and_sectors",
                        "tooltip": "Lisää useita vyöhykkeitä ja sektoreita valittujen kohteiden ympärille."
                    },
                    {
                        "id": "oskari_analyse_difference",
                        "label": "Muutoksen laskenta",
                        "classForPreview": "difference",
                        "tooltip": "Laske muutos kahden eri karttatason välillä. Karttatasot esittävät samaa aineistoa eri aikoina."
                    },
                    {
                        "id": "oskari_analyse_spatial_join",
                        "label": "Yhdistäminen sijainnin perusteella",
                        "classForPreview": "spatial_join",
                        "tooltip": "Yhdistä kohdetason ominaisuustiedot lähdetason ominaisuustietoihin kohteiden sijainnin perusteella."
                    }
                ]
            },
            "aggregate": {
                "label": "Tunnusluku",
                "labelTooltip": "Valitse tunnusluvut, jotka lasketaan valittujen ominaisuustietojen perusteella.",
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
                "footer": "Tietosuojatut kohteet eivät ole mukana laskennassa.",
                "aggregateAdditionalInfo": "Huom! Olet valinnut tekstiä sisältäviä ominaisuustietoja. Niille voi laskea ainoastaan kohteiden lukumäärän. Jos kohteiden lukumäärä ei ole valittuna, tekstiä sisältäviä ominaisuustietoja ei oteta mukaan analyysin lopputulokseen."
            },
            "buffer_size": {
                "label": "Vyöhykkeen koko",
                "labelTooltip": "Anna vyöhykkeen koko metreinä tai kilometreinä.",
                "tooltip": "Vyöhykkeen koko"
            },
            "buffer_units": {
                "m": "metriä",
                "km": "kilometriä"
            },
            "analyse_name": {
                "label": "Analyysin nimi",
                "labelTooltip": "Anna analyysille lopputulosta kuvaava nimi.",
                "tooltip": "Analyysin nimi"
            },
            "settings": {
                "label": "Parametrit",
                "tooltip": "Anna analyysille tarvittavat parametrit. Parametrit vaihtelevat valitun menetelmän ja suodatuksen mukaan."
            },
            "showFeatureData": "Avaa kohdetietotaulukko analyysin valmistuttua.",
            "showValuesCheckbox": "Näytä tunnusluvut tallentamatta tulosta.",
            "intersect": {
                "target": "Leikattava taso",
                "targetLabelTooltip": "Valitse taso, jonka kohteita leikataan leikkaavan tason kohteilla.",
                "label": "Leikkaava taso",
                "labelTooltip": "Valitse taso, jonka kohteilla leikataan leikattavan tason kohteita."
            },
            "union": {
                "label": "Yhdistettävä taso"
            },
            "layer_union": {
                "label": "Yhdistettävät tasot",
                "labelTooltip": "Valitse tasot, jotka yhdistetään. Tasojen kohteista muodostetaan yksi uusi taso.",
                "notAnalyseLayer": "Valittua tasoa ei voida käyttää analyysissa. Valitse toinen taso.",
                "noLayersAvailable": "Valituilla tasoilla ei ole samat ominaisuustiedot. Valitse tasot, joilla on samat ominaisuustiedot."
            },
            "areas_and_sectors": {
                "label": "Vyöhykkeet ja sektorit",
                "labelTooltip": "Määrittele vyöhykkeille koko ja lukumäärä sekä sektoreille lukumäärä.",
                "area_count": "Vyöhykkeiden lukumäärä",
                "area_count_tooltip": "Määrä välillä 0-12",
                "area_size": "Vyöhykkeiden koko",
                "area_size_tooltip": "Koko",
                "sector_count": "Sektorien lukumäärä",
                "sector_count_tooltip": "Määrä välillä 0-12"
            },
            "difference": {
                "firstLayer": "Aikaisempi ajankohta",
                "firstLayerTooltip": "Valitse taso, joka sisältää alkuperäiset tiedot.",
                "firstLayerFieldTooltip": "Valitse alkuperäiset tiedot sisältävältä tasolta ominaisuustieto, jonka tietoja verrataan muuttuneisiin tietoihin.",
                "secondLayer": "Myöhäisempi ajankohta",
                "secondLayerTooltip": "Valitse taso, joka sisältää muuttuneet tiedot.",
                "secondLayerFieldTooltip": "Valitse muuttuneet tiedot sisältävältä tasolta ominaisuustieto, jonka tietoja verrataan alkuperäisiin tietoihin.",
                "field": "Vertailtava ominaisuustieto",
                "keyField": "Yhdistävä ominaisuustieto",
                "keyFieldTooltip": "Valitse tasoja yhdistävä ominaisuustieto, joka määrittää yksiselitteisesti, mistä kohteesta on kyse."
            },
            "spatial": {
                "label": "Mukaan otettavat kohteet",
                "target": "Alkuperäinen taso",
                "targetTooltip": "Valitse taso, jolta valitaan ne kohteet, jotka leikkaavat leikkaavan tason kohteita.",
                "intersectingLayer": "Leikkaava taso",
                "intersectingLayerTooltip": "Valitse taso, jonka kohteiden perusteella valitaan kohteita alkuperäiseltä tasolta.",
                "labelTooltipIntersect": "Valitse, otetaanko mukaan alkuperäisen tason kohteet, jotka leikkaavat leikkaavan tason kohteita vai ovat kokonaan kohteiden sisäpuolella.",
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
                "firstLayer": "Kohdetaso",
                "firstLayerTooltip": "Valitse kohdetaso eli taso, jonka ominaisuustietoihin lähdetasolta haetut ominaisuustiedot yhdistetään.",
                "firstLayerFieldTooltip": "Kohdetasolta mukaan otettavat ominaisuustiedot",
                "secondLayer": "Lähdetaso",
                "secondLayerTooltip": "Valitse lähdetaso eli taso, jonka ominaisuustiedoista yhdistettävät tiedot haetaan kohdetasolle.",
                "secondLayerFieldTooltip": "Lähdetasolta mukaan otettavat ominaisuustiedot",
                "mode": "Analyysimenetelmän tyyppi",
                "modeTooltip": "Valitse haluatko käyttää yhdistämisessä tunnuslukuja.",
                "normalMode": "Yhdistäminen sijainnin perusteella",
                "aggregateMode": "Tunnuslukujen laskenta",
                "backend_locale": [
                    {
                        "id": "count",
                        "label": "Kohteiden lukumäärä"
                    },
                    {
                        "id": "sum",
                        "label": "Summa"
                    },
                    {
                        "id": "min",
                        "label": "Pienin arvo"
                    },
                    {
                        "id": "max",
                        "label": "Suurin arvo"
                    },
                    {
                        "id": "avg",
                        "label": "Keskiarvo"
                    },
                    {
                        "id": "stddev",
                        "label": "Keskihajonta"
                    }
                ]
            },
            "params": {
                "label": "Mukaan otettavat ominaisuustiedot",
                "aggreLabel": "Ominaisuustiedot joille tunnusluvut lasketaan",
                "aggreLabelTooltip": "Valitse enintään 10 ominaisuustietoa, joille lasketaan tunnusluvut.",
                "labelTooltip": "Valitse enintään 10 ominaisuustietoa, jotka otetaan mukaan lopputulokseen.",
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
                "label": "Kohteiden esitystapa",
                "color_label": "Valitse tyyli",
                "colorset_tooltip": "Valitse tyyli pisteille, viivoille ja alueille.",
                "tooltip": "Määrittele esitystapa lopputuloksessa näytettäville pisteille, viivoille ja alueille.",
                "random_color_label": "Satunnaiset värit"
            },
            "buttons": {
                "save": "Tallenna ja lopeta",
                "analyse": "Tee analyysi",
                "data": "Lisää karttatasoja"
            },
            "help": "Ohje",
            "success": {
                "layerAdded": {
                    "title": "Analyysi onnistui",
                    "message": "Analyysi on tehty. Karttatasoihin on lisätty uusi taso: {layer}. Myöhemmin löydät analyysin Omat tiedot -valikon Analyysit-välilehdeltä."
                }
            },
            "error": {
                "title": "Virhe",
                "invalidSetup": "Annetuissa parametreissa on virheitä. Korjaa parametrit ja yritä uudelleen.",
                "noParameters": "Karttatasoa tai parametrejä ei ole määritelty. Valitse taso, jolle analyysi tehdään, ja menetelmässä käytettävät parametrit. Tämän jälkeen yritä uudelleen.",
                "noLayer": "Karttatasoa ei ole määritelty. Valitse taso, jolle analyysi tehdään, ja yritä uudelleen.",
                "noAnalyseUnionLayer": "Analyysitasojen yhdisteeseen tarvitaaan vähintään kaksi karttatasoa. Valitse toinen karttataso.",
                "invalidMethod": "Analyysimenetelmä on tuntematon. Valitse olemassa oleva menetelmä.",
                "bufferSize": "Vyöhykkeen koko on virheellinen. Korjaa vyöhykkeen koko ja yritä uudelleen.",
                "illegalCharacters": "Vyöhykkeen koossa on kiellettyjä merkkejä. Anna vyöhykkeen koko numeroina ja yritä uudelleen.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Analyysin tallennus epäonnistui.",
                "loadLayersFailed": "Analyysissa tarvittavia karttatasoja ei voitu hakea.",
                "loadLayerTypesFailed": "Analyysissa tarvittavia kohdetietoja ei voitu hakea karttatasolta.",
                "Analyse_parameter_missing": "Analyysissa tarvittavat parametrit puuttuvat. Anna parametrit ja yritä uudelleen.",
                "Unable_to_parse_analysis": "Annetuissa parametreissa on virheitä. Korjaa parametrit ja yritä uudelleen.",
                "Unable_to_get_WPS_features": "Analyysin lähtötietoja ei voitu hakea.",
                "WPS_execute_returns_Exception": "Analyysia ei voitu suorittaa.",
                "WPS_execute_returns_no_features": "Analyysin lopputuloksessa ei ole yhtään kohdetta.",
                "Unable_to_process_aggregate_union": "Yhdisteelle ei voitu laskea tunnuslukuja.",
                "Unable_to_get_features_for_union": "Lähtötietoja tunnuslukujen laskennalle ei voitu hakea.",
                "Unable_to_store_analysis_data": "Analyysin lopputulosta ei voitu tallentaa.",
                "Unable_to_get_analysisLayer_data": "Analyysin lähtötietoja ei voitu hakea.",
                "timeout": "Analyysin laskenta keskeytyi aikakatkaisun vuoksi.",
                "error": "Analyysi epäonnistui.",
                "parsererror": "Analyysin lopputuloksessa on virheitä."
            },
            "infos": {
                "title": "Liikaa ominaisuustietoja",
                "layer": "Tason",
                "over10": "kohteilla on yli 10 ominaisuustietoa. Valitse analyysin lopputulokseen enintään 10 ominaisuustietoa. Valinnan voit tehdä parametrien valinnan yhteydessä."
            },
            "aggregatePopup": {
                "title": "Analyysin tulokset",
                "property": "Ominaisuus",
                "store": "Tallenna",
                "store_tooltip": "Säilytä analyysin tulosgeometria väliaikaisena kohteena",
                "close": "Sulje"
            }
        },
        "StartView": {
            "text": "Analyysi-toiminnon avulla voit tehdä yksinkertaisia paikkatietoanalyyseja kohdetietoja sisältäville karttatasoille. Valmiit analyysit löytyvät Omat tiedot -valikon Analyysit-välilehdeltä.",
            "layersWithFeatures": "Analyysi-toiminnossa voit tehdä valintoja vain yhdelle valitsemallesi karttatasolle. Valitse, miltä tasolta haluat tehdä valinnat. Muiden tasojen valinnat poistetaan.",
            "infoseen": {
                "label": "Älä näytä tätä viestiä uudelleen."
            },
            "buttons": {
                "continue": "Siirry analyysiin",
                "cancel": "Poistu"
            }
        },
        "categoryform": {
            "name": {
                "label": "Nimi",
                "placeholder": "Anna karttatasolle nimi."
            },
            "drawing": {
                "label": "",
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
                "deletedMsg": "Karttataso on poistettu"
            },
            "error": {
                "title": "Virhe",
                "generic": "Järjestelmässä tapahtui virhe."
            }
        }
    }
});
