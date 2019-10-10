export const mutatorMixin = (Service, mutatingMethods) => class extends Service {
    constructor (...args) {
        super(...args);

        this.mutatingMethods = mutatingMethods || [];
        if (!this.mutatingMethods) {
            Oskari.log().warn('Mutator does not have mutating methods!');
            this.mutatingMethods = [];
        }
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
