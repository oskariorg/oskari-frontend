import React from 'react';

const LocaleContext = React.createContext();

/**
 * @class LocaleProvider
 * @classdesc Provides messaging context down the component tree. Usefull with oskari-ui/Message component.
 * @see {@link LocaleConsumer}
 * @param {Object} props - { bundleKey, getMessage:optional }
 * @example
 * import { Message } from 'oskari-ui';
 * import { LocaleProvider } from 'oskari-ui/util';
 *
 * const Greeting = () => (
 *     <LocaleProvider value={{bundleKey: 'helloworld'}}>
 *         <Message messageKey="hello" messageArgs={['Jack']}/>
 *     </LocaleProvider>
 * );
 */
export const LocaleProvider = LocaleProvider;

/**
 * @class LocaleConsumer
 * @classdesc
 * A higher order component utilizing messaging context to the component it wraps.
 * Using LocaleConsumer and getMessage function directly should be avoided.
 * Using oskari-ui/Message component instead is encouraged.
 *
 * The context provides bundleKey string and getMessage function.
 * The getMessage function may be used when an element can't use a ReactNode as a prop. (e.g. placeholder in TextInput)
 * @see {@link LocaleProvider}
 * @param {ReactElement} Component The component to pass localizations to
 *
 * @example <caption>Modified TextInput</caption>
 * import { TextInput } from 'oskari-ui';
 * import { LocaleConsumer } from 'oskari-ui/util';
 *
 * const NameInput = LocaleConsumer(({ getMessage }) => (
 *     <TextInput placeholder={getMessage('placeholders.name')} />
 * ));
 */
export function LocaleConsumer (Component) {
    const LocalizedComponent = (props, ref) => {
        return (
            <LocaleContext.Consumer>
                {
                    value => {
                        if (!value) {
                            // No contex provider, just pass props through.
                            return <Component ref={ref} {...props} />;
                        }
                        const { bundleKey, getMessage = Oskari.getMsg.bind(null, bundleKey) } = value;
                        return <Component bundleKey={bundleKey} getMessage={getMessage} ref={ref} {...props} />;
                    }
                }
            </LocaleContext.Consumer>
        );
    };
    const name = Component.displayName || Component.name;
    LocalizedComponent.displayName = `LocaleConsumer(${name})`;
    return React.forwardRef(LocalizedComponent);
}
