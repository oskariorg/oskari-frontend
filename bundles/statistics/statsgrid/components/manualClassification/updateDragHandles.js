/**
 * Draws / updates circles & lines representing band limits
 * @param {Object} svg node into which to render
 * @param {Object[]} handlesData values of bounds handles
 * @param {Function} xScale d3 scale function
 * @param {Function} dragBehavior d3 drag behavior
 * @param {Function} isSelected for checking if handleData is selected
 * @param {Object} opts
 */
export function updateDragHandles (svg, handlesData, xScale, dragBehavior, isSelected, isBase, opts) {
    const { histoHeight, margin } = opts;
    const y = histoHeight + 40;
    const handles = svg.selectAll('.handle')
        .data(handlesData.slice(1, -1), (d) => d.id);

    const handlesEnter = handles.enter()
        .append('g')
        .classed('handle', true)
        .call(dragBehavior);

    handlesEnter
        .append('path')
        .classed('handle-line', true)
        .attr('d', `M0 ${margin} v${y - margin}`);

    handlesEnter
        .append('circle')
        .attr('cy', y);

    const mergedHandles = handlesEnter
        .merge(handles);

    mergedHandles
        .attr('transform', (d) => `translate(${xScale(d.value)} 0)`)
        .classed('selected', isSelected)
        .classed('base', isBase)
        .filter(isSelected)
        .raise();

    mergedHandles
        .selectAll('circle')
        .attr('r', d => isSelected(d) ? 10 : 8);
}
