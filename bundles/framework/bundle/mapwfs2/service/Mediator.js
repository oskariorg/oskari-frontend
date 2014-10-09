/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Mediator
 *
 * Handles Connection's IO
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.service.Mediator',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object} config
     * @param {Object} plugin
     */

    function (config, plugin) {
        this.config = config;
        this.plugin = plugin;
        this.connection = this.plugin.getConnection();
        this.cometd = this.connection.get();
        this.layerProperties = {};

        this.rootURL = location.protocol + "//" +
            this.config.hostname + this.config.port +
            this.config.contextPath;

        this.session = {
            session: jQuery.cookie('JSESSIONID') || "",
            route: jQuery.cookie('ROUTEID') || ""
        };

        this._previousTimer = null;
        this._featureUpdateFrequence = 200;
    }, {

        /**
         * @method getSessionID
         */
        getSessionID: function () {
            return this.session.session;
        },

        /**
         * @method getRootURL
         */
        getRootURL: function () {
            return this.rootURL;
        },

        /**
         * @method subscribe
         *
         * Subscribes client channels
         */
        subscribe: function () {
            var self = this;

            var channels = {
                '/wfs/properties': function () {
                    self.getWFSProperties.apply(self, arguments);
                },
                '/wfs/feature': function () {
                    self.getWFSFeature.apply(self, arguments);
                },
                '/wfs/featureGeometries': function () {
                    self.getWFSFeatureGeometries.apply(self, arguments);
                },
                '/wfs/mapClick': function () {
                    self.getWFSMapClick.apply(self, arguments);
                },
                '/wfs/filter': function () {
                    self.getWFSFilter.apply(self, arguments);
                },
                '/wfs/propertyfilter': function () {
                    self.getWFSFilter.apply(self, arguments);
                },
                '/wfs/image': function () {
                    self.getWFSImage.apply(self, arguments);
                },
                '/wfs/reset': function () {
                    self.resetWFS.apply(self, arguments);
                }
            };


            for (var c in channels) {
                this.cometd.subscribe(c, channels[c]);
            }
        },

        /**
         * @method startup
         * @param {Object} session
         *
         * Sends init information to the backend
         */
        startup: function (session) {
            var self = this;
            if (session) { // use objects session if not defined as parameter
                this.session = session;
            }

            // update session and route
            this.session.session = jQuery.cookie('JSESSIONID') || "";
            this.session.route = jQuery.cookie('ROUTEID') || "";

            var layers = this.plugin.getSandbox().findAllSelectedMapLayers(), // get array of AbstractLayer (WFS|WMS..)
                initLayers = {},
                i;
            for (i = 0; i < layers.length; ++i) {
                if (layers[i].hasFeatureData()) {
                    initLayers[layers[i].getId() + ""] = {
                        styleName: layers[i].getCurrentStyle().getName()
                    };
                }
            }

            var srs = this.plugin.getSandbox().getMap().getSrsName(),
                bbox = this.plugin.getSandbox().getMap().getExtent(),
                zoom = this.plugin.getSandbox().getMap().getZoom(),
                mapScales = this.plugin.mapModule.getMapScales(),
                grid = this.plugin.getGrid();
            if (grid === null || grid === undefined) {
                grid = {};
            }
            var tileSize = this.plugin.getTileSize();
            if (tileSize === null || tileSize === undefined) {
                tileSize = {};
            }

            this.cometd.publish('/service/wfs/init', {
                "session": this.session.session,
                "route": this.session.route,
                "language": Oskari.getLang(),
                "browser": this.session.browser,
                "browserVersion": this.session.browserVersion,
                "location": {
                    "srs": srs,
                    "bbox": [bbox.left, bbox.bottom, bbox.right, bbox.top],
                    "zoom": zoom
                },
                "grid": grid,
                "tileSize": tileSize,
                "mapSize": {
                    "width": self.plugin.getSandbox().getMap().getWidth(),
                    "height": self.plugin.getSandbox().getMap().getHeight()
                },
                "mapScales": mapScales,
                "layers": initLayers
            });
        }
    });

// receive from backend

Oskari.clazz.category('Oskari.mapframework.bundle.mapwfs2.service.Mediator', 'getters', {
    /**
     * @method getWFSProperties
     * @param {Object} data
     *
     * Creates WFSPropertiesEvent
     */
    getWFSProperties: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        if (layer.getLayerType() != 'analysis') {
            var oldFields = layer.getFields();
            var oldLocales = layer.getLocales();
            if (oldFields.length > 0 && !this.plugin.isArrayEqual(data.data.fields, oldFields) && !this.plugin.isArrayEqual(data.data.locales, oldLocales)) {
                this.plugin.mapMoveHandler();
            }

            layer.setFields(data.data.fields);
            layer.setLocales(data.data.locales);

        }

        var self = this;
        if (this._propertyTimer) {
            clearTimeout(this._propertyTimer);
            this._propertyTimer = null;
        }
        this._propertyTimer = setTimeout(function () {
            var event = self.plugin.getSandbox().getEventBuilder("WFSPropertiesEvent")(layer);
            self.plugin.getSandbox().notifyAll(event);
        }, this._featureUpdateFrequence);
    },

    /**
     * @method getWFSFeature
     * @param {Object} data
     *
     * Creates WFSFeatureEvent
     */
    getWFSFeature: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        if (data.data.feature != "empty" && data.data.feature != "max") {
            layer.setActiveFeature(data.data.feature);
        }

        var self = this;
        if (this._featureTimer) {
            clearTimeout(this._featureTimer);
            this._featureTimer = null;
        }
        this._featureTimer = setTimeout(function () {
            var event = self.plugin.getSandbox().getEventBuilder("WFSFeatureEvent")(
                layer,
                data.data.feature
            );
            self.plugin.getSandbox().notifyAll(event);
        }, this._featureUpdateFrequence);
    },

    /**
     * @method getWFSMapClick
     * @param {Object} data
     *
     * Collects every layer's responses - one layer's features per response and calls plugin's showInfoBox
     * Creates WFSFeaturesSelectedEvent
     */
    getWFSMapClick: function (data) {
        var sandbox = this.plugin.getSandbox();
        var layer = sandbox.findMapLayerFromSelectedMapLayers(data.data.layerId);
        var keepPrevious = data.data.keepPrevious;
        var featureIds = [];

        if (data.data.features != "empty") {
            layer.setSelectedFeatures([]);
            // empty selected
            for (var i = 0; i < data.data.features.length; ++i) {
                featureIds.push(data.data.features[i][0]);
            }
        }

        if (keepPrevious) {
            layer.setClickedFeatureIds(layer.getClickedFeatureIds().concat(featureIds));
        } else {
            layer.setClickedFeatureIds(featureIds);
        }

        var event = sandbox.getEventBuilder("WFSFeaturesSelectedEvent")(featureIds, layer, keepPrevious);
        sandbox.notifyAll(event);

        data.data.lonlat = this.lonlat;
        var infoEvent = sandbox.getEventBuilder('GetInfoResultEvent')(data.data);
        sandbox.notifyAll(infoEvent);
    },
    /**
     * @method getWFSFeatureGeometries
     * @param {Object} data
     *
     * get highlighted fea geometries
     * Creates WFSFeatureGeometriesSelectedEvent
     */
    getWFSFeatureGeometries: function (data) {
        var sandbox = this.plugin.getSandbox();
        var layer = sandbox.findMapLayerFromSelectedMapLayers(data.data.layerId);
        var keepPrevious = data.data.keepPrevious;


        if (keepPrevious) {
            if (data.data.geometries) layer.addClickedGeometries(data.data.geometries);
        } else {
            if (data.data.geometries) layer.setClickedGeometries(data.data.geometries);
        }

        var event = sandbox.getEventBuilder("WFSFeatureGeometriesEvent")(layer, keepPrevious);
        sandbox.notifyAll(event);

    },

    /**
     * @method getWFSFilter
     * @param {Object} data
     *
     * Handles one layer's features per response
     * Creates WFSFeaturesSelectedEvent
     */
    getWFSFilter: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var featureIds = [];

        if (data.data.features != "empty") {
            layer.setClickedFeatureIds([]);
            for (var i = 0; i < data.data.features.length; ++i) {
                featureIds.push(data.data.features[i][0]);
            }
        }

        if (data.data.features != "empty") {
            layer.setSelectedFeatures(data.data.features);
        } else {
            layer.setSelectedFeatures([]);
        }

        var event = this.plugin.getSandbox().getEventBuilder("WFSFeaturesSelectedEvent")(featureIds, layer, false);
        this.plugin.getSandbox().notifyAll(event);
    },

    /**
     * @method getWFSImage
     * @param {Object} data
     *
     * Creates WFSImageEvent
     */
    getWFSImage: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var imageUrl = "";
        try {
            if (typeof data.data.data != "undefined") {
                imageUrl = 'data:image/png;base64,' + data.data.data;
            } else {
                imageUrl = this.rootURL + data.data.url + "&session=" + this.session.session;
            }
        } catch (error) {
            this.plugin.getSandbox().printDebug(error);
        }
        var layerType = data.data.type, // "highlight" | "normal"
            boundaryTile = data.data.boundaryTile,
            keepPrevious = data.data.keepPrevious,
            size = {
                width: data.data.width,
                height: data.data.height
            };

        // send as an event forward to WFSPlugin (draws)
        var event = this.plugin.getSandbox().getEventBuilder("WFSImageEvent")(layer, imageUrl, data.data.bbox, size, layerType, boundaryTile, keepPrevious);
        this.plugin.getSandbox().notifyAll(event);


        if (layerType == "normal") {
            this.plugin.setPrintTile(layer, data.data.bbox, this.rootURL + data.data.url + "&session=" + this.session.session);
            var printoutEvent = this.plugin.getSandbox().getEventBuilder('Printout.PrintableContentEvent');
            if (printoutEvent) {
                var evt = printoutEvent(this.plugin.getName(), layer, this.plugin.getPrintTiles(), null);
                this.plugin.getSandbox().notifyAll(evt);
            }
        }
    },

    /**
     * @method resetWFS
     * @param {Object} data
     */
    resetWFS: function (data) {
        this.startup(null);
    }
});

// send to backend

Oskari.clazz.category('Oskari.mapframework.bundle.mapwfs2.service.Mediator', 'setters', {
    /**
     * @method addMapLayer
     * @param {Number} id
     * @param {String} style
     *
     * sends message to /service/wfs/addMapLayer
     */
    addMapLayer: function (id, style) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/addMapLayer', {
                "layerId": id,
                "styleName": style
            });
        }
    },

    /**
     * @method removeMapLayer
     * @param {Number} id
     *
     * sends message to /service/wfs/removeMapLayer
     */
    removeMapLayer: function (id) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/removeMapLayer', {
                "layerId": id
            });
        }
    },

    /**
     * @method highlightMapLayerFeatures
     * @param {Number} id
     * @param {String[]} featureIds
     * @param {Boolean} keepPrevious
     * @param {Boolean} geomRequest  response geometries, if true
     *
     * sends message to /service/wfs/highlightFeatures
     */
    highlightMapLayerFeatures: function (id, featureIds, keepPrevious, geomRequest) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/highlightFeatures', {
                "layerId": id,
                "featureIds": featureIds,
                "keepPrevious": keepPrevious,
                "geomRequest": geomRequest
            });
        }
    },

    /**
     * @method setLocation
     * @param {Number} layerId
     * @param {String} srs
     * @param {Number[]} bbox
     * @param {Number} zoom
     * @param {Object} grid
     * @param {Object} tiles
     *
     * sends message to /service/wfs/setLocation
     */
    setLocation: function (layerId, srs, bbox, zoom, grid, tiles) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/setLocation', {
                "layerId": layerId,
                "srs": srs,
                "bbox": bbox,
                "zoom": zoom,
                "grid": grid,
                "tiles": tiles
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
    setMapSize: function (width, height) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/setMapSize', {
                "width": width,
                "height": height
            });
        }
    },

    /**
     * @method setMapLayerStyle
     * @param {Number} id
     * @param {String} style
     *
     * sends message to /service/wfs/setMapLayerStyle
     */
    setMapLayerStyle: function (id, style) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/setMapLayerStyle', {
                "layerId": id,
                "styleName": style
            });
        }
    },

    /**
     * @method setMapLayerStyle
     * @param {Number} id
     * @param {Object} style
     *
     * sends message to /service/wfs/setMapLayerCustomStyle
     */
    setMapLayerCustomStyle: function (id, style) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/setMapLayerCustomStyle', {
                "layerId": id,

                "fill_color": style.area.fillColor, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                "fill_pattern": style.area.fillStyle,
                "border_color": style.area.lineColor, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                "border_linejoin": style.area.lineCorner,
                "border_dasharray": style.area.lineStyle,
                "border_width": style.area.lineWidth,

                "stroke_linecap": style.line.cap,
                "stroke_color": style.line.color, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                "stroke_linejoin": style.line.corner,
                "stroke_dasharray": style.line.style,
                "stroke_width": style.line.width,

                "dot_color": style.dot.color, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                "dot_shape": style.dot.shape,
                "dot_size": style.dot.size
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
    setMapClick: function (lonlat, keepPrevious, geomRequest) {
        if (this.connection.isConnected()) {
            this.lonlat = lonlat;
            this.cometd.publish('/service/wfs/setMapClick', {
                "longitude": lonlat.lon,
                "latitude": lonlat.lat,
                "keepPrevious": keepPrevious,
                "geomRequest": geomRequest
            });
        }
    },

    /**
     * @method setFilter
     * @param {Object} geojson
     * @param {Object} filters;  WFS feature property filter params
     *
     * sends message to /service/wfs/setFilter
     */
    setFilter: function (geojson) {
        filter = {
            geojson: geojson
        };
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/setFilter', {
                "filter": filter
            });
        }
    },
    /**
     * @method setPropertyFilter
     * @param {Object} filters;  WFS feature property filter params
     *
     * sends message to /service/wfs/setPropertyFilter
     */
    setPropertyFilter: function (filters, id) {
        filter = {
            filters: filters,
            layer_id: id
        };
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/setPropertyFilter', {
                "filter": filter
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
    setMapLayerVisibility: function (id, visible) {
        if (this.connection.isConnected()) {
            this.cometd.publish('/service/wfs/setMapLayerVisibility', {
                "layerId": id,
                "visible": visible
            });
        }
    }

});