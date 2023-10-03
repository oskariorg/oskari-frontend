export const hexToRGBA = (hex, alpha) => {
    const { r, g, b } = Oskari.util.hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
};

export const colorsToRGBA = (colors, alpha) => {
    return colors.map(hex => hexToRGBA(hex, alpha));
};
