const DEFAULT_TIMEOUT = 1000;

export const Timeout = class {
    constructor (delayedAction, timeoutInMs = DEFAULT_TIMEOUT) {
        this.pending = false;
        if (typeof delayedAction !== 'function') {
            return;
        }
        this.timeoutInMs = timeoutInMs;
        this.reset(delayedAction);
    }
    cancel () {
        clearTimeout(this.id);
        this.pending = false;
    }
    reset (action = this.action) {
        if (this.pending) {
            clearTimeout(this.id);
        }
        if (typeof action !== 'function') {
            return;
        }
        if (action !== this.action) {
            this.action = () => {
                action();
                this.pending = false;
            };
        }
        this.id = setTimeout(this.action, this.timeoutInMs);
        this.pending = true;
    }
    isPending () {
        return this.pending;
    }
};
