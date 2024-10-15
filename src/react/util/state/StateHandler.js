export class StateHandler {
    /**
     * @class StateHandler
     * @classdesc For shallowly immutable UI state handling
     */
    constructor () {
        this.stateListeners = [];
        this.state = {};
        this.stashedState = null;
    }

    /**
     * @returns {object} Current state
     */
    getState () {
        return this.state;
    }

    /**
     * @param {Object} state A new state replacing the previous one.
     */
    setState (state) {
        this.state = state;
        this.notify();
    }

    /**
     * @param {Object} props Extends and overrides keys in state.
     */
    updateState (props) {
        this.state = {
            ...this.state,
            ...props
        };
        this.notify();
    }

    /**
     * Stashes current state so it can be returned to later on.
     */
    stashCurrentState () {
        if (this.stashedState) {
            // Prevent accidentally overwriting stashed state.
            return;
        }
        this.stashedState = { ...this.state };
    }

    /**
     * To check if we have a state in stash.
     * @return {boolean} True, if we have state in stash.
     */
    hasStashedState () {
        return !!this.stashedState;
    }

    /**
     * Retain previously stashed state. Clears the stash.
     */
    useStashedState () {
        if (this.stashedState) {
            this.setState(this.stashedState);
        }
        this.stashedState = null;
    }

    /**
     * Register a listener function. Listeners will be called every time the state changes.
     * @param {function} consumer The consumer function.
     */
    addStateListener (consumer) {
        this.stateListeners.push(consumer);
    }

    /**
     * Handles calling registered listeners.
     * @private
     */
    notify () {
        this.stateListeners.forEach(consumer => consumer(this.getState()));
    }
}
