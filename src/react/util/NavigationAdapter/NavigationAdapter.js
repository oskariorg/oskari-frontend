/* global require */
const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
const ADD_EXTENSION_REQUEST = 'userinterface.AddExtensionRequest';
const REMOVE_EXTENSION_REQUEST = 'userinterface.RemoveExtensionRequest';

/**
 * Registers a bundle with mainnavigation or falls back to a divmanazer Extension.
 * createMenuItem receives { MenuItem, MenuItemActivationResult } from mainnavigation
 * only after its service has been found. Bundles need no mainnavigation imports.
 */
export class NavigationAdapter {
    constructor (instance, { createMenuItem, onStart, onStop }) {
        this.instance = instance;
        this.createMenuItem = createMenuItem;
        this.onStart = onStart;
        this.onStop = onStop;
        this.service = null;
        this.menuItem = null;
        this.activationResults = null;
    }

    start () {
        const sandbox = this.instance.getSandbox();
        this.service = sandbox.getService(MAIN_NAVIGATION_SERVICE);
        if (this.service) {
            const { MenuItem } = require('../../../../bundles/framework/mainnavigation/component/MenuItem');
            const { MenuItemActivationResult } = require('../../../../bundles/framework/mainnavigation/component/MenuItemActivationResult');
            this.activationResults = MenuItemActivationResult;
            this.onStart?.();
            this.menuItem = this.createMenuItem({ MenuItem, MenuItemActivationResult });
            this.service.addMenuItem(this.menuItem);
        } else {
            sandbox.request(this.instance, Oskari.requestBuilder(ADD_EXTENSION_REQUEST)(this.instance));
        }
    }

    stop () {
        if (this.service) {
            const result = this.service.removeMenuItem(this.menuItem.id);
            if (result !== this.activationResults.OK) {
                return result;
            }
            this.onStop?.();
            this.menuItem = null;
            this.service = null;
            this.activationResults = null;
        } else {
            this.instance.getSandbox().request(this.instance, Oskari.requestBuilder(REMOVE_EXTENSION_REQUEST)(this.instance));
        }
    }
}
