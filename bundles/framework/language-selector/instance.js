import React from 'react';
import ReactDOM from 'react-dom';
import { LanguageChanger } from './components/LanguageChanger';

const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

Oskari.clazz.defineES('Oskari.bundle.language-selector.instance',
    class LanguageSelectorBundle extends BasicBundle {
        constructor () {
            super();
            this.__name = 'language-selector';
        }
        _startImpl () {
            const root = document.getElementById('language-selector-root');
            if (!root) {
                return;
            }
            ReactDOM.render(<LanguageChanger />, root);
        }
    }
);
