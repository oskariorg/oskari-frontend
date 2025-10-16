import { MyFeaturesLayer } from '../domain/MyFeaturesLayer';
import { LAYER_TYPE } from '../constants';

export const handleMyFeaturesLayers = (sandbox, mapLayerService, getMsg) => {
    if (!mapLayerService) {
        throw new Error(`Can't register layer support without MapLayerService`);
    }
    // register handling through wfsvectorplugin
    /*
    const options = {
        type,
        editRequest: 'MyFeatures.ShowLayerDialogRequest',
        ...this.loc('layer')
    };
    this.getMapLayerService()?.registerLayerForUserDataModelBuilder(options);
    */

    const dataProviderId = -10 * Oskari.getSeq('usergeneratedDataProvider').nextVal();
    const provider = {
        id: dataProviderId,
        name: getMsg('layer.organization')
    };
    mapLayerService.addDataProvider(provider);
    mapLayerService.registerLayerModelBuilder(LAYER_TYPE, {
        parseLayerData: (layer, mapLayerJson) => {
            layer.setFeatureCount(mapLayerJson.featureCount);
        }
    });

    // negative value for group id means that admin isn't presented with tools for it (-1 is reserved for default group)
    const group = {
        id: -10 * Oskari.getSeq('usergeneratedGroup').nextVal(),
        name: getMsg('layer.group')
    };
    mapLayerService.addLayerGroup(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));

    // Let wfs plugin handle this layertype
    const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    const wfsPlugin = mapModule?.getLayerPlugins('wfs');
    wfsPlugin?.registerLayerType(LAYER_TYPE, MyFeaturesLayer);
    return {
        group,
        dataProviderId
    };
};
