import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { Button, Select, Option } from 'oskari-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, ColFixed, Row } from './styled';
import { YearRangeSlider } from './YearRangeSlider';

const optionCompareFunction = (a, b) => {
    if (a.key < b.key) {
        return -1;
    }

    if (a.key > b.key) {
        return 1;
    }

    return 0;
};

export const TimeSeriesYear = ({ onChange, start, end, value, dataYears, isMobile }) => {
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

    if (isMobile) {
        let options = [];
        if (!dataYears?.includes(parseInt(value))) {
            options.push(<Option key={parseInt(value)} disabled>{value}</Option>);
        }
        options = options.concat(dataYears.map((item) => {
            return <Option key={item}>{item}</Option>;
        })).sort(optionCompareFunction);

        return <Row>
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
            <Col>
                <Select value={value} onChange={(value) => onChange(value)}>{options}</Select>
            </Col>
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
        </Row>;
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
                    isMobile={isMobile}
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
    dataYears: PropTypes.arrayOf(PropTypes.number).isRequired,
    isMobile: PropTypes.bool.isRequired
};
