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
        this.dataProviderId = null;
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
            // TODO: only setHoverOptions and parseLayerAttributes
            // -> set hoveroptions here and attributes in DescribeLayer
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            layer.setLocale(mapLayerJson.locale);
            layer.setStylesFromOptions(mapLayerJson.options);

            const toolName = Oskari.getMsg('MapWfs2', 'editLayer');
            const toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            toolOwnStyle.setName('editStyle');
            toolOwnStyle.setIconCls('show-own-style-tool');
            toolOwnStyle.setTooltip(toolName);
            toolOwnStyle.setTitle(toolName);
            toolOwnStyle.setCallback(() => this.sandbox.postRequestByName('MyPlacesImport.ShowUserLayerDialogRequest', [layer.getId()]));
            layer.addTool(toolOwnStyle);

            if (!this.dataProviderId) {
                this.dataProviderId = -10 * Oskari.getSeq('usergeneratedDataProvider').nextVal();
                const dataProvider = maplayerService.getDataProviderById(this.dataProviderId);
                if (!dataProvider) {
                    const provider = {
                        id: this.dataProviderId,
                        name: Oskari.getMsg('MyPlacesImport', 'layer.organization')
                    };
                    maplayerService.addDataProvider(provider);
                }
            }
            if (this.dataProviderId) {
                layer.setDataProviderId(this.dataProviderId);
            }
        }
    }
);
