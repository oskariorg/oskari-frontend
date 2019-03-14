import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerList } from './LayerList';
import { LayerGroup } from '../../../layerselector2/model/LayerGroup.class';

const defaultProps = {
    groups: [
        new LayerGroup('Background layers'),
        new LayerGroup('Data layers'),
        new LayerGroup('User layers')
    ]
};

storiesOf('LayerList', module)

    .add('Empty', () => {
        const storyProps = {
            ...defaultProps,
            groups: undefined
        };
        return (
            <LayerList {...storyProps} />
        );
    })
    .add('With groups', () => {
        const storyProps = {
            ...defaultProps
        };
        return (
            <LayerList {...storyProps} />
        );
    })
    .add('With filter keyword "Base"', () => {
        const storyProps = {
            ...defaultProps,
            filterKeyword: 'Base'
        };
        return (
            <LayerList {...storyProps} />
        );
    });
