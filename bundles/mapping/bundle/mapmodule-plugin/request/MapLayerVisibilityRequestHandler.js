/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler
 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
 */
Oskari.clazz.define('Oskari.mapping.bundle.mapmodule.request.MapLayerVisibilityRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 * 			reference to application sandbox
 * @param {Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin} layersPlugin
 * 			reference to layersplugin
 */
function(sandbox, layersPlugin) {
    this.sandbox = sandbox;
    this.layersPlugin = layersPlugin; 
}, {
	/**
	 * @method handleRequest 
	 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        var layerId = request.getMapLayerId();
        var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer || layer.isVisible() == request.getVisible()) {
        	return;
        }
        layer.setVisible(request.getVisible());
        //var map = this.layersPlugin.getMap();
        var module = this.layersPlugin.getMapModule();
        // get openlayers layer objects from map
        var layers = module.getOLMapLayers(layer.getId());
        for ( var i = 0; i < layers.length; i++) {
            module._setLayerImplVisible(layers[i],layer.isVisible());
            
        }
		
		// notify other components
    	this.layersPlugin.notifyLayerVisibilityChanged(layer);
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
