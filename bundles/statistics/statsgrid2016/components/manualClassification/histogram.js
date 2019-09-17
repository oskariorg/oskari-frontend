/**
 * Draws histogram area path
 * @param {Object} svg node into which to render
 * @param {Object[]} histoData histogram layout data https://github.com/d3/d3-array/blob/master/README.md#_histogram
 * @param {Function} xScale d3 scale function
 * @param {Function} yScale d3 scale function
 * @param {Number} chartHeight in px
 */export default function histogram (svg, histoData, xScale, yScale, chartHeight) {
    const area = d3.area()
        .x((d, i) => {
            const delta = d.x1 - d.x0;
            return xScale(d.x0 + (delta * i / (histoData.length - 1)));
        })
        .y0(chartHeight)
        .y1(d => yScale(d.length))
        .curve(d3.curveBasis);

    svg.append('path')
        .datum(histoData)
        .attr('d', area);
}
