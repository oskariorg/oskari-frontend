/**
 * @class Oskari.mapframework.bundle.parcel2.plugin.HoverPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel2.plugin.HoverPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
}, {
    __name : 'Parcel.HoverPlugin',

    getName : function() {
        return this.pluginName;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * Initializes the plugin:
     * - openlayers hover control
     * @param sandbox reference to Oskari sandbox
     * @method
     */
    init : function(sandbox) {
        var me = this;
			
			
        OpenLayers.Control.Hover = OpenLayers.Class(OpenLayers.Control, {                
            defaultHandlerOptions: {
                'delay': 500,
                'pixelTolerance': null,
                'stopMove': false
            },

            initialize: function(options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                ); 
                this.handler = new OpenLayers.Handler.Hover(
                    this,
                    {'pause': this.onPause, 'move': this.onMove},
                    this.handlerOptions
                );
            }, 

            onPause: function(evt) {
            },

            onMove: function(evt) {
                // if this control sent an Ajax request (e.g. GetFeatureInfo) when
                // the mouse pauses the onMove callback could be used to abort that
                // request.
            }
        });
        
        this.hoverControl = new OpenLayers.Control.Hover({
            handlerOptions: {
                'delay': 500,
                'pixelTolerance': 6
            },
            
            onPause: function(evt) {
            	var lonlat = me._map.getLonLatFromPixel(evt.xy);
		        var event = sandbox.getEventBuilder('Parcel.ParcelHoverEvent')(lonlat, evt, me._map.getZoom());
		        sandbox.notifyAll(event);
            }
        });
        this._map.addControl(this.hoverControl);

    },
    // should activate when omat paikat layer is shown
    activate : function() {
        this.hoverControl.activate();

    },
    // should activate when omat paikat layer is not shown
    deactivate : function() {
        this.hoverControl.deactivate();
    },
    
    register : function() {

    },
    unregister : function() {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;

        sandbox.register(this);

    },
    stopPlugin : function(sandbox) {

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
