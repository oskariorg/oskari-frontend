import './GetInfoPlugin';
import './GetFeatureInfoFormatter';
import { _ } from '../../../../../libraries/lodash/2.3.0/lodash';
global._ = _;

const plugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.GetInfoPlugin');
// simple mock
const myPlacesLayer = {
    isLayerOfType: (type) => type === 'myplaces',
    getFields: () => ['__fid', 'name', 'desc'],
    getLocales: () => ['ID', 'Name', 'Description'],
    getName: () => 'testing_myplaces'
};
const otherLayer = {
    isLayerOfType: (type) => type === 'wfsplaces',
    getFields: () => ['__fid', 'test'],
    getLocales: () => ['ID', 'Label for test'],
    getName: () => 'testing_wfs'
};
plugin._sandbox = {
    findMapLayerFromSelectedMapLayers: (layerId) => `${layerId}`.startsWith('myplaces_') ? myPlacesLayer : otherLayer
};
plugin._loc.noAttributeData = 'NO DATA';

const removeWhitespace = (content) => content.replace(/\s/g, '');

describe('GetInfoPlugin', () => {
    describe('formatters', () => {
        describe('html', () => {
            const content = `
                <div>
                    <script>alert('Bazinga!')</script>
                </div>
            `;
            test('is function', () => {
                expect(typeof plugin.formatters.html).toEqual('function');
            });
            test('returns jQuery object', () => {
                const result = plugin.formatters.html(content);
                expect(result instanceof jQuery).toEqual(true);
            });
            test('wraps content to additional div', () => {
                const result = plugin.formatters.html(`My data`);
                expect(result.outerHTML()).toEqual('<div>My data</div>');

                const result2 = plugin.formatters.html(`<div></div>`);
                expect(removeWhitespace(result2.outerHTML())).toEqual('<div><div></div></div>');
            });
            test('removes script tags', () => {
                const result = plugin.formatters.html(content);
                const scriptTags = result.find('script');
                expect(scriptTags.length).toEqual(0);
            });
        });
    });
    describe('_formatWFSFeaturesForInfoBox', () => {
        test('is function', () => {
            expect(typeof plugin._formatWFSFeaturesForInfoBox).toEqual('function');
        });
        test('myplaces', () => {
            // [{"isMyPlace": true, "layerId": "myplaces_test", "layerName": "testing_myplaces", "markup": {"0": <div class="myplaces_place"><h3 class="myplaces_header" /><br /></div>, "length": 1}, "type": "wfslayer"}]
            const result = plugin._formatWFSFeaturesForInfoBox({
                layerId: 'myplaces_test',
                features: [[234, 'TESTING']]
            });
            expect(result.length).toEqual(1);
            expect(result[0].isMyPlace).toEqual(true);
            expect(result[0].layerId).toEqual('myplaces_test');
            expect(result[0].layerName).toEqual(myPlacesLayer.getName());
            expect(result[0].type).toEqual('wfslayer');
            expect(result[0].markup instanceof jQuery).toEqual(true);
            const html = result[0].markup.outerHTML();
            expect(html).toEqual(`<div class="myplaces_place"><h3 class="myplaces_header">TESTING</h3><br></div>`);
        });

        test('wfslayer without values', () => {
            // [{"isMyPlace": false, "layerId": 123, "layerName": "testing_wfs", "markup": "<table><tr><td>NO DATA</td></tr></table>", "type": "wfslayer"}]
            const result = plugin._formatWFSFeaturesForInfoBox({
                layerId: 123,
                features: [[]]
            });
            expect(result.length).toEqual(1);
            expect(result[0].isMyPlace).toEqual(false);
            expect(result[0].layerId).toEqual(123);
            expect(result[0].layerName).toEqual(otherLayer.getName());
            expect(result[0].type).toEqual('wfslayer');
            expect(typeof result[0].markup).toEqual('string');
            expect(result[0].markup).toEqual('<table><tr><td>NO DATA</td></tr></table>');
        });

        test('wfslayer with values', () => {
            // [{"isMyPlace": false, "layerId": 123, "layerName": "testing_wfs", "markup": "<table><tr><td>NO DATA</td></tr></table>", "type": "wfslayer"}]
            const result = plugin._formatWFSFeaturesForInfoBox({
                layerId: 123,
                features: [[234, 'TESTING']]
            });
            expect(result.length).toEqual(1);
            expect(result[0].isMyPlace).toEqual(false);
            expect(result[0].layerId).toEqual(123);
            expect(result[0].layerName).toEqual(otherLayer.getName());
            expect(result[0].type).toEqual('wfslayer');
            expect(result[0].markup instanceof jQuery).toEqual(true);
            const html = result[0].markup.outerHTML();
            expect(html).toEqual(`<table class="getinforesult_table"><tr class="odd"><td>Label for test</td><td>TESTING</td></tr></table>`);
        });
    });
});
