import { automagicPlugins } from './automagicPlugins';

const LOG = Oskari.log('MapFullBundleInstance');
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
     */
    function () {
        this.__name = 'mapfull';
        this.sandbox = null;
        this.mapmodule = null;
        this._initialStateInit = true;
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
         * @private @method _createUi
         * Creates the map module and rendes it to DOM element that has the id
         * specified by #mapDivId. Sets the size of the element if specified in
         * config or if isn't specified, sets the height of the element to window height
         * and starts listening to window resizing.
         * Initializes and registers map module plugins if specified in bundles config.
         */
        _createUi: function () {
            const me = this;
            const module = Oskari.clazz.create(
                'Oskari.mapframework.ui.module.common.MapModule',
                'Main',
                me.conf.imageLocation,
                me.conf.mapOptions,
                Oskari.dom.getMapImplEl()
            );

            me.mapmodule = module;
            me.getSandbox().register(module);
            // startup plugins
            if (me.conf.plugins) {
                const plugins = this.conf.plugins;
                automagicPlugins
                    .filter(plugin => !plugins.find(cur => cur.id === plugin))
                    .forEach(plugin => {
                        plugins.push({
                            id: plugin,
                            config: {},
                            state: {}
                        });
                    });
                for (let i = 0; i < plugins.length; i += 1) {
                    try {
                        plugins[i].instance = Oskari.clazz.create(
                            plugins[i].id,
                            plugins[i].config || {},
                            plugins[i].state
                        );
                        module.registerPlugin(plugins[i].instance);
                    } catch (err) {
                        // something wrong with plugin (e.g. implementation not imported) -> log a warning
                        LOG.warn('Unable to register plugin: ' + plugins[i].id + ': ', err);
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
            const me = this;
            const conf = me.conf || {};
            const sandbox = Oskari.getSandbox(conf.sandbox);

            this._handleProjectionDefs(conf.projectionDefs);
            this.sandbox = sandbox;

            // create services & enhancements
            const services = this._createServices(conf);
            services.forEach(function (service) {
                sandbox.registerService(service);
            });

            // need to create ui before parsing layers because layerplugins register modelbuilders
            this._createUi();

            // setup initial maplayers
            const mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            const initialLayers = conf.layers || [];

            initialLayers.forEach(layer => {
                const mapLayer = mapLayerService.createMapLayer(layer);
                if (mapLayer) {
                    mapLayerService.addLayer(mapLayer, true);
                } else {
                    LOG.warn('start(): Undefined mapLayer returned for', layer);
                }
            });
            sandbox.registerAsStateful(this.mediator.bundleId, this);

            const skipLocation = this.__hasLocationBeenDeterminedAtRuntime();
            this._initialStateInit = true;
            this.setState(this.state, skipLocation);
            this._initialStateInit = false;
        },
        /**
         * Used to detect if we should use the center coordinate from state on initial render or
         * use the users geolocation instead
         * @returns {Boolean} true if we are using users geolocation
         */
        __hasLocationBeenDeterminedAtRuntime: function () {
            const locationChangingPluginName = 'GeoLocationPlugin';

            if (this.getMapModule().isPluginActivated(locationChangingPluginName)) {
                // get plugin
                const plugin = this.getMapModule().getPluginInstances(locationChangingPluginName);
                return plugin.hasSetLocation();
            }
            return false;
        },

        /**
         * @private @method _handleProjectionDefs
         * @param {Object} defs
         */
        _handleProjectionDefs: function (defs = {}) {
            // OL uses proj4
            if (!window.proj4) {
                // do nothing if proj4 is not available as global variable
                return;
            }
            // supported by default
            const supportedProjections = {
                'EPSG:3067': '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs',
                'EPSG:4326': '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
                'EPSG:3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
            };
            supportedProjections['EPSG:900913'] = supportedProjections['EPSG:3857'];
            // shovel in additional projections
            Object.keys(defs).forEach(projection => {
                if (!supportedProjections[projection]) {
                    supportedProjections[projection] = defs[projection];
                }
            });

            // ensure static projections are defined
            Object.keys(supportedProjections).forEach(projection => {
                window.proj4.defs(projection, supportedProjections[projection]);
            });
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
            // remove all current layers from map
            const selectedLayers = this.getSandbox().findAllSelectedMapLayers();
            const rbRemove = Oskari.requestBuilder('RemoveMapLayerRequest');
            const name = module.getName();
            selectedLayers.forEach(layer => {
                this.getSandbox().request(name, rbRemove(layer.getId()));
            });
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
        _createServices: function () {
            // create initial services that are available in this application
            const services = [];
            const sb = this.getSandbox();
            services.push(Oskari.clazz.create('Oskari.service.search.SearchService', sb));
            services.push(Oskari.clazz.create('Oskari.userinterface.component.PopupService', sb));
            return services;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {},

        /**
         * @method stop
         * implements BundleInstance protocol stop method
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
        setState: function (state = {}, ignoreLocation = false) {
            const mapmodule = this.getMapModule();
            const sandbox = this.getSandbox();

            this._teardownState(mapmodule);
            // map location needs to be set before layers are added
            // otherwise f.ex. wfs layers break on add
            if (ignoreLocation !== true) {
                this.__setStateImplLocation(state);
            }

            // hack to kickstart mapmodule to correct zoom level
            // TODO: check if this is still required (it's OL v2 era thing)
            sandbox.syncMapState(true, mapmodule);

            // setting state for layers on map
            this.__setStateImplLayers(state.selectedLayers);

            // set plugin states
            const pluginsOnMap = mapmodule.getPluginInstances();
            Object.keys(state.plugins || {}).forEach(pluginName => {
                const plugin = pluginsOnMap[pluginName];
                if (plugin && typeof plugin.setState === 'function') {
                    plugin.setState(state.plugins[pluginName]);
                }
            });
        },
        /**
         * Internal helper to make setState() more manageable.
         * Sets map location/camera
         * @private
         * @param {Object} bundle state
         */
        __setStateImplLocation: function (state = {}) {
            const sandbox = this.getSandbox();
            if (typeof state.east !== 'undefined') {
                sandbox.getMap().moveTo(
                    state.east,
                    state.north,
                    state.zoom
                );
            }
            const mapmodule = this.getMapModule();
            // set 3D camera position
            if (state.camera && typeof mapmodule.setCamera === 'function') {
                try {
                    mapmodule.setCamera(state.camera);
                } catch (ex) {
                    LOG.warn('Setting camera failed. Map module does not support 3d.');
                }
            }
            if (state.timePoint) {
                const { date, time, year } = state.timePoint;
                sandbox.postRequestByName('SetTimeRequest', [date, time, year]);
            }
        },
        /**
         * Internal helper to make setState() more manageable
         * Sets state for selected layers
         * @private
         * @param {Object[]} selectedLayers
         */
        __setStateImplLayers: function (selectedLayers = []) {
            const sandbox = this.getSandbox();
            const mapModuleName = this.getMapModule().getName();
            const rbAdd = Oskari.requestBuilder('AddMapLayerRequest');
            const isGuest = !Oskari.user().isLoggedIn();

            const addMapLayer = layer => {
                const { id, style, hidden, opacity } = layer;
                const oskariLayer = sandbox.findMapLayerFromAllAvailable(id);
                if (!oskariLayer) {
                    return layer;
                }
                oskariLayer.setVisible(!hidden);
                if (style) {
                    oskariLayer.selectStyle(style);
                }
                if (!isNaN(opacity)) {
                    oskariLayer.setOpacity(Number.parseInt(opacity));
                }
                const options = {};
                if (isGuest) {
                    // for logged in users styles will be populated based on the logged in user
                    // for guest users looking at embedded map these will hold references to the
                    // styles the user that published the map had for the layer
                    options.userStyles = layer.userStyles;
                }
                sandbox.request(mapModuleName, rbAdd(layer.id, options));
            };
            // add available layers and store unavailable
            const layersNotAvailable = selectedLayers.filter(addMapLayer);

            if (!this._initialStateInit || !layersNotAvailable.length) {
                return;
            }
            // only register this when starting the app to work around timing issues with some dynamically registered layers
            Oskari.on('app.start', () => layersNotAvailable.forEach(addMapLayer));
        },
        // TODO: maybe style.getName() could return '' if name === '!default!', so we get rid of this
        _getCurrentStyleName: function (layer) {
            // check if we have a style selected and doesn't have THE magic string
            const currentStyle = typeof layer.getCurrentStyle === 'function' ? layer.getCurrentStyle() : null;
            const styleName = currentStyle ? currentStyle.getName() : '';
            if (styleName === '!default!') {
                return '';
            }
            return styleName;
        },
        /**
         * @method getState
         * Returns bundle state as JSON. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @return {Object}
         */
        getState: function () {
            // get applications current state
            const sandbox = this.getSandbox();
            const map = sandbox.getMap();
            const state = {
                north: map.getY(),
                east: map.getX(),
                zoom: map.getZoom(),
                srs: map.getSrsName(),
                selectedLayers: [],
                ...this.getMapModule().getState()
            };
            const styleService = sandbox.getService('Oskari.mapframework.userstyle.service.UserStyleService');
            const getUserStylesForLayer = (layerId) => styleService && styleService.getStyleNamesForLayer(layerId);
            state.selectedLayers = map.getLayers().map(layer => {
                const json = {
                    id: layer.getId(),
                    opacity: layer.getOpacity()
                };
                const style = this._getCurrentStyleName(layer);
                if (style) {
                    json.style = style;
                }
                const userStyles = getUserStylesForLayer(json.id);
                if (userStyles && userStyles.length) {
                    // attach references to styles the user has for the layer
                    // this will enable guest users for embedded map to see the styles
                    // the user had when publishing the map
                    json.userStyles = userStyles;
                }
                if (!layer.isVisible()) {
                    json.hidden = true;
                }
                return json;
            });

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
        getStateParameters: function (optimized = false) {
            const map = this.getSandbox().getMap();
            const params = {
                ...this._getConfiguredLinkParams(),
                zoomLevel: map.getZoom(),
                coord: map.getX() + '_' + map.getY()
            };
            // add maplayers
            params.mapLayers = map.getLayers()
                .filter(layer => optimized ? layer.isVisibleOnMap() : layer.isVisible())
                .map(layer => layer.getId() + '+' + layer.getOpacity() + '+' + this._getCurrentStyleName(layer))
                // separate with comma
                .join(',');

            const link = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
            return link + this.getMapModule().getStateParameters();
        },
        _getConfiguredLinkParams: function () {
            if (!this.conf || typeof this.conf.link !== 'object') {
                return {};
            }
            return this.conf.link || {};
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
