import PropTypes from 'prop-types';
import React from 'react';
import { Col, ColFixed, Row, YearInput } from './styled';
import { YearRangeSlider } from './YearRangeSlider';

export const TimeSeriesRange = ({ onChange, start, end, value, dataYears, isMobile }) => {
    const [startValue, endValue] = value;
    return (
        <Row>
            <Col>
                <YearInput
                    value={startValue}
                    min={start}
                    max={endValue}
                    onChange={(val) => onChange([val, endValue])}
                ></YearInput>
            </Col>
            {!isMobile && (
                <ColFixed>
                    <YearRangeSlider
                        range
                        step={1}
                        start={start}
                        end={end}
                        dataYears={dataYears}
                        value={value}
                        onChange={(val) => onChange(val)}
                    />
                </ColFixed>
            )}
            <Col>
                <YearInput
                    value={endValue}
                    min={startValue}
                    max={end}
                    onChange={(val) => onChange([startValue, val])}
                ></YearInput>
            </Col>
        </Row>
    );
};

TimeSeriesRange.propTypes = {
    onChange: PropTypes.func.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    dataYears: PropTypes.arrayOf(PropTypes.number).isRequired,
    isMobile: PropTypes.bool.isRequired
};
