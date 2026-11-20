import { beforeEach } from '@jest/globals';
import { NavigationAdapter } from './NavigationAdapter';
import { MenuItemActivationResult } from '../../../../bundles/framework/mainnavigation/component/MenuItemActivationResult';
import { MainNavigationService } from '../../../../bundles/framework/mainnavigation/service/MainNavigationService';
import { MenuItem } from '../../../../bundles/framework/mainnavigation/component/MenuItem';

jest.mock('oskari-ui', () => ({ Badge: 'span' }));
jest.mock('oskari-ui/components/window', () => ({ showFlyout: jest.fn() }));

const MENU_ITEM_ID = 'test-item';
const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
const ADD_EXTENSION_REQUEST = 'userinterface.AddExtensionRequest';
const REMOVE_EXTENSION_REQUEST = 'userinterface.RemoveExtensionRequest';

describe('NavigationAdapter registration', () => {
    let instance;
    let sandbox;
    let navigation;
    let service;
    let menuItem;
    let createMenuItem;
    let onStart;
    let onStop;

    test('loads and uses divmanazer without importing mainnavigation modules', () => {
        const unavailable = () => { throw new Error('mainnavigation is unavailable'); };
        jest.doMock('../../../../bundles/framework/mainnavigation/component/MenuItemActivationResult', unavailable);
        jest.doMock('../../../../bundles/framework/mainnavigation/component/MenuItem', unavailable);
        jest.doMock('../../../../bundles/framework/mainnavigation/service/MainNavigationService', unavailable);
        const requestBuilder = jest.spyOn(Oskari, 'requestBuilder').mockImplementation(name => extension => ({ name, extension }));
        try {
            jest.isolateModules(() => {
                const { NavigationAdapter: IndependentNavigationAdapter } = jest.requireActual('./NavigationAdapter');
                const legacySandbox = { getService: jest.fn(() => undefined), request: jest.fn() };
                const legacyInstance = { getSandbox: () => legacySandbox };
                const createItem = jest.fn(() => { throw new Error('Must not create a menu item in legacy mode'); });
                const extension = new IndependentNavigationAdapter(legacyInstance, { createMenuItem: createItem });
                extension.start();
                extension.stop();
                expect(legacySandbox.getService).toHaveBeenCalledWith(MAIN_NAVIGATION_SERVICE);
                expect(legacySandbox.request.mock.calls).toEqual([
                    [legacyInstance, { name: ADD_EXTENSION_REQUEST, extension: legacyInstance }],
                    [legacyInstance, { name: REMOVE_EXTENSION_REQUEST, extension: legacyInstance }]
                ]);
                expect(createItem).not.toHaveBeenCalled();
            });
        } finally {
            requestBuilder.mockRestore();
            jest.dontMock('../../../../bundles/framework/mainnavigation/component/MenuItemActivationResult');
            jest.dontMock('../../../../bundles/framework/mainnavigation/component/MenuItem');
            jest.dontMock('../../../../bundles/framework/mainnavigation/service/MainNavigationService');
        }
    });

    beforeEach(() => {
        service = new MainNavigationService();
        sandbox = {
            getService: jest.fn(() => service),
            request: jest.fn()
        };
        // No flyout, React content, plugin or Extension lifecycle is required in modern mode.
        instance = { getSandbox: () => sandbox };
        menuItem = {
            id: MENU_ITEM_ID,
            connect: jest.fn(),
            render: jest.fn(),
            setActive: jest.fn(() => MenuItemActivationResult.OK),
            setBadge: jest.fn(),
            dispose: jest.fn()
        };
        createMenuItem = jest.fn(() => menuItem);
        onStart = jest.fn();
        onStop = jest.fn();
        navigation = new NavigationAdapter(instance, { createMenuItem, onStart, onStop });
    });

    test('registers the bundle-provided menu item and leaves activation to it', () => {
        navigation.start();

        expect(sandbox.getService).toHaveBeenCalledWith(MAIN_NAVIGATION_SERVICE);
        expect(service.getMenuItems()).toEqual([menuItem]);
        expect(createMenuItem).toHaveBeenCalledWith({ MenuItem, MenuItemActivationResult });
        expect(sandbox.request).not.toHaveBeenCalled();
        expect(menuItem.setActive).not.toHaveBeenCalled();
        service.setActive(MENU_ITEM_ID, true);
        expect(menuItem.setActive).toHaveBeenCalledWith(true);
        service.setActive(MENU_ITEM_ID, false);
        expect(menuItem.setActive).toHaveBeenLastCalledWith(false);
    });

    test('exposes the selected service before bundle initialization and creates the item afterwards', () => {
        onStart.mockImplementation(() => expect(navigation.service).toBe(service));
        navigation.start();

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(onStart.mock.invocationCallOrder[0]).toBeLessThan(createMenuItem.mock.invocationCallOrder[0]);
    });

    test('supports registration without modern lifecycle callbacks', () => {
        navigation = new NavigationAdapter(instance, { createMenuItem });
        navigation.start();
        navigation.stop();

        expect(menuItem.dispose).toHaveBeenCalledTimes(1);
        expect(service.getMenuItems()).toEqual([]);
    });

    test('removes and deactivates the menu item before bundle cleanup and supports restart', () => {
        navigation.start();
        service.setActive(MENU_ITEM_ID);
        navigation.stop();

        expect(menuItem.setActive).toHaveBeenLastCalledWith(false);
        expect(menuItem.dispose).toHaveBeenCalledTimes(1);
        expect(menuItem.dispose.mock.invocationCallOrder[0]).toBeLessThan(onStop.mock.invocationCallOrder[0]);
        expect(onStop).toHaveBeenCalledTimes(1);
        expect(navigation.service).toBeNull();
        expect(service.getMenuItems()).toEqual([]);
        navigation.start();
        expect(service.getMenuItems()).toEqual([menuItem]);
    });

    test('keeps registration when the bundle refuses deactivation', () => {
        navigation.start();
        service.setActive(MENU_ITEM_ID);
        menuItem.setActive.mockReturnValue(MenuItemActivationResult.FAILED);

        expect(navigation.stop()).toBe(MenuItemActivationResult.FAILED);
        expect(onStop).not.toHaveBeenCalled();
        expect(menuItem.dispose).not.toHaveBeenCalled();
        expect(navigation.service).toBe(service);
        expect(service.getActiveMenuItemIds()).toEqual([MENU_ITEM_ID]);
    });

    test('uses divmanazer registration without creating a modern menu item or running modern callbacks', () => {
        sandbox.getService.mockReturnValue(null);
        const requestBuilder = jest.spyOn(Oskari, 'requestBuilder').mockImplementation(name => extension => ({ name, extension }));
        try {
            navigation.start();
            expect(sandbox.request).toHaveBeenCalledWith(instance, { name: ADD_EXTENSION_REQUEST, extension: instance });
            expect(navigation.service).toBeNull();
            navigation.stop();
            expect(sandbox.request).toHaveBeenLastCalledWith(instance, { name: REMOVE_EXTENSION_REQUEST, extension: instance });
            expect(createMenuItem).not.toHaveBeenCalled();
            expect(onStart).not.toHaveBeenCalled();
            expect(onStop).not.toHaveBeenCalled();
        } finally {
            requestBuilder.mockRestore();
        }
    });
});
