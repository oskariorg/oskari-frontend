import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React from 'react';
import { Background, Header, Col, ColFixed, Row, YearInput, YearRangeSlider } from './styled';

export const TimeSeriesRangeControl = ({ controller, title, start, end, value, dataYears, isMobile }) => {
    const [startValue, endValue] = value;
    const marks = {
        [start]: start,
        [end]: end,
    };
    for (let i = start + 1; i < end; i++) {
        if (i % 10 === 0) {
            marks[i] = i;
        }
    }

    // data years are those years that has timeseries photos in current map view
    // data years are also marks on the range slider but they are represented
    // as small circles on the timeline (via css styling)
    dataYears.filter((year) => !marks[year]).forEach((year) => (marks[year] = ''));

    return (
        <Background isMobile={isMobile}>
            <Header className="timeseries-range-drag-handle">{title}</Header>
            <Row>
                <Col>
                    <YearInput
                        value={startValue}
                        onChange={(val) => controller.updateValue([val, endValue])}
                    ></YearInput>
                </Col>
                {!isMobile && (
                    <ColFixed>
                        <YearRangeSlider
                            range
                            step={1}
                            min={start}
                            max={end}
                            marks={marks}
                            dataYears={dataYears}
                            value={value}
                            onChange={(val) => controller.updateValue(val)}
                        />
                    </ColFixed>
                )}
                <Col>
                    <YearInput
                        value={endValue}
                        onChange={(val) => controller.updateValue([startValue, val])}
                    ></YearInput>
                </Col>
            </Row>
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
};
