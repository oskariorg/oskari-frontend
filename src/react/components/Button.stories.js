import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './Button';
import { StyledButton } from './StyledButton';

const defaultText = 'My text';
const defaultProps = {};
storiesOf('Button', module)
    .add('with text', () => (
        <Button {...defaultProps} >{defaultText}</Button>
    ))
    .add('of type primary', () => {
        const storyProps = {
            ...defaultProps,
            type: 'primary'
        };
        return (
            <Button {...storyProps}>{defaultText}</Button>
        );
    })
    .add('styled', () => {
        return (<StyledButton {...defaultProps}>{defaultText}</StyledButton>);
    });
