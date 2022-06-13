import React, { useState, useEffect } from 'react';

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
 * @class ThemeConsumer
 * @classdesc
 * A higher order component utilizing messaging context to the component it wraps.
 *
 * The context provides a theme object and monitors changes to it using state.
 * @see {@link ThemeProvider}
 * @param {ReactElement} Component The component to pass theme to
 *
 * @example <caption>Modified TextInput</caption>
 * import { TextInput } from 'oskari-ui';
 * import { ThemeConsumer } from 'oskari-ui/util';
 *
 * const ColoredInput = ThemeConsumer(({ theme }) => (
 *     <TextInput style={{ background-color: theme.color.primary }}/>
 * ));
 *
 */
export function ThemeConsumer (Component) {
    const ThemeComponent = (props) => {
        const theming = Oskari.app.getTheming();
        const [theme, setTheme] = useState(theming.getTheme());
        useEffect(() => {
            // start listening changes and return listener removal fn for cleanup on unmount (so we don't keep adding listeners)
            return Oskari.app.getTheming().addListener((newTheme) => setTheme(newTheme));
        })
        return (
            <ThemeContext.Consumer>
                { ignored => (<Component {...props} theme={theme} />)}
            </ThemeContext.Consumer>
        );
    };
    const name = Component.displayName || Component.name;
    ThemeComponent.displayName = `ThemeConsumer(${name})`;
    return ThemeComponent;
}
