import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { showPopup } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { AnnouncementsForm } from './AnnouncementsForm';
import { BUNDLE_KEY } from './constants';

const Content = styled.div`
    margin: 12px 24px 24px;
`;

export const showEditPopup = (announcement, onSubmit, onDelete, onClose) => {
    const title = <Message messageKey="popup.title" bundleKey={BUNDLE_KEY} />;
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                <AnnouncementsForm
                    announcement={announcement}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                    onClose={onClose} />
            </Content>
        </LocaleProvider>
    );
    return showPopup(title, content, onClose, { id: BUNDLE_KEY });
};

showEditPopup.propTypes = {
    announcement: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
