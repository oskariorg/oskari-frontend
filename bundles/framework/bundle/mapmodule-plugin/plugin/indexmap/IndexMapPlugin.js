/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin
 *
 * Provides indexmap functionality for map. Uses image from plugin resources as the index map.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginIndexMap
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */

    function (config) {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.conf = config;
        this._indexMap = null;
        this._indexMapUrl = '/framework/bundle/mapmodule-plugin/plugin/indexmap/images/suomi25m_tm35fin.png';
    }, {
        /** @static @property __name plugin name */
        __name: 'IndexMapPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {

        },

        setLocation: function (location, indexMapContainer) {
            var container = indexMapContainer || jQuery(this._indexMap.div);
            // override default location if configured
            if (location) {
                if (location.top) {
                    container.css('bottom', 'auto');
                    container.css('top', location.top);
                }
                if (location.left) {
                    container.css('right', 'auto');
                    container.css('left', location.left);
                }
                if (location.right) {
                    container.css('left', 'auto');
                    container.css('right', location.right);
                }
                if (location.bottom) {
                    container.css('top', 'auto');
                    container.css('bottom', location.bottom);
                }
                if (location.classes) {
                    container.removeClass('top left bottom right center').addClass(location.classes);
                }
            }
        },
        /**
         * @method _createUI
         * @private
         *
         * Constructs/initializes the indexmap  control for the map.
         */
        _createUI: function () {
            /* overview map */
            var me = this,
                graphic = new OpenLayers.Layer.Image('Overview map image',
                    me.getMapModule().getImageUrl() + me._indexMapUrl,
                    new OpenLayers.Bounds(26783, 6608595, 852783, 7787250), new OpenLayers.Size(120, 173));

            /*
             * create an overview map control with non-default
             * options
             */
            var controlOptions = {
                mapOptions: {
                    maxExtent: new OpenLayers.Bounds(26783, 6608595, 852783, 7787250),
                    units: 'm',
                    projection: me._map.getProjection(),
                    numZoomLevels: 1
                },
                layers: [graphic],
                size: new OpenLayers.Size(120, 173),
                autoPan: false,
                controls: []
            };

            /* Indexmap */
            me._indexMap = new OpenLayers.Control.OverviewMap(controlOptions);
            // asynchronicity issue... the control div isn't created yet so we have to wait a bit.
            if (me.conf && me.conf.location) {
                window.setTimeout(function () {
                    var div = me._indexMap.div;
                    if (div) {
                        me.setLocation(me.conf.location, jQuery(div));
                    }
                }, 50);
            }

        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {

        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Adds the indexmap to the map as control.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox;
            me._map = me.getMapModule().getMap();
            me._createUI();

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            me.getMapModule().addMapControl('overviewMap', me._indexMap);
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol.
         * Removes the indexmap from the map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            me.getMapModule().removeMapControl('overviewMap');

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }

            sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapMoveEvent': function (event) {
                if (this._indexMap) {
                    this._indexMap.update();
                }
            }
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if
         * not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });