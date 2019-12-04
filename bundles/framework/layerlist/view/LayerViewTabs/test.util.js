import '../../../layerselector2/service/layerlist';
import '../../../layerlist/resources/locale/en';
import '../../../../mapping/mapmodule/service/map.state';
import '../../service/LayerListToolingService';

export const initServices = () => {
    const sandbox = Oskari.getSandbox();
    const layerlistService = Oskari.clazz.create('Oskari.mapframework.service.LayerlistService', sandbox);
    const toolingService = Oskari.clazz.create('Oskari.mapframework.service.LayerListToolingService', sandbox);
    const mapStateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
    sandbox.registerService(layerlistService);
    sandbox.registerService(toolingService);
    sandbox.registerService(mapStateService);
};

export const getBundleInstance = () => ({
    getSandbox: () => Oskari.getSandbox(),
    getLocalization: () => Oskari.getLocalization('LayerList')
});
