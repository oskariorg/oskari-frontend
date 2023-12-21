import React, { useState } from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { ButtonContainer, SecondaryButton, CopyButton } from 'oskari-ui/components/buttons';
import { Message, Checkbox, CopyField } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_NAME = 'Toolbar';
const StyledContent = styled('div')`
    max-width: 620px;
    margin: 12px 24px 24px;
`;
const Options = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 5px;
`;

const updateUrl = (baseUrl, addMarker, skipInfo, swipeToolActive) => {
    let url = baseUrl;
    if (addMarker) {
        url += '&showMarker=true';
    }
    if (skipInfo) {
        url += '&showIntro=false';
    }

    if (swipeToolActive) {
        url += '&swipe=true';
    }

    return url;
}

const PopupContent = ({ guidedTour, swipeToolActive, baseUrl, onClose }) => {
    const [state, setState] = useState({
        hideGuidedTour: true,
        showMarker: false,
        url: updateUrl(baseUrl, false, true, swipeToolActive),
        highlighted: false
    });

    const highlightUrl = () => {
        setState({
            ...state,
            highlighted: true
        });
        setTimeout(() => {
            setState({
                ...state,
                highlighted: false
            });
        }, 1000);
    }

    return (
        <StyledContent>
            <CopyField
                value={state.url}
                highlighted={state.highlighted}
            />
            <Options>
                <div>
                    <Checkbox
                        checked={state.showMarker}
                        onChange={(e) => setState({
                            ...state,
                            showMarker: e.target.checked,
                            url: updateUrl(baseUrl, e.target.checked, state.hideGuidedTour, swipeToolActive)
                        })}
                    >
                        <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.addMarker' />
                    </Checkbox>
                </div>
                {guidedTour && (
                    <div>
                        <Checkbox
                            checked={state.hideGuidedTour}
                            onChange={(e) => setState({
                                ...state,
                                hideGuidedTour: e.target.checked,
                                url: updateUrl(baseUrl, state.showMarker, e.target.checked, swipeToolActive)
                            })}
                        >
                            <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.skipInfo' />
                        </Checkbox>
                    </div>
                )}
            </Options>
            <ButtonContainer>
                <SecondaryButton
                    type='close'
                    onClick={onClose}
                />
                <CopyButton
                    className='t_copyurl'
                    onClick={() => highlightUrl()}
                    value={state.url}
                />
            </ButtonContainer>
        </StyledContent>
    );
};

export const showMapLinkPopup = (guidedTour, swipeToolActive, baseUrl, onClose) => {
    const options = {
        id: 'oskari-maplink'
    };
    return showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='buttons.link.title' />,
        <PopupContent
            baseUrl={baseUrl}
            guidedTour={guidedTour}
            swipeToolActive={swipeToolActive}
            onClose={onClose}
        />,
        onClose,
        options
    );
};
