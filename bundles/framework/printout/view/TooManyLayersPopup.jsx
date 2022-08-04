import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { showPopup } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';


const BUNDLE_KEY = 'Printout';

const Content = styled.div`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const getContent = (onClose) => {
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                <Message messageKey='StartView.info.maxLayers' />
                <ButtonContainer>
                    <PrimaryButton type='close' onClick={() => onClose()}/>
                </ButtonContainer>
            </Content>
        </LocaleProvider>
    );
};

export const showTooManyLayersPopup = (onClose) => {
    const content = getContent(onClose);
    return showPopup(null, content, onClose);
};

showTooManyLayersPopup.propTypes = {
    onClose: PropTypes.func.isRequired
};
