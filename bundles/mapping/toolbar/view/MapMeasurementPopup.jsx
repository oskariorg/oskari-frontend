import React from 'react';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
import { ButtonContainer } from 'oskari-ui/components/buttons';
import { Message, Button } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_NAME = 'Toolbar';
const StyledContent = styled('div')`
    width: 300px;
    margin: 12px 24px 24px;
`;

const PopupContent = ({ text, clearMeasurements, onClose }) => {
    return (
        <StyledContent>
            {text}
            <ButtonContainer>
                <Button
                    className='t_clearMeasurement'
                    onClick={clearMeasurements}
                >
                    <Message bundleKey={BUNDLE_NAME} messageKey='measure.clear' />
                </Button>
                <Button
                    className='t_stopMeasurement'
                    type='primary'
                    onClick={onClose}
                >
                    <Message bundleKey={BUNDLE_NAME} messageKey='measure.close' />
                </Button>
            </ButtonContainer>
        </StyledContent>
    );
};

export const showMapMeasurementPopup = (text, clearMeasurements, onClose) => {
    const dimensions = getNavigationDimensions();
    let placement = PLACEMENTS.BL;
    if (dimensions?.placement === 'right') {
        placement = PLACEMENTS.BR;
    }
    const options = {
        id: 'oskari-measurements',
        placement
    };
    const controls = showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='measure.title' />,
        <PopupContent
            text={text}
            clearMeasurements={clearMeasurements}
            onClose={onClose}
        />,
        onClose,
        options
    );

    return {
        ...controls,
        update: (text) => {
            controls.update(
                <Message bundleKey={BUNDLE_NAME} messageKey='measure.title' />,
                <PopupContent
                    text={text}
                    clearMeasurements={clearMeasurements}
                    onClose={onClose}
                />
            )
        }
    }
};
