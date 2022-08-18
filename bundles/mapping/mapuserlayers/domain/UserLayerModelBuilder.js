/*
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder
 * JSON-parsing for user layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder',
    function (sandbox) {
        this.sandbox = sandbox;
        this.wfsBuilder = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',
            sandbox
        );
    }, {
        /**
         * Parses any additional fields to model
         *
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            layer.setLocale(mapLayerJson.locale);

            const values = {
                locale: layer.getLocale(),
                style: layer.getCurrentStyle().getFeatureStyle(),
                id: layer.getId()
            };

            const loc = Oskari.getLocalization('MapWfs2')['own-style'];
            const toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            toolOwnStyle.setName('editStyle');
            toolOwnStyle.setIconCls('show-own-style-tool');
            toolOwnStyle.setTooltip(loc);
            toolOwnStyle.setCallback(() => this.sandbox.postRequestByName('MyPlacesImport.ShowUserLayerDialogRequest', [values]));
            layer.addTool(toolOwnStyle);
        }
    }
);
