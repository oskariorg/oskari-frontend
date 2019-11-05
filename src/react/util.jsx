import React from 'react';
export { mutatorMixin } from './util/mixins';
export { Mutator } from './util/Mutator';
export { StateHandler } from './util/StateHandler';
export { Timeout } from './util/Timeout';

export const GenericContext = React.createContext();
export const LocaleContext = React.createContext();
export const MutatorContext = React.createContext();

export function withContext (Component) {
    return function ContextedComponent (props) {
        return (
            <GenericContext.Consumer>
                {context => <Component {...props} {...context} />}
            </GenericContext.Consumer>
        );
    };
}

export function withLocale (Component) {
    return function LocalizedComponent (props) {
        return (
            <LocaleContext.Consumer>
                { value => <Component {...props} getMessage={value} />}
            </LocaleContext.Consumer>
        );
    };
}

export function withMutator (Component) {
    return function StateMutatingComponent (props) {
        return (
            <MutatorContext.Consumer>
                { service => <Component {...props} mutator={service.getMutator()} />}
            </MutatorContext.Consumer>
        );
    };
}

// re-binds all object methods starting with 'handle',
// so that methods can be used detached from instance. For use in React
export function handleBinder (ob, prefix = 'handle') {
    const proto = Object.getPrototypeOf(ob);
    Object.getOwnPropertyNames(proto).forEach(propertyName => {
        const desc = Object.getOwnPropertyDescriptor(proto, propertyName);
        if (!!desc && typeof desc.value === 'function' && propertyName.startsWith(prefix)) {
            ob[propertyName] = desc.value.bind(ob);
        }
    });
}
