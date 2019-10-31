export class Scale {
    constructor ({ min, max, rangeMin, rangeMax, outOfRange }) {
        this.min = min;
        this.max = max;
        this.rangeMin = rangeMin;
        this.rangeMax = rangeMax;
        this.outOfRange = outOfRange;
        if (typeof d3 !== 'undefined') {
            this.scale = d3.scaleLinear()
                .domain([min, max])
                .range([rangeMin, rangeMax]);
        }
    }
    getValue (domainVal) {
        if (domainVal < this.min || domainVal > this.max) {
            return this.outOfRange;
        }
        if (this.scale) {
            return this.scale(domainVal);
        }
        return this.outOfRange;
    }
};
