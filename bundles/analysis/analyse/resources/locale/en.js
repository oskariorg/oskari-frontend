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
            "text": "With Analysis function you can make simple spatial analysis for map layers including feature data. The function is available only for logged-in users.",
            "signup": "Log in",
            "signupUrl": "/web/en/login",
            "register": "Register",
            "registerUrl": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "AnalyseView": {
            "title": "Analysis <font color=red>(BETA)</font>",
            "content": {
                "label": "Map Layers",
                "drawToolsLabel": "Feature Tools",
                "tooltip": "Select one map layer for analysis. You can search more map layers by clicking \"Add map layer\" and selecting a map layer from the list. You can focus your map view to the place you  want by dragging the map with a mouse or by clicking \"Search places\" and searching the place you want.",
                "drawToolsTooltip": "Add a temporary feature, clip an existing feature or select features with a geometry you draw.",
                "features": {
                    "title": "Add Feature",
                    "buttons": {
                        "cancel": "Cancel",
                        "finish": "Done"
                    },
                    "tooltips": {
                        "point": "Add a temporary point to be used in the analysis.",
                        "line": "Add a temporary line to be used in the analysis.",
                        "area": "Add a temporary area to be used in the analysis."
                    },
                    "modes": {
                        "area": "Temporary area",
                        "line": "Temporary line",
                        "point": "Temporary point"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Add Point",
                        "add": "Draw one or more points. Click the map. Press the \"Done\" button. The point(s) will be added to the Map Layer list at the analysis function. The point's name is \"Temporary point X\", where X is an order number. You can remove point(s) by pressing the \"Cancel\" button."
                    },
                    "line": {
                        "title": "Add Line",
                        "add": "Draw one or more lines. Click a starting point and breaking points. Finally double-click an ending point. Press the \"Done\" button. The line(s) will be added to the Map Layer list at the analysis function. The line's name is \"Temporary line X\", where X is an order number. You can remove line(s) by pressing the \"Cancel\" button."
                    },
                    "area": {
                        "title": "Add Area",
                        "add": "Draw one or more areas. Click corner points. Finally double-click an ending point. You can make a hole to the area by pressing alt-key in the keyboard. Press the \"Done\" button. The area(s) will be added to the Map Layer list at the analysis function. The area's name is \"Temporary line X\", where X is an order number. You can remove area(s) by pressing the \"Cancel\" button."
                    }
                },
                "drawFilter": {
                    "title": "Clipping",
                    "buttons": {
                        "cancel": "Cancel",
                        "finish": "Done"
                    },
                    "tooltip": {
                        "point": "Draw an intersection point to clip the selected line.",
                        "line": "Draw an intersection line to clip the selected area.",
                        "edit": "Draw an intersection area to clip the selected area.",
                        "remove": "Remove all intersections without saving them."
                    },
                    "dialog": {
                        "modes": {
                            "point": {
                                "title": "Intersection Point for Line",
                                "message": "Clip the line to two lines with intersection points. Intersection points are marked with red diamonds. If the line is circular, intersection points are on top of one another. Move the intersection points by dragging them with a mouse. The result is highlighted with red. Finally press the \"Done\" button."
                            },
                            "line": {
                                "title": "Intersection Line for Area",
                                "message": "Clip the area to two areas with an intersection line. Draw a line over the area. Click breaking points (including a starting point). Finally double-click an ending point. You can move breaking points by dragging them with a mouse. The result area is highlighted with blue. You can change a highlighted area by clicking another area. Finally press the \"Done\" button."
                            },
                            "edit": {
                                "title": "Intersection Area for Area",
                                "message": "Clip the area to two areas with an intersection line. Draw an area over the area. Click corner points (including a starting point). Finally double-click an ending point. You can move breaking points by dragging them with a mouse. The result area is highlighted with blue. You can change a highlighted area by clicking another area. Finally press the \"Done\" button."
                            }
                        }
                    }
                },
                "selectionTools": {
                    "title": "Select Feature",
                    "description": "Select features geometrically. Define the features to be selected by drawing a geometry. The selection applies only to the selected map layer.",
                    "button": {
                        "empty": "Remove Selection"
                    }
                },
                "search": {
                    "title": "Search places",
                    "resultLink": "Use in analysis"
                }
            },
            "method": {
                "label": "Method",
                "tooltip": "Select a method to be used in the analysis. You can read guidance for one method by clicking the i-icon next to its name.",
                "options": [
                    {
                        "id": "oskari_analyse_buffer",
                        "label": "Buffer",
                        "classForMethod": "buffer",
                        "selected": true,
                        "tooltip": "Add buffer around the selected features. You can use buffers in other analysis."
                    },
                    {
                        "id": "oskari_analyse_aggregate",
                        "label": "Descriptive statistic",
                        "classForPreview": "aggregate",
                        "tooltip": "Compute descriptive statistic for the selected features. Authorised features are not included in the analysis."
                    },
                    {
                        "id": "oskari_analyse_union",
                        "label": "Union",
                        "classForPreview": "union",
                        "tooltip": "Join the selected features in one new feature."
                    },
                    {
                        "id": "oskari_analyse_clip",
                        "label": "Clipping",
                        "classForPreview": "clip",
                        "tooltip": "Clip the selected features with features on the clipping layer. Only the features inside the features on the clipping layer are included in the result."
                    },
                    {
                        "id": "oskari_analyse_intersect",
                        "label": "Geometric filter",
                        "classForPreview": "intersect",
                        "tooltip": "Select features from the layer to be intersected. The features partially or totally inside the features on the intersecting layer are selected."
                    },
                    {
                        "id": "oskari_analyse_areas_and_sectors",
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
                        "label": "Difference Computation",
                        "classForPreview": "difference",
                        "tooltip": "Compute a difference between two map layers. Map layers present the same location at two different times."
                    },
                    {
                        "id": "oskari_analyse_spatial_join",
                        "label": "Spatial join",
                        "classForPreview": "spatial_join",
                        "tooltip": "Join attribute data of two different layers. Feature attributes are joined based on location."
                    }
                ]
            },
            "aggregate": {
                "label": "Descriptive statistic",
                "labelTooltip": "Select descriptive statistic to be computed based on feature attributes.",
                "options": [
                    {
                        "id": "oskari_analyse_Count",
                        "label": "Feature count",
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
                        "label": "Count of authorised features"
                    }
                ],
                "attribute": "Select attribute",
                "footer": "Authorised features are not included in the analysis."
            },
            "buffer_size": {
                "label": "Buffer size",
                "labelTooltip": "Type a buffer size as meters or kilometers.",
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
                "tooltip": "Give parameters for the analysis. Parameters depend on the selected filter and method."
            },
            "showFeatureData": "Open feature data after finishing analysis.",
            "showValuesCheckbox": "Show descriptive statistic without saving the result.",
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
                "label": "Buffers and sectors",
                "labelTooltip": "Define a size and a number of buffers and a number of sectors.",
                "area_count": "Buffer count",
                "area_count_tooltip": "Count between 0-12",
                "area_size": "Buffer size",
                "area_size_tooltip": "Size",
                "sector_count": "Sector count",
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
                "labelTooltipIntersect": "Select which features are included into the result. Intersecting features are at least partially inside the features on the intersecting layer, containing features totally inside. This method is designed for point features. Please use the operator \"Containing features\" for areas. Otherwise the result may have errors.",
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
                "firstLayerTooltip": "Select a feature map layer. Its attribute data will be combined with attribute data from the source layer.",
                "firstLayerFieldTooltip": "Result attributes from feature layer",
                "secondLayer": "Source Layer",
                "secondLayerTooltip": "Select a source map layer. Its attribute data will be retrieved into the feature level.",
                "secondLayerFieldTooltip": "Result attributes from source layer",
                "mode": "Spatial join mode",
                "modeTooltip": "Select if you want to use descriptive statististic in the spatial join.",
                "normalMode": "Normal spatial join",
                "aggregateMode": "Aggregate descritpive statistic"
            },
            "params": {
                "label": "Attributes in the result",
                "aggreLabel": "Attributes for descriptive statistic",
                "aggreLabelTooltip": "Select at most ten attributes. Descriptive statistic are computed for these attributes.",
                "labelTooltip": "Select at most ten attributes into the result.",
                "tooltip": "Give analysis method appropriate parameters.",
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
                        "label": "Select from list"
                    }
                ]
            },
            "output": {
                "label": "Feature style",
                "color_label": "Select style",
                "colorset_tooltip": "Select style for points, lines and regions.",
                "tooltip": "Select a style for points, lines and areas in the result.",
                "random_color_label": "Random colours"
            },
            "buttons": {
                "save": "Save and finish",
                "analyse": "Make analysis",
                "data": "More map layers"
            },
            "filter": {
                "title": "Filter Features",
                "description": "Filter Features at Layer:",
                "cancelButton": "Cancel",
                "clearButton": "Clear All",
                "refreshButton": "Refresh",
                "addFilter": "Add Filter",
                "removeFilter": "Remove Filter",
                "content": {
                    "title": "Geographical Filter"
                },
                "bbox": {
                    "on": "Only features visible on the map",
                    "off": "All features"
                },
                "clickedFeatures": {
                    "clickedFeaturesLabel": "Only features selected on the map",
                    "filterByGeometryLabel": "Only features filling the selected option:",
                    "filterByGeometryIntersect": "Features intersecting selected features",
                    "filterByGeometryContains": "Features inside selected features"
                },
                "values": {
                    "title": "Attribute Filter",
                    "placeholders": {
                        "case-sensitive": "Filter is case-sensitive.",
                        "attribute": "Attribute",
                        "boolean": "Logical operator",
                        "operator": "Operator",
                        "attribute-value": "Value"
                    },
                    "info": {
                        "bboxOff": "Without geographic filter all the features are included in the analysis. Please add an attribute filter or select \"Only features visible on the map\" in the geographic filter.",
                        "filterByGeometrySelected": "You can filter by attributes only if \"All features\" is selected in the geographic filter above."
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
                    "title": "Error",
                    "attribute_missing": "The attribute is missing. Please select an attribute and try again.",
                    "operator_missing": "The operator is missing. Please select an operator and try again.",
                    "value_missing": "The value is missing. Please type a value and try again.",
                    "boolean_operator_missing": "The logical operator is missing. Please select a logical operator and try again.",
                    "bbox_selected_with_no_properties": "Without geographic filter all the features are included in the analysis. Please add an attribute filter or select \"Only features visible on the map\" in the geographic filter."
                }
            },
            "help": "Help",
            "success": {
                "layerAdded": {
                    "title": "Analysis succeeded.",
                    "message": "Analysis has been done. The result is at the map layer {layer}. Later you can find your analysis in the My data menu."
                }
            },
            "error": {
                "title": "Error",
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
                "Unable_to_get_WPS_features": "The source data could not be retrieved.",
                "WPS_execute_returns_Exception": "The analysis could not be processed.",
                "WPS_execute_returns_no_features": "The result has no features.",
                "Unable_to_process_aggregate_union": "Descriptive statistic could not be computed for the union.",
                "Unable_to_get_features_for_union": "The source data could not be retrieved.",
                "Unable_to_store_analysis_data": "The analysis result could not be saved.",
                "Unable_to_get_analysisLayer_data": "The source data could not be retrieved.",
                "timeout": "Processing the analysis could not be finished because of a time-out error.",
                "error": "The analysis failed.",
                "parsererror": "The result data are invalid."
            },
            "infos": {
                "title": "Too many attributes",
                "layer": "Features on the layer",
                "over10": "have over ten attributes. Please select at most ten attributes into the analysis result. The attributes you can select in the parameters."
            },
            "aggregatePopup": {
                "title": "Analysis results",
                "property": "Property",
                "store": "Save",
                "store_tooltip": "Save result geometry as temporary layer",
                "close": "Close"
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
                "placeholder": "Type a map layer name."
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
                "title": "Error",
                "generic": "The system error occurred."
            }
        }
    }
}
);