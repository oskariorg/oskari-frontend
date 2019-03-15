import React from 'react';

export const GenericContext = React.createContext();

export function withContext (Component) {
    return function ContextComponent (props) {
        return (
            <GenericContext.Consumer>
                {context => <Component {...props} {...context} />}
            </GenericContext.Consumer>
        );
    };
}

// re-binds all object methods starting with 'handle',
// so that methods can be used detached from instance. For use in React
export function handleBinder (ob) {
    const proto = Object.getPrototypeOf(ob);
    Object.getOwnPropertyNames(proto).forEach(propertyName => {
        const desc = Object.getOwnPropertyDescriptor(proto, propertyName);
        if (!!desc && typeof desc.value === 'function' && propertyName.startsWith('handle')) {
            ob[propertyName] = desc.value.bind(ob);
        }
    });
}
