/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundleInstance
 *
 * Initializes Oskari core and starts a map window application. Much of the map related properties
 * and initial state are read from bundle configuration/state.
 *
 * See bundle documentation at http://www.oskari.org/trac/wiki/DocumentationBundleMapfull
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapfull.MapFullBundleInstance',
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.__name = 'mapfull';
        this.map = null;
        this.core = null;
        this.sandbox = null;
        this.mapmodule = null;
        /**
         * @property {String} mapDivId
         * ID of the DOM element the map will be rendered to
         * Configurable through conf.mapElement
         */
        this.mapDivId = 'mapdiv';
        this.contentMapDivId = 'contentMap';
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
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
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
            var map = me.sandbox.register(module);
            // oskariui-left holds statsgrid and possibly other data stuff, size in config should include that as well as the map
            // set map size
            // call portlet with ?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&published=true
            // -> uses published.jsp
            // TODO true path can prolly be removed, we can just set the size on the iframe/container and let the map fill the available space
            if (me.conf.size) {
                // contentMap holds the total width and height of the document
                jQuery('#' + me.contentMapDivId).width(me.conf.size.width);
                jQuery('#' + me.contentMapDivId).height(me.conf.size.height);
                // TODO check if we need to set mapDiv size at all here...
                //jQuery('#' + me.mapDivId).width(me.conf.size.width);
                jQuery('#' + me.mapDivId).height(me.conf.size.height);
            } else {
                // react to window resize with timer so app stays responsive
                var adjustMapSize = function () {
                    // do not resize map if resizeEnabled is false
                    if (me.resizeEnabled === null || me.resizeEnabled === undefined || me.resizeEnabled) {
                        var contentMap = jQuery('#' + me.contentMapDivId),
                            dataContent = jQuery('.oskariui-left'),
                            dataContentHasContent = !dataContent.is(':empty'),
                            dataContentWidth = dataContent.width(),
                            dataContentInlineWidth = dataContent.length ? dataContent[0].style.width : '',
                            mapContainer = contentMap.find('.oskariui-center'),
                            mapDiv = jQuery('#' + me.mapDivId),
                            mapHeight = jQuery(window).height(),
                            mapWidth = contentMap.width();

                        contentMap.height(mapHeight);

                        var toolbar = contentMap.find(
                            '.oskariui-menutoolbar:visible'
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

                        // HACKHACK don't set widths if we have percentages there...
                        if (!dataContentInlineWidth ||
                                dataContentInlineWidth.indexOf('%') === -1) {
                            mapContainer.width(mapWidth);
                            //mapDiv.width(mapWidth);
                        }

                        // notify map module that size has changed
                        me.updateSize();
                    }
                };

                var resizeTimer;
                jQuery(window).resize(function () {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(adjustMapSize, 100);
                });

                adjustMapSize();
            }


            module.start(me.sandbox);

            if (!me.nomaprender) {
                map.render(me.mapDivId);
            }
            // startup plugins
            if (me.conf.plugins) {
                var plugins = this.conf.plugins,
                    i;
                for (i = 0; i < plugins.length; i += 1) {
                    try {
                        plugins[i].instance = Oskari.clazz.create(
                            plugins[i].id,
                            plugins[i].config || (plugins[i].getConfig ? plugins[i].getConfig() : {}),
                            plugins[i].state
                        );
                        module.registerPlugin(plugins[i].instance);
                        module.startPlugin(plugins[i].instance);
                    } catch (e) {
                        // something wrong with plugin (e.g. implementation not imported) -> log a warning
                        me.sandbox.printWarn(
                            'Unable to start plugin: ' + plugins[i].id + ': ' +
                            e
                        );
                    }
                }
            }

            me.map = map;
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
                conf = me.conf,
                core = Oskari.clazz.create('Oskari.mapframework.core.Core'),
                sandbox = core.getSandbox(),
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox';

            // FIXME this doesn't check if conf exists?
            me._handleProjectionDefs(conf.projectionDefs);
            me.core = core;
            me.sandbox = sandbox;


            Oskari.setSandbox(sandboxName, sandbox);
            jQuery.ajax({
                type: 'POST',
                url: conf.globalMapAjaxUrl + 'action_route=GetSupportedLocales',
                timestamp: new Date().getTime(),

                success: function (data) {
                    Oskari.setSupportedLocales(data.supportedLocales);
                    //console.log(blocale.getSupportedLocales());
                },
                error: function () {
                    // TODO add error handling
                }
            });

            // take map div ID from config if available
            if (conf) {
                if (conf.mapElement) {
                    me.mapDivId = conf.mapElement;
                }
                if (conf.mapContainer) {
                    me.contentMapDivId = conf.mapContainer;
                }
            }

            // Init user
            sandbox.setUser(conf.user);
            sandbox.setAjaxUrl(conf.globalMapAjaxUrl);

            // create services
            var services = me._createServices(conf);

            // create enhancements
            var enhancements = [];
            enhancements.push(
                Oskari.clazz.create(
                    'Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'
                )
            );

            core.init(services, enhancements);

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
            if (me.mapmodule.isPluginActivated('GeoLocationPlugin')) {
                // get plugin
                var plugin = me.mapmodule.getPluginInstance(
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
            sandbox.addRequestHandler(
                'MapFull.MapResizeEnabledRequest',
                me.mapResizeEnabledRequestHandler
            );
            sandbox.addRequestHandler(
                'MapFull.MapWindowFullScreenRequest',
                me.mapWindowFullScreenRequestHandler
            );
            sandbox.addRequestHandler(
                'MapFull.MapSizeUpdateRequest',
                me.mapSizeUpdateRequestHandler
            );

            me._initRaphael();
        },

        /**
         * @private @method _initRaphael
         * Initializes Raphael library
         *
         *
         */
        _initRaphael: function () {
            // TODO: Find a more elegant location for registering Raphael font
            //
            // Dot previews use icons from the JSON based font below. A copy of identical ttf
            // file is needed by back end renderer (e.g. GeoServer). Conversion from
            // ttf to js is achieved by cufon at http://cufon.shoqolate.com/generate/.
            if (typeof Raphael !== 'undefined') {
                Raphael.registerFont({
                    w: 512,
                    face: {
                        'font-family': 'dot-markers',
                        'font-weight': 400,
                        'font-stretch': 'normal',
                        'units-per-em': '512',
                        'panose-1': '2 0 5 3 0 0 0 0 0 0',
                        ascent: '480',
                        descent: '-32',
                        bbox: '0 -480 512 32',
                        'underline-thickness': '0',
                        'underline-position': '0',
                        'unicode-range': 'U+E000-U+F000'
                    },
                    glyphs: {
                        ' ': {},
                        '\ue000': {
                            d: '288,-426v-21,-4,-35,-2,-42,5v-2,2,-2,4,-1,7v2,5,5,10,9,18v4,8,6,13,7,15v-3,3,-9,9,-18,17v-13,12,-13,12,-19,18v-7,7,-1,15,18,24v8,4,17,7,26,8v23,5,39,3,49,-5v3,-3,4,-6,3,-9r-9,-18v-4,-9,-4,-10,-8,-18v-3,-6,-4,-9,-5,-11v2,-2,2,-3,11,-11v9,-8,9,-8,15,-14v6,-5,1,-12,-15,-20v-7,-3,-14,-5,-21,-6xm262,-256r9,-48r-12,-2r-9,50r12,0'
                        },
                        '\ue001': {
                            d: '320,-427r-127,0r0,126r35,0r28,45r28,-45r36,0r0,-126'
                        },
                        '\ue002': {
                            d: '256,-429v-17,0,-30,5,-42,17v-12,12,-18,26,-18,43v0,10,5,24,15,43v10,19,20,35,30,48r15,21v40,-53,60,-90,60,-112v0,-17,-6,-31,-18,-43v-12,-12,-25,-17,-42,-17xm256,-344v-7,0,-12,-2,-17,-7v-5,-5,-7,-10,-7,-17v0,-7,2,-13,7,-18v5,-5,10,-7,17,-7v7,0,13,2,18,7v5,5,7,11,7,18v0,7,-2,12,-7,17v-5,5,-11,7,-18,7'
                        },
                        '\ue003': {
                            d: '262,-257r17,-71r-12,-2r-17,73r12,0xm240,-380v0,12,4,22,12,31v8,9,19,13,31,13v12,0,22,-4,31,-13v9,-9,13,-19,13,-31v0,-12,-4,-22,-13,-30v-9,-8,-19,-13,-31,-13v-12,0,-23,5,-31,13v-8,8,-12,18,-12,30'
                        },
                        '\ue004': {
                            d: '262,-257r41,-169r-13,0r-40,169r12,0xm164,-427r18,45r-38,44r115,0r21,-89r-116,0'
                        },
                        '\ue005': {
                            d: '196,-256v0,17,6,30,18,42v12,12,25,18,42,18v17,0,30,-6,42,-18v12,-12,18,-25,18,-42v0,-17,-6,-30,-18,-42v-12,-12,-25,-18,-42,-18v-17,0,-30,6,-42,18v-12,12,-18,25,-18,42'
                        },
                        '\ue006': {
                            d: '284,-331r0,-93r-56,0r0,93r-39,0r67,75r67,-75r-39,0'
                        },
                        '\uf000': {
                            d: '0,-480r512,512r-512,0r0,-512',
                            w: 0
                        },
                        '\u00a0': {}
                    }
                });
            }
        },

        /**
         * @private @method _handleProjectionDefs
         *
         * @param {Object} defs
         *
         */
        _handleProjectionDefs: function (defs) {
            // ensure static projections are defined
            Proj4js.defs = {
                'EPSG:3067': '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs',
                'EPSG:4326': '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
            };

            // use given defs instead
            if (defs) {
                Proj4js.defs = defs;
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
            var selectedLayers = this.sandbox.findAllSelectedMapLayers(),
                // remove all current layers
                rbRemove = this.sandbox.getRequestBuilder(
                        'RemoveMapLayerRequest'
                ),
                i;
            for (i = 0; i < selectedLayers.length; i += 1) {
                this.sandbox.request(
                    module.getName(),
                    rbRemove(selectedLayers[i].getId())
                );
            }
        },

        /**
         * @private @method _createServices
         * Setup services for this application. 
         * Mainly Oskari.mapframework.service.MapLayerService, but also hacks in WMTS support
         * and if conf.disableDevelopmentMode == 'true' -> disables debug messaging and 
         * initializes Oskari.mapframework.service.UsageSnifferService to provide 
         * feedback to server about map usage.
         *
         * @param {Object} conf
         *    JSON configuration for the application
         *
         */
        _createServices: function (conf) {
            var me = this,
                services = [], // create services that are available in this application
                mapLayerService = Oskari.clazz.create(
                    'Oskari.mapframework.service.MapLayerService',
                    conf.globalMapAjaxUrl + 'action_route=GetMapLayers&lang=' + Oskari.getLang(),
                    me.core.getSandbox()
                );
            services.push(mapLayerService);

            // DisableDevelopmentModeEnhancement
            if (conf.disableDevelopmentMode === 'true') {
                me.core.disableDebug();
            }
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
            this.sandbox.unregisterStateful(this.mediator.bundleId);
            alert('Stopped!');
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
                mapmodule = me.sandbox.findRegisteredModuleInstance(
                    'MainMapModule'
                ),
                mapModuleName = mapmodule.getName(),
                rbAdd,
                rbOpacity,
                visibilityRequestBuilder,
                styleReqBuilder,
                len,
                i,
                layer;

            me._teardownState(mapmodule);

            // map location needs to be set before layers are added
            // otherwise f.ex. wfs layers break on add
            if (state.east && ignoreLocation !== true) {
                me.sandbox.getMap().moveTo(
                    state.east,
                    state.north,
                    state.zoom
                );
            }

            me.sandbox.syncMapState(true);

            // setting state
            if (state.selectedLayers) {
                rbAdd = me.sandbox.getRequestBuilder('AddMapLayerRequest');
                rbOpacity = me.sandbox.getRequestBuilder(
                    'ChangeMapLayerOpacityRequest'
                );
                visibilityRequestBuilder = me.sandbox.getRequestBuilder(
                    'MapModulePlugin.MapLayerVisibilityRequest'
                );
                styleReqBuilder = me.sandbox.getRequestBuilder(
                    'ChangeMapLayerStyleRequest'
                );
                len = state.selectedLayers.length;
                for (i = 0; i < len; i += 1) {
                    layer = state.selectedLayers[i];
                    me.sandbox.request(
                        mapModuleName,
                        rbAdd(layer.id, true)
                    );
                    me.sandbox.request(
                        mapModuleName,
                        visibilityRequestBuilder(
                            layer.id,
                            layer.hidden !== true
                        )
                    );
                    if (layer.style) {
                        me.sandbox.request(
                            mapModuleName,
                            styleReqBuilder(layer.id, layer.style)
                        );
                    }
                    if (layer.opacity) {
                        me.sandbox.request(
                            mapModuleName,
                            rbOpacity(layer.id, layer.opacity)
                        );
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
            var map = this.sandbox.getMap(),
                selectedLayers = this.sandbox.findAllSelectedMapLayers(),
                mapmodule = this.sandbox.findRegisteredModuleInstance(
                    'MainMapModule'
                ),
                i,
                layer,
                layerJson,
                state = jQuery.extend({
                    north: map.getY(),
                    east: map.getX(),
                    zoom: map.getZoom(),
                    srs: map.getSrsName(),
                    selectedLayers: []
                }, mapmodule.getState());


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
                mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule'),
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
            jQuery('#' + this.contentMapDivId).toggleClass(
                'oskari-map-window-fullscreen'
            );
            this.updateSize();
        },

        /**
         * @public @method updateSize
         * Tells the map module that it should update/refresh its size.
         *
         *
         */
        updateSize: function () {
            this.mapmodule.updateSize();
        },

        /**
         * @public @method getMapEl
         * Get jQuery map element
         *
         *
         * @return {jQuery} jQuery map element
         */
        getMapEl: function () {
            var mapDiv = jQuery('#' + this.mapDivId);
            if (!mapDiv.length) {
                this.sandbox.printWarn(
                    'mapDiv not found with id ' + this._mapDivId
                );
            }
            return mapDiv;
        },

        /**
         * @public @method getMapElDom
         * Get DOM map element
         *
         * @return {Element} Map element
         */
        getMapElDom: function () {
            return this.getMapEl().get(0);
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
