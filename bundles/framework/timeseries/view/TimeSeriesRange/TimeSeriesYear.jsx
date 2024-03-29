import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { Button, Select, Option } from 'oskari-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, ColFixed, Row } from './styled';
import { YearRangeSlider } from './YearRangeSlider';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme/ThemeHelper';

const ForwardIcon = () => {
    return <StepForwardOutlined style={{ fontSize: '125%' }}/>;
};

const BackwardIcon = () => {
    return <StepBackwardOutlined style={{ fontSize: '125%' }}/>;
};

export const TimeSeriesYear = ThemeConsumer(({ onChange, start, end, value, dataYears, isMobile, theme }) => {
    const currentYearIntValue = parseInt(value);
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

    const navigationTheme = getNavigationTheme(theme);
    const textColor = navigationTheme.getTextColor();
    const hoverColor = navigationTheme.getButtonHoverColor();
    const backgroundColor = navigationTheme.getNavigationBackgroundColor();
    if (isMobile) {
        const currentYearDisabled = !dataYears?.includes(currentYearIntValue);
        // need to clone this, otherwise the "current year" will remain even if we switch to a valid year without panning the map
        const newDataYears = [].concat(dataYears);
        if (currentYearDisabled) {
            newDataYears.push(currentYearIntValue);
        }

        const options = newDataYears
            .sort()
            .map((item) => {
                return item === currentYearIntValue && currentYearDisabled
                    ? <Option key={item} disabled>{item}</Option>
                    : <Option key={item}>{item}</Option>;
            });

        return <Row>
            <Col textColor={textColor} hoverColor={hoverColor} backgroundColor={backgroundColor}>
                <Button
                    type="primary"
                    shape="circle"
                    disabled={prevDataYear === null}
                    onClick={() => onChange(prevDataYear)}
                >
                    <BackwardIcon />
                </Button>
            </Col>
            <Col textColor={textColor} hoverColor={hoverColor} backgroundColor={backgroundColor}>
                <Select value={currentYearIntValue} onChange={(value) => onChange(parseInt(value))}>{options}</Select>
            </Col>
            <Col textColor={textColor} hoverColor={hoverColor} backgroundColor={backgroundColor}>
                <Button
                    type="primary"
                    shape="circle"
                    disabled={nextDataYear === null}
                    onClick={() => onChange(nextDataYear)}
                >
                    <ForwardIcon/>
                </Button>
            </Col>
        </Row>;
    }

    return (
        <Row>
            <Col textColor={textColor} hoverColor={hoverColor} backgroundColor={backgroundColor}>
                <Button
                    type="primary"
                    shape="circle"
                    disabled={prevDataYear === null}
                    onClick={() => onChange(prevDataYear)}
                >
                    <BackwardIcon />
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
                    value={currentYearIntValue}
                    onChange={(val) => onChange(val)}
                />
            </ColFixed>
            <Col textColor={textColor} hoverColor={hoverColor} backgroundColor={backgroundColor}>
                <Button
                    type="primary"
                    shape="circle"
                    disabled={nextDataYear === null}
                    onClick={() => onChange(nextDataYear)}
                >
                    <ForwardIcon/>
                </Button>
            </Col>
        </Row>
    );
});

TimeSeriesYear.propTypes = {
    onChange: PropTypes.func.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    dataYears: PropTypes.arrayOf(PropTypes.number).isRequired,
    isMobile: PropTypes.bool.isRequired
};
