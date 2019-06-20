
import '../../../../src/global';
import '../domain/AbstractLayer';
import '../resources/locale/en.js';
import './map.state';
import { UnsupportedLayerSrs } from '../domain/UnsupportedLayerSrs';

const Oskari = window.Oskari;
const sandbox = Oskari.getSandbox();
const stateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
sandbox.registerService(stateService);

describe('Layer ', () => {    
    const layer = Oskari.clazz.create('Oskari.mapframework.domain.AbstractLayer');
    const map = sandbox.getMap();
    const unsupportedSrs = new UnsupportedLayerSrs();
    map.addLayerSupportCheck(unsupportedSrs);

    test('with EPSG:3067 projection is supported by default.', () => {
        layer.setSrsList(['EPSG:3067']);
        expect(map.isLayerSupported(layer)).toEqual(true);
    });
    test('has no reasons to be unsupported.', () => {
        expect(map.getUnsupportedLayerReasons(layer)).toBeUndefined();
    });
    test('with EPSG:3857 projection is not supported in by default', () => {
        layer.setSrsList(['EPSG:3857']);
        expect(map.isLayerSupported(layer)).toEqual(false);
    });
    test(`is not supported because ${unsupportedSrs.getDescription()}`, () => {
        layer.setSrsList(['EPSG:3857']);
        expect(map.getUnsupportedLayerReasons(layer)).toEqual([unsupportedSrs]);
    });
});
