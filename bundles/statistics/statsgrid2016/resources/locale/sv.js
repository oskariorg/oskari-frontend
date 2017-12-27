Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Tematiska kartor",
            "search": "Sök data",
            "table": "Tabell",
            "diagram": "Stapeldiagram"
        },
        "flyout": {
            "title": "Tematiska kartor"
        },
        "dataProviderInfoTitle": "Indikatorer",
        "layertools": {
            "table_icon": {
                "tooltip": "gå till tematiska kartor",
                "title": "Tematiska kartor"
            },
            "diagram_icon": {
                "tooltip": "Visa uppgifter i diagram",
                "title": "Diagram"
            },
            "statistics": {
                "tooltip": "gå till tematiska kartor",
                "title": "Statistik"
            }
        },
        "panels": {
            "newSearch": {
                "title": "SÖK DATA",
                "datasourceTitle": "Dataleverantör",
                "indicatorTitle": "Datamängd",
                "selectDatasourcePlaceholder": "Välj datakälla",
                "selectIndicatorPlaceholder": "Välj datamängd",
                "noResults": "Inga sökresultat hittades med",
                "refineSearchLabel": "Precisera innehållet av datamängden du önskar att granska",
                "refineSearchTooltip1": "Du får mera alternativ när du har först valt dataleverantören och datamängden.",
                "refineSearchTooltip2": "",
                "addButtonTitle": "Hämta datamängdens uppgifter",
                "defaultPlaceholder": "Välj värde",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Välj kön",
                        "male": "Män",
                        "female": "Kvinnor",
                        "total": "Totalt"
                    },
                    "year": {
                        "placeholder": "Välj år"
                    },
                    "regionset": {
                        "placeholder": "Välj områdesindelning"
                    }
                },
                "noRegionset": "Ingen områdesindelning"
            },
            "extraFeatures": {
                "title": "Ytterligare egenskaper",
                "hideMapLayers": "Gömma andra kartlager",
                "openTableCheckbox": "Öppna tabell",
                "openDiagramCheckbox": "Öppna diagram"
            }
        },
        "statsgrid": {
            "title": "HÄMTADE DATAMÄNGDER",
            "noResults": "Inga valda datamängder",
            "areaSelection": {
                "title": "OMRÅDESINDELNING",
                "info": "Omdefiniera den önskade områdesindelningen från rullgardinsmenyn."
            },
            "source": "Datamängd",
            "orderBy": "Sortera",
            "orderByAscending": "Sortera stigande",
            "orderByDescending": "Sortera sjunkande",
            "removeSource": "Radera datamängd"
        },
        "legend": {
            "title": "Klassificering",
            "noActive": "Inga valda datamängder, välj datamängd för att se kartans klassificering.",
            "noEnough": "Datamängden är för liten för att klassificeras, försök en annan datamängd eller avgränsning.",
            "cannotCreateLegend": "Teckenförklaringen kan inte skapas utgående från de valda värden, vänligen försök andra värden."
        },
        "parameters": {
            "sex": "Kön",
            "year": "År",
            "regionset": "Områdesindelning"
        },
        "datatable": "Tabell",
        "published": {
            "showMap": "Visa karta",
            "showTable": "Visa tabell"
        },
        "classify": {
            "classify": "Klassificering",
            "classifymethod": "Klassificeringsmetod",
            "classes": "Klassfördelning",
            "methods" : {
                "jenks": "Naturliga brytpunkter",
                "quantile": "Kvantiler",
                "equal": "Lika intervall"
            },
            "manual": "Klassificering för hand",
            "manualPlaceholder": "Avgränsa tal med kommatecken.",
            "manualRangeError": "Klassgränserna är felaktiga. Klassgränserna bör vara mellan {min} - {max}. Avgränsa tal med kommatecken. Använd punkt som decimaltecken. Rätta till klassgränserna och försök igen.",
            "nanError": "Det givna värdet är ej ett tal. Rätta till värdet och försök igen. Använd punkt som decimaltecken.",
            "infoTitle": "Klassificering för hand",
            "info": "Ange klassgränserna som tal avgränsade med kommatecken. Använd punkt som decimaltecken. Till exempel genom att mata in \"0, 10.5, 24, 30.2, 57, 73.1\" skapas fem klasser med värden mellan \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" och \"57-73,1\". Indikatorvärden, som är mindre än den lägsta klassgränsen (0 i exemplet) eller större än den högsta klassgränsen (73,1), visas inte på kartan. Klassgränserna bör vara mellan det minsta och största värdet.",
            "mode": "Klassgränser",
            "modes": {
                "distinct": "Kontinuerlig",
                "discontinuous": "Diskontinuerlig"
            },
            "editClassifyTitle": "Redigera klassificeringen",
            "classifyFieldsTitle": "Klassificeringsvärden",
            "map": {
                "mapStyle": "Kartans stil",
                "choropleth": "Koropletkarta",
                "points": "Karta med punktsymboler",
                "pointSize": "Punktens storlek",
                "min": "Minimum",
                "max": "Maximum",
                "color": "Färg",
                "transparency": "Genomskinlighet",
                "showValues": "Visa värden"
            }
        },
        "colorset": {
            "button": "Färg",
            "flipButton": "Kasta om färgerna",
            "themeselection": "Välj klassernas färger",
            "setselection": "Fördelning",
            "seq": "Kvantitativ",
            "qual": "Kvalitativ",
            "div": "Uppdelad",
            "info2": "Välj färgsättning genom att klicka på den önskade färggruppen.",
            "cancel": "Avbryt"
        },
        "errors": {
            "title": "Fel",
            "indicatorListError": "Ett fel uppstod vid sökningen av dataleverantören.",
            "indicatorListIsEmpty": "Dataleverantörens lista av datamängder är tom.",
            "indicatorMetadataError": "Ett fel uppstod vid sökningen av datamängder.",
            "indicatorMetadataIsEmpty": "Inga datamängder har valts.",
            "regionsetsIsEmpty": "Områdesindelningarna kunde inte hämtas för den valda datamängden.",
            "regionsDataError": "Ett fel uppstod vid sökningen av områdets värden.",
            "regionsDataIsEmpty": "Områdenas värden kunde inte ges till de valda datamängderna."
        },
        "datacharts": {
          "flyout": "Sökta datamängden",
          "barchart": "Stapeldiagram",
          "linechart": "Linjediagram",
          "table": "Tabell",
          "desc": "Tabell och figurer",
          "nodata": "Inga valda indikatorer",
          "indicatorVar": "Variabeln som ska visas i figuren",
          "descColor": "Figurens färg",
          "selectClr": "Vald färg",
          "clrFromMap": "Färgsättning enligt kartas klassificering",
          "chooseColor": "Välj färg"
        },
        "filter": {
            "title": "Filtrering",
            "indicatorToFilter": "Variabel som ska filtreras",
            "condition": "Villkor",
            "value": "Värde",
            "variable": "Variabel",
            "conditionPlaceholder": "Välj villkor",
            "greater": "Större än (>)",
            "greaterEqual": "Större än eller lika med (>=)",
            "equal": "Lika med (=)",
            "lessEqual": "Mindre än eller lika med (<=)",
            "lessThan": "Mindre än (<)",
            "between": "Mellan (uteslutande)",
            "filter": "Filtrera värden",
            "desc": "Filtrera med värden",
            "filtered": "Filtrerade värden",
            "area": "Filtrera med områden"
        },
        "layer": {
            "name": "Områdesindelning av tematiska kartan",
            "inspireName": "Tematisk karta",
            "organizationName": "Tematisk karta"
        }
    }
});