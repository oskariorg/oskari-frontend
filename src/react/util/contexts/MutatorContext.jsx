import React from 'react';

export const MutatorContext = React.createContext();

export function withMutator (Component) {
    return function StateMutatingComponent (props) {
        return (
            <MutatorContext.Consumer>
                { service => <Component {...props} mutator={service.getMutator()} />}
            </MutatorContext.Consumer>
        );
    };
}
