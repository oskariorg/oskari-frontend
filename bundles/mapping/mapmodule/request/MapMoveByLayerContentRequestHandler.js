/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler
 * Provides functionality to:
 * - Move the map to zoom level that is in scale with the requested maplayer.
 * - Move the map to given layers geometry if it has one.
 * - Optionally if zoomToExtent is true, then move and zoom the map to given layer's extent
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     * @param {Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin} layersPlugin
     *          reference to layersplugin
     */

    function (sandbox, layersPlugin) {
        this.sandbox = sandbox;
        this.layersPlugin = layersPlugin;
    }, {
        /**
         * @method handleRequest
         * Moves the map to zoom level that is in scale with the requested maplayer.
         * Also moves the map to given layers geometry if it has one.
         * Optionally if zoomToExtent is true, then move and zoom the map to given layer's extent
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var layerId = request.getMapLayerId();
            var zoomToExtent = request.getZoomToExtent();
            var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            var newZoom;
            if (!layer) {
                return;
            }

            if (zoomToExtent){
                // move and zoom map to layer extent
                if (layer.getGeometry().length > 0){
                    var bounds = this.layersPlugin.getGeometryBounds(layer.getGeometry()[0]);
                    // suppress mapmove-event
                    this.layersPlugin.getMapModule().zoomToExtent(bounds, true, true);
                    var center = this.layersPlugin.getGeometryCenter(layer.getGeometry()[0]);
                    this.layersPlugin.getMapModule().moveMapToLonLat(center);

                    if (!layer.isInScale()){
                        // set zoom level by layer scales
                        newZoom = this.layersPlugin.getMapModule().getClosestZoomLevel(layer.getMinScale(), layer.getMaxScale());
                        // suppress mapmove-event here and send it after we have possibly also moved the map
                        this.layersPlugin.getMapModule().setZoomLevel(newZoom, true);
                    }
                }
            } else{
                // set zoom level by layer scales
                newZoom = this.layersPlugin.getMapModule().getClosestZoomLevel(layer.getMinScale(), layer.getMaxScale());
                // suppress mapmove-event here and send it after we have possibly also moved the map
                this.layersPlugin.getMapModule().setZoomLevel(newZoom, true);
                // move map to geometries if available
                // this needs to be done after the zoom since it's comparing to viewport which changes in zoom
                if (layer.getGeometry().length > 0) {
                    var containsGeometry = this.layersPlugin.isInGeometry(layer);
                    // only move if not currently in geometry
                    if (!containsGeometry) {
                        var center = this.layersPlugin.getGeometryCenter(layer.getGeometry()[0]);
                        this.layersPlugin.getMapModule().moveMapToLonLat(center);
                    }
                }
            }
            // notify components that the map has moved
            this.layersPlugin.getMapModule().notifyMoveEnd();
            // force visibility check immediately bypassing the performance
            // scheduler thats triggered by notifymoveend
            this.layersPlugin._checkLayersVisibility(this.layersPlugin._visibilityCheckOrder);
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });