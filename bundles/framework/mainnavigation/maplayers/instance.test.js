import { beforeEach } from '@jest/globals';
import { showFlyout } from 'oskari-ui/components/window';
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

describe('MapLayersBundleInstance', () => {
    let instance;
    let service;
    let sandbox;
    let layers;

    beforeEach(() => {
        showFlyout.mockImplementation((title, content, onClose) => ({
            close: jest.fn(onClose)
        }));
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

    test('ignores redundant deactivation reported when the service closes the flyout', () => {
        service.setActive(MENU_ITEM_ID);
        const setActive = jest.spyOn(service, 'setActive');

        service.setActive(MENU_ITEM_ID, false);

        expect(setActive).toHaveBeenCalledTimes(2);
        expect(setActive.mock.results[1].value).toBe(false);
        expect(instance.flyoutControls).toBeNull();
        expect(service.getActiveMenuItemId()).toBeNull();
    });

    test('notifies the service when the user closes the active flyout', () => {
        service.setActive(MENU_ITEM_ID);
        const setActive = jest.spyOn(service, 'setActive');

        instance.flyoutControls.close();

        expect(setActive).toHaveBeenCalledTimes(1);
        expect(setActive).toHaveBeenCalledWith(MENU_ITEM_ID, false);
        expect(instance.flyoutControls).toBeNull();
        expect(service.getActiveMenuItemId()).toBeNull();
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