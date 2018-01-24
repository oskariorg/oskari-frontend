/**
 * @class Oskari.mapping.mapmodule.AbstractMapLayerPlugin
 * Provides functionality to draw WMS layers on the map
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

        getSandbox : function() {
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
         * @return {Object} reference to map-engine (ol2/ol3)
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
            MapLayerEvent: function(event) {
                var op = event.getOperation(),
                    layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());

                if (op === 'update' && layer) {
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
            var sandbox = this.getSandbox(),
                layer;

            for (var i = 0; i < layers.length; i += 1) {
                layer = layers[i];

                if (!this.isLayerSupported(layer)) {
                    continue;
                }

                sandbox.printDebug('preselecting ' + layer.getId());
                // TODO: check that maplayer isn't on map yet
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }
        },

        /**
         * Store references to map-engine specific layer objects
         * @param {String} layerId ID for Oskari.mapframework.domain.AbstractLayer
         * @param {Object[]} layers  Single or an array of layers used to present the layer in map engine
         */
        setOLMapLayers: function (layerId, layers) {
            if(!layers) {
                this._layerImplRefs[layerId] = null;
                delete this._layerImplRefs[layerId];
            }
            else {
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
            if(typeof layer === 'number' || typeof layer === 'string') {
                // if number or string -> find corresponding layer from selected
                layer = this.getSandbox().findMapLayerFromSelectedMapLayers(layer);
            }
            if(!layer) {
                return null;
            }
            if (!this.isLayerSupported(layer)) {
                return null;
            }
            var layerRefs = this._layerImplRefs[layer.getId()];
            if(!layerRefs) {
                // not found
                return [];
            }
            if(Array.isArray(layerRefs)) {
                return layerRefs;
            }
            return [layerRefs];
        },

        /* Inherited classes must implement (at least) following methods */

        /* To Be Overwritten by implementing class - one of WMS, WMTS ....*/
        getLayerTypeSelector: function () {
            return undefined;
        },
        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported : function(layer) {
            if(!layer) {
                return false;
            }
            return layer.isLayerOfType(this.getLayerTypeSelector());
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
            this.getSandbox().printDebug('TODO: addMapLayerToMap() not implemented on ' + this.getName());
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

            this.getSandbox().printDebug('Removing Layer from map ' + layer.getId());
            for(var i = 0; i < olLayers.length; ++i) {
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
        _afterChangeMapLayerOpacityEvent : function(event) {
            var layer = event.getMapLayer();
            var olLayers = this.getOLMapLayers(layer);

            if (!olLayers || olLayers.length === 0) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            for(var i = 0; i < olLayers.length; ++i) {
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
            this.getSandbox().printDebug('TODO: handle layer style chance');
        },
        /**
         * Update the layer on map if style etc was changed when administrating layers
         * @method _updateLayer
         * @param  {Oskari.mapframework.domain.AbstractLayer} layer [description]
         */
        _updateLayer : function(layer) {
            this.getSandbox().printDebug('TODO: update layer on map');
        },
        /**
         * @method updateLayerParams
         * A generic implementation of forcing a redraw on a layer. Override in layer plugins where necessary.
         */
        updateLayerParams: function(layer, forced, params) {
            var olLayerList = this.getMapModule().getOLMapLayers(layer.getId());
            count = 0;
            if (olLayerList) {
                count = olLayerList.length;
                for (i = 0; i < olLayerList.length; ++i) {
                    if (olLayerList[i].redraw && typeof(olLayerList[i].redraw) === 'function') {
                        olLayerList[i].redraw(forced);
                    } else if (typeof (olLayerList[i].getSource) === 'function' && typeof(olLayerList[i].getSource().updateParams) === 'function') {
                        var updatedParams = jQuery.extend(true, {}, olLayerList[i].getSource().getParams(), params);
                        //add timestamp to make sure that params are changed and layer is forced to redraw
                        if(forced === true){
                            updatedParams._ts = Date.now();
                        }
                        olLayerList[i].getSource().updateParams(updatedParams);
                    }
                }
            }
        }
    }, {
        extend : ["Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin"],
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
