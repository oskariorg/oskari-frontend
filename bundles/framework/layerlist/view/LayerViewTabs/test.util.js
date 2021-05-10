import '../../../layerselector2/service/layerlist';
import '../../../layerlist/resources/locale/en';
import '../../../../mapping/mapmodule/service/map.state';
import '../../service/LayerListToolingService';
import '../../../../mapping/mapmodule/service/map.layer';
import '../../../../mapping/mapmodule/domain/AbstractLayer';
import '../../../../mapping/mapmodule/domain/style';
import '../../../../mapping/mapmodule/event/map.layer';
import '../../../../mapping/mapmodule/plugin/wmslayer/wmslayer';

const sandbox = Oskari.getSandbox();
const layerlistService = Oskari.clazz.create('Oskari.mapframework.service.LayerlistService', sandbox);
const toolingService = Oskari.clazz.create('Oskari.mapframework.service.LayerListToolingService', sandbox);
const mapStateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
const mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', sandbox);
const layers = [];

export const initServices = () => {
    sandbox.registerService(layerlistService);
    sandbox.registerService(toolingService);
    sandbox.registerService(mapStateService);
    sandbox.registerService(mapLayerService);
};

// remove added things so we don't affect other tests
// TODO: remove filters registered in this test
export const teardown = () => {
    layers.forEach(l => mapLayerService.removeLayer(l, true));
    sandbox.unregisterService(layerlistService.getQName());
    sandbox.unregisterService(toolingService.getQName());
    sandbox.unregisterService(mapStateService.getQName());
    sandbox.unregisterService(mapLayerService.getQName());
};

const bundleName = 'LayerList';
export const getBundleInstance = () => ({
    getSandbox: () => sandbox,
    getName: () => bundleName,
    getLocalization: () => Oskari.getLocalization(bundleName)
});

const generateDummyLayer = (type) => {
    return {
        id: Math.round(Math.random() * 10000),
        type: type,
        // the "newest" filter used in test requires the "created" to be set to function
        // without it the test will only show 2 filters
        created: new Date()
    };
};

export const addLayer = (type) => {
    const newLayer = mapLayerService.createMapLayer(generateDummyLayer(type));
    mapLayerService.addLayer(newLayer);
    layers.push(newLayer);
};

export const addFilter = (id, text, tooltip) => {
    // TODO: if mapLayerService doesn't recognize the filter it returns unfiltered list.
    //  This feels like a bug but lets register the filter to both since that what the code _should_ be doing.
    mapLayerService.registerLayerFilter(id, (layer) => !!layer);
    layerlistService.registerLayerlistFilterButton(text, tooltip, '', id);
    // TODO: unregister these on teardown()
};
