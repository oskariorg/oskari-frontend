import { StateHandler } from './StateHandler';

export class AsyncStateHandler extends StateHandler {
    /**
     * Handles calling registered listeners (https://github.com/oskariorg/oskari-frontend/pull/2626).
     * Overrides notifying of state changes by making it asynchronous which helps when there are multiple state changes one after another. This skips rendering between updateState()-"spamming".
     *
     * Compared to non-async StateHandler:
     * - Fixes an issue where multiple updateState() calls in short succession may result in JS error "RangeError: Maximum call stack size exceeded"
     * - Any input fields that are managed through async state handling have their carets moving to the end of the value after each change:
     *    - https://github.com/facebook/react/issues/5386
     *    - https://dev.to/kwirke/solving-caret-jumping-in-react-inputs-36ic
     *   This is annoying for user who is trying to modify the field value by adding/removing characters in the middle of the value.
     *   The caret jumping can be "fixed"/worked around by duplicating the input value state handling like this: https://github.com/oskariorg/oskari-frontend/pull/2625/commits/15adc82944678ebe4f9be282c75ba7bc8f07d3a0
     * @private
     */
    notify () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        // This allows multiple small state updates to be run one after another before re-rendering is triggered
        this.timeout = setTimeout(() => {
            super.notify();
            this.timeout = null;
        }, 10);
    }
}
