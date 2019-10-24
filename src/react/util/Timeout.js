const DEFAULT_TIMEOUT = 1000;

export const Timeout = class {
    constructor (delayedAction, timeoutInMs = DEFAULT_TIMEOUT) {
        if (typeof delayedAction !== 'function') {
            this.pending = false;
            return;
        }
        this.pending = true;
        this.id = setTimeout(() => {
            delayedAction();
            this.pending = false;
        }, timeoutInMs);
    }
    cancel () {
        clearTimeout(this.id);
        this.pending = false;
    }
    isPending () {
        return this.pending;
    }
};
