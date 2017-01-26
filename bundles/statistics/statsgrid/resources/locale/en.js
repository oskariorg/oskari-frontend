Oskari.registerLocalization(
{
    "lang": "en",
    "key": "StatsGrid",
    "value": {
        "title": "Patio",
        "desc": "",
        "tile": {
            "title": "Thematic maps"
        },
        "view": {
            "title": "Patio",
            "message": "patiopoc"
        },
        "layertools": {
            "table_icon": {
                "tooltip": "Go to thematic maps",
                "title": "Thematic maps"
            },
            "diagram_icon": {
                "tooltip": "Show diagram",
                "title": "Diagram"
            },
            "statistics": {
                "tooltip": "going to the thematic maps",
                "title": "Statistics"
            }
        },
        "tab": {
            "title": "Indicators",
            "description": "Own indicators",
            "grid": {
                "name": "Title",
                "description": "Descriptiopn",
                "organization": "Data source",
                "year": "Year",
                "delete": "Delete"
            },
            "deleteTitle": "Delete Indicator",
            "destroyIndicator": "Delete",
            "cancelDelete": "Cancel",
            "confirmDelete": "Are you sure you want to delete the indicator",
            "newIndicator": "New indicator",
            "error": {
                "title": "Erro",
                "indicatorsError": "Indicators could not be loaded.",
                "indicatorError": "The indicator could not be loaded.",
                "indicatorDeleteError": "The indicator could not be deleted."
            }
        },
        "gender": "Gender",
        "genders": {
            "male": "men",
            "female": "women",
            "total": "total"
        },
        "addColumn": "Get data",
        "removeColumn": "Remove",
        "indicators": "Indicator",
        "cannotDisplayIndicator": "Indicator has no values at this regional classification. Please select another regional classification and try again.",
        "availableRegions": "Values are available for the following regional classifications:",
        "year": "Year",
        "buttons": {
            "ok": "OK",
            "cancel": "Cancel",
            "filter": "Filter"
        },
        "stats": {
            "municipality": "Municipality",
            "code": "Code",
            "errorTitle": "Error",
            "regionDataError": "Regional classifications could not be loaded.",
            "regionDataXHRError": "Regional classifications could not be loaded.",
            "indicatorsDataError": "Indicator data could not be loaded.",
            "indicatorsDataXHRError": "Indicator data could not be loaded.",
            "indicatorMetaError": "Indicator metadata could not be loaded.",
            "indicatorMetaXHRError": "Indicator metadata could not be loaded.",
            "indicatorDataError": "Indicator data could not be loaded.",
            "indicatorDataXHRError": "Indicator data could not be loaded.",
            "descriptionTitle": "Description",
            "sourceTitle": "Data source"
        },
        "classify": {
            "classify": "Classification",
            "classifymethod": "Classification method",
            "classes": "Class division",
            "jenks": "Natural breaks",
            "quantile": "Quantiles",
            "eqinterval": "Equal intervals",
            "manual": "Manual classification",
            "manualPlaceholder": "Separate values by a comma",
            "manualRangeError": "The class breaks are invalid. The break values should be between {min} and {max}. Separate values by a comma and decimals by a dot. Please check class breaks and try again.",
            "nanError": "The given value is not a number. Decimals are sparated by a dot. Please check the value and try again.",
            "infoTitle": "Manual classification",
            "info": "Input class breaks again as numbers separated with a comma. Decimal are separated with a dot. For example by inputting \"\"0, 10.5, 24, 30.2, 57, 73.1\" you get five classes which have values between  \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" ja \"57-73,1\". The indicator's values smaller than the minimum value (0) or larger than the maximum value (73,1) are not shown on the map. The class breaks should be numbers between {min} and {max}.",
            "mode": "Class breaks continuity",
            "modes": {
                "distinct": "Continuous",
                "discontinuous": "Discrete"
            }
        },
        "colorset": {
            "button": "Colors",
            "flipButton": "Flip colors",
            "themeselection": "Select color scheme",
            "setselection": "Color set selection",
            "sequential": "Quantitative",
            "qualitative": "Qualitative",
            "divergent": "Divisible",
            "info2": "Select colors by clicking a color group you want.",
            "cancel": "Cancel"
        },
        "statistic": {
            "title": "Descriptive statistics",
            "avg": "Average",
            "max": "Maximum value",
            "mde": "Mode",
            "mdn": "Median",
            "min": "Minimum value",
            "std": "Standard deviation",
            "sum": "Sum",
            "tooltip": {
                "avg": "An average is a number that describes what is the most typical value in the indicator. It is computed by dividing the sum of values with the number of values.",
                "max": "A maximum is the largest value in the indicator.",
                "mde": "A mode is the most common value in the indicator.",
                "mdn": "A median is the middle number in a sorted list of numbers. If there is an even number of values, the median is an average of two middle values.",
                "min": "A minimum is the smallest value in the indicator.",
                "std": "A standard deviation is an average variation of values from the average of values.",
                "sum": "A sum is the aggregate of the indicator values."
            }
        },
        "baseInfoTitle": "Identification Data",
        "dataTitle": "Indicator",
        "noIndicatorData": "Indicator has no values at this regional classification. Please select another regional classification and try again.",
        "values": "values",
        "included": "Values",
        "municipality": "Municipalities",
        "selectRows": "Select rows",
        "select4Municipalities": "Select at least two regions.",
        "showSelected": "Show only selected areas",
        "not_included": "Not selected",
        "noMatch": "No indicators found by the given search term.",
        "selectIndicator": "Select an indicator",
        "noDataSource": "No data sources found.",
        "selectDataSource": "Select a data source",
        "filterTitle": "Filter Values",
        "indicatorFilterDesc": "Filter indicator values by value or by region. You can make separate filters for every column.",
        "filterIndicator": "Indicator",
        "filterCondition": "Condition",
        "filterSelectCondition": "Select condition",
        "filterGT": "Greater than (>)",
        "filterGTOE": "Greater than or equal to (>=)",
        "filterE": "Equal (=)",
        "filterLTOE": "Less than or equal to (<=)",
        "filterLT": "Less than (<)",
        "filterBetween": "In between (exclusive)",
        "filter": "Filter",
        "filterByValue": "By value",
        "filterByRegion": "By region",
        "selectRegionCategory": "Regional classification",
        "regionCatPlaceholder": "Select a regional classification",
        "selectRegion": "Region",
        "chosenRegionText": "Select a region",
        "noRegionFound": "The region could not be found.",
        "regionCategories": {
            "title": "Regional classifications",
            "ERVA": "ERVA area (Special responsibility area)",
            "ELY-KESKUS": "ELY centre (Centre for Economic Development, Transport and the Environment)",
            "KUNTA": "Municipality",
            "ALUEHALLINTOVIRASTO": "Regional State Administrative Agency",
            "MAAKUNTA": "Region",
            "NUTS1": "Mainland Finland and Åland",
            "SAIRAANHOITOPIIRI": "Hospital district",
            "SEUTUKUNTA": "Subregion",
            "SUURALUE": "Major region"
        },
        "addDataButton": "Add indicator",
        "addDataTitle": "Add indicator values by region",
        "openImportDialogTip": "Import data from clipboard",
        "openImportDataButton": "Import data",
        "addDataMetaTitle": "Title",
        "addDataMetaTitlePH": "Indicator title",
        "addDataMetaSources": "Data source",
        "addDataMetaSourcesPH": "Source reference",
        "addDataMetaDescription": "Description",
        "addDataMetaDescriptionPH": "Indicator description",
        "addDataMetaReferenceLayer": "Regional classification",
        "addDataMetaYear": "Year",
        "addDataMetaYearPH": "Source year",
        "addDataMetaPublicity": "Publishable",
        "municipalityHeader": "Municipalities",
        "dataRows": "Values by region",
        "municipalityPlaceHolder": "Give value",
        "formEmpty": "Clear form",
        "formCancel": "Cancel",
        "formSubmit": "Save indicator",
        "cancelButton": "Cancel",
        "clearImportDataButton": "Clear",
        "importDataButton": "Add values",
        "popupTitle": "Import data",
        "importDataDescription": "Copy here the indicator data. Type to one row a region and its corresponding value. Type region's name or identifier. Separate region and its value with a tabulator, a colon or a comma. One row should look like the following:\r\nExample 1: Helsinki, 1234\r\nExample 2: 009: 5678",
        "failedSubmit": "The indicator could not be saved. Add the following data and try again:",
        "connectionProblem": "The indicator could not be saved.",
        "parsedDataInfo": "The imported regions totally:",
        "parsedDataUnrecognized": "Unknown regions",
        "loginToSaveIndicator": "If you want to save the indicator, please log in."
    }
});
