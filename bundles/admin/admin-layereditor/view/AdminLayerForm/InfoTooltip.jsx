import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Message } from 'oskari-ui';
import styled from 'styled-components';

const InlineBlock = styled('div')`
    padding-left: 10px;
    display: inline-block;
`;

export const InfoTooltip = ({ messageKeys }) => {
    if (typeof messageKeys === 'string') {
        messageKeys = [messageKeys];
    }
    if (!Array.isArray(messageKeys) || messageKeys.length === 0) {
        return null;
    }
    const messages = messageKeys.map((msgKey, i) => <Message key={i} messageKey={msgKey} />);
    return (
        <Tooltip title={messages}>
            <InlineBlock>
                <Icon type="question-circle" />
            </InlineBlock>
        </Tooltip>
    );
};
InfoTooltip.propTypes = {
    messageKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string, PropTypes.any])
};
