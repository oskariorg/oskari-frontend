import React from 'react';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { getReactRoot, unmountReactRoot } from 'oskari-ui/components/window';
import { ThemeProvider } from 'oskari-ui/util';
import { MainNavigationService } from './service/MainNavigationService';

const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
const EXTENSION_UPDATED_EVENT = 'userinterface.ExtensionUpdatedEvent';
const DIVMANAZER_MODULE = 'userinterface.DivManazer';
const UPDATE_EXTENSION_REQUEST = 'userinterface.UpdateExtensionRequest';
const ATTACHED_EXTENSION_STATES = ['attach', 'hide'];
const ATTACH = 'attach';
const CLOSE = 'close';
const MENUBAR_CONTAINER_ID = '#menubar';

export class MainNavigationBundleIstance extends BasicBundleInstance {
    constructor () {
        super();
        this.containerId = 'mainnavigation';
        this.containerClass = 'oskari-mainnavigation-container';
        this.mockContent = '<div><h3>Navigationbar</h1></div>';
        this.container = null;
        this.mainNavigationService = null;
        this.activeMenuItemIds = new Set();
        this.onMenuItemActiveChange = (id, isActive) => this.mainNavigationService.setActive(id, isActive);
    }

    start (sandbox) {
        // registers to sandbox and saves the sandbox for getSandbox()
        super.start(sandbox);
        sandbox.registerService(new MainNavigationService());
        this.mainNavigationService = sandbox.getService(MAIN_NAVIGATION_SERVICE);
        this.mainNavigationService.addListener(this);
        this.on(EXTENSION_UPDATED_EVENT, this.handleExtensionUpdated.bind(this));
        this.attachToExistingDom();
        this.render();
    }

    handleExtensionUpdated (event) {
        if (event.getViewState() === ATTACH) {
            this.mainNavigationService.deactivateForSwitch();
        }
    }

    getTargetParent () {
        return document.querySelector(MENUBAR_CONTAINER_ID);
    }

    attachToExistingDom ({
        containerId = this.containerId,
        className = this.containerClass
    } = {}) {
        const parent = this.getTargetParent();
        if (!parent) {
            return null;
        }
        let container = document.getElementById(containerId);

        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.innerHTML = this.mockContent;
        }

        container.classList.add(className);

        if (parent.firstChild !== container) {
            parent.prepend(container);
        }

        this.container = container;
        this.containerId = containerId;
        this.containerClass = className;

        return container;
    }

    render () {
        const container = this.getContainer();
        if (!container) {
            return null;
        }
        getReactRoot(container).render(<ThemeProvider>
            <nav className={this.containerClass}>
                <ul>
                    {this.mainNavigationService.getMenuItems()
                        .sort((first, second) => {
                            const firstOrder = first.sortOrder ?? Infinity;
                            const secondOrder = second.sortOrder ?? Infinity;
                            return firstOrder === secondOrder ? 0 : firstOrder - secondOrder;
                        })
                        .map((menuItem) => (
                            <li key={menuItem.id}>
                                {menuItem.render(this.onMenuItemActiveChange)}
                            </li>
                        ))}
                </ul>
            </nav>
        </ThemeProvider>);
        return container;
    }

    handleMenuItemsChanged () {
        const activeIds = this.mainNavigationService.getActiveMenuItemIds();
        const activated = activeIds.some(id => !this.activeMenuItemIds.has(id));
        this.activeMenuItemIds = new Set(activeIds);
        if (activated) {
            this.closeAttachedExtensions();
        }
        this.render();
    }

    closeAttachedExtensions () {
        const sandbox = this.getSandbox();
        const divmanazer = sandbox.findRegisteredModuleInstance(DIVMANAZER_MODULE);
        const states = divmanazer?.getState().extensionStatesByName || {};
        Object.entries(states).forEach(([name, { state }]) => {
            if (ATTACHED_EXTENSION_STATES.includes(state)) {
                sandbox.postRequestByName(UPDATE_EXTENSION_REQUEST, [null, CLOSE, name]);
            }
        });
    }

    getContainer () {
        if (this.container && this.container.isConnected) {
            return this.container;
        }
        return this.attachToExistingDom();
    }

    stop () {
        this.off(EXTENSION_UPDATED_EVENT);
        this.mainNavigationService.removeListener(this);
        this.mainNavigationService.getMenuItems().forEach((item) => this.mainNavigationService.removeMenuItem(item.id));
        unmountReactRoot(this.container);
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        this.container = null;
        this.getSandbox().unregisterService(this.mainNavigationService.getQName());
        this.mainNavigationService = null;
        this.activeMenuItemIds.clear();
        super.stop();
    }
}
