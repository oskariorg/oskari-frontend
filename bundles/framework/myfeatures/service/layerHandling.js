import { MyFeaturesLayer } from '../domain/MyFeaturesLayer';
import { MY_FEATURES_LAYER_TYPE } from '../constants';

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
    mapLayerService.registerLayerModelBuilder(MY_FEATURES_LAYER_TYPE, {
        parseLayerData
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
    wfsPlugin?.registerLayerType(MY_FEATURES_LAYER_TYPE, MyFeaturesLayer);
    return {
        group,
        dataProviderId
    };
};

export const parseLayerData = (layer, mapLayerJson) => {
    layer.setFeatureCount(mapLayerJson.featureCount);
    // Layer listing returns a flat "orgName", but create/update responses only return the raw
    // "locale" map (per language), so fall back to the locale's "source" field in that case.
    const dataSource = mapLayerJson.orgName || Oskari.getLocalized(mapLayerJson.locale)?.source || '';
    layer.setDataSource(dataSource);
    // "created" is an epoch timestamp in seconds (with fractional sub-second precision), but
    // MapLayerService only accepts it via Date.parse() (which fails for epoch numbers) and Date()
    // expects milliseconds, so convert and set it explicitly here instead.
    if (mapLayerJson.created) {
        layer.setCreated(new Date(mapLayerJson.created * 1000));
    }
};
