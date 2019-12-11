/**
 * The idea behind Mutator is to provide a way to pass multiple functions to an UI component in a single package.
 * We cannot simply pass on an UI Service instance, since those contain functions and properties we don't want to pass to a component.
 * Mutator is a subset of UI service's functions.
 */
export class Mutator {
    /**
     * @param {Object|StateHandler} UIService UI Service (possibly extending StateHandler)
     * @param {string[]} functionNames An array of the function names the component requires access to
     */
    constructor (UIService, functionNames) {
        functionNames.forEach(key => {
            this[key] = (...args) => UIService[key](...args);
        });
    }
};
