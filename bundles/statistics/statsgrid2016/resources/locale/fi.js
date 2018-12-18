Oskari.registerLocalization({
    'lang': 'fi',
    'key': 'StatsGrid',
    'value': {
        'tile': {
            'title': 'Teemakartat',
            'search': 'Aineistohaku',
            'table': 'Taulukko',
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
                'title': 'ALUEJAKO',
                'info': 'Määritä uudelleen millä alueilla haluat tarkastella aineistoja valitsemalla alasvetovalikosta'
            },
            'source': 'Indikaattori',
            'orderBy': 'Lajittele',
            'orderByAscending': 'Lajittele nousevasti',
            'orderByDescending': 'Lajittele laskevasti',
            'removeSource': 'Poista aineisto'
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
            'title': 'Diagram'
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
            'classifymethod': 'Luokittelutapa',
            'classes': 'Luokkajako',
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
            'mode': 'Luokkarajat',
            'modes': {
                'distinct': 'Jatkuva',
                'discontinuous': 'Epäjatkuva'
            },
            'editClassifyTitle': 'Muokkaa luokittelua',
            'classifyFieldsTitle': 'Luokitteluarvot',
            'map': {
                'mapStyle': 'Kartan tyyli',
                'choropleth': 'Koropleettikartta',
                'points': 'Pisteet',
                'pointSize': 'Pisteen koko',
                'min': 'Minimi',
                'max': 'Maksimi',
                'color': 'Väri',
                'transparency': 'Läpinäkyvyys',
                'showValues': 'Näytä arvot',
                'fractionDigits': 'Desimaalien lukumäärä'
            }
        },
        'colorset': {
            'button': 'Värit',
            'flipButton': 'Käännä värit',
            'themeselection': 'Valitse luokkien värit',
            'setselection': 'Jakauma',
            'seq': 'Kvantitatiivinen',
            'qual': 'Kvalitatiivinen',
            'div': 'Jakautuva',
            'info2': 'Valitse värit klikkaamalla haluamaasi väriryhmää.',
            'cancel': 'Peruuta'
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
            'myIndicatorYearInput': 'Vuosi kenttä ei voi olla tyhjä.',
            'myIndicatorRegionselect': 'Aluejako ei voi olla tyhjä.',
            'myIndicatorDatasource': 'Tietolähde on tyhjä.',
            'cannotDisplayAsSeries': 'Indikaattoria ei voida tarkastella sarjana'
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
                'delete': 'Poista'
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
                'successMsg': 'Tiedot tallennettu. Lisää indikaattori kartalle aineistohaun kautta.'
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
