import React, { useState } from 'react';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
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
`;
const Options = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 5px;
`;

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
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
                <StyledCheckbox
                    checked={state.showMarker}
                    onChange={(e) => setState({
                        ...state,
                        showMarker: e.target.checked,
                        url: updateUrl(baseUrl, e.target.checked, state.hideGuidedTour),
                        copied: false
                    })}
                >
                    <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.addMarker' />
                </StyledCheckbox>
                {guidedTour && (
                    <StyledCheckbox
                        checked={state.hideGuidedTour}
                        onChange={(e) => setState({
                            ...state,
                            hideGuidedTour: e.target.checked,
                            url: updateUrl(baseUrl, state.showMarker, e.target.checked),
                            copied: false
                        })}
                    >
                        <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.skipInfo' />
                    </StyledCheckbox>
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
    const dimensions = getNavigationDimensions();
    let placement = PLACEMENTS.BL;
    if (dimensions?.placement === 'right') {
        placement = PLACEMENTS.BR;
    }
    const options = {
        id: 'oskari-maplink',
        placement
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
