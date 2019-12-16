import React from 'react';

export const GenericContext = React.createContext();

export function withContext (Component) {
    return function ContextedComponent (props) {
        return (
            <GenericContext.Consumer>
                {context => <Component {...props} {...context} />}
            </GenericContext.Consumer>
        );
    };
}
