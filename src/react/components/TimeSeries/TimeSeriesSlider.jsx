import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { sliderTypes, timeUnits } from './util/constants';
import { getDifferenceCalculator, calculateSvgX } from './util/calculation';
import { getNavigationTheme } from 'oskari-ui/theme/ThemeHelper';
import { ThemeConsumer } from 'oskari-ui/util';
import styled from 'styled-components';

const SliderContainer = styled('div')`
    display: flex;
    justify-content: center;
`;
const Rail = styled('rect')`
    fill: ${props => props.$theme.getTextColor()};
    cursor: pointer;
`;
const ActiveRail = styled('line')`
    cursor: pointer;
`;
const DataPoint = styled('circle')`
    fill: ${props => props.$theme.getButtonColor()};
    cursor: pointer;
    &:hover + .data-tooltip {
        visibility: visible;
    }
`;
const DataTooltip = styled('text')`
    font-size: 14px;
    font-variant: tabular-nums;
    font-feature-settings: 'tnum';
    fill: ${props => props.$theme.getTextColor()};
    visibility: hidden;
`;
const Marker = styled('text')`
    fill: ${props => props.$theme.getTextColor()};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;
const LineMarker = styled('rect')`
    fill: ${props => props.$theme.getButtonColor()};
`;
const Handle = styled('rect')`
    fill: ${props => props.$theme.getButtonHoverColor()};
    cursor: pointer;
`;

const calcDataPointX = (data, widthUnit, min, elemWidth, calculator) => {
    const differenceToStart = calculator(data, min);
    return (differenceToStart * widthUnit) - (elemWidth / 2)
}

const calcHandlePosition = (data, min, widthUnit, elemWidth, unit) => {
    const calculator = getDifferenceCalculator(unit);
    const differenceToStart = calculator(data, min);
    return (differenceToStart * widthUnit) - (elemWidth / 2);
}

const findSnapPoint = (x, dataPoints) => {
    const xArray = dataPoints.map(point => point.x);
    const closest = xArray.sort((a, b) => Math.abs(x - a) - Math.abs(x - b))[0];
    return dataPoints.find(point => point.x === closest);
}

const SVG_PADDING = 35;
const POINT_RADIUS = 3;
const HANDLE_WIDTH = 8;

export const TimeSeriesSlider = ThemeConsumer(({
    theme = {},
    min,
    max,
    dataPoints,
    markers,
    onChange,
    width = 524,
    type = sliderTypes.YEAR,
    range = false,
    value
}) => {
    const navigationTheme = getNavigationTheme(theme);
    const lineWidth = width - (SVG_PADDING * 2);
    const calculator = getDifferenceCalculator(type === sliderTypes.YEAR ? timeUnits.YEAR : timeUnits.DAY);
    const widthUnit = lineWidth / calculator(max, min);

    const [state, setState] = useState({
        dragElement: null,
        dragOffsetX: null
    });
    const xValue = range ? value[0] : value;
    const handleX = calcHandlePosition(xValue, min, widthUnit, HANDLE_WIDTH, timeUnits.YEAR);
    const secondHandleX = range ? calcHandlePosition(value[1], min, widthUnit, HANDLE_WIDTH, timeUnits.YEAR) : 0;

    const sliderPoints = dataPoints.map((data) => ({
        data,
        x: calcDataPointX(data, widthUnit, min, (POINT_RADIUS * 2), calculator)
    }));

    const onHandlePositionChange = (e, target) => {
        const svgX = calculateSvgX(e.clientX, target);
        const snap = findSnapPoint(svgX, sliderPoints);
        target.setAttributeNS(null, 'x', snap.x - state.dragOffsetX);
        handleChange(snap.data, target.id);
    };

    const onRailClick = (e) => {
        const svgX = calculateSvgX(e.clientX, e.target);
        const snap = findSnapPoint(svgX, sliderPoints);
        handleChange(snap.data);
    };

    const handleChange = (val, el) => {
        if (range) {
            const newValue = [...value];
            if (el) {
                // handle drag
                if (el === 'handle1') {
                    if (val > value[1]) {
                        newValue[1] = val;
                        newValue[0] = value[1]
                    } else {
                        newValue[0] = val;
                    }
                } else {
                    if (val < value[0]) {
                        newValue[0] = val;
                        newValue[1] = value[0]
                    } else {
                        newValue[1] = val;
                    }
                }
            } else {
                // click on timeline
                const sorted = [...value].sort((a, b) => Math.abs(val - a) - Math.abs(val - b));
                const valueToChange = value.indexOf(sorted[0]);
                newValue[valueToChange] = val;
            }
            newValue.sort((a, b) => a - b);
            onChange(newValue);
        } else {
            onChange(val)
        }
    };

    const startDrag = (e) => {
        if (!state.dragElement) {
            if (e.changedTouches) e = e.changedTouches[0];
            const svgX = calculateSvgX(e.clientX, e.target);
            const offsetX = svgX - e.target.getAttributeNS(null, 'x');
            setState({
                ...state,
                dragElement: e.target,
                dragOffsetX: offsetX
            });
        }
    };

    const drag = (e) => {
        if (state.dragElement) {
            if (e.changedTouches) {
                e = e.changedTouches[0];
            } else {
                e.preventDefault();
                e.stopPropagation();
            }
            const position = calculateSvgX(e.clientX, state.dragElement);
            if (position >= 0 && position <= lineWidth) {
                state.dragElement.setAttributeNS(null, 'x', position - state.dragOffsetX);
            }
        }
    };

    const endDrag = (e) => {
        if (state.dragElement) {
            if (e.changedTouches) e = e.changedTouches[0];
            onHandlePositionChange(e, state.dragElement);
            setState({
                ...state,
                dragElement: null,
                dragOffsetX: null
            });
        }
    };

    return (
        <SliderContainer>
            <svg
                width={width}
                height={75}
                onMouseMove={(e) => drag(e)}
                onMouseUp={(e) => endDrag(e)}
                onMouseLeave={(e) => endDrag(e)}
                onTouchMove={(e) => drag(e)}
                onTouchCancel={(e) => endDrag(e)}
                onTouchEnd={(e) => endDrag(e)}
            >
                <g
                    transform={`translate(${SVG_PADDING}, 37.5)`}
                >
                    <g onClick={(e) => onRailClick(e)}>
                        <Rail className='slider-rail' width={lineWidth} height={3} $theme={navigationTheme} />
                        {range && (
                            <ActiveRail x1={handleX} x2={secondHandleX} y1={1.5} y2={1.5} stroke={navigationTheme.getButtonHoverColor()} strokeWidth={3} />
                        )}
                        {markers.map((mark, index) => {
                            return (
                                <Fragment key={mark}>
                                    <Marker
                                        key={mark}
                                        transform={`translate(${calcDataPointX(mark, widthUnit, min, 35, calculator)}, -10)`}
                                        width={35}
                                        $theme={navigationTheme}
                                    >
                                        {mark}
                                    </Marker>
                                    <LineMarker key={`line-marker-${index}`} $theme={navigationTheme} width={2} height={3} transform={`translate(${calcDataPointX(mark, widthUnit, min, 2, calculator)}, 0)`} />
                                </Fragment>
                            )
                        })}
                    </g>
                    {sliderPoints.map((point, index) => (
                        <g
                            key={index}
                            className='slider-data-point'
                            transform={`translate(${point.x}, -2)`}
                            onClick={(e) => {
                                handleChange(point.data);
                                e.stopPropagation();
                            }}
                        >
                            <DataPoint
                                cx={POINT_RADIUS}
                                cy={POINT_RADIUS}
                                r={POINT_RADIUS}
                                $theme={navigationTheme}
                                stroke={
                                    !range ? (
                                        value === point.data ? navigationTheme.getButtonHoverColor() : navigationTheme.getTextColor()
                                    ) : (
                                        point.data >= value[0] && point.data <= value[1] ? navigationTheme.getButtonHoverColor() : navigationTheme.getTextColor()
                                    )
                                }
                                strokeWidth={2}
                            />
                            <DataTooltip className='data-tooltip' y={35} $theme={navigationTheme}>
                                {point.data}
                            </DataTooltip>
                        </g>
                    ))}
                    <Handle
                        id='handle1'
                        stroke='#000000'
                        rx={HANDLE_WIDTH / 2}
                        strokeWidth={1}
                        width={HANDLE_WIDTH}
                        height={HANDLE_WIDTH * 2}
                        x={handleX}
                        y={-7}
                        onMouseDown={(e) => startDrag(e)}
                        $theme={navigationTheme}
                        onTouchStart={(e) => startDrag(e)}
                    />
                    {range && (
                        <Handle
                            id='handle2'
                            stroke='#000000'
                            rx={HANDLE_WIDTH / 2}
                            strokeWidth={1}
                            width={HANDLE_WIDTH}
                            height={HANDLE_WIDTH * 2}
                            x={secondHandleX}
                            y={-7}
                            onMouseDown={(e) => startDrag(e)}
                            $theme={navigationTheme}
                            onTouchStart={(e) => startDrag(e)}
                        />
                    )}
                </g>
            </svg>
        </SliderContainer>
    );
});

TimeSeriesSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    dataPoints: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    width: PropTypes.number,
    markers: PropTypes.any,
    type: PropTypes.oneOf([sliderTypes.YEAR, sliderTypes.DATE]),
    range: PropTypes.bool,
    value: PropTypes.any
};
