import { MenuItemActivationResult } from '../component/MenuItemActivationResult';

const MENU_ITEM_METHODS = ['connect', 'render', 'setActive', 'setBadge', 'dispose'];

export class MainNavigationService {
    constructor () {
        this.menuItems = [];
        this.listeners = [];
        this.activeMenuItems = [];
        this.activationInProgress = false;
    }

    getQName () {
        return 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
    }

    addMenuItem (menuItem) {
        if (!menuItem || typeof menuItem !== 'object' || !menuItem.id ||
            !MENU_ITEM_METHODS.every((method) => typeof menuItem[method] === 'function')) {
            return null;
        }

        const existingIndex = this.menuItems.findIndex((item) => item.id === menuItem.id);
        const existingItem = this.menuItems[existingIndex];
        const item = menuItem;
        const replacing = existingItem && existingItem !== item;
        const wasActive = this.activeMenuItems.includes(existingItem);
        if (replacing) {
            if (wasActive && this.setActive(existingItem.id, false) !== MenuItemActivationResult.OK) {
                return null;
            }
            existingItem.dispose();
        }
        item.isActive = this.activeMenuItems.includes(item);
        item.connect(
            () => {
                if (this.menuItems.includes(item)) {
                    this.notifyListeners();
                }
            },
            (id) => {
                if (this.menuItems.includes(item)) {
                    this.setActive(id, false);
                }
            }
        );
        if (existingIndex === -1) {
            this.menuItems.push(item);
        } else {
            this.menuItems[existingIndex] = item;
        }
        if (replacing && wasActive) {
            this.setActive(item.id, true);
        }

        this.notifyListeners();
        return item;
    }

    getMenuItems () {
        this.menuItems.forEach(item => {
            item.isActive = this.activeMenuItems.includes(item);
        });
        return [...this.menuItems];
    }

    getActiveMenuItems () {
        return [...this.activeMenuItems];
    }

    getActiveMenuItemIds () {
        return this.activeMenuItems.map(item => item.id);
    }

    setBadge (id, badge) {
        const item = this.menuItems.find((menuItem) => menuItem.id === id);
        return item ? item.setBadge(badge) : false;
    }

    setActive (id, isActive = true) {
        const nextItem = this.menuItems.find((item) => item.id === id);
        if (!nextItem || this.activationInProgress) {
            return MenuItemActivationResult.FAILED;
        }
        const wasActive = this.activeMenuItems.includes(nextItem);
        nextItem.isActive = wasActive;
        if (wasActive === isActive) {
            return MenuItemActivationResult.OK;
        }
        const previousActiveItems = [...this.activeMenuItems];
        this.activationInProgress = true;
        try {
            if (isActive) {
                for (const item of [...this.activeMenuItems]) {
                    if (item === nextItem) {
                        continue;
                    }
                    const result = this.applyActive(item, false, { switching: true });
                    if (result !== MenuItemActivationResult.OK && result !== MenuItemActivationResult.KEEP_OPEN) {
                        return result;
                    }
                }
            }
            return this.applyActive(nextItem, isActive);
        } finally {
            this.activationInProgress = false;
            if (previousActiveItems.length !== this.activeMenuItems.length ||
                previousActiveItems.some((item, index) => item !== this.activeMenuItems[index])) {
                this.notifyListeners();
            }
        }
    }

    applyActive (item, isActive, context) {
        const wasActive = this.activeMenuItems.includes(item);
        item.isActive = wasActive;
        let result;
        try {
            result = context ? item.setActive(isActive, context) : item.setActive(isActive);
        } catch (error) {
            result = MenuItemActivationResult.FAILED;
        }
        if (result === MenuItemActivationResult.OK) {
            if (isActive && !wasActive) {
                this.activeMenuItems.push(item);
            } else if (!isActive) {
                this.activeMenuItems = this.activeMenuItems.filter(activeItem => activeItem !== item);
            }
            item.isActive = isActive;
        } else {
            item.isActive = wasActive;
            if (result === MenuItemActivationResult.KEEP_OPEN && (!context?.switching || isActive || !wasActive)) {
                return MenuItemActivationResult.FAILED;
            }
        }
        return Object.values(MenuItemActivationResult).includes(result) ? result : MenuItemActivationResult.FAILED;
    }

    removeMenuItem (id) {
        const item = this.menuItems.find(item => item.id === id);
        if (this.activeMenuItems.includes(item)) {
            const result = this.setActive(id, false);
            if (result !== MenuItemActivationResult.OK) {
                return result;
            }
        }
        this.menuItems.find((item) => item.id === id)?.dispose();
        this.menuItems = this.menuItems.filter((item) => item.id !== id);
        this.notifyListeners();
        return MenuItemActivationResult.OK;
    }

    addListener (listener) {
        if (!listener || typeof listener.handleMenuItemsChanged !== 'function') {
            return;
        }

        this.listeners.push(listener);
    }

    removeListener (listener) {
        this.listeners = this.listeners.filter((currentListener) => currentListener !== listener);
    }

    notifyListeners () {
        const menuItems = this.getMenuItems();
        this.listeners.forEach((listener) => listener.handleMenuItemsChanged(menuItems));
    }
}
