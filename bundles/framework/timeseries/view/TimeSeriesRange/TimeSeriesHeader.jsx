import { LoginOutlined, LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Message, Tooltip, Spin } from 'oskari-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { Header, IconButton } from './styled';

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

export const TimeSeriesHeader = ({ toggleMode, title, mode = 'year', loading = false, error = false }) => {
    const messageKey = mode === 'year' ? 'timeseriesYearModeHelpMsg' : 'timeseriesRangeModeHelpMsg';
    const message = <Message messageKey={messageKey} />;
    return (
        <Header className="timeseries-range-drag-handle">
            {getHeaderContent(title, loading, error)}
            <div className="header-mid-spacer"></div>
            <Tooltip title={message}>
                <IconButton type="text" size="large">
                    <QuestionCircleOutlined />
                </IconButton>
            </Tooltip>
            <IconButton type="text" size="large" onClick={() => toggleMode()}>
                {mode === 'year' ? <LoginOutlined /> : <LogoutOutlined />}
            </IconButton>
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
