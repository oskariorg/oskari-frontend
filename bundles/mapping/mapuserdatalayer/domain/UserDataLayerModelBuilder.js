/*
 * @class Oskari.mapframework.bundle.mapuserdatalayer.domain.UserDataLayerModelBuilder
 * JSON-parsing for user own layers (myplaces, userlayer, analysis)
 */
export class UserDataLayerModelBuilder {
    constructor (sandbox) {
        this.sandbox = sandbox;
        this.types = {};
    }

    registerLayerType (layerService, options) {
        const { type, inspire, ...toStore } = options;

        const dataProviderId = -10 * Oskari.getSeq('usergeneratedDataProvider').nextVal();
        const provider = {
            id: dataProviderId,
            name: inspire
        };
        layerService.addDataProvider(provider);

        // negative value for group id means that admin isn't presented with tools for it (-1 is reserved for default group)
        const group = {
            id: -10 * Oskari.getSeq('usergeneratedGroup').nextVal(),
            name: inspire
        };
        layerService.addLayerGroup(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));

        this.types[type] = { group, dataProviderId, ...toStore };
    }

    /**
     * Parses any additional fields to model
     *
     * @param {UserDataLayer} layer partially populated layer
     * @param {Object} mapLayerJson JSON presentation of the layer
     */
    parseLayerData (layer, mapLayerJson) {
        const { locale, type, describeLayer } = mapLayerJson;
        if (!this.types[type]) {
            // type is not registered
            return;
        }
        const { group, dataProviderId, editRequest, organization, createTools = [] } = this.types[type];

        layer.setLocale(locale);
        layer.preHandleDescribeLayer(describeLayer);

        layer.setOrganizationName(organization);
        layer.setDataProviderId(dataProviderId);
        layer.setGroups([group]);

        if (editRequest) {
            // Add edit layer tool
            const toolName = Oskari.getMsg('MapModule', 'plugin.WfsVectorLayerPlugin.editLayer');
            const toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            toolOwnStyle.setName('editStyle');
            toolOwnStyle.setIconCls('show-own-style-tool');
            toolOwnStyle.setTooltip(toolName);
            toolOwnStyle.setTitle(toolName);
            toolOwnStyle.setCallback(() => this.sandbox.postRequestByName(editRequest, [layer.getId()]));
            layer.addTool(toolOwnStyle);
        }
        createTools.forEach(createTool => {
            if (typeof createTool === 'function') {
                layer.addTool(createTool(layer));
            }
        });
    }
}
