import React from 'react';
import { Message } from 'oskari-ui';

export const LocaleContext = React.createContext();

export function withLocale (Component) {
    const LocalizedComponent = (props, ref) => {
        return (
            <LocaleContext.Consumer>
                {
                    ({ bundleKey, getMessage = Oskari.getMsg.bind(null, bundleKey) }) => {
                        const BundleMessage = messageProps =>
                            <Message {...messageProps} bundleKey={bundleKey} getMessage={getMessage} />;
                        return <Component {...props} getMessage={getMessage} Message={BundleMessage} ref={ref} />;
                    }
                }
            </LocaleContext.Consumer>
        );
    };
    const name = Component.displayName || Component.name;
    LocalizedComponent.displayName = `withLocale(${name})`;
    return React.forwardRef(LocalizedComponent);
}
