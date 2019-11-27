import React from 'react';
import { storiesOf } from '@storybook/react';
import { LocalizationComponent } from './LocalizationComponent';

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
        title: 'Title',
        subtitle: 'Subtitle'
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
    }
};

storiesOf('LocalizationComponent', module)
    .add('with input elements', () => (
        <LocalizationComponent languages={['fi', 'sv', 'en']} value={value} labels={labels} onChange={console.log}>
            <input name="title"/>
            <input name="subtitle"/>
        </LocalizationComponent>
    ));
