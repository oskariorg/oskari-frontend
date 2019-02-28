import { normalStyle } from './defaultStyle';

const isHovered = (feature, hoverState) => {
    if (!hoverState) {
        return false;
    }
    const {feature: hoverFeature, property} = hoverState;
    if (!hoverFeature || !property) {
        return false;
    }
    return hoverFeature.get(property) === feature.get(property);
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
    const {r, g, b} = rgb;
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

const getStyleFunction = (styleValues, layer, hoverState) => {
    return (feature, resolution) => {
        let hovered = isHovered(feature, hoverState);
        let style = null;
        if (styleValues.optional) {
            var found = styleValues.optional.find(op => feature.get(op.key) === op.value);
            if (found) {
                style = hovered && found.hoverStyle ? found.hoverStyle : found.style;
            }
        }
        if (!style) {
            style = hovered && styleValues.hover
                ? styleValues.hover : styleValues.base || normalStyle;
        }
        return applyOpacity(style, layer.getOpacity());
    };
};

export const styleGenerator = (styleFactory, layer, hoverState) => {
    const styles = {
        base: normalStyle
    };
    if (!layer) {
        return getStyleFunction(styles, layer, hoverState);
    }
    let styleDef = layer.getCurrentStyleDef();
    if (!styleDef) {
        return getStyleFunction(styles, layer, hoverState);
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
        styles.base = styleFactory(featureStyle);
    }
    if (hoverStyle) {
        const hoverDef = hoverStyle.inherit === true ? Object.assign({}, featureStyle, hoverStyle) : hoverStyle;
        styles.hover = styleFactory(hoverDef);
    }
    const optionalStyles = styleDef.optionalStyles;
    if (optionalStyles) {
        styles.optional = optionalStyles.map((optionalDef) => {
            const optional = {
                key: optionalDef.property.key,
                value: optionalDef.property.value,
                style: styleFactory(Object.assign({}, featureStyle, optionalDef))
            };
            if (hoverStyle) {
                const hoverDef = hoverStyle.inherit === true ? Object.assign({}, featureStyle, optionalDef, hoverStyle) : hoverStyle;
                optional.hoverStyle = styleFactory(hoverDef);
            }
            return optional;
        });
    }
    return getStyleFunction(styles, layer, hoverState);
};
