/*
 * @class Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder
 * JSON-parsing for wfs layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',

    function (sandbox) {
        this.localization = Oskari.getLocalization('MapWfs2');
        this.sandbox = sandbox;
        this.service = null;
        this._pendingUserStyleTools = [];
        this._registerForLayerFiltering();
    }, {
        /**
         * Add featuredata filter.
         * @method  @public _registerForLayerFiltering
         */
        _registerForLayerFiltering: function () {
            var me = this;
            Oskari.on('app.start', function (details) {
                if (me.sandbox.hasHandler('ShowUserStylesRequest')) {
                    me._pendingUserStyleTools.forEach(l => me._addUserStyleTool(l));
                }
                me._pendingUserStyleTools = [];
                var layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');

                if (!layerlistService) {
                    return;
                }

                layerlistService.registerLayerlistFilterButton(me.localization.layerFilter.featuredata,
                    me.localization.layerFilter.tooltip, {
                        active: 'layer-stats',
                        deactive: 'layer-stats-disabled'
                    },
                    'featuredata');
            });
        },
        _addUserStyleTool: function (layer) {
            const toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            toolOwnStyle.setName('ownStyle');
            toolOwnStyle.setTitle('');
            toolOwnStyle.setIconCls('show-own-style-tool');
            toolOwnStyle.setCallback(() => this.sandbox.postRequestByName('ShowUserStylesRequest', [{ layerId: layer.getId() }]));
            layer.addTool(toolOwnStyle);
        },
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.domain.WfsLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson = {}, maplayerService) {
            if (isNaN(layer.getId())) {
                return;
            }
            if (this.sandbox.hasHandler('ShowUserStylesRequest')) {
                this._addUserStyleTool(layer);
            } else {
                this._pendingUserStyleTools.push(layer);
            }
        }
    });
