const width = 500;
const height = 300;
const margin = 10;
const histoHeight = 200;

export default function manualClassificationEditor (el, manualBounds, indicatorData, colorSet, changeCallback) {
    const svg = d3.select(el)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const histoGroup = svg.append('g');
    const dragHandles = svg.append('g');

    const histogramGenerator = d3.histogram().thresholds(20);

    const histoData = histogramGenerator(indicatorData);

    const y = d3.scaleLinear()
        .domain([0, d3.max(histoData, (d) => d.length)])
        .range([histoHeight, 0]);

    const x = d3.scaleLinear()
        .domain([manualBounds[0], manualBounds[manualBounds.length - 1]])
        .clamp(true)
        .range([margin, width - margin]);

    const area = d3.area()
        .x((d, i) => {
            const delta = d.x1 - d.x0;
            return x(d.x0 + (delta * i / (histoData.length - 1)));
        })
        .y0(y(0))
        .y1(d => y(d.length))
        .curve(d3.curveBasis);

    // TODO use as clipping path!
    histoGroup.append('path')
        .datum(histoData)
        .attr('fill', 'steelblue')
        .attr('d', area);

    const handlesData = manualBounds.map((d, i) => ({ value: d, id: i }));

    const notify = () => {
        changeCallback(handlesData.map((d) => d.value));
    };

    const dragBehavior = d3.drag()
        .subject(function (d) {
            return { x: x(d.value), y: d3.event.y };
        })
        .on('drag', function (d) {
            var newX = d3.event.x;
            d.value = x.invert(newX);
            update();
        })
        .on('end', notify);

    function update () {
        // BAND BLOCKS

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

        const blocks = histoGroup.selectAll('.block')
            .data(blockData);

        const blocksEnter = blocks.enter()
            .append('rect')
            .attr('class', 'block')
            .attr('y', 0)
            .attr('height', histoHeight)
            .attr('fill', (d, i) => `#${colorSet[i]}`)
            .merge(blocks)
            .attr('x', (d) => x(d.x0))
            .attr('width', d => x(d.x1) - x(d.x0));

        /// HANDLES

        const handles = dragHandles.selectAll('.handle')
            .data(handlesData.slice(1, -1), (d) => d.id);

        const handlesEnter = handles.enter()
            .append('g')
            .attr('class', 'handle');

        handlesEnter
            .append('circle')
            .attr('r', 10)
            .attr('cy', height - 50)
            .attr('fill', 'red');

        handlesEnter
            .call(dragBehavior)
            .merge(handles)
            .attr('transform', (d) => `translate(${x(d.value)} 0)`);
    }
    update();
}
