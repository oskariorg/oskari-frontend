export class Scale {
    constructor ({ min, max, rangeMin, rangeMax, outOfRange }) {
        this.min = min;
        this.max = max;
        this.rangeMin = rangeMin;
        this.rangeMax = rangeMax;
        this.outOfRange = outOfRange;
    }
    getValue (domainVal) {
        if (domainVal < this.min || domainVal > this.max) {
            return this.outOfRange;
        }
        return this.outOfRange;
    }
};
