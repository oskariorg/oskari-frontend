# StateChangedEvent [rpc]

Sent after massive application state change occurs.

## Description

This allows RPC-based apps to detect things like user clicking on the "reset map to default". The state "reset" clears for example markers from the map and re-add for example markers that they need after such reset.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> currentState </td><td> Object</td><td> Current state of the application as JSON object</td><td> </td>
</tr>
<tr>
  <td> previousState </td><td> Object</td><td> Previous state of the application as JSON object </td><td> </td>
</tr>
</table>

## RPC

Event occurs after calling useState() or resetState() on rpc-client or when user for example clicks the reset button (can be hidden in publisher functionality) on map. 

The event includes the current and previous state:
<pre class="event-code-block">
<code>
{
    "current": {
        "mapfull": {
            "state": {
                "north": 7250000,
                "east": 520000,
                "zoom": 0,
                "srs": "EPSG:3067",
                "selectedLayers": [
                    {
                        "id": 801,
                        "opacity": 100,
                        "style": "default"
                    }
                ],
                "plugins": {
                    "MainMapModuleMarkersPlugin": {
                        "markers": []
                    },
                    "MainMapModuleFullScreenPlugin": {
                        "fullscreen": false
                    }
                }
            }
        },
        "toolbar": {
            "state": {}
        },
        "search": {
            "state": {}
        },
        "statsgrid": {
            "state": {
                "view": false
            }
        },
        "metadataflyout": {
            "state": {}
        },
        "printout": {
            "state": {}
        },
        "timeseries": {
            "state": null
        },
        "maprotator": {
            "state": {
                "degrees": 0
            }
        }
    },
    "previous": {
        "mapfull": {
            "state": {
                "north": 8009268.642888758,
                "east": 99676.35560292119,
                "zoom": 2,
                "srs": "EPSG:3067",
                "selectedLayers": [
                    {
                        "id": 801,
                        "opacity": 100,
                        "style": "default"
                    }
                ],
                "plugins": {
                    "MainMapModuleMarkersPlugin": {
                        "markers": []
                    },
                    "MainMapModuleFullScreenPlugin": {
                        "fullscreen": false
                    }
                }
            }
        },
        "toolbar": {
            "state": {
                "selected": {
                    "id": "select",
                    "group": "default-basictools"
                }
            }
        },
        "search": {
            "state": {}
        },
        "statsgrid": {
            "state": {
                "view": false
            }
        },
        "metadataflyout": {
            "state": {}
        },
        "printout": {
            "state": {}
        },
        "timeseries": {
            "state": null
        },
        "maprotator": {
            "state": {
                "degrees": 0
            }
        }
    }
}
</code>
</pre>
