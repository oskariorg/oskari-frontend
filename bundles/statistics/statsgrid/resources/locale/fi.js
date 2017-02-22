Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "StatsGrid",
    "value": {
        "title": "Patio",
        "desc": "",
        "tile": {
            "title": "Teemakartat"
        },
        "view": {
            "title": "Patio",
            "message": "patiopoc"
        },
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
        "tab": {
            "title": "Indikaattorit",
            "description": "Omat indikaattorit",
            "grid": {
                "name": "Otsikko",
                "description": "Kuvaus",
                "organization": "Tietolähde",
                "year": "Vuosi",
                "delete": "Poista"
            },
            "deleteTitle": "Poista indikaattori",
            "destroyIndicator": "Poista",
            "cancelDelete": "Peruuta",
            "confirmDelete": "Haluatko varmasti poistaa indikaattorin",
            "newIndicator": "Uusi indikaattori",
            "error": {
                "title": "Virhe",
                "indicatorsError": "Indikaattorien lataus epäonnistui.",
                "indicatorError": "Indikaattorin lataus epäonnistui.",
                "indicatorDeleteError": "Indikaattorin poisto epäonnistui."
            }
        },
        "gender": "Sukupuoli",
        "genders": {
            "male": "miehet",
            "female": "naiset",
            "total": "yhteensä"
        },
        "addColumn": "Hae tiedot",
        "removeColumn": "Poista",
        "indicators": "Indikaattori",
        "cannotDisplayIndicator": "Indikaattorilla ei ole arvoja valitsemallasi aluejaolla.",
        "availableRegions": "Arvot löytyvät seuraaville aluejaoille:",
        "year": "Vuosi",
        "buttons": {
            "ok": "OK",
            "cancel": "Peruuta",
            "filter": "Suodata"
        },
        "stats": {
            "municipality": "Kunta",
            "code": "Koodi",
            "errorTitle": "Virhe",
            "regionDataError": "Aluetietoja ei voitu hakea.",
            "regionDataXHRError": "Aluetietoja ei voitu hakea.",
            "indicatorsDataError": "Indikaattorin tietoja ei voitu hakea.",
            "indicatorsDataXHRError": "Indikaattorin tietoja ei voitu hakea.",
            "indicatorMetaError": "Indikaattorin metatietoja ei voitu hakea.",
            "indicatorMetaXHRError": "Indikaattorin metatietoja ei voitu hakea.",
            "indicatorDataError": "Indikaattorin tietoja ei voitu hakea.",
            "indicatorDataXHRError": "Indikaattorin tietoja ei voitu hakea.",
            "descriptionTitle": "Kuvaus",
            "sourceTitle": "Tietolähde"
        },
        "classify": {
            "classify": "Luokittelu",
            "classifymethod": "Luokittelutapa",
            "classes": "Luokkajako",
            "jenks": "Luonnolliset välit",
            "quantile": "Kvantiilit",
            "eqinterval": "Tasavälit",
            "manual": "Luokittelu käsin",
            "manualPlaceholder": "Erota luvut pilkuilla.",
            "manualRangeError": "Luokkarajat ovat virheellisiä. Luokkarajojen on oltava välillä {min} - {max}. Erota luvut toisistaan pilkulla. Käytä desimaalierottimena pistettä. Korjaa luokkarajat ja yritä uudelleen.",
            "nanError": "Antamasi arvo ei ole luku. Korjaa arvo ja yritä uudelleen. Käytä desimaalierottimena pistettä.",
            "infoTitle": "Luokittelu käsin",
            "info": "Anna luokkarajat pilkulla erotettuina lukuina. Käytä desimaalierottimena pistettä. Esimerkiksi syöttämällä \"0, 10.5, 24, 30.2, 57, 73.1\" saat viisi luokkaa, joiden arvot ovat välillä \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" ja \"57-73,1\". Indikaattorin arvoja, jotka ovat pienempiä kuin alin luokkaraja (esimerkissä 0) tai suurempia kuin ylin luokkaraja (73,1), ei näytetä kartalla. Luokkarajojen on oltava indikaattorin pienimmän ja suurimman arvon välillä.",
            "mode": "Luokkarajojen jatkuvuus",
            "modes": {
                "distinct": "Jatkuva",
                "discontinuous": "Epäjatkuva"
            }
        },
        "colorset": {
            "button": "Värit",
            "flipButton": "Käännä värit",
            "themeselection": "Valitse luokkien värit",
            "setselection": "Jakauman tyyppi",
            "sequential": "Kvantitatiivinen",
            "qualitative": "Kvalitatiivinen",
            "divergent": "Jakautuva",
            "info2": "Valitse värit klikkaamalla haluamaasi väriryhmää.",
            "cancel": "Peruuta"
        },
        "statistic": {
            "title": "Tunnusluvut",
            "avg": "Keskiarvo",
            "max": "Suurin arvo",
            "mde": "Moodi",
            "mdn": "Mediaani",
            "min": "Pienin arvo",
            "std": "Keskihajonta",
            "sum": "Summa",
            "tooltip": {
                "avg": "Keskiarvo on indikaattorin keskimääräinen arvo. Se lasketaan jakamalla indikaattorin arvojen summa indikaattorin arvojen lukumäärällä.",
                "max": "Suurin arvo on suurin indikaattorissa esiintyvä arvo.",
                "mde": "Moodi on yleisin indikaattorissa esiintyvä arvo.",
                "mdn": "Mediaani on keskimmäinen indikaattorin arvoista, kun arvot on järjestetty suuruusjärjestykseen. Jos arvoja on parillinen määrä, mediaani on kahden keskimmäisen arvon keskiarvo.",
                "min": "Pienin arvo on pienin indikaattorissa esiintyvä arvo.",
                "std": "Keskihajonta on indikaattorin arvojen keskimääräinen poikkeama keskiarvosta.",
                "sum": "Summa on ominaisuustiedon arvojen yhteenlaskettu arvo."
            }
        },
        "baseInfoTitle": "Tunnistetiedot",
        "dataTitle": "Indikaattori",
        "noIndicatorData": "Indikaattorilla ei ole arvoja valitulla aluejaolla. Valitse toinen aluejako ja yritä uudelleen.",
        "values": "arvoa",
        "included": "Arvot",
        "municipality": "Kunnat",
        "selectRows": "Valitse rivit",
        "select4Municipalities": "Valitse vähintään kaksi aluetta.",
        "showSelected": "Näytä vain valitut alueet",
        "not_included": "Ei valittuna",
        "noMatch": "Indikaattoria ei löytynyt.",
        "selectIndicator": "Valitse indikaattori",
        "noDataSource": "Tietolähdettä ei löytynyt.",
        "selectDataSource": "Valitse tietolähde",
        "filterTitle": "Suodata arvoja",
        "indicatorFilterDesc": "Suodata arvoja arvon tai alueen perusteella. Voit tehdä erilliset suodattimet eri sarakkeille.",
        "filterIndicator": "Indikaattori:",
        "filterCondition": "Ehto:",
        "filterSelectCondition": "Valitse ehto",
        "filterGT": "Suurempi kuin (>)",
        "filterGTOE": "Suurempi tai yhtäsuuri kuin (>=)",
        "filterE": "Yhtäsuuri kuin (=)",
        "filterLTOE": "Pienempi tai yhtäsuuri kuin (<=)",
        "filterLT": "Pienempi kuin (<)",
        "filterBetween": "Välillä (poissulkeva)",
        "filter": "Suodata",
        "filterByValue": "Arvoilla",
        "filterByRegion": "Alueilla",
        "selectRegionCategory": "Aluejako:",
        "regionCatPlaceholder": "Valitse aluejako",
        "selectRegion": "Alue",
        "chosenRegionText": "Valitse alue",
        "noRegionFound": "Aluetta ei löytynyt.",
        "regionCategories": {
            "title": "Aluejaot",
            "ERVA": "ERVA-alueet",
            "ELY-KESKUS": "ELY-alueet",
            "KUNTA": "Kunnat",
            "ALUEHALLINTOVIRASTO": "Aluehallintovirastot",
            "MAAKUNTA": "Maakunnat",
            "NUTS1": "Manner-Suomi ja Ahvenanmaa",
            "SAIRAANHOITOPIIRI": "Sairaanhoitopiirit",
            "SEUTUKUNTA": "Seutukunnat",
            "SUURALUE": "Suuralueet"
        },
        "addDataButton": "Lisää uusi",
        "addDataTitle": "Indikaattorin arvot alueittain",
        "openImportDialogTip": "Tuo arvot leikepöydältä",
        "openImportDataButton": "Tuo arvot",
        "addDataMetaTitle": "Otsikko",
        "addDataMetaTitlePH": "Indikaattorin otsikko",
        "addDataMetaSources": "Tietolähde",
        "addDataMetaSourcesPH": "Lähdeviittaus",
        "addDataMetaDescription": "Kuvaus",
        "addDataMetaDescriptionPH": "Indikaattorin kuvaus",
        "addDataMetaReferenceLayer": "Aluejako",
        "addDataMetaYear": "Vuosi",
        "addDataMetaYearPH": "Tietojen keruuvuosi",
        "addDataMetaPublicity": "Julkaistavissa",
        "municipalityHeader": "Kunnat",
        "dataRows": "Arvot alueittain",
        "municipalityPlaceHolder": "Anna arvo",
        "formEmpty": "Tyhjennä lomake",
        "formCancel": "Peruuta",
        "formSubmit": "Tallenna indikaattori",
        "cancelButton": "Peruuta",
        "clearImportDataButton": "Tyhjennä",
        "importDataButton": "Lisää arvot",
        "popupTitle": "Tuo arvot",
        "importDataDescription": "Kopioi tähän indikaattorin tiedot. Yhdellä rivillä on alue ja sitä vastaava arvo. Alue merkitään joko nimellä tai tunnisteella. Erottimeksi käy joko sarkain, kaksoispiste tai pilkku. Tiedot voivat olla seuraavissa muodoissa:\r\nEsimerkki 1: Helsinki, 1234\r\nEsimerkki 2: 009: 5678",
        "failedSubmit": "Indikaattorin tallentaminen epäonnistui. Lisää seuraavat tiedot ja yritä uudelleen:",
        "connectionProblem": "Indikaattorin tallentaminen epäonnistui.",
        "parsedDataInfo": "Tuotuja alueita oli yhteensä",
        "parsedDataUnrecognized": "Tuntemattomia alueita",
        "loginToSaveIndicator": "Jos haluat tallentaa indikaattorin, kirjaudu sisään."
    }
});
