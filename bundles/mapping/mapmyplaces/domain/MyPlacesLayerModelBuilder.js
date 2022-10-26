import { getCategoryId } from '../../../framework/myplaces3/service/LayerHelper';

/*
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder
 * JSON-parsing for myplaces layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder',
    function (sandbox) {
        this.localization = Oskari.getLocalization('MapMyPlaces');
        this.sandbox = sandbox;
        this.wfsBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder', sandbox);
        // created in parseLayer so it can be used to detect if we have already done it
        this.groupId = null;
        this.dataProviderId = null;
    }, {
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            var me = this;
            var loclayer = me.localization.layer;
            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            layer.setLocale(mapLayerJson.locale);

            if (loclayer.organization) {
                layer.setOrganizationName(loclayer.organization);
            }
            if (!this.groupId) {
                // negative value for group id means that admin isn't presented with tools for it (-1 is reserved for default group)
                this.groupId = -10 * Oskari.getSeq('usergeneratedGroup').nextVal();
                const mapLayerGroup = maplayerService.findLayerGroupById(this.groupId);
                if (!mapLayerGroup) {
                    const group = {
                        id: this.groupId,
                        name: loclayer.inspire
                    };
                    maplayerService.addLayerGroup(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));
                }
            }
            if (!this.dataProviderId) {
                this.dataProviderId = -10 * Oskari.getSeq('usergeneratedDataProvider').nextVal();
                const dataProvider = maplayerService.getDataProviderById(this.dataProviderId);
                if (!dataProvider) {
                    const provider = {
                        id: this.dataProviderId,
                        name: loclayer.inspire
                    };
                    maplayerService.addDataProvider(provider);
                }
            }

            if (this.dataProviderId) {
                layer.setDataProviderId(this.dataProviderId);
            }

            if (loclayer.inspire) {
                layer.setGroups([{
                    id: this.groupId,
                    name: loclayer.inspire
                }]);
            }

            const toolName = Oskari.getMsg('MapWfs2', 'editLayer');
            const toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            toolOwnStyle.setName('editStyle');
            toolOwnStyle.setIconCls('show-own-style-tool');
            toolOwnStyle.setTooltip(toolName);
            toolOwnStyle.setTitle(toolName);
            toolOwnStyle.setCallback(() => this.sandbox.postRequestByName('MyPlaces.EditCategoryRequest', [getCategoryId(layer.getId())]));
            layer.addTool(toolOwnStyle);
        }
    });
