import React from 'react';

const ThemeContext = React.createContext();

/**
 * @class ThemeProvider
 * @classdesc Provides theme variables for components.
 * @see {@link ThemeConsumer}
 * @param {Object} props - { theme like defaulted in src/theming.js }
 * @example
 * import { ThemeProvider } from 'oskari-ui/util';
 *
 * const Greeting = () => (
 *     <ThemeProvider value={Oskari.app.getTheming().getTheme()}>
 *         <SomeComponentUsingThemeProp />
 *     </ThemeProvider>
 * );
 */
export const ThemeProvider = ThemeContext.Provider;

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
 * 
 * 
 * 
            <LocaleProvider value={{ bundleKey: 'admin-layereditor' }}>
 */
export function ThemeConsumer (Component) {
    const ThemeComponent = (props, ref) => {
        return (
            <ThemeContext.Consumer>
                { value => (<Component {...props} theme={value} />)}
            </ThemeContext.Consumer>
        );
    };
    const name = Component.displayName || Component.name;
    ThemeComponent.displayName = `ThemeConsumer(${name})`;
    return React.forwardRef(ThemeComponent);
}
