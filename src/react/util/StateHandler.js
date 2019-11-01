export class StateHandler {
    constructor () {
        this.stateListeners = [];
        this.state = {};
        this.stashedState = null;
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
        };
        this.notify();
    }
    stashCurrentState () {
        this.stashedState = { ...this.state };
    }
    hasStashedState () {
        return !!this.stashedState;
    }
    useStashedState () {
        if (this.stashedState) {
            this.setState(this.stashedState);
        }
        this.stashedState = null;
    }
    addStateListener (consumer) {
        this.stateListeners.push(consumer);
    }
    notify () {
        this.stateListeners.forEach(consumer => consumer(this.getState()));
    }
}
