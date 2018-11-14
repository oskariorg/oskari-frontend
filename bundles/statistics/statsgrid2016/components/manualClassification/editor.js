import inputGuide from './inputGuide';

const width = 500;
const height = 303;
const margin = 12;
const histoHeight = 200;

/**
 * @function manualClassificationEditor
 * Creates classification editor into given DOM node
 * @param {HTMLElement} el DOM node
 * @param {Number[]} manualBounds class bounds at start of editing
 * @param {Number[]} indicatorData dataset values 
 * @param {String[]} colorSet colors corresponding to classes
 * @param {Function} changeCallback function that is called with updated bounds, when user makes changes
 */
export default function manualClassificationEditor (el, manualBounds, indicatorData, colorSet, changeCallback) {
    const svg = d3.select(el)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const defs = svg.append('defs');
    const histoClip = defs.append('clipPath').attr('id', 'histoClip');
    const guide = svg.append('g');
    const histoGroup = svg.append('g').attr('clip-path', 'url(#histoClip)');
    const boundsLines = svg.append('g');
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
        .y0(height)
        .y1(d => y(d.length))
        .curve(d3.curveBasis);

    // HISTOGRAM CLIP PATH
    histoClip.append('path')
        .datum(histoData)
        .attr('d', area);

    const handlesData = manualBounds.map((d, i) => ({ value: d, id: i }));

    let selectedId = handlesData[1].id;
    const isSelected = d => d.id === selectedId;

    const notify = () => {
        changeCallback(handlesData.map((d) => d.value));
    };

    const dragBehavior = d3.drag()
        .subject((d) => {
            return { x: x(d.value), y: d3.event.y };
        })
        .on('start', (d) => {
            selectedId = d.id;
            update();
        })
        .on('drag', (d) => {
            var newX = d3.event.x;
            d.value = x.invert(newX);
            selectedId = d.id;
            update();
        })
        .on('end', notify);

    // BOUNDS EDGES

    const formatter = Oskari.getNumberFormatter(2);

    const bounds = boundsLines.selectAll('.edge')
        .data([handlesData[0], handlesData[handlesData.length - 1]]);

    const boundsEnter = bounds
        .enter()
        .append('g')
        .classed('edge', true)
        .attr('transform', (d) => `translate(${x(d.value)} 0)`);

    boundsEnter
        .append('path')
        .attr('d', `M0 0 v${histoHeight + 10}`);

    boundsEnter
        .append('text')
        .attr('y', histoHeight)
        .attr('dy', '1em')
        .attr('x', (d, i) => i ? -3 : 3)
        .attr('text-anchor', (d, i) => i ? 'end' : 'start')
        .text((d) => formatter.format(d.value));

    // VALUE INPUT INIT & INTERACTION

    const parseValidateInput = (value) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            return null;
        }
        if (parsed < x.domain()[0]) {
            return x.domain()[0];
        }
        if (parsed > x.domain()[1]) {
            return x.domain()[1];
        }
        return parsed;
    };

    const valueInput = d3.select(el).append('div')
        .classed('input-area', true)
        .append('input')
        .attr('type', 'text')
        .on('input', () => {
            const value = valueInput.property('value');
            const validated = parseValidateInput(value);
            valueInput.classed('fail', validated === null);
            if (validated === null) {
                return;
            }
            handlesData.find(isSelected).value = validated;
            update(true);
            notify();
        })
        .on('blur', () => {
            update();
        });

    function update (skipInput) {
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

        blocks.enter()
            .append('rect')
            .attr('class', 'block')
            .attr('y', 0)
            .attr('height', histoHeight)
            .attr('fill', (d, i) => `#${colorSet[i]}`)
            .merge(blocks)
            .attr('x', (d) => x(d.x0))
            .attr('width', d => 1 + x(d.x1) - x(d.x0));

        /// HANDLES

        const handles = dragHandles.selectAll('.handle')
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
            .attr('transform', (d) => `translate(${x(d.value)} 0)`)
            .classed('selected', isSelected)
            .filter(isSelected)
            .raise();

        mergedHandles
            .selectAll('circle')
            .attr('r', d => isSelected(d) ? 10 : 8);

        if (skipInput) {
            return;
        }
        // VALUE INPUT UPDATE

        const selectedvalue = handlesData.find(isSelected).value;

        valueInput.property('value', selectedvalue).classed('fail', false);

        // VALUE INPUT GUIDE BOX

        inputGuide(guide, x, 50, histoHeight + 50, x(selectedvalue));
    }
    update();
}
