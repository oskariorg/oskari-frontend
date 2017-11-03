/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundleInstance
 *
 * Initializes Oskari map window application. Much of the map related properties
 * and initial state are read from bundle configuration/state.
 *
 * See bundle documentation at http://www.oskari.org/trac/wiki/DocumentationBundleMapfull
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapfull.MapFullBundleInstance',
    /**
     * @static @method create called automatically on construction
     *
     *
     *
     */
    function () {
        this.__name = 'mapfull';
        this.sandbox = null;
        this.mapmodule = null;
        /**
         * @property {String} mapDivId
         * ID of the DOM element the map will be rendered to
         * Configurable through conf.mapElement
         */
        this.mapDivId = 'mapdiv';
        this.contentMapDivId = 'contentMap';
        this.resizeTimer = null;
    }, {
        getName: function () {
            return this.__name;
        },

        /**
         * @method getMapModule
         * Returns reference to the map module
         *
         *
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function () {
            return this.mapmodule;
        },

        /**
         * @method getSandbox
         * Returns reference to Oskari sandbox
         *
         *
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method  @public adjustMapSize adjust map size
         */
        adjustMapSize: function () {
            var me = this;

            // do not resize map if resizeEnabled is false
            if (me.resizeEnabled === null || me.resizeEnabled === undefined || me.resizeEnabled) {
                var contentMap = jQuery('#' + me.contentMapDivId),
                    dataContent = jQuery('.oskariui-left'),
                    dataContentHasContent = dataContent.length && !dataContent.is(':empty'),
                    dataContentWidth = dataContent.width(),
                    mapContainer = contentMap.find('.oskariui-center'),
                    mapDiv = jQuery('#' + me.mapDivId),
                    mapHeight = jQuery(window).height(),
                    mapWidth = contentMap.width(),
                    sidebar = jQuery('#sidebar:visible'),
                    // FIXME: this must be done different way in future
                    statsgrid = jQuery('.statsgrid:visible:not(.oskari-tile):not(.oskari-flyoutcontent)'),

                    maxWidth = jQuery(window).width()-sidebar.width()-statsgrid.width(),
                    mapTools = jQuery('#maptools:visible');

                contentMap.height(mapHeight);

                var toolbar = contentMap.find(
                    '#menutoolbar:visible'
                );
                if (toolbar.length > 0) {
                    mapHeight -= toolbar.height();
                }
                dataContent.height(mapHeight);
                mapDiv.height(mapHeight);

                if (dataContentHasContent) {
                    if (dataContent.is(':visible') &&
                            dataContentWidth) {
                        mapWidth -= dataContentWidth;
                    }
                } else {
                    dataContent.addClass('oskari-closed');
                }

                if(contentMap.hasClass('oskari-map-window-fullscreen')){
                    maxWidth += mapTools.width();
                    maxWidth += sidebar.width();
                    var position = sidebar.position();
                    if(position && position.left){
                        maxWidth += position;
                    }
                }

                if(mapWidth>maxWidth){
                    mapWidth = maxWidth;
                }

                mapContainer.width(mapWidth);

                // notify map module that size has changed
                me.updateSize();
            }
        },

        /**
         * @private @method _createUi
         * Creates the map module and rendes it to DOM element that has the id
         * specified by #mapDivId. Sets the size of the element if specified in
         * config or if isn't specified, sets the height of the element to window height
         * and starts listening to window resizing.
         * Initializes and registers map module plugins if specified in bundles config.
         *
         *
         */
        _createUi: function () {
            var me = this,
                module = Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.MapModule',
                    'Main',
                    me.conf.imageLocation,
                    me.conf.mapOptions,
                    me.mapDivId
                );

            me.mapmodule = module;
            me.getSandbox().register(module);
            // oskariui-left holds statsgrid and possibly other data stuff, size in config should include that as well as the map
            // set map size
            // call portlet with ?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&published=true
            // -> uses published.jsp
            // TODO true path can prolly be removed, we can just set the size on the iframe/container and let the map fill the available space
            if (me.conf.size) {
                // contentMap holds the total width and height of the document
                jQuery('#' + me.contentMapDivId)
                    .width(me.conf.size.width)
                    .height(me.conf.size.height);
                // TODO check if we need to set mapDiv size at all here...
                jQuery('#' + me.mapDivId).height(me.conf.size.height);
            }

            // react to window resize with timer so app stays responsive
            jQuery(window).resize(function () {
                clearTimeout(me.resizeTimer);
                me.resizeTimer = setTimeout(
                    function () {
                        me.adjustMapSize();
                    },
                    100
                );
            });


            me.adjustMapSize();

            // startup plugins
            if (me.conf.plugins) {
                var plugins = this.conf.plugins,
                    i;

                for (i = 0; i < plugins.length; i += 1) {
                    try {
                        plugins[i].instance = Oskari.clazz.create(
                            plugins[i].id,
                            plugins[i].config || {},
                            plugins[i].state
                        );
                        module.registerPlugin(plugins[i].instance);
                    } catch (e) {
                        // something wrong with plugin (e.g. implementation not imported) -> log a warning
                        me.getSandbox().printWarn(
                            'Unable to register plugin: ' + plugins[i].id + ': ' +
                            e
                        );
                    }
                }
            }
            module.start(me.getSandbox());
        },
        /**
         * @method start
         * Implements BundleInstance protocol start method.
         * Initializes Oskari core and Oskari.mapframework.service.MapLayerService.
         * Creates the map view and moves it to location and zoom
         * level specified by #state.
         *
         * Also defines Proj4js.defs for "EPSG:3067" and "EPSG:4326".
         *
         *
         */
        start: function () {
            var me = this,
                conf = me.conf || {},
                sandbox = Oskari.getSandbox(conf.sandbox);

            me._handleProjectionDefs(conf.projectionDefs);
            me.sandbox = sandbox;

            // take map div ID from config if available
            if (conf.mapElement) {
                me.mapDivId = conf.mapElement;
            }
            if (conf.mapContainer) {
                me.contentMapDivId = conf.mapContainer;
            }

            // create services & enhancements
            var services = me._createServices(conf);
            services.forEach(function(service) {
                sandbox.registerService(service);
            });

            // need to create ui before parsing layers because layerplugins register modelbuilders
            me._createUi();

            // setup initial maplayers
            var mapLayerService = sandbox.getService(
                    'Oskari.mapframework.service.MapLayerService'
                ),
                initialLayers = conf.layers,
                i,
                mapLayer;

            if (initialLayers) {
                for (i = 0; i < initialLayers.length; i += 1) {
                    mapLayer = mapLayerService.createMapLayer(initialLayers[i]);
                    if (!mapLayer) {
                        sandbox.printWarn(
                            'MapFullBundleInstance.start: Undefined mapLayer returned for',
                            initialLayers[i]
                        );
                    } else {
                        mapLayerService.addLayer(mapLayer, true);
                    }
                }
            }

            sandbox.registerAsStateful(me.mediator.bundleId, this);

            var skipLocation = false;
            if (me.getMapModule().isPluginActivated('GeoLocationPlugin')) {
                // get plugin
                var plugin = me.getMapModule().getPluginInstances(
                    'GeoLocationPlugin'
                );
                skipLocation = plugin.hasSetLocation();
            }

            me.setState(me.state, skipLocation);

            // create request handlers
            me.mapResizeEnabledRequestHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapfull.request.MapResizeEnabledRequestHandler',
                me
            );
            me.mapWindowFullScreenRequestHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapfull.request.MapWindowFullScreenRequestHandler',
                me
            );
            me.mapSizeUpdateRequestHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapfull.request.MapSizeUpdateRequestHandler',
                me
            );

            // register request handlers
            sandbox.requestHandler(
                'MapFull.MapResizeEnabledRequest',
                me.mapResizeEnabledRequestHandler
            );
            sandbox.requestHandler(
                'MapFull.MapWindowFullScreenRequest',
                me.mapWindowFullScreenRequestHandler
            );
            sandbox.requestHandler(
                'MapFull.MapSizeUpdateRequest',
                me.mapSizeUpdateRequestHandler
            );

        },

        /**
         * @private @method _handleProjectionDefs
         *
         * @param {Object} defs
         *
         */
        _handleProjectionDefs: function (defs) {
            var defaultDefs = {
                'EPSG:3067': '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs',
                'EPSG:4326': '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
            };

            epsgConfs = _.keys(defs);
            _.forEach(epsgConfs, function (conf) {
                if (!_.has(defaultDefs, conf)) {
                    defaultDefs[conf] = defs[conf];
                }
            });
            // OL3 uses proj4
            if(window.proj4) {
                // ensure static projections are defined
                jQuery.each(defaultDefs, function(srs, defs) {
                    window.proj4.defs(srs, defs);
                });
            }
            // OL2 uses Proj4js
            else {
                if(!Proj4js) {
                    window.Proj4js = {};
                }
                // ensure static projections are defined
                Proj4js.defs = defaultDefs;
            }
        },

        /**
         * @private @method _teardownState
         * Tears down previous state so we can set a new one.
         *
         * @param {Oskari.mapframework.module.Module} module
         *      any registered module so we can just send out requests
         *
         */
        _teardownState: function (module) {
            var selectedLayers = this.getSandbox().findAllSelectedMapLayers(),
                // remove all current layers
                rbRemove = Oskari.requestBuilder(
                        'RemoveMapLayerRequest'
                ),
                i;

            for (i = 0; i < selectedLayers.length; i += 1) {
                this.getSandbox().request(
                    module.getName(),
                    rbRemove(selectedLayers[i].getId())
                );
            }
        },

        /**
         * @private @method _createServices
         * Setup services for this application.
         * Mainly MapLayerService, SearchService and PopupService
         *
         * @param {Object} conf
         *    JSON configuration for the application
         *
         */
        _createServices: function (conf) {
            // create initial services that are available in this application
            var services = [];
            var sb = this.getSandbox();
            var searchService = Oskari.clazz.create('Oskari.service.search.SearchService', sb);
            var popupService = Oskari.clazz.create('Oskari.userinterface.component.PopupService', sb);

            services.push(searchService);
            services.push(popupService);

            return services;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         *
         *
         */
        update: function () {

        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         *
         *
         */
        stop: function () {
            this.getSandbox().unregisterStateful(this.mediator.bundleId);
        },

        /**
         * @method setState
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @param {Object} state bundle state as JSON
         * @param {Boolean} ignoreLocation true to NOT set map location based on state
         *
         */
        setState: function (state, ignoreLocation) {
            var me = this,
                mapmodule = me.getMapModule(),
                mapModuleName = mapmodule.getName(),
                rbAdd,
                len,
                i,
                layer,
                sandbox =  me.getSandbox(),
                rbOpacity = Oskari.requestBuilder('ChangeMapLayerOpacityRequest'),
                rbVisible = Oskari.requestBuilder('MapModulePlugin.MapLayerVisibilityRequest');

            me._teardownState(mapmodule);

            // map location needs to be set before layers are added
            // otherwise f.ex. wfs layers break on add
            if (state.hasOwnProperty('east') && ignoreLocation !== true) {
               sandbox.getMap().moveTo(
                    state.east,
                    state.north,
                    state.zoom
                );
            }

            // mapmodule needed to set also param, because without it max zoomlevel check not working
            sandbox.syncMapState(true, mapmodule);

            // setting state
            if (state.selectedLayers) {
                rbAdd = Oskari.requestBuilder('AddMapLayerRequest');

                len = state.selectedLayers.length;
                for (i = 0; i < len; i += 1) {
                    layer = state.selectedLayers[i];

                    var oskariLayer = me.getSandbox().findMapLayerFromAllAvailable(layer.id);
                    if(oskariLayer) {
                        oskariLayer.setVisible(!layer.hidden);
                    }
                    sandbox.request(
                        mapModuleName,
                        rbAdd(layer.id, true)
                    );

                    sandbox.request(
                        mapModuleName,
                        rbVisible(layer.id, !layer.hidden)
                    );

                    if (layer.opacity || layer.opacity === 0) {
                        sandbox.request(
                            mapModuleName,
                            rbOpacity(layer.id, layer.opacity)
                        );
                    }

                    if (layer.style && oskariLayer) {
                        oskariLayer.selectStyle(layer.style);
                    }
                }
            }

            /* Change to this once plugins can handle it...
            var plugins = mapmodule.getPluginInstances(),
                plugin,
                pluginName;

            for (pluginName in plugins) {
                plugin = plugins[pluginName];
                if (plugin && plugin.setState) {
                    plugin.setState(state.plugins[pluginName]);
                }
            }*/

            // Hackhack
            if (!state.plugins) {
                state.plugins = {};
            }

            if (!state.plugins.MainMapModuleMarkersPlugin) {
                state.plugins.MainMapModuleMarkersPlugin = {};
            }

            var plugins = mapmodule.getPluginInstances(),
                plugin,
                pluginName;

            for (pluginName in state.plugins) {
                if (state.plugins.hasOwnProperty(pluginName)) {
                    // Not finding the plugin is not that uncommon, just move on
                    plugin = plugins[pluginName];
                    if (plugin && plugin.setState) {
                        plugin.setState(state.plugins[pluginName]);
                    }
                }
            }
        },

        /**
         * @method getState
         * Returns bundle state as JSON. State is bundle specific, check the
         * bundle documentation for details.
         *
         *
         * @return {Object}
         */
        getState: function () {
            // get applications current state
            var me = this,
                map = this.getSandbox().getMap(),
                selectedLayers = this.getSandbox().findAllSelectedMapLayers(),
                mapmodule = this.getMapModule(),
                i,
                layer,
                layerJson,
                state = jQuery.extend(
                    {
                        north: map.getY(),
                        east: map.getX(),
                        zoom: map.getZoom(),
                        srs: map.getSrsName(),
                        selectedLayers: []
                    },
                    mapmodule.getState()
                );


            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                layerJson = {
                    id: layer.getId(),
                    opacity: layer.getOpacity()
                };
                if (!layer.isVisible()) {
                    layerJson.hidden = true;
                }
                // check if we have a style selected and doesn't have THE magic string
                if (layer.getCurrentStyle &&
                    layer.getCurrentStyle() &&
                    layer.getCurrentStyle().getName() &&
                    layer.getCurrentStyle().getName() !== '!default!') {
                    layerJson.style = layer.getCurrentStyle().getName();
                }
                state.selectedLayers.push(layerJson);
            }

            return state;
        },

        /**
         * @method getStateParameters
         * Get state parameters.
         * Returns string with layer, opacity and style as layer values.
         *
         *
         * @return {String} layers separated with ',' and layer values separated with '+'
         */
        getStateParameters: function () {
            var state = this.getState(),
                link = 'zoomLevel=' + state.zoom + '&coord=' + state.east + '_' + state.north + '&mapLayers=',
                selectedLayers = state.selectedLayers,
                mapmodule = this.getMapModule(),
                layers = '',
                layer = null,
                i = 0,
                ilen = 0,
                key;

            if (this.conf && this.conf.link) {
                // add additional link params (version etc)
                for (key in this.conf.link) {
                    if (this.conf.link.hasOwnProperty(key)) {
                        link = key + '=' + this.conf.link[key] + '&' + link;
                    }
                }
            }
            for (i = 0, ilen = selectedLayers.length; i < ilen; i += 1) {
                layer = selectedLayers[i];
                if (!layer.hidden) {
                    if (layers !== '') {
                        layers += ',';
                    }
                    layers += layer.id + '+' + layer.opacity;
                    if (layer.style) {
                        layers += '+' + layer.style;
                    } else {
                        layers += '+';
                    }
                }
            }
            return link + layers + mapmodule.getStateParameters();
        },

        /**
         * @method toggleFullScreen
         * Toggles normal/full screen view of the map window.
         *
         *
         */
        toggleFullScreen: function () {

            this.adjustMapSize();
        },

        /**
         * @public @method updateSize
         * Tells the map module that it should update/refresh its size.
         *
         * @param {Boolean} fullUpdate
         * Whether we only tell the map implementation to update its size or if
         * we update the container size as well.
         *
         */
        updateSize: function (fullUpdate) {
            if (fullUpdate) {
                this.adjustMapSize();
            } else {
                this.getMapModule().updateSize();
            }
        },

        /**
         * @public @method getMapEl
         * Get jQuery map element
         *
         *
         * @return {jQuery} jQuery map element
         */
        getMapEl: function () {
            var mapDiv = this.getMapElDom();

            if (!mapDiv) {
                this.getSandbox().printWarn(
                    'mapDiv not found with id ' + this.mapDivId
                );
            }
            return jQuery(mapDiv);
        },

        /**
         * @public @method getMapElDom
         * Get DOM map element
         *
         * @return {Element} Map element
         */
        getMapElDom: function () {
            return document.getElementById(this.mapDivId);
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.userinterface.Stateful'
        ]
    });
