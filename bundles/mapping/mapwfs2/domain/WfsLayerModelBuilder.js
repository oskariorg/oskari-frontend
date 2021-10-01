import { createDefaultStyle, DEFAULT_STYLE_NAME } from '../../mapmodule/domain/VectorStyle';
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
            const locOwnStyle = this.localization['own-style'];
            const toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            toolOwnStyle.setName('ownStyle');
            toolOwnStyle.setTitle(locOwnStyle);
            toolOwnStyle.setIconCls('show-own-style-tool');
            toolOwnStyle.setTooltip(locOwnStyle);
            toolOwnStyle.setCallback(() => this.sandbox.postRequestByName('ShowUserStylesRequest', [layer.getId(), false]));
            layer.addTool(toolOwnStyle);
        },
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.domain.WfsLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson = {}, maplayerService) {
            if (layer.isLayerOfType('WFS')) {
                if (this.sandbox.hasHandler('ShowUserStylesRequest')) {
                    this._addUserStyleTool(layer);
                } else {
                    this._pendingUserStyleTools.push(layer);
                }
            }
            if (layer.getStyles().length === 0) {
                // ensure we have at least one style so:
                // - things don't break as easily in other parts of the app
                // - end-user can switch back to "default" when adding a runtime style of their own
                // add default style
                layer.addStyle(createDefaultStyle());
            }
            layer.setHoverOptions(mapLayerJson.options.hover);

            // Set current Style
            layer.selectStyle(mapLayerJson.style || DEFAULT_STYLE_NAME);
            this.parseLayerAttributes(layer);
        },
        parseLayerAttributes: function (layer) {
            const { data = {} } = layer.getAttributes();
            const { filter, locale = {}, types } = data;
            const lang = Oskari.getLang();

            if (Array.isArray(filter)) {
                layer.setPropertySelection(filter);
            } else if (typeof filter === 'object') {
                const filterArray = filter[lang] || filter.default || [];
                layer.setPropertySelection(filterArray);
            }
            const localized = locale[lang];
            if (localized) {
                layer.setPropertyLabels(localized);
            }
            if (types) {
                layer.setPropertyTypes(types);
            }
        }
    });
