/**
 * @class Oskari.mapframework.core.Core.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari core as they
 * were in the class itself.
 */
(function(Oskari) {
    var log = Oskari.log('Core');

    Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-layer-methods', {

        /**
         * @private @method _handleChangeMapLayerOpacityRequest
         * Handles ChangeMapLayerOpacityRequest, sends out an AfterChangeMapLayerOpacityEvent
         *
         * @param {Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest} request
         *
         */
        _handleChangeMapLayerOpacityRequest: function (request) {
            var layer = this.getMapState().getSelectedLayer(request.getMapLayerId());
            if (!layer) {
                return;
            }
            layer.setOpacity(request.getOpacity());

            var event = Oskari.eventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        },

        /**
         * @private @method _handleChangeMapLayerStyleRequest
         * Handles ChangeMapLayerStyleRequest, sends out an AfterChangeMapLayerStyleEvent
         *
         * @param {Oskari.mapframework.request.common.ChangeMapLayerStyleRequest} request
         *
         */
        _handleChangeMapLayerStyleRequest: function (request) {
            var layer = this.getMapState().getSelectedLayer(request.getMapLayerId());
            if (!layer) {
                return;
            }
            // Check for magic string
            if (request.getStyle() !== '!default!') {
                layer.selectStyle(request.getStyle());
                var event = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                this.copyObjectCreatorToFrom(event, request);
                this.dispatch(event);
            }
        }
    });

}(Oskari));