import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Background } from './styled';
import { TimeSeriesHeader } from './TimeSeriesHeader';
import { TimeSeriesRange } from './TimeSeriesRange';

export const TimeSeriesRangeControl = ({
    controller,
    title,
    start,
    end,
    value,
    dataYears,
    isMobile,
    loading,
    error
}) => {
    const [mode, setMode] = useState('year');
    const toggleMode = () => {
        if (mode === 'year') {
            setMode('range');
        } else {
            setMode('year');
        }
    };
    return (
        <Background isMobile={isMobile}>
            <TimeSeriesHeader
                toggleMode={() => toggleMode()}
                title={title}
                mode={mode}
                loading={loading}
                error={error}
            />
            {mode === 'year' && <div>year placeholder</div>}
            {mode === 'range' && (
                <TimeSeriesRange
                    onChange={(val) => controller.updateValue(val)}
                    start={start}
                    end={end}
                    value={value}
                    dataYears={dataYears}
                    isMobile={isMobile}
                />
            )}
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
