import React, { useEffect, useState } from 'react';
import { beforeEach, afterEach } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MenuItem } from './MenuItem';
import { MainNavigationService } from '../service/MainNavigationService';
import { MapLayersBundleInstance } from '../maplayers/instance';
import { showFlyout } from 'oskari-ui/components/window';

jest.mock('oskari-ui/BasicBundleInstance', () => ({ BasicBundleInstance: class {} }));
jest.mock('oskari-ui', () => ({ Badge: 'span' }));
jest.mock('oskari-ui/components/window', () => ({ showFlyout: jest.fn() }));

describe('MenuItem activation', () => {
    let service;
    let onActiveChange;

    beforeEach(() => {
        service = new MainNavigationService();
        onActiveChange = (id, isActive) => service.setActive(id, isActive);
        showFlyout.mockReset();
        showFlyout.mockImplementation((title, content, onClose) => ({ close: jest.fn(onClose) }));
    });

    afterEach(cleanup);

    const Navigation = () => {
        const [items, setItems] = useState(service.getMenuItems());
        useEffect(() => {
            const listener = { handleMenuItemsChanged: setItems };
            service.addListener(listener);
            return () => service.removeListener(listener);
        }, []);
        return items.map(item => item.render(onActiveChange));
    };

    test('uses a default flyout and synchronizes closing with the service', () => {
        service.addMenuItem(new MenuItem({ id: 'first', name: 'First' }));
        render(<Navigation />);
        fireEvent.click(screen.getByRole('button', { name: 'First' }));
        expect(showFlyout).toHaveBeenCalledWith('First', 'First flyout', expect.any(Function));
        expect(service.getActiveMenuItemId()).toBe('first');
        const onClose = showFlyout.mock.calls[0][2];
        act(() => onClose());
        expect(service.getActiveMenuItemId()).toBeNull();
        expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false');
    });

    test('closes the previous flyout when switching items and does not reopen on badge changes', () => {
        service.addMenuItem(new MenuItem({ id: 'first', name: 'First' }));
        service.addMenuItem(new MenuItem({ id: 'second', name: 'Second' }));
        render(<Navigation />);
        fireEvent.click(screen.getByRole('button', { name: 'First' }));
        const firstControls = showFlyout.mock.results[0].value;
        act(() => service.setBadge('first', 2));
        expect(showFlyout).toHaveBeenCalledTimes(1);
        expect(firstControls.close).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: 'Second' }));
        expect(firstControls.close).toHaveBeenCalledTimes(1);
        expect(showFlyout).toHaveBeenCalledTimes(2);
        expect(service.getActiveMenuItemId()).toBe('second');
    });

    test('uses the item callback instead of the default flyout', () => {
        const setActive = jest.fn();
        class CustomMenuItem extends MenuItem {
            setActive (isActive) {
                setActive(isActive);
            }
        }
        service.addMenuItem(new CustomMenuItem({ id: 'custom', name: 'Custom' }));
        render(<Navigation />);
        const button = screen.getByRole('button', { name: 'Custom' });
        fireEvent.keyDown(button, { key: 'Enter' });
        expect(setActive).toHaveBeenLastCalledWith(true);
        fireEvent.keyDown(button, { key: ' ' });
        expect(setActive).toHaveBeenLastCalledWith(false);
        expect(setActive).toHaveBeenCalledTimes(2);
        expect(showFlyout).not.toHaveBeenCalled();
    });

    test('closes the default flyout when the item is removed', () => {
        service.addMenuItem(new MenuItem({ id: 'first', name: 'First' }));
        render(<Navigation />);
        act(() => service.setActive('first'));
        const controls = showFlyout.mock.results[0].value;
        act(() => service.removeMenuItem('first'));
        expect(controls.close).toHaveBeenCalledTimes(1);
        expect(service.getActiveMenuItemId()).toBeNull();
        expect(screen.queryByRole('button')).toBeNull();
    });
    test('renders badge changes from the service and removes a cleared badge', () => {
        service.addMenuItem(new MenuItem({ id: 'first', name: 'First' }));
        render(<Navigation />);
        const button = screen.getByRole('button');
        act(() => service.setBadge('first', 0));
        expect(button.querySelector('[count]').getAttribute('count')).toBe('0');
        act(() => service.setBadge('first', 9));
        expect(button.querySelector('[count]').getAttribute('count')).toBe('9');
        act(() => service.setBadge('first', null));
        expect(button.querySelector('[count]')).toBeNull();
    });

    test('allows replacing badge behavior without running its default setter', () => {
        const setBadge = jest.fn();
        class CustomMenuItem extends MenuItem {
            setBadge (badge) {
                setBadge(badge);
            }
        }
        service.addMenuItem(new CustomMenuItem({ id: 'custom', name: 'Custom', badge: 2 }));
        render(<Navigation />);
        act(() => service.setBadge('custom', 9));
        expect(setBadge).toHaveBeenCalledWith(9);
        expect(service.getMenuItems()[0].badge).toBe(2);
    });

    test('runs defaults before mounting and preserves the flyout across metadata updates', () => {
        const item = service.addMenuItem(new MenuItem({ id: 'first', name: 'First' }));
        service.setActive('first');
        service.setBadge('first', 3);
        const controls = showFlyout.mock.results[0].value;
        item.update({ id: 'first', name: 'First', tooltip: 'Updated' });
        service.addMenuItem(item);
        render(<Navigation />);
        expect(showFlyout).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
        expect(service.getMenuItems()[0].badge).toBe(3);
        act(() => service.removeMenuItem('first'));
        expect(controls.close).toHaveBeenCalledTimes(1);
    });

    test('ignores an old flyout close callback after reactivation', () => {
        service.addMenuItem(new MenuItem({ id: 'first', name: 'First' }));
        render(<Navigation />);
        act(() => service.setActive('first'));
        const oldClose = showFlyout.mock.calls[0][2];
        act(() => service.setActive('first', false));
        act(() => service.setActive('first'));
        act(() => oldClose());
        expect(service.getActiveMenuItemId()).toBe('first');
        expect(service.getMenuItems()[0].isActive).toBe(true);
    });

    test('replaces an active item instance and disposes its previous flyout', () => {
        const original = new MenuItem({ id: 'first', name: 'First' });
        service.addMenuItem(original);
        render(<Navigation />);
        act(() => service.setActive('first'));
        const controls = showFlyout.mock.results[0].value;
        const replacement = new MenuItem({ id: 'first', name: 'Replacement' });
        act(() => service.addMenuItem(replacement));
        expect(controls.close).toHaveBeenCalledTimes(1);
        expect(showFlyout).toHaveBeenCalledTimes(2);
        expect(service.getActiveMenuItemId()).toBe('first');
        act(() => service.addMenuItem(replacement));
        expect(showFlyout).toHaveBeenCalledTimes(2);
        act(() => service.removeMenuItem('first'));
    });

    test('colors only the maplayers item by badge direction and retains default flyout behavior', () => {
        const bundle = new MapLayersBundleInstance();
        bundle.mainNavigationService = service;
        bundle.updateMenuItem();
        service.addMenuItem(new MenuItem({ id: 'other', name: 'Other' }));
        render(<Navigation />);
        const layersButton = screen.getByRole('button', { name: 'Map layers' });
        const otherButton = screen.getByRole('button', { name: 'Other' });
        act(() => service.setBadge(bundle.menuItemId, 3));
        expect(layersButton.style.borderColor).toBe('');
        fireEvent.click(layersButton);
        expect(showFlyout).toHaveBeenCalledTimes(1);
        act(() => service.setBadge(bundle.menuItemId, 2));
        expect(layersButton.style.borderColor).toBe('red');
        expect(otherButton.style.borderColor).toBe('');
        act(() => service.setBadge(bundle.menuItemId, 2));
        expect(layersButton.style.borderColor).toBe('red');
        act(() => service.setBadge(bundle.menuItemId, 4));
        expect(layersButton.style.borderColor).toBe('green');
        expect(showFlyout).toHaveBeenCalledTimes(1);
        const controls = showFlyout.mock.results[0].value;
        fireEvent.click(layersButton);
        expect(controls.close).toHaveBeenCalledTimes(1);
        act(() => service.setBadge(bundle.menuItemId, 0));
        expect(layersButton.style.borderColor).toBe('red');
        fireEvent.click(layersButton);
        expect(layersButton.style.borderColor).toBe('red');
        expect(showFlyout).toHaveBeenCalledTimes(2);
    });

    test('can replace rendering directly in the item settings', () => {
        service.addMenuItem(new MenuItem({
            id: 'custom',
            name: 'Custom',
            render (onActiveChange) {
                return <button key={this.id} data-testid="custom-item" onClick={() => onActiveChange(this.id, !this.isActive)}>{this.name}</button>;
            }
        }));
        render(<Navigation />);
        expect(screen.getByTestId('custom-item')).toBe(screen.getByRole('button'));
        fireEvent.click(screen.getByRole('button'));
        expect(showFlyout).toHaveBeenCalledWith('Custom', 'Custom flyout', expect.any(Function));
    });

    test('replaces methods directly without changing the settings prototype or other items', () => {
        const customActive = jest.fn();
        const customBadge = jest.fn();
        const options = {
            id: 'inline',
            name: 'Inline',
            setActive (isActive) {
                this.isActive = isActive;
                customActive(isActive);
            },
            setBadge (badge) {
                const nextBadge = badge * 2;
                if (this.badge === nextBadge) {
                    return false;
                }
                this.badge = nextBadge;
                customBadge(badge);
                this.onChange?.();
                return true;
            }
        };
        const prototype = Object.getPrototypeOf(options);
        const item = new MenuItem(options);
        expect(Object.getPrototypeOf(options)).toBe(prototype);
        expect(item.setActive).toBe(options.setActive);
        expect(item.setBadge).toBe(options.setBadge);
        const other = new MenuItem({ id: 'other', name: 'Other' });
        service.addMenuItem(item);
        service.addMenuItem(other);
        render(<Navigation />);
        fireEvent.click(screen.getByRole('button', { name: 'Inline' }));
        expect(customActive).toHaveBeenCalledWith(true);
        expect(showFlyout).not.toHaveBeenCalled();
        act(() => service.setBadge('inline', 3));
        expect(customBadge).toHaveBeenCalledWith(3);
        expect(item.badge).toBe(6);
        expect(other.badge).toBeUndefined();
        expect(screen.getByRole('button', { name: 'Inline' }).querySelector('[count]').getAttribute('count')).toBe('6');
        fireEvent.click(screen.getByRole('button', { name: 'Other' }));
        expect(customActive).toHaveBeenLastCalledWith(false);
    });
});
