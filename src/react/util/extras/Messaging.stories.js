import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from 'oskari-ui';
import { Messaging } from 'oskari-ui/util';
import styled from 'styled-components';

const title = 'Title for the notification';
const content = 'This is the content part of the notification.';

const Container = styled('div')`
    display: flex;
    > * {
        margin: 5px !important;
    }
`;

storiesOf('Messaging', module)
    .add('Types and levels', () => {
        return (
            <Container>
                <Button onClick={() => Messaging.open(content)}>open</Button>
                <Button onClick={() => Messaging.open({ title, content })}>open with title</Button>
                <Button onClick={() => Messaging.info(content)}>info</Button>
                <Button onClick={() => Messaging.info({ title, content })}>info with title</Button>
                <Button onClick={() => Messaging.success(content)}>success</Button>
                <Button onClick={() => Messaging.success({ title, content })}>success with title</Button>
                <Button onClick={() => Messaging.warn(content)}>warn</Button>
                <Button onClick={() => Messaging.warn({ title, content })}>warn with title</Button>
                <Button onClick={() => Messaging.error(content)}>error</Button>
                <Button onClick={() => Messaging.error({ title, content })}>error with title</Button>
                <Button onClick={() => Messaging.loading(content)}>loading</Button>
            </Container>
        );
    });
