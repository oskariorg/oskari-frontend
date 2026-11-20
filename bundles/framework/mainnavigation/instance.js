import React from 'react';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { getReactRoot, unmountReactRoot } from 'oskari-ui/components/window';
import { ThemeProvider } from 'oskari-ui/util';
import { MainNavigationService } from './service/MainNavigationService';
import { LegacyExtensionSwitchCoordinator } from './LegacyExtensionSwitchCoordinator';

const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
const MENUBAR_CONTAINER_ID = '#menubar';

export class MainNavigationBundleIstance extends BasicBundleInstance {
    constructor () {
        super();
        this.containerId = 'mainnavigation';
        this.containerClass = 'oskari-mainnavigation-container';
        this.mockContent = '<div><h3>Navigationbar</h1></div>';
        this.container = null;
        this.mainNavigationService = null;
        this.legacyExtensionSwitchCoordinator = null;
        this.onMenuItemActiveChange = (id, isActive) => this.mainNavigationService.setActive(id, isActive);
    }

    start (sandbox) {
        // registers to sandbox and saves the sandbox for getSandbox()
        super.start(sandbox);
        this.mainNavigationService = new MainNavigationService();
        sandbox.registerService(this.mainNavigationService);
        this.legacyExtensionSwitchCoordinator = new LegacyExtensionSwitchCoordinator(this, this.mainNavigationService);
        this.legacyExtensionSwitchCoordinator.start();
        this.mainNavigationService.addListener(this);
        this.attachToExistingDom();
        this.render();
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
        this.render();
    }

    getContainer () {
        if (this.container && this.container.isConnected) {
            return this.container;
        }
        return this.attachToExistingDom();
    }

    stop () {
        this.legacyExtensionSwitchCoordinator.stop();
        this.legacyExtensionSwitchCoordinator = null;
        this.mainNavigationService.removeListener(this);
        this.mainNavigationService.getMenuItems().forEach((item) => this.mainNavigationService.removeMenuItem(item.id));
        unmountReactRoot(this.container);
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        this.container = null;
        this.getSandbox().unregisterService(MAIN_NAVIGATION_SERVICE);
        this.mainNavigationService = null;
        super.stop();
    }
}
