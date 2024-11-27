Oskari.registerLocalization({
    "lang": "is",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Þemakort",
            "search": "Leitargögn",
            "grid": "Tafla",
            "diagram": "Súlurit"
        },
        "flyout": {
            "title": "Þemakort"
        },
        "dataProviderInfoTitle": "Indicators",
        "layerTool": {
            "tooltip": "Move to thematic maps",
            "title": "Thematic maps"
        },
        'publisher': {
            "label": "Þemakort",
            "tooltip": "Sýna þemakort á kortinu.",
            "grid": "Sýna þemagögn í töflunni.",
            "allowClassification": "Leyfa flokkun",
            "transparent": "Set classification background transparent",
            "diagram": "Display charts",
            "classification": "Allow hiding classification",
            "series": "Allow hiding series player",
            "statistics": "Leitargögn"
        },
        "panels": {
            "newSearch": {
                "title": "SEARCH DATA",
                "seriesTitle": "Tímasería",
                "datasourceTitle": "Data source",
                "indicatorTitle": "Vísir",
                "regionsetTitle": "Sía eftir svæðum (valfrjálst)",
                "seriesLabel": "Fá gögn sem tímaseríu",
                "selectDatasourcePlaceholder": "Select data source",
                "selectIndicatorPlaceholder": "Select data",
                "selectRegionsetPlaceholder": "Select regionset",
                "noResults": "No results found matching",
                "refineSearchLabel": "Tilgreina innihald skoðaðra gagna",
                "refineSearchTooltip1": "Þú færð fleiri valkosti eftir að hafa valið gagnaveitu og gögn.",
                "refineSearchTooltip2": "",
                "addButtonTitle": "Fá innihald gagna",
                "clearButtonTitle": "Clear",
                "defaultPlaceholder": "Select value",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Select gender",
                        "male": "Male",
                        "female": "Female",
                        "total": "Altogether"
                    },
                    "year": {
                        "placeholder": "Select year"
                    },
                    "regionset": {
                        "placeholder": "Select areal division"
                    }
                },
                "noRegionset": "No area selected"
            }
        },
        "statsgrid": {
            "title": "SEARCHED DATA",
            "noResults": "No data selected",
            "noValues": "No values for the selected data",
            "areaSelection": {
                "title": "AREAL DIVISION"
            },
            "orderBy": "Sort",
            "orderByAscending": "Sort ascending",
            "orderByDescending": "Sort descending",
            "removeSource": "Remove data"
        },
        "series": {
            "speed": {
                "label": "Animation speed",
                "fast": "Fast",
                "normal": "Normal",
                "slow": "Slow"
            }
        },
        "diagram": {
            "title": "Diagram",
            "sort": {
                "desc": "Order",
                "name-ascending": "Name ascending",
                "name-descending": "Name descending",
                "value-ascending": "Value ascending",
                "value-descending": "Value descending"
            }
        },
        "parameters": {
            "sex": "Gender",
            "year": "Year",
            "Vuosi": "Year",
            "regionset": "Regional division",
            "from": "from",
            "to": "to"
        },
        "classify": {
            "classify": "Classification",
            "labels": {
                "method": "Classification method",
                "count": "Class division",
                "mode": "Class breaks",
                "mapStyle": "Map style",
                "type": "Distribution",
                "reverseColors": "Flip colors",
                "color": "Color",
                "colorset": "Colors",
                "pointSize": "Point size",
                "transparency": "Transparency",
                "showValues": "Show values",
                "fractionDigits": "Number of decimals"
            },
            "methods": {
                "jenks": "Natural intervals",
                "quantile": "Quantiles",
                "equal": "Equal intervals",
                "manual": "Manual classification"
            },
            "manual": "Manual interval classification",
            "manualPlaceholder": "Separate values with commas.",
            "manualRangeError": "Class breaks are erroneous. Class breaks must be between {min} - {max}. Separate values with commas. Use decimal point as separator mark. Correct class breaks and try again.",
            "nanError": "Given value is not a number. Correct value and try again. Use decimal point as separator mark.",
            "infoTitle": "Manual interval classification",
            "info": "Give class breaks as numbers separated with comma. Use decimal point as separator mark. For example by entering \"0, 10.5, 24, 30.2, 57, 73.1\" you get five classes which values are between \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" and \"57-73,1\". Indicator values which are smaller than lowest class break (in previous exaple 0) or bigger than highest class break (73,1) are not shown in the map. Class breaks must be between smallest and largest value of the indicator.",
            "modes": {
                "distinct": "Continuous",
                "discontinuous": "Discontinuous"
            },
            "edit": {
                "title": "Modify classification",
                "open": "Open the classification editor",
                "close": "Close the classification editor"
            },
            "classifyFieldsTitle": "Classification values",
            "mapStyles": {
                "choropleth": "Choropleth map",
                "points": "Point symbol map"
            },
            "pointSizes": {
                "min": "Minimum",
                "max": "Maximum"
            },
            "types": {
                "seq": "Quantitative",
                "qual": "Qualitative",
                "div": "Diverging"
            }
        },
        "errors": {
            "title": "Error",
            "indicatorListError": "Error occurred in data provider search.",
            "indicatorListIsEmpty": "Data provider's data list is empty.",
            "indicatorMetadataError": "Error occurred in data selection search.",
            "indicatorMetadataIsEmpty": "There are no selections for the data.",
            "regionsetsIsEmpty": "Area selections could not be fetched for chosen data.",
            "regionsDataError": "Error occurred in area value search.",
            "regionsDataIsEmpty": "Area values could not be fetched for chosen data.",
            "datasourceIsEmpty": "Datasource is empty.",
            "cannotDisplayAsSeries": "Indicator cannot be inspected as a series.",
            "noDataForIndicators": "Service did not return data for {indicators, plural, one {the indicator} other {indicators}}",
            "noActiveLegend": "Data was not selected, select data to see map classification.",
            "noEnough": "The data is too small to be classified, try different data or change limitings.",
            "noData": "Data is not available for the selected point in time.",
            "cannotCreateLegend": "Legend cannot be created by chosen values, try different values."
        },
        "missing": {
            "regionsetName": "Unknown"
        },
        "layer": {
            "name": "Areal division of thematic map",
            "inspireName": "Thematic map",
            "organizationName": "Thematic map"
        },
        "tab": {
            "title": "Indicators",
            "confirmDelete": "You are deleting the indicator \"{name}\". Do you want to delete the indicator?",
            "grid": {
                "name": "Name"
            }
        },
        "userIndicators": {
        },
        "indicatorList": {
            "title": "Indicators",
            "removeAll": "Remove all",
            "emptyMsg": "No selected indicators"
        },
        "metadataPopup": {
            "open": "Show indicator {indicators, plural, one {description} other {descriptions}}",
            "title": "Indicator {indicators, plural, one {description} other {descriptions}}",
            "noMetadata": "Service did not return {indicators, plural, one {description for the indicator} other {descriptions for the indicators}}"
        }
    }
});
