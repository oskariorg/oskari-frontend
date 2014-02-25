/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundleInstance
 *
 * Initializes Oskari core and starts a map window application. Much of the map related properties
 * and initial state are read from bundle configuration/state.
 *
 * See bundle documentation at http://www.oskari.org/trac/wiki/DocumentationBundleMapfull
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance",
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.map = null;
        this.core = null;
        this.sandbox = null;
        this.mapmodule = null;
        this.state = undefined;
        /**
         * @property {String} mapDivId
         * ID of the DOM element the map will be rendered to
         * Configurable through conf.mapElement
         */
        this.mapDivId = "mapdiv";
        this.contentMapDivId = 'contentMap';
    }, {
        /**
         * @method getMapModule
         * Returns reference to the map module
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function () {
            return this.mapmodule;
        },
        /**
         * @method getSandbox
         * Returns reference to Oskari sandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method _createUi
         * Creates the map module and rendes it to DOM element that has the id
         * specified by #mapDivId. Sets the size of the element if specified in
         * config or if isn't specified, sets the height of the element to window height
         * and starts listening to window resizing.
         * Initializes and registers map module plugins if specified in bundles config.
         * @private
         */
        _createUi: function () {
            var me = this,
                module = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Main", me.conf.imageLocation, me.conf.mapOptions);

            me.mapmodule = module;
            var map = me.sandbox.register(module);
            // set map size
            // call portlet with ?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&published=true
            // -> uses published.jsp
            if (me.conf.size) {
                jQuery('#' + me.mapDivId).width(me.conf.size.width);
                jQuery('#' + me.mapDivId).height(me.conf.size.height);
            } else {
                // react to window resize with timer so app stays responsive
                var adjustMapSize = function () {
                    // do not resize map if resizeEnabled is false
                    if (me.resizeEnabled === null || me.resizeEnabled === undefined || me.resizeEnabled) {
                        var contentMap = jQuery('#' + me.contentMapDivId),
                            mapDiv = jQuery('#' + me.mapDivId),
                            windowHeight = jQuery(window).height();

                        contentMap.height(windowHeight);

                        var toolbar = contentMap.find('.oskariui-menutoolbar');
                        if (toolbar.length > 0 && toolbar.is(":visible")) {
                            mapDiv.height(windowHeight - toolbar.height());
                        } else {
                            mapDiv.height(windowHeight);
                        }
                        // notify openlayers that size has changed
                        module.updateSize();
                    }
                };

                var resizeTimer;
                jQuery(window).resize(function () {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(adjustMapSize, 100);
                });
                adjustMapSize();
                // Hackhack:
                // - something causes a horizontal scrollbar to appear during page load
                // - it disappears _after_ this function is run so the map's size would be wrong
                // - so we delay this a tad to wait it out
                var resizeDelayed = window.setTimeout(adjustMapSize, 1000);
            }


            module.start(me.sandbox);

            map.render(me.mapDivId);
            // startup plugins
            if (me.conf.plugins) {
                var plugins = this.conf.plugins;
                for (var i = 0; i < plugins.length; i++) {
                    try {
                        plugins[i].instance = Oskari.clazz.create(plugins[i].id, plugins[i].config);
                        module.registerPlugin(plugins[i].instance);
                        module.startPlugin(plugins[i].instance);
                    }
                    catch(e) {
                        // something wrong with plugin (e.g. implementation not imported) -> log a warning
                        me.sandbox.printWarn('Unable to start plugin: ' + plugins[i].id);
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
         */
        "start": function () {

            Proj4js.defs = {
                "EPSG:3067": "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs",
                "EPSG:4326": "+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
            };
            var me = this,
                conf = me.conf;

            if (me.conf.projectionDefs) {
                Proj4js.defs = me.conf.projectionDefs;
            }

            var userInterfaceLanguage = Oskari.getLang(),
                core = Oskari.clazz.create('Oskari.mapframework.core.Core');
            me.core = core;
            var sandbox = core.getSandbox();
            me.sandbox = sandbox;

            var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
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
            enhancements.push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'));

            core.init(services, enhancements);

            // need to create ui before parsing layers because layerplugins register modelbuilders
            me._createUi();

            // setup initial maplayers
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                initialLayers = conf.layers,
                i,
                mapLayer;
            if (initialLayers) {
                for (i = 0; i < initialLayers.length; i++) {
                    mapLayer = mapLayerService.createMapLayer(initialLayers[i]);
                    mapLayerService.addLayer(mapLayer, true);
                }
            }

            sandbox.registerAsStateful(me.mediator.bundleId, this);

            var skipLocation = false;
            if (me.mapmodule.isPluginActivated('GeoLocationPlugin')) {
                // get plugin
                var plugin = me.mapmodule.getPluginInstance('GeoLocationPlugin');
                skipLocation = plugin.hasSetLocation();
            }

            me.setState(me.state, skipLocation);

            // create request handlers
            me.mapResizeEnabledRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapfull.request.MapResizeEnabledRequestHandler', me);
            me.mapWindowFullScreenRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapfull.request.MapWindowFullScreenRequestHandler', me);

            // register request handlers
            sandbox.addRequestHandler('MapFull.MapResizeEnabledRequest', me.mapResizeEnabledRequestHandler);
            sandbox.addRequestHandler('MapFull.MapWindowFullScreenRequest', me.mapWindowFullScreenRequestHandler);

        },
        /**
         * @method _teardownState
         * Tears down previous state so we can set a new one.
         * @private
         * @param {Oskari.mapframework.module.Module} module
         *      any registered module so we can just send out requests
         */
        _teardownState: function (module) {
            var selectedLayers = this.sandbox.findAllSelectedMapLayers(),
                // remove all current layers
                rbRemove = this.sandbox.getRequestBuilder('RemoveMapLayerRequest'),
                i;
            for (i = 0; i < selectedLayers.length; i++) {
                this.sandbox.request(module.getName(), rbRemove(selectedLayers[i].getId()));
            }
        },

        /**
   * @method _createServices
   * Setup services for this application. 
   * Mainly Oskari.mapframework.service.MapLayerService, but also hacks in WMTS support
   * and if conf.disableDevelopmentMode == 'true' -> disables debug messaging and 
   * initializes Oskari.mapframework.service.UsageSnifferService to provide 
   * feedback to server about map usage.

   * @param {Object} conf
   *    JSON configuration for the application
   * @private
   */
        _createServices: function (conf) {
            var me = this,
                services = [], // create services that are available in this application
                mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService',
                    conf.globalMapAjaxUrl + 'action_route=GetMapLayers&lang=' + Oskari.getLang(), me.core.getSandbox());
            services.push(mapLayerService);

            // FIXME use ===
            // DisableDevelopmentModeEnhancement
            if (conf.disableDevelopmentMode == 'true') {
                me.core.disableDebug();
            }
            return services;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        "update": function () {

        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop": function () {
            this.sandbox.unregisterStateful(this.mediator.bundleId);
            alert('Stopped!');
        },

        /**
         * @method setState
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         * @param {Object} state bundle state as JSON
         * @param {Boolean} ignoreLocation true to NOT set map location based on state
         */
        setState: function (state, ignoreLocation) {
            var me = this,
                mapmodule = me.sandbox.findRegisteredModuleInstance('MainMapModule'),
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
                rbOpacity = me.sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
                visibilityRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
                styleReqBuilder = me.sandbox.getRequestBuilder('ChangeMapLayerStyleRequest');
                len = state.selectedLayers.length;
                for (i = 0; i < len; ++i) {
                    layer = state.selectedLayers[i];
                    me.sandbox.request(mapmodule.getName(), rbAdd(layer.id, true));
                    me.sandbox.request(mapmodule.getName(), visibilityRequestBuilder(layer.id, layer.hidden !== true));
                    if (layer.style) {
                        me.sandbox.request(mapmodule.getName(), styleReqBuilder(layer.id, layer.style));
                    }
                    if (layer.opacity) {
                        me.sandbox.request(mapmodule.getName(), rbOpacity(layer.id, layer.opacity));
                    }
                }
            }

        },
        /**
         * @method getState
         * Returns bundle state as JSON. State is bundle specific, check the
         * bundle documentation for details.
         * @return {Object}
         */
        getState: function () {
            // get applications current state
            var map = this.sandbox.getMap(),
                selectedLayers = this.sandbox.findAllSelectedMapLayers(),
                zoom = map.getZoom(),
                lat = map.getX(),
                lon = map.getY(),
                i,
                layer,
                layerJson,
                state = {
                    north: lon,
                    east: lat,
                    zoom: map.getZoom(),
                    srs: map.getSrsName(),
                    selectedLayers: []
                };

            for (i = 0; i < selectedLayers.length; i++) {
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
                        layer.getCurrentStyle().getName() !== "!default!") {
                    layerJson.style = layer.getCurrentStyle().getName();
                }
                state.selectedLayers.push(layerJson);
            }

            return state;
        },
        /**
         * Get state parameters.
         * Returns string with layer, opacity and style as layer values.
         *
         * @method getStateParameters
         * @return {String} layers separated with ',' and layer values separated with '+'
         */
        getStateParameters: function () {
            var state = this.getState(),
                link = 'zoomLevel=' + state.zoom + '&coord=' + state.east + '_' + state.north + '&mapLayers=',
                selectedLayers = state.selectedLayers,
                layers = '',
                layer = null,
                i = 0,
                ilen = 0;
            if(this.conf && this.conf.link) {
                // add additional link params (version etc)
                for(var key in this.conf.link) {
                    link = key + '=' + this.conf.link[key] + '&' + link;
                }
            }
            for (i = 0, ilen = selectedLayers.length; i < ilen; i++) {
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
            return link + layers;
        },

        /**
         * @method toggleFullScreen
         * Toggles normal/full screen view of the map window.
         */
        toggleFullScreen: function () {
            jQuery('#' + this.contentMapDivId).toggleClass('oskari-map-window-fullscreen');
            this.mapmodule.updateSize();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.userinterface.Stateful']
    });