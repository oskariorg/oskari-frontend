/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Mediator
 *
 * Handles Connection's IO
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.service.Mediator',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} config
     * @param {Object} plugin
     *
     */
    function (config, plugin) {
        this.config = config;
        this.plugin = plugin;
        this.connection = this.plugin.getConnection();
        this.__lastRequestId = 0;
        this.cometd = this.connection.get();
        this.layerProperties = {};
        this.__connectionTries = 0;
        this.__latestTry = 0;
        this.__initInProgress = false;
        this.__bufferedMessages = [];

        this.rootURL = location.protocol + '//' +
            this.config.hostname + this.config.port +
            this.config.contextPath;

        this.session = {
            session: this.__getApikey(),
            route: jQuery.cookie('ROUTEID') || ''
        };

        this._previousTimer = null;
        this._featureUpdateFrequence = 200;
        this.statusHandler = Oskari.clazz.create(
        'Oskari.mapframework.bundle.mapwfs2.service.StatusHandler', plugin.getSandbox());

        this.WFSLayerService = plugin.getSandbox().getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');

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
        * Get the next sequence value for a new request
        * @method getNextRequestId
        * @returns {Integer} request id
        */
        getNextRequestId: function() {
            return this.__lastRequestId++;
        },

        /**
         * @method subscribe
         *
         * Subscribes client channels
         */
        subscribe: function () {
            var self = this,
                c;

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
                },
                '/error': function () {
                    self.handleError.apply(self, arguments);
                },
                '/status': function () {
                    self.statusChange.apply(self, arguments);
                }
            };

            for (c in channels) {
                if (channels.hasOwnProperty(c)) {
                    this.cometd.subscribe(c, channels[c]);
                }
            }
        },
        __handleInitStarted : function() {
            var me = this;
            this.__initInProgress = false;
            // send out any buffered messages
            _.each(this.__bufferedMessages, function(item) {
                me.sendMessage(item.channel, item.message);
            });
            // clear the buffer
            this.__bufferedMessages = [];

            // reset connection backdown counters when receiving init success
            this.__connectionTries = 0;
            this.__latestTry = 0;
        },
        handleError : function(params) {
          var oskariLayer = this.plugin.getSandbox().getMap().getSelectedLayer( params.data.layerId );
          //assumption that all layers fail
          this.plugin.getMapModule().loadingState( oskariLayer.getId(), null, true);
          this.statusHandler.handleError(params.data, this.plugin);
        },
        statusChange : function(params) {
            // handle init started
            if(params.data.reqId === -1 && params.data.message === 'started') {
                this.__handleInitStarted();
            }
            else {
                this.statusHandler.handleChannelStatus(params.data);
            }
        },
        sendMessage : function(channel, message) {

            var isInit = (channel === '/service/wfs/init');
            // connected flag is not setup when init is called so ignore it.
            if (isInit || (this.connection.isConnected() && !this.__initInProgress)) {
                if(!isInit) {
                    // skip reqId in init message
                    message.reqId = this.getNextRequestId();
                }
                if(channel === '/service/wfs/removeMapLayer') {
                    this.statusHandler.clearStatus(message.layerId);
                }
                else if(channel === '/service/wfs/setLocation') {
                    // only setup in setLocation?
                    this.statusHandler.handleChannelRequest(message.layerId, channel, message.reqId);
                }
                this.cometd.publish(channel, message);
            }
            else {
                this.__bufferedMessages.push({
                    channel : channel,
                    message : message
                });
            }
        },
        __getApikey : function() {
            // prefer API key - default to cookie or "no session"...
            return Oskari.user().getAPIkey() || jQuery.cookie('JSESSIONID') || '';
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
            this.session.session = this.__getApikey();
            if(!this.session.session) {
                // will not work correctly, try again in a bit
                this.resetWFS();
                return;
            }
            // TODO: get rid of ROUTEID by improving the apikey functionality in server side
            this.session.route = jQuery.cookie('ROUTEID') || '';

            var srs = this.plugin.getSandbox().getMap().getSrsName(),
                bbox = this.plugin.getSandbox().getMap().getBbox(),
                zoom = this.plugin.getSandbox().getMap().getZoom(),
                mapScales = this.plugin.getMapModule().getScaleArray();

            var message = {
                session: this.session.session,
                route: this.session.route,
                language: Oskari.getLang(),
                browser: this.session.browser,
                browserVersion: this.session.browserVersion,
                location: {
                    srs: srs,
                    bbox: [bbox.left, bbox.bottom, bbox.right, bbox.top],
                    zoom: zoom
                },
                grid: this.plugin.getGrid() || {},
                tileSize: this.plugin.getTileSize() || {},
                mapSize: {
                    width: self.plugin.getSandbox().getMap().getWidth(),
                    height: self.plugin.getSandbox().getMap().getHeight()
                },
                mapScales: mapScales,
                layers: {}
            };

            // separated layers to own messages so they get their own request id
            // get array of AbstractLayer (WFS|WMS..)
            var layers = this.plugin.getSandbox().findAllSelectedMapLayers();
            _.each(layers, function(layer) {
                if (!layer.hasFeatureData()) {
                    return;
                }
                message.layers[layer.getId() + ''] = {
                    styleName: layer.getCurrentStyle().getName(),
                    visible : layer.isVisible()
                };
            });
            this.__initInProgress = true;
            this.sendMessage('/service/wfs/init', message);
        },

        /**
         * @method setOrderForFeatureProperties
         * @param {UserLayer} layer
         * @param {Array} fields; feature properties from channel: /wfs/properties
         *
         * Checks the order of feature properties by comparing fields to Userlayer's
         * featureProperties and adds fields indexes to featurePropertiesIndexes
         * featureProperties comes from user_layer table fields column
         */
        setOrderForFeatureProperties: function(layer, fields){
            if(layer.getFeaturePropertyIndexes().length > 0) {
                // already set
                return;
            }
            var orderedFieldsIndexes = [],
                orderedFields = layer.getFeatureProperties(),
                unOrderedFields = fields;

            for (i = 0; i < orderedFields.length; i++){
                index = unOrderedFields.indexOf(orderedFields[i]);
                if (index !== -1){
                    orderedFieldsIndexes.push(index);
                }
            }
            layer.setFeaturePropertyIndexes(orderedFieldsIndexes);
        },
        /**
         * @method sortArrayByFeaturePropertyIndexes
         * @param {UserLayer} layer
         * @param {Array} array
         *
         * Sorts array's fields to match with featurePropertiesIndexes
         * include only user_layer table fields and hiddenfields
         */
        sortArrayByFeaturePropertyIndexes: function(layer, array){
            var arrangedFields = [];
            var orderedFieldsIndexes = layer.getFeaturePropertyIndexes();
            if (orderedFieldsIndexes.length > 0 && array.length > 0){
                for(i = 0; i < orderedFieldsIndexes.length; i++){
                    arrangedFields.push(array[orderedFieldsIndexes[i]]);
                }
                return arrangedFields;
            }else{
                return array;
            }
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
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId),
            self = this;

        if (layer.getLayerType() !== 'analysis') {
            var oldFields = layer.getFields(),
                oldLocales = layer.getLocales();

            if (oldFields.length > 0 && !this.plugin.isArrayEqual(data.data.fields, oldFields) && !this.plugin.isArrayEqual(data.data.locales, oldLocales)) {
                this.plugin.mapMoveHandler();
            }

            if (typeof layer.getFeatureProperties === "function" && layer.hasOrder()) {
                // this is a "userlayer" type layer
                this.setOrderForFeatureProperties(layer,data.data.fields);
                layer.setFields(this.sortArrayByFeaturePropertyIndexes(layer, data.data.fields));
                layer.setLocales (this.sortArrayByFeaturePropertyIndexes(layer, data.data.locales));
            } else {
                // this is any other layer supported by transport
                layer.setFields(data.data.fields);
                layer.setLocales(data.data.locales);
            }

        }

        if (this._propertyTimer) {
            clearTimeout(this._propertyTimer);
            this._propertyTimer = null;
        }
        this._propertyTimer = setTimeout(function () {
            var event = self.plugin.getSandbox().getEventBuilder('WFSPropertiesEvent')(layer);
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
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId),
            self = this,
            feature;
        if (data.data.feature !== 'empty' && data.data.feature !== 'max') {
            feature = data.data.feature;
            if (typeof layer.getFeatureProperties === "function" && layer.hasOrder()) {
                // this is a "userlayer" type layer
                layer.setActiveFeature(this.sortArrayByFeaturePropertyIndexes(layer,feature));
            } else {
                // this is any other layer supported by transport
                layer.setActiveFeature(feature);
            }
        }

        if (this._featureTimer) {
            clearTimeout(this._featureTimer);
            this._featureTimer = null;
        }
        this._featureTimer = setTimeout(function () {
            var event = self.plugin.getSandbox().getEventBuilder('WFSFeatureEvent')(
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
        var sandbox = this.plugin.getSandbox(),
            me = this,
            layer = sandbox.findMapLayerFromSelectedMapLayers(data.data.layerId),
            selectionMode = data.data.keepPrevious,
            featureIds = [];

        /*Ugly -> instead try to figure out _why_ the first click in the selection tool ends up in here*/
        if (this.WFSLayerService && this.WFSLayerService.isSelectionToolsActive()) {
            return;
        }

        // handle CTRL click (selection) and normal click (getInfo) differently
        if (selectionMode) {

            if (!this.__isSelectionLayer(layer.getId())) {
                return;
            }
            if (data.data.features !== 'empty') {
                data.data.features.forEach(function(featureData) {
                    featureIds.push(featureData[0]);
                });
            }
            me.WFSLayerService.setWFSFeaturesSelections(layer.getId(), featureIds);
            var event = sandbox.getEventBuilder('WFSFeaturesSelectedEvent')(me.WFSLayerService.getSelectedFeatureIds(layer.getId()), layer, true);
            sandbox.notifyAll(event);
        } else {
            // FIXME: pass coordinates from server in response, but not like this
            data.data.lonlat = this.lonlat;

            me.WFSLayerService.emptyWFSFeatureSelections(layer);

            if (typeof layer.getFeatureProperties === "function" && layer.hasOrder() && data.data.features !== 'empty'){
                // this is a "userlayer" type layer - props are sorted to match the original order
                features = data.data.features;
                for (var i=0; i<features.length; i++){
                    features [i] = this.sortArrayByFeaturePropertyIndexes (layer, features[i]);
                }
            }
            var infoEvent = sandbox.getEventBuilder('GetInfoResultEvent')(data.data);
            sandbox.notifyAll(infoEvent);
        }
    },
    __isSelectionLayer : function(layerId) {
        var topWFSLayerId = this.WFSLayerService.getTopWFSLayer();
        var analysisWFSLayerId = this.WFSLayerService.getAnalysisWFSLayerId();

        if(analysisWFSLayerId && layerId === analysisWFSLayerId) {
            return true;
        }
        return topWFSLayerId && layerId === topWFSLayerId;
    },
    /**
     * @method getWFSFeatureGeometries
     * @param {Object} data
     *
     * get highlighted feature geometries
     * Creates WFSFeatureGeometriesSelectedEvent
     */
    getWFSFeatureGeometries: function (data) {
        var sandbox = this.plugin.getSandbox(),
            layer = sandbox.findMapLayerFromSelectedMapLayers(data.data.layerId),
            keepPrevious = data.data.keepPrevious;

        if (keepPrevious) {
            if (data.data.geometries) {
                layer.addClickedGeometries(data.data.geometries);
            }
        } else {
            if (data.data.geometries) {
                layer.setClickedGeometries(data.data.geometries);
            }
        }

        var event = sandbox.getEventBuilder('WFSFeatureGeometriesEvent')(layer, keepPrevious);
        sandbox.notifyAll(event);

    },

    /**
     * @method getWFSFilter
     * @param {Object} data
     * @param {Boolean} makeNewSelection; true if user makes selections with selection tool without Ctrl
     *
     * Handles one layer's features per response
     * Creates WFSFeaturesSelectedEvent
     */
    getWFSFilter: function (data) {
        var me = this,
            layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId),
            featureIds = [],
            selectFeatures = true,
            topWFSLayer = this.WFSLayerService.getTopWFSLayer(),
            analysisWFSLayer = this.WFSLayerService.getAnalysisWFSLayerId(),
            hasNoFeatures = data.data.features === 'empty';

        //if user has not used Ctrl during selection, make totally new selection
        var makeNewSelection = !data.data.keepPrevious;
        if(makeNewSelection) {
            selectFeatures = false;
        }

        if (!me.WFSLayerService.isSelectFromAllLayers()) {
            if (analysisWFSLayer && layer.getId() !== analysisWFSLayer) {
                return;
            } else if (!analysisWFSLayer && layer.getId() !== topWFSLayer) {
                if (me.WFSLayerService.getSelectedFeatureIds(layer.getId()) !== 'empty') {
                    me.WFSLayerService.emptyWFSFeatureSelections(layer);
                }
                return;
            }

        } else {
            if (hasNoFeatures) {
                me.WFSLayerService.emptyAllWFSFeatureSelections();
            }
        }

        if (!hasNoFeatures) {
            data.data.features.forEach(function(feat) {
                featureIds.push(feat[0]);
            });
        }

        if (!hasNoFeatures) {
            me.WFSLayerService.setWFSFeaturesSelections(layer.getId(), featureIds, makeNewSelection);
        } else if (makeNewSelection) {
            me.WFSLayerService.emptyWFSFeatureSelections(layer);
        }

        var event = this.plugin.getSandbox().getEventBuilder('WFSFeaturesSelectedEvent')(me.WFSLayerService.getSelectedFeatureIds(layer.getId()), layer, selectFeatures);
        this.plugin.getSandbox().notifyAll(event);
    },

    /**
     * @method getWFSImage
     * @param {Object} data
     *
     * Creates WFSImageEvent
     */
    getWFSImage: function (data) {
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(
                data.data.layerId
            ),
            imageUrl = '';

        try {
            if (typeof data.data.data !== 'undefined') {
                imageUrl = 'data:image/png;base64,' + data.data.data;
            } else {
                imageUrl = this.rootURL + data.data.url + '&session=' + this.session.session;
            }
        } catch (error) {
            this.plugin.getSandbox().printDebug(error);
        }
        var layerType = data.data.type.toLowerCase(), // "highlight" | "normal"
            boundaryTile = data.data.boundaryTile,
            keepPrevious = data.data.keepPrevious,
            size = {
                width: data.data.width,
                height: data.data.height
            };

        // send as an event forward to WFSPlugin (draws)
        var event = this.plugin.getSandbox().getEventBuilder('WFSImageEvent')(
            layer,
            imageUrl,
            data.data.bbox,
            size,
            layerType,
            boundaryTile,
            keepPrevious
        );
        this.plugin.getMapModule().loadingState( layer.getId(), false);
        this.plugin.getSandbox().notifyAll(event);

        if (layerType === 'normal') {
            this.plugin.setPrintTile(
                layer,
                data.data.bbox,
                this.rootURL +
                data.data.url +
                '&session=' +
                this.session.session
            );

            var printoutEvent = this.plugin.getSandbox().getEventBuilder(
                    'Printout.PrintableContentEvent'
                ),
                evt;

            if (printoutEvent) {
                evt = printoutEvent(
                    this.plugin.getName(),
                    layer,
                    this.plugin.getPrintTiles(),
                    null
                );
                this.plugin.getSandbox().notifyAll(evt);
            }
        }
    },

    /**
     * @method resetWFS
     * @param {Object} data
     */
    resetWFS: function (data) {
        // reset any previous timer
        clearTimeout(this.__resetTimeout);
        var me = this;
        var now = new Date().getTime();
        var backdownBuffer = 1000 * Math.pow(2, this.__connectionTries);
        var timeUntilNextTry = now - (this.__latestTry + backdownBuffer);
        if(this.__connectionTries > 6) {
            // notify failure to connect. We could timeout with big number and reset connectionTries?
            me.plugin.showErrorPopup(
                'connection_broken',
                null,
                true
            );
            return;
        }
        if(this.__connectionTries === 0 || timeUntilNextTry < 0) {
            this.__latestTry = now;
            this.__connectionTries++;
            this.startup(null);
            return;
        }
        this.__resetTimeout = setTimeout(function() {
            me.resetWFS(data);
        }, timeUntilNextTry + 10);
    }
});

// send to backend

Oskari.clazz.category(
    'Oskari.mapframework.bundle.mapwfs2.service.Mediator',
    'setters', {
        /**
         * @method addMapLayer
         * @param {Number} id
         * @param {String} style
         * @param {boolean} isVisible default true
         *
         * sends message to /service/wfs/addMapLayer
         */
        addMapLayer: function (id, style, isVisible) {
            var visible = isVisible === false ? false : true;
            this.sendMessage('/service/wfs/addMapLayer', {
                'layerId': id,
                'styleName': style,
                'visible': visible

            });
        },

        /**
         * @method removeMapLayer
         * @param {Number} id
         *
         * sends message to /service/wfs/removeMapLayer
         */
        removeMapLayer: function (id) {
            this.sendMessage('/service/wfs/removeMapLayer', {
                'layerId': id
            });
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
            if (featureIds && featureIds.length > 0) {
                this.sendMessage('/service/wfs/highlightFeatures', {
                    'layerId': id,
                    'featureIds': featureIds,
                    'keepPrevious': !!keepPrevious,
                    'geomRequest': !!geomRequest
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
        setLocation: function (layerId, srs, bbox, zoom, grid, tiles, manualRefesh) {
          var me = this;
          var oskariLayer =me.plugin.getSandbox().getMap().getSelectedLayer( layerId );
            this.sendMessage('/service/wfs/setLocation', {
                'layerId': layerId,
                'srs': srs,
                'bbox': bbox,
                'zoom': zoom,
                'grid': grid,
                'tiles': tiles,
                'manualRefresh': manualRefesh
            });
            if( typeof layerId !== 'number' ) {
                // don't track loading this way for userlayers, analysis, myplaces
                return;
            }
            // track loading state for WFS-layers
            oskariLayer.loadingDone(0);
            tiles.forEach(function(tile){
               me.plugin.getMapModule().loadingState( oskariLayer.getId(), true);
            });
        },

        /**
         * @method setMapSize
         * @param {Number} width
         * @param {Number} height
         *
         * sends message to /service/wfs/setMapSize
         */
        setMapSize: function (width, height) {
            this.sendMessage('/service/wfs/setMapSize', {
                'width': width,
                'height': height
            });
        },

        /**
         * @method setMapLayerStyle
         * @param {Number} id
         * @param {String} style
         *
         * sends message to /service/wfs/setMapLayerStyle
         */
        setMapLayerStyle: function (id, style) {
            this.sendMessage('/service/wfs/setMapLayerStyle', {
                'layerId': id,
                'styleName': style
            });
        },

        /**
         * @method setMapLayerStyle
         * @param {Number} id
         * @param {Object} style
         *
         * sends message to /service/wfs/setMapLayerCustomStyle
         */
        setMapLayerCustomStyle: function (id, style) {
            this.sendMessage('/service/wfs/setMapLayerCustomStyle', {
                'layerId': id,
                'fill_color': style.area.fillColor, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                'fill_pattern': style.area.fillStyle,
                'border_color': style.area.lineColor, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                'border_linejoin': style.area.lineCorner,
                'border_dasharray': style.area.lineStyle,
                'border_width': style.area.lineWidth,
                'stroke_linecap': style.line.cap,
                'stroke_color': style.line.color, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                'stroke_linejoin': style.line.corner,
                'stroke_dasharray': style.line.style,
                'stroke_width': style.line.width,
                'dot_color': style.dot.color, // check somewhere that first char is # - _prefixColorForServer @ MyPlacesWFSTStore.js
                'dot_shape': style.dot.shape,
                'dot_size': style.dot.size
            });
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
            // TODO: save coordinates???
            this.lonlat = lonlat;
            this.sendMessage('/service/wfs/setMapClick', {
                'longitude': lonlat.lon,
                'latitude': lonlat.lat,
                'filter' : {
                    geojson : lonlat.json
                },
                'keepPrevious': keepPrevious,
                'geomRequest': geomRequest
            });
        },

        /**
         * @method setFilter
         * @param {Object} geojson
         * @param {Object} filters;  WFS feature property filter params
         *
         * sends message to /service/wfs/setFilter
         */
        setFilter: function (geojson, keepPrevious) {
            var filter = {
                geojson: geojson
            };
            this.sendMessage('/service/wfs/setFilter', {
                'filter': filter,
                'keepPrevious': keepPrevious
            });
        },
        /**
         * @method setPropertyFilter
         * @param {Object} filters;  WFS feature property filter params
         *
         * sends message to /service/wfs/setPropertyFilter
         */
        setPropertyFilter: function (filters, id) {
            var filter = {
                filters: filters,
                layer_id: id
            };
            this.sendMessage('/service/wfs/setPropertyFilter', {
                'filter': filter
            });
        },

        /**
         * @method setMapLayerVisibility
         * @param {Number} id
         * @param {Boolean} visible
         *
         * sends message to /service/wfs/setMapLayerVisibility
         */
        setMapLayerVisibility: function (id, visible) {
            this.sendMessage('/service/wfs/setMapLayerVisibility', {
                'layerId': id,
                'visible': visible
            });
        },

        /**
         * @method filterDuplicates
         * @param {String []} a1    current array
         * @param {String []} a2    to concat
         *
         * drop duplicates in concat array
         */
        filterDuplicates: function (previouslySelectedIds, selectedIds) {
            var featureIds = [],
                unselectedMode = false;
            if (previouslySelectedIds && selectedIds) {
                selectedIds.forEach(function (id) {
                    if (previouslySelectedIds.indexOf(id) < 0) {
                        featureIds.push(id);
                    } else {
                        previouslySelectedIds.splice(previouslySelectedIds.indexOf(id), 1);
                        unselectedMode = true;

                    }
                });

            }
            if (unselectedMode) {
                return ['unselectMode', previouslySelectedIds.concat(featureIds)];
            } else {
                return ['selectMode', featureIds];
            }
        }
    }
);
