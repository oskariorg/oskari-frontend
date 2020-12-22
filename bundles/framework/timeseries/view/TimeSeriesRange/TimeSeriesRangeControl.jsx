import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React from 'react';
import { Background, Header, Col, ColFixed, Row, YearInput } from './styled';
import { YearRangeSlider } from './YearRangeSlider';

export const TimeSeriesRangeControl = ({ controller, title, start, end, value, dataYears, isMobile }) => {
    const [startValue, endValue] = value;
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
                            start={start}
                            end={end}
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
