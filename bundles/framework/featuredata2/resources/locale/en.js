Oskari.registerLocalization({
    "lang": "en",
    "key": "FeatureData2",
    "value": {
        "title": "Feature Data",
        "desc": "",
        "loading": "Loading...",
        "showmore": "Show",
        "nodata": "The selected map layers contain no feature data.",
        "featureNameAll": "Data type",
        "errorscale": "The feature data on this map layer cannot be shown on this scale level. Please change the scale level at scale bar.",
        "errordata": "The feature data at the server contains errors. Please update the map by moving it slightly.",
        "columnSelectorTooltip": "Select visible columns.",
        "popup": {
            "title": "Select features on the map.",
            "instructions": " ",
            "link": {
                "title": "Select more features"
            },
            "button": {
                "cancel": "Cancel",
                "empty": "Remove selection",
                "show": "Show features",
                "close": "Close",
                "edit": "Edit"
            },
            "tools": {
                "point": {
                    "tooltip": "Add a point feature to the map."
                },
                "line": {
                    "tooltip": "Add a line feature to the map."
                },
                "polygon": {
                    "tooltip": "Add an area feature to the map."
                },
                "square": {
                    "tooltip": "Add a rectangular area feature to the map."
                },
                "circle": {
                    "tooltip": "Add a circular area feature to the map."
                },
                "select": {
                    "tooltip": "Select features"
                }
            }
        },
        "layer": {
            "style": "Style",
            "show": "Show",
            "hide": "Hide",
            "hidden": "The map layer has been temporarily hidden.",
            "out-of-scale": "The map layer cannot be shown at this scale level.",
            "move-to-scale": "Please move to a suitable scale level.",
            "out-of-content-area": "The map layer contains no data at this location.",
            "move-to-content-area": "Please move to a suitable location.",
            "description": "Description",
            "object-data": "Feature data",
            "rights": {
                "notavailable": "Publication prohibited.",
                "guest": "Please log in to publish the map layer in an embedded map.",
                "loggedin": "Publication permitted",
                "official": "Publication permitted only for use by authorities.",
                "need-login": "You need to log in to publish the map level in an embedded map.",
                "can_be_published_by_provider": {
                    "label": "Publication permitted as a data provider",
                    "tooltip": "Only the data provider can publish the map layer in an embedded map.  If you are a data provider, please contact the support service of Paikkatietoikkuna."
                },
                "can_be_published": {
                    "label": "Publication permitted",
                    "tooltip": "The map layer can be published in an embedded map. The limit of the usage is not limited."
                },
                "can_be_published_map_user": {
                    "label": "Publication permitted",
                    "tooltip": "The map layer can be published in an embedded map. The limit of the usage may be limited."
                },
                "no_publication_permission": {
                    "label": "Publication prohibited",
                    "tooltip": "The map layer cannot be published in an embedded map. The data provider has not granted permission to that."
                },
                "can_be_published_by_authority": {
                    "label": "Publication permitted",
                    "tooltip": "The map layer can be published in an embedded map. The limit of the usage is not limited."
                }
            },
            "tooltip": {
                "type-base": "Background map",
                "type-wms": "Map layer",
                "type-wfs": "Data product"
            },
            "filter": {
                "title": "Filter",
                "description": "Select the features from the map layer:",
                "cancelButton": "Cancel",
                "clearButton": "Clear the filter",
                "refreshButton": "Refresh the filter",
                "addFilter": "Add a new filter",
                "removeFilter": "Delete the filter",
                "bbox": { 
                    "title": "Map window filter", 
                    "on": "Only the feature visible on the map window.", 
                    "off": "All features." 
                },
                "clickedFeatures": { 
                    "title": "Feature selection filter", 
                    "label": "Only the features selected on the map." 
                },
                "values": {
                    "title": "Filter the features by attribute data",
                    "placeholders": { 
                        "case-sensitive": "The filter is case sensitive.", 
                        "attribute": "Attribute", 
                        "boolean": "Logical operator", 
                        "operator": "Operator", 
                        "attribute-value": "Value" 
                    },
                    "equals": "is equal to",
                    "like": "is like",
                    "notEquals": "is not equal to",
                    "notLike": "is not like",
                    "greaterThan": "is greater than",
                    "lessThan": "is smaller than",
                    "greaterThanOrEqualTo": "is greater than or equal to",
                    "lessThanOrEqualTo": "is smaller than or equal to"
                },
                "aggregateAnalysisFilter": { 
                    "addAggregateFilter": "Previously calculated key ratios", 
                    "aggregateValueSelectTitle": "Use a previously calculated key ratios", 
                    "selectAggregateAnalyse": "Select an analysis layer", 
                    "selectIndicator": "Select property", 
                    "selectReadyButton": "Close", 
                    "getAggregateAnalysisFailed": "The aggregate data could not be found.", 
                    "noAggregateAnalysisPopupTitle": "The aggregate analysis did not found.", 
                    "noAggregateAnalysisPopupContent": "You have not done any aggregate analysis. You can create your own aggregata data by the analysis function and then use values in filtering." 
                },
                "validation": { 
                    "title": "The filter could not be refreshed because of following mistakes:", 
                    "attribute_missing": "The attribute is missing.", 
                    "operator_missing": "The operator is missing.", 
                    "value_missing": "The value is missing.", 
                    "boolean_operator_missing": "The logical operator is missing." 
                }
            }
        }
    }
});
