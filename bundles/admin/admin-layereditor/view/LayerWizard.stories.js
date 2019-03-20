import React from 'react';
import { storiesOf } from '@storybook/react';
import { LayerWizard } from './LayerWizard';

const defaultProps = {};
storiesOf('LayerWizard', module)
    .add('without text', () => (
        <LayerWizard {... defaultProps} />
    ));
