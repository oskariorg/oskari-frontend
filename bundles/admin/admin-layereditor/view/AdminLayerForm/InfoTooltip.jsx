import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Message } from 'oskari-ui';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

const InlineBlock = styled('div')`
    padding-left: 10px;
    display: inline-block;
`;

export const InfoTooltip = ({ message, messageKeys }) => {
    if (typeof messageKeys === 'string') {
        messageKeys = [messageKeys];
    }
    if (Array.isArray(messageKeys) && messageKeys.length !== 0) {
        message = messageKeys.map((msgKey, i) => {
            if (Array.isArray(msgKey)) {
                return <Message key={i} messageKey={msgKey[0]} messageArgs={msgKey[1]} />
            }
            return (
                <Message key={i} messageKey={msgKey} />
            );
        });
    }
    if (!message) {
        return null;
    }
    return (
        <Tooltip title={message}>
            <InlineBlock>
                <QuestionCircleOutlined />
            </InlineBlock>
        </Tooltip>
    );
};
InfoTooltip.propTypes = {
    message: PropTypes.node,
    messageKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string, PropTypes.any])
};
