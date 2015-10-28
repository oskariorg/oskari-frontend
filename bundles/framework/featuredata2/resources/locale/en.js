Oskari.registerLocalization(
{
    "lang": "en",
    "key": "FeatureData2",
    "value": {
        "title": "Feature Data",
        "desc": "",
        "loading": "Loading...",
        "showmore": "Show",
        "nodata": "Feature data are not available for the selected map layers.",
        "featureNameAll": "Data type",
        "errorscale": "Feature data are not available on this scale level. Please use the scale bar to select another scale level.",
        "errordata": "Feature data are invalid. Please update data by panning the map view slightly.",
        "columnSelectorTooltip": "Select visible columns",
        "featureDataPopup": "Statistical values",
        "selectionTools": {
            "title": "Select Features",
            "instructions": " ",
            "selectFromTop": "From topmost layer",
            "selectAll": "From all layers",
            "link": {
                "title": "Select more features"
            },
            "button": {
                "cancel": "Close",
                "empty": "Deselect All",
                "show": "Show features",
                "close": "Close",
                "edit": "Edit"
            },
            "tools": {
                "point": {
                    "tooltip": "Draw a point. If the point is inside a feature, the feature will be selected."
                },
                "line": {
                    "tooltip": "Draw a line. If the line intersects a feature, the feature will be selected."
                },
                "polygon": {
                    "tooltip": "Draw a polygon. If the polygon intersects a feature, the feature will be selected."
                },
                "square": {
                    "tooltip": "Draw a square. If the square intersects a feature, the square will be selected."
                },
                "circle": {
                    "tooltip": "Draw a circle. If the circle intersects a feature, the feature will be selected."
                },
                "select": {
                    "tooltip": "Draw a geometry and select features based on that geometry."
                }
            }
        },
        "layer": {
            "style": "Style",
            "show": "Show",
            "hide": "Hide",
            "hidden": "The map layer is temporarily hidden.",
            "out-of-scale": "The map layer cannot be shown at this scale level.",
            "move-to-scale": "Move to a suitable map level.",
            "out-of-content-area": "The map layer has no features at the map view area.",
            "move-to-content-area": "Move to a suitable location.",
            "description": "Description",
            "object-data": "Feature data",
            "rights": {
                "notavailable": "Publication prohibited",
                "guest": "Please log in, if you want to publish the map layer in an embedded map.",
                "loggedin": "Publication permitted",
                "official": "Publishable only for authorities",
                "need-login": "Please log in to publish embedded maps.",
                "can_be_published_by_provider": {
                    "label": "Publication permitted for data providers",
                    "tooltip": "The map layer is publishable in embedded maps only for data providers. If you are a data provider, please contact the support service."
                },
                "can_be_published": {
                    "label": "Publication permitted",
                    "tooltip": "The map layer is publishable in embedded maps. The usage limit is not limited."
                },
                "can_be_published_map_user": {
                    "label": "Publication permitted",
                    "tooltip": "The map layer is publishable in embedded maps. The weekly usage limit may be limited."
                },
                "no_publication_permission": {
                    "label": "Publication prohibited",
                    "tooltip": "The map layer is not publishable in embedded maps. The data provider has not granted permissions."
                },
                "can_be_published_by_authority": {
                    "label": "Publication permitted for authorities",
                    "tooltip": "The map layer is publishable in embedded maps only for authorities. If you are an authority, please contact the support service."
                }
            },
            "tooltip": {
                "type-base": "Background map",
                "type-wms": "Map layer",
                "type-wfs": "Data product"
            },
            "filter": {
                "title": "Filter",
                "description": "Filter values on map layer:",
                "cancelButton": "Cancel",
                "clearButton": "Clear filter",
                "refreshButton": "Refresh filter",
                "addFilter": "Add filter",
                "removeFilter": "Remove filter",
                "bbox": {
                    "title": "Map filter",
                    "on": "Only features visible on the map",
                    "off": "All features"
                },
                "clickedFeatures": {
                    "title": "Feature filter",
                    "label": "Only features selected on the map"
                },
                "values": {
                    "title": "Attribute filter",
                    "placeholders": {
                        "case-sensitive": "Filter is case-sensitive",
                        "attribute": "Attribute",
                        "boolean": "Logical operator",
                        "operator": "Operator",
                        "attribute-value": "Value"
                    },
                    "equals": "on yhtäsuuri kuin",
                    "like": "on likimäärin yhtäsuuri kuin",
                    "notEquals": "on erisuuri kuin",
                    "notLike": "on likimäärin erisuuri kuin",
                    "greaterThan": "on suurempi kuin",
                    "lessThan": "on pienempi kuin",
                    "greaterThanOrEqualTo": "on suurempi tai yhtä suuri kuin",
                    "lessThanOrEqualTo": "on pienempi tai yhtä pieni kuin"
                },
                "aggregateAnalysisFilter": {
                    "addAggregateFilter": "Use statistical values",
                    "aggregateValueSelectTitle": "Select Statistical Values",
                    "selectAggregateAnalyse": "Select analysis layer",
                    "selectIndicator": "Select property",
                    "selectReadyButton": "Close",
                    "getAggregateAnalysisFailed": "The statistical values could not be fetched.",
                    "noAggregateAnalysisPopupTitle": "Statistical Values Not Found",
                    "noAggregateAnalysisPopupContent": "The statistical values are not computed for this map layer. You can compute them in the Analysis function."
                },
                "validation": {
                    "title": "Features could not be filtered. The following errors occurred:",
                    "attribute_missing": "The attribute is missing.",
                    "operator_missing": "The operator is missing.",
                    "value_missing": "The value is missing.",
                    "boolean_operator_missing": "The logical operator is missing."
                }
            }
        },
        "gridFooter": {
            "aggregateColumnField": "Count",
            "noDataMessage": "Count = Number of features without unauthorized features",
            "noDataCommonMessage": "There are unauthorized feature values in the data"
        }
    }
}
);