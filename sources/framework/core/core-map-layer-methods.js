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
         * @public @method isMapLayerAlreadyHighlighted
         * Checks if the layer matching the id is "highlighted". Highlighted
         * wfslayer responds to map clicks by highlighting a clicked feature.
         *
         * @param {String} id ID of the layer to check
         *
         * @return {Boolean} True if the layer is highlighted
         */
        isMapLayerAlreadyHighlighted: function (id) {
            var mapLayerService = this.getLayerService(),
                layer = mapLayerService.findMapLayer(
                    id,
                    this._mapLayersHighlighted
                );

            if (layer === null || layer === undefined) {
                log.debug(
                    '[core-map-layer-methods] ' + id + ' is not yet highlighted.'
                );
            }
            return (layer !== null && layer !== undefined);
        },

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
         * @public @method getAllHighlightedMapLayers
         * Returns all currently highlighted map layers
         *
         *
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        getAllHighlightedMapLayers: function () {
            return this._mapLayersHighlighted;
        },

        /**
         * @public @method allowMultipleHighlightLayers
         * Allow multiple layers to be highlighted at once
         *
         * @param {Boolean} allow
         * True to allow, false to restrict to onehighlight at a time
         *
         */
        allowMultipleHighlightLayers: function (allow) {
            this._allowMultipleHighlightLayers = allow;
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
                evt = me.getEventBuilder('AfterMapLayerAddEvent')(mapLayer, keepLayersOrder, isBaseMap);
            } else {
                evt = me.getEventBuilder('AfterMapLayerAddEvent')(mapLayer, true, isBaseMap);
            }
            me.copyObjectCreatorToFrom(evt, request);
            me.dispatch(evt);
        },

        /**
         * @private @method _handleRemoveMapLayerRequest
         * Handles RemoveMapLayerRequests, removes the map layer from selected layers and sends out
         * an AfterMapLayerRemoveEvent to signal that a map layer has been removed from selected.
         *
         * @param {Oskari.mapframework.request.common.RemoveMapLayerRequest} request
         *
         */
        _handleRemoveMapLayerRequest: function (request) {
            var id = request.getMapLayerId();

            log.debug('Trying to remove map layer with id "' + id + '"');

            if(!this.getMapState().removeLayer(id)) {
                log.debug('Attempt to remove layer "' + id + '" that is not selected.');
                return;
            }

            if (this.isMapLayerAlreadyHighlighted(id)) {
                // remove it from highlighted list
                log.debug('Maplayer is also highlighted, removing it from highlight list.');
                this._handleDimMapLayerRequest(id);
            }
            var mapLayer = this.findMapLayerFromAllAvailable(id);

            // finally notify sandbox
            var event = this.getEventBuilder('AfterMapLayerRemoveEvent')(mapLayer);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        },


        /**
         * @private @method _handleRearrangeSelectedMapLayerRequest
         * Handles RearrangeSelectedMapLayerRequest, sorts selected layers array so
         * that layer with given id is positioned into given index
         * and all the rest are pushed one step further. Sends out an AfterRearrangeSelectedMapLayerEvent
         *
         * @param {Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest} request
         *
         */
        _handleRearrangeSelectedMapLayerRequest: function (request) {

            var id = request.getMapLayerId();
            var oldPosition = this.getMapState().getLayerIndex(id);
            var moved = this.getMapState().moveLayer(id, request.getToPosition());
            if(!moved) {
                return;
            }
            var newPosition = this.getMapState().getLayerIndex(id);
            var layer = this.getMapState().getSelectedLayer(id);
            // notify listeners
            var event = this.getEventBuilder('AfterRearrangeSelectedMapLayerEvent')(layer, oldPosition, newPosition);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
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

            var event = this.getEventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
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
                var event = this.getEventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                this.copyObjectCreatorToFrom(event, request);
                this.dispatch(event);
            }
        },

        /**
         * @private @method _removeHighLightedMapLayer
         * Removes layer with given id from highlighted layers.
         * If id is not given -> removes all layers from highlighted layers
         *
         * @param {String} id of the layer to remove or leave undefined to remove all
         *
         */
        _removeHighLightedMapLayer: function (id) {
            var highlightedMapLayers = this.getAllHighlightedMapLayers(),
                i,
                mapLayer,
                evt;

            for (i = 0; i < highlightedMapLayers.length; i += 1) {
                mapLayer = highlightedMapLayers[i];
                if (!id || mapLayer.getId() + '' === id + '') {
                    highlightedMapLayers.splice(i);
                    // Notify that dim has occured
                    evt = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
                    this.dispatch(evt);
                    return;
                }
            }
        },

        /**
         * @private @method _handleHighlightMapLayerRequest
         * Handles HighlightMapLayerRequest, sends out an AfterHighlightMapLayerEvent.
         * Highlighted wfslayer responds to map clicks by highlighting a clicked feature.
         *
         * @param {Oskari.mapframework.request.common.HighlightMapLayerRequest} request
         *
         */
        _handleHighlightMapLayerRequest: function (request) {
            var creator = this.getObjectCreator(request),
                id = request.getMapLayerId();

            log.debug(
                '[core-map-layer-methods] Trying to highlight map ' +
                'layer with id "' + id + '"'
            );
            if (this.isMapLayerAlreadyHighlighted(id)) {
                log.warn(
                    '[core-map-layer-methods] Attempt to highlight ' +
                    'already highlighted wms feature info ' + 'map layer "' + id +
                    '"'
                );
                return;
            }

            if (this._allowMultipleHighlightLayers == true) {
                this._removeHighLightedMapLayer(id);
            } else {
                this._removeHighLightedMapLayer();
            }

            var mapLayer = this.getMapState().getSelectedLayer(id);
            if (!mapLayer) {
                return;
            }
            this._mapLayersHighlighted.push(mapLayer);
            log.debug(
                '[core-map-layer-methods] Adding ' + mapLayer + ' (' +
                mapLayer.getId() + ') to highlighted list.'
            );

            // finally notify sandbox
            var evt = this.getEventBuilder('AfterHighlightMapLayerEvent')(mapLayer);
            this.copyObjectCreatorToFrom(evt, request);
            this.dispatch(evt);
        },

        /**
         * @private @method _handleDimMapLayerRequest
         * Handles DimMapLayerRequest, sends out an AfterDimMapLayerEvent.
         * Highlighted wfslayer responds to map clicks by highlighting a clicked feature.
         * This removes the layer from highlighted list
         *
         * @param {Oskari.mapframework.request.common.DimMapLayerRequest} request
         *
         */
        _handleDimMapLayerRequest: function (layerId) {
            if (this._allowMultipleHighlightLayers == true) {
                this._removeHighLightedMapLayer(layerId);
            } else {
                this._removeHighLightedMapLayer();
            }

            var mapLayer = this.findMapLayerFromAllAvailable(layerId);
            if (!mapLayer) {
                return;
            }

            var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
            this.dispatch(event);
        }
    });

}(Oskari));