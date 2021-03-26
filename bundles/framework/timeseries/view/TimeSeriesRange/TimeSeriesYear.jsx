import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { Button } from 'oskari-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, ColFixed, Row } from './styled';
import { YearRangeSlider } from './YearRangeSlider';

export const TimeSeriesYear = ({ onChange, start, end, value, dataYears }) => {
    // when current value is after last data layer
    let prevDataYear = dataYears[dataYears.length - 1] || null;
    let nextDataYear = null;
    for (let i = 0; i < dataYears.length; i++) {
        if (dataYears[i] === value) {
            // when current value is one of the data years
            prevDataYear = dataYears[i - 1] || null;
            nextDataYear = dataYears[i + 1] || null;
            break;
        }
        if (dataYears[i] > value) {
            // when current value is between two data years or before first data year
            prevDataYear = dataYears[i - 1] || null;
            nextDataYear = dataYears[i];
            break;
        }
    }
    return (
        <Row>
            <Col>
                <Button
                    type="primary"
                    shape="circle"
                    disabled={prevDataYear === null}
                    onClick={() => onChange(prevDataYear)}
                >
                    <StepBackwardOutlined />
                </Button>
            </Col>
            <ColFixed>
                <YearRangeSlider
                    included={false}
                    step={1}
                    start={start}
                    end={end}
                    dataYears={dataYears}
                    value={value}
                    onChange={(val) => onChange(val)}
                />
            </ColFixed>
            <Col>
                <Button
                    type="primary"
                    shape="circle"
                    disabled={nextDataYear === null}
                    onClick={() => onChange(nextDataYear)}
                >
                    <StepForwardOutlined />
                </Button>
            </Col>
        </Row>
    );
};

TimeSeriesYear.propTypes = {
    onChange: PropTypes.func.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    dataYears: PropTypes.arrayOf(PropTypes.number).isRequired
};
