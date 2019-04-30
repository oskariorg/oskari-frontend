import React from 'react';
import { storiesOf } from '@storybook/react';
import '../../../../../src/global';
import '../../resources/locale/en';
import '../../resources/locale/fi';
import '../../resources/locale/sv';
import '../../resources/locale/fr';
import { LanguageChanger } from '../LanguageChanger';

Oskari.setSupportedLocales(['en_US', 'fi_FI', 'sv_SE', 'fr_FR']);
Oskari.setLang('fi');
storiesOf('LanguageChanger', module)
    .add('English', () => {
        Oskari.setLang('en');
        return <LanguageChanger />;
    })
    .add('Finnish', () => {
        Oskari.setLang('fi');
        return <LanguageChanger />;
    })
    .add('Swedish', () => {
        Oskari.setLang('sv');
        return <LanguageChanger />;
    })
    .add('French', () => {
        Oskari.setLang('fr');
        return <LanguageChanger />;
    });
