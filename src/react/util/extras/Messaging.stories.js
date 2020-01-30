import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from 'oskari-ui';
import { Messaging } from 'oskari-ui/util';

const showNotification = level => {
    Messaging.open({
        level,
        title: 'Title for the notification',
        content: 'This is the content part of the notification.'
    });
};
const showMessage = level => {
    Messaging.open({
        level,
        content: 'This is the content part of the notification.'
    });
};

storiesOf('Messaging', module)
    .add('With title', () => <Button onClick={() => showNotification()} />)
    .add('Plain', () => <Button onClick={() => showMessage()} />);
