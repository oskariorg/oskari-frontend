Oskari.registerLocalization(
{
    "lang": "en",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Thematic maps"
        },
        "flyout": {
            "title": "Thematic maps"
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
        "panels": {
            "newSearch": {
                "title": "DATA SEARCH",
                "datasourceTitle": "Data source",
                "indicatorTitle": "Indicator",
                "selectDatasourcePlaceholder": "Select data source",
                "selectIndicatorPlaceholder": "Select an indicator",
                "noResults": "No search results found",
                "refineSearchLabel": "Refine selected content",
                "refineSearchTooltip1": "To view the options you must first select the data provider and data",
                "refineSearchTooltip2": "",
                "addButtonTitle": "Get data",
                "defaultPlaceholder": "Select value",
                "selectionValues": {
                    "sex": {
                        "placeholder": "Select gender",
                        "male": "Men",
                        "female": "Women",
                        "total": "Total"
                    },
                    "year": {
                        "placeholder": "Select year"
                    },
                    "regionset": {
                        "placeholder": "Select region"
                    }
                },
                "noRegionset": "No region selected"
            },
            "extraFeatures": {
                "title": "Additional terms and features",
                "showMapLayers": "Show map layers"
            }
        },
        "statsgrid": {
            "title": "SEARCHED DATA",
            "noResults": "No selected data",
            "areaSelection": {
                "title": "REGION",
                "info": "Redefine the areas in which you want to view the data, click the drop-down menu"
            },
            "source": "Source",
            "orderBy": "Order by",
            "orderByAscending": "Order by ascending",
            "orderByDescending": "Order by descending",
            "removeSource": "Remove source"
        },
        "legend": {
            "title": "Classification",
            "noActive": "No data selected, select data to view classification.",
            "noEnough": "Dataset is too small for classification. Try another dataset or edit search options.",
            "cannotCreateLegend": "Cannot create legend. Try another classification options."
        },
        "parameters": {
            "sex": "Gender",
            "year": "Year",
            "regionset": "Region"
        },
        "datatable": "Table",
        "published": {
            "showMap": "Show map",
            "showTable": "Show table"
        },
        "classify": {
            "classify": "Classification",
            "classifymethod": "Classification method",
            "classes": "Class division",
            "methods" : {
                "jenks": "Natural breaks",
                "quantile": "Quantiles",
                "equal": "Equal intervals"
            },
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
            },
            "editClassifyTitle": "Edit classification",
            "classifyFieldsTitle": "Classification values"
        },
        "colorset": {
            "button": "Colors",
            "flipButton": "Flip colors",
            "themeselection": "Select color scheme",
            "setselection": "Color set selection",
            "seq": "Quantitative",
            "qual": "Qualitative",
            "div": "Divisible",
            "info2": "Select colors by clicking a color group you want.",
            "cancel": "Cancel"
        }
    }
});
