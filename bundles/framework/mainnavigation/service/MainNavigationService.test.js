import { beforeEach } from '@jest/globals';
import { MainNavigationService } from './MainNavigationService';

const FIRST_ID = 'first-item';
const SECOND_ID = 'second-item';
const UNKNOWN_ID = 'unknown-item';

describe('MainNavigationService active menu item', () => {
    let service;
    let firstChanged;
    let secondChanged;

    beforeEach(() => {
        service = new MainNavigationService();
        firstChanged = jest.fn();
        secondChanged = jest.fn();
        service.addMenuItem({
            id: FIRST_ID,
            setActive: firstChanged
        });
        service.addMenuItem({
            id: SECOND_ID,
            setActive: secondChanged
        });
    });

    test('activates only one item and notifies the previous bundle first', () => {
        service.setActive(FIRST_ID);
        service.setActive(SECOND_ID);

        expect(service.getActiveMenuItemId()).toBe(SECOND_ID);
        expect(service.getMenuItems()
            .map((item) => item.isActive)).toEqual([false, true]);
        expect(firstChanged.mock.calls).toEqual([[true], [false]]);
        expect(secondChanged.mock.calls).toEqual([[true]]);
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
        service.addMenuItem({
            id: FIRST_ID,
            isActive: false,
            setActive: firstChanged
        });
        service.addMenuItem({
            id: SECOND_ID,
            isActive: true,
            setActive: secondChanged
        });

        expect(service.getMenuItems()
            .map((item) => item.isActive)).toEqual([true, false]);
    });
});