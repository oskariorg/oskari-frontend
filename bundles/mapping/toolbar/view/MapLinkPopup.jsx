import React, { useState } from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { Message, Button, Checkbox } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_NAME = 'Toolbar';
const StyledContent = styled('div')`
    max-width: 620px;
    margin: 12px 24px 24px;
`;
const LinkContainer = styled('div')`
    display: block;
    border: 1px dashed #000000;
    padding: 5px;
    border-radius: 5px;
    word-break: break-all;
`;
const Options = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 5px;
`;

const copyText = (text) => {
    navigator.clipboard.writeText(text);
}

const updateUrl = (baseUrl, addMarker, skipInfo) => {
    let url = baseUrl;
    if (addMarker) {
        url += '&showMarker=true';
    }
    if (skipInfo) {
        url += '&showIntro=false';
    }
    return url;
}

const PopupContent = ({ guidedTour, baseUrl, onClose }) => {
    const [state, setState] = useState({
        hideGuidedTour: true,
        showMarker: false,
        copied: false,
        url: updateUrl(baseUrl, false, true)
    });
    return (
        <StyledContent>
            <LinkContainer>
                {state.url}
            </LinkContainer>
            <Options>
                <Checkbox
                    checked={state.showMarker}
                    onChange={(e) => setState({
                        ...state,
                        showMarker: e.target.checked,
                        url: updateUrl(baseUrl, e.target.checked, state.hideGuidedTour),
                        copied: false
                    })}
                >
                    <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.addMarker' />
                </Checkbox>
                {guidedTour && (
                    <Checkbox
                        checked={state.hideGuidedTour}
                        onChange={(e) => setState({
                            ...state,
                            hideGuidedTour: e.target.checked,
                            url: updateUrl(baseUrl, state.showMarker, e.target.checked),
                            copied: false
                        })}
                    >
                        <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.skipInfo' />
                    </Checkbox>
                )}
            </Options>
            <ButtonContainer>
                <Button
                    className='t_copyurl'
                    onClick={() => {
                        copyText(state.url);
                        setState({
                            ...state,
                            copied: true
                        });
                    }}
                >
                    {state.copied ? (<Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.copied' />) : (<Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.copy' />)}
                </Button>
                <SecondaryButton
                    type='close'
                    onClick={onClose}
                />
            </ButtonContainer>
        </StyledContent>
    );
};

export const showMapLinkPopup = (guidedTour, baseUrl, onClose) => {
    const options = {
        id: 'oskari-maplink'
    };
    return showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.title' />,
        <PopupContent
            baseUrl={baseUrl}
            guidedTour={guidedTour}
            onClose={onClose}
        />,
        onClose,
        options
    );
};
