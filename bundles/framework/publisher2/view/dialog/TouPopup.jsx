import React from 'react';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../../constants';

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-terms_of_use'
};

const Content = styled.div`
    padding: 20px;
`;

export const showTouPopup = (tou) => {
    const { title, body, dummy } = tou || {};
    // no need to update
    const content = body && !dummy
        ? <div dangerouslySetInnerHTML={{ __html: body }} />
        : <Message bundleKey={BUNDLE_KEY} messageKey='StartView.tou.notfound' />;
    const popupTitle = title && !dummy
        ? title
        : <Message bundleKey={BUNDLE_KEY} messageKey='StartView.tou.title' />;
    showPopup(
        popupTitle,
        <Content>{content}</Content>,
        () => {},
        POPUP_OPTIONS
    );
};
