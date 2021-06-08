export const GLOBAL_LEGEND = 'legendImage';

export const getWarningsForStyles = layer => {
    const { options = {}, capabilities = {}, style } = layer;
    const { styles = [] } = capabilities;
    const { legends = {} } = options;
    const selectedExists = styles.some(s => s.name === style);
    const warnings = [];
    if (style && !selectedExists) {
        warnings.push('defaultStyle');
    }
    const additionals = legendsWithoutStyle(styles, legends);
    const hasGlobal = additionals.find(name => name === GLOBAL_LEGEND);
    // don't notify if global is only additional legend
    if (additionals.length > 1 || (additionals.length === 1 && !hasGlobal)) {
        warnings.push('additionalLegend');
    }
    if (styles.length > 0 && hasGlobal) {
        warnings.push('globalWithStyles');
    }
    return warnings;
};

export const legendsWithoutStyle = (styles, legends) => {
    const styleNames = styles.map(s => s.name);
    return Object.keys(legends)
        .filter(name => !styleNames.includes(name));
};
