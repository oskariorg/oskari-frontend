import React, { useEffect, useState } from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Button } from 'oskari-ui';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
const LOCALIZATION_ID = 'StateHandler';
const SESSION_EXPIRES_SECONDS = 60;
const MessageContainer = styled('div')`
    margin: 1em;
    display: flex;
    flex-direction: column;
`;

const ButtonContainer = styled('div')`
    display: flex;
    justify-content: space-between;
`;

const MessagePopup = (props) => {
    const { minutes, cancelCallback, continueCallback } = props;
    const [seconds, setSeconds] = useState(minutes * SESSION_EXPIRES_SECONDS);
    const [start] = useState(Date.now());
    let diff;
    let newSeconds;
    const timer = setTimeout(() => {
        diff = SESSION_EXPIRES_SECONDS - (((Date.now() - start) / 1000) | 0);
        newSeconds = (diff % 60) | 0;
        newSeconds = newSeconds < 10 ? 0 + newSeconds : newSeconds;

        if (newSeconds < 1) {
            clearTimeout(timer);
            if (Oskari.user().isLoggedIn()) {
                cancelCallback();
            } else {
                location.reload();
            }
        } else {
            setSeconds(newSeconds);
        }
    }, 1000);

    useEffect(() => {
        return () => {
            clearTimeout(timer);
        };
    });
    const message = Oskari.getMsg(LOCALIZATION_ID, 'session.expiring.message').replace('{extend}', Oskari.getMsg(LOCALIZATION_ID, 'session.expiring.extend'));
    const expiringMessage = Oskari.getMsg(LOCALIZATION_ID, 'session.expiring.expires').replace('{expires}', seconds);
    return <MessageContainer>
        <div>{message}</div>
        <div>{expiringMessage}</div>
        <ButtonContainer>
            <Button type='secondary' onClick={cancelCallback}>{Oskari.getMsg(LOCALIZATION_ID, 'session.expiring.logout')}</Button>
            <Button type='primary' onClick={continueCallback}>{Oskari.getMsg(LOCALIZATION_ID, 'session.expiring.extend')}</Button>
        </ButtonContainer>
    </MessageContainer>;
};

MessagePopup.propTypes = {
    minutes: PropTypes.number,
    cancelCallback: PropTypes.func,
    continueCallback: PropTypes.func
};

export const showSessionExpiringPopup = (minutes, cancelCallback, continueCallback) => {
    const title = Oskari.getMsg(LOCALIZATION_ID, 'session.expiring.title');
    return showPopup(title, <MessagePopup minutes={minutes} cancelCallback={cancelCallback} continueCallback={continueCallback}/>, null, { id: 'StateHandlerReactPopup' });
};
