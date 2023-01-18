import { DEFAULT_COLORS } from './constants';

const GLOBAL_STYLE = document.createElement('style');
document.head.appendChild(GLOBAL_STYLE);

export const setGlobalStyle = (theme = {}) => {
    // default to dark gray
    const navColor = theme.navigation?.color?.primary || DEFAULT_COLORS.NAV_BG;
    GLOBAL_STYLE.innerHTML = `
        .oskari-root-el > nav {
            background-color: ${navColor};
        }
    `;
};