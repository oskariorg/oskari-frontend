import { Mutator } from './Mutator';

export const mutatorMixin = (Service, mutatingMethodNames = []) => class extends Service {
    constructor (...args) {
        super(...args);
        let methods = mutatingMethodNames;
        if (!Array.isArray(methods) || methods.length === 0) {
            methods = [];
            Oskari.log().warn('Mutator does not have mutating methods!');
        }
        this.mutator = new Mutator(this, methods);
    }
    getMutator () {
        return this.mutator;
    }
};
