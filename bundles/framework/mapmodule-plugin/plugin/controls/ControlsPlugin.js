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
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.ControlsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        this.activeTool = null;
        me._clazz =
            'Oskari.mapframework.mapmodule.ControlsPlugin';
        me._name = 'ControlsPlugin';
    }, {
        /**
         * @public @method hasUI
         * This plugin doesn't have a UI, BUT it is controllable in publisher so it is added to map
         * when publisher starts -> always return true to NOT get second navControl on map when publisher starts
         * FIXME this is clearly a hack
         *
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol
         *
         *
         */
        _startPluginImpl: function () {
            var me = this,
                mapModule = me.getMapModule(),
                conf = me.getConfig();

            me._createMapControls();

            if (conf.zoomBox !== false) {
                mapModule.addMapControl('zoomBoxTool', me._zoomBoxTool);
                me._zoomBoxTool.deactivate();
            }
            if (conf.keyboardControls !== false) {
                mapModule.addMapControl(
                    'keyboardControls',
                    me._keyboardControls
                );
                mapModule.getMapControl('keyboardControls').activate();
            }

            if (conf.measureControls !== false) {
                mapModule.addMapControl(
                    'measureControls_line',
                    me._measureControls.line
                );
                me._measureControls.line.deactivate();
                mapModule.addMapControl(
                    'measureControls_area',
                    me._measureControls.area
                );
                me._measureControls.area.deactivate();
            }

            mapModule.addMapControl('mouseControls', me._mouseControls);
        },

        /**
         * @private @method _stopPluginImpl
         * Interface method for the plugin protocol
         *
         *
         */
        _stopPluginImpl: function () {
            var me = this,
                mapModule = me.getMapModule(),
                conf = me.getConfig();

            if (conf.zoomBox !== false) {
                me._zoomBoxTool.deactivate();
                mapModule.removeMapControl(
                    'zoomBoxTool',
                    me._zoomBoxTool
                );
            }
            if (conf.keyboardControls !== false) {
                me._keyboardControls.deactivate();
                mapModule.removeMapControl(
                    'keyboardControls',
                    me._keyboardControls
                );
            }

            if (conf.measureControls !== false) {
                me._measureControls.line.deactivate();
                me._measureControls.area.deactivate();
                mapModule.removeMapControl(
                    'measureControls_line',
                    me._measureControls.line
                );
                mapModule.removeMapControl(
                    'measureControls_area',
                    me._measureControls.area
                );
            }

            me._mouseControls.deactivate();
            mapModule.removeMapControl(
                'mouseControls',
                me._mouseControls
            );
        },

        _createEventHandlers: function () {
            return {
                /**
                 * @method Toolbar.ToolSelectedEvent
                 * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
                 */
                'Toolbar.ToolSelectedEvent': function (event) {
                    // changed tool -> cancel any current tool
                    if (event.getToolId() === this.activeTool){
                        this._deactivateControls(this.activeTool);
                    } else {
                        //deactivate all
                        this._deactivateControls();
                        this.activeTool = null;
                    }
                }
            };
        },
        _deactivateControls: function (skipTool){
            if (this.getConfig().zoomBox !== false && skipTool !== 'zoombox') {
                this._zoomBoxTool.deactivate();
            }
            if (this.getConfig().measureControls !== false) {
                this.getMapModule().orderLayersByZIndex();
                if(skipTool !== 'measureline') {
                    this._measureControls.line.deactivate();
                }
                if (skipTool !== 'measurearea'){
                    this._measureControls.area.deactivate();
                }
            }
        },
        _createRequestHandlers: function () {
            var me = this,
                mapMovementHandler = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler',
                    me.getMapModule()
                );
            return {
                'ToolSelectionRequest': Oskari.clazz.create(
                    'Oskari.mapframework.mapmodule.ToolSelectionHandler',
                    me.getSandbox(),
                    me
                ),
                'EnableMapKeyboardMovementRequest': mapMovementHandler,
                'DisableMapKeyboardMovementRequest': mapMovementHandler,
                'EnableMapMouseMovementRequest': mapMovementHandler,
                'DisableMapMouseMovementRequest': mapMovementHandler
            };
        },

        /**
         * @private @method _createMapControls
         * Constructs/initializes necessary controls for the map. After this they can be added to the map
         * with _addMapControls().
         *
         */
        _createMapControls: function () {
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

                me._zoomBoxTool = new OpenLayers.Control.ZoomBox({
                    alwaysZoom: true
                });
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
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
