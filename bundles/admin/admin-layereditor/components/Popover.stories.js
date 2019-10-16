import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './Button';
import { Popover } from './Popover';

const defaultText = 'My text';
const defaultProps = {};
storiesOf('Popover', module)
    .add('Hover from button', () => (
        <Popover content="content" title="title" placement="rightBottom" >
            <Button {...defaultProps} >{defaultText}</Button>
        </Popover>
    ));
