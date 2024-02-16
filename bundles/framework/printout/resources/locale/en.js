Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Printout",
    "value": {
        "title": "Print",
        "flyouttitle": "Print",
        "desc": "",
        "btnTooltip": "Print the current map view to a PNG image or a PDF file.",
        "BasicView": {
            "title": "Print Map View",
            "size": {
                "label": "Size and direction",
                "tooltip": "Select a print size and direction. You can see updates in the preview image.",
                "options": {
                    "A4": "A4 portrait",
                    "A4_Landscape": "A4 landscape",
                    "A3": "A3 portrait",
                    "A3_Landscape": "A3 landscape"
                }
            },
            "preview": {
                "label": "Preview",
                "pending": "The preview image will be updated shortly.",
                "notes": {
                    "extent": "Check the map extent area in the preview image."
                }
            },
            "settings": {
                "label": "Additional settings",
                "tooltip": "Select settings for your print-out."
            },
            "format": {
                "label": "File format",
                "tooltip": "Select a file format for your print-out.",
                "options": {
                    "png": "PNG image",
                    "pdf": "PDF document"
                }
            },
            "content": {
                "label": "Additional content",
                "tooltip": "",
                "pngNote": "PNG-print will not include additional information.",
                "mapTitle": {
                    "placeholder": "Title"
                },
                "pageScale": {
                    "label": "Include scale bar",
                    "tooltip": "Add a scale to the map, if you want."
                },
                "pageDate": {
                    "label": "Include current date",
                    "tooltip": "You can add a date to the printout."
                },
                "pageTimeSeriesTime": {
                    "label": "Include time series timestamp",
                    "tooltip": "You can add a time series timestamp to the printout.",
                    "printLabel": "Time series time"
                },
                "coordinates": {
                    "label": "Include coordinates",
                    "position": {
                        "label": "Location",
                        "options": {
                            "center": "Map center",
                            "corners": "Corner points"
                        }
                    },
                    "projection": {
                        "label": "Projection",
                        "options": {
                            "map": "Map projection",
                            "EPSG:4326": "WGS84"
                        }
                    }
                }
            },
            "error": {
                "saveFailed": "Printing the map view not succeeded. Please try again later."
            },
            "scale": {
                "label": "Scale",
                "tooltip": "Specify the scale to be used for printing",
                "map": "Use the map scale",
                "defined": "Select a scale",
                "unsupportedLayersMessage": "The following maplayers are not shown on the printout"
            }
        },
        "StartView": {
            "info": {
                "maxLayers": "You can use at most eight map layers in the printout.",
                "printoutProcessingTime": "Printing out the map view may take some time when multiple layers are selected."
            }
        }
    }
});
