/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin';
        me._name = 'WmtsLayerPlugin';
        me._supportedFormats = {};
    }, {

        register: function () {
            this.getMapModule().setLayerPlugin('WmtsLayer', this);
        },

        unregister: function () {
            this.getMapModule().setLayerPlugin('WmtsLayer', null);
        },

        _initImpl: function () {
            // register domain builder
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'wmtslayer',
                    'Oskari.mapframework.wmts.domain.WmtsLayer'
                );
                layerModelBuilder = Oskari.clazz.create(
                    'Oskari.mapframework.wmts.service.WmtsLayerModelBuilder'
                );
                mapLayerService.registerLayerModelBuilder(
                    'wmtslayer',
                    layerModelBuilder
                );
            }
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function (event) {
                    me.afterMapLayerRemoveEvent(event);
                },

                AfterChangeMapLayerOpacityEvent: function (event) {
                    me.afterChangeMapLayerOpacityEvent(event);
                },

                AfterChangeMapLayerStyleEvent: function (event) {
                    me.afterChangeMapLayerStyleEvent(event);
                }
            };
        },

        /**
         *
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (layer.isLayerOfType('WMTS')) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }
        },

        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMTS')) {
                return;
            }

            var imageFormat = 'image/png',
                layerDef = layer.getWmtsLayerDef(),
                layerName = null,
                me = this,
                map = me.getMap(),
                matrixSet = layer.getWmtsMatrixSet(),
                matrixIds = [],
                n,
                reqEnc = 'KVP',
                res,
                resolutions = [],
                sandbox = me.getSandbox(),
                scaleDenom,
                serverResolutions = [],
                wmtsUrl =
                    layerDef.resourceUrl ? (layerDef.resourceUrl.tile ? layerDef.resourceUrl.tile.template : undefined) : undefined;

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                layerName = 'basemap_' + layer.getId();
            } else {
                layerName = 'layer_' + layer.getId();
            }

            if (!wmtsUrl) {
                wmtsUrl = layer.getWmtsUrls()[0];
            } else {
                reqEnc = 'REST';
            }

            for (n = 0; n < matrixSet.matrixIds.length; n += 1) {
                matrixIds.push(matrixSet.matrixIds[n]);
                //.identifier);
                scaleDenom = matrixSet.matrixIds[n].scaleDenominator;
                res = scaleDenom / 90.71446714322 * OpenLayers.METERS_PER_INCH;
                resolutions.push(res);
                serverResolutions.push(res);
            }

            var wmtsLayerConfig = {
                name: layerName.split('.').join(''),
                url: wmtsUrl,
                requestEncoding: reqEnc,
                layer: layer.getWmtsName(),
                matrixSet: matrixSet.identifier,
                format: imageFormat,
                style: layer.getCurrentStyle().getName(),
                transparent: true,
                matrixIds: matrixIds,
                isBaseLayer: layer.isBaseLayer(),
                buffer: 0,
                serverResolutions: serverResolutions,
                visibility: layer.isInScale(sandbox.getMap().getScale()),
                layerDef: layerDef
            };

            sandbox.printDebug(
                '[WmtsLayerPlugin] creating WMTS Layer ' +
                matrixSet.identifier + ' / ' + wmtsLayerConfig.id + '/' +
                wmtsLayerConfig.layer + '/' + wmtsLayerConfig.url
            );

            var wmtsLayer = new OpenLayers.Layer.WMTS(wmtsLayerConfig);
            wmtsLayer.opacity = layer.getOpacity() / 100;

            sandbox.printDebug(
                '[WmtsLayerPlugin] created WMTS layer ' + wmtsLayer
            );

            map.addLayers([wmtsLayer]);
        },

        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType('WMTS')) {
                return null;
            }

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                return this._map.getLayersByName('basemap_' + layer.getId());
            } else {
                return this._map.getLayersByName('layer_' + layer.getId());
            }
        },

        /***********************************************************
         * Handle AfterMapLayerRemoveEvent
         *
         * @param {Object}
         *            event
         */
        afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();

            this.removeMapLayerFromMap(layer);
        },

        removeMapLayerFromMap: function (layer) {
            var oLayer = this.getOLMapLayers(layer);

            if (oLayer && oLayer[0]) {
                oLayer[0].destroy();
            }
        },

        afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                oLayer = this.getOLMapLayers(layer),
                newOpacity = (layer.getOpacity() / 100);

            if (oLayer && oLayer[0]) {
                oLayer[0].setOpacity(newOpacity);
            }
        },

        /***********************************************************
         * Handle AfterChangeMapLayerStyleEvent
         *
         * @param {Object}
         *            event
         */
        afterChangeMapLayerStyleEvent: function (event) {
            var layer = event.getMapLayer(),
                oLayer = this.getOLMapLayers(layer),
                newStyle = layer.getCurrentStyle().getName();

            if (oLayer && oLayer[0]) {
                oLayer[0].mergeNewParams({
                    styles: newStyle
                });
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
