import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { Select } from 'oskari-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Col, ColFixed, Row } from './styled';
import { YearRangeSlider } from './YearRangeSlider';
import { IconButton } from 'oskari-ui/components/buttons';

const ICON_PROPS = {
    iconSize: 18,
    shape: 'circle',
    bordered: true
};
const StyledIcon = styled(IconButton)`
    border-width: 2px;
`;

export const TimeSeriesYear = ({ onChange, start, end, value, dataYears, isMobile, iconColor }) => {
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
    const iconProps = { ...ICON_PROPS, color: iconColor };

    if (isMobile) {
        const disabledYear = dataYears.includes(currentYearIntValue) ? null : currentYearIntValue;
        // need to clone this, otherwise the "current year" will remain even if we switch to a valid year without panning the map
        const years = disabledYear ? [...dataYears, disabledYear].sort() : dataYears;
        const options = years.map(value => ({
            label: value,
            value,
            disabled: value === disabledYear
        }));

        return (
            <Row>
                <Col>
                    <StyledIcon { ...iconProps }
                        icon={<StepBackwardOutlined/>}
                        disabled={prevDataYear === null}
                        onClick={() => onChange(prevDataYear)} />
                </Col>
                <Col>
                    <Select value={currentYearIntValue} onChange={(value) => onChange(parseInt(value))} options={options} />
                </Col>
                <Col>
                    <StyledIcon { ...iconProps }
                        icon={<StepForwardOutlined/>}
                        disabled={nextDataYear === null}
                        onClick={() => onChange(nextDataYear)}/>
                </Col>
            </Row>
        );
    }

    return (
        <Row>
            <Col>
                <StyledIcon { ...iconProps }
                    icon={<StepBackwardOutlined/>}
                    disabled={prevDataYear === null}
                    onClick={() => onChange(prevDataYear)} />
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
            <Col>
                <StyledIcon { ...iconProps }
                    icon={<StepForwardOutlined/>}
                    disabled={nextDataYear === null}
                    onClick={() => onChange(nextDataYear)} />
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
    isMobile: PropTypes.bool.isRequired,
    iconColor: PropTypes.string
};
