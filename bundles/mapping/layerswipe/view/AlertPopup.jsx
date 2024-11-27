import React from 'react';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { PrimaryButton, SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';

const BUNDLE = 'LayerSwipe';

const Content = styled.div`
    margin: 12px 24px 24px;
`;

export const showAlertPopup = (type, action, message, onClose) => {
    const title = Oskari.getMsg(BUNDLE, `alert.${type}.title`);
    const showButtons = typeof action === 'function';
    const onAction = () => {
        action();
        onClose();
    };
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE }}>
            <Content>
                { message
                    ? <span>{message}</span>
                    : <Message messageKey={`alert.${type}.message`}/>
                }
                { showButtons &&
                    <ButtonContainer>
                        <SecondaryButton type='close' onClick={() => onClose()}/>
                        <PrimaryButton type='move' onClick={onAction}/>
                    </ButtonContainer>
                }
            </Content>
        </LocaleProvider>
    );
    return showPopup(title, content, onClose, { id: BUNDLE });
};
