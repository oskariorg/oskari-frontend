import { Mutator } from './Mutator';

/**
 * An easy way to add Mutator to an UIService.
 * @mixin mutatorMixin
 * @mixes Mutator
 */
export const mutatorMixin = (UIService, functionNames = []) => {
    /** */
    class MixedService extends UIService {
        /**
         * @param {Object|StateHandler} UIService UI Service (possibly extending StateHandler)
         * @param {string[]} functionNames An array of the function names the component requires access to.
         */
        constructor (...args) {
            super(...args);
            let methods = functionNames;
            if (!Array.isArray(methods) || methods.length === 0) {
                methods = [];
                Oskari.log().warn('Mutator does not have mutating methods!');
            }
            this.mutator = new Mutator(this, methods);
        }
        /**
         * @return {Mutator} Mutator for the service
         */
        getMutator () {
            return this.mutator;
        }
    }
    return MixedService;
};
