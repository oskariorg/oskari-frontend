const Style = Oskari.clazz.get('Oskari.mapframework.domain.Style');
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
        this._registerForLayerFiltering();
    }, {
        /**
         * Add featuredata filter.
         * @method  @public _registerForLayerFiltering
         */
        _registerForLayerFiltering: function () {
            var me = this;
            Oskari.on('app.start', function (details) {
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
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.domain.WfsLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            var me = this;

            if (layer.isLayerOfType('WFS')) {
                var locOwnStyle = me.localization['own-style'];
                var toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
                toolOwnStyle.setName('ownStyle');
                toolOwnStyle.setTitle(locOwnStyle);
                toolOwnStyle.setIconCls('show-own-style-tool');
                toolOwnStyle.setTooltip(locOwnStyle);
                toolOwnStyle.setCallback(function () {
                    me.sandbox.postRequestByName('ShowOwnStyleRequest', [layer.getId(), undefined, false]);
                });
                layer.addTool(toolOwnStyle);
            }

            // create a default style
            const locDefaultStyle = this.localization['default-style'];
            const defaultStyle = new Style();
            defaultStyle.setName('default');
            defaultStyle.setTitle(locDefaultStyle);
            defaultStyle.setLegend('');

            const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
            let layerType = layer.getLayerType();
            if (layerType === 'userlayer' || layerType === 'myplaces') {
                layerType = 'wfs';
            }
            const wfsPlugin = mapModule.getLayerPlugins(layerType);

            if (wfsPlugin && wfsPlugin.oskariStyleSupport) {
                // Read options object for styles and hover options
                const { styles = {} } = mapLayerJson.options;
                if (Object.keys(styles).length === 0) {
                    layer.addStyle(defaultStyle);
                } else {
                    Object.keys(styles).forEach(styleId => {
                        const style = new Style();
                        style.setName(styleId);
                        style.setTitle(styleId === 'default' ? locDefaultStyle : styles[styleId].title || styleId);
                        layer.addStyle(style);
                    });
                }
                layer.setHoverOptions(mapLayerJson.options.hover);
            } else {
                // check if default style comes and give localization for it if found
                if (mapLayerJson.styles && mapLayerJson.styles.length > 0) {
                    const definedDefaultStyle = mapLayerJson.styles.find(style => style.name === 'default');
                    if (definedDefaultStyle) {
                        definedDefaultStyle.title = locDefaultStyle;
                    }
                }

                // default style for WFS is given as last parameter
                maplayerService.populateStyles(layer, mapLayerJson, defaultStyle);
            }

            // Set current Style
            if (mapLayerJson.style) {
                layer.selectStyle(mapLayerJson.style);
            }

            // WMS link layer id for wfs rendering option
            if (mapLayerJson.WMSLayerId) {
                layer.setWMSLayerId(mapLayerJson.WMSLayerId);
            }
        }
    });
