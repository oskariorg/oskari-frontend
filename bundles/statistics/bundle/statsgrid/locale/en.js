Oskari.registerLocalization({
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
        "tab": {
            "title": "Indicators",
            "grid": {
                "name": "Title",
                "description": "Description",
                "delete": " "
            },
            "deleteTitle": "Deleting indicator",
            "destroyIndicator": "Delete",
            "cancelDelete": "Cancel",
            "confirmDelete": "Are you sure you want to delete indicator ",
            "newIndicator": "New indicator",
            "error": {
                "title": "Error",
                "indicatorsError": "Error occurred whilst loading the indicators. Please try again later",
                "indicatorError": "Error occurred whilst loading an indicator. Please try again later",
                "indicatorDeleteError": "Error occurred whilst removing an indicator. Please try again later"
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
        "indicators": "Indicators",
        "cannotDisplayIndicator": "The indicator does not have values on the selected region category so it cannot be displayed in the grid.",
        "availableRegions": " The following region categories have values on the indicator: ",
        "year": "Year",
        "buttons": {
            "ok": "OK",
            "cancel": "Cancel",
            "filter": "Filter"
        },
        "sotka": {
            "municipality": "Municipality",
            "code": "Code",
            "errorTitle": "Error",
            "regionDataError": "Error in getting sotka region data.",
            "regionDataXHRError": "Error loading sotka region data",
            "indicatorsDataError": "Error in getting sotka indicators.",
            "indicatorsDataXHRError": "Error loading sotka indicators",
            "indicatorMetaError": "Error in getting sotka indicator metadata",
            "indicatorMetaXHRError": "Error loading sotka indicator metadata",
            "indicatorDataError": "Error in getting sotka indicator data",
            "indicatorDataXHRError": "Error loading sotka indicator data",
            "descriptionTitle": "Description",
            "sourceTitle": "Source"

        },
        "classify": {
            "classify": "Classify",
            "classifymethod": "Method",
            "classes": "Classes",
            "jenks": "Jenks ranges",
            "quantile": "Quantile ranges",
            "eqinterval": "Eqinterval",
            "manual": "Manual breaks",
            "manualPlaceholder": "Input numbers separated with a comma.",
            "manualRangeError": "There should be at least {min} and at most {max} numbers!",
            "nanError": "A value was not a number!",
            "infoTitle": "Manual breaks",
            "info": "Input manual breaks separated with a comma. Period works as a decimal separator. First enter the lower bound, then the class bounds and finally the upper bound. E.g. by entering \"0, 10.5, 24, 30.2, 57, 73.1\" you'll get five classes with lower and upper bounds set to 0 and 73,1 and class bounds between those. Values left outside the bounds will be excluded.",
            "mode": "Class limits",
            "modes": {
                "distinct": "Continuous",
                "discontinuous": "Discrete"
            }
        },
        "colorset": {
            "button": "Colors",
            "flipButton": "Flip colors",
            "themeselection": "Color theme selection",
            "setselection": "Color set selection",
            "sequential": "Sequential",
            "qualitative": "qualitative",
            "divergent": "Divergent",
            "info2": "Color range selection - ",
            "cancel": "Exit"

        },
        "statistic": {
            "title": "Statistical variables",
            "avg": "Average",
            "max": "Maximum value",
            "mde": "Mode",
            "mdn": "Median",
            "min": "Minimum value",
            "std": "Standard deviation",
            "sum": "Sum"
        },
        "values": "values",
        "included": "Values",
        "municipality": "Municipalities",
        "selectRows": "Select rows",
        "select4Municipalities": "Select 4 municipalities",
        "showSelected": "Show only selected areas on the grid",
        "not_included": "Not included",
        "noMatch": "No results matched",
        "selectIndicator": "Select an indicator",
        "filterTitle"           : "Filter out column data",
        "indicatorFilterDesc"   : "Filtered values are selected in the grid. You can set filtering separately for every column.",
        "filterIndicator"       : "Indicator:",
        "filterCondition"       : "Condition:",
        "filterSelectCondition" : "Select condition",
        "filterGT"              : "Greater than (>)",
        "filterGTOE"            : "Greater than or equal to (>=)",
        "filterE"               : "Equal (=)",
        "filterLTOE"            : "Less than or equal to (<=)",
        "filterLT"              : "Less than (<)",
        "filterBetween"         : "In between",
        "filter"                : "Filter",
        "filterByValue"         : "By value",
        "filterByRegion"        : "By region",

        "selectRegionCategory"  : "Region categories:",
        "regionCatPlaceholder"  : "Choose a region category",
        "selectRegion"          : "Regions:",
        "chosenRegionText"      : "Choose regions",
        "noRegionFound"         : "Region not found",
        "regionCategories"      : {
            "title"                 : "Region categories",
            "ALUEHALLINTOVIRASTO"   : "Aluehallintovirasto",
            "MAAKUNTA"              : "Maakunta",
            "NUTS1"                 : "Manner-Suomi ja Ahvenanmaa",
            "SAIRAANHOITOPIIRI"     : "Sairaanhoitopiiri",
            "SEUTUKUNTA"            : "Seutukunta",
            "SUURALUE"              : "Suuralue"
        },
        "addDataButton"             : "Add indicator",
        "addDataTitle"              : "Add your own indicator",
        "openImportDialogTip"       : "Import data from clipboard",
        "openImportDataButton"      : "Import data",
        "addDataMetaTitle"          : "Title",
        "addDataMetaTitlePH"        : "Indicator's title",
        "addDataMetaSources"        : "Source",
        "addDataMetaSourcesPH"      : "Data source",
        "addDataMetaDescription"    : "Description",
        "addDataMetaDescriptionPH"  : "Description",
        "addDataMetaReferenceLayer" : "Reference layer",
        "addDataMetaYear"           : "Year",
        "addDataMetaYearPH"         : "Year",
        "addDataMetaPublicity"      : "Publishable",
        "municipalityHeader"        : "Municipalities",
        "municipalityPlaceHolder"   : "Give value",
        "formCancel"                : "Cancel",
        "formSubmit"                : "Submit",
        "cancelButton"              : "Cancel",
        "importDataButton"          : "Import",
        "popupTitle"                : "Import data",
        "importDataDescription"     : "You can bring region value duples by copying them to the textarea. <br>Place every municipality to their own row. You can separate the values with tabulator, colon or comma.<br>Example 1: Alajärvi, 1234<br>Example 2: 009    2100",
        "failedSubmit"              : "Add indicator's metadata: ",
        "connectionProblem"         : "We could not save the data due to connection problems",
        "parsedDataInfo"            : "Imported regions count",
        "parsedDataUnrecognized"    : "Unrecognized regions count"
    }
});
