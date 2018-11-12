const arrowSize = 8;

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
