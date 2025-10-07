import React from 'react';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { LanguageChanger } from './components/LanguageChanger';
import { createRoot } from 'react-dom/client';

export class LanguageSelector extends BasicBundleInstance {
    constructor () {
        super();
        this._reactRoot = null;
    }

    getReactRoot (element) {
        if (!this._reactRoot) {
            this._reactRoot = createRoot(element);
        }
        return this._reactRoot;
    }

    start (sandbox) {
        super.start(sandbox);
        const container = document.getElementById('language-selector-root');
        if (!container) {
            return;
        }
        this.getReactRoot(container).render(<LanguageChanger />);
    }
};
