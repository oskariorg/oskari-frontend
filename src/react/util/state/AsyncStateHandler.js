import { StateHandler } from './StateHandler';

export class AsyncStateHandler extends StateHandler {
    /**
     * Handles calling registered listeners.
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
