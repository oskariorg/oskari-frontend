import '../../../../../src/global';
import '../AbstractMapModulePlugin';
import './VectorLayerPlugin.ol';
import jQuery from 'jquery';
import _ from 'lodash';

const Oskari = window.Oskari;
global.jQuery = jQuery;
global._ = _;

const plugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.VectorLayerPlugin');

describe('VectorLayerPlugin', () => {
    plugin._olLayers['test_1'] = {};
    plugin._olLayers['test_2'] = {};
    test('getLayerIds without param returns 2 faked layers', () => {
        expect(plugin.getLayerIds().length).toEqual(2);
    });
    test('getLayerIds with valid param returns 1', () => {
        expect(plugin.getLayerIds({ layer: [12] }).length).toEqual(1);
    });
    test('getLayerIds with valid param returns 3', () => {
        expect(plugin.getLayerIds({ layer: [1, 2, 3] }).length).toEqual(3);
    });
    test('getLayerIds with invalid param returns 0', () => {
        expect(plugin.getLayerIds({ layer: 12 }).length).toEqual(0);
    });
    test('getLayerIds with invalid param 2 returns 0', () => {
        expect(plugin.getLayerIds({ testing: true }).length).toEqual(0);
    });
});
