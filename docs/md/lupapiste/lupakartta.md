# Lupakartta

<table>
  <tr>
    <td>ID</td><td>lupakartta</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>Oskari.lupapiste.bundle.lupakartta.lupakarttaInstance.html)</td>
  </tr>
</table>

## Description

Lupakartta adds Marker handling. Lupakartta also utilizes dot selection and printing. The JavaScript documentation is largely missing, which can be expected from fully integrated bundles into Oskari.

Note! Lupakartta requires hub.js to be globally defined.
Also make sure libraries/OpenLayers/OpenLayers_Control_TileStitchPrinter.js is available.

Unfortunately the MyPlaces bundle event handling has changed and is incompatible with this bundle, which is why the bundle ships with its own namespaced version of the myplaces2 bundle (lupapiste-myplaces2). It should be included in "Import-Bundle" section of the lupapiste bundle in application setup.

* State handling

No state.

## Developer setup

Replacing index.js with the following code will load up the lupapiste bundle and adds the example UI as a layer on top of the Oskari UI. This is not intended for production use. In production it is recommended to add hub.js directly into the html file. The bundle definition and configuration is recommended to be added on the server side to appSetup and appConfig.

```javascript
/**
 * Start when dom ready
 */
jQuery(document).ready(function() {
    if (!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    function getURLParameter(name) {
        var re = name + '=' + '([^&]*)(&|$)';
        var value = RegExp(re).exec(location.search);
        if (value && value.length && value.length > 1) {
            value = value[1];
        }
        if (value) {
            return decodeURI(value);
        }
        return null;
    }

    // returns empty string if parameter doesn't exist
    // otherwise returns '<param>=<param value>&'
    function getAdditionalParam(param) {
        var value = getURLParameter(param);
        if (value) {
            return param + '=' + value + '&';
        }
        return '';
    }

    // remove host part from url
    if (ajaxUrl.indexOf('http') == 0) {
        var hostIdx = ajaxUrl.indexOf('://') + 3;
        var pathIdx = ajaxUrl.indexOf('/', hostIdx);
        ajaxUrl = ajaxUrl.substring(pathIdx);
    }

    // populate url with possible control parameters
    ajaxUrl += getAdditionalParam('zoomLevel');
    ajaxUrl += getAdditionalParam('coord');
    ajaxUrl += getAdditionalParam('mapLayers');
    ajaxUrl += getAdditionalParam('oldId');
    ajaxUrl += getAdditionalParam('viewId');

    ajaxUrl += getAdditionalParam('isCenterMarker');
    ajaxUrl += getAdditionalParam('address')
    ajaxUrl += getAdditionalParam('showGetFeatureInfo');
    ajaxUrl += getAdditionalParam('nationalCadastralReference');

    ajaxUrl += getAdditionalParam('nationalCadastralReferenceHighlight');
    ajaxUrl += getAdditionalParam('wfsFeature');
    ajaxUrl += getAdditionalParam('wfsHighlightLayer');


    if (!language) {
        // default to finnish
        language = 'fi';
    }
    Oskari.setLang(language);

    Oskari.setLoaderMode('dev');
    Oskari.setPreloaded(preloaded);

    function gfiParamHandler(sandbox) {
        if (getURLParameter('showGetFeatureInfo') != 'true') {
            return;
        }
        var lon = sandbox.getMap().getX();
        var lat = sandbox.getMap().getY();
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var px = mapModule.getMap().getViewPortPxFromLonLat({
            lon: lon,
            lat: lat
        });
        sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
    }

    function start(appSetup, appConfig, cb) {
        var url = "/Oskari/applications/lupapiste/kartta/hub.js";
        jQuery.getScript(url, function() {
            console.log('loaded hub.script');
            hub.subscribe("map-initialized", function(e) {
                jQuery("#eventMessages").html("map-initilized<br/>" + jQuery("#eventMessages").html())
            });
            hub.subscribe("inforequest-map-click", function(e) {
                jQuery("#eventMessages").html("inforequest-map-click (" + e.data.kunta.kuntanimi_fi + " " + e.data.kunta.kuntanumero + "," + e.data.location.x + "," + e.data.location.y + ")<br/>" + jQuery("#eventMessages").html())
            });
        });

        // add html 
        jQuery("body").prepend('<div style="position: absolute;z-index: 1000;"><div id="eventMessages"> </div><div id="formi"><input type="text" id="inputx" value="517620" /><input type="text" id="inputy" value="6874042"/><div><input type="button" id="button1" value="Lisaa markkeri"/><input type="button" id="button2" value="Lisaa markkereita"/><input type="button" id="piirra" value="osoita piste"/>Tyhjenn&auml; ennen lis&auml;yst&auml;: <input type="checkbox" id="checkbox1" /><br/><input type="button" id="tyhjenna" value="poista pisteet"/></div></div></div>');

        //event demot
        jQuery("#button1").click(function() {
            //jQuery("#eventMessages").trigger("center",[parseInt(jQuery("#inputx").val(),10), parseInt(jQuery("#inputy").val(),10)]);
            hub.send("documents-map", {
                clear : jQuery("#checkbox1").is(":checked"),
                data : [{
                    id : new Date().getTime(),
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10),
                        y : parseInt(jQuery("#inputy").val(), 10)
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }]
            });
            return false;
        });
        jQuery("#button2").click(function() {
            //jQuery("#eventMessages").trigger("center",[parseInt(jQuery("#inputx").val(),10), parseInt(jQuery("#inputy").val(),10)]);
            hub.send("documents-map", {
                clear : jQuery("#checkbox1").is(":checked"),
                data : [{
                    id : "11",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10),
                        y : parseInt(jQuery("#inputy").val(), 10)
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click11<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "22",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click22<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "33",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click33<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "44",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click44<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }, {
                    id : "55",
                    location : {
                        x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
                        y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
                    },
                    events : {
                        click : function(e) {
                            jQuery("#eventMessages").html("click55<br/>" + jQuery("#eventMessages").html())
                        }
                    }
                }]
            });
            return false;
        });
        jQuery("#piirra").click(function() {
            //jQuery("#eventMessages").trigger("piirra");
            hub.send("inforequest-map-start", {
                drawMode : 'point',
                clear : jQuery("#checkbox1").is(":checked")
            });
            return false;
        });
        jQuery("#tyhjenna").click(function() {
            //jQuery("#eventMessages").trigger("tyhjenna");
            hub.send("map-clear-request");
            return false;
        });

        var app = Oskari.app;

        appConfig.lupakartta = {
            "conf": {
                "ajaxurl": "/oskari/integraatio/Kunta.asmx/Hae",
                "printUrl": "/print",
                "zoomMinBbox": 1000
            }
        };

        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
            var instance = startupInfos.bundlesInstanceInfos.mapfull.bundleInstance;
            if (cb) {
                cb(instance);
            }

            var ugStartup = { 
                "title" : "lupapiste",
                "en" : "lupapiste",
                "fi" : "lupapiste",
                "sv" : "lupapiste",
                "bundleinstancename" : "lupakartta",
                "bundlename" : "lupakartta",
                "instanceProps" : {  },
                "metadata" : { 
                    "Import-Bundle" : { 
                        "lupakartta" : { "bundlePath" : "/Oskari/packages/lupapiste/bundle/" } 
                    },
                    "Require-Bundle-Instance" : [  ]
                }
            };

            Oskari.bundle_facade.playBundle(ugStartup, function() {});
        });
    }

    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        beforeSend: function(x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
            }
        },
        url: ajaxUrl + 'action_route=GetAppSetup',
        success: function(app) {
            if (app.startupSequence && app.configuration) {
              var appSetup = {
                "startupSequence": app.startupSequence
              };
              start(appSetup, app.configuration, function(instance) {
                    var sb = instance.getSandbox();
                    gfiParamHandler(sb);
                });
            } else {
                jQuery('#mapdiv').append('Unable to start');
            }
        },
        error: function(jqXHR, textStatus) {
            if (jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});
```

## Screenshot

No screenshot.

## Bundle configuration

```javascript
"conf": {
    "ajaxurl": "/oskari/integraatio/Kunta.asmx/Hae",
    "printUrl": "/print",
    "zoomMinBbox": 1000
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>lupakartta.AddMarkerRequest</td><td>Adds a marker on the map</td>
  </tr>
  <tr>
    <td>lupakartta.ClearMapRequest</td><td>Clears the map</td>
  </tr>
</table>

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MyPlaces.StartDrawingRequest</td><td></td>
  </tr>
  <tr>
    <td>MyPlaces.StopDrawingRequest</td><td></td>
  </tr>
  <tr>
    <td>MyPlaces.GetGeometryRequest</td><td></td>
  </tr>
  <tr>
    <td>MapMoveRequest</td><td></td>
  </tr>
  <tr>
    <td>DisableMapKeyboardMovementRequest</td><td></td>
  </tr>
</table>


## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>MyPlaces.FinishedDrawingEvent</td><td>Handles drawing and once done, sends the municipality data to the server.</td>
  </tr>
</table>

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>FeatureSelector.FeaturesAddedEvent</td><td>DigiroadVectorLayerPlugin sends this event when the user clicks on the map to select features.</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeaturesRemovedEvent</td><td>DigiroadVectorLayerPlugin sends this event when the user clicks on an empty spot on the map or uses the control key on a feature which has been selected already (toggle).</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeatureHighlightEvent</td><td>Upon moving the mouse cursor over a feature in the grid this event gets sent. It has a type which can be either 'highlight' or 'unHighlight'.</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeatureEditedEvent</td><td>Triggered when the user double clicks a cell in the grid, enter a new value and presses enter.</td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to handle map element sizing </td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td> Not used directly but a MapModule dependency </td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> To initialize and show the map on UI </td>
  </tr>
  <tr>
    <td> [Oskari mapmodule plugins](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Any bundle providing a map plugin referenced in config needs to be loaded before starting this bundle </td>
  </tr>
</table>
