const arrowSize = 8;
/**
 * Creates / updates SVG path making up a box with triagle that points to the given cursor location
 * @param {Object} svg node into which to render
 * @param {Function} xScale d3 scale function
 * @param {Number} height box height
 * @param {Number} yZero loacation of box to edge
 * @param {Number} cursorLocation pixel location in x direction where to draw triangle
 */
export default function inputGuide (svg, xScale, height, yZero, cursorLocation) {
    const guide = svg.selectAll('.guide')
        .data([cursorLocation]);

    guide.enter()
        .append('path')
        .classed('guide', true)
        .attr('clip-path', 'url(#histoClip)')
        .merge(guide)
        .attr('d', (d) => {
            let [minRange, maxRange] = xScale.range();
            minRange -= arrowSize;
            maxRange += arrowSize;
            return `M${minRange} ${yZero + height} V ${yZero} H${Math.max(minRange, cursorLocation - arrowSize)} L${cursorLocation} ${yZero - arrowSize} L${Math.min(maxRange, cursorLocation + arrowSize)} ${yZero} H${maxRange} V${yZero + height} Z`;
        });
}
