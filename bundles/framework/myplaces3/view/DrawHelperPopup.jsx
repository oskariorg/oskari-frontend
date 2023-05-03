import React from 'react';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    width: 300px;
`;

const PopupContent = ({ description, measurement, onSave, onClose }) => {
    return (
        <StyledContent>
            <div>
                {description}
            </div>
            {measurement && (
                <div>
                    {measurement}
                </div>
            )}
            <ButtonContainer>
                <SecondaryButton
                    type='cancel'
                    onClick={onClose}
                />
                <PrimaryButton
                    type='save'
                    onClick={onSave}
                />
            </ButtonContainer>
        </StyledContent>
    );
};

export const showDrawHelperPopup = (title, description, onSave, onClose, measurement) => {
    const dimensions = getNavigationDimensions();
    let placement = PLACEMENTS.BL;
    if (dimensions?.placement === 'right') {
        placement = PLACEMENTS.BR;
    }
    const options = {
        id: 'myplaces-draw-helper',
        placement
    };

    const controls = showPopup(
        title,
        <PopupContent
            description={description}
            onSave={onSave}
            onClose={onClose}
            measurement={measurement}
        />,
        onClose,
        options
    );

    return {
        ...controls,
        update: (updatedDescription, updatedMeasurement) => {
            controls.update(
                title,
                <PopupContent
                    description={updatedDescription}
                    onSave={onSave}
                    onClose={onClose}
                    measurement={updatedMeasurement}
                />
            )
        }
    }
};
