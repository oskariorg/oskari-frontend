define(["bundles/framework/bundle/mapmodule-plugin/request/MapLayerVisibilityRequestHandler"], function (MapLayerVisibilityRequestHandler) {
    // Initially require implementation from bundles, later generalize if possible and unify between maplibs
    
    Oskari.cls('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler').category({
        handleRequest: function (core, request) {
            var layerId = request.getMapLayerId();
            var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer || layer.isVisible() === request.getVisible()) {
                return;
            }
            layer.setVisible(request.getVisible());
            var map = this.layersPlugin.getMap();
            var module = this.layersPlugin.getMapModule();
            // get openlayers layer objects from map

            var layerImpl = module.getOLMapLayers(layer.getId());
            if (layerImpl) {
	            layerImpl.show = layer.isVisible();

	            // notify other components
	            this.layersPlugin.notifyLayerVisibilityChanged(layer);
            } else {
            	this.sandbox.printDebug("Layer not found. Missing layerId:" + layer.getId());
            }
        }
    });
});