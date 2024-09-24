import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider } from 'antd';
import { getAntdTheme } from '../../theme';

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
 *         <SomeThemeConsumerComponent />
 *     </ThemeProvider>
 * );
 *
 * The value can be omitted for provider.
 * This makes the provider use Oskari.app.getTheming().getTheme() AND listen to changes at runtime.
 */
export const ThemeProvider = ({ value, children }) => {
    if (value) {
        return (<ThemeContext.Provider value={value}>
            <AntDTheming theme={value}>
                {children}
            </AntDTheming>
        </ThemeContext.Provider>);
    }
    // default to Oskari.app.getTheming() and listening to changes
    const theming = Oskari.app.getTheming();
    const [theme, setTheme] = useState(theming.getTheme());
    useEffect(() => {
        // start listening changes and return listener removal fn for cleanup on unmount (so we don't keep adding listeners)
        return Oskari.app.getTheming().addListener((newTheme) => setTheme(newTheme));
    });
    return (<ThemeContext.Provider value={theme}>
        <AntDTheming theme={theme}>
            {children}
        </AntDTheming>
    </ThemeContext.Provider>);
};

ThemeProvider.propTypes = {
    // Theme object, defaults to one from Oskari.app.getTheming()
    value: PropTypes.object,
    children: PropTypes.any
};

const AntDTheming = ({ theme, children }) => {
    return (<ConfigProvider
        theme={getAntdTheme(theme)}>{children}</ConfigProvider>);
};

AntDTheming.propTypes = {
    // Theme object, defaults to one from Oskari.app.getTheming()
    theme: PropTypes.object,
    children: PropTypes.any
};

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
        return (
            <ThemeContext.Consumer>
                { value => (<Component {...props} theme={value} />)}
            </ThemeContext.Consumer>
        );
    };
    const name = Component.displayName || Component.name;
    ThemeComponent.displayName = `ThemeConsumer(${name})`;
    return ThemeComponent;
};
