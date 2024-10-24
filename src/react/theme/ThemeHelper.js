import { DEFAULT_COLORS, DEFAULT_FONT } from './constants';
import { EFFECT } from '../../constants';

export const getHeaderTheme = (theme) => {
    const bgColor = theme.color?.header?.bg || theme.color?.primary || DEFAULT_COLORS.HEADER_BG;
    const headerTextColor = getTextColor(bgColor);
    const accentColor = theme.color?.accent || DEFAULT_COLORS.ACCENT;
    const funcs = {
        getBgColor: () => bgColor,
        getAccentColor: () => accentColor,
        getBgBorderColor: () => Oskari.util.getColorEffect(accentColor, -10),
        getBgBorderBottomColor: () => Oskari.util.getColorEffect(accentColor, 20),
        getTextColor: () => theme.color?.header?.text || headerTextColor,
        getToolColor: () => theme.color?.header?.icon || funcs.getTextColor(),
        getToolHoverColor: () => accentColor
    };
    return funcs;
};

// https://ant.design/docs/react/customize-theme
export const getAntdTheme = (theme) => {
    // Note! The theme parameter is not used here,
    //  but the Oskari theme is passed here so we _could_ make some adjustments based on that
    return {
        // algorithm: antdTheme.defaultAlgorithm,
        components: {
            Button: {
                // colorPrimary: accentColor,
                // controlItemBgHover: headerTextColor,
                // colorFillContentHover: accentColor
                // fixes an issue where close icon has white bg while hovering
                colorBgContainer: 'inherit'
            },
            Slider: {
                handleColor: DEFAULT_COLORS.SLIDER_BG,
                trackBg: DEFAULT_COLORS.SLIDER_BG,
                trackHoverBg: DEFAULT_COLORS.SLIDER_HOVER,
            }
        },
        token: {
            // Seed Token
            // colorPrimary: '#00b96b',
            // colorPrimary "antD blue" seems to work better than using accent from Oskari theme at the moment
            colorPrimary: 'rgb(24, 144, 255)', // accentColor,
            // use the font selected from Oskari theme/global, otherwise antd defaults to its own font spec
            fontFamily: 'inherit',
            // make buttons more like v4, the default is a bit more rounder
            borderRadius: 2
            // Setting colorBgContainer: 'inherit' here makes the table th column bg color black for some reason
            // colorBgContainer: 'inherit'
        }
    };
};

export const getNavigationTheme = (theme) => {
    const primary = theme.navigation?.color?.primary || DEFAULT_COLORS.DARK_BUTTON_BG;
    const textColor = getTextColor(primary);
    let borderRadius = 0;
    if (theme?.navigation?.roundness) {
        borderRadius = (theme?.navigation?.roundness || 0) / 2;
    }

    let buttonColor = primary;
    if (theme.navigation?.effect === '3D') {
        const start = Oskari.util.getColorEffect(primary, EFFECT.DARKEN);
        const stop = Oskari.util.getColorEffect(primary, EFFECT.LIGHTEN);
        buttonColor = `linear-gradient(180deg, ${start} 0%, ${primary} 35%, ${stop} 100%)`;
    }
    const funcs = {
        getPrimary: () => primary,
        getTextColor: () => theme.navigation?.color?.text || textColor,
        getButtonColor: () => buttonColor,
        getButtonHoverColor: () => theme.navigation?.color?.accent || theme.color.accent || DEFAULT_COLORS.ACCENT,
        // like 50%
        getButtonRoundness: () => `${borderRadius}%`,
        // like 0.5 for calc() usage
        getButtonRoundnessFactor: () => borderRadius / 100,
        getEffect: () => theme.navigation?.effect,
        getButtonOpacity: () => theme.navigation?.opacity || 1,
        getNavigationBackgroundColor: () => theme.navigation?.color?.bg || theme.navigation?.color?.primary || DEFAULT_COLORS.NAV_BG
    };
    return funcs;
};

export const getTextColor = (bgColor) => {
    if (Oskari.util.isDarkColor(bgColor)) {
        return '#FFFFFF';
    };
    return '#000000';
};

export const getFontClass = (theme) => {
    const fontClassSuffix = theme.font || DEFAULT_FONT;
    return 'oskari-theme-font-' + fontClassSuffix;
};
