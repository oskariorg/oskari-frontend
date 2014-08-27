/*
 * @class Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder
 * JSON-parsing for wfs layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',

    function (sandbox) {
        this.localization = Oskari.getLocalization('MapWfs2');
        this.sandbox = sandbox;
    }, {
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.domain.WfsLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            var me = this,
                toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');

            if (layer.isLayerOfType("WFS")) {
                var locOwnStyle = this.localization['own-style'],
                    toolOwnStyle = toolBuilder();
                toolOwnStyle.setName("ownStyle");
                toolOwnStyle.setTitle(locOwnStyle);
                toolOwnStyle.setTooltip(locOwnStyle);
                toolOwnStyle.setCallback(function () {
                    me.sandbox.postRequestByName('ShowOwnStyleRequest', [layer.getId()]);
                });
                layer.addTool(toolOwnStyle);
            }

            // add object data tool
            // TODO: should propably be configurable -> maybe through wfslayerplugin conf
            // so we can disable if feature data bundle is not loaded
            var locObjData = this.localization['object-data'],
                toolObjData = toolBuilder();
            toolObjData.setName("objectData");
            toolObjData.setTitle(locObjData);
            toolObjData.setTooltip(locObjData);
            toolObjData.setCallback(function () {
                me.sandbox.postRequestByName('ShowFeatureDataRequest', [layer.getId()]);
            });
            layer.addTool(toolObjData);

            // create a default style
            var locDefaultStyle = this.localization['default-style'],
                defaultStyle = Oskari.clazz.create('Oskari.mapframework.domain.Style'),
                i;
            defaultStyle.setName("default");
            defaultStyle.setTitle(locDefaultStyle);
            defaultStyle.setLegend("");

            // check if default style comes and give localization for it if found
            if (mapLayerJson.styles && mapLayerJson.styles.length > 0) {
                for (i = 0; i < mapLayerJson.styles.length; i++) {
                    if (mapLayerJson.styles[i].name === "default") {
                        mapLayerJson.styles[i].title = locDefaultStyle;
                        break;
                    }
                }
            }

            // default style for WFS is given as last parameter
            maplayerService.populateStyles(layer, mapLayerJson, defaultStyle);
        }
    });
