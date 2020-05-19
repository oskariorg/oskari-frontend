import '../../../../../src/global';
// import proj4 from '../../../libraries/Proj4js/proj4js-2.2.1/proj4-src.js';
import './VectorLayerPlugin.ol';
import jQuery from 'jquery';
import _ from 'lodash';

const Oskari = window.Oskari;
global.jQuery = jQuery;
global._ = _;

const plugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.VectorLayerPlugin');

describe('VectorLayerPlugin', () => {
    test('getLayerIds without param returns 2 faked layers', () => {
        plugin._olLayers['test_1'] = {};
        plugin._olLayers['test_2'] = {};
        expect(plugin.getLayerIds().length).toEqual(2);
    });
});
