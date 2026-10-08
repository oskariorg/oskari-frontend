export class MainNavigationService {
    constructor () {
        this.menuItems = [];
        this.listeners = [];
        this.activeMenuItemId = null;
    }

    getQName () {
        return 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
    }

    addMenuItem (menuItem) {
        if (!menuItem || typeof menuItem !== 'object' || !menuItem.id) {
            return null;
        }

        const existingIndex = this.menuItems.findIndex((item) => item.id === menuItem.id);
        const item = {
            ...menuItem,
            isActive: menuItem.id === this.activeMenuItemId
        };

        if (existingIndex === -1) {
            this.menuItems.push(item);
        } else {
            this.menuItems[existingIndex] = item;
        }

        this.notifyListeners();
        return item;
    }

    getMenuItems () {
        return this.menuItems.map((item) => ({ ...item }));
    }

    getActiveMenuItemId () {
        return this.activeMenuItemId;
    }

    setActive (id, isActive = true) {
        const nextItem = this.menuItems.find((item) => item.id === id);
        if (!nextItem || (!isActive && this.activeMenuItemId !== id)) {
            return false;
        }

        const nextId = isActive ? id : null;
        if (this.activeMenuItemId === nextId) {
            return false;
        }

        const previousItem = this.menuItems.find((item) => item.id === this.activeMenuItemId);
        this.activeMenuItemId = nextId;
        this.menuItems.forEach((item) => {
            item.isActive = item.id === nextId;
        });

        if (typeof previousItem?.setActive === 'function') {
            previousItem.setActive(false);
        }
        if (isActive && this.activeMenuItemId === id && typeof nextItem.setActive === 'function') {
            nextItem.setActive(true);
        }
        this.notifyListeners();
        return true;
    }

    removeMenuItem (id) {
        if (this.activeMenuItemId === id) {
            this.setActive(id, false);
        }
        this.menuItems = this.menuItems.filter((item) => item.id !== id);
        this.notifyListeners();
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
