import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './Button';
import {StyledButton} from './StyledButton';

const defaultProps = {
    text: 'My text'
};
storiesOf('Button', module)
    .add('with text', () => (
        <Button {...defaultProps} />
    ))
    .add('of type primary', () => {
        const storyProps = {
            ...defaultProps,
            type: 'primary'
        };
        return (
            <Button {...storyProps} />
        );
    })
    .add('styled', () => {
        return (<StyledButton {...defaultProps} />);
    });
