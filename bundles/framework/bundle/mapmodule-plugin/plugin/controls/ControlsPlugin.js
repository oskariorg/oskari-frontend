/**
 * @class Oskari.mapframework.mapmodule.ControlsPlugin
 * Provides tools for measurement/zoombox
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.ControlsPlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
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
        this.pluginName = mapModule.getName() + this.__name;
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
     * 			reference to application sandbox
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
     * 			reference to application sandbox
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

        this.addMapControls();
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(var reqName in this.requestHandlers ) {
            sandbox.removeRequestHandler(reqName, this.requestHandlers[reqName]);
        }
        
        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
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
            this._zoomBoxTool.deactivate();
            this._measureControls.line.deactivate();
            this._measureControls.area.deactivate();
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
    /***********************************************************
     * Add necessary controls on the map
     *
     * @param {Oskari.mapframework.sandbox.Sandbox}
     *            sandbox
     */
    addMapControls : function(sandbox) {
        var me = this;
                
        // zoom tool
        OpenLayers.Control.ZoomBox.prototype.draw = function() {
            this.handler = new OpenLayers.Handler.Box(this, {
                done : function(position) {
                    this.zoomBox(position);
                    me.getMapModule().notifyMoveEnd();
                }
            }, {
                keyMask : this.keyMask
            });
        };
        this._zoomBoxTool = new OpenLayers.Control.ZoomBox({
            alwaysZoom : true
        });

        this.getMapModule().addMapControl('zoomBoxTool', this._zoomBoxTool);
        this._zoomBoxTool.deactivate();

        // Map movement/keyboard control
        this._keyboardControls = new OpenLayers.Control.PorttiKeyboard({
            core : this._sandbox._core,
            mapmodule : this.getMapModule()
        });
        this.getMapModule().addMapControl('keyboardControls', this._keyboardControls);
        this.getMapModule().getMapControl('keyboardControls').activate();
        
        // Measure tools
        var optionsLine = {
            handlerOptions : {
                persist : true
            },
            immediate : true
        };
        var optionsPolygon = {
            handlerOptions : {
                persist : true
            },
            immediate : true
        };

        this._measureControls = {
            line : (new OpenLayers.Control.Measure(OpenLayers.Handler.Path, optionsLine)),
            area : (new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, optionsPolygon))
        };

        var me = this;
        function measurementsHandler(event, finished) {
            var sandbox = me._sandbox;
            var geometry = event.geometry;
            var units = event.units;
            var order = event.order;
            var measure = event.measure;
            var out = null;
            if( order === 1) {
            	out = measure.toFixed(3) + " " + units;
           } else if( order ===2) {
            	out = measure.toFixed(3) + " " + units + "<sup>2</sup>";
            }   
            /*sandbox.printDebug(out + " " + ( finished ? "FINISHED" : "CONTINUES"));*/
            
            var geomAsText = null;
            var geomMimeType = null;
            if( finished ) {
            	if( OpenLayers.Format['GeoJSON'] ) {
            		var format = new (OpenLayers.Format['GeoJSON'])();
            		geomAsText = format.write(geometry,true);
            		geomMimeType = "application/json";
            	}
            }
            sandbox.request(me, sandbox.getRequestBuilder('ShowMapMeasurementRequest')(out,finished,geomAsText, geomMimeType ));
        };

        for(var key in this._measureControls) {
            var control = this._measureControls[key];
            control.events.on({
                'measure' : function(event) {
                    measurementsHandler(event, true);
                },
                'measurepartial' : function(event) {
                    measurementsHandler(event, false);
                }
            });
        }
        this.getMapModule().addMapControl('measureControls_line', this._measureControls.line);
        this._measureControls.line.deactivate();
        this.getMapModule().addMapControl('measureControls_area', this._measureControls.area);
        this._measureControls.area.deactivate();

        // mouse control
        this._mouseControls = new OpenLayers.Control.PorttiMouse({
            sandbox : this._sandbox,
            mapmodule : this.getMapModule()
        });
        this.getMapModule().addMapControl('mouseControls', this._mouseControls);
        

    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
