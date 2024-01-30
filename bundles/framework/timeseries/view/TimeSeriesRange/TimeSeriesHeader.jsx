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

const getHeaderContent = (title, loading = false, error = false, value) => {
    let content = title;
    if (value) {
        if (!Array.isArray(value)) {
            content = `${title} (${value})`;
        }
    }
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

export const TimeSeriesHeader = ({ toggleMode, title, mode = 'year', loading = false, error = false, value, textColor, hoverColor }) => {
    const helpMessage = <Message messageKey="rangeControl.helpMessage" />;
    const switchButtonMessageKey = mode === 'year' ? 'rangeControl.switchToRange' : 'rangeControl.switchToYear';
    const switchButtonMessage = <Message messageKey={switchButtonMessageKey} />;
    const modeIcon = mode === 'year' ? <LoginOutlined /> : <LogoutOutlined />;
    return (
        <Header className="timeseries-range-drag-handle" textColor={textColor} hoverColor={hoverColor}>
            {getHeaderContent(title, loading, error, value)}
            <div className="header-mid-spacer"></div>
            <Tooltip title={getTooltipContent(mode, modeIcon)}>
                <IconButton type="text" size="large" textColor={textColor} hoverColor={hoverColor}>
                    <QuestionCircleOutlined />
                </IconButton>
            </Tooltip>
            <Tooltip title={switchButtonMessage}>
                <IconButton type="text" size="large" onClick={() => toggleMode()} textColor={textColor} hoverColor={hoverColor}>
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
    error: PropTypes.bool,
    value: PropTypes.any,
    textColor: PropTypes.string,
    hoverColor: PropTypes.string
};
