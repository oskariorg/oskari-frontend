import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerTypeSelection } from './LayerTypeSelection';

const defaultProps = {
    types: ['WFS', 'WMS', 'WMTS']
};
storiesOf('LayerTypeSelection', module)
    .add('with text', () => {
        const storyProps = {
            ...defaultProps,
            text: 'Select layer type:'
        };
        return (
            <LayerTypeSelection {... storyProps} />
        );
    })
    .add('without text', () => (
        <LayerTypeSelection {... defaultProps} />
    ));
