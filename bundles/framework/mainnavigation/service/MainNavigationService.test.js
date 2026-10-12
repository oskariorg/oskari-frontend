import { beforeEach } from '@jest/globals';
import { MainNavigationService } from './MainNavigationService';
import { MenuItem } from '../component/MenuItem';

jest.mock('oskari-ui', () => ({ Badge: 'span' }));
jest.mock('oskari-ui/components/window', () => ({ showFlyout: jest.fn(() => ({ close: jest.fn() })) }));

const FIRST_ID = 'first-item';
const SECOND_ID = 'second-item';
const UNKNOWN_ID = 'unknown-item';

class CustomMenuItem extends MenuItem {
    constructor (options, handleActiveChange) {
        super(options);
        this.handleActiveChange = handleActiveChange;
    }

    setActive (isActive) {
        this.handleActiveChange(isActive);
    }
}

describe('MainNavigationService', () => {
    let service;
    let firstChanged;
    let secondChanged;

    beforeEach(() => {
        service = new MainNavigationService();
        firstChanged = jest.fn();
        secondChanged = jest.fn();
        service.addMenuItem(new CustomMenuItem({ id: FIRST_ID }, firstChanged));
        service.addMenuItem(new CustomMenuItem({ id: SECOND_ID }, secondChanged));
    });

    test('activates only one item and notifies the previous bundle first', () => {
        service.setActive(FIRST_ID);
        service.setActive(SECOND_ID);

        expect(service.getActiveMenuItemId()).toBe(SECOND_ID);
        expect(service.getMenuItems()
            .map((item) => item.isActive)).toEqual([false, true]);
        expect(firstChanged.mock.calls.map(([value]) => [value])).toEqual([[true], [false]]);
        expect(secondChanged.mock.calls.map(([value]) => [value])).toEqual([[true]]);
        expect(firstChanged.mock.invocationCallOrder[1]).toBeLessThan(secondChanged.mock.invocationCallOrder[0]);
    });

    test('ignores the old flyout close callback when switching items', () => {
        firstChanged.mockImplementation((isActive) => {
            if (!isActive) {
                service.setActive(FIRST_ID, false);
            }
        });
        service.setActive(FIRST_ID);
        service.setActive(SECOND_ID);

        expect(service.getActiveMenuItemId()).toBe(SECOND_ID);
        expect(secondChanged).toHaveBeenCalledWith(true);
    });

    test('clears the active item when its flyout closes', () => {
        service.setActive(FIRST_ID);
        service.setActive(FIRST_ID, false);

        expect(service.getActiveMenuItemId()).toBeNull();
        expect(service.getMenuItems()
            .every((item) => !item.isActive)).toBe(true);
        expect(firstChanged).toHaveBeenLastCalledWith(false);
    });

    test('removing the active item deactivates its bundle', () => {
        service.setActive(FIRST_ID);
        service.removeMenuItem(FIRST_ID);

        expect(service.getActiveMenuItemId()).toBeNull();
        expect(firstChanged).toHaveBeenLastCalledWith(false);
        expect(service.getMenuItems()
            .map((item) => item.id)).toEqual([SECOND_ID]);
    });

    test('rejects unknown items and repeated activation', () => {
        expect(service.setActive(UNKNOWN_ID)).toBe(false);
        expect(service.setActive(FIRST_ID)).toBe(true);
        expect(service.setActive(FIRST_ID)).toBe(false);
        expect(firstChanged).toHaveBeenCalledTimes(1);
        expect(service.getActiveMenuItemId()).toBe(FIRST_ID);
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
        expect(service.getActiveMenuItemId()).toBe(FIRST_ID);
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
    test('lets a badge override delegate unchanged-value handling to the default setter', () => {
        const setBadge = jest.fn();
        class BadgeMenuItem extends CustomMenuItem {
            setBadge (badge) {
                setBadge(badge);
                if (this.badge === badge) {
                    return false;
                }
                this.badge = badge;
                this.onChange?.();
                return true;
            }
        }
        service.addMenuItem(new BadgeMenuItem({ id: FIRST_ID }, firstChanged));
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
        expect(service.getActiveMenuItemId()).toBe(FIRST_ID);
    });

    test('registers the original subclass instance and keeps its methods on metadata updates', () => {
        class BadgeMenuItem extends MenuItem {
            setBadge (badge) {
                this.badge = badge * 2;
                this.onChange?.();
                return true;
            }
        }
        const item = new BadgeMenuItem({ id: UNKNOWN_ID, name: 'Custom' });
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
            setActive: jest.fn(),
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
});