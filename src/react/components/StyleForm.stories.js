import React from 'react';
import { storiesOf } from '@storybook/react';
import { StyleForm } from './StyleForm';

const placeHolderIcon = () => {
    return(<svg width="32" height="30" x="0" y="0"><path fill="#000000" stroke="#000000" d="m 17.662202,6.161625 c -2.460938,-0.46875 -4.101563,-0.234375 -4.921875,0.585937 -0.234375,0.234376 -0.234375,0.468751 -0.117188,0.820313 0.234375,0.585938 0.585938,1.171875 1.054688,2.109375 0.46875,0.9375 0.703125,1.523438 0.820312,1.757813 -0.351562,0.351562 -1.054687,1.054687 -2.109375,1.992187 -1.523437,1.40625 -1.523437,1.40625 -2.226562,2.109375 -0.8203126,0.820312 -0.117188,1.757812 2.109375,2.8125 0.9375,0.46875 1.992187,0.820312 3.046875,0.9375 2.695312,0.585937 4.570312,0.351562 5.742187,-0.585938 0.351563,-0.351562 0.46875,-0.703125 0.351563,-1.054687 0,0 -1.054688,-2.109375 -1.054688,-2.109375 -0.46875,-1.054688 -0.46875,-1.171875 -0.9375,-2.109375 -0.351562,-0.703125 -0.46875,-1.054687 -0.585937,-1.289062 0.234375,-0.234375 0.234375,-0.351563 1.289062,-1.289063 1.054688,-0.9375 1.054688,-0.9375 1.757813,-1.640625 0.703125,-0.585937 0.117187,-1.40625 -1.757813,-2.34375 -0.820312,-0.351563 -1.640625,-0.585938 -2.460937,-0.703125 0,0 0,0 0,0 M 14.615327,26.0835 c 0,0 1.054687,-5.625 1.054687,-5.625 0,0 -1.40625,-0.234375 -1.40625,-0.234375 0,0 -1.054687,5.859375 -1.054687,5.859375 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0"></path></svg>);
}

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

const radioTestOptions = [
    {
        value: 'dot',
        icon: placeHolderIcon
    },
    {
        value: 'line',
        icon: placeHolderIcon
    },
    {
        value: 'area',
        icon: placeHolderIcon
    }
];


storiesOf('StyleForm', module)
    .add('Default', () => (
        <StyleForm icons={ testOptions } styleList={ styleList } styleOptions={ radioTestOptions } />
    ));
