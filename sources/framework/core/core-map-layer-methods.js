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
         * @public @method findMapLayerFromAllAvailable
         * Finds map layer from all available. Uses
         * Oskari.mapframework.service.MapLayerService.
         *
         * @param {String} id of the layer to get. If id is null, name is used to search the layer.
         * @param {String} name of the layer to get. Only used if id = null.
         *
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * Layer domain object if found matching id or null if not found
         */
        findMapLayerFromAllAvailable: function (id, name) {
            var mapLayerService = this.getLayerService(),
                layer,
                selector = 'no selector';
            if (id) {
              layer = mapLayerService.findMapLayer(id);
              selector = 'id "' + id + '"';
            } else if (name) {
              layer = mapLayerService.findMapLayerByName(name);
              selector = 'name "' + name + '"';
            }

            if (layer === null || layer === undefined) {
                log.debug('Cannot find map layer with ' + selector +
                    ' from all available. ' +
                    'Check that current user has VIEW permissions to that layer.');
            }
            return layer;
        },


        /**
         * @private @method handleAddMapLayerRequest
         * Handles AddMapLayerRequests, adds the map layer to selected layers and sends out
         * an AfterMapLayerAddEvent to signal that a map layer has been selected.
         *
         * @param {Oskari.mapframework.request.common.AddMapLayerRequest} request
         *
         */
        _handleAddMapLayerRequest: function (request) {
            var me = this,
                id = request.getMapLayerId(),
                keepLayersOrder = request.getKeepLayersOrder(), // TODO we need to pass this as false from layerselector...
                isBaseMap = request.isBasemap();

            log.debug(
                'Trying to add map layer with id "' + id + '" AS ' +
                (isBaseMap ? ' BASE ' : ' NORMAL ')
            );

            if (me.getMapState().isLayerSelected(id)) {
                log.debug(
                    'Attempt to select already selected layer "' + id + '"'
                );
                return;
            }

            var mapLayer = me.findMapLayerFromAllAvailable(id);
            if (!mapLayer) {
                // not found, ignore
                log.debug(
                    'Attempt to select layer that is not available "' + id + '"'
                );
                return;
            }
            // FIXME make sure isBaseMap is a boolean and use if (isBaseMap) {...
            // FIXME: this shouldn't modify the maplayer itself!!!
            if (isBaseMap == true) {
                mapLayer.setType('BASE_LAYER');
            }

            // if we need keep layers order, i.e. when map is accessed by link
            var asBaseLayer = keepLayersOrder !== true && (mapLayer.isBaseLayer() || isBaseMap == true);
            this.getMapState().addLayer(mapLayer, asBaseLayer);
            var evt;
            if (mapLayer.isBaseLayer() || isBaseMap) {
                evt = Oskari.eventBuilder('AfterMapLayerAddEvent')(mapLayer, keepLayersOrder, isBaseMap);
            } else {
                evt = Oskari.eventBuilder('AfterMapLayerAddEvent')(mapLayer, true, isBaseMap);
            }
            me.copyObjectCreatorToFrom(evt, request);
            me.dispatch(evt);
        },

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