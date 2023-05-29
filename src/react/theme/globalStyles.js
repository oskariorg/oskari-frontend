import { DEFAULT_COLORS } from './constants';
import { getHeaderTheme } from './ThemeHelper';

const GLOBAL_STYLE = document.createElement('style');
document.head.appendChild(GLOBAL_STYLE);

export const setGlobalStyle = (theme = {}) => {
    // default to dark gray
    const navColor = theme.navigation?.color?.primary || DEFAULT_COLORS.NAV_BG;
    const headerTheme = getHeaderTheme(theme);
    // inject Theme support for jQuery-based UI-elements (navigation, flyout, popup)
    GLOBAL_STYLE.innerHTML = `
        .oskari-root-el > nav {
            background-color: ${navColor};
        }

        .oskari-root-el {
            font-family: 'Open Sans', Arial, sans-serif;
        }

        .oskari-flyout .oskari-flyouttoolbar {
            background-color: ${headerTheme.getBgColor()};
            color:  ${headerTheme.getTextColor()};
        }

        .oskari-flyout .oskari-flyoutheading {
            background-color: ${headerTheme.getAccentColor()};
            border-top: 1px solid ${headerTheme.getBgBorderColor()};
            border-bottom: 1px solid ${headerTheme.getBgBorderBottomColor()};
        }

        div.divmanazerpopup h3.popupHeader {
            background-color: ${headerTheme.getBgColor()};
            color:  ${headerTheme.getTextColor()};
        }
    `;
};