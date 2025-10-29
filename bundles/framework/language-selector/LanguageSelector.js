import React from 'react';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { LanguageChanger } from './components/LanguageChanger';
import { getReactRoot } from 'oskari-ui/components/window';


export class LanguageSelector extends BasicBundleInstance {
    constructor () {
        super();
    }

    start (sandbox) {
        super.start(sandbox);
        const container = document.getElementById('language-selector-root');
        if (!container) {
            return;
        }
        getReactRoot(container).render(<LanguageChanger />);
    }
};
