const log = Oskari.log();

export class StateHandler {
    constructor () {
        this.stateListeners = [];
    }
    _init () {
        this.state = {};
        log.warn('StateHandler child class does not override _init.');
    }
    getState () {
        return this.state;
    }
    setState (state) {
        this.state = state;
        this.notify();
    }
    updateState (props) {
        this.state = {
            ...this.state,
            ...props
        }
        this.notify();
    }
    addStateListener (consumer) {
        this.stateListeners.push(consumer);
    }
    notify () {
        this.stateListeners.forEach(consumer => consumer(this.getState()));
    }
}

export const withMutator = (statefulClass) => class extends statefulClass {
    constructor (...args) {
        super(...args);

        if (!this.mutatingMethods) {
            log.warn('Mutator parent does not have state mutating methods!');
            this.mutatingMethods = [];
        }
        this._init();
        this.state.mutator = this.getMutator();
    }
    getMutator () {
        if (this.mutator) {
            return this.mutator;
        }
        this.mutator = {};
        const assignMutatingFunction = functionName => {
            this.mutator[functionName] = (...args) => {
                this[functionName](...args);
            };
        };
        this.mutatingMethods.forEach(funcName => assignMutatingFunction(funcName));
        return this.mutator;
    }
};