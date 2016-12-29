/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.MapModulePluginBundleInstance
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
	 * @param {Oskari.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.Sandbox}
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

    	var sandbox = Oskari.getSandbox();
        me.sandbox = sandbox;

        var conf = me.conf;

        sandbox.register(me);
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        plugin = Oskari.clazz.create('Oskari.harava.bundle.mapmodule.plugin.AttributionPlugin', conf);
        mapModule.registerPlugin(plugin);
        mapModule.startPlugin(plugin);
        this.plugin = plugin;

        sandbox.register(me);

    	// request
    	var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    	this.requestHandlers = {
    			updateMapRequest : Oskari.clazz.create('Oskari.harava.bundle.mapmodule.request.UpdateMapRequestHandler', sandbox, mapModule),
    			addControlToMapRequest : Oskari.clazz.create('Oskari.harava.bundle.mapmodule.request.AddControlToMapRequestHandler', sandbox, mapModule),
    			zoomToExtentRequest : Oskari.clazz.create('Oskari.harava.bundle.mapmodule.request.ZoomToExtentRequestHandler', sandbox, mapModule)
    	};
        sandbox.addRequestHandler('UpdateMapRequest', this.requestHandlers.updateMapRequest);
        sandbox.addRequestHandler('AddControlToMapRequest', this.requestHandlers.addControlToMapRequest);
        sandbox.addRequestHandler('ZoomToExtentRequest', this.requestHandlers.zoomToExtentRequest);

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
        sandbox.removeRequestHandler('AddControlToMapRequest', this.requestHandlers['addControlToMapRequest']);
        sandbox.removeRequestHandler('ZoomToExtentRequest', this.requestHandlers['zoomToExtentRequest']);

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
	/**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.bundle.BundleInstance']
});