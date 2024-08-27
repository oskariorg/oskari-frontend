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
        'layertools': {
            'table_icon': {
                'tooltip': 'Siirry teemakarttoihin',
                'title': 'Teemakartat'
            },
            'diagram_icon': {
                'tooltip': 'Näytä tiedot diagrammissa',
                'title': 'Diagrammi'
            },
            'statistics': {
                'tooltip': 'siirry teemakarttoihin',
                'title': 'Tilastot'
            }
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
        'legend': {
            'title': 'Luokittelu',
            'noActive': 'Ei valittuna aineistoa, valitse aineisto nähdäksesi kartan luokittelun.',
            'noEnough': 'Aineisto on liian pieni luokittelun muodostamiseksi, kokeile eri aineistoa tai muuta rajauksia.',
            'noData': 'Aineistoa ei ole saatavilla valitsemaltasi ajankohdalta',
            'cannotCreateLegend': 'Legendaa ei saada tehtyä valitsemillasi arvoilla, kokeile eri arvoilla.'
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
            'noValue': 'Ei arvoa'
        },
        'parameters': {
            'sex': 'Sukupuoli',
            'year': 'Vuosi',
            'Vuosi': 'Vuosi',
            'regionset': 'Aluejako',
            'from': 'alkaen',
            'to': 'päättyen'
        },
        'datatable': 'Taulukko',
        'published': {
            'showMap': 'Näytä kartta',
            'showTable': 'Näytä taulukko'
        },
        'classify': {
            'classify': 'Luokittelu',
            'labels': {
                'method': 'Luokittelutapa',
                'count': 'Luokkajako', // classes
                'mode': 'Luokkarajat',
                'mapStyle': 'Kartan tyyli',
                'type': 'Jakauma', // setselection
                'reverseColors': 'Käännä värit',
                'color': 'Väri',
                'colorset': 'Värit', //button
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
            'datasetSave': 'Virhe tallennetaessa aineistoa.',
            'datasetDelete': 'Virhe poistaessa aineistoa.',
            'indicatorSave': 'Virhe tallennettaessa muuttujaa.',
            'indicatorDelete': 'Virhe poistaessa muuttujaa.',
            'myIndicatorNameInput': 'Nimi kenttä ei voi olla tyhjä.',
            'myIndicatorYearInput': 'Vuosi kenttä ei voi olla tyhjä.',
            'myIndicatorRegionselect': 'Aluejako ei voi olla tyhjä.',
            'myIndicatorDatasource': 'Tietolähde on tyhjä.',
            'myIndicatorNoData': 'Aineiston arvoja ei ole annettu.',
            'myIndicatorInvalidData': 'Aineistossa on virheellisiä arvoja.',
            'cannotDisplayAsSeries': 'Indikaattoria ei voida tarkastella sarjana',
            'noDataForIndicators': 'Palvelusta ei saatu tietoja {indicators, plural, one {indikaattorille} other {indikaattoreille}}',
            'onlyPartialDataForIndicators': 'Palvelusta ei saatu kaikkia tietoja {indicators, plural, one {indikaattorille} other {indikaattoreille}}'
        },
        'missing': {
            'regionsetName': 'Tuntematon',
            'indicator': 'Tuntematon indikaattori'
        },
        'datacharts': {
            'flyout': 'Haettu aineisto',
            'barchart': 'Pylväskuvio',
            'linechart': 'Viivakuvio',
            'table': 'Taulukko',
            'desc': 'Taulukko ja kuvaajat',
            'nodata': 'Ei valittuja indikaattoreita',
            'indicatorVar': 'Kuvaajassa esitettävä muuttuja',
            'descColor': 'Kuvaajan väri',
            'selectClr': 'Valittu väri',
            'clrFromMap': 'Värit kartalla olevan luokittelun mukaan',
            'chooseColor': 'Valitse väri',
            'sorting': {
                'desc': 'Järjestys',
                'name-ascending': 'Nimen mukaan nouseva',
                'name-descending': 'Nimen mukaan laskeva',
                'value-ascending': 'Arvon mukaan nouseva',
                'value-descending': 'Arvon mukaan laskeva'
            }
        },
        'filter': {
            'title': 'Suodatus',
            'indicatorToFilter': 'Suodatettava muuttuja',
            'condition': 'Ehto',
            'value': 'Arvo',
            'variable': 'Muuttuja',
            'conditionPlaceholder': 'Valitse ehto',
            'greater': 'Suurempi kuin (>)',
            'greaterEqual': 'Suurempi tai yhtäsuuri kuin (>=)',
            'equal': 'Yhtäsuuri kuin (=)',
            'lessEqual': 'Pienempi tai yhtäsuuri kuin (<=)',
            'lessThan': 'Pienempi kuin (<)',
            'between': 'Välillä (poissulkeva)',
            'filter': 'Suodata arvot',
            'desc': 'Suodata arvoilla',
            'filtered': 'Suodatetut arvot',
            'area': 'Suodata alueilla'
        },
        'layer': {
            'name': 'Teemakartan aluejako',
            'inspireName': 'Teemakartta',
            'organizationName': 'Teemakartta'
        },
        'tab': {
            'title': 'Indikaattorit',
            'edit': 'Muokkaa',
            'delete': 'Poista',
            'grid': {
                'name': 'Nimi',
                'edit': 'Muokkaa',
                'delete': 'Poista',
                'actions': 'Toiminnot',
                'createDate': 'Luontiaika',
                'updateDate': 'Muokkausaika'
            },
            'popup': {
                'deletetitle': 'Poista indikaattori',
                'deletemsg': 'Haluatko poistaa indikaattorin "{name}"?',
                'deleteSuccess': 'Indikaattori poistettu'
            },
            'button': {
                'cancel': 'Peruuta',
                'ok': 'OK'
            },
            'error': {
                'title': 'Virhe',
                'notfound': 'Indikaattoria ei löytynyt',
                'notdeleted': 'Indikaattorin poisto epäonnistui'
            }
        },
        'userIndicators': {
            'flyoutTitle': 'Omat indikaattorit',
            'buttonTitle': 'Lisää uusi indikaattori',
            'buttonAddIndicator': 'Syötä dataa',
            'panelGeneric': {
                'title': 'Indikaattorin tiedot',
                'formName': 'Nimi',
                'formDescription': 'Kuvaus',
                'formDatasource': 'Lähde'
            },
            'panelData': {
                'title': 'Tilastotieto'
            },
            'dialog': {
                'successTitle': 'Tallennettu',
                'successMsg': 'Tiedot tallennettu.'
            },
            'import': {
                'title': 'Tuo leikepöydältä',
                'placeholder': 'Kopioi tähän indikaattorin tiedot. Yhdellä rivillä on alue ja sitä vastaava arvo. Alue merkitään joko nimellä tai tunnisteella. Erottimeksi puolipiste. Tiedot voivat olla seuraavissa muodoissa: \n' +
                'Esimerkki 1: Helsinki;1234 \n' +
                'Esimerkki 2: 011;5678'
            },
            'notLoggedInTitle': 'Varoitus',
            'notLoggedInWarning': 'Kirjautumattomana oman indikaattorin tiedot ovat käytettävissä vain tämän session ajan. Kirjaudu sisään tallentaaksesi indikaattori.',
            'modify': {
                'title': 'Indikaattori',
                'edit': 'Muokkaa',
                'remove': 'Poista'
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
        },
        'sumo': {
            'placeholder': 'Valitse tästä',
            'captionFormat': '{0} valittu',
            'captionFormatAllSelected': 'Kaikki {0} valittu!',
            'searchText': 'Etsi...',
            'noMatch': 'Yhtään hakutulosta ei löytynyt haulla "{0}"',
            'locale': ['OK', 'Peruuta', 'Valitse kaikki']
        }
    }
});
