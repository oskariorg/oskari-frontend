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
            console.log('Not implemented yet!');
            return;

            // TODO: check sublayers, do they still exist?
            // if not, then remove here
            // if yes, then add to other wmtslayerplugins too
            var layers = [],
                layerIdPrefix = 'layer_';
            // insert layer or sublayers into array to handle them identically
            if ((layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap == true) && (layer.getSubLayers().length > 0)) {
                // replace layers with sublayers
                layers = layer.getSubLayers();
                layerIdPrefix = 'basemap_';
            } else {
                // add layer into layers
                layers.push(layer);
            }

            var sandbox = this._sandbox;

            // loop all layers and add these on the map
            for (var i = 0, ilen = layers.length; i < ilen; i++) {
                var _layer = layers[i];

                var wmtsLayerDef = _layer.getWmtsLayerDef();
                var wmtsUrl = _layer.getWmtsUrls()[0][0].url;
                var matrixSet = _layer.getWmtsMatrixSet();
                var matrixSetId = matrixSet.identifier;
                var layerName = _layer.getWmtsName();
                var style = _layer.getCurrentStyle().getName();

                var matrixIds = [];
                var resolutions = [];
                var serverResolutions = [];

                for (var n = 0; n < matrixSet.matrixIds.length; n++) {

                    matrixIds.push(matrixSet.matrixIds[n]);
                    //.identifier);
                    var scaleDenom = matrixSet.matrixIds[n].scaleDenominator;
                    var res = scaleDenom / 90.71446714322 * OpenLayers.METERS_PER_INCH;
                    resolutions.push(res)
                    serverResolutions.push(res);

                }

                var maxMin = this.mapModule.calculateLayerMinMaxResolutions(_layer.getMaxScale(), _layer.getMinScale());

                /* Temp Hack compatible with what we got - practically assumes NLS WMTS service for now */
                var urlParts = {
                    "{TileMatrixSet}": wmtsLayerDef.tileMatrixSetLinks[0].tileMatrixSet,
                    "{TileMatrix}": '{z}',
                    "{TileRow}": '{y}',
                    "{TileCol}": '{x}'
                };

                var wmtsUrl = '' + wmtsLayerDef.resourceUrl.tile.template;

                for (var p in urlParts) {
                    wmtsUrl = wmtsUrl.replace(p, urlParts[p]);
                }

                var wmtsOpts = {
                    URL: wmtsUrl
                };

                sandbox.printDebug("[WmtsLayerPlugin] creating WMTS Layer " + matrixSet.identifier + " / " + layer.getWmtsName() + "/" + wmtsUrl);

                var wmtsLayer = new L.tileLayer(wmtsOpts.URL, {
                    tms: false,
                    continuousWorld: true
                });

                sandbox.printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);

                this.mapModule.addLayer(wmtsLayer, _layer, layerIdPrefix + _layer.getId());

                if (keepLayerOnTop) {
                    this.mapModule.setLayerIndex(wmtsLayer, this.mapModule.getLayers().length);
                } else {
                    this.mapModule.setLayerIndex(wmtsLayer, 0);
                }
            }

        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmtsLayer} layer
         */
        removeMapLayerFromMap: function(layer) {

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = "";
                if (layer.getSubLayers().length > 0) {
                    for (var i = 0; i < layer.getSubLayers().length; i++) {
                        var subtmp = layer.getSubLayers()[i];
                        var name = 'basemap_' + subtmp.getId();
                        var remLayer = this.mapModule.getLayersByName(name);
                        if (remLayer && remLayer[0]) {
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
                    mapLayer[0].alpha = (layer.getOpacity() / 100);
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
                if (styledLayer != null) {
                    var currStyle = layer.getCurrentStyle();
                    var currStyleName = currStyle ? currStyle.getName() : null;
                    if (currStyleName) {
                        /*styledLayer[0].setParams({
                        styles : currStyleName
                    });*/
                    }
                }
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