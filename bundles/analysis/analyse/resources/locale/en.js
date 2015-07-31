Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Analyse",
    "value": {
        "title": "Analysis <font color=red>(BETA)</font>",
        "flyouttitle": "Analysis <font color=red>(BETA)</font>",
        "desc": "",
        "btnTooltip": "Analysis",
        "NotLoggedView": {
            "text": "Only logged user can create analysis.",
            "signup": "Log in",
            "signupUrl": "/web/en/login",
            "register": "Register",
            "registerUrl": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "AnalyseView": {
            "title": "Analysis",
            "content": {
                "label": "Map layers",
                "drawToolsLabel": "Feature Tools",
                "tooltip": "Select one map layer for analysis. You can search more map layers by clicking \"Add map layer\" and selecting a map layer from the list. You can focus your map view to the place you  want by dragging the map with a mouse or by clicking \"Search places\" and searching the place you want.",
                "drawToolsTooltip": "By feature tools you can add new temporary features for analysis or cut an existing feature by cropping a part of it. You can add and cut point, line and area features.",
                "features": {
                    "title": "Add",
                    "buttons": {
                        "cancel": "Cancel",
                        "finish": "Done"
                    },
                    "tooltips": {
                        "point": "Add a temporary point feature.",
                        "line": "Add a temporary line feature.",
                        "area": "Add a temporary area feature."
                    },
                    "modes": {
                        "area": "Temporary area",
                        "line": "Temporary line",
                        "point": "Temporary point"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Adding a point",
                        "add": "Add one or more points by clicking the map and click \"Done\" button after that. By clicking \"Cancel\" button you can delete the points you have drawn without saving them. After clicking \"Done\" button new features will be shown at the data list with the name \"Temporary point X\" where X is the order number of the point."
                    },
                    "line": {
                        "title": "Adding a line",
                        "add": "Add a line by clicking its breaking points (incl. starting and ending points). Finish the drawing by double clicking. You can draw one or more lines. When the lines are ready, click \"Done\" button. By clicking \"Cancel\" button you can delete the lines you have drawn without saving them. After clicking \"Done\" button new features will be shown at the data list with the name \"Temporary line X\" where X is the order number of the line."
                    },
                    "area": {
                        "title": "Adding an area",
                        "add": "Add an area by clicking its breaking points (incl. starting point). Finish the drawing by double clicking. You can draw one or more areas. When the areas are ready, click \"Done\" button. By clicking \"Cancel\" button you can delete the areas you have drawn without saving them. After clicking \"Done\" button new features will be shown at the data list with the name \"Temporary area X\" where X is the order number of the area."
                    }
                },
                "drawFilter": {
                    "title": "Clipping",
                    "buttons": {
                        "cancel": "Cancel",
                        "finish": "Done"
                    },
                    "tooltip": {
                        "point": "Define the clipping points and clip the line based on the clipping points.",
                        "line": "Define the clipping line and clip the area based on the clipping line.",
                        "edit": "Define the clipping area and clip the area based on the clipping area.",
                        "remove": "Remove the clipping."
                    },
                    "dialog": {
                        "modes": {
                            "point": {
                                "title": "Clipping the line based on points",
                                "message": "There are two marker points on the selected line at the starting and ending points. If the starting and ending point are at the same point, the markers are on top of one another. The marker points out the cutting points for the line. By moving the markers you can select only one part of the line. The selected part will be shown as red. When you have made a cutting ready click the \"Done\" button. Now you can use a cut line for analysis."
                            },
                            "line": {
                                "title": "Clipping the area with a line",
                                "message": "Draw a line through the area to be clipped by clicking its breaking points (incl. starting and ending points). Finish the drawing by double clicking. You can move breakpoints by dragging them with mouse. The cut area is shown as blue. You can change the cut area by clicking another area. When the cutting is ready, click the \"Done\" button. Now you can use a cut area for analysis."
                            },
                            "edit": {
                                "title": "Clipping the area with another area",
                                "message": "Draw an area on the area to be clipped by clicking its breaking points (incl. starting point). Finish the drawing by double clicking. You can move breakpoints by dragging them with mouse. The cut area is shown as blue. You can change the cut area by clicking another area. When the cutting is ready, click the \"Done\" button. Now you can use a cut area for analysis."
                            }
                        }
                    }
                },
                "selectionTools": {
                    "title": "Selection",
                    "description": "Selection applies only to the selected maplayer",
                    "button": {
                        "empty": "Remove selection"
                    }
                },
                "search": {
                    "title": "Search the places",
                    "resultLink": "Import to the analysis"
                }
            },
            "method": {
                "label": "Method",
                "tooltip": "Select first data and after that the method",
                "options": [
                    {
                        "id": "oskari_analyse_buffer",
                        "label": "Buffer",
                        "classForMethod": "buffer",
                        "selected": true,
                        "tooltip": "By the method \"Buffer\" you can add the buffers around the selected objects. You can define the buffer size by yourself. After making buffers you can use them as a base for other analysis."
                    },
                    {
                        "id": "oskari_analyse_aggregate",
                        "label": "Key ratios computation",
                        "classForPreview": "aggregate",
                        "tooltip": "By the method \"Key ratios computation\" you can count different key ratios (e.g. average and sum) based on the selected features. \nAuthorised features are not counted."
                    },
                    {
                        "id": "oskari_analyse_union",
                        "label": "Union",
                        "classForPreview": "union",
                        "tooltip": "By the method \"Union\" you can join the selected features to one new feature."
                    },
                    {
                        "id": "oskari_analyse_clip",
                        "label": "Clipping",
                        "classForPreview": "clip",
                        "tooltip": "Clip the selected features with the features on the clipping layer. Only the features inside the features on the clipping layer are included in the result."
                    },
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Geometric filter",
                        "classForPreview": "intersect",
                        "tooltip": "Select features from the layer to be intersected. The features partially or totally inside the features on the intersecting layer are selected."
                    },
                    {
                        "id": "oskari_analyse_layer_union",
                        "label": "Analysis Layer Union",
                        "classForPreview": "layer_union",
                        "tooltip": "Combine the selected map layers. You can combine them only if they have same attributes."
                    },
                    {
                        "id": "oskari_analyse_areas_and_sectors",
                        "label": "Buffers and sectors",
                        "classForPreview": "areas_and_sectors",
                        "tooltip": "Add buffers and sectors around the selected features."
                    },
                    {
                        "id": "oskari_analyse_difference",
                        "label": "Difference computation",
                        "classForPreview": "difference",
                        "tooltip": "Compute a difference between two map layers. Map layers present the same location at two different times."
                    }, {
                        "id": "oskari_analyse_spatial_join",
                        "label": "Spatial join",
                        "classForPreview": "spatial_join",
                        "tooltip": "Join attribute data of two different layers. Feature attributes are joined based on location."
                    }]
            },
            "aggregate": {
                "label": "Descriptive statistic",
                "labelTooltip": "Select descriptive statistic to be computed based on feature attributes.",
                "options": [
                    {
                        "id": "oskari_analyse_Count",
                        "label": "Count",
                        "selected": true
                    },
                    {
                        "id": "oskari_analyse_Sum",
                        "label": "Sum"
                    },
                    {
                        "id": "oskari_analyse_Min",
                        "label": "Minimum"
                    },
                    {
                        "id": "oskari_analyse_Max",
                        "label": "Maximum"
                    },
                    {
                        "id": "oskari_analyse_Average",
                        "label": "Average"
                    },
                    {
                        "id": "oskari_analyse_StdDev",
                        "label": "Standard deviation"
                    },
                    {
                        "id": "oskari_analyse_Median",
                        "label": "Median"
                    },
                    {
                        "id": "oskari_analyse_NoDataCnt",
                        "label": "The number of authorised features"
                    }
                ],
                "attribute": "Select the attribute",
                "footer" : "Authorised features are not counted"
            },
            "buffer_size": {
                "label": "Buffer size",
                "labelTooltip": "Type the buffer size as meters or kilometers.",
                "tooltip": "Buffer size"
            },
            "buffer_units": {
                "m": "meters",
                "km": "kilometers"
            },
            "analyse_name": {
                "label": "Analysis name",
                "labelTooltip": "Type a descriptive name for the analysis.",
                "tooltip": "Analysis name"
            },
            "settings": {
                "label": "Parameters",
                "tooltip": "Give parameters for the analysis. The parameters depend on the selected filter and method."
            },
            "showFeatureData" : "Open feature data when analysis is finished",
            "showValuesCheckbox" : "Show calculated values without saving result",
            "intersect": {
                "target": "Layer to be intersected",
                "targetLabelTooltip": "Select a map layer to be intersected with features on the intersecting layer.",
                "label": "Intersecting layer",
                "labelTooltip": "Select an intersecting layer. The features will be selected based on the features on this layer."
            },
            "union": {
                "label": "Layer to be combined"
            },
            "layer_union": {
                "label": "Layers to be combined",
                "labelTooltip": "Select map layers to be combined. Combined features will be saved into a new map layer.",
                "notAnalyseLayer": "The selected map layer cannot be used in analysis. Please select another map layer.",
                "noLayersAvailable": "The selected map layers do not have same attributes. Please select map layers with same attributes."
            },
            "areas_and_sectors": {
                "label" : "Buffers and sectors",
                "labelTooltip": "Define a size and a number of buffers and a number of sectors.",
                "area_count": "Buffer amount",
                "area_count_tooltip": "Count between 0-12",
                "area_size": "Buffer size",
                "area_size_tooltip": "Size",
                "sector_count": "Sector amount",
                "sector_count_tooltip": "Count between 0-12"
            },
            "difference": {
                "firstLayer": "Older map layer",
                "firstLayerTooltip": "Select the map layer containing the original data.",
                "firstLayerFieldTooltip": "Select a comparable attribute from the older map layer.",
                "secondLayer": "Newer map layer",
                "secondLayerTooltip": "Select the map layer containing the updated data.",
                "secondLayerFieldTooltip": "Select a comparable attribute from the newer map layer.",
                "field": "Comparable attribute",
                "keyField": "Combining attribute",
                "keyFieldTooltip": "Select a combining attribute. It must be an unique identifier for both of map layer."
            },
            "spatial": {
                "label": "Result features",
                "target": "Original layer",
                "targetTooltip": "Select a original layer. The features will be selected from this layer.",
                "intersectingLayer": "Intersecting layer",
                "intersectingLayerTooltip": "Select an intersecting layer. The features will be selected based on the features on this layer.",
                "labelTooltipIntersect": "Select which features are included into the result. Intersecting features are at least partially inside the features on the intersecting layer, containing features totally inside.",
                "options": [
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Intersecting features",
                        "selected": true
                    },
                    {
                        "id": "oskari_analyse_contains",
                        "label": "Containing features"
                    }
                ]
            },
            "spatial_join": {
                "firstLayer": "Feature Layer",
                "firstLayerTooltip": "Select a feature map layer. Its attribute data will be combined with attribute data from the source layer..",
                "firstLayerFieldTooltip": "Result attributes from feature layer",
                "secondLayer": "Source Layer",
                "secondLayerTooltip": "Select a source map layer. Its attribute data will be retrieved into the feature level.",
                "secondLayerFieldTooltip": "Result attributes from source layer",
                "mode": "Spatial join mode",
                "modeTooltip": "Choose if you want to use aggregate in spatial join",
                "normalMode": "Normal spatial join",
                "aggregateMode": "Aggregate"
            },
            "params": {
                "label": "Result attributes",
                "aggreLabel": "Attributes for descriptive statistic",
                "aggreLabelTooltip": "Select at most ten attributes. Descriptive statistic are computed for these attributes.",
                "labelTooltip": "Select at most ten attributes into the result. ",
                "tooltip": "",
                "options": [
                    {
                        "id": "oskari_analyse_all",
                        "selected": true,
                        "label": "All"
                    },
                    {
                        "id": "oskari_analyse_none",
                        "label": "None"
                    },
                    {
                        "id": "oskari_analyse_select",
                        "label": "Select from the list"
                    }
                ]
            },
            "output": {
                "label": "Layout",
                "color_label": "The feature style",
                "colorset_tooltip": "Select styles for the features with diferent geometry.",
                "tooltip": "Select the suitable style for features at the analysis to be done.",
                "random_color_label": "Random colours"
            },
            "buttons": {
                "save": "Save and finish",
                "analyse": "Create analysis",
                "data": "Add the map layers"
            },
            "filter": {
                "title": "Filtering",
                "description": "Filter the features at the layer",
                "cancelButton": "Cancel",
                "clearButton": "Clear All",
                "refreshButton": "Refresh",
                "addFilter": "Add Filter.",
                "removeFilter": "Remove Filter.",
                "content": {
                    "title": "Geographical Filter"
                },
                "bbox": {
                    "on": "Only the features visible on the map window",
                    "off": "All features"
                },
                "clickedFeatures": {
                    "clickedFeaturesLabel": "Only features selected on the map",
                    "filterByGeometryLabel": "Only features filling the selected option:",
                    "filterByGeometryIntersect": "Features intersecting selected features",
                    "filterByGeometryContains": "Features inside selected features"
                },
                "values": {
                    "title": "Filter",
                    "placeholders": {
                        "case-sensitive": "Filter is case-sensitive.",
                        "attribute": "Attribute",
                        "boolean": "Logical operator",
                        "operator": "Operator",
                        "attribute-value": "Value"
                    },
                    "info": {
                        "bboxOff":"Without geographical filter all the features in the dataset are included in the analysis result. Add at least one attribute filter.",
                        "filterByGeometrySelected":"You can filter by attributes only if you don't use filter for selected features."
                    },
                    "equals": "equals",
                    "like": "is like",
                    "notEquals": "does not equal",
                    "notLike": "is not like",
                    "greaterThan": "is greater than",
                    "lessThan": "is less than",
                    "greaterThanOrEqualTo": "is greater than or equal to",
                    "lessThanOrEqualTo": "is less than or equal to"
                },
                "validation": {
                    "title": "Errors Occurred in Filter",
                    "attribute_missing": "The attribute is missing. Please select an attribute.",
                    "operator_missing": "The operator is missing. Please select an operator.",
                    "value_missing": "The value is missing. Please type a value.",
                    "boolean_operator_missing": "The logical operator is missing. Please select a logical operator.",
                    "bbox_selected_with_no_properties":"Without geographical filter all the features in the dataset are included in the analysis result.<br/> 1) Add at least one attribute filter or 2) use only features visible on the map."
                }
            },
            "help": "Help",
            "success": {
                "layerAdded": {
                    "title": "Analysis succeeded.",
                    "message": "Analysis has been done. The result is at the map layer {layer}."
                }
            },
            "error": {
                "title": "Error Occurred in Analysis",
                "invalidSetup": "Parameters are invalid. Please correct them and try again.",
                "noParameters": "The map layer and parameters are not defined. Please select a map layer and parameters to be used in the analysis, and try again.",
                "noLayer": "The map layer is not selected. Please select a map layer and try again.",
                "noAnalyseUnionLayer": "You need at least two map layers for this method. Please select another layer and try again.",
                "invalidMethod": "The analysis method is unknown. Please select an existing method.",
                "bufferSize": "The buffer size is invalid. Please correct it and try again.",
                "illegalCharacters": "The buffer size has illegal characters. Please correct it and try again.",
                "nohelp": "The guide was not found.",
                "saveFailed": "The analysis could not be saved.",
                "loadLayersFailed": "The map layers could not be loaded.",
                "loadLayerTypesFailed": "The attribute data could not be loaded.",
                "Analyse_parameter_missing": "Parameter(s) are missing. Please give them and try again.",
                "Unable_to_parse_analysis": "Parameter(s) are invalid. Please correct them and try again.",
                "Unable_to_get_WPS_features": "The features could not be retrieved. Please try again later.",
                "WPS_execute_returns_Exception": "The analysis could not be processed. Please try again later.",
                "WPS_execute_returns_no_features": "The result has no features.",
                "Unable_to_process_aggregate_union": "Descriptive statistic could not be computed for the union.",
                "Unable_to_get_features_for_union": "The source data could not be retrieved. ",
                "Unable_to_store_analysis_data": "The analysis result could not be saved.",
                "Unable_to_get_analysisLayer_data": "The source data could not be retrieved. ",
                "timeout": "Processing the analysis could not be finished because of a time-out error.",
                "error": "The analysis failed because of an unknown reason.",
                "parsererror": "The result data are invalid."
            },
            "infos": {
                "title": "Too many attributes",
                "layer": "Features on the layer",
                "over10": "have over ten attributes. Please select at most ten attributes into the analysis result. The attributes you can select in the parameters."
            }
        },
        "StartView": {
            "text": "With this function you can make simple spatial analysis for map layers including feature data. The finished analysis you can find at the tab Analysis in the menu Own data.",
            "layersWithFeatures": "You can make analysis only for one map layer. Select the map layer. Other selections are removed.",
            "infoseen": {
                "label": "Do not show this message again."
            },
            "buttons": {
                "continue": "Start analysis",
                "cancel": "Cancel"
            }
        },
        "categoryform": {
            "name": {
                "label": "Name",
                "placeholder": "Type a name for a map layer."
            },
            "drawing": {
                "label": "NOT TRANSLATED",
                "point": {
                    "label": "Point",
                    "color": "Colour",
                    "size": "Size"
                },
                "line": {
                    "label": "Line",
                    "color": "Colour",
                    "size": "Width"
                },
                "area": {
                    "label": "Area",
                    "fillcolor": "Fill-in colour",
                    "linecolor": "Line colour",
                    "size": "Line width"
                }
            },
            "edit": {
                "title": "Edit map layer",
                "save": "Save",
                "cancel": "Cancel"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Name",
                "delete": "Remove"
            },
            "title": "Analysis",
            "confirmDeleteMsg": "Do you want to remove the analysis layer:",
            "buttons": {
                "ok": "OK",
                "cancel": "Cancel",
                "delete": "Remove"
            },
            "notification": {
                "deletedTitle": "Remove Analysis Layer",
                "deletedMsg": "Analysis layer has been removed."
            },
            "error": {
                "title": "Error!",
                "generic": "The system error occurred."
            }
        }
    }
}
);