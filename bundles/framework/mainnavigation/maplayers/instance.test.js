import { beforeEach } from '@jest/globals';
import { MapLayersBundleInstance } from './instance';
import { MainNavigationService } from '../service/MainNavigationService';

jest.mock('oskari-ui/components/window', () => ({
    showFlyout: jest.fn()
}));

const BUNDLE_ID = 'maplayers';
const MENU_ITEM_ID = `${BUNDLE_ID}-item`;
const MAP_LAYER_EVENTS = [
    'MapLayerEvent',
    'AfterMapLayerAddEvent',
    'AfterMapLayerRemoveEvent'
];

describe('MapLayersBundleInstance badge', () => {
    let instance;
    let service;
    let sandbox;
    let layers;

    beforeEach(() => {
        layers = [{}, {}];
        service = new MainNavigationService();
        sandbox = {
            register: jest.fn(),
            unregister: jest.fn(),
            registerForEventByName: jest.fn(),
            unregisterFromEventByName: jest.fn(),
            getService: () => service,
            findAllSelectedMapLayers: () => layers
        };
        instance = new MapLayersBundleInstance();
        instance.start(sandbox);
    });

    test('initializes the badge from layers already on the map', () => {
        expect(instance.getName()).toBe(BUNDLE_ID);
        expect(service.getMenuItems()[0]).toMatchObject({
            id: MENU_ITEM_ID,
            badge: 2
        });
    });

    test.each(MAP_LAYER_EVENTS)('updates the badge on %s', (eventName) => {
        layers.push({});
        instance.onEvent({
            getName: () => eventName
        });

        expect(service.getMenuItems()[0].badge).toBe(3);
    });

    test('shows zero when the last layer is removed', () => {
        layers.length = 0;
        instance.onEvent({
            getName: () => MAP_LAYER_EVENTS[2]
        });

        expect(service.getMenuItems()[0].badge).toBe(0);
    });

    test('removes the menu item and unregisters all event listeners on stop', () => {
        instance.stop();

        expect(service.getMenuItems()).toEqual([]);
        MAP_LAYER_EVENTS.forEach((eventName) => {
            expect(sandbox.unregisterFromEventByName).toHaveBeenCalledWith(instance, eventName);
        });
        expect(sandbox.unregister).toHaveBeenCalledWith(instance);
    });
});