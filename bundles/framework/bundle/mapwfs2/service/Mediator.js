/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Mediator
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.service.Mediator', function(plugin) {
    this.plugin = plugin;
    this.layerProperties = {};
}, {
    setConnection : function(cometd) {
        this.cometd = cometd;
    },

    /**
     *
     */
    subscribe : function() {
        var cometd = this.cometd;
        var me = this;

        var channels = {
            '/wfs/properties' : function() {
                me.getWFSProperties.apply(me, arguments);
            },
            '/wfs/feature' : function() {
                me.getWFSFeature.apply(me, arguments);
            },
            '/wfs/mapClick' : function() {
                me.getWFSMapClick.apply(me, arguments);
            },
            '/wfs/image' : function() {
                me.getWFSImage.apply(me, arguments);
            }
        };

        for(var c in channels ) {
            cometd.subscribe(c, channels[c]);
        }
    },
    /*
     *
     */
    startup : function(session) {
        var me = this;
        this.session = session;
        var cometd = this.cometd;
        var layers = this.plugin.getSandbox().findAllSelectedMapLayers(); // get array of AbstractLayer (WFS|WMS..)
        var initLayers = {};
        for (var i = 0; i < layers.length; ++i) {
            if (layers[i].isLayerOfType('WFS')) {
                initLayers[layers[i].getId() + ""] = { styleName: "default" };
            }
        }

        var srs = this.plugin.getSandbox().getMap().getSrsName();
        var bbox = this.plugin.getSandbox().getMap().getExtent();
        var zoom = this.plugin.getSandbox().getMap().getZoom();
        this.plugin.getSandbox().getMap().getExtent();

        cometd.publish('/service/wfs/init', {
            "session" : session.session,
            "browser" : session.browser,
            "browserVersion" : session.browserVersion,
            "location": {
                "srs": srs,
                "bbox": [bbox.left,bbox.bottom,bbox.right,bbox.top],
                "zoom": zoom
            },
            "mapSize": {
                "width": me.plugin.getSandbox().getMap().getWidth(),
                "height": me.plugin.getSandbox().getMap().getHeight()
            },
            "layers": initLayers
        });
    }
});

Oskari.clazz.category('Oskari.mapframework.bundle.mapwfs2.service.Mediator', 'getters', {
    getWFSProperties : function(data) {
        console.log("properties", data.data);

        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        layer.setFields(data.data.fields);
        layer.setLocales(data.data.locales);

        var event = this.plugin.getSandbox().getEventBuilder("WFSPropertiesEvent")(layer);
        this.plugin.getSandbox().notifyAll(event);
    },

    getWFSFeature : function(data) {
        console.log("feature", data.data);

        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        layer.setActiveFeature(data.data.feature);

        var event = this.plugin.getSandbox().getEventBuilder("WFSFeatureEvent")(
            layer,
            data.data.feature
        );
        this.plugin.getSandbox().notifyAll(event);
    },

    getWFSMapClick : function(data) {
        console.log("mapClick", data.data);

        var featureIds = [];
        for (var i = 0; i < data.data.features.length; ++i) {
            featureIds.push(data.data.features[i][0]);
        }
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var keepPrevious = data.data.keepPrevious;

        var event = this.plugin.getSandbox().getEventBuilder("WFSFeaturesSelectedEvent")(featureIds, layer, keepPrevious);
        this.plugin.getSandbox().notifyAll(event);
    },

    // layerId, srs, [left bottom right top], zoom, data/url
    getWFSImage : function(data) {
        // request returns url for ie - others base64
        //console.log("images", data.data);

        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var imageUrl = "";
        try {
            if(typeof data.data.url != "undefined") {
                imageUrl = data.data.url;
            } else {
                imageUrl = 'data:image/png;base64,' + data.data.data;
            }
        } catch(error) {
            this.plugin.getSandbox().printDebug(error);
        }
        var layerPostFix = data.data.type; // "highlight" | "normal"
        var keepPrevious = data.data.keepPrevious; // TODO: tarvitaan backendiltä tieto keepPrevious!

        // send as an event forward to WFSPlugin
        var event = this.plugin.getSandbox().getEventBuilder("WFSImageEvent")(
            layer,
            imageUrl,
            data.data.bbox,
            layerPostFix,
            keepPrevious
        );
        this.plugin.getSandbox().notifyAll(event);
    }
});

// TODO: edit session to hold something else than 'Temp' or fix the session storing!
Oskari.clazz.category('Oskari.mapframework.bundle.mapwfs2.service.Mediator', 'setters', {
    addMapLayer : function(id, style) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/addMapLayer', {
                "id" : id,
                "styleName" : style
            });
        }
    },

    removeMapLayer : function(id) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/removeMapLayer', {
                "id" : id
            });
        }
    },

    highlightMapLayerFeatures: function(id, featureIds, keepPrevious) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/highlightFeatures', {
                "id" : id,
                "featureIds": featureIds,
                "keepPrevious": keepPrevious
            });
        }
    },

    // srs, [left bottom right top], zoom
    setLocation : function(srs, bbox, zoom) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setLocation', {
                "srs" : srs,
                "bbox" : bbox,
                "zoom" : zoom
            });
        }
    },

    setMapSize : function(width, height) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapSize', {
                "width" : width,
                "height" : height
            });
        }
    },

    setMapLayerStyle : function(id, style) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapLayerStyle', {
                "id" : id,
                "styleName" : style
            });
        }
    },

    setMapClick : function(longitude, latitude, keepPrevious) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapClick', {
                "longitude" : longitude,
                "latitude" : latitude,
                "keepPrevious": keepPrevious
            });
        }
    },

    setFilter : function(geojson) {
        filter = {
            geojson: geojson
        };

        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setFilter', {
                "filter" : filter
            });
        }
    },

    setMapLayerVisibility : function(id, visible) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapLayerVisibility', {
                "id" : id,
                "visible" : visible
            });
        }
    }
});
