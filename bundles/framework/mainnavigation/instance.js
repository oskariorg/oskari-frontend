import React from 'react';
import { createRoot } from 'react-dom/client';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { ThemeProvider } from 'oskari-ui/util';
import { MainNavigationService } from './service/MainNavigationService';

const DEMO_BUNDLE_IDS = [
    'mainnavigation-testbundle',
    'maplayers',
    'testbundle2',
    'testbundle3',
    'testbundle4',
    'testbundle5'
];

export class MainNavigationBundleIstance extends BasicBundleInstance {
    constructor () {
        super();
        this.containerId = 'mainnavigation';
        this.containerClass = 'oskari-mainnavigation-container';
        this.parentSelector = '#maptools';
        this.insertAfterSelector = '#pti_disclaimer';
        this.mockContent = '<div><h3>Navigationbar</h1></div>';
        this.container = null;
        this.root = null;
        this.mainNavigationService = null;
        this.onMenuItemActiveChange = (id, isActive) => this.mainNavigationService.setActive(id, isActive);
    }

    start (sandbox) {
        // registers to sandbox and saves the sandbox for getSandbox()
        super.start(sandbox);
        sandbox.registerService(new MainNavigationService());
        this.mainNavigationService = sandbox.getService('Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService');
        this.mainNavigationService.addListener(this);
        this.attachToExistingDom();
        this.render();
        DEMO_BUNDLE_IDS.forEach((bundlename) => {
            Oskari.app.playBundle({
                bundlename
            }, {});
        });
    }

    getTargetParent (parentSelector = this.parentSelector) {
        if (parentSelector) {
            const element = document.querySelector(parentSelector);
            if (element) {
                return element;
            }
        }
        return Oskari.dom?.getRootEl?.() || document.body;
    }

    attachToExistingDom ({
        parentSelector = this.parentSelector,
        insertAfterSelector = this.insertAfterSelector,
        containerId = this.containerId,
        className = this.containerClass
    } = {}) {
        const parent = this.getTargetParent(parentSelector);
        let container = document.getElementById(containerId);

        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.innerHTML = this.mockContent;
        }

        container.classList.add(className);

        if (!container.parentElement) {
            const referenceElement = insertAfterSelector ? parent.querySelector(insertAfterSelector) : null;
            if (referenceElement && referenceElement.nextElementSibling) {
                parent.insertBefore(container, referenceElement.nextElementSibling);
            } else if (referenceElement) {
                parent.appendChild(container);
            } else if (parent.firstChild) {
                parent.insertBefore(container, parent.firstChild);
            } else {
                parent.appendChild(container);
            }
        }

        this.container = container;
        this.containerId = containerId;
        this.containerClass = className;

        if (!this.root) {
            this.root = createRoot(container);
        }

        return container;
    }

    render () {
        const container = this.getContainer();
        if (!container) {
            return null;
        }
        if (!this.root) {
            this.root = createRoot(container);
        }
        this.root.render(<ThemeProvider>
            <nav className={this.containerClass}>
                <ul>
                    {this.mainNavigationService.getMenuItems()
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
        this.mainNavigationService.removeListener(this);
        this.mainNavigationService.getMenuItems().forEach((item) => this.mainNavigationService.removeMenuItem(item.id));
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        this.container = null;
        this.getSandbox().unregisterService(this.mainNavigationService.getQName());
        this.mainNavigationService = null;
        super.stop();
    }
}