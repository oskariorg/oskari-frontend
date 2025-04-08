import React from 'react';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { BUNDLE_KEY } from '../../constants';

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-terms_of_use'
};

const Content = styled.div`
    padding: 20px;
`;

export const showTouPopup = ({ title, body }) => {
    // no need to update
    const content = (
        <Content>
            <div dangerouslySetInnerHTML={{ __html: body }} />
        </Content>
    );
    showPopup(title, content, () => {}, POPUP_OPTIONS);
};
