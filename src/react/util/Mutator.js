export class Mutator {
    constructor (serviceInstance, mutatingFunctionNames) {
        mutatingFunctionNames.forEach(functionName => {
            this[functionName] = (...args) => serviceInstance[functionName](...args);
        });
    }
};
