define(["bundles/framework/bundle/mapwmts/plugin/wmtslayer/WmtsLayerPlugin"], function(WmtsLayerPlugin) {
    // load helper and enhancer

    Oskari.cls('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin').category({
        /**
         * @method _addMapLayerToMap
         * @private
         * Adds a single Wmts layer to this map
         * @param {Oskari.mapframework.domain.WmtsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function(layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMTS')) {
                return;
            }

            var me = this;
            var map = me.getMap();

            var matrixIds = layer.getWmtsMatrixSet().matrixIds;
            var layerDef = layer.getWmtsLayerDef();

            var layerName = null,
                layerIdPrefix = 'layer_';
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                layerName = 'basemap_' + layer.getId();
                layerIdPrefix = 'basemap_';
            } else {
                layerName = 'layer_' + layer.getId();
            }

            var sandbox = this._sandbox;

            var imageFormat = "image/png";
            var reqEnc = "KVP";

            var wmtsUrl = //layer.getWmtsUrls()[0]; 
            layerDef.resourceUrl ? (layerDef.resourceUrl.tile ? layerDef.resourceUrl.tile.template : undefined) : undefined;

            if (!wmtsUrl) {
                wmtsUrl = layer.getWmtsUrls()[0];
            } else {
                reqEnc = "REST";
            }

            var matrixSet = layer.getWmtsMatrixSet();
            matrixIds = [];
            var resolutions = [];
            var serverResolutions = [],
                n,
                scaleDenom,
                res;

            for (n = 0; n < matrixSet.matrixIds.length; n++) {

                matrixIds.push(matrixSet.matrixIds[n]);
                //.identifier);
                scaleDenom = matrixSet.matrixIds[n].scaleDenominator;
                res = scaleDenom / 90.71446714322 * OpenLayers.METERS_PER_INCH;
                resolutions.push(res);
                serverResolutions.push(res);
            }

            var wmtsCaps = layer.getWmtsCaps();
            var wmtsOpts = ol.source.WMTS.optionsFromCapabilities(wmtsCaps, wmtsCaps.contents.layers[0].identifier);
            wmtsOpts.url = wmtsUrl;

            sandbox.printDebug("[WmtsLayerPlugin] creating WMTS Layer " + matrixSet.identifier + " / " + layer.getWmtsName() + "/" + wmtsUrl);

            var wmtsLayer = new ol.layer.Tile({
                opacity: layer.getOpacity() / 100.0,
                source : new ol.source.WMTS(wmtsOpts)
            });

            sandbox.printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);

            this.mapModule.addLayer(wmtsLayer, layer, layerIdPrefix + layer.getId());

            if (keepLayerOnTop) {
                this.mapModule.setLayerIndex(wmtsLayer, this.mapModule.getLayers().length);
            } else {
                this.mapModule.setLayerIndex(wmtsLayer, 0);
            }
        },
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmtsLayer} layer
         */
        removeMapLayerFromMap: function(layer) {

            if (!layer.isLayerOfType('WMTS')) {
                return;
            }

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = "";
                if (layer.getSubLayers().length > 0) {
                    for (var i = 0; i < layer.getSubLayers().length; i++) {
                        var subtmp = layer.getSubLayers()[i];
                        var name = 'basemap_' + subtmp.getId();
                        var remLayer = this.mapModule.getLayersByName(name);
                        if (remLayer && remLayer[0] && remLayer[0].destroy) {
                            /*remLayer[0].destroy();*/
                            this.mapModule.removeLayer(remLayer[0], layer, name);
                        }
                    }
                } else {
                    var name = 'layer_' + layer.getId();
                    var remLayer = this.mapModule.getLayersByName(name)[0];
                    this.mapModule.removeLayer(remLayer, layer, name);
                }
            } else {
                var name = 'layer_' + layer.getId();
                var remLayer = this.mapModule.getLayersByName(name);
                /* This should free all memory */
                this.mapModule.removeLayer(remLayer[0], layer, name);
            }
        },

        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        afterChangeMapLayerOpacityEvent: function(event) {
            var layer = event.getMapLayer();

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                if (layer.getSubLayers().length > 0) {
                    for (var bl = 0; bl < layer.getSubLayers().length; bl++) {
                        var mapLayer = this.mapModule.getLayersByName('basemap_' + layer
                            .getSubLayers()[bl].getId());
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                } else {
                    var mapLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
                    if (mapLayer[0] != null) {
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                }
            } else {
                this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
                var mapLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
                if (mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        },
        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        afterChangeMapLayerStyleEvent: function(event) {
            var layer = event.getMapLayer();

            // Change selected layer style to defined style
            if (!layer.isBaseLayer()) {
                var styledLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
                /*if (styledLayer != null) {
             styledLayer[0].mergeNewParams({
             styles : layer.getCurrentStyle().getName()
             });
             }*/
            }
        },

        getLayerTypeIdentifier: function() {
            return 'wmtslayer';
        },
        getLayerTypeSelector: function() {
            return 'WMTS';
        }
    });
});