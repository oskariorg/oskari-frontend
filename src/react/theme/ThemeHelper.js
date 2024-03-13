
import { EFFECT, DEFAULT_COLORS, DEFAULT_FONT } from './constants';

export const getHeaderTheme = (theme) => {
    const bgColor = theme.color?.header?.bg || theme.color?.primary || DEFAULT_COLORS.HEADER_BG;
    const headerTextColor = getTextColor(bgColor);
    const accentColor = theme.color?.accent || DEFAULT_COLORS.ACCENT;
    const funcs = {
        getBgColor: () => bgColor,
        getAccentColor: () => accentColor,
        getBgBorderColor: () => getColorEffect(accentColor, -10),
        getBgBorderBottomColor: () => getColorEffect(accentColor, 20),
        getTextColor: () => theme.color?.header?.text || headerTextColor,
        getToolColor: () => theme.color?.header?.icon || funcs.getTextColor(),
        getToolHoverColor: () => accentColor
    };
    return funcs;
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
        buttonColor = `linear-gradient(180deg, ${getColorEffect(primary, EFFECT.DARKEN)} 0%, ${primary} 35%, ${getColorEffect(primary, EFFECT.LIGHTEN)} 100%)`;
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

/* ------------------------------------------------------------------------------ */
// Note! Copy-pasted from bundles/mapping/mapmodule/oskariStyle!
// TODO: figure out if these should be shared and from map or src
/**
 * @method getColorEffect
 * @param {String} color Color to apply the effect on
 * @param {String} effect Oskari style constant (auto, darken, lighten with specifiers minor, normal, major)
 * @return {String} Affected color or undefined if effect or color is missing
 */
export const getColorEffect = (color, effect) => {
    if (!effect || !color || effect === EFFECT.NONE) {
        return;
    }
    const minor = 60;
    const normal = 90;
    const major = 120;
    const getEffect = (delta, auto) => Oskari.util.alterBrightness(color, delta, auto);
    switch (effect) {
    case EFFECT.AUTO : return getEffect(normal, true);
    case EFFECT.AUTO_MINOR : return getEffect(minor, true);
    case EFFECT.AUTO_NORMAL : return getEffect(normal, true);
    case EFFECT.AUTO_MAJOR : return getEffect(major, true);
    case EFFECT.DARKEN : return getEffect(-normal);
    case EFFECT.DARKEN_MINOR : return getEffect(-minor);
    case EFFECT.DARKEN_NORMAL : return getEffect(-normal);
    case EFFECT.DARKEN_MAJOR : return getEffect(-major);
    case EFFECT.LIGHTEN : return getEffect(normal);
    case EFFECT.LIGHTEN_MINOR : return getEffect(minor);
    case EFFECT.LIGHTEN_NORMAL : return getEffect(normal);
    case EFFECT.LIGHTEN_MAJOR : return getEffect(major);
    default : return getEffect(effect, true);
    }
};
