import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './Button';

const defaultProps = {
  text: "My text"
}
storiesOf('Button', module)
  .add('with text', () => (
    <Button {... defaultProps} />
  ))
  .add('of type primary', () => {
    const storyProps = {
      ...defaultProps,
      type: 'primary'
    }
    return (
    <Button {... storyProps} />
  )});   
  