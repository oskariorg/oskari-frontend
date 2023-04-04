import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { playbackSpeedOptions, sliderTypes, timeUnits } from './util/constants';
import { getDifferenceCalculator, calculateSvgX } from './util/calculation';
import styled from 'styled-components';

const SliderContainer = styled('div')`
    display: flex;
    justify-content: center;
`;
const Rail = styled('rect')`
    fill: #ffffff;
    cursor: pointer;
`;
const RailGroup = styled('g')`
`;
const DataPoint = styled('circle')`
    fill: #3c3c3c;
    cursor: pointer;
    &:hover + .data-tooltip {
        visibility: visible;
    }
`;
const DataTooltip = styled('text')`
    font-size: 14px;
    font-variant: tabular-nums;
    font-feature-settings: 'tnum';
    fill: #ffffff;
    visibility: hidden;
`;
const Marker = styled('text')`
    fill: #ffffff;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;
const Handle = styled('rect')`
    fill: #ecb900;
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
    return dataPoints.find(point => point.x === closest).data;
}

const SVG_PADDING = 35;
const POINT_RADIUS = 3;
const HANDLE_WIDTH = 8;
const ACTIVE_COLOR = '#ecb900';

export const TimeSeriesSlider = ({
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
    const lineWidth = width - (SVG_PADDING * 2);
    const calculator = getDifferenceCalculator(type === sliderTypes.YEAR ? timeUnits.YEAR : timeUnits.DAY);
    const widthUnit = lineWidth / calculator(max, min);

    const [state, setState] = useState({
        sliderPoints: [],
        handleX: range ? calcHandlePosition(value[0], min, widthUnit, HANDLE_WIDTH, timeUnits.YEAR) : calcHandlePosition(value, min, widthUnit, 8, timeUnits.YEAR),
        secondHandleX: range ? calcHandlePosition(value[1], min, widthUnit, HANDLE_WIDTH, timeUnits.YEAR) : 0,
        dragElement: null,
        dragOffsetX: null
    });

    useEffect(() => {
        if (range) {
            setState({
                ...state,
                handleX: calcHandlePosition(value[0], min, widthUnit, HANDLE_WIDTH, timeUnits.YEAR),
                secondHandleX: calcHandlePosition(value[1], min, widthUnit, HANDLE_WIDTH, timeUnits.YEAR)
            });
        } else {
            setState({
                ...state,
                handleX: calcHandlePosition(value, min, widthUnit, HANDLE_WIDTH, timeUnits.YEAR)
            });
        }
    }, [value, value[0], value[1]]);

    useEffect(() => {
        let points = dataPoints.map((data) => ({
            data,
            x: calcDataPointX(data, widthUnit, min, (POINT_RADIUS * 2), calculator)
        }));
        setState({
            ...state,
            sliderPoints: points
        });
    }, [dataPoints]);

    const onHandlePositionChange = (e) => {
        const svgX = calculateSvgX(e.clientX, e.target);
        const snap = findSnapPoint(svgX, state.sliderPoints);
        handleChange(snap);
    };

    const handleChange = (val) => {
        if (range) {
            const valueToChange = value.indexOf([...value].sort((a, b) => Math.abs(val - a) - Math.abs(val - b))[0]);
            const newValue = value;
            newValue[valueToChange] = val;
            onChange(newValue);
        } else {
            onChange(val)
        }
    }

    const startDrag = (e) => {
        if (!state.dragElement) {
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
            e.preventDefault();
            e.stopPropagation();
            const position = calculateSvgX(e.clientX, state.dragElement);
            if (position >= 0 && position <= lineWidth) {
                state.dragElement.setAttributeNS(null, 'x', position - state.dragOffsetX);
            }
        }
    };

    const endDrag = (e) => {
        if (state.dragElement) {
            setState({
                ...state,
                dragElement: null,
                dragOffsetX: null
            });
            onHandlePositionChange(e);
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
            >
                <RailGroup
                    transform={`translate(${SVG_PADDING}, 25)`}
                >
                    {markers.map(mark => (
                        <Marker
                            key={mark}
                            transform={`translate(${calcDataPointX(mark, widthUnit, min, 35, calculator)}, -10)`}
                            width={35}
                        >
                            {mark}
                        </Marker>
                    ))}
                    <g onClick={(e) => onHandlePositionChange(e)}>
                        <Rail className='slider-rail' width={lineWidth} height={3} />
                        {range && (
                            <line x1={state.handleX} x2={state.secondHandleX} y1={1} y2={1} stroke='#ecb900' strokeWidth={3} />
                        )}
                    </g>
                    {state.sliderPoints.map((point, index) => (
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
                                stroke={
                                    !range ? (
                                        value === point.data ? ACTIVE_COLOR : '#ffffff'
                                    ) : (
                                        point.data >= value[0] && point.data <= value[1] ? ACTIVE_COLOR : '#ffffff'
                                    )
                                }
                                strokeWidth={2}
                            />
                            <DataTooltip className='data-tooltip' y={35}>
                                {point.data}
                            </DataTooltip>
                        </g>
                    ))}
                    <Handle
                        className='handle1'
                        stroke='#000000'
                        rx={HANDLE_WIDTH / 2}
                        strokeWidth={1}
                        width={HANDLE_WIDTH}
                        height={HANDLE_WIDTH * 2}
                        x={state.handleX}
                        y={-7}
                        onMouseDown={(e) => startDrag(e)}
                    />
                    {range && (
                        <Handle
                            className='handle2'
                            stroke='#000000'
                            rx={HANDLE_WIDTH / 2}
                            strokeWidth={1}
                            width={HANDLE_WIDTH}
                            height={HANDLE_WIDTH * 2}
                            x={state.secondHandleX}
                            y={-7}
                            onMouseDown={(e) => startDrag(e)}
                        />
                    )}
                </RailGroup>
            </svg>
        </SliderContainer>
    );
};

TimeSeriesSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    dataPoints: PropTypes.arrayOf(
        PropTypes.oneOfType(
            [PropTypes.number, PropTypes.string]
        )
    ),
    onChange: PropTypes.func.isRequired,
    width: PropTypes.number,
    markers: PropTypes.arrayOf(
        PropTypes.oneOfType(
            [PropTypes.number, PropTypes.string]
        )
    ),
    type: PropTypes.oneOf([sliderTypes.YEAR, sliderTypes.DATE]),
    range: PropTypes.bool,
    value: PropTypes.oneOfType(
        [
            PropTypes.number,
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
        ]
    )
};
