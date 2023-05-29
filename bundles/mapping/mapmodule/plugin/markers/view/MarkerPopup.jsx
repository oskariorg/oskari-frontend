import React from 'react';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
import { ButtonContainer, SecondaryButton, PrimaryButton } from 'oskari-ui/components/buttons';
import { Message, Button } from 'oskari-ui';
import { BUNDLE_KEY } from '../constants';
import styled from 'styled-components';

const StyledContent = styled('div')`
    width: 300px;
    margin: 12px 24px 24px;
`;

const PopupContent = ({ clearMarkers, onClose }) => {
    return (
        <StyledContent>
            <Message bundleKey={BUNDLE_KEY} messageKey='plugin.MarkersPlugin.dialog.message' />
            <ButtonContainer>
                <Button
                    className='t_clearMarkers'
                    onClick={clearMarkers}
                >
                    <Message bundleKey={BUNDLE_KEY} messageKey='plugin.MarkersPlugin.dialog.clear' />
                </Button>
                <PrimaryButton
                    type='close'
                    onClick={onClose}
                />
            </ButtonContainer>
        </StyledContent>
    );
};

export const showMarkerPopup = (clearMarkers, onClose) => {
    const dimensions = getNavigationDimensions();
    let placement = PLACEMENTS.BL;
    if (dimensions?.placement === 'right') {
        placement = PLACEMENTS.BR;
    }
    const options = {
        id: 'markers-plugin',
        placement
    };
    return showPopup(
        <Message bundleKey={BUNDLE_KEY} messageKey='plugin.MarkersPlugin.title' />,
        <PopupContent
            clearMarkers={clearMarkers}
            onClose={onClose}
        />,
        onClose,
        options
    );
};
