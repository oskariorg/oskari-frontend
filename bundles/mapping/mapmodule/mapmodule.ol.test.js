import '../../../src/global';
import proj4 from '../../../libraries/Proj4js/proj4js-2.2.1/proj4-src.js';
import './AbstractMapModule';
import './mapmodule.ol';
import './resources/locale/en.js';
import './service/map.state';

// defaults from mapfull
const projections = {
    'EPSG:3067': '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs',
    'EPSG:4326': '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
};
Object.keys(projections).forEach(code => {
    proj4.defs(code, projections[code]);
});
window.proj4 = proj4;

const mapModule = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', 'Test');
// if the mapModule is started make sure to:
// afterAll(() => mapModule.stop());

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
    describe('getZoomForResolution', () => {
        test('resolution 5', () => {
            expect(mapModule.getZoomForResolution(5)).toEqual(8);
        });
        test('resolution 0.5', () => {
            expect(mapModule.getZoomForResolution(0.5)).toEqual(11);
        });
        test('resolution 0.3', () => {
            expect(mapModule.getZoomForResolution(0.3)).toEqual(12);
        });
        test('resolution 0.25', () => {
            expect(mapModule.getZoomForResolution(0.25)).toEqual(12);
        });
        test('resolution 0.1', () => {
            expect(mapModule.getZoomForResolution(0.1)).toEqual(-1);
        });
        test('resolution 0.0000001', () => {
            expect(mapModule.getZoomForResolution(0.00001)).toEqual(-1);
        });
        test('resolution 50000000', () => {
            expect(mapModule.getZoomForResolution(50000000)).toEqual(-1);
        });
        test('resolution undefined', () => {
            expect(mapModule.getZoomForResolution()).toEqual(-1);
        });
    });
});
