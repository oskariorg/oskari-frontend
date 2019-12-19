/**
 * The idea behind Controller is to provide a way to pass multiple functions to an UI component in a single package.
 * We cannot simply pass on an UI handler instance, since those contain functions and properties we don't want to pass to a component.
 * Controller is a subset of UI handler's functions.
 */
export class Controller {
    /**
     * @param {Object|StateHandler} UIHandler UI handler (possibly extending StateHandler)
     * @param {string[]} functionNames An array of the function names the component requires access to
     */
    constructor (UIHandler, functionNames) {
        functionNames.forEach(key => {
            this[key] = (...args) => UIHandler[key](...args);
        });
    }
};
