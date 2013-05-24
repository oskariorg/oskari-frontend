Oskari.registerLocalization({
    "lang" : "fi",
    "key" : "Analyse",
    "value" : {
        "title" : "Analysis",
        "flyouttitle" : "Analysis",
        "desc" : "",
        "btnTooltip" : "Analysis",
        "AnalyseView" : {
            "title" : "Analysis",
               "content" : {
                "label" : "Data",
                "tooltip" : "Add analyse data - push [Add data] button"          
            },
            "method" : {
                "label" : "Method",
                "tooltip" : "Select first data and after that the method",
                "options" : [{
                    "id" : "oskari_analyse_buffer",
                    "label" : "Buffer",
                    "classForMethod" : "buffer",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_aggregate",
                    "label" : "Aggregate"",
                    "classForPreview" : "aggregate"
                }, {
                    "id" : "oskari_analyse_union",
                    "label" : "Union",
                    "classForPreview" : "union"
                },{
                    "id" : "oskari_analyse_intersect",
                    "label" : "Intersect",
                    "classForPreview" : "intersect"
                } ]
            },
            "aggregate" : {
                "label" : "Aggregate function",
                "options" : [{
                    "id" : "oskari_analyse_sum",
                    "label" : "Sum",
                    "selected" : true
                }, {
                    "id" : "oskari_analyse_count",
                    "label" : "Count"
                }, {
                    "id" : "oskari_analyse_min",
                    "label" : "Minimum"
                },{
                    "id" : "oskari_analyse_max",
                    "label" : "Maximum"
                },{
                    "id" : "oskari_analyse_med",
                    "label" : "Average"
                }  ]
            },
             "buffer_size" : {
                "label" : "Buffer size (m)",
                "tooltip" : "Enter buffer size"
            },
             "analyse_name" : {
                "label" : "Name of Analyse",
                "tooltip" : "Enter analyse name"
            },
             "settings" : {
                "label" : "Parameters",
                "tooltip" : "Enter parameters for analyse"
            },
             "intersect" : {
                "label" : "Intersecting layer"
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
                    "label" : "Use list"
                }]
            },
               "output" : {
                "label" : "Layout",
                "color_label" : "Select colors:",
                "colorset_tooltip" : "Modify colors",
                "tooltip" : "Setup colors for analyse layout"
            },


            "buttons" : {
                "save" : "Save",
                "analyse" : "Analyse",
                "data" : "Add data",
                "cancel" : "Cancel"
            },
            "help" : "Help",
            "error" : {
                "title" : "Error",
                "size" : "Error in buffer size",
                "nohelp" : "No quide found",
                "saveFailed" : "Storinig analysis failde. Try once more later.",
                "IllegalCharacters" : "No alfabets - use digits"
            }
        },
        "StartView" : {
            "text" : "Select analysis layers and analyse data. Save the results after analysis",
             "infoseen" : {
                "label" : "Don't show this again"
            },
            "buttons" : {
                "continue" : "Start analyse",
                "cancel" : "Cancel"
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
    }
    }
});
