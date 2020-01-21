import '../../../layerselector2/service/layerlist';
import '../../../layerlist/resources/locale/en';
import '../../../../mapping/mapmodule/service/map.state';
import '../../service/LayerListToolingService';
import '../../../../mapping/mapmodule/service/map.layer';

export const initServices = () => {
    const sandbox = Oskari.getSandbox();
    const layerlistService = Oskari.clazz.create('Oskari.mapframework.service.LayerlistService', sandbox);
    const toolingService = Oskari.clazz.create('Oskari.mapframework.service.LayerListToolingService', sandbox);
    const mapStateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
    const mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', sandbox);
    sandbox.registerService(layerlistService);
    sandbox.registerService(toolingService);
    sandbox.registerService(mapStateService);
    sandbox.registerService(mapLayerService);
};

const bundleName = 'LayerList';
export const getBundleInstance = () => ({
    getSandbox: () => Oskari.getSandbox(),
    getName: () => bundleName,
    getLocalization: () => Oskari.getLocalization(bundleName)
});
