
import { EFFECT } from './constants';

export const getHeaderTheme = (theme) => {
    const headerTextColor = getTextColor(theme.color.primary);
    const funcs = {
        getBgColor: () => theme.color.header?.bg || theme.color.primary,
        getAccentColor: () => theme.color.accent,
        getBgBorderColor: () => getColorEffect(theme.color.accent, -10),
        getBgBorderBottomColor: () => getColorEffect(theme.color.accent, 20),
        getTextColor: () => theme.color.header?.text || headerTextColor,
        getToolColor: () => theme.color.header?.icon || funcs.getTextColor(),
        getToolHoverColor: () => theme.color.accent
    };
    return funcs;
};

export const getTextColor = (bgColor) => {
    if (Oskari.util.isDarkColor(bgColor)) {
        return '#FFFFFF';
    };
    return '#000000';
};

export const getFont = (theme) => {
    if (theme.font === 'arial') return 'Arial, Helvetica, sans-serif';
    if (theme.font === 'georgia') return 'Georgia, Times, "Times New Roman"';
    return theme.font ||  'Arial, Helvetica, sans-serif';
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
