import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { BUNDLE_KEY } from '../PrintoutPanel';

const StyledPanelHeader = styled('div')`
    display: inline-flex;
    flex-direction: row;
    font-weight: bold;
`;

export const PanelHeader = ({ headerMsg, infoMsg }) => {
    return (
        <StyledPanelHeader>
            <Message bundleKey={BUNDLE_KEY} messageKey={headerMsg} />
            {infoMsg && <InfoIcon title={<Message bundleKey={BUNDLE_KEY} messageKey={infoMsg} />} /> }
        </StyledPanelHeader>
    );
};

PanelHeader.propTypes = {
    headerMsg: PropTypes.any,
    infoMsg: PropTypes.any
};
