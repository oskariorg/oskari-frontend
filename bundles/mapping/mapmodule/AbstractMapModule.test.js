
import '../../../src/global';
import './AbstractMapModule';
import './mapmodule.ol';

import './resources/locale/en.js';
import './service/map.state';
import jQuery from 'jquery';
import * as olProjProj4 from 'ol/proj/proj4';

const Oskari = window.Oskari;
global.jQuery = jQuery;
const proj4 = {
    defs: {
        'EPSG:3067': '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs',
        'EPSG:4326': '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
    }
};

// ensure static projections are defined
// Object.keys(proj4.defs).forEach(srs => olProjProj4.defs(srs, proj4.defs[srs]));

// const mapModule = Oskari.clazz.create('Oskari.mapping.mapmodule.AbstractMapModule', 'Test');
const mapModule = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', 'Test');

describe('AbstractMapModule ', () => {
    const res = mapModule.getResolutionArray();

    test('has 13 resolutions by default.', () => {
        expect(res[0]).toEqual(2000);
        expect(res[res.length - 1]).toEqual(0.25);
        expect(res.length).toEqual(13);
    });
    test('init.', () => {
        expect(mapModule.getProjection()).toEqual('EPSG:3067');
        // mapModule.init(Oskari.getSandbox());
    });
});
