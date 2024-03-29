/**
 * Draws histogram bars
 * @param {Object} svg node into which to render
 * @param {Object[]} histoData histogram layout data https://github.com/d3/d3-array/blob/master/README.md#_histogram
 * @param {Function} xScale d3 scale function
 * @param {Function} yScale d3 scale function
 * @param {Object} opts
 */
export function histogram (svg, histoData, xScale, yScale, opts) {
    const { height, margin } = opts;
    histoData.forEach((d) => {
        svg.append('rect')
            .attr('x', xScale(d.x0))
            .attr('y', yScale(d.length) + margin)
            .attr('width', xScale(d.x1) - xScale(d.x0))
            .attr('height', height)
            .attr('shape-rendering', 'crispEdges');
    });
}
