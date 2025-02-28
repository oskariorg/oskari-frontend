import React from 'react';
import ReactDOM from 'react-dom';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { LanguageChanger } from './components/LanguageChanger';

export class LanguageSelector extends BasicBundleInstance {
    start (sandbox) {
        super.start(sandbox);
        const root = document.getElementById('language-selector-root');
        if (!root) {
            return;
        }
        ReactDOM.render(<LanguageChanger />, root);
    }
};
