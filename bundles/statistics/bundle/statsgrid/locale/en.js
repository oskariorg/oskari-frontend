Oskari.registerLocalization({
    "lang" : "en",
    "key" : "StatsGrid",
    "value" : {
        "title" : "Patio",
        "desc" : "",
        "tile" : {
            "title" : "Patio"
        },
        "view" : {
            "title" : "Patio",
            "message" : "patiopoc"
        },
        "gender": "Gender",
        "genders" : {
            "male" : "men",
            "female": "women",
            "total": "total"
        },
        "addColumn": "Get data",
        "removeColumn" : "Remove",
        "indicators" : "Indicators",
        "year": "Year",
        "buttons" : {
            "ok"    : "OK",
            "cancel": "Cancel"
        },
        "sotka": {
            "municipality":             "Municipality",
            "code" :                    "Code",
            "errorTitle" :              "Error",
            "regionDataError":          "Error in getting sotka region data.",
            "regionDataXHRError":       "Error loading sotka region data",
            "indicatorsDataError":      "Error in getting sotka indicators.",
            "indicatorsDataXHRError":   "Error loading sotka indicators",
            "indicatorMetaError" :      "Error in getting sotka indicator metadata",
            "indicatorMetaXHRError" :   "Error loading sotka indicator metadata",
            "indicatorDataError" :      "Error in getting sotka indicator data",
            "indicatorDataXHRError" :   "Error loading sotka indicator data",
            "descriptionTitle" :        "Description",
            "sourceTitle" :             "Source"

        },
        "classify": {
            "classify":                 "Classify",
            "classifymethod":           "Method",
            "classes":                  "Classes",
            "jenks":                    "Jenks ranges",
            "quantile" :                "Quantile ranges",
            "eqinterval" :              "Eqinterval",
            "manual":                   "Manual breaks",
            "manualPlaceholder":        "Input numbers separated with a comma.",
            "manualRangeError":         "There should be at least {min} and at most {max} numbers!",
            "nanError":                 "A value was not a number!",
			"infoTitle":                "Manual breaks",
			"info":                     "Input manual breaks separated with a comma. Period works as a decimal separator. First enter the lower bound, then the class bounds and finally the upper bound. E.g. by entering \"0, 10.5, 24, 30.2, 57, 73.1\" you'll get five classes with lower and upper bounds set to 0 and 73,1 and class bounds between those. Values left outside the bounds will be excluded."
        },
        "colorset" : {
            "button": "Colors",
            "flipButton": "Flip colors",
			"themeselection" : "Color theme selection",
			"setselection" : "Color set selection",
			"sequential" : "Sequential",
			"qualitative" : "qualitative",
			"divergent" : "Divergent",
			"info2" : "Color range selection - ",
			"cancel" : "Poistu"
			
		},
        "statistic" : {
            "avg" : "Average",
            "max" : "Maximum value",
            "mde" : "Mode",
            "mdn" : "Median",
            "min" : "Minimum value",
            "std" : "Standard deviation",
            "sum" : "Sum"
        },
        "values"        : "values",
        "municipality"  : "Municipalities",
        "selectRows"    : "Select rows",
        "not_included"  : "Not included municipalities",
        "noMatch"       : "No results matched",
        "selectIndicator": "Select an indicator"

    }
});
