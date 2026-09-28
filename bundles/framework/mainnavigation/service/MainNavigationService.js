export class MainNavigationService {
    constructor () {
        this.menuItems = [];
        this.listeners = [];
    }

    getQName () {
        return 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
    }

    addMenuItem (menuItem) {
        if (!menuItem || typeof menuItem !== 'object' || !menuItem.id) {
            return null;
        }

        const existingIndex = this.menuItems.findIndex((item) => item.id === menuItem.id);

        if (existingIndex === -1) {
            this.menuItems.push(menuItem);
        } else {
            this.menuItems[existingIndex] = menuItem;
        }

        this.notifyListeners();
        return menuItem;
    }

    getMenuItems () {
        return this.menuItems.slice();
    }

    removeMenuItem (id) {
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
