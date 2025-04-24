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
    const { title, body } = tou || {};
    // no need to update
    const content = body
        ? <div dangerouslySetInnerHTML={{ __html: body }} />
        : <Message bundleKey={BUNDLE_KEY} messageKey='StartView.tou.notfound' />;
    showPopup(
        title || <Message bundleKey={BUNDLE_KEY} messageKey='StartView.tou.title' />,
        <Content>{content}</Content>,
        () => {},
        POPUP_OPTIONS
    );
};
