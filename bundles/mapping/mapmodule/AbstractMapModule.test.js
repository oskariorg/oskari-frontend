import { afterAll } from '@jest/globals';
import '../../../src/global';
import './AbstractMapModule';
import './service/map.state';
import jQuery from 'jquery';

const Oskari = window.Oskari;
global.jQuery = jQuery;

const mapModule = Oskari.clazz.create('Oskari.mapping.mapmodule.AbstractMapModule', 'Test');
const dummyPlugin = {
    getName: () => 'Dummy plugin',
    register: () => {},
    setMapModule: () => {}
};
let changeStyleCalls = 0;
const nonUIPlugin = {
    getName: () => 'Non UI plugin',
    register: () => {},
    setMapModule: () => {},
    hasUI: () => false,
    changeToolStyle: () => { changeStyleCalls++; },
    getIndex: () => 10
};
const uiPlugin = {
    getName: () => 'UI plugin',
    register: () => {},
    setMapModule: () => {},
    hasUI: () => true,
    changeToolStyle: () => { changeStyleCalls++; },
    getIndex: () => 20
};
afterAll(() => mapModule.stop());

describe('MapModule', () => {
    mapModule.registerPlugin(dummyPlugin);
    mapModule.registerPlugin(nonUIPlugin);
    mapModule.registerPlugin(uiPlugin);
    test('has 3 plugins', () => {
        expect(Object.keys(mapModule.getPluginInstances()).length).toEqual(3);
    });
    describe('changeToolStyle', () => {
        test('only called for plugin with UI and with value [undefined]', () => {
            mapModule.setMapTheme();
            expect(changeStyleCalls).toEqual(1);
            expect(changeStyleCalls[0]).toBeUndefined();
        });
        test('only called for plugin with UI and with style "3d-light" and font [undefined]', () => {
            mapModule.setMapTheme({ primary: '#FFFFFF' });
            expect(changeStyleCalls).toEqual(2);
        });
    });
    describe('_getSortedPlugins', () => {
        const sorted = mapModule._getSortedPlugins();
        test('has 3 plugins', () => {
            expect(sorted.length).toEqual(3);
        });
        test('has correct order', () => {
            expect(sorted[0]).toEqual(nonUIPlugin);
            expect(sorted[1]).toEqual(uiPlugin);
            expect(sorted[2]).toEqual(dummyPlugin);
        });
    });
});
