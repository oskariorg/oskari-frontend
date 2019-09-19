import React from 'react';
import { storiesOf } from '@storybook/react';
import { Steps, Step } from 'oskari-ui';

const defaultProps = {};
storiesOf('Steps', module)
    .add('Step 1', () => (
        <Steps {...defaultProps}>
            <Step title="Layer type" />
            <Step title="URL" />
            <Step title="Details" />
        </Steps>
    ))
    .add('Step 2', () => {
        const storyProps = {
            ...defaultProps,
            current: 1
        };
        return (
            <Steps {...storyProps}>
                <Step title="Layer type" />
                <Step title="URL" />
                <Step title="Details" />
            </Steps>
        );
    });
