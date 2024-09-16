import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { Message, Spin } from 'oskari-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { Header } from './styled';
import styled from 'styled-components';
import { IconButton } from 'oskari-ui/components/buttons';

const TooltipContent = styled.div`
    p:not(:first-child) {
        padding-top: 1em;
    }
`;
const Paragraph = styled('p')``;

const Space = styled.div`
    flex: 1;
`;

const StyledIcon = styled(IconButton)`
    padding: 10px;
`;

const ICON_SIZE = 20;

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

export const TimeSeriesHeader = ({ toggleMode, title, mode = 'year', loading = false, error = false, value, iconColor }) => {
    const helpMessage = <Message messageKey="rangeControl.helpMessage" />;
    const switchButtonMessageKey = mode === 'year' ? 'rangeControl.switchToRange' : 'rangeControl.switchToYear';
    const modeIcon = mode === 'year' ? <LoginOutlined /> : <LogoutOutlined />;
    const iconProps = { iconSize: ICON_SIZE, color: iconColor };
    return (
        <Header className="timeseries-range-drag-handle">
            {getHeaderContent(title, loading, error, value)}
            <Space className="header-mid-spacer"></Space>
            <StyledIcon type='info' { ...iconProps }
                title={getTooltipContent(mode, modeIcon)}
                color={iconColor}/>
            <StyledIcon { ...iconProps }
                title={<Message messageKey={switchButtonMessageKey} />}
                onClick={() => toggleMode()}
                icon={modeIcon}
                color={iconColor}/>
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
    iconColor: PropTypes.string
};
