/**
 * @class Oskari.mapframework.mapmodule.ControlsPlugin
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
Oskari.clazz.define('Oskari.mapframework.mapmodule.ControlsPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.conf = config || {};
    }, {
        /** @static @property __name plugin name */
        __name: 'ControlsPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin doesn't have a UI so always returns false
         */
        hasUI: function () {
            return false;
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
                this._createMapControls();
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
         * @method init
         *
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this,
                mapMovementHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler', me.getMapModule());
            this.requestHandlers = {
                'ToolSelectionRequest': Oskari.clazz.create('Oskari.mapframework.mapmodule.ToolSelectionHandler', sandbox, me),
                'EnableMapKeyboardMovementRequest': mapMovementHandler,
                'DisableMapKeyboardMovementRequest': mapMovementHandler,
                'EnableMapMouseMovementRequest': mapMovementHandler,
                'DisableMapMouseMovementRequest': mapMovementHandler
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
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();

            sandbox.register(this);
            var reqName,
                p;
            for (reqName in this.requestHandlers) {
                if (this.requestHandlers.hasOwnProperty(reqName)) {
                    sandbox.addRequestHandler(reqName, this.requestHandlers[reqName]);
                }
            }

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
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
        stopPlugin: function (sandbox) {
            var reqName,
                p;
            for (reqName in this.requestHandlers) {
                if (this.requestHandlers.hasOwnProperty(reqName)) {
                    sandbox.removeRequestHandler(reqName, this.requestHandlers[reqName]);
                }
            }

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
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
        start: function (sandbox) {},
        /**
         * @method stop
         *
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
            /**
             * @method Toolbar.ToolSelectedEvent
             * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
             */
            'Toolbar.ToolSelectedEvent': function (event) {
                // changed tool -> cancel any current tool
                if (this.conf.zoomBox !== false) {
                    this._zoomBoxTool.deactivate();
                }
                if (this.conf.measureControls !== false) {
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
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method _addMapControls
         * Add necessary controls on the map
         * @private
         */
        _addMapControls: function () {
            var me = this;

            if (this.conf.zoomBox !== false) {
                this.getMapModule().addMapControl('zoomBoxTool', this._zoomBoxTool);
                this._zoomBoxTool.deactivate();
            }
            if (this.conf.keyboardControls !== false) {
                this.getMapModule().addMapControl('keyboardControls', this._keyboardControls);
                this.getMapModule().getMapControl('keyboardControls').activate();
            }

            if (this.conf.measureControls !== false) {
                this.getMapModule().addMapControl('measureControls_line', this._measureControls.line);
                this._measureControls.line.deactivate();
                this.getMapModule().addMapControl('measureControls_area', this._measureControls.area);
                this._measureControls.area.deactivate();
            }

            this.getMapModule().addMapControl('mouseControls', this._mouseControls);
            this.getMapModule().addMapControl('touchWPControls', this._touchControlsWin);
        },
        /**
         * @method _removeMapControls
         * Remove added controls from the map
         * @private
         */
        _removeMapControls: function () {

            if (this.conf.zoomBox !== false) {
                this._zoomBoxTool.deactivate();
                this.getMapModule().removeMapControl('zoomBoxTool', this._zoomBoxTool);
            }
            if (this.conf.keyboardControls !== false) {
                this._keyboardControls.deactivate();
                this.getMapModule().removeMapControl('keyboardControls', this._keyboardControls);
            }

            if (this.conf.measureControls !== false) {
                this._measureControls.line.deactivate();
                this._measureControls.area.deactivate();
                this.getMapModule().removeMapControl('measureControls_line', this._measureControls.line);
                this.getMapModule().removeMapControl('measureControls_area', this._measureControls.area);
            }

            this._mouseControls.deactivate();
            this.getMapModule().removeMapControl('mouseControls', this._mouseControls);

            if (this.conf.touchControls !== false) {
                this.getMapModule().removeMapControl('touchWPControls', this._touchControlsWin);
            }
        },

        /**
         * @method _createMapControls
         * Constructs/initializes necessary controls for the map. After this they can be added to the map
         * with _addMapControls().
         * @private
         */
        _createMapControls: function () {
            var me = this,
                sandbox = me._sandbox;
            // check if already created
            if (this._zoomBoxTool) {
                return;
            }

            if (this.conf.zoomBox !== false) {
                // zoom tool
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

                this._zoomBoxTool = new OpenLayers.Control.ZoomBox({
                    alwaysZoom: true
                });
            }

            // Map movement/keyboard control
            if (this.conf.keyboardControls !== false) {
                this._keyboardControls = new OpenLayers.Control.PorttiKeyboard();
                this._keyboardControls.setup(this.getMapModule());
            }

            // Measure tools
            var optionsLine = {
                handlerOptions: {
                    persist: true
                },
                immediate: true
            };
            var optionsPolygon = {
                handlerOptions: {
                    persist: true
                },
                immediate: true
            };

            this._measureControls = {};
            if (this.conf.measureControls !== false) {
                this._measureControls = {
                    line: (new OpenLayers.Control.Measure(OpenLayers.Handler.Path, optionsLine)),
                    area: (new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, optionsPolygon))
                };
            }

            function measurementsHandler(event, finished) {
                var sandbox = me._sandbox,
                    geometry = event.geometry,
                    units = event.units,
                    order = event.order,
                    measure = event.measure,
                    out = null;
                if (order === 1) {
                    out = measure.toFixed(3) + " " + units;
                } else if (order === 2) {
                    out = measure.toFixed(3) + " " + units + "<sup>2</sup>";
                }
                /*sandbox.printDebug(out + " " + ( finished ? "FINISHED" : "CONTINUES"));*/

                var geomAsText = null,
                    geomMimeType = null;
                if (finished) {
                    if (OpenLayers.Format.GeoJSON) {
                        var format = new (OpenLayers.Format.GeoJSON)();
                        geomAsText = format.write(geometry, true);
                        geomMimeType = "application/json";
                    }
                }
                sandbox.request(me, sandbox.getRequestBuilder('ShowMapMeasurementRequest')(out, finished, geomAsText, geomMimeType));
            }
            var key,
                control;
            for (key in this._measureControls) {
                if (this._measureControls.hasOwnProperty(key)) {
                    control = this._measureControls[key];
                    // FIXME create functions outside loop
                    control.events.on({
                        'measure': function (event) {
                            measurementsHandler(event, true);
                        },
                        'measurepartial': function (event) {
                            measurementsHandler(event, false);
                        }
                    });
                }
            }

            // mouse control
            if (this.conf.mouseControls !== false) {
                //this._mouseControls = new OpenLayers.Control.PorttiMouse(this.conf.mouse);
                this._mouseControls = new OskariNavigation();
                this._mouseControls.setup(this.getMapModule());
            }
            // touch control for windows phone
            /*
            if (this.conf.touchControls !== false) {
                this._touchControlsWin = new OpenLayers.Control.OskariWindowsPinchZoom(this.conf.touch);
                this._touchControlsWin.setup(this.getMapModule());
            }
            */
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });