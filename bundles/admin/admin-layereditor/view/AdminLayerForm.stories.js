import React from 'react';
import { storiesOf } from '@storybook/react';
import { AdminLayerForm } from './AdminLayerForm';

const defaultProps = {};
storiesOf('AdminLayerForm', module)
    .add('layout', () => (
        <AdminLayerForm {... defaultProps} />
    ));
