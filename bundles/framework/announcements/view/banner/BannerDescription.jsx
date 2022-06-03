import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { BUNDLE_KEY } from '../Constants';
import styled from 'styled-components';

const StyledContent = styled.div`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

export const showBannerDescriptionPopup = (title, description, onClose) => {

    const content = <StyledContent>
        {description}
    </StyledContent>;

    const controls = showPopup(title, content, onClose, { id: BUNDLE_KEY });
    return {
        ...controls,
        update: (title, description) => {
            controls.update(title, description);
        }
    };
}
