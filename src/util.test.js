import Oskari from './oskari.es6.js';
import util from './util.js';

describe('throttle function', () => {

    test('with leading false waits given time before calling function again', () => {

        expect.assertions(1)

        const wait = 1000;

        const throttledFunction = Oskari.util.throttle(() => {
            return 1;
        }, wait, { leading: false });
        
        let start = Date.now()
        while(undefined === throttledFunction()){}
        let end = Date.now()
        expect(end - start).toBeGreaterThanOrEqual(wait);
    });
});

describe('isNumber function', () => {

    test('returns true when parameter is number', () => {
        expect.assertions(1)
        expect(Oskari.util.isNumber(1)).toEqual(true);
    });

    test('returns false when parameter letter', () => {
        expect.assertions(1)
        expect(Oskari.util.isNumber('a')).toEqual(false);
    });

    test('returns false without parameters', () => {
        expect.assertions(1)
        expect(Oskari.util.isNumber()).toEqual(false);
    });
});

describe('isDecimal function', () => {

    test('returns true when parameter is decimal number', () => {
        expect.assertions(1)
        expect(Oskari.util.isDecimal(1.1)).toEqual(true);
    });

    test('returns false when parameter is integer', () => {
        expect.assertions(1)
        expect(Oskari.util.isDecimal(1)).toEqual(false);
    });

    test('returns false when parameter is letter', () => {
        expect.assertions(1)
        expect(Oskari.util.isDecimal('a')).toEqual(false);
    });

    test('returns false without parameters', () => {
        expect.assertions(1)
        expect(Oskari.util.isDecimal()).toEqual(false);
    });
});

describe('decimals function', () => {

    test('returns null without parameters', () => {
        expect.assertions(1)
        expect(Oskari.util.decimals()).toEqual(null);
    });

    test('returns count of decimals as zero with integer', () => {
        expect.assertions(1)
        expect(Oskari.util.decimals(1)).toEqual(0);
    });

    test('returns count of decimals as expected with decimal parameter', () => {
        expect.assertions(1)
        expect(Oskari.util.decimals(1.234)).toEqual(3);
    });

    test('returns count of decimals as expected with array parameter', () => {
        expect.assertions(1)
        const params = [1, 156.99883, 1.2, 2.23, 19.8];
        expect(Oskari.util.decimals(params)).toEqual(5);
    });
});
