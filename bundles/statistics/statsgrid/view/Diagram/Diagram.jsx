import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { getDataByRegions, getValueSorter } from '../../helper/StatisticsHelper';
import { BUNDLE_KEY } from '../../constants';

const MARGIN =  {
    top: 0,
    bottom: 20,
    left: 50,
    right: 50,
    maxForLabel: 140
};

const WIDTH = 600;

const Chart = styled('div')`
    overflow-y: scroll;
    max-height: calc(100vh - 180px);
`;
const Content = styled('div')`
    margin-top: 10px;
`;

const getScaleArray = (min, max) => {
    if (min > 0) {
        return [0, max];
    }
    if (max < 0) {
        return [min, 0];
    }
    return [min, max];
};

const getDimensionsFromData = (data) => {
    const pxPerChar = 5.5;
    const xLabelOffset = 15;
    const xOffset = -5;
    const maxTicks = 10;

    // default values if couldn't calculate from data
    let left = MARGIN.left;
    let right = MARGIN.right;
    let min = 0;
    let max = 0;
    let ticks = 0;
    let height = 0;
    let positive = 0;
    let negative = 0;

    if (data) {
        height = data.length * 21;
        min = d3.min(data, (d) => d.value);
        max = d3.max(data, (d) => d.value);

        const widestLabel = d3.max(data, (d) => d.name.length);
        const labelPx = widestLabel * pxPerChar;
        let labelMargin = labelPx < MARGIN.maxForLabel ? labelPx : MARGIN.maxForLabel;
        // TODO: why chartWidt and x are calculated with default values and later updated??
        let chartWidth = WIDTH - left - right;
        const x = d3.scaleLinear().domain(getScaleArray(min, max)).range([0, chartWidth]);
        let xOrigin = x(0);
        // calculate how much space is needed for labels, if negative then label fits inside chart
        const spaceForPositive = labelMargin - xOrigin;
        const spaceForNegative = xOrigin + labelMargin - chartWidth;
        if (spaceForPositive > 0) {
            left = spaceForPositive + left / 2;
        }
        if (spaceForNegative > 0) {
            right = spaceForNegative + left / 2;
        }
        // update chart width
        chartWidth = WIDTH - left - right;
        xOrigin = x.range([0, chartWidth])(0);
        // calculate max label lengths and ticks
        positive = Math.floor((left + xOrigin - xLabelOffset) / pxPerChar);
        negative = Math.floor((right + chartWidth - xOrigin - xLabelOffset) / pxPerChar);

        const xDigits = Math.floor((Math.log(Math.max(Math.abs(min), max)) * Math.LOG10E) + 1);
        const tickTarget = Math.floor((chartWidth / xDigits) / 10);
        ticks = tickTarget > maxTicks ? maxTicks : tickTarget;
    }

    return {
        height,
        axis: { ticks, xOffset },
        margin: { left, right },
        labels: { positive, negative }
    };
};

const calculateDimensions = (data) => {
    const { top, bottom } = MARGIN;
    const { labels, axis, height, margin: { left, right } } = getDimensionsFromData(data);
    return {
        margin: { left, right, top, bottom },
        axis,
        container: { width: WIDTH, height },
        chart: {
            width: WIDTH - left - right,
            height: height - bottom - top
        },
        labels
    };
};

const getTextContent = (d, maxLength) => {
    const max = d.value < 0 ? maxLength.negative : maxLength.positive;
    if (d.name.length > max) {
        return d.name.substring(0, max - 3) + '\u2026'; // ellipsis
    }
    return d.name;
};

const getSortedData = (indicator, sortingType = 'value-descending') => {
    const data =  getDataByRegions(indicator);
    if (sortingType === 'name-ascending') {
        return data.toSorted((a, b) => d3.descending(a.name, b.name));
    }
    if (sortingType === 'name-descending') {
        return data.toSorted((a, b) => d3.ascending(a.name, b.name));
    }
    if (sortingType === 'value-ascending') {
        return data.toSorted(getValueSorter(true));
    }
    if (sortingType === 'value-descending') {
        return data.toSorted(getValueSorter(false));
    }
    return data;
};

const createGraph = (ref, labelsRef, indicator, sortOrder ) => {
    const { groups, error } = indicator.classifiedData;
    const { min, max } = indicator.data;
    const data = getSortedData(indicator, sortOrder);
    const dimensions = calculateDimensions(data);
    const { format } = Oskari.getNumberFormatter();
    let x;
    let y;
    x = d3.scaleLinear();
    y = d3.scaleBand();
    const xScaleDomain = getScaleArray(min, max);
    const yScaleDomain = data.map((d) => d.name);
    y.range([dimensions.chart?.height, 0]);
    x.range([0, dimensions.chart?.width]);

    x.domain(xScaleDomain);
    y.domain(yScaleDomain);

    let colorScale;
    if (error) {
        colorScale = d3.scaleThreshold().range(['#555']);
    } else {
        const minValues = groups.map(g => g.minValue);
        const colors = groups.map(g => g.color);
        colorScale = d3.scaleThreshold().domain(minValues).range(colors);
    }

    const svg = d3.select(ref)
        .append('svg')
        .attr('width', dimensions.container.width)
        .attr('height', dimensions.container.height)
        .append('g')
        .attr('transform', 'translate(' + dimensions.margin.left + ',' + dimensions.margin.top + ')');


    svg.each(data => {
        const { chart: { height }, axis: { ticks, xOffset } } = dimensions;
        const xAxis = d3.axisTop(x)
            .ticks(ticks)
            .tickSizeInner(-height + xOffset)
            .tickSizeOuter(0)
            .tickFormat(d => format(d));
    
        const xtickAxis = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate( 0, 0)')
        .attr('shape-rendering', 'crispEdges')
        .call(xAxis);
    
        xtickAxis.selectAll('x axis, tick, text').remove();
        xtickAxis.select('.domain').remove();
        xtickAxis.selectAll('line')
            .attr('stroke', '#eee');
    
        const { container, margin } = dimensions;
        // append the x-axis to different element so we can show the values when scrollign
        const labelheight = 12;
        const gx = d3.select(labelsRef)
            .append('svg')
            .attr('width', container.width)
            .attr('height', 12)
            .append('g')
            .attr('class', 'x axis header')
            .attr('transform', 'translate(' + margin.left + ',' + labelheight + ')')
            .call(xAxis);
    
        gx.select('.domain').remove();
        gx.selectAll('line').remove();
    });

    const labels = svg.append('g')
        .selectAll('.labels')
        .data(data)
        .enter()
        .append('g')
        .attr('class', (d) => { return d.value < 0 ? 'labels negative' : 'labels positive'; })
        .attr('transform', (d) => {
            const marginized = y(d.name) + 11;
            return 'translate(' + x(0) + ',' + marginized + ')';
        });
    // append lines
    labels.append('line')
        .attr('x2', (d) => {
            if (d.value < 0) {
                return 5;
            } else {
                return -5;
            }
        })
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', 0)
        .attr('stroke', '#aaa')
        .attr('shape-rendering', 'crispEdges');
    // append text
    const { labels: maxLabels } = dimensions;
    labels.append('text')
        .attr('text-anchor', (d) => {
            if (d.value < 0) {
                return 'start';
            }
            return 'end';
        })
        .attr('x', (d) => {
            if (d.value < 0) {
                return 8;
            } else {
                return -8;
            }
        })
        .attr('dy', '0.32em')
        .style('font-size', '11px')
        .attr('fill', '#000')
        .text((d) => {
            return getTextContent(d, maxLabels);
        });

    // bars
    const bars = svg.insert('g', 'g.y').selectAll('.bar')
        .data(data)
        .enter()
        .append('g')
        .attr('class', (d) => { return d.value < 0 ? 'negative' : 'positive'; })
        .attr('transform', (d) => {
            return 'translate(0,' + (y(d.name) + y.bandwidth() / 2) + ')';
        });

    const barWidth = (d) => {
        return d.value ? Math.abs(x(d.value) - x(0)) : 0;
    };

    // append rects
    bars.append('rect')
        .attr('class', 'bar')
        .attr('text-anchor', 'middle')
        .style('fill', (d, i) => { return colorScale(d.value); })
        .attr('y', -8) // 7 is half of 15 height (pixel aligned)
        .attr('x', (d) => { return d.value ? x(Math.min(0, d.value)) : 0; })
        .attr('height', 17)
        .attr('width', barWidth);
    // append text
    const noValStr = Oskari.getMsg(BUNDLE_KEY, 'diagram.noValue');
    bars.each((d, i, nodes) => {
        const isNumber = typeof d.value !== 'undefined';
        let textAnchor = 'start';
        let transformX = '5px';
        let locationX = x(0);
        let rendered = noValStr;
        let color = '#999';
        if (isNumber) {
            locationX = x(d.value);
            const width = barWidth(d);
            rendered = d.formatted;
            const renderedLength = typeof rendered === 'string' ? rendered.length * 8 : 0; // 8px per char (generous)
            const fitsInBar = renderedLength < width - 10; // padding of 5px + 5px
            if (fitsInBar) {
                color = Oskari.util.isDarkColor(colorScale(d.value)) ? '#fff' : '#000';
                if (d.value >= 0) {
                    textAnchor = 'end';
                    transformX = '-5px';
                }
            } else {
                color = '#333';
                if (d.value < 0) {
                    textAnchor = 'end';
                    transformX = '-5px';
                }
            }
        }
        d3.select(nodes[i])
            .append('text')
            .attr('x', locationX)
            .attr('text-anchor', textAnchor)
            .attr('dx', transformX)
            .attr('y', 0)
            .attr('dy', isNumber ? '0.425em' : '0.32em')
            .style('font-size', '11px')
            .attr('fill', color)
            .text(rendered);
    });
};

export const Diagram = ({ indicator,  sortOrder }) => {
    let ref = useRef(null);
    let labelsRef = useRef(null);
    useEffect(() => {
        if (ref?.current?.children?.length > 0) {
            ref.current.removeChild(ref.current.children[0]);
        }
        if (labelsRef?.current?.children?.length > 0) {
            labelsRef.current.removeChild(labelsRef.current.children[0]);
        }
        if (indicator) {
            createGraph(ref.current, labelsRef.current, indicator, sortOrder);
        }
    }, [indicator, sortOrder]);

    return (
        <Content>
            <div ref={labelsRef} className='statsgrid-labels' />
            <Chart>
                <div ref={ref} className='statsgrid-diagram' />
            </Chart>
        </Content>
    );
};
