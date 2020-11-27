import React from 'react';
import { storiesOf } from '@storybook/react';
import { StyleForm } from './StyleForm';

const testOptions = [
    {
        value: 'testi tyyli',
        format: 'point',
        dotColor: '#cc99ff',
        dotFilLColor: '#0098dd',
        dotIcon: 'line',
        dotSizeControl: 2
    },
    {
        value: 'tyyli 2',
        format: 'line',
        lineColor: '#99ccff',
        strokeWidth: 5
    },
    {
        value: 'storybooktyyli',
        format: 'area',
        areaLineColor: '#ff99dd',
        areaFillColor: '#ffccdd'
    }
];

const styleList = [
    {
        value: 'testi tyyli',
        format: 'point',
        dotColor: '#cc99ff',
        dotFilLColor: '#0098dd',
        dotIcon: 'line',
        dotSizeControl: 2
    },
    {
        value: 'tyyli 2',
        format: 'line',
        lineColor: '#99ccff',
        strokeWidth: 5
    },
    {
        value: 'storybooktyyli',
        format: 'area',
        areaLineColor: '#ff99dd',
        areaFillColor: '#ffccdd'
    }
];


storiesOf('StyleForm', module)
    .add('Default', () => (
        <StyleForm icons={ testOptions } styleList={ styleList } />
    ));
