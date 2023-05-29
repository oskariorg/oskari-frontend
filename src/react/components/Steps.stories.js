import React from 'react';
import { storiesOf } from '@storybook/react';
import { Steps, Step } from 'oskari-ui';

const defaultProps = {};
storiesOf('Steps', module)
    .add('Step 1', () => (
        <Steps
            {...defaultProps}
            items={[
                {
                    title: "Layer type"
                },
                {
                    title: "URL"
                },
                {
                    title: "Details"
                }
            ]}
        />
    ))
    .add('Step 2', () => {
        const storyProps = {
            ...defaultProps,
            current: 1
        };
        return (
            <Steps
                {...storyProps}
                items={[
                    {
                        title: "Layer type"
                    },
                    {
                        title: "URL"
                    },
                    {
                        title: "Details"
                    }
                ]}
            />
        );
    });
