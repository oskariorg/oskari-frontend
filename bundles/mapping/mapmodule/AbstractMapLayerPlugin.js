import './plugin/AbstractMapModulePlugin';
/**
 * @class Oskari.mapping.mapmodule.AbstractMapLayerPlugin
 * Base class for map layer implementations (wms, wmts, vector tile etc.)
 */
Oskari.clazz.define(
    'Oskari.mapping.mapmodule.AbstractMapLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.mapModule = null;
        this.pluginName = null;
        this._supportedFormats = {};

        this.tileSize = [256, 256];
        this._layerImplRefs = {};
        this._log = Oskari.log(this.getName());
    }, {
        /** @static @property __name plugin name */
        __name: 'OVERRIDETHIS',
        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },

        getSandbox: function () {
            return this.getMapModule().getSandbox();
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method getMap
         * @return {Object} reference to map-engine (ol)
         */
        getMap: function () {
            return this.getMapModule().getMap();
        },

        /**
         * @method setMapModule
         *
         * @param {Oskari.mapframework.ui.module.common.MapModule}
         * Reference to map module
         *
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            this.pluginName = mapModule.getName() + this.__name;
        },

        /**
         * @method hasUI
         * This plugin doesn't have an UI that we would want to ever hide so always returns false
         *
         *
         * @return {Boolean}
         */
        hasUI: function () {
            return false;
        },

        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         *
         *
         */
        register: function () {
            this.getMapModule().setLayerPlugin(
                this.getLayerTypeIdentifier(),
                this
            );
            return this._registerImpl();
        },

        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         *
         *
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin(
                this.getLayerTypeIdentifier(),
                null
            );
            return this._unregisterImpl();
        },

        _createEventHandlers: function () {
            var handlers = jQuery.extend(true, {}, this.mapLayerEventHandlers);
            return jQuery.extend(true, handlers, this._createPluginEventHandlers());
        },

        _createPluginEventHandlers: function () {
            return {};
        },

        /**
         * @property {Object} mapLayerEventHandlers
         * @static
         */
        mapLayerEventHandlers: {
            MapLayerEvent: function (event) {
                if (event.getOperation() !== 'update') {
                    return;
                }
                const layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());
                if (layer && this.isLayerSupported(layer)) {
                    this._updateLayer(layer);
                }
            },

            AfterMapLayerRemoveEvent: function (event) {
                var layer = event.getMapLayer();
                if (!this.isLayerSupported(layer)) {
                    return;
                }
                this.removeMapLayerFromMap(event.getMapLayer());
            },

            AfterChangeMapLayerOpacityEvent: function (event) {
                var layer = event.getMapLayer();
                if (!this.isLayerSupported(layer)) {
                    return;
                }
                this._afterChangeMapLayerOpacityEvent(event);
            },

            AfterChangeMapLayerStyleEvent: function (event) {
                var layer = event.getMapLayer();
                if (!this.isLayerSupported(layer)) {
                    return;
                }
                this._afterChangeMapLayerStyleEvent(event);
            }
        },

        /**
         * @method preselectLayers
         * Adds given layers to map if of type WMS
         * @param {Oskari.mapframework.domain.AbstractLayer[]} layers
         */
        preselectLayers: function (layers) {
            var me = this;
            var log = Oskari.log('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');
            layers.filter(this.isLayerSupported.bind(this)).forEach(function (layer) {
                log.debug('preselecting ' + layer.getId());
                // TODO: check that maplayer isn't on map yet
                me.addMapLayerToMap(layer, true, layer.isBaseLayer());
            });
        },

        /**
         * Store references to map-engine specific layer objects
         * @param {String} layerId ID for Oskari.mapframework.domain.AbstractLayer
         * @param {Object[]} layers  Single or an array of layers used to present the layer in map engine
         */
        setOLMapLayers: function (layerId, layers) {
            if (!layers) {
                this._layerImplRefs[layerId] = null;
                delete this._layerImplRefs[layerId];
            } else {
                this._layerImplRefs[layerId] = layers;
            }
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer
         * or null if layer is not added to map.
         *
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         *
         * @return {Object[]} map engine implementation object for maplayers
         */
        getOLMapLayers: function (layer) {
            if (typeof layer === 'number' || typeof layer === 'string') {
                // if number or string -> find corresponding layer from selected
                layer = this.getSandbox().findMapLayerFromSelectedMapLayers(layer);
            }
            if (!layer) {
                return null;
            }
            if (!this.isLayerSupported(layer)) {
                return null;
            }
            var layerRefs = this._layerImplRefs[layer.getId()];
            if (!layerRefs) {
                // not found
                return [];
            }
            if (Array.isArray(layerRefs)) {
                return layerRefs;
            }
            return [layerRefs];
        },

        /* Inherited classes must implement (at least) following methods */

        /* To Be Overwritten by implementing class - one of WMS, WMTS .... */
        getLayerTypeSelector: function () {
            return undefined;
        },
        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported: function (layer) {
            if (!layer || !this.isLayerSrsSupported(layer)) {
                return false;
            }
            return layer.isLayerOfType(this.getLayerTypeSelector());
        },
        /**
         * @method isLayerSrsSupported Checks if layer's SRS is supported by current map view
         * @param {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean}
         */
        isLayerSrsSupported: function (layer) {
            return layer.isSupportedSrs(this.getSandbox().getMap().getSrsName());
        },

        getLayerTypeIdentifier: function () {
            return this.layertype;
        },

        /**
         * @method addMapLayerToMap
         * @private
         * Adds a single WMS layer to this map
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            this._log.warn('TODO: addMapLayerToMap() not implemented on ' + this.getName());
        },

        /**
         * @method removeMapLayerFromMap
         * Removes the layer from the map
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         */
        removeMapLayerFromMap: function (layer) {
            var olLayers = this.getOLMapLayers(layer);

            if (!olLayers || olLayers.length === 0) {
                return;
            }

            this._log.debug('Removing Layer from map ' + layer.getId());
            for (var i = 0; i < olLayers.length; ++i) {
                var loopLayer = olLayers[i];
                this.getMapModule().removeLayer(loopLayer, layer);
            }
            // reset the impl references for this layer
            this.setOLMapLayers(layer.getId());
        },

        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer();
            var olLayers = this.getOLMapLayers(layer);

            if (!olLayers || olLayers.length === 0) {
                return;
            }

            this._log.debug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            for (var i = 0; i < olLayers.length; ++i) {
                olLayers[i].setOpacity(layer.getOpacity() / 100);
            }
        },
        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        _afterChangeMapLayerStyleEvent: function (event) {
            this._log.warn('TODO: handle layer style chance on ' + this.getName());
        },
        /**
         * Update the layer on map if style etc was changed when administrating layers
         * @method _updateLayer
         * @param  {Oskari.mapframework.domain.AbstractLayer} layer [description]
         */
        _updateLayer: function (layer) {
            this._log.warn('TODO: update layer on map in ' + this.getName());
        },
        /**
         * @method updateLayerParams
         * A generic implementation of forcing a redraw on a layer. Override in layer plugins where necessary.
         */
        updateLayerParams: function (layer, forced, params) {
            const olLayerList = this.getMapModule().getOLMapLayers(layer.getId());
            if (!olLayerList) {
                return;
            }
            olLayerList.forEach(olLayer => {
                if (typeof (olLayer.getSource) !== 'function' || typeof (olLayer.getSource().updateParams) !== 'function') {
                    this._log.warn(`Tried updating layer (${layer.getId()}), but plugin (${this.getName()}) doesn't support update operation`);
                    return;
                }
                const updatedParams = jQuery.extend(true, {}, olLayer.getSource().getParams(), params);
                // add timestamp to make sure that params are changed and layer is forced to redraw
                if (forced === true) {
                    updatedParams._ts = Date.now();
                }
                olLayer.getSource().updateParams(updatedParams);
            });
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
