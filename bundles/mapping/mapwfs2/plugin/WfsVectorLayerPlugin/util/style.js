const defaults = {
    style: {
        fill: {
            color: '#FAEBD7'
        },
        stroke: {
            color: '#000000',
            width: 1
        }
    },
    selected: {
        inherit: true,
        effect: 'auto major'
    },
    hover: {
        inherit: true,
        effect: 'auto minor'
    }
};

const applyOpacityToColorable = (colorable, opacity) => {
    if (!colorable || !colorable.getColor()) {
        return;
    }
    const alpha = opacity < 1 ? opacity : opacity / 100.0;
    if (Array.isArray(colorable.getColor())) {
        const color = [...colorable.getColor()];
        color[3] = alpha;
        colorable.setColor(color);
        return;
    }
    let colorLike = colorable.getColor();
    if (colorLike.startsWith('rgba')) {
        colorLike = colorLike.substring(0, colorLike.lastIndexOf(','));
        colorLike += `,${alpha})`;
        colorable.setColor(colorLike);
        return;
    } else if (colorLike.startsWith('rgb')) {
        colorLike = colorLike.replace('rgb', 'rgba');
        colorLike = colorLike.substring(0, colorLike.lastIndexOf(')'));
        colorLike += `,${alpha})`;
        colorable.setColor(colorLike);
        return;
    }
    const rgb = Oskari.util.hexToRgb(colorLike);
    if (!rgb) {
        return;
    }
    const { r, g, b } = rgb;
    colorable.setColor(`rgba(${r},${g},${b},${alpha})`);
};

export const applyOpacity = (olStyle, opacity) => {
    if (!olStyle || isNaN(opacity)) {
        return;
    }
    applyOpacityToColorable(olStyle.getFill(), opacity);
    applyOpacityToColorable(olStyle.getStroke(), opacity);
    return olStyle;
};

const getStyleFunction = (styleValues, hoverHandler) => {
    const getTypedStyles = (styles, isHovered, isSelected) => {
        if (!styles) {
            return;
        }
        if (isHovered && isSelected) {
            return styles.selectedHover || styles.hover || styles.customized || styles.default;
        }
        if (isHovered) {
            return styles.hover || styles.customized || styles.default;
        }
        if (isSelected) {
            return styles.selected || styles.customized || styles.default;
        }
        return styles.customized || styles.default;
    };
    return (feature, resolution, isSelected) => {
        const isHovered = hoverHandler.isHovered(feature, hoverHandler);

        let styleTypes = null;
        if (styleValues.optional) {
            const found = styleValues.optional.find(op => feature.get(op.key) === op.value);
            if (found) {
                styleTypes = getTypedStyles(found, isHovered, isSelected);
            }
        }
        if (!styleTypes) {
            styleTypes = getTypedStyles(styleValues, isHovered, isSelected);
        }

        let style = null;
        switch (feature.getGeometry().getType()) {
        case 'LineString':
        case 'MultiLineString':
            style = styleTypes.line || styleTypes; break;
        case 'Polygon':
        case 'MultiPolygon':
            style = styleTypes.area || styleTypes; break;
        case 'Point':
            style = styleTypes.dot || styleTypes; break;
        };

        if (styleTypes.labelProperty && style.getText()) {
            style.getText().setText(feature.get(styleTypes.labelProperty) || '');
        }
        return style;
    };
};

const getGeomTypedStyles = (styleDef, factory) => {
    const styles = {
        area: factory(styleDef, 'area'),
        line: factory(styleDef, 'line'),
        dot: factory(styleDef, 'dot')
    };
    if (styleDef.text) {
        styles.labelProperty = styleDef.text.labelProperty;
    }
    return styles;
};

export const styleGenerator = (styleFactory, layer, hoverHandler) => {
    let styles = {
        default: getGeomTypedStyles(defaults.style, styleFactory),
        selected: getGeomTypedStyles({ ...defaults.style, ...defaults.selected }, styleFactory),
        hover: getGeomTypedStyles({ ...defaults.style, ...defaults.hover }, styleFactory)
    };
    if (!layer) {
        return getStyleFunction(styles, hoverHandler);
    }
    let styleDef = layer.getCurrentStyleDef();
    if (!styleDef) {
        return getStyleFunction(styles, hoverHandler);
    }
    if (!styleDef.featureStyle) {
        // Bypass possible layer definitions
        Object.values(styleDef).find(obj => {
            if (obj.hasOwnProperty('featureStyle')) {
                styleDef = obj;
                return true;
            }
        });
    }
    const featureStyle = styleDef.featureStyle;
    const hoverOptions = layer.getHoverOptions();
    const hoverStyle = hoverOptions ? hoverOptions.featureStyle : null;
    if (featureStyle) {
        styles.customized = getGeomTypedStyles(featureStyle, styleFactory);
        styles.selected = getGeomTypedStyles({ ...featureStyle, ...defaults.selected }, styleFactory);
    }
    if (hoverStyle) {
        const hoverDef = hoverStyle.inherit === true ? { ...featureStyle, ...hoverStyle } : hoverStyle;
        styles.hover = getGeomTypedStyles(hoverDef, styleFactory);
        styles.selectedHover = getGeomTypedStyles(hoverDef, styleFactory);
    }
    const optionalStyles = styleDef.optionalStyles;
    if (optionalStyles) {
        styles.optional = optionalStyles.map((optionalDef) => {
            const optional = {
                key: optionalDef.property.key,
                value: optionalDef.property.value,
                customized: getGeomTypedStyles({ ...featureStyle, ...optionalDef }, styleFactory),
                selected: getGeomTypedStyles({ ...featureStyle, ...optionalDef, ...defaults.selected }, styleFactory)
            };
            if (hoverStyle) {
                const hoverDef = hoverStyle.inherit === true ? { ...featureStyle, ...optionalDef, ...hoverStyle } : hoverStyle;
                optional.hover = getGeomTypedStyles(hoverDef, styleFactory);
                optional.selectedHover = getGeomTypedStyles({ ...hoverDef, ...defaults.selected }, styleFactory);
            }
            return optional;
        });
    }
    return getStyleFunction(styles, hoverHandler);
};
