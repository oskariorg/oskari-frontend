import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { showPopup } from 'oskari-ui/components/window';
import { Controller, LocaleProvider } from 'oskari-ui/util';
import { AnnouncementsForm } from './AnnouncementsForm';
import { BUNDLE_KEY } from './constants';

const Content = styled.div`
    margin: 12px 24px 24px;
`;

export const showEditPopup = (controller, announcement, onClose) => {
    const title = <Message messageKey="popup.title" bundleKey={BUNDLE_KEY} />;
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                <AnnouncementsForm
                    controller={controller}
                    announcement={announcement}
                    onClose={onClose} />
            </Content>
        </LocaleProvider>
    );
    return showPopup(title, content, onClose, { id: BUNDLE_KEY });
};

showEditPopup.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    announcement: PropTypes.object,
    onClose: PropTypes.func.isRequired
};
