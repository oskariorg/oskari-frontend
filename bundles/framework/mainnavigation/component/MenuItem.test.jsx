import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MenuItem } from './MenuItem';

const MENU_ITEM_ID = 'test-item';
const MENU_ITEM_NAME = 'Test item';

describe('MenuItem', () => {
    test('renders inactive and active menu item states using a div', () => {
        const { rerender } = render(<MenuItem id={MENU_ITEM_ID} name={MENU_ITEM_NAME} />);
        const menuItem = screen.getByRole('button');
        expect(menuItem.tagName).toBe('DIV');
        expect(menuItem).toHaveAttribute('tabindex', '0');
        expect(menuItem).toHaveAttribute('aria-pressed', 'false');
        expect(getComputedStyle(menuItem).color).toBe('rgb(255, 255, 255)');
        expect(getComputedStyle(menuItem).fontSize).toBe('0.875rem');
        expect(getComputedStyle(screen.getByText(MENU_ITEM_NAME)).fontSize).toBe('0.785714em');

        rerender(<MenuItem id={MENU_ITEM_ID} name={MENU_ITEM_NAME} isActive />);
        expect(menuItem).toHaveAttribute('aria-pressed', 'true');
        expect(getComputedStyle(menuItem).color).toBe('rgb(51, 52, 56)');
        expect(getComputedStyle(menuItem).backgroundColor).toBe('rgb(255, 255, 255)');
    });

    test('preserves the click callback and renders a zero badge', () => {
        const active = jest.fn();
        render(<MenuItem id={MENU_ITEM_ID} name={MENU_ITEM_NAME} active={active} badge={0} />);
        fireEvent.click(screen.getByRole('button'));
        expect(active).toHaveBeenCalledWith(MENU_ITEM_ID);
        const badge = screen.getByText('0');
        expect(badge).toBeInTheDocument();
        expect(getComputedStyle(badge).backgroundColor).toBe('rgb(153, 153, 153)');
        expect(getComputedStyle(badge).color).toBe('rgb(255, 255, 255)');
        expect(getComputedStyle(badge).borderRadius).toBe('0.818182em');
    });

    test.each(['Enter', ' '])('activates the menu item with %p', (key) => {
        const active = jest.fn();
        render(<MenuItem id={MENU_ITEM_ID} name={MENU_ITEM_NAME} active={active} />);
        fireEvent.keyDown(screen.getByRole('button'), { key });
        expect(active).toHaveBeenCalledWith(MENU_ITEM_ID);
        expect(active).toHaveBeenCalledTimes(1);
    });
});