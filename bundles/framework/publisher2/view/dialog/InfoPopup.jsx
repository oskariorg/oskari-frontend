import React from 'react';
import styled from 'styled-components';
import { showPopup, showModal } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { BUNDLE_KEY } from '../../constants';

const FADEOUT = 5000;

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-info'
};

const Content = styled.div`
    padding: 20px;
`;

export const showInfoPopup = (title, message, options = {}) => {
    // no need to update
    const showFunction = options.modal ? showModal : showPopup;
    const controls = showFunction(
        <Message messageKey={title} bundleKey={BUNDLE_KEY} />,
        (<LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                <Message messageKey={message} />
            </Content>
        </LocaleProvider>), () => {}, POPUP_OPTIONS);
    if (options.fadeout) {
        setTimeout(() => controls.close(), FADEOUT);
    }
    return controls;
};
