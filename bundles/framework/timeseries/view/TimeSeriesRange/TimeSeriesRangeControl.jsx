import { Controller, ThemeConsumer } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React from 'react';
import { Background } from './styled';
import { TimeSeriesHeader } from './TimeSeriesHeader';
import { TimeSeriesRange } from './TimeSeriesRange';
import { TimeSeriesYear } from './TimeSeriesYear';
import { getNavigationTheme } from 'oskari-ui/theme/ThemeHelper';

export const TimeSeriesRangeControl = ThemeConsumer(({
    theme,
    controller,
    title,
    start,
    end,
    mode,
    value,
    dataYears,
    isMobile,
    loading,
    error
}) => {
    const toggleMode = () => {
        if (mode === 'year') {
            controller.updateValue([start, value], 'range');
        } else {
            controller.updateValue(value[1], 'year');
        }
    };
    const navigationTheme = getNavigationTheme(theme);
    const textColor = navigationTheme.getTextColor();
    const backgroundColor = navigationTheme.getNavigationBackgroundColor();

    return (
        <Background textColor={textColor} backgroundColor={backgroundColor} isMobile={isMobile}>
            <TimeSeriesHeader
                iconColor={textColor}
                toggleMode={() => toggleMode()}
                title={title}
                mode={mode}
                loading={loading}
                error={error}
                value={value}
            />
            {mode === 'year' && (
                <TimeSeriesYear
                    onChange={(val) => controller.updateValue(val)}
                    start={start}
                    end={end}
                    value={value}
                    dataYears={dataYears}
                    isMobile={isMobile}
                    iconColor={textColor}
                />
            )}
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
});

TimeSeriesRangeControl.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    title: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    mode: PropTypes.oneOf(['year', 'range']).isRequired,
    value: PropTypes.any.isRequired,
    dataYears: PropTypes.arrayOf(PropTypes.number).isRequired,
    isMobile: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    loading: PropTypes.bool
};
