Oskari.registerLocalization({
    'lang': 'fi',
    'key': 'StatsGrid',
    'value': {
        'tile': {
            'title': 'Teemakartat',
            'search': 'Aineistohaku',
            'grid': 'Taulukko',
            'diagram': 'Pylväsdiagrammi'
        },
        'flyout': {
            'title': 'Teemakartat'
        },
        'dataProviderInfoTitle': 'Indikaattorit',
        'layerTool': {
            'tooltip': 'Siirry teemakarttoihin',
            'title': 'Teemakartat'
        },
        'publisher': {
            "label": "Teemakartat",
            "tooltip": "Näytä tilastotiedot taulukossa kartan yhteydessä.",
            "grid": "Näytä tilastotiedot taulukossa",
            "allowClassification": "Salli luokittelu",
            "transparent": "Aseta luokittelun tausta läpinäkyväksi",
            "diagram": "Näytä pylväsdiagrammi",
            "classification": "Salli luokittelun piilottaminen",
            "series": "Salli sarjatoistimen piilottaminen",
            "statistics": 'Avaa aineistohaku'
        },
        'panels': {
            'newSearch': {
                'title': 'AINEISTOHAKU',
                'seriesTitle': 'Aikasarja',
                'datasourceTitle': 'Tietolähde',
                'indicatorTitle': 'Indikaattori',
                'regionsetTitle': 'Aluejakorajaus (valinnainen)',
                'seriesLabel': 'Hae aikasarjana',
                'selectDatasourcePlaceholder': 'Valitse tietolähde',
                'selectIndicatorPlaceholder': 'Valitse aineisto',
                'selectRegionsetPlaceholder': 'Valitse aluejako',
                'noResults': 'Yhtään hakutulosta ei löytynyt, haulla',
                'refineSearchLabel': 'Tarkenna tarkasteltavan aineiston sisältöä',
                'refineSearchTooltip1': 'Saat näkyviin vaihtoehtoja kun olet ensin valinnut aineiston tarjoajan ja aineiston.',
                'refineSearchTooltip2': '',
                'addButtonTitle': 'Hae',
                'clearButtonTitle': 'Tyhjennä',
                'defaultPlaceholder': 'Valitse arvo',
                'selectionValues': {
                    'sex': {
                        'placeholder': 'Valitse sukupuoli',
                        'male': 'Miehet',
                        'female': 'Naiset',
                        'total': 'Yhteensä'
                    },
                    'year': {
                        'placeholder': 'Valitse vuosi'
                    },
                    'regionset': {
                        'placeholder': 'Valitse aluejako'
                    }
                },
                'noRegionset': 'Ei aluevalintaa'
            }
        },
        'statsgrid': {
            'title': 'HAETTU AINEISTO',
            'noResults': 'Ei valittuja aineistoja',
            'noValues': 'Ei arvoja valitulla aineistolla',
            'areaSelection': {
                'title': 'ALUEJAKO'
            },
            'orderBy': 'Lajittele',
            'orderByAscending': 'Lajittele nousevasti',
            'orderByDescending': 'Lajittele laskevasti',
            'removeSource': 'Poista aineisto',
            'noIndicators': 'Aloita teemakartan käyttö lisäämällä kartalle indikaattori.'
        },
        'series': {
            'speed': {
                'label': 'Animaationopeus',
                'fast': 'Nopea',
                'normal': 'Normaali',
                'slow': 'Hidas'
            }
        },
        'diagram': {
            'title': 'Pylväsdiagrammi',
            'noValue': 'Ei arvoa',
            'sort': {
                'desc': 'Järjestys',
                'name-ascending': 'Nimen mukaan nouseva',
                'name-descending': 'Nimen mukaan laskeva',
                'value-ascending': 'Arvon mukaan nouseva',
                'value-descending': 'Arvon mukaan laskeva'
            }
        },
        'parameters': {
            'sex': 'Sukupuoli',
            'year': 'Vuosi',
            'Vuosi': 'Vuosi',
            'regionset': 'Aluejako',
            'from': 'alkaen',
            'to': 'päättyen',
            'value': 'Arvo',
            'region': 'Alue'
        },
        'classify': {
            'classify': 'Luokittelu',
            'labels': {
                'method': 'Luokittelutapa',
                'count': 'Luokkajako',
                'mode': 'Luokkarajat',
                'mapStyle': 'Kartan tyyli',
                'type': 'Jakauma',
                'reverseColors': 'Käännä värit',
                'color': 'Väri',
                'colorset': 'Värit',
                'pointSize': 'Pisteen koko',
                'transparency': 'Läpinäkyvyys',
                'showValues': 'Näytä arvot',
                'fractionDigits': 'Desimaalien lukumäärä'
            },
            'methods': {
                'jenks': 'Luonnolliset välit',
                'quantile': 'Kvantiilit',
                'equal': 'Tasavälit',
                'manual': 'Oma luokittelu'
            },
            'manual': 'Luokittelu käsin',
            'manualPlaceholder': 'Erota luvut pilkuilla.',
            'manualRangeError': 'Luokkarajat ovat virheellisiä. Luokkarajojen on oltava välillä {min} - {max}. Erota luvut toisistaan pilkulla. Käytä desimaalierottimena pistettä. Korjaa luokkarajat ja yritä uudelleen.',
            'nanError': 'Antamasi arvo ei ole luku. Korjaa arvo ja yritä uudelleen. Käytä desimaalierottimena pistettä.',
            'infoTitle': 'Luokittelu käsin',
            'info': 'Anna luokkarajat pilkulla erotettuina lukuina. Käytä desimaalierottimena pistettä. Esimerkiksi syöttämällä "0, 10.5, 24, 30.2, 57, 73.1" saat viisi luokkaa, joiden arvot ovat välillä "0-10,5", "10,5-24", "24-30,2", "30,2-57" ja "57-73,1". Indikaattorin arvoja, jotka ovat pienempiä kuin alin luokkaraja (esimerkissä 0) tai suurempia kuin ylin luokkaraja (73,1), ei näytetä kartalla. Luokkarajojen on oltava indikaattorin pienimmän ja suurimman arvon välillä.',
            'modes': {
                'distinct': 'Jatkuva',
                'discontinuous': 'Epäjatkuva'
            },
            'edit': {
                'title': 'Muokkaa luokittelua',
                'open': 'Avaa luokittelun muokkaus',
                'close': 'Sulje luokittelun muokkaus'
            },
            'classifyFieldsTitle': 'Luokitteluarvot',
            'mapStyles': {
                'choropleth': 'Koropleettikartta',
                'points': 'Pisteet'
            },
            'pointSizes': {
                'min': 'Minimi',
                'max': 'Maksimi'
            },
            'types': {
                'seq': 'Kvantitatiivinen',
                'qual': 'Kvalitatiivinen',
                'div': 'Jakautuva'
            }
        },
        'errors': {
            'title': 'Virhe',
            'indicatorListError': 'Aineiston tarjoajien haussa tapahtui virhe.',
            'indicatorListIsEmpty': 'Aineiston tarjoajan aineistolista on tyhjä.',
            'indicatorMetadataError': 'Aineiston valintojen haussa tapahtui virhe.',
            'indicatorMetadataIsEmpty': 'Aineiston valinnat on tyhjä.',
            'regionsetsIsEmpty': 'Aluevalintoja ei saatu valitulle aineistolle.',
            'regionsDataError': 'Alueen arvojen haussa tapahtui virhe.',
            'regionsDataIsEmpty': 'Valitulle aineistolle ei saatu alueiden arvoja.',
            'datasourceIsEmpty': 'Tietolähde on tyhjä.',
            'cannotDisplayAsSeries': 'Indikaattoria ei voida tarkastella sarjana',
            'noDataForIndicators': 'Palvelusta ei saatu tietoja {indicators, plural, one {indikaattorille} other {indikaattoreille}}',
            'onlyPartialDataForIndicators': 'Palvelusta ei saatu kaikkia tietoja {indicators, plural, one {indikaattorille} other {indikaattoreille}}',
            'notAllowedRegionset': 'Aineistoa ei ole saatavilla valitulle aluejaolle.',
            'notAllowedSelection': 'Aineistoa ei ole saatavilla valinnoille.',
            'noActiveLegend': 'Ei valittuna aineistoa, valitse aineisto nähdäksesi kartan luokittelun.',
            'noEnough': 'Aineisto on liian pieni luokittelun muodostamiseksi, kokeile eri aineistoa tai muuta rajauksia.',
            'noData': 'Aineistoa ei ole saatavilla valitsemaltasi ajankohdalta',
            'cannotCreateLegend': 'Legendaa ei saada tehtyä valitsemillasi arvoilla, kokeile eri arvoilla.'
        },
        'missing': {
            'regionsetName': 'Tuntematon',
            'indicator': 'Tuntematon indikaattori'
        },
        'layer': {
            'name': 'Teemakartan aluejako',
            'inspireName': 'Teemakartta',
            'organizationName': 'Teemakartta'
        },
        'tab': {
            'title': 'Indikaattorit',
            'confirmDelete': 'Haluatko poistaa indikaattorin "{name}"?',
            'grid': {
                'name': 'Nimi',
                'actions': 'Toiminnot',
                'createDate': 'Luontiaika',
                'updateDate': 'Muokkausaika'
            }
        },
        'userIndicators': {
            'title': 'Omat indikaattorit',
            'add': 'Lisää uusi indikaattori',
            'edit': 'Muokkaa indikaattoria',
            'notLoggedInWarning': 'Kirjautumattomana oman indikaattorin tiedot ovat käytettävissä vain tämän session ajan. Kirjaudu sisään tallentaaksesi indikaattori.',
            'info': {
                'title': 'Indikaattorin tiedot',
                'name': 'Nimi',
                'description': 'Kuvaus',
                'source': 'Lähde'
            },
            'datasets': {
                'title': 'Tilastotieto',
                'dataset': 'Aineisto',
                'noIndicator': 'Tallenna indikaattorin tiedot lisätäksesi aineistoja.',
                'noDatasets': 'Indikaattorilla ei ole tallennettuja aineistoja.'
            },
            'import': {
                'title': 'Tuo leikepöydältä',
                'placeholder': 'Kopioi tähän indikaattorin tiedot. Yhdellä rivillä on alue ja sitä vastaava arvo. Alue merkitään joko nimellä tai tunnisteella. Erottimeksi puolipiste. Tiedot voivat olla seuraavissa muodoissa: \n' +
                'Esimerkki 1: Helsinki;1234 \n' +
                'Esimerkki 2: 011;5678'
            },
            'success': {
                'indicatorSave': 'Indikaattorin tiedot tallennettu',
                'indicatorDelete': 'Indikaattorin tiedot poistettu',
                'datasetSave': 'Aineisto tallennettu',
                'datasetDelete': 'Aineisto poistettu'
            },
            'error': {
                'indicatorSave': 'Indikaattorin tallennus epäonnistui',
                'indicatorDelete': 'Indikaattorin poisto epäonnistui',
                'indicatorNotfound': 'Indikaattoria ei löytynyt',
                'datasetSave': 'Virhe tallennetaessa aineistoa',
                'datasetDelete': 'Virhe poistaessa aineistoa'
            },
            'validate': {
                'name': 'Nimi kenttä ei voi olla tyhjä',
                'year': 'Vuosi kenttä ei voi olla tyhjä',
                'regionset': 'Aluejako ei voi olla tyhjä',
                'noData': 'Aineiston arvoja ei ole annettu',
                'invalidData': 'Aineistossa on virheellisiä arvoja'
            }
        },
        'indicatorList': {
            'title': 'Indikaattorit',
            'removeAll': 'Poista kaikki',
            'emptyMsg': 'Ei valittuja indikaattoreita'
        },
        'metadataPopup': {
            'open': 'Näytä {indicators, plural, one {indikaattorin kuvaus} other {indikaattorien kuvaukset}}',
            'title': '{indicators, plural, one {Indikaattorin kuvaus} other {Indikaattorien kuvaukset}}',
            'noMetadata': 'Palvelusta ei saatu {indicators, plural, one {indikaattorin kuvausta} other {indikaattorien kuvauksia}}.',
            'updated': 'Viimeksi päivitetty',
            'nextUpdate': 'Seuraava päivitys'
        }
    }
});
