/**
 * Draws / updates colored rectangles representing classification bands
 * @param {Object} svg node into which to render
 * @param {Object[]} handlesData values of bounds handles
 * @param {Function} xScale d3 scale function
 * @param {String[]} colorSet classification colors, hex without #
 * @param {Number} histoHeight height of histogram area in px
 */
export default function updateBandBlocks (svg, handlesData, xScale, colorSet, histoHeight) {
    const blockData = handlesData
        .sort((a, b) => {
            return a.value - b.value;
        })
        .slice(0, -1) // skip last
        .map((b, i) => {
            return {
                x0: b.value,
                x1: handlesData[i + 1].value
            };
        });

    const blocks = svg.selectAll('.block')
        .data(blockData);

    blocks.enter()
        .append('rect')
        .attr('class', 'block')
        .attr('y', 0)
        .attr('height', histoHeight)
        .attr('fill', (d, i) => `#${colorSet[i]}`)
        .merge(blocks)
        .attr('x', (d) => xScale(d.x0))
        .attr('width', d => 1 + xScale(d.x1) - xScale(d.x0));
}
