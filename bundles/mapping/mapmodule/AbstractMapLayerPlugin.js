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
        this._sandbox = null;
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
            return this._sandbox;
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
        },

        /**
         * @method init
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            this._initImpl(sandbox);
        },
        _initImpl: function (sandbox) {
            // no-op
        },

        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var p;

            this._sandbox = sandbox;

            sandbox.register(this);
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
        },

        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            this._sandbox = null;
        },

        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},

        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            MapLayerEvent: function(event) {
                var op = event.getOperation(),
                    layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());

                if (op === 'update' && layer) {
                    this._updateLayer(layer);
                }
            },
            AfterMapLayerAddEvent: function (event) {
                var layer = event.getMapLayer();
                if (!this.isLayerSupported(layer)) {
                    return;
                }

                this._afterMapLayerAddEvent(event);
            },

            AfterMapLayerRemoveEvent: function (event) {
                var layer = event.getMapLayer();
                if (!this.isLayerSupported(layer)) {
                    return;
                }
                this._afterMapLayerRemoveEvent(event);
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
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

        /**
         * @method preselectLayers
         * Adds given layers to map if of type WMS
         * @param {Oskari.mapframework.domain.AbstractLayer[]} layers
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox,
                layer;

            for (var i = 0; i < layers.length; i += 1) {
                layer = layers[i];

                if (!this.isLayerSupported(layer)) {
                    continue;
                }

                sandbox.printDebug('preselecting ' + layer.getId());
                this._addMapLayerToMap(layer, true, layer.isBaseLayer());
            }
        },

        /**
         * Handle _afterMapLayerAddEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
         *            event
         */
        _afterMapLayerAddEvent: function (event) {
            this._addMapLayerToMap(
                event.getMapLayer(),
                event.getKeepLayersOrder(),
                event.isBasemap()
            );
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Handle AfterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
         *            event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();

            this._removeMapLayerFromMap(layer);
        },

        /**
         * Store references to map-engine specific layer objects
         * @param {String} layerId ID for Oskari.mapframework.domain.AbstractLayer
         * @param {Object[]} layers  Single or an array of layers used to present the layer in map engine
         */
        setOLMapLayers: function (layerId, layers) {
            if(!layers) {
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
         * @method _addMapLayerToMap
         * @private
         * Adds a single WMS layer to this map
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        _addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {

        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {
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

        },
        /**
         * Update the layer on map if style etc was changed when administrating layers
         * @method _updateLayer
         * @param  {Oskari.mapframework.domain.AbstractLayer} layer [description]
         */
        _updateLayer : function(layer) {
            this.getSandbox().printDebug('TODO: update layer on map');
        }
    }, {
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
