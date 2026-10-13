import { MenuItemActivationResult } from '../component/MenuItemActivationResult';
import { beforeEach } from '@jest/globals';
import { MainNavigationService } from './MainNavigationService';
import { MenuItem } from '../component/MenuItem';

jest.mock('oskari-ui', () => ({ Badge: 'span' }));
jest.mock('oskari-ui/components/window', () => ({ showFlyout: jest.fn(() => ({ close: jest.fn() })) }));

const FIRST_ID = 'first-item';
const SECOND_ID = 'second-item';
const UNKNOWN_ID = 'unknown-item';

describe('MainNavigationService', () => {
    let service;
    let firstChanged;
    let secondChanged;

    beforeEach(() => {
        service = new MainNavigationService();
        firstChanged = jest.fn(() => MenuItemActivationResult.OK);
        secondChanged = jest.fn(() => MenuItemActivationResult.OK);
        service.addMenuItem(new MenuItem({ id: FIRST_ID, setActive: firstChanged }));
        service.addMenuItem(new MenuItem({ id: SECOND_ID, setActive: secondChanged }));
    });

    test('activates only one item and notifies the previous bundle first', () => {
        service.setActive(FIRST_ID);
        service.setActive(SECOND_ID);

        expect(service.getActiveMenuItemIds()).toEqual([SECOND_ID]);
        expect(service.getMenuItems()
            .map((item) => item.isActive)).toEqual([false, true]);
        expect(firstChanged.mock.calls).toEqual([[true], [false, { switching: true }]]);
        expect(secondChanged.mock.calls).toEqual([[true]]);
        expect(firstChanged.mock.invocationCallOrder[1]).toBeLessThan(secondChanged.mock.invocationCallOrder[0]);
    });

    test('ignores the old flyout close callback when switching items', () => {
        firstChanged.mockImplementation((isActive) => {
            if (!isActive) {
                service.setActive(FIRST_ID, false);
            }
            return MenuItemActivationResult.OK;
        });
        service.setActive(FIRST_ID);
        service.setActive(SECOND_ID);

        expect(service.getActiveMenuItemIds()).toEqual([SECOND_ID]);
        expect(secondChanged).toHaveBeenCalledWith(true);
    });

    test('clears the active item when its flyout closes', () => {
        service.setActive(FIRST_ID);
        service.setActive(FIRST_ID, false);

        expect(service.getActiveMenuItemIds()).toEqual([]);
        expect(service.getMenuItems()
            .every((item) => !item.isActive)).toBe(true);
        expect(firstChanged).toHaveBeenLastCalledWith(false);
    });

    test('removing the active item deactivates its bundle', () => {
        service.setActive(FIRST_ID);
        service.removeMenuItem(FIRST_ID);

        expect(service.getActiveMenuItemIds()).toEqual([]);
        expect(firstChanged).toHaveBeenLastCalledWith(false);
        expect(service.getMenuItems()
            .map((item) => item.id)).toEqual([SECOND_ID]);
    });

    test('rejects unknown items and repeated activation', () => {
        expect(service.setActive(UNKNOWN_ID)).toBe(MenuItemActivationResult.FAILED);
        expect(service.setActive(FIRST_ID)).toBe(MenuItemActivationResult.OK);
        expect(service.setActive(FIRST_ID)).toBe(MenuItemActivationResult.OK);
        expect(firstChanged).toHaveBeenCalledTimes(1);
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID]);
    });

    test('keeps service-owned state when menu item metadata is updated', () => {
        service.setActive(FIRST_ID);
        service.addMenuItem(new MenuItem({
            id: FIRST_ID,
            isActive: false
        }));
        service.addMenuItem(new MenuItem({
            id: SECOND_ID,
            isActive: true
        }));

        expect(service.getMenuItems()
            .map((item) => item.isActive)).toEqual([true, false]);
    });

    test('updates only the requested badge and notifies listeners without changing activation', () => {
        service.setActive(FIRST_ID);
        firstChanged.mockClear();
        const handleMenuItemsChanged = jest.fn();
        service.addListener({ handleMenuItemsChanged });

        expect(service.setBadge(FIRST_ID, 0)).toBe(true);
        expect(service.getMenuItems()[0]).toMatchObject({
            id: FIRST_ID,
            badge: 0,
            isActive: true
        });
        expect(service.getMenuItems()[1].badge).toBeUndefined();
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID]);
        expect(firstChanged).not.toHaveBeenCalled();
        expect(secondChanged).not.toHaveBeenCalled();
        expect(handleMenuItemsChanged).toHaveBeenCalledTimes(1);
        expect(handleMenuItemsChanged).toHaveBeenCalledWith(service.getMenuItems());
    });

    test('does not notify listeners for unknown items or unchanged badge values', () => {
        service.setBadge(FIRST_ID, 7);
        const handleMenuItemsChanged = jest.fn();
        service.addListener({ handleMenuItemsChanged });

        expect(service.setBadge(UNKNOWN_ID, 3)).toBe(false);
        expect(service.setBadge(FIRST_ID, 7)).toBe(false);
        expect(handleMenuItemsChanged).not.toHaveBeenCalled();
        expect(service.getMenuItems()[0].badge).toBe(7);
    });

    test.each([null, undefined])('clears the badge with %p', (badge) => {
        service.setBadge(FIRST_ID, 7);

        expect(service.setBadge(FIRST_ID, badge)).toBe(true);
        expect(service.getMenuItems()[0].badge).toBe(badge);
    });
    test('lets a badge override handle unchanged values and notify listeners', () => {
        const setBadge = jest.fn();
        service.addMenuItem(new MenuItem({
            id: FIRST_ID,
            setActive: firstChanged,
            setBadge (badge) {
                setBadge(badge);
                if (this.badge === badge) {
                    return false;
                }
                this.badge = badge;
                this.onChange?.();
                return true;
            }
        }));
        service.setActive(FIRST_ID);
        firstChanged.mockClear();
        const handleMenuItemsChanged = jest.fn();
        service.addListener({ handleMenuItemsChanged });

        expect(service.setBadge(FIRST_ID, 4)).toBe(true);
        expect(setBadge).toHaveBeenCalledTimes(1);
        expect(setBadge).toHaveBeenCalledWith(4);
        expect(service.getMenuItems()[0].badge).toBe(4);
        expect(service.setBadge(FIRST_ID, 4)).toBe(false);
        expect(service.setBadge(UNKNOWN_ID, 2)).toBe(false);
        expect(setBadge).toHaveBeenCalledTimes(2);
        expect(handleMenuItemsChanged).toHaveBeenCalledTimes(1);
        expect(firstChanged).not.toHaveBeenCalled();
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID]);
    });

    test('registers the original item and keeps its overrides on metadata updates', () => {
        const item = new MenuItem({
            id: UNKNOWN_ID,
            name: 'Custom',
            setBadge (badge) {
                this.badge = badge * 2;
                this.onChange?.();
                return true;
            }
        });
        expect(service.addMenuItem(item)).toBe(item);
        item.update({ id: UNKNOWN_ID, name: 'Updated' });
        service.addMenuItem(item);
        expect(service.setBadge(UNKNOWN_ID, 3)).toBe(true);
        expect(service.getMenuItems().find(state => state.id === UNKNOWN_ID)).toMatchObject({
            name: 'Updated',
            badge: 6
        });
    });

    test('keeps a badge set before registration and disconnects the removed item', () => {
        const item = new MenuItem({ id: UNKNOWN_ID, name: 'Custom' });
        expect(item.setBadge(4)).toBe(true);
        service.addMenuItem(item);
        expect(service.getMenuItems().find(state => state.id === UNKNOWN_ID).badge).toBe(4);
        service.removeMenuItem(UNKNOWN_ID);
        const handleMenuItemsChanged = jest.fn();
        service.addListener({ handleMenuItemsChanged });
        item.setBadge(5);
        expect(handleMenuItemsChanged).not.toHaveBeenCalled();
    });

    test('accepts ready-made items by their methods and rejects settings objects', () => {
        expect(service.addMenuItem({ id: UNKNOWN_ID, name: 'Settings' })).toBeNull();
        const item = {
            id: UNKNOWN_ID,
            connect: jest.fn(),
            render: jest.fn(),
            setActive: jest.fn(() => MenuItemActivationResult.OK),
            setBadge: jest.fn(() => true),
            dispose: jest.fn()
        };
        expect(service.addMenuItem(item)).toBe(item);
        service.setActive(UNKNOWN_ID);
        expect(item.setActive).toHaveBeenCalledWith(true);
        expect(service.setBadge(UNKNOWN_ID, 3)).toBe(true);
        expect(item.setBadge).toHaveBeenCalledWith(3);
        service.removeMenuItem(UNKNOWN_ID);
        expect(item.dispose).toHaveBeenCalledTimes(1);
    });

    test.each([MenuItemActivationResult.FAILED, MenuItemActivationResult.ACTION_REQUIRED])('stops switching when closing returns %s', (result) => {
        service.setActive(FIRST_ID);
        firstChanged.mockImplementation(isActive => isActive ? MenuItemActivationResult.OK : result);
        secondChanged.mockClear();
        expect(service.setActive(SECOND_ID)).toBe(result);
        expect(secondChanged).not.toHaveBeenCalled();
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID]);
        expect(service.getMenuItems().map(item => item.isActive)).toEqual([true, false]);
        expect(service.removeMenuItem(FIRST_ID)).toBe(result);
        expect(service.getMenuItems()).toHaveLength(2);
    });

    test('keeps a pinned item open during switching and closes it explicitly', () => {
        const item = new MenuItem({ id: FIRST_ID, name: 'Pinned', keepActive: true });
        service.addMenuItem(item);
        expect(service.setActive(FIRST_ID)).toBe(MenuItemActivationResult.OK);
        const controls = item.flyoutControls;
        expect(service.setActive(SECOND_ID)).toBe(MenuItemActivationResult.OK);
        expect(service.getMenuItems().map(item => item.isActive)).toEqual([true, true]);
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID, SECOND_ID]);
        expect(controls.close).not.toHaveBeenCalled();
        expect(service.setActive(FIRST_ID, false)).toBe(MenuItemActivationResult.OK);
        expect(controls.close).toHaveBeenCalledTimes(1);
        expect(service.getMenuItems().map(item => item.isActive)).toEqual([false, true]);
    });

    test('stops the loop at a blocked item and keeps completed closures in the bookkeeping', () => {
        const target = new MenuItem({ id: UNKNOWN_ID, setActive: jest.fn(() => MenuItemActivationResult.OK) });
        service.addMenuItem(target);
        service.setActive(FIRST_ID);
        firstChanged.mockImplementation(isActive => isActive ? MenuItemActivationResult.OK : MenuItemActivationResult.KEEP_OPEN);
        secondChanged.mockReturnValue(MenuItemActivationResult.OK);
        service.setActive(SECOND_ID);
        firstChanged.mockReturnValue(MenuItemActivationResult.OK);
        secondChanged.mockReturnValue(MenuItemActivationResult.ACTION_REQUIRED);
        expect(service.setActive(UNKNOWN_ID)).toBe(MenuItemActivationResult.ACTION_REQUIRED);
        expect(target.setActive).not.toHaveBeenCalled();
        expect(service.getMenuItems().map(item => item.isActive)).toEqual([false, true, false]);
        expect(service.getActiveMenuItemIds()).toEqual([SECOND_ID]);
    });

    test.each([MenuItemActivationResult.FAILED, MenuItemActivationResult.ACTION_REQUIRED])('does not activate a target that returns %s', (result) => {
        secondChanged.mockReturnValue(result);
        expect(service.setActive(SECOND_ID)).toBe(result);
        expect(service.getMenuItems()[1].isActive).toBe(false);
        expect(service.getActiveMenuItemIds()).toEqual([]);
    });

    test('handles thrown errors and invalid results without committing activation', () => {
        firstChanged.mockImplementation(() => { throw new Error('Cannot open'); });
        expect(service.setActive(FIRST_ID)).toBe(MenuItemActivationResult.FAILED);
        firstChanged.mockReturnValue(undefined);
        expect(service.setActive(FIRST_ID)).toBe(MenuItemActivationResult.FAILED);
        expect(service.getMenuItems()[0].isActive).toBe(false);
        expect(service.getActiveMenuItemIds()).toEqual([]);
    });

    test('tracks every pinned item and removes only the explicitly closed item', () => {
        const first = new MenuItem({ id: FIRST_ID, name: 'First', keepActive: true });
        const second = new MenuItem({ id: SECOND_ID, name: 'Second', keepActive: true });
        const third = new MenuItem({ id: UNKNOWN_ID, name: 'Third' });
        service.addMenuItem(first);
        service.addMenuItem(second);
        service.addMenuItem(third);
        service.setActive(FIRST_ID);
        service.setActive(SECOND_ID);
        service.setActive(UNKNOWN_ID);
        expect(service.getActiveMenuItems()).toEqual([first, second, third]);
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID, SECOND_ID, UNKNOWN_ID]);
        service.setActive(FIRST_ID);
        expect(service.getActiveMenuItems()).toEqual([first, second, third]);
        service.setActive(SECOND_ID, false);
        expect(service.getActiveMenuItems()).toEqual([first, third]);
        service.removeMenuItem(FIRST_ID);
        expect(service.getActiveMenuItems()).toEqual([third]);
    });

    test('uses the active array for closing and removal even if an item flag was changed', () => {
        service.setActive(FIRST_ID);
        const item = service.getActiveMenuItems()[0];
        item.isActive = false;
        firstChanged.mockClear();
        expect(service.setActive(FIRST_ID)).toBe(MenuItemActivationResult.OK);
        expect(firstChanged).not.toHaveBeenCalled();
        expect(item.isActive).toBe(true);
        item.isActive = false;
        service.removeMenuItem(FIRST_ID);
        expect(firstChanged).toHaveBeenCalledWith(false);
        expect(service.getActiveMenuItems()).toEqual([]);
    });

    test('does not close inactive items based on their own flags and returns an array copy', () => {
        service.getMenuItems()[1].isActive = true;
        service.setActive(FIRST_ID);
        expect(secondChanged).not.toHaveBeenCalled();
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID]);
        expect(service.getMenuItems()[1].isActive).toBe(false);
        const activeItems = service.getActiveMenuItems();
        activeItems.length = 0;
        expect(service.getActiveMenuItemIds()).toEqual([FIRST_ID]);
    });

    test('replaces the item reference in the active array without retaining the disposed item', () => {
        service.setActive(FIRST_ID);
        const original = service.getActiveMenuItems()[0];
        const replacement = new MenuItem({ id: FIRST_ID, name: 'Replacement' });
        service.addMenuItem(replacement);
        expect(service.getActiveMenuItems()).toEqual([replacement]);
        expect(service.getActiveMenuItems()).not.toContain(original);
    });
});