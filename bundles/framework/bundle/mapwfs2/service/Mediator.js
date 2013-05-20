/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Mediator
 *
 * Handles Connection's IO
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.service.Mediator',
/**
 * @method create called automatically on construction
 * @static

 * @param {Object} plugin
 */
function(config, plugin) {
    this.config = config;
    this.plugin = plugin;
    this.layerProperties = {};
    this.rootURL = location.protocol + "//" +
            location.hostname + this.config.port  +
            this.config.contextPath;
}, {

    /**
     * @method setConnection
     * @param {Object} cometd
     */
    setConnection : function(cometd) {
        this.cometd = cometd;
    },

    /**
     * @method subscribe
     *
     * Subscribes client channels
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

    /**
     * @method startup
     * @param {Object} session
     *
     * Sends init information to the backend
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
        var mapScales = this.plugin.mapModule.getMapScales();
        var grid = this.plugin.getGrid();
        if(grid == null) {
            grid = {};
        }
        var tileSize = this.plugin.getTileSize();
        if(tileSize == null) {
            tileSize = {};
        }

        cometd.publish('/service/wfs/init', {
            "session" : session.session,
            "browser" : session.browser,
            "browserVersion" : session.browserVersion,
            "location": {
                "srs": srs,
                "bbox": [bbox.left,bbox.bottom,bbox.right,bbox.top],
                "zoom": zoom
            },
            "grid": grid,
            "tileSize": tileSize,
            "mapSize": {
                "width": me.plugin.getSandbox().getMap().getWidth(),
                "height": me.plugin.getSandbox().getMap().getHeight()
            },
            "mapScales": mapScales,
            "layers": initLayers
        });
    }
});

Oskari.clazz.category('Oskari.mapframework.bundle.mapwfs2.service.Mediator', 'getters', {
    /**
     * @method getWFSProperties
     * @param {Object} data
     *
     * Creates WFSPropertiesEvent
     */
    getWFSProperties : function(data) {
        //console.log("properties", data.data);

        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        layer.setFields(data.data.fields);
        layer.setLocales(data.data.locales);

        var event = this.plugin.getSandbox().getEventBuilder("WFSPropertiesEvent")(layer);
        this.plugin.getSandbox().notifyAll(event);
    },

    /**
     * @method getWFSFeature
     * @param {Object} data
     *
     * Creates WFSFeatureEvent
     */
    getWFSFeature : function(data) {
        //console.log("feature", data.data);

        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        layer.setActiveFeature(data.data.feature);

        var event = this.plugin.getSandbox().getEventBuilder("WFSFeatureEvent")(
            layer,
            data.data.feature
        );
        this.plugin.getSandbox().notifyAll(event);
    },

    /**
     * @method getWFSMapClick
     * @param {Object} data
     *
     * Collects every layer's responses - one layer's features per response and calls plugin's showInfoBox
     * Creates WFSFeaturesSelectedEvent
     */
    getWFSMapClick : function(data) {
        //console.log("mapClick", data.data);

        var featureIds = [];
        for (var i = 0; i < data.data.features.length; ++i) {
            featureIds.push(data.data.features[i][0]);
        }
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var keepPrevious = data.data.keepPrevious;

        var layers = this.plugin.getSandbox().findAllSelectedMapLayers();
        wfsLayerCount = 0;
        for (var i = 0; i < layers.length; ++i) {
            if (layers[i].isLayerOfType('WFS')) {
                wfsLayerCount++;
            }
        }
        this.plugin.getmapClickData().wfs.push(data.data);
        if(wfsLayerCount == this.plugin.getmapClickData().wfs.length) {
            this.plugin.getmapClickData().comet = true;
            if(this.plugin.getmapClickData().ajax) {
                //console.log("show info - ajax was before");
                this.plugin.showInfoBox();
            }
        }

        var event = this.plugin.getSandbox().getEventBuilder("WFSFeaturesSelectedEvent")(featureIds, layer, keepPrevious);
        this.plugin.getSandbox().notifyAll(event);
    },

    /**
     * @method getWFSImage
     * @param {Object} data
     *
     * Creates WFSImageEvent
     */
    getWFSImage : function(data) {
        // request returns url for ie - others base64
        console.log("images", data.data);

        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var imageUrl = "";
        try {
            if(typeof data.data.url != "undefined") {
                imageUrl = rootURL + data.data.url;
            } else {
                imageUrl = 'data:image/png;base64,' + data.data.data;
            }
        } catch(error) {
            this.plugin.getSandbox().printDebug(error);
        }
        var layerPostFix = data.data.type; // "highlight" | "normal"
        var keepPrevious = data.data.keepPrevious; // true | false
        var size = { width: data.data.width, height: data.data.height };
        // send as an event forward to WFSPlugin
        var event = this.plugin.getSandbox().getEventBuilder("WFSImageEvent")(
            layer,
            imageUrl,
            data.data.bbox,
            size,
            layerPostFix,
            keepPrevious
        );
        this.plugin.getSandbox().notifyAll(event);
    }
});

Oskari.clazz.category('Oskari.mapframework.bundle.mapwfs2.service.Mediator', 'setters', {
    /**
     * @method addMapLayer
     * @param {Number} id
     * @param {String} style
     *
     * sends message to /service/wfs/addMapLayer
     */
    addMapLayer : function(id, style) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/addMapLayer', {
                "layerId" : id,
                "styleName" : style
            });
        }
    },

    /**
     * @method removeMapLayer
     * @param {Number} id
     *
     * sends message to /service/wfs/removeMapLayer
     */
    removeMapLayer : function(id) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/removeMapLayer', {
                "layerId" : id
            });
        }
    },

    /**
     * @method highlightMapLayerFeatures
     * @param {Number} id
     * @param {String[]} featureIds
     * @param {Boolean} keepPrevious
     *
     * sends message to /service/wfs/highlightFeatures
     */
    highlightMapLayerFeatures: function(id, featureIds, keepPrevious) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/highlightFeatures', {
                "layerId" : id,
                "featureIds": featureIds,
                "keepPrevious": keepPrevious
            });
        }
    },

    /**
     * @method highlightMapLayerFeatures
     * @param {String} srs
     * @param {Number[]} bbox
     * @param {Number} zoom
     *
     * sends message to /service/wfs/setLocation
     */
    setLocation : function(srs, bbox, zoom, grid) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setLocation', {
                "srs" : srs,
                "bbox" : bbox,
                "zoom" : zoom,
                "grid" : grid
            });
        }
    },

    /**
     * @method setMapSize
     * @param {Number} width
     * @param {Number} height
     *
     * sends message to /service/wfs/setMapSize
     */
    setMapSize : function(width, height, grid) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapSize', {
                "width" : width,
                "height" : height,
                "grid" : grid
            });
        }
    },

    /**
     * @method setMapSize
     * @param {Number} id
     * @param {String} style
     *
     * sends message to /service/wfs/setMapLayerStyle
     */
    setMapLayerStyle : function(id, style) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapLayerStyle', {
                "layerId" : id,
                "styleName" : style
            });
        }
    },

    /**
     * @method setMapClick
     * @param {Number} longitude
     * @param {Number} latitude
     * @param {Boolean} keepPrevious
     *
     * sends message to /service/wfs/setMapClick
     */
    setMapClick : function(longitude, latitude, keepPrevious) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapClick', {
                "longitude" : longitude,
                "latitude" : latitude,
                "keepPrevious": keepPrevious
            });
        }
    },

    /**
     * @method setFilter
     * @param {Object} geojson
     *
     * sends message to /service/wfs/setFilter
     */
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

    /**
     * @method setMapLayerVisibility
     * @param {Number} id
     * @param {Boolean} visible
     *
     * sends message to /service/wfs/setMapLayerVisibility
     */
    setMapLayerVisibility : function(id, visible) {
        if(this.cometd != null) {
            this.cometd.publish('/service/wfs/setMapLayerVisibility', {
                "layerId" : id,
                "visible" : visible
            });
        }
    }
});
