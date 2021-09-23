import { LoginOutlined, LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Message, Tooltip, Spin } from 'oskari-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { Header, IconButton } from './styled';
import styled from 'styled-components';

export const TooltipContent = styled.div`
    p:not(:first-child) {
        padding-top: 1em;
    }
`;
export const Paragraph = styled('p')``;

const getHeaderContent = (title, loading = false, error = false) => {
    let content = title;
    if (loading) {
        content = (
            <span>
                {content} <Spin />
            </span>
        );
    }
    if (error) {
        // TODO: give an icon with tooltip or something cleaner
        content = <span style={{ color: 'red' }}>{content}</span>;
    }
    return content;
};

const getTooltipContent = (mode, modeIcon) => {
    return (
        <TooltipContent>
            <Message messageKey="rangeControl.helpGeneric" LabelComponent={Paragraph} />
            <Message messageKey={`rangeControl.helpMsg_${mode}`} LabelComponent={Paragraph}> {modeIcon}</Message>
        </TooltipContent>
    );
}

export const TimeSeriesHeader = ({ toggleMode, title, mode = 'year', loading = false, error = false }) => {
    const helpMessage = <Message messageKey="rangeControl.helpMessage" />;
    const switchButtonMessageKey = mode === 'year' ? 'rangeControl.switchToRange' : 'rangeControl.switchToYear';
    const switchButtonMessage = <Message messageKey={switchButtonMessageKey} />;
    const modeIcon = mode === 'year' ? <LoginOutlined /> : <LogoutOutlined />;
    return (
        <Header className="timeseries-range-drag-handle">
            {getHeaderContent(title, loading, error)}
            <div className="header-mid-spacer"></div>
            <Tooltip title={getTooltipContent(mode, modeIcon)}>
                <IconButton type="text" size="large">
                    <QuestionCircleOutlined />
                </IconButton>
            </Tooltip>
            <Tooltip title={switchButtonMessage}>
                <IconButton type="text" size="large" onClick={() => toggleMode()}>
                    {modeIcon}
                </IconButton>
            </Tooltip>
        </Header>
    );
};

TimeSeriesHeader.propTypes = {
    toggleMode: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['year', 'range']),
    loading: PropTypes.bool,
    error: PropTypes.bool
};
