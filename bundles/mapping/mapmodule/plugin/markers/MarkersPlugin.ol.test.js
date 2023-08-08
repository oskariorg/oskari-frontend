import { afterAll } from '@jest/globals';
import './MarkersPlugin.ol';

// mapmodule
import '../../mapmodule.ol';
import '../../resources/locale/en.js';
import { DEFAULT_DATA } from './constants';

// for mapmodule
// defaults from mapfull

const projections = {
    'EPSG:3067': '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs',
    'EPSG:4326': '+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
};
Object.keys(projections).forEach(code => {
    // mapmodule introduces proj4 global
    window.proj4.defs(code, projections[code]);
});
//  -/for mapmodule

const sandbox = Oskari.getSandbox('MarkersPluginTest');
const plugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.MarkersPlugin');
const layerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', sandbox);
sandbox.registerService(layerService);

const mapModule = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', 'Test');

Oskari.setMarkers(getMarkers());
sandbox.register(mapModule);
mapModule.registerPlugin(plugin);
mapModule.start(sandbox);
plugin.startPlugin(sandbox);

afterAll(() => {
    mapModule.stop();
});

const getImageStyle = id => plugin.getMarkersLayer().getSource().getFeatureById(id).getStyle()[0].getImage();
const getTextOnMap = id => plugin.getMarkersLayer().getSource().getFeatureById(id).getStyle()[0].getText().getText();

const markers = [{
    x: 1,
    y: 1
}, {
    x: 100,
    y: 200
}, {
    x: 3,
    y: 3,
    color: '#ff0000',
    shape: 3,
    size: 3,
    msg: 'test?'
}, {
    x: 4,
    y: 4,
    shape: 'image_url',
    size: 40,
    transient: true,
    offsetX: 12,
    offsetY: 8
}, {
    x: 4,
    y: 4,
    shape: 'image_url',
    size: 9,
    transient: true,
    offsetX: 12,
    offsetY: 8
}];

describe('MarkersPlugin', () => {
    describe('getStateParameters', () => {
        test('without markers', () => {
            expect(plugin.getStateParameters()).toEqual('');
        });
        test('after adding one marker', () => {
            plugin.addMapMarker(markers[0], 'my marker');
            // TODO: Check if we got an event from adding marker
            expect(plugin.getStateParameters()).toEqual('&markers=2|1|ffde00|1_1|');
        });
        test('after updating marker using same id', () => {
            plugin.addMapMarker(markers[1], 'my marker');
            expect(plugin.getStateParameters()).toEqual('&markers=2|1|ffde00|100_200|');
        });
        test('after adding second marker without id', () => {
            plugin.addMapMarker(markers[0]);
            expect(plugin.getStateParameters()).toEqual('&markers=2|1|ffde00|100_200|___2|1|ffde00|1_1|');
            expect(plugin.getState().markers.length).toEqual(2);
        });
        afterAll(() => {
            // remove markers to normalize state for other tests
            plugin.removeMarkers();
        });
    });
    describe('changeMapMarkerVisibility', () => {
        test('without markers', () => {
            expect(plugin.getState().markers.length).toEqual(0);
            plugin.addMapMarker(markers[1], 'my marker');
            plugin.addMapMarker(markers[0]);
            expect(plugin.getState().markers.length).toEqual(2);
            expect(plugin.getStateParameters()).toEqual('&markers=2|1|ffde00|100_200|___2|1|ffde00|1_1|');
            // hide/show single marker
            plugin.changeMapMarkerVisibility(false, 'my marker');
            expect(plugin.getState().markers.length).toEqual(1);
            expect(plugin.getStateParameters()).toEqual('&markers=2|1|ffde00|1_1|');
            plugin.changeMapMarkerVisibility(true, 'my marker');
            // looks like marker order is changed when toggling visibility. Probably not a problem but something to note
            expect(plugin.getStateParameters()).toEqual('&markers=2|1|ffde00|1_1|___2|1|ffde00|100_200|');
            // hide all and show single marker
            plugin.changeMapMarkerVisibility(false);
            expect(plugin.getStateParameters()).toEqual('');
            plugin.changeMapMarkerVisibility(true, 'my marker');
            expect(plugin.getStateParameters()).toEqual('&markers=2|1|ffde00|100_200|');
            // hide single marker and show all
            plugin.changeMapMarkerVisibility(false, 'my marker');
            plugin.changeMapMarkerVisibility(true);
            expect(plugin.getState().markers.length).toEqual(2);
        });
        afterAll(() => {
            // remove markers to normalize state for other tests
            plugin.removeMarkers();
            plugin.changeMapMarkerVisibility(true);
        });
    });
    describe('getSanitizedMarker', () => {
        test('without markers', () => {
            expect(plugin.getState().markers.length).toEqual(0);
        });
        test('sanitized data', () => {
            const marker = markers[2];
            plugin.addMapMarker(marker);
            const markerData = plugin.getState().markers[0];
            Object.keys(marker).forEach(key => {
                let value = marker[key];
                if (key === 'color') {
                    // sanitize removes #
                    value = value.substring(1);
                }
                expect(markerData[key]).toEqual(value);
            });
        });
        test('default data', () => {
            plugin.addMapMarker(markers[1]);
            const markerData = plugin.getState().markers[1];
            Object.keys(DEFAULT_DATA).forEach(key => {
                expect(markerData[key]).toEqual(DEFAULT_DATA[key]);
            });
        });
        test('setState', () => {
            const state = plugin.getState();
            plugin.removeMarkers();
            expect(plugin.getStateParameters()).toEqual('');
            plugin.setState(state);
            expect(plugin.getStateParameters()).toEqual('&markers=3|3|ff0000|3_3|test%3F___2|1|ffde00|100_200|');
        });
        test('transient', () => {
            expect(plugin.getState().markers.length).toEqual(2);
            plugin.addMapMarker(markers[3]);
            expect(plugin.getState().markers.length).toEqual(2);
        });

        afterAll(() => {
            // remove markers to normalize state for other tests
            plugin.removeMarkers();
        });
    });
    describe('rendered style', () => {
        test('oskari marker', () => {
            const id = 'marker1';
            const marker = markers[2];
            plugin.addMapMarker(marker, id);
            expect(getTextOnMap(id)).toEqual(marker.msg);
            const style = getImageStyle(id);
            const sizePx = mapModule.getPixelForSize(marker.size);
            expect(style.getSize()).toEqual([sizePx, sizePx]);
        });
        test('external', () => {
            const id = 'marker2';
            const marker = markers[3];
            plugin.addMapMarker(marker, id);
            const style = getImageStyle(id);
            const { size, offsetX, offsetY, shape } = marker;
            expect(style.getSrc()).toEqual(shape);
            // looks like getter returns top-left anchor even it is set and stored as bottom-left
            expect(style.getAnchor()).toEqual([offsetX, size - offsetY]);
            expect(style.getSize()).toEqual([size, size]);
        });
        test('external with lower than expected size (workaround backwards compatibility)', () => {
            const id = 'marker2workaround';
            const marker = markers[4];
            plugin.addMapMarker(marker, id);
            const style = getImageStyle(id);
            const { size, offsetX, offsetY, shape } = marker;
            // size is 9 here, but with external graphic values under 10 are multiplied -> should result in 130 actual size
            expect(size).toEqual(9);
            expect(style.getSrc()).toEqual(shape);
            const expectedSize = 130;
            expect(style.getSize()).toEqual([expectedSize, expectedSize]);
            // looks like getter returns top-left anchor even it is set and stored as bottom-left
            expect(style.getAnchor()).toEqual([offsetX, expectedSize - offsetY]);
        });
        afterAll(() => {
            // remove markers to normalize state for other tests
            plugin.removeMarkers();
        });
    });
});

// from https://github.com/oskariorg/oskari-server/blob/master/service-print/src/main/resources/org/oskari/print/svg-markers.json
function getMarkers () {
    return [
        {
            offsetX: 14.06,
            offsetY: 5.38,
            data: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path fill='$fill' stroke='#000000' d='m 17.662202,6.161625 c -2.460938,-0.46875 -4.101563,-0.234375 -4.921875,0.585937 -0.234375,0.234376 -0.234375,0.468751 -0.117188,0.820313 0.234375,0.585938 0.585938,1.171875 1.054688,2.109375 0.46875,0.9375 0.703125,1.523438 0.820312,1.757813 -0.351562,0.351562 -1.054687,1.054687 -2.109375,1.992187 -1.523437,1.40625 -1.523437,1.40625 -2.226562,2.109375 -0.8203126,0.820312 -0.117188,1.757812 2.109375,2.8125 0.9375,0.46875 1.992187,0.820312 3.046875,0.9375 2.695312,0.585937 4.570312,0.351562 5.742187,-0.585938 0.351563,-0.351562 0.46875,-0.703125 0.351563,-1.054687 0,0 -1.054688,-2.109375 -1.054688,-2.109375 -0.46875,-1.054688 -0.46875,-1.171875 -0.9375,-2.109375 -0.351562,-0.703125 -0.46875,-1.054687 -0.585937,-1.289062 0.234375,-0.234375 0.234375,-0.351563 1.289062,-1.289063 1.054688,-0.9375 1.054688,-0.9375 1.757813,-1.640625 0.703125,-0.585937 0.117187,-1.40625 -1.757813,-2.34375 -0.820312,-0.351563 -1.640625,-0.585938 -2.460937,-0.703125 0,0 0,0 0,0 M 14.615327,26.0835 c 0,0 1.054687,-5.625 1.054687,-5.625 0,0 -1.40625,-0.234375 -1.40625,-0.234375 0,0 -1.054687,5.859375 -1.054687,5.859375 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0' /></svg>"
        }, {
            offsetX: 16,
            offsetY: 6.84,
            data: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path fill='$fill' stroke='#000000' d='m 22.20134,7.4273516 c 0,0 -12.40234,0 -12.40234,0 0,0 0,12.3046904 0,12.3046904 0,0 3.41797,0 3.41797,0 0,0 2.73437,4.39453 2.73437,4.39453 0,0 2.73438,-4.39453 2.73438,-4.39453 0,0 3.51562,0 3.51562,0 0,0 0,-12.3046904 0,-12.3046904 0,0 0,0 0,0'/></svg>"
        }, {
            offsetX: 16,
            offsetY: 5.19,
            data: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path fill='$fill' stroke='#000000' d='m 16.00025,5.7495486 c -1.99219,0 -3.51562,0.58594 -4.92187,1.99219 C 9.67213,9.1479886 8.969,10.788619 8.969,12.780799 c 0,1.17188 0.58594,2.8125 1.75781,5.03907 1.17188,2.22656 2.34375,4.10156 3.51563,5.625 0,0 1.75781,2.46093 1.75781,2.46093 4.6875,-6.21093 7.03125,-10.54687 7.03125,-13.125 0,-1.99218 -0.70312,-3.6328104 -2.10937,-5.0390604 -1.40625,-1.40625 -2.92969,-1.99219 -4.92188,-1.99219 0,0 0,0 0,0 m 0,9.9609404 c -0.82031,0 -1.40625,-0.23437 -1.99219,-0.82031 -0.58593,-0.58594 -0.82031,-1.17188 -0.82031,-1.99219 0,-0.82031 0.23438,-1.52344 0.82031,-2.10937 0.58594,-0.58594 1.17188,-0.8203204 1.99219,-0.8203204 0.82031,0 1.52344,0.2343804 2.10938,0.8203204 0.58593,0.58593 0.82031,1.28906 0.82031,2.10937 0,0.82031 -0.23438,1.40625 -0.82031,1.99219 -0.58594,0.58594 -1.28907,0.82031 -2.10938,0.82031 0,0 0,0 0,0'/></svg>"
        }, {
            offsetX: 12.74,
            offsetY: 5.63,
            data: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path fill='$fill' stroke='#000000' d='m 13.48113,25.7265 c 0,0 1.99218,-8.3203 1.99218,-8.3203 0,0 -1.40625,-0.2344 -1.40625,-0.2344 0,0 -1.99218,8.5547 -1.99218,8.5547 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0 M 10.903,11.3124 c 0,1.4063 0.46875,2.5782 1.40625,3.6329 0.9375,1.0546 2.22656,1.5234 3.63281,1.5234 1.40625,0 2.57813,-0.4688 3.63282,-1.5234 1.05468,-1.0547 1.52343,-2.2266 1.52343,-3.6329 0,-1.4062 -0.46875,-2.5781 -1.52343,-3.5156 -1.05469,-0.9375 -2.22657,-1.5234 -3.63282,-1.5234 -1.40625,0 -2.69531,0.5859 -3.63281,1.5234 -0.9375,0.9375 -1.40625,2.1094 -1.40625,3.5156 0,0 0,0 0,0'/></svg>"
        }, {
            offsetX: 20.12,
            offsetY: 5.41,
            data: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><g transform='translate(1.2364754,0.92819)'><path fill='$fill' stroke='#000000' d='m 19.50313,25.03281 c 0,0 4.80468,-19.80468 4.80468,-19.80468 0,0 -1.52343,0 -1.52343,0 0,0 -4.6875,19.80468 -4.6875,19.80468 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0 M 8.01875,5.11094 c 0,0 2.10938,5.27344 2.10938,5.27344 0,0 -4.45313,5.15625 -4.45313,5.15625 0,0 13.47656,0 13.47656,0 0,0 2.46094,-10.42969 2.46094,-10.42969 0,0 -13.59375,0 -13.59375,0 0,0 0,0 0,0'/></g></svg>"
        }, {
            data: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path fill='$fill' stroke='#000000' d='m 8.969,15.99975 c 0,1.99219 0.70313,3.51563 2.10938,4.92188 1.40625,1.40625 2.92968,2.10937 4.92187,2.10937 1.99219,0 3.51563,-0.70312 4.92188,-2.10937 1.40625,-1.40625 2.10937,-2.92969 2.10937,-4.92188 0,-1.99219 -0.70312,-3.51562 -2.10937,-4.92187 C 19.51588,9.67163 17.99244,8.9685 16.00025,8.9685 c -1.99219,0 -3.51562,0.70313 -4.92187,2.10938 -1.40625,1.40625 -2.10938,2.92968 -2.10938,4.92187 0,0 0,0 0,0'/></svg>"
        }, {
            offsetX: 16,
            offsetY: 5.41,
            data: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path fill='$fill' stroke='#000000' d='m 19.280933,16.92943 c 0,0 0,-10.8984403 0,-10.8984403 0,0 -6.5625,0 -6.5625,0 0,0 0,10.8984403 0,10.8984403 0,0 -4.5703104,0 -4.5703104,0 0,0 7.8515604,8.78906 7.8515604,8.78906 0,0 7.85156,-8.78906 7.85156,-8.78906 0,0 -4.57031,0 -4.57031,0 0,0 0,0 0,0'/></svg>"
        }
    ];
};
