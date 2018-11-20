import histogram from './histogram';
import edgeLines from './edgeLines';
import inputGuide from './inputGuide';
import updateBandBlocks from './updateBandBlocks';
import updateDragHandles from './updateDragHandles';

const width = 500;
const height = 303;
const margin = 12;
const histoHeight = 200;

/**
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

    const histoClip = svg.append('defs').append('clipPath').attr('id', 'histoClip');
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

    // HISTOGRAM CLIP PATH
    histogram(histoClip, histoData, x, y, height);

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
    edgeLines(boundsLines, handlesData, x, histoHeight);

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
        updateBandBlocks(histoGroup, handlesData, x, colorSet, histoHeight);
        updateDragHandles(dragHandles, handlesData, x, dragBehavior, isSelected, histoHeight);

        if (skipInput) {
            return;
        }

        // VALUE INPUT
        const selectedvalue = handlesData.find(isSelected).value;
        valueInput.property('value', selectedvalue).classed('fail', false);

        // VALUE INPUT GUIDE BOX
        inputGuide(guide, x, 50, histoHeight + 50, x(selectedvalue));
    }
    update();
}
