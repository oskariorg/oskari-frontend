
import { beforeEach, afterEach } from '@jest/globals';
const jQuery = require('jquery');
global.jQuery = jQuery;


describe('throttle function executes given function ', () => {
    // clear all timers
    afterEach(() => jest.clearAllTimers());

    test('once immediately and once after given wait interval when {leading: false} is not provided', () => {
        expect.assertions(4);

        const wait = 500;
        const mockFunction = jest.fn();

        const throttledFunction = Oskari.util.throttle(mockFunction, wait);

        throttledFunction();
        expect(mockFunction).toHaveBeenCalled();
        expect(mockFunction).toHaveBeenCalledTimes(1);
        throttledFunction();
        expect(mockFunction).toHaveBeenCalledTimes(1);
        // Fast-forward until all timers have been executed
        jest.advanceTimersByTime(wait);
        // Now our callback should have been called!
        expect(mockFunction).toHaveBeenCalledTimes(2);
    });

    test('zero times immediately and once after given wait interval when {leading: false} is provided', () => {
        const functionCallCount = 5;
        expect.assertions(functionCallCount + 1);

        // jest.setTimeout(7000);

        const wait = 500;
        const mockFunction = jest.fn();

        const throttledFunction = Oskari.util.throttle(mockFunction, wait, { leading: false });

        for (let i = 0; i < functionCallCount; i++) {
            throttledFunction();
            expect(mockFunction).toHaveBeenCalledTimes(0);
        };
        /* Sleep enough to verify that only one function call within given wait time is set to be executed in future
        *  (multiple throttle function calls received as burst within given wait- parameter do not spread all given function calls to be executed in future with interval of wait- parameter)
        */
        // Fast-forward until all timers have been executed
        jest.advanceTimersByTime(wait * functionCallCount);
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    test('once immediately and zero time after given wait interval when {trailing: false} is provided', () => {
        const functionCallCount = 2;
        expect.assertions(functionCallCount + 1);

        const wait = 500;
        const mockFunction = jest.fn();

        const throttledFunction = Oskari.util.throttle(mockFunction, wait, { trailing: false });

        for (let i = 0; i < functionCallCount; i++) {
            throttledFunction();
            expect(mockFunction).toHaveBeenCalledTimes(1);
        };
        jest.advanceTimersByTime(wait * functionCallCount);
        // repetitive calls are not executed
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    test('immediately without throttling when called with interval >= throttle wait parameter', () => {

        const functionCallCount = 5;
        expect.assertions(2 * functionCallCount);

        const wait = 200;
        const mockFunction = jest.fn();

        const throttledFunction = Oskari.util.throttle(mockFunction, wait);

        for (let i = 0; i < functionCallCount; i++) {
            throttledFunction();
            if (i === 0) {
                expect(mockFunction).toHaveBeenCalledTimes(1);
            } else {
                expect(mockFunction).toHaveBeenCalledTimes(i);
            }
            jest.advanceTimersByTime(wait - 5);
            expect(mockFunction).toHaveBeenCalledTimes(i + 1);
        };
    });
});
