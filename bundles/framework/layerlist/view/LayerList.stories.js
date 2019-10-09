import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerList } from './LayerList';

const defaultProps = {};

storiesOf('LayerList', module)
    .add('Default props', () => (
        <LayerList {... defaultProps} />
    ))
    .add('With organizations', () => (
        <LayerList {... defaultProps} showOrganizations />
    ));
