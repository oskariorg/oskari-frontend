export class StateHandler {
    constructor () {
        this.stateListeners = [];
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
