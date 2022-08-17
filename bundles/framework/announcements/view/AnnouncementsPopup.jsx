
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Controller, LocaleProvider } from 'oskari-ui/util';

import { BUNDLE_KEY } from '../constants';
import { PaginatedContent, SingleContent } from './';

// Pop-up functionality for announcements

const POPUP_OPTIONS = {
    id: BUNDLE_KEY
};

const Content = styled.div`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const getContent = (state, controller, onClose) => {
    const { popupAnnouncements, currentPopup = 1 } = state;
    const announcement = popupAnnouncements[currentPopup - 1];
    if (!announcement) {
        return null;
    }
    const dontShowAgain = state.dontShowAgain.includes(announcement.id);
    const { title } = Oskari.getLocalized(announcement.locale);
    const count = popupAnnouncements.length;
    const PopupContent = count === 1 ? SingleContent : PaginatedContent;
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                <PopupContent
                    controller={controller}
                    announcement={announcement}
                    count={count}
                    current={currentPopup}
                    dontShowAgain={dontShowAgain}
                    onClose={onClose} />
            </Content>
        </LocaleProvider>
    );
    return { title, content };
};

export const showAnnouncementsPopup = (state, controller, onClose) => {
    const { title, content } = getContent(state, controller, onClose);
    const controls = showPopup(title, content, onClose, POPUP_OPTIONS);
    return {
        ...controls,
        update: (state) => {
            const { title, content } = getContent(state, controller, onClose);
            controls.update(title, content);
        }
    };
};

showAnnouncementsPopup.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    state: PropTypes.object,
    onClose: PropTypes.func.isRequired
};
