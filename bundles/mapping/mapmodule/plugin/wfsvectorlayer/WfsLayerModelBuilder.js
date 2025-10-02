/*
 * @class Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder
 * JSON-parsing for wfs layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',

    function (sandbox, getMsg) {
        this.getMsg = getMsg;
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
            Oskari.on('app.start', (details) => {
                const sb = this.sandbox;
                if (this._hasSupportForUserStyles(sb)) {
                    this._pendingUserStyleTools.forEach(l => this._addUserStyleTool(l));
                }
                this._pendingUserStyleTools = [];
                const layerlistService = sb.getService('Oskari.mapframework.service.LayerlistService');

                if (!layerlistService) {
                    return;
                }

                layerlistService.registerLayerlistFilterButton(this.getMsg('layerFilter.featuredata'),
                    this.getMsg('layerFilter.tooltip'), {
                        active: 'layer-stats',
                        deactive: 'layer-stats-disabled'
                    },
                    'featuredata');
            });
        },
        _hasSupportForUserStyles: function (sandbox) {
            return sandbox.hasHandler('ShowUserStylesRequest');
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
            if (this._hasSupportForUserStyles(this.sandbox)) {
                this._addUserStyleTool(layer);
            } else {
                this._pendingUserStyleTools.push(layer);
            }
        }
    });
