/**
 * @class Oskari.framework.core.Core.mapMethods
 *
 * This category class adds map related methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-methods', {

    /**
     * @method doSniffing
     * Logs map usage for given layers
     * @param
     * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     * layersArray
     */
    doSniffing : function(layersArray) {
        /* Check if map movements should be logged */
        if (this._doSniffing) {
            var sniffer = this.getService('Oskari.mapframework.service.UsageSnifferService');
            var visibleLayers = new Array();
            var scale = this._map.getScale();

            /* Loop layers and their sublayers */
            for (var i = 0; i < layersArray.length; i++) {
                var layer = layersArray[i];

                /* first check sublayers */
                for (var j = 0; j < layer.getSubLayers().length; j++) {
                    var subLayer = layer.getSubLayers()[j];
                    if (subLayer.isVisible() && subLayer.getMinScale() >= scale && subLayer.getMaxScale() <= scale) {
                        visibleLayers.push(subLayer);
                    }
                }

                /* then layer it self if it is not a base layer */
                if (!layer.isBaseLayer() && layer.isVisible() && layer.getMinScale() >= scale && layer.getMaxScale() <= scale) {
                    visibleLayers.push(layer);
                }
            }
            if (visibleLayers.length > 0) {
                sniffer.registerMapMovement(visibleLayers, this._map.getX(), this._map.getY(), this._map.getZoom(), this._map.getBbox().toBBOX(), this._mapIdFromUrl);
            }
        }
    },

    /**
     * @method _handleHideMapMarkerRequest
     * Sends out a AfterHideMapMarkerEvent to hide the marker
     * TODO: this should be refactored so that markers plugin keeps track of markers and 
     * handles the HideMapMarkerRequest directly!
     * @deprecated
     * @param {Oskari.mapframework.request.common.HideMapMarkerRequest} request
     * @private 
     */
    _handleHideMapMarkerRequest : function(request) {
        /* Set marker state to domain */
        this._map.setMarkerVisible(false);

        var event = this.getEventBuilder(
        'AfterHideMapMarkerEvent')();
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    }
});
