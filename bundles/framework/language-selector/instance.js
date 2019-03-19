import React from 'react';
import ReactDOM from 'react-dom';
import {LanguageSelector} from './components/LanguageSelector';

const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

Oskari.clazz.defineES('Oskari.bundle.language-selector.instance',
    class LanguageSelectorBundle extends BasicBundle {
        _startImpl () {
            const root = jQuery('div#language');
            if (!root) {
                return;
            }
            ReactDOM.render(<LanguageSelector />, root.get(0));
        }
    }
);
