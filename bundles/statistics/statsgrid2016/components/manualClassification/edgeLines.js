/**
 * Draws right/left edges (min/max bounds values) of chart
 * @param {Object} svg node into which to render
 * @param {Object[]} handlesData values of bounds handles
 * @param {Function} xScale d3 scale function
 * @param {Number} histoHeight height of histogram area in px
 */
export function edgeLines (svg, handlesData, xScale, yScale, histoHeight) {
    const formatter = Oskari.getNumberFormatter(2);

    const left = handlesData[0].value;
    const right = handlesData[handlesData.length - 1].value;
    const bounds = svg.selectAll('.edge')
        .data([left, right]);

    const yAxis = d3.axisLeft(yScale)
        .ticks(4);
    svg.append('g')
        .classed('edge', true)
        .attr('transform', `translate(${xScale(left)} 0)`)
        .call(yAxis);

    const boundsEnter = bounds
        .enter()
        .append('g')
        .classed('edge', true)
        .attr('transform', (d) => `translate(${xScale(d)} 0)`);

    boundsEnter
        .append('path')
        .attr('d', `M0 0 v${histoHeight + 10}`);

    boundsEnter
        .append('text')
        .attr('y', histoHeight)
        .attr('dy', '1em')
        .attr('x', (d, i) => i ? -3 : 3)
        .attr('text-anchor', (d, i) => i ? 'end' : 'start')
        .text((d) => formatter.format(d));
}
