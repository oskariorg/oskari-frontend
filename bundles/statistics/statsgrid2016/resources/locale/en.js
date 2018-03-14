Oskari.registerLocalization(
{
    "lang": "en",
    "key": "StatsGrid",
    "value": {
        "tile": {
            "title": "Thematic maps",
            "search": "Search data",
            "table": "Table",
            "diagram": "Bar chart"
        },
        "flyout": {
            "title": "Thematic maps"
        },
        "dataProviderInfoTitle": "Indicators",
        "layertools": {
            "table_icon": {
                "tooltip": "Move to thematic maps",
                "title": "Thematic maps"
            },
            "diagram_icon": {
                "tooltip": "Show data in diagram",
                "title": "Diagram"
            },
            "statistics": {
                "tooltip": "Move to thematic maps",
                "title": "Statistics"
            }
        },
        "panels": {
            "newSearch": {
                "title": "SEARCH DATA",
                "datasourceTitle": "Data provider",
                "indicatorTitle": "Data",
                "selectDatasourcePlaceholder": "Select data source",
                "selectIndicatorPlaceholder": "Select data",
                "noResults": "No results found matching",
                "refineSearchLabel": "Specify contents of the examined data",
                "refineSearchTooltip1": "You will get more options after choosing data provider and data.",
                "refineSearchTooltip2": "",
                "addButtonTitle": "Get contents of data",
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
            },
            "extraFeatures": {
                "title": "Additional features",
                "hideMapLayers": "Hide other map layers",
                "openTableCheckbox": "Open table",
                "openDiagramCheckbox": "Open bar chart"
            }
        },
        "statsgrid": {
            "title": "SEARCHED DATA",
            "noResults": "No data selected",
            "areaSelection": {
                "title": "AREAL DIVISION",
                "info": "Redefine areal division for data from dropdown list"
            },
            "source": "Data",
            "orderBy": "Sort",
            "orderByAscending": "Sort ascending",
            "orderByDescending": "Sort descending",
            "removeSource": "Remove data"
        },
        "legend": {
            "title": "Classification",
            "noActive": "Data was not selected, select data to see map classification.",
            "noEnough": "The data is too small to be classified, try different data or change limitings.",
            "cannotCreateLegend": "Legend cannot be created by chosen values, try different values."
        },
        "diagram": {
            "title": "Diagram"
        },
        "parameters": {
            "sex": "Gender",
            "year": "Year",
            "regionset": "Area"
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
                "jenks": "Natural intervals",
                "quantile": "Quantiles",
                "equal": "Equal intervals"
            },
            "manual": "Manual interval classification",
            "manualPlaceholder": "Separate values with commas.",
            "manualRangeError": "Class breaks are erroneous. Class breaks must be between {min} - {max}. Separate values with commas. Use decimal point as separator mark. Correct class breaks and try again.",
            "nanError": "Given value is not a number. Correct value and try again. Use decimal point as separator mark.",
            "infoTitle": "Manual interval classification",
            "info": "Give class breaks as numbers separated with comma. Use decimal point as separator mark. For example by entering \"0, 10.5, 24, 30.2, 57, 73.1\" you get five classes which values are between \"0-10,5\", \"10,5-24\", \"24-30,2\", \"30,2-57\" and \"57-73,1\". Indicator values which are smaller than lowest class break (in previous exaple 0) or bigger than highest class break (73,1) are not shown in the map. Class breaks must be between smallest and largest value of the indicator.",
            "mode": "Class breaks",
            "modes": {
                "distinct": "Continuous",
                "discontinuous": "Discontinuous"
            },
            "editClassifyTitle": "Modify classification",
            "classifyFieldsTitle": "Classification values",
            "map": {
                "mapStyle": "Map style",
                "choropleth": "Choropleth map",
                "points": "Point symbol map",
                "pointSize": "Point size",
                "min": "Minimum",
                "max": "Maximum",
                "color": "Color",
                "transparency": "Transparency",
                "showValues": "Show values"
            }
        },
        "colorset": {
            "button": "Colors",
            "flipButton": "Flip colors",
            "themeselection": "Select colors for classes",
            "setselection": "Distribution",
            "seq": "Quantitative",
            "qual": "Qualitative",
            "div": "Diverging",
            "info2": "Choose colors by clicking color scheme.",
            "cancel": "Cancel"
        },
        "errors": {
            "title": "Error",
            "indicatorListError": "Error occurred in data provider search.",
            "indicatorListIsEmpty": "Data provider's data list is empty.",
            "indicatorMetadataError": "Error occurred in data selection search.",
            "indicatorMetadataIsEmpty": "There are no selections for the data.",
            "regionsetsIsEmpty": "Area selections could not be fetched for chosen data.",
            "regionsDataError": "Error occurred in area value search.",
            "regionsDataIsEmpty": "Area values could not be fetched for chosen data."
        },
        "datacharts": {
          "flyout": "Searched data",
          "barchart": "Bar chart",
          "linechart": "Line chart",
          "table": "Table",
          "desc": "Table and graphs",
          "nodata": "Indicators were not chosen",
          "indicatorVar": "Variable to be shown in graph",
          "descColor": "Color of the graph",
          "selectClr": "Selected color",
          "clrFromMap": "Colors by classification in the map",
          "chooseColor": "Select color",
          "sorting": {
              "desc": "Order",
              "name-ascending": "Name ascending",
              "name-descending": "Name descending",
              "value-ascending": "Value ascending",
              "value-descending": "Value descending"
          }
        },
        "filter": {
            "title": "Filtering",
            "indicatorToFilter": "Variable to be filtered",
            "condition": "Condition",
            "value": "Value",
            "variable": "Variable",
            "conditionPlaceholder": "Select condition",
            "greater": "Greater than (>)",
            "greaterEqual": "Greater than or equal to (>=)",
            "equal": "Equal to (=)",
            "lessEqual": "Less than or equal to (<=)",
            "lessThan": "Less than (<)",
            "between": "Between (exclusive)",
            "filter": "Filter values",
            "desc": "Filter by values",
            "filtered": "Filtered values",
            "area": "Filter by areas"
        },
        "layer": {
            "name": "Areal division of thematic map",
            "inspireName": "Thematic map",
            "organizationName": "Thematic map"
        }
    }
});