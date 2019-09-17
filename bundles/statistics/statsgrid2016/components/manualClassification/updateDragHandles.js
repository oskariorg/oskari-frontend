/**
 * Draws / updates circles & lines representing band limits
 * @param {Object} svg node into which to render
 * @param {Object[]} handlesData values of bounds handles
 * @param {Function} xScale d3 scale function
 * @param {Function} dragBehavior d3 drag behavior
 * @param {Function} isSelected for checking if handleData is selected
 * @param {Number} histoHeight height of histogram area in px
 */
export default function updateDragHandles (svg, handlesData, xScale, dragBehavior, isSelected, histoHeight) {
    const handles = svg.selectAll('.handle')
        .data(handlesData.slice(1, -1), (d) => d.id);

    const handlesEnter = handles.enter()
        .append('g')
        .classed('handle', true)
        .call(dragBehavior);

    handlesEnter
        .append('path')
        .classed('handle-line', true)
        .attr('d', `M0 0 v${histoHeight + 25}`);

    handlesEnter
        .append('circle')
        .attr('cy', histoHeight + 25);

    const mergedHandles = handlesEnter
        .merge(handles);

    mergedHandles
        .attr('transform', (d) => `translate(${xScale(d.value)} 0)`)
        .classed('selected', isSelected)
        .filter(isSelected)
        .raise();

    mergedHandles
        .selectAll('circle')
        .attr('r', d => isSelected(d) ? 10 : 8);
}
