/**
 * @class Oskari.mapframework.mapmodule.InteractionsPlugin
 *
 * Adds mouse and keyboard controls to the map and adds tools controls
 * for zoombox and measurement (line/area). Also adds request handling for
 * ToolSelectionRequest, EnableMapKeyboardMovementRequest, DisableMapKeyboardMovementRequest,
 * EnableMapMouseMovementRequest and DisableMapMouseMovementRequest.
 * Overrides OpenLayers keyboard/mouse controls with PorttiKeyboard and PorttiMouse.
 *
 * default configuration for mouse as of 2012-12-05:
 *
 *
    {
               "id":"Oskari.mapframework.mapmodule.ControlsPlugin",
               "config" : {
                    "mouse" : {
                        "useCenterMapInWheelZoom" : false,
                        "useCenterMapInDblClickZoom": false
                    }
               }
     }
 *
 */

//-----------ol.control --> zoom, scaleLine, mousePosition
//----> toteuta measurementit drawPluginissa: http://openlayers.org/en/v3.6.0/examples/measure.html, http://openlayers.org/en/v3.1.0/examples/measure.js
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.InteractionsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.mapmodule.ControlsPlugin';
        me._name = 'ControlsPlugin';
    }, {
    /** @static @property __name plugin name */
    __name : 'ControlsPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {

        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
            this._createMapControls();
        }
    },
    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        var mapMovementHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler', me.getMapModule());
        this.requestHandlers = {
            'ToolSelectionRequest' : Oskari.clazz.create('Oskari.mapframework.mapmodule.ToolSelectionHandler', sandbox, me),
            'EnableMapKeyboardMovementRequest' : mapMovementHandler,
            'DisableMapKeyboardMovementRequest' : mapMovementHandler,
            'EnableMapMouseMovementRequest' : mapMovementHandler,
            'DisableMapMouseMovementRequest' : mapMovementHandler
        };
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);

        for(var reqName in this.requestHandlers ) {
            sandbox.addRequestHandler(reqName, this.requestHandlers[reqName]);
        }

        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this._addMapControls();
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(var reqName in this.requestHandlers ) {
            sandbox.removeRequestHandler(reqName, this.requestHandlers[reqName]);
        }

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._removeMapControls();

        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method Toolbar.ToolSelectedEvent
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
       'Toolbar.ToolSelectedEvent' : function(event) {
            // changed tool -> cancel any current tool
            if(this.conf.zoomBox !== false) {
                this._zoomBoxTool.deactivate();
            }
            if(this.conf.measureControls !== false) {
                this._measureControls.line.deactivate();
                this._measureControls.area.deactivate();
            }
       }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method _addMapControls
     * Add necessary controls on the map
     * @private
     */
    _addMapControls : function() {
        var me = this;


    },
    /**
     * @method _removeMapControls
     * Remove added controls from the map
     * @private
     */
    _removeMapControls : function() {


    },

    /**
     * @private @method _createMapControls
     * Constructs/initializes necessary controls for the map. After this they can be added to the map
     * with _addMapControls().
     *
     */
    _createMapInteractions: function () {
        var me = this,
            conf = me.getConfig(),
            geodesic = conf.geodesic === undefined ? true : conf.geodesic,
            sandbox = me.getSandbox(),
            key;

            // check if already created
            if (me._zoomBoxTool) {
                return;
            }

            if (conf.zoomBox !== false) {

                me._zoomBoxTool = new ol.interaction.DragZoom();
                // zoom tool
                /* do we need this?
                OpenLayers.Control.ZoomBox.prototype.draw = function () {
                    this.handler = new OpenLayers.Handler.Box(this, {
                        done: function (position) {
                            this.zoomBox(position);
                            if (me.getMapModule()) {
                                me.getMapModule().notifyMoveEnd();
                            }
                        }
                    }, {
                        keyMask: this.keyMask
                    });
                };
                */

            }

            // Map movement/keyboard control
            if (conf.keyboardControls !== false) {
                me._keyboardControls = new OpenLayers.Control.PorttiKeyboard();
                me._keyboardControls.setup(me.getMapModule());
            }

            // Measure tools
            var optionsLine = {
                geodesic: geodesic,
                handlerOptions: {
                    persist: true
                },
                immediate: true
            };
            var optionsPolygon = {
                geodesic: geodesic,
                handlerOptions: {
                    persist: true
                },
                immediate: true
            };

            me._measureControls = {};
            if (conf.measureControls !== false) {
                me._measureControls = {
                    line: (new OpenLayers.Control.Measure(
                        OpenLayers.Handler.Path,
                        optionsLine
                    )),
                    area: (new OpenLayers.Control.Measure(
                        OpenLayers.Handler.Polygon,
                        optionsPolygon
                    ))
                };
            }

            function measurementsHandler(event, finished) {
                var sandbox = me.getSandbox(),
                    geometry = event.geometry,
                    units = event.units,
                    order = event.order,
                    measure = event.measure,
                    mapModule = me.getMapModule(),
                    out = null,
                    geomAsText = null,
                    geomMimeType = null;

                if (order === 1 || order === 2) {
                    out = mapModule.formatMeasurementResult(
                        geometry,
                        order === 1 ? 'line' : 'area'
                    );
                }

                if (finished) {
                    if (OpenLayers.Format.GeoJSON) {
                        var format = new (OpenLayers.Format.GeoJSON)();
                        geomAsText = format.write(geometry, true);
                        geomMimeType = 'application/json';
                    }
                }
                sandbox.request(
                    me,
                    sandbox.getRequestBuilder(
                        'ShowMapMeasurementRequest'
                    )(out, finished, geomAsText, geomMimeType)
                );
            }
            var measureHandler = function (event) {
                    measurementsHandler(event, true);
                },
                measurePartialHandler = function (event) {
                    measurementsHandler(event, false);
                };
            for (key in me._measureControls) {
                if (me._measureControls.hasOwnProperty(key)) {
                    me._measureControls[key].events.on({
                        measure: measureHandler,
                        measurepartial: measurePartialHandler
                    });
                }
            }

            // mouse control
            if (conf.mouseControls !== false) {
                //this._mouseControls = new OpenLayers.Control.PorttiMouse(this.getConfig().mouse);
                me._mouseControls = new OskariNavigation();
                me._mouseControls.setup(this.getMapModule());
            }
}, {
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
