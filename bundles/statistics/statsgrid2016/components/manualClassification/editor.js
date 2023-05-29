import { histogram } from './histogram';
import { edgeLines } from './edgeLines';
import { inputGuide } from './inputGuide';
import { updateBandBlocks } from './updateBandBlocks';
import { updateDragHandles } from './updateDragHandles';
import * as d3 from 'd3';

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
export function manualClassificationEditor (el, manualBounds, indicatorData, colorSet, activeId, fractionDigits, base, changeCallback, disabled) {
    const svg = d3.select(el)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const histoClip = svg.append('defs').append('clipPath').attr('id', 'histoClip');
    const guide = svg.append('g');
    const histoGroup = svg.append('g').attr('clip-path', 'url(#histoClip)');
    const boundsLines = svg.append('g');
    const dragHandles = svg.append('g');

    const histogramGenerator = d3.histogram().thresholds(50);
    const histoData = histogramGenerator(indicatorData);

    const y = d3.scaleLinear()
        .domain([0, d3.max(histoData, (d) => d.length)])
        .range([histoHeight, 0]);

    const x = d3.scaleLinear()
        .domain([manualBounds[0], manualBounds[manualBounds.length - 1]])
        .clamp(true)
        .range([margin * 2, width - margin]); // double left margin to get more space for tick labels

    // HISTOGRAM CLIP PATH
    histogram(histoClip, histoData, x, y, height);

    const handlesData = manualBounds.map((d, i) => ({ value: d, id: i }));

    let selected = handlesData[1];
    if (activeId && activeId > 0 && activeId < manualBounds.length - 1) {
        selected = handlesData[activeId];
    }
    const isSelected = d => d.id === selected.id;
    const isBase = d => typeof base !== 'undefined' && base === d.value;
    const notify = () => {
        const index = handlesData.findIndex(d => d === selected);
        changeCallback(handlesData.map((d) => d.value), index);
    };

    const dragBehavior = d3.drag()
        .subject((event, d) => {
            return { x: x(d.value), y: event.y };
        })
        .on('start', (event, d) => {
            selected = d;
            update();
        })
        .on('drag', (event, d) => {
            if (disabled) return null;
            const newX = event.x;
            d.value = x.invert(newX);
            selected = d;
            update();
        })
        .on('end', notify);

    // BOUNDS EDGES
    edgeLines(boundsLines, handlesData, x, y, histoHeight);

    // VALUE INPUT INIT & INTERACTION

    const parseValidateInput = (value) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            return null;
        }
        if (parsed < x.domain()[0]) {
            return null;
        }
        if (parsed > x.domain()[1]) {
            return null;
        }
        return parsed;
    };

    const valueInput = d3.select(el).append('div')
        .classed('input-area', true)
        .append('input')
        .attr('type', 'text')
        .attr('disabled', disabled ? true : null)
        .on('input', () => {
            const value = valueInput.property('value');
            const validated = parseValidateInput(value);
            valueInput.classed('fail', validated === null);
            if (validated === null) {
                return;
            }
            selected.value = validated;
            update(true);
        })
        .on('blur', () => {
            update();
            notify();
        });

    function update (skipInput) {
        updateBandBlocks(histoGroup, handlesData, x, colorSet, histoHeight);
        updateDragHandles(dragHandles, handlesData, x, dragBehavior, isSelected, isBase, histoHeight);

        if (skipInput) {
            return;
        }

        // VALUE INPUT
        const { value } = selected;
        const fixed = typeof value === 'number' ? value.toFixed(fractionDigits) : value;
        valueInput.property('value', fixed).classed('fail', false);

        // VALUE INPUT GUIDE BOX
        inputGuide(guide, x, 50, histoHeight + 50, x(value));
    }
    update();
}
