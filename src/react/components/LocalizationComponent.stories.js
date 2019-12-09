import React from 'react';
import { storiesOf } from '@storybook/react';
import { LocalizationComponent } from './LocalizationComponent';
import { TextInput } from 'oskari-ui';
import styled from 'styled-components';

import '../../global';
import '../../../bundles/framework/oskariui/resources/locale/fi';
import '../../../bundles/framework/oskariui/resources/locale/en';
import '../../../bundles/framework/oskariui/resources/locale/sv';

const labels = {
    fi: {
        title: 'Title in finnish',
        subtitle: 'Subtitle in finnish'
    },
    sv: {
        title: 'Title in swedish',
        subtitle: 'Subtitle in swedish'
    },
    en: {
        title: 'Title in english',
        subtitle: 'Subtitle in english'
    },
    it: {
        title: 'italian'
    },
    fr: {
        title: 'french'
    },
    de: {
        title: 'german'
    }
};

const value = {
    fi: {
        title: 'Otsikko',
        subtitle: 'Aliotsake'
    },
    sv: {
        title: 'Titel',
        subtitle: 'Undertitel'
    },
    en: {
        title: 'Title',
        subtitle: 'Subtitle'
    },
    it: {
        title: 'Title in italian'
    },
    fr: {
        title: 'Title in french'
    },
    de: {
        title: 'Title in german'
    }
};
const singleValue = {
    fi: 'Otsikko',
    sv: 'Titel',
    en: 'Title',
    it: 'Title in italian'
};

const Label = styled('div')`
    color: red;
    font-weight: bold;
`;

storiesOf('LocalizationComponent', module)
    .add('TextInputs in three languages', () => {
        Oskari.setSupportedLocales(['en_US', 'fi_FI', 'sv_SE']);
        Oskari.setLang('en');
        return (
            <LocalizationComponent
                languages={['en', 'fi', 'sv']}
                value={value}
                labels={labels}
                onChange={console.log}
                defaultOpen={false}
            >
                <TextInput name="title"/>
                <TextInput name="subtitle"/>
            </LocalizationComponent>
        );
    })
    .add('Customized Label', () => (
        <LocalizationComponent
            languages={Oskari.getSupportedLanguages()}
            value={value}
            labels={labels}
            onChange={console.log}
            defaultOpen
            LabelComponent={Label}
        >
            <TextInput name="title"/>
            <TextInput name="subtitle"/>
        </LocalizationComponent>
    ))
    .add('Single value', () => (
        <LocalizationComponent
            languages={Oskari.getSupportedLanguages()}
            value={singleValue}
            labels={labels}
            onChange={console.log}
            defaultOpen
            single
            LabelComponent={Label}
        >
            <TextInput/>
        </LocalizationComponent>
    ))
    .add('With inline content', () => (
        <LocalizationComponent
            languages={Oskari.getSupportedLanguages()}
            value={value}
            labels={labels}
            onChange={console.log}
            defaultOpen
        >
            <input name="title"/>
            followed by a&nbsp;
            <input name="subtitle"/>
            <br/>
        </LocalizationComponent>
    ))
    .add('Prevent collapse', () => (
        <LocalizationComponent
            languages={Oskari.getSupportedLanguages()}
            value={value}
            labels={labels}
            onChange={console.log}
            defaultOpen
        >
            <TextInput name="title"/>
            <TextInput name="subtitle"/>
        </LocalizationComponent>
    ))
    .add('More languages', () => {
        Oskari.setSupportedLocales(['en_US', 'fi_FI', 'sv_SE', 'it_IT', 'fr_FR', 'de_DE']);
        return (
            <LocalizationComponent
                languages={Oskari.getSupportedLanguages()}
                value={value}
                labels={labels}
                onChange={console.log}
                defaultOpen
            >
                <TextInput name="title"/>
                <TextInput name="subtitle"/>
            </LocalizationComponent>
        );
    })
    .add('Change language order', () => {
        Oskari.setSupportedLocales(Oskari.getSupportedLocales().reverse());
        return (
            <LocalizationComponent
                languages={Oskari.getSupportedLanguages()}
                value={value}
                labels={labels}
                onChange={console.log}
                defaultOpen
            >
                <TextInput name="title"/>
                <TextInput name="subtitle"/>
            </LocalizationComponent>
        );
    });
