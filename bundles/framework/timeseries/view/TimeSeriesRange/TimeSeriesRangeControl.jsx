import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React from 'react';
import { Spin } from 'oskari-ui';
import { Background, Header } from './styled';
import { TimeSeriesRange } from './TimeSeriesRange';

const getHeaderContent = (title, loading = false, error = false) => {
    let content = title;
    if (loading) {
        content = (<span>{content} <Spin /></span>);
    }
    if (error) {
        // TODO: give an icon with tooltip or something cleaner
        content = (<span style={{ color: 'red' }}>{content}</span>);
    }
    return content;
};

export const TimeSeriesRangeControl = ({ controller, title, start, end, value, dataYears, isMobile, loading, error }) => {
    return (
        <Background isMobile={isMobile}>
            <Header className="timeseries-range-drag-handle">{ getHeaderContent(title, loading, error) }</Header>
            <TimeSeriesRange
                onChange={(val) => controller.updateValue(val)}
                start={start}
                end={end}
                value={value}
                dataYears={dataYears}
                isMobile={isMobile}
            />
        </Background>
    );
};

TimeSeriesRangeControl.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    title: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    dataYears: PropTypes.arrayOf(PropTypes.number).isRequired,
    isMobile: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    loading: PropTypes.bool
};
