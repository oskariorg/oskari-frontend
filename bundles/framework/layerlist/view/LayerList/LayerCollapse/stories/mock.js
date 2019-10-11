import '../../../../../../../src/global';
import '../../../../../../mapping/mapmodule/service/map.state';
import '../../../../../../mapping/mapmodule/domain/AbstractLayer';
import '../../../../../layerselector2/resources/locale/fi.js';

const Oskari = window.Oskari;
const sandbox = Oskari.getSandbox();
const stateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
sandbox.registerService(stateService);

const mockInstance = {
    sandbox
};

export const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');
export const locale = Oskari.getLocalization('LayerSelector', 'fi');
export { mockInstance as instance };
