import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';

const normalFill = new olStyleFill({
    color: '#FAEBD7'
});
const normalStroke = new olStyleStroke({
    color: '#000000',
    width: 1
});

const selectedFill = new olStyleFill({
    color: '#e19b28'
});
const selectedStroke = new olStyleStroke({
    color: '#e19b28',
    width: 2
});

const normalStyle = new olStyleStyle({
    image: new olStyleCircle({
        radius: 6,
        fill: normalFill,
        stroke: normalStroke
    }),
    fill: normalFill,
    stroke: normalStroke
});

const selectedLine = new olStyleStyle({
    stroke: selectedStroke
});

const selectedOther = new olStyleStyle({
    image: new olStyleCircle({
        radius: 6,
        fill: selectedFill,
        stroke: normalStroke
    }),
    fill: selectedFill,
    stroke: normalStroke
});

export function selectedStyle (feature, resolution) {
    switch (feature.getGeometry().getType()) {
    case 'LineString':
    case 'MultiLineString':
        return selectedLine;
    default:
        return selectedOther;
    }
}

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

const getStyleFunction = (styleValues, layer, hoverHandler) => {
    return (feature, resolution) => {
        let hovered = hoverHandler.isHovered(feature, hoverHandler);
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

export const styleGenerator = (styleFactory, layer, hoverHandler) => {
    const styles = {
        base: normalStyle
    };
    if (!layer) {
        return getStyleFunction(styles, layer, hoverHandler);
    }
    let styleDef = layer.getCurrentStyleDef();
    if (!styleDef) {
        return getStyleFunction(styles, layer, hoverHandler);
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
    return getStyleFunction(styles, layer, hoverHandler);
};
