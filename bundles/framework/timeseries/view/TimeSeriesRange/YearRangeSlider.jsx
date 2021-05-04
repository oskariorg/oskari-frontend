import PropTypes from 'prop-types';
import React from 'react';
import { StyledRangeSlider } from './styled';

export const YearRangeSlider = (props) => {
    const { start, end, dataYears, isMobile } = props;
    const marks = {
        [start]: start,
        [end]: end
    };
    if (isMobile) {
        const middle = Math.round((start + end) / 2);
        marks[middle] = middle;
    } else {
        for (let i = start + 1; i < end; i++) {
            if (i % 10 === 0 && i - start >= 5 && end - i >= 5) {
                marks[i] = i;
            }
        }
    }

    // data years are those years that has timeseries photos in current map view
    // data years are also marks on the range slider but they are represented
    // as small circles on the timeline (via css styling)
    dataYears.filter((year) => !marks[year]).forEach((year) => (marks[year] = ''));
    return (
        <StyledRangeSlider
            {...props}
            tooltipVisible
            getTooltipPopupContainer={(triggerNode) => triggerNode.parentElement}
            marks={marks}
            min={start}
            max={end}
        />
    );
};

YearRangeSlider.propTypes = {
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    dataYears: PropTypes.arrayOf(PropTypes.number).isRequired,
    isMobile: PropTypes.bool.isRequired
};
