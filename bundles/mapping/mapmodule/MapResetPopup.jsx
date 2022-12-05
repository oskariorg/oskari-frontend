import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton, ButtonContainer } from 'oskari-ui/components/buttons';

const PopupContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 200px;
`;

const Content = ({ onReset, onClose }) => {

    return (
        <PopupContent>
            <Message bundleKey='MapModule' messageKey='plugin.PanButtonsPlugin.center.confirmReset' />
            <ButtonContainer>
                <SecondaryButton type='no' onClick={onClose} />
                <PrimaryButton type='yes' onClick={onReset} />
            </ButtonContainer>
        </PopupContent>
    )
};

export const showResetPopup = (onReset, onClose) => {
    return showPopup('', <Content onReset={onReset} onClose={onClose} />, onClose)
}
