import React from 'react';
import { storiesOf } from '@storybook/react';
import { LocalizationComponent } from './LocalizationComponent';
import { TextInput } from 'oskari-ui';
import styled from 'styled-components';

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

const Label = styled('div')`
    color: red;
    font-weight: bold;
`;

storiesOf('LocalizationComponent', module)
    .add('TextInputs', () => (
        <LocalizationComponent languages={['fi', 'sv', 'en']} value={value} labels={labels} onChange={console.log}>
            <TextInput name="title"/>
            <TextInput name="subtitle"/>
        </LocalizationComponent>
    ))
    .add('Customized Label', () => (
        <LocalizationComponent languages={['fi', 'sv', 'en']} value={value} labels={labels} LabelComponent={Label} onChange={console.log}>
            <TextInput name="title"/>
            <TextInput name="subtitle"/>
        </LocalizationComponent>
    ))
    .add('with inline content', () => (
        <LocalizationComponent languages={['fi', 'sv', 'en']} value={value} labels={labels} onChange={console.log}>
            <input name="title"/>
            followed by a&nbsp;
            <input name="subtitle"/>
            <br/>
        </LocalizationComponent>
    ));
