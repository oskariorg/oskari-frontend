Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "StatsGrid",
    "value": {
        "title": "Patio",
        "desc": "",
        "tile": {
            "title": "Tematiska kartor"
        },
        "view": {
            "title": "Patio",
            "message": "patiopoc"
        },
        "layertools": {
            "table_icon": {
                "tooltip": "Gå till temakartor",
                "title": "Temakartor"
            },
            "diagram_icon": {
                "tooltip": "Visa diagram",
                "title": "Diagram"
            },
            "statistics": {
                "tooltip": "går till temakartor",
                "title": "Statistik"
            }
        },
        "tab": {
            "title": "Indikatorer",
            "description": "Egna indikatorer",
            "grid": {
                "name": "Titel",
                "description": "Beskrivning",
                "organization": "Data källa",
                "year": "År",
                "delete": "Ta bort"
            },
            "deleteTitle": "Ta bort indikator",
            "destroyIndicator": "Ta bort",
            "cancelDelete": "Avsluta",
            "confirmDelete": "Är du säker att du vill ta bort indikatorn",
            "newIndicator": "Ny indikator",
            "error": {
                "title": "Fel",
                "indicatorsError": "Fel inträffade vid laddning av indikatorer. Försök igen senare.",
                "indicatorError": "Fel inträffade vid laddning av en indikator. Försök igen senare.",
                "indicatorDeleteError": "Fel inträffade vid borttagning av en indikator. Försök igen senare."
            }
        },
        "gender": "Kön",
        "genders": {
            "male": "män",
            "female": "kvinnor",
            "total": "totalt"
        },
        "addColumn": "Hämta data",
        "removeColumn": "Ta bort",
        "indicators": "Indikator",
        "cannotDisplayIndicator": "Indikatorn har inga värden på vald regional indelning. Så det kan inte visas i rutnätet.",
        "availableRegions": "Värden finns för följande regionala indelningar:",
        "year": "År",
        "buttons": {
            "ok": "OK",
            "cancel": "Avbryt",
            "filter": "Filter"
        },
        "stats": {
            "municipality": "Kommun",
            "code": "Kod",
            "errorTitle": "Fel",
            "regionDataError": "De kommunala uppgifterna kunde inte hittas. Försök igen senare.",
            "regionDataXHRError": "Indikatorn kunde inte laddas. Försök igen senare.",
            "indicatorsDataError": "Indikatorn kunde inte hittas. Försök igen senare.",
            "indicatorsDataXHRError": "Indikatorn kunde inte laddas. Försök igen senare.",
            "indicatorMetaError": "Metadata för indikatorn kunde inte hittas. Försök igen senare.",
            "indicatorMetaXHRError": "Indikatorn kunde inte laddas. Försök igen senare.",
            "indicatorDataError": "Data för indikatorn kunde inte hittas. Försök igen senare.",
            "indicatorDataXHRError": "Indikatorn kunde inte laddas. Försök igen senare.",
            "descriptionTitle": "Beskrivning",
            "sourceTitle": "Data källa"
        },
        "classify": {
            "classify": "Klassificering",
            "classifymethod": "Klassificeringsmetod",
            "classes": "Klasser",
            "jenks": "Jenks intervall",
            "quantile": "Kvantiler",
            "eqinterval": "Lika intervall",
            "manual": "Egna klasser",
            "manualPlaceholder": "Ange siffrorna, separerade med kommatecken.",
            "manualRangeError": "Klass intervallen bör vara nummer mellan {min} och {max}. Ingångs siffror separerade med kommatecken. Decimal separeras med en punkt.",
            "nanError": "Det angivna värdet är inte ett nummer. Ange ingångsklass intervall igen som siffror separerade med kommatecken. Decimal separeras med en punkt.",
            "infoTitle": "Egna klasser",
            "info": "Ange siffrorna igen separerade med kommatecken. Decimal separeras med en punkt. Till exempel genom att mata in \"\" 0, 10,5, 24, 30,2, 57, 73,1 \" får du fem klasser som har värden mellan\" 0-10,5 \",\" 10,5-24 \",\" 24-30,2 \", \"30,2-57\" ja \"57-73,1\". Om indikatorns värde är mindre än minimivärdet (0) eller större än det maximala värdet (73,1) visas det inte på kartan. Klass intervallen bör vara nummer mellan {min} och {max}.",
            "mode": "Klass intervall",
            "modes": {
                "distinct": "Kontinuerlig",
                "discontinuous": "Separat"
            }
        },
        "colorset": {
            "button": "Färger",
            "flipButton": "Vänd färger",
            "themeselection": "Färgvalstema",
            "setselection": "Färgset urval",
            "sequential": "Kvantitativ",
            "qualitative": "Kvalitativ",
            "divergent": "Delbar",
            "info2": "Välj färgerna genom att klicka på färggruppen",
            "cancel": "Avbryt"
        },
        "statistic": {
            "title": "Statistiska variabler",
            "avg": "Medelvärde",
            "max": "Maximalt värde",
            "mde": "Läge",
            "mdn": "Median",
            "min": "Minimivärde",
            "std": "Standardavvikelse",
            "sum": "Summa",
            "tooltip": {
                "avg": "Medelvärdet av värdena i indikatorn.",
                "max": "Det största värdet av värdena i indikatorn.",
                "mde": "Den vanligaste värdet av värdena i indikatorn.",
                "mdn": "Den mellersta av värdet i indikatorn efter sortering.",
                "min": "Det minsta värdet av värdena i indikatorn.",
                "std": "Standardavvikelsen för värdena i indikatorn.",
                "sum": "Den totala summan av värdena i indikatorn."
            }
        },
        "baseInfoTitle": "Identifieringsdata",
        "dataTitle": "Indikator",
        "noIndicatorData": "Indikatoren kan inte visas på den här regionindelningen.",
        "values": "värden",
        "included": "Värden",
        "municipality": "Kommuner",
        "selectRows": "Välj rader",
        "select4Municipalities": "Välj minst två områden",
        "showSelected": "Visa endast utvalda områden på rutnätet.",
        "not_included": "Ingår inte",
        "noMatch": "Inga resultat hittades.",
        "selectIndicator": "Välj en indikator.",
        "noDataSource": "Ingen datakälla hittades.",
        "selectDataSource": "Välj en datakälla.",
        "filterTitle": "Filtrera värdena",
        "indicatorFilterDesc": "Valda statistiska enheter markeras i rutnätet. Du kan filtrera varje kolumn för sig.",
        "filterIndicator": "Indikator:",
        "filterCondition": "Skick:",
        "filterSelectCondition": "Välj skick",
        "filterGT": "Större än (>)",
        "filterGTOE": "Större än eller lika med (>=)",
        "filterE": "Lika med (=)",
        "filterLTOE": "Mindre än eller lika med (<=)",
        "filterLT": "Mindre än (<)",
        "filterBetween": "Däremellan (exklusivt)",
        "filter": "Filter",
        "filterByValue": "Genom värde",
        "filterByRegion": "Genom region",
        "selectRegionCategory": "Regional indelning:",
        "regionCatPlaceholder": "Välj en regional indelning",
        "selectRegion": "Region:",
        "chosenRegionText": "Välj regionerna",
        "noRegionFound": "Regionen kunde inte hittas.",
        "regionCategories": {
            "title": "Regionindelningar",
            "ERVA": "Specialupptagningsområde",
            "ELY-KESKUS": "NTM-regioner",
            "KUNTA": "Kommuner",
            "ALUEHALLINTOVIRASTO": "Regionförvaltningsverken",
            "MAAKUNTA": "Region",
            "NUTS1": "Fasta Finland och Åland",
            "SAIRAANHOITOPIIRI": "Sjukvårds distrikt",
            "SEUTUKUNTA": "Subregion",
            "SUURALUE": "Storområden"
        },
        "addDataButton": "Lägg till indikator",
        "addDataTitle": "Lägg till en ny indikator.",
        "openImportDialogTip": "Importera data från urklippet.",
        "openImportDataButton": "Importera data",
        "addDataMetaTitle": "Titel",
        "addDataMetaTitlePH": "Indiktorns titel",
        "addDataMetaSources": "Datakälla",
        "addDataMetaSourcesPH": "Datakälla för indikatorn",
        "addDataMetaDescription": "Beskrivning",
        "addDataMetaDescriptionPH": "Beskrivning",
        "addDataMetaReferenceLayer": "Regional indelning:",
        "addDataMetaYear": "År",
        "addDataMetaYearPH": "Data har tagits fram under året",
        "addDataMetaPublicity": "Publicerbar",
        "municipalityHeader": "Kommuner",
        "dataRows": "Indikatorvärden per region",
        "municipalityPlaceHolder": "Ge ett värde",
        "formEmpty": "Töm",
        "formCancel": "Avbryt",
        "formSubmit": "Lämna in",
        "cancelButton": "Avbryt",
        "clearImportDataButton": "Töm dataraderna",
        "importDataButton": "Lägg till",
        "popupTitle": "Importera data",
        "importDataDescription": "Kopiera regionerna (namn eller id) och motsvarande värde till nedanstående textfältet. Lägg till regionen och dess värde separerad med en tabulator, ett kolon eller ett komma. Skriv varje region på separat rad.  \r\nExempel 1: Alajärvi, 1234 \r\nExempel 2: 009   2100",
        "failedSubmit": "Lägg till metadata för indikatorn:",
        "connectionProblem": "De angivna värdena kunde inte sparas på grund av anslutningsproblem.",
        "parsedDataInfo": "Det totala beloppet för de importerade regionerna",
        "parsedDataUnrecognized": "Okända regioner",
        "loginToSaveIndicator": "För att spara din egen indikator måste du logga in."
    }
});
