import React from 'react';

/**
 * The context takes an object with two properties as a parameter. { bundleKey, getMessage }
 * getMessage is optional and can be used to provide a custom function taking the same params as Oskari.getMsg.
 */
export const LocaleContext = React.createContext();

/**
 * The context provides Message component and getMessage functions for it's children.
 * Developers should use the Message component whenever they can and avoid using the getMessage function.
 * The getMessage function may be used when an element can't use a ReactNode as a prop. (e.g. placeholder in TextInput)
 */
export function LocaleConsumer (Component) {
    const LocalizedComponent = (props, ref) => {
        return (
            <LocaleContext.Consumer>
                {
                    ({ bundleKey, getMessage = Oskari.getMsg.bind(null, bundleKey) }) =>
                        <Component bundleKey={bundleKey} getMessage={getMessage} ref={ref} {...props} />
                }
            </LocaleContext.Consumer>
        );
    };
    const name = Component.displayName || Component.name;
    LocalizedComponent.displayName = `LocaleConsumer(${name})`;
    return React.forwardRef(LocalizedComponent);
}
