/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.CoordinateDisplayBundleInstance
 *
 * Registers and starts the
 * Oskari.harava.bundle.haravagetinfo.plugin.HaravaGetInfoPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.harava.bundle.MapModulePluginBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.requestHandlers = {};
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'HaravaMapModulePlugin',

	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
    	var me = this;
    	if(me.started){
    		return;
    	}
    	
    	me.started = true;
    	
    	var sandbox = Oskari.$("sandbox");
        me.sandbox = sandbox;
        
        sandbox.register(me);
    	
    	// request
    	var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    	this.requestHandlers = {
    			updateMapRequest : Oskari.clazz.create('Oskari.harava.bundle.mapmodule.request.UpdateMapRequestHandler', sandbox, mapModule)
    	};

        sandbox.addRequestHandler('UpdateMapRequest', this.requestHandlers.updateMapRequest);
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {

    	var sandbox = this.sandbox();
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        // request handler cleanup 
        sandbox.removeRequestHandler('UpdateMapRequest', this.requestHandlers['updateMapRequest']);

        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

        sandbox.request(this, request);

        //this.sandbox.unregisterStateful(this.mediator.bundleId);
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
	 * @method init
	 * implements Module protocol init method - initializes request handlers
	 */
	init : function() {
		
	},
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    }
}, {
    protocol : ['Oskari.bundle.BundleInstance']
});