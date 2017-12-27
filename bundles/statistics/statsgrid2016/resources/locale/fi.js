Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Teemakartat",
            "search": "Aineistohaku",
            "table": "Taulukko",
            "diagram": "Pylväsdiagrammi"
        },
        "flyout": {
            "title": "Teemakartat"
        },
        "dataProviderInfoTitle": "Indikaattorit",
        "layertools": {
            "table_icon": {
                "tooltip": "Siirry teemakarttoihin",
                "title": "Teemakartat"
            },
            "diagram_icon": {
                "tooltip": "Näytä tiedot diagrammissa",
                "title": "Diagrammi"
            },
            "statistics": {
                "tooltip": "siirry teemakarttoihin",
                "title": "Tilastot"
            }
        },
        "panels": {
            "newSearch": {
                "title": "AINEISTOHAKU",
                "datasourceTitle": "Aineiston tarjoaja",
                "indicatorTitle": "Aineisto",
                "selectDatasourcePlaceholder": "Valitse tietolähde",
                "selectIndicatorPlaceholder": "Valitse aineisto",
                "noResults": "Yhtään hakutulosta ei löytynyt, haulla",
                "refineSearchLabel": "Tarkenna tarkasteltavan aineiston sisältöä",
                "refineSearchTooltip1": "Saat näkyviin vaihtoehtoja kun olet ensin valinnut aineiston tarjoajan ja aineiston.",
                "refineSearchTooltip2": "",
                "addButtonTitle": "Hae aineiston tiedot",
                "defaultPlaceholder": "Valitse arvo",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Valitse sukupuoli",
                        "male": "Miehet",
                        "female": "Naiset",
                        "total": "Yhteensä"
                    },
                    "year": {
                        "placeholder": "Valitse vuosi"
                    },
                    "regionset": {
                        "placeholder": "Valitse aluejako"
                    }
                },
                "noRegionset": "Ei aluevalintaa"
            },
            "extraFeatures": {
                "title": "Lisäominaisuudet",
                "hideMapLayers": "Piilota muut karttatasot",
                "openTableCheckbox": "Avaa taulukko",
                "openDiagramCheckbox": "Avaa pylväsdiagrammiesitys"
            }
        },
        "statsgrid": {
            "title": "HAETUT AINEISTOT",
            "noResults": "Ei valittuja aineistoja",
            "areaSelection": {
                "title": "ALUEJAKO",
                "info": "Määritä uudelleen millä alueilla haluat tarkastella aineistoja valitsemalla alasvetovalikosta"
            },
            "source": "Aineisto",
            "orderBy": "Lajittele",
            "orderByAscending": "Lajittele nousevasti",
            "orderByDescending": "Lajittele laskevasti",
            "removeSource": "Poista aineisto"
        },
        "legend": {
            "title": "Luokittelu",
            "noActive": "Ei valittuna aineistoa, valitse aineisto nähdäksesi kartan luokittelun.",
            "noEnough": "Aineisto on liian pieni luokittelun muodostamiseksi, kokeile eri aineistoa tai muuta rajauksia.",
            "cannotCreateLegend": "Legendaa ei saada tehtyä valitsemillasi arvoilla, kokeile eri arvoilla."
        },
        "parameters": {
            "sex": "Sukupuoli",
            "year": "Vuosi",
            "regionset": "Aluevalinta"
        },
        "datatable": "Taulukko",
        "published": {
            "showMap": "Näytä kartta",
            "showTable": "Näytä taulukko"
        },
        "classify": {
            "classify": "Luokittelu",
            "classifymethod": "Luokittelutapa",
            "classes": "Luokkajako",
            "methods" : {
                "jenks": "Luonnolliset välit",
                "quantile": "Kvantiilit",
                "equal": "Tasavälit"
            },
            "manual": "Luokittelu käsin",
            "manualPlaceholder": "Erota luvut pilkuilla.",
            "manualRangeError": "Luokkarajat ovat virheellisiä. Luokkarajojen on oltava välillä {min} - {max}. Erota luvut toisistaan pilkulla. Käytä desimaalierottimena pistettä. Korjaa luokkarajat ja yritä uudelleen.",
            "nanError": "Antamasi arvo ei ole luku. Korjaa arvo ja yritä uudelleen. Käytä desimaalierottimena pistettä.",
            "infoTitle": "Luokittelu käsin",
            "info": "Anna luokkarajat pilkulla erotettuina lukuina. Käytä desimaalierottimena pistettä. Esimerkiksi syöttämällä \"0, 10.5, 24, 30.2, 57, 73.1\" saat viisi luokkaa, joiden arvot ovat välillä \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" ja \"57-73,1\". Indikaattorin arvoja, jotka ovat pienempiä kuin alin luokkaraja (esimerkissä 0) tai suurempia kuin ylin luokkaraja (73,1), ei näytetä kartalla. Luokkarajojen on oltava indikaattorin pienimmän ja suurimman arvon välillä.",
            "mode": "Luokkarajat",
            "modes": {
                "distinct": "Jatkuva",
                "discontinuous": "Epäjatkuva"
            },
            "editClassifyTitle": "Muokkaa luokittelua",
            "classifyFieldsTitle": "Luokitteluarvot",
            "map": {
                "mapStyle": "Kartan tyyli",
                "choropleth": "Koropleettikartta",
                "points": "Pisteet",
                "pointSize": "Pisteen koko",
                "min": "Minimi",
                "max": "Maksimi",
                "color": "Väri",
                "transparency": "Läpinäkyvyys",
                "showValues": "Näytä arvot"
            }
        },
        "colorset": {
            "button": "Värit",
            "flipButton": "Käännä värit",
            "themeselection": "Valitse luokkien värit",
            "setselection": "Jakauma",
            "seq": "Kvantitatiivinen",
            "qual": "Kvalitatiivinen",
            "div": "Jakautuva",
            "info2": "Valitse värit klikkaamalla haluamaasi väriryhmää.",
            "cancel": "Peruuta"
        },
        "errors": {
            "title": "Virhe",
            "indicatorListError": "Aineiston tarjoajien haussa tapahtui virhe.",
            "indicatorListIsEmpty": "Aineiston tarjoajan aineistolista on tyhjä.",
            "indicatorMetadataError": "Aineiston valintojen haussa tapahtui virhe.",
            "indicatorMetadataIsEmpty": "Aineiston valinnat on tyhjä.",
            "regionsetsIsEmpty": "Aluevalintoja ei saatu valitulle aineistolle.",
            "regionsDataError": "Alueen arvojen haussa tapahtui virhe.",
            "regionsDataIsEmpty": "Valitulle aineistolle ei saatu alueiden arvoja."
        },
        "datacharts": {
          "flyout": "Haettu aineisto",
          "barchart": "Pylväskuvio",
          "linechart": "Viivakuvio",
          "table": "Taulukko",
          "desc": "Taulukko ja kuvaajat",
          "nodata": "Ei valittuja indikaattoreita",
          "indicatorVar": "Kuvaajassa esitettävä muuttuja",
          "descColor": "Kuvaajan väri",
          "selectClr": "Valittu väri",
          "clrFromMap": "Värit kartalla olevan luokittelun mukaan",
          "chooseColor": "Valitse väri"
        },
        "filter": {
            "title": "Suodatus",
            "indicatorToFilter": "Suodatettava muuttuja",
            "condition": "Ehto",
            "value": "Arvo",
            "variable": "Muuttuja",
            "conditionPlaceholder": "Valitse ehto",
            "greater": "Suurempi kuin (>)",
            "greaterEqual": "Suurempi tai yhtäsuuri kuin (>=)",
            "equal": "Yhtäsuuri kuin (=)",
            "lessEqual": "Pienempi tai yhtäsuuri kuin (<=)",
            "lessThan": "Pienempi kuin (<)",
            "between": "Välillä (poissulkeva)",
            "filter": "Suodata arvot",
            "desc": "Suodata arvoilla",
            "filtered": "Suodatetut arvot",
            "area": "Suodata alueilla"
        },
        "layer": {
            "name": "Teemakartan aluejako",
            "inspireName": "Teemakartta",
            "organizationName": "Teemakartta"
        }
    }
});
