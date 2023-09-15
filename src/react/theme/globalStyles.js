import { DEFAULT_COLORS } from './constants';
import { getHeaderTheme } from './ThemeHelper';
import { getNavigationDimensions } from 'oskari-ui/components/window';

const GLOBAL_STYLE = document.createElement('style');
document.head.appendChild(GLOBAL_STYLE);

export const setGlobalStyle = (theme = {}) => {
    // default to dark gray
    const navColor = theme.navigation?.color?.primary || DEFAULT_COLORS.NAV_BG;
    const headerTheme = getHeaderTheme(theme);
    const navigationDimensions = getNavigationDimensions();
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

        .oskari-root-el > nav {
            .scroll-indicator {
                display: none;
                background-color: ${navColor};
                border-top: ${headerTheme.getAccentColor()} solid 2px;
                height: 45px;
                width: ${navigationDimensions.width}px;
                pointer-events: none;
                position: absolute;
                left: ${navigationDimensions.left}px;
                bottom: -1em;
            }
            .scroll-icon {
                border: solid 1em transparent;
                border-top-color: white;
                color: ${headerTheme.getTextColor()};
                height: 0;
                left: ${navigationDimensions.left + (navigationDimensions.width / 2)}px;
                opacity: 0.6;
                pointer-events: none;
                position: absolute;
                text-align: center;
                transform: translate(-50%, 0);
                transition: all .2s ease-out;
                width: 0;
                top: 10px;
            }
        }
    `;
};