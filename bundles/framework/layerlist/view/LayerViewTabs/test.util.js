import '../../../layerselector2/service/layerlist';
import '../../../layerselector2/resources/locale/en';
import '../../../../mapping/mapmodule/service/map.state';

export const initServices = () => {
    Oskari.setLang('en');
    const sandbox = Oskari.getSandbox();
    const layerlistService = Oskari.clazz.create('Oskari.mapframework.service.LayerlistService', sandbox);
    const mapStateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
    sandbox.registerService(layerlistService);
    sandbox.registerService(mapStateService);
};

export const getBundleInstance = () => ({
    getSandbox: () => Oskari.getSandbox(),
    getLocalization: () => Oskari.getLocalization('LayerSelector')
});
