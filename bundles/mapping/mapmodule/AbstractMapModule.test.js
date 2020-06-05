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
const changeStyleCalls = [];
const changeFontCalls = [];
const nonUIPlugin = {
    getName: () => 'Non UI plugin',
    register: () => {},
    setMapModule: () => {},
    hasUI: () => false,
    changeToolStyle: (style) => { changeStyleCalls.push(style); },
    changeFont: (font) => { changeFontCalls.push(font); },
    getIndex: () => 10
};
const uiPlugin = {
    getName: () => 'UI plugin',
    register: () => {},
    setMapModule: () => {},
    hasUI: () => true,
    changeToolStyle: (style) => { changeStyleCalls.push(style); },
    changeFont: (font) => { changeFontCalls.push(font); },
    getIndex: () => 20
};

describe('MapModule', () => {
    mapModule.registerPlugin(dummyPlugin);
    mapModule.registerPlugin(nonUIPlugin);
    mapModule.registerPlugin(uiPlugin);
    test('has 3 plugins', () => {
        expect(Object.keys(mapModule.getPluginInstances()).length).toEqual(3);
    });
    describe('changeToolStyle', () => {
        test('only called for plugin with UI and with value [undefined]', () => {
            mapModule.changeToolStyle();
            expect(changeStyleCalls.length).toEqual(1);
            expect(changeStyleCalls[0]).toBeUndefined();
            expect(changeFontCalls.length).toEqual(1);
            expect(changeFontCalls[0]).toBeUndefined();
        });
        test('only called for plugin with UI and with style "3d-light" and font [undefined]', () => {
            mapModule.changeToolStyle({ toolStyle: '3d-light' });
            expect(changeStyleCalls.length).toEqual(2);
            expect(changeStyleCalls[1]).toEqual('3d-light');
            expect(changeFontCalls.length).toEqual(2);
            expect(changeFontCalls[1]).toBeUndefined();
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
