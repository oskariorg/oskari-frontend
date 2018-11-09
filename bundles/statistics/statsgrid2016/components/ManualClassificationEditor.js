const width = 500;
const height = 300;
const histoHeight = 200;

export default class ManualClassificationEditor {
    constructor (el, count, manualBounds, indicatorData, changeCallback) {
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
            .range([0, width]);

        const area = d3.area()
            .x(d => x((d.x1 + d.x0) / 2))
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
            const handles = dragHandles.selectAll('.handle')
                .data(handlesData.slice(1, -1), (d) => d.id);

            const handlesEnter = handles.enter()
                .append('g')
                .attr('class', 'handle');

            handlesEnter
                .append('circle')
                .attr('r', 15)
                .attr('cy', height - 50)
                .attr('fill', 'red');

            handlesEnter
                .call(dragBehavior)
                .merge(handles)
                .attr('transform', (d) => `translate(${x(d.value)} 0)`);
        }
        update();
    }
}
