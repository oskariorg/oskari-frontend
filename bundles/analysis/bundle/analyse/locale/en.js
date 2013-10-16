Oskari.registerLocalization({
    "lang": "en",
    "key": "Analyse",
    "value": {
        "title": "Analysis",
        "flyouttitle": "Analysis",
        "desc": "",
        "btnTooltip": "Analysis",
        "AnalyseView": {
            "title": "Analysis",
            "content": {
                "label": "Data",
                "tooltip": "Add analyse data - push [Add data] button"
            },

            "method": {
                "label": "Method",
                "tooltip": "Select first data and after that the method",
                "options": [{
                        "id": "oskari_analyse_buffer",
                        "label": "Buffer",
                        "classForMethod": "buffer",
                        "selected": true,
                        "tooltip": ""
                    }, {
                        "id": "oskari_analyse_aggregate",
                        "label": "Aggregate",
                        "classForPreview": "aggregate",
                        "tooltip": ""
                    }, {
                        "id": "oskari_analyse_union",
                        "label": "Union",
                        "classForPreview": "union",
                        "tooltip": ""
                    }, {
                        "id": "oskari_analyse_intersect",
                        "label": "Intersect",
                        "classForPreview": "intersect",
                        "tooltip": ""
                    }
                ]
            },
            "aggregate" : {
                "label" : "Aggregate function",
                "options" : [{
                    "id" : "oskari_analyse_Count",
                    "label" : "Count",
                    "selected" : true
                },{
                    "id" : "oskari_analyse_Sum",
                    "label" : "Sum"
                }, {
                    "id" : "oskari_analyse_Min",
                    "label" : "Minimum"
                },{
                    "id" : "oskari_analyse_Max",
                    "label" : "Maximum"
                },{
                    "id" : "oskari_analyse_Average",
                    "label" : "Average"
                },{
                    "id" : "oskari_analyse_StdDev",
                    "label" : "Standard deviation"
                }],
                "attribute": "Choose an attribute"
            },
            "buffer_size": {
                "label": "Buffer size (meters)",
                "tooltip": "Enter buffer size"
            },
            "analyse_name": {
                "label": "Name of analysis",
                "tooltip": "Enter analysis name"
            },
            "settings": {
                "label": "Parameters",
                "tooltip": "Enter parameters for analysis"
            },
            "intersect": {
                "label": "Intersecting layer"
            },
            "union" : {
                "label" : "Second layer for union input"
            },
            "spatial" : {
                "label" : "Spatial operator",
                "options" : [{
                    "id" : "oskari_analyse_intersect",
                    "label" : "Intersect",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_contains",
                    "label" : "Contains"
                }  ]
            },
            "params" : {
                "label" : "Selected columns",
                "tooltip" : "",
                "options" : [{
                    "id" : "oskari_analyse_all",
                    "selected" : true,
                    "label" : "All"
                }, {
                    "id" : "oskari_analyse_none",
                    "label" : "None"
                }, {
                    "id" : "oskari_analyse_select",
                    "label" : "Choose.."
                }]
            },
            "output" : {
                "label" : "Layout",
                "color_label" : "Select colors:",
                "colorset_tooltip" : "Modify colors",
                "tooltip" : "Setup colors for analysis layout"
            },
            "buttons" : {
                "save" : "Save",
                "analyse" : "Analyse",
                "data" : "Add data",
                "cancel" : "Cancel",
                "ok": "OK"
            },
            "filter": {
                "title": "Filtering",
                "description": "Filter for layer ",
                "clearButton": "Clear filter",
                "refreshButton": "Refresh filter",
                "addFilter": "Add a new filter",
                "removeFilter": "Remove filter",
                "bbox": {
                    "title": "Map window filter",
                    "on": "In use",
                    "off": "Not in use"
                },
                "clickedFeatures": {
                    "title": "Feature filter",
                    "label": "Include only selected features"
                },
                "values": {
                    "title": "Filter",
                    "placeholders": {
                        "case-sensitive": "",
                        "attribute": "Attribute",
                        "boolean": "Logical operator",
                        "operator": "Oprator",
                        "attribute-value": "Value"
                    }
                },
                "validation": {
                    "title": "Following errors prevented refreshing the filter:",
                    "attribute_missing": "Attribute missing",
                    "operator_missing": "Operator missing",
                    "value_missing": "Value missing",
                    "boolean_operator_missing": "Logical operator missing"
                }
            },
            "help" : "Help",
            "success": {
                "layerAdded": {
                    "title": "Map layer {layer} added",
                    "message": "Löydät tason Aineisto-paneelista - EN"
                }
            },
            "error": {
                "title": "Error",
                "invalidSetup": "Invalid parameters",
                "noParameters": "No parameters set",
                "noLayer": "No layer / features selected",
                "invalidMethod": "Unknown method: ",
                "bufferSize" : "Error in buffer size",
                "illegalCharacters" : "No alfabets - use digits",
                "nohelp" : "No guide found",
                "saveFailed" : "Storing analysis failed. Try again a little later.",
                "loadLayersFailed": "Analysis layer load failed"
            }
        },
        "StartView": {
            "text": "Select analysis layers and analyse data. Save the results after analysis",
            "infoseen": {
                "label": "Don't show this again"
            },
            "buttons": {
                "continue": "Start analyse",
                "cancel": "Cancel"
            }
        },
        "categoryform": {
            "name": {
                "label": "Name",
                "placeholder": "Give the map layer a name"
            },
            "drawing": {
                "label": "  ",
                "point": {
                    "label": "Point",
                    "color": "Colour",
                    "size": "Size"
                },
                "line": {
                    "label": "Line",
                    "color": "Colour",
                    "size": "Thickness"
                },
                "area": {
                    "label": "Area",
                    "fillcolor": "Fill-in colour",
                    "linecolor": "Line colour",
                    "size": "Line thickness"
                }
            },
            "edit": {
                "title": "Edit map layer",
                "save": "Save",
                "cancel": "Back"
            }
        },
        "personalDataTab" : {
            "grid" : {
                "name" : "Name",
                "delete": " "
            },
            "title" : "Analysis",
            "confirmDeleteMsg" : "Do you want to delete:",
            "buttons" : {
                "ok": "OK",
                "cancel" : "Cancel",
                "delete" : "Delete"
            },
            "notification": {
                "deletedTitle": "Delete map layer",
                "deletedMsg": "Map layer deleted"
            },
            "error" : {
                "title": "Error!",
                "generic": "System error. Please try again later."
            }
        }
    }
});
