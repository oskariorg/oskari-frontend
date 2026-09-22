import React from 'react';
import { createRoot } from 'react-dom/client';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';

export class MainNavigationBundleIstance extends BasicBundleInstance {
    constructor () {
        super();
        this.containerId = 'mainnavigation';
        this.containerClass = 'oskari-mainnavigation-container';
        this.parentSelector = '#maptools';
        this.insertAfterSelector = '#pti_disclaimer';
        this.mockContent = '<div><h3>The new main navigation</h1></div>';
        this.container = null;
        this.root = null;
    }

    start (sandbox) {
        // registers to sandbox and saves the sandbox for getSandbox()
        super.start(sandbox);
        this.attachToExistingDom();
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

    render (content) {
        const container = this.getContainer();
        if (!container) {
            return null;
        }
        if (!this.root) {
            this.root = createRoot(container);
        }
        this.root.render(<>{content}</>);
        return container;
    }

    getContainer () {
        if (this.container && this.container.isConnected) {
            return this.container;
        }
        return this.attachToExistingDom();
    }

    stop () {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        this.container = null;
        super.stop();
    }
}