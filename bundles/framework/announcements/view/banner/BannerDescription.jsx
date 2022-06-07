import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { BUNDLE_KEY } from '../../constants';
import { AnnouncementsContent } from '../AnnouncementsContent';
import styled from 'styled-components';

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-from-banner'
};

const StyledContent = styled.div`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

export const showBannerDescriptionPopup = (announcement, onClose) => {
    const content = (
        <StyledContent>
            <AnnouncementsContent announcement={announcement}/>
        </StyledContent>
    );
    const { title } = Oskari.getLocalized(announcement.locale);
    return showPopup(title, content, onClose, POPUP_OPTIONS);
};
