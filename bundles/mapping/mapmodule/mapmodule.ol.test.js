import '../../../src/global';
import proj4 from '../../../libraries/Proj4js/proj4js-2.2.1/proj4-src.js';
import './AbstractMapModule';
import './mapmodule.ol';
import './resources/locale/en.js';
import './service/map.state';
import jQuery from 'jquery';

const Oskari = window.Oskari;
global.jQuery = jQuery;

// defaults from mapfull
const projections = {
    'EPSG:3067': '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs',
    'EPSG:4326': '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
};
Object.keys(projections).forEach(code => {
    proj4.defs(code, projections[code]);
});
window.proj4 = proj4;

// const mapModule = Oskari.clazz.create('Oskari.mapping.mapmodule.AbstractMapModule', 'Test');
const mapModule = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', 'Test');

describe('MapModule', () => {
    const res = mapModule.getResolutionArray();

    test('has 13 resolutions by default', () => {
        expect(res[0]).toEqual(2000);
        expect(res[res.length - 1]).toEqual(0.25);
        expect(res.length).toEqual(13);
    });
    test('uses EPSG:3067 by default', () => {
        // for legacy reasons. This should be changed to 3857
        expect(mapModule.getProjection()).toEqual('EPSG:3067');
    });
    describe('init', () => {
        test('calculates scales based on resolutions', () => {
            expect(mapModule.getScaleArray().length).toEqual(0);
            mapModule.init(Oskari.getSandbox());
            expect(mapModule.getScaleArray().length).toEqual(13);
        });
    });
});
