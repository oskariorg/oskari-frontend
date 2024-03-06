import * as d3 from 'd3';
const TICKS = 4;
/**
 * Draws right/left edges (min/max bounds values) of chart
 * @param {Object} svg node into which to render
 * @param {Object[]} handlesData values of bounds handles
 * @param {Function} xScale d3 scale function
 * @param {Object} opts
 */
export function edgeLines (svg, handlesData, xScale, yScale, opts) {
    const { histoHeight, fractionDigits = 1, highestBar, margin } = opts;
    const formatter = Oskari.getNumberFormatter(fractionDigits);
    // For small datasets integer ticks might show same values => decrease
    const ticks = highestBar > TICKS ? TICKS : highestBar;
    const left = handlesData[0].value;
    const right = handlesData[handlesData.length - 1].value;
    const bounds = svg.selectAll('.edge')
        .data([left, right]);

    const yAxis = d3.axisLeft(yScale)
        .ticks(ticks, 'd');
    svg.append('g')
        .classed('edge', true)
        .attr('transform', `translate(${xScale(left)} ${margin})`)
        .call(yAxis);

    const boundsEnter = bounds
        .enter()
        .append('g')
        .classed('edge', true)
        .attr('transform', (d) => `translate(${xScale(d)} ${margin})`);

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
