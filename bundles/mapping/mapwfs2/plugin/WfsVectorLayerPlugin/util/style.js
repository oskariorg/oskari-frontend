/* eslint-disable new-cap */
import { Style as olStyle, Circle as olCircleStyle, Stroke as olStroke, Fill as olFill, Text as olText } from 'ol/style';

const defaults = {
    style: {
        fill: {
            color: '#FAEBD7'
        },
        stroke: {
            color: '#000000',
            width: 1,
            area: {
                color: '#000000',
                width: 1
            }
        },
        image: {
            shape: 5,
            size: 3,
            fill: {
                color: '#FAEBD7'
            }
        }
    },
    selected: {
        inherit: true,
        effect: 'auto major',
        stroke: {
            area: {
                effect: 'none',
                color: '#000000',
                width: 4
            },
            width: 3
        }
    },
    hover: {
        inherit: true,
        effect: 'auto minor',
        stroke: {
            area: {
                effect: 'none',
                color: '#000000',
                width: 2
            },
            width: 2
        }
    }
};

const applyAlphaToColorable = (colorable, alpha) => {
    if (!colorable || !colorable.getColor()) {
        return;
    }
    if (Array.isArray(colorable.getColor())) {
        const color = [...colorable.getColor()];
        color[3] = alpha;
        colorable.setColor(color);
        return;
    }
    let colorLike = colorable.getColor();
    if (typeof colorLike !== 'string') {
        return;
    }
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
    const alpha = opacity < 1 ? opacity : opacity / 100.0;
    applyAlphaToColorable(olStyle.getFill(), alpha);
    applyAlphaToColorable(olStyle.getStroke(), alpha);
    if (olStyle.getImage()) {
        olStyle.getImage().setOpacity(alpha);
    }
    return olStyle;
};

const _setFeatureLabel = (feature, textStyle, labelProperty) => {
    let prop;
    if (Array.isArray(labelProperty)) {
        prop = labelProperty.find(p => feature.get(p));
    } else {
        prop = labelProperty;
    }
    if (!prop) {
        return;
    }
    textStyle.setText(feature.get(prop));
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
        case 'MultiPoint':
            style = styleTypes.dot || styleTypes; break;
        };
        const textStyle = style.getText();
        if (styleTypes.labelProperty && textStyle) {
            _setFeatureLabel(feature, textStyle, styleTypes.labelProperty);
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

const merge = (...styles) => jQuery.extend(true, {}, ...styles);

export const styleGenerator = (styleFactory, layer, hoverHandler) => {
    let styles = {
        default: getGeomTypedStyles(defaults.style, styleFactory),
        selected: getGeomTypedStyles(merge(defaults.style, defaults.selected), styleFactory),
        hover: getGeomTypedStyles(merge(defaults.style, defaults.hover), styleFactory),
        selectedHover: getGeomTypedStyles(merge(defaults.style, defaults.hover, defaults.selected), styleFactory)
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
    const featureStyle = styleDef.featureStyle || defaults.style;
    let hoverStyle = defaults.hover;
    if (layer.getHoverOptions() && layer.getHoverOptions().featureStyle) {
        hoverStyle = layer.getHoverOptions().featureStyle;
    }
    let hoverDef = hoverStyle.inherit === true ? merge(featureStyle, hoverStyle) : hoverStyle;
    if (featureStyle) {
        styles.customized = getGeomTypedStyles(featureStyle, styleFactory);
        styles.selected = getGeomTypedStyles(merge(featureStyle, defaults.selected), styleFactory);
        styles.hover = getGeomTypedStyles(hoverDef, styleFactory);
        styles.selectedHover = getGeomTypedStyles(merge(hoverDef, defaults.selected), styleFactory);
    }
    const optionalStyles = styleDef.optionalStyles;
    if (optionalStyles) {
        styles.optional = optionalStyles.map((optionalDef) => {
            if (hoverStyle.inherit) {
                hoverDef = merge(featureStyle, optionalDef, hoverStyle);
            }
            const optional = {
                key: optionalDef.property.key,
                value: optionalDef.property.value,
                customized: getGeomTypedStyles(merge(featureStyle, optionalDef), styleFactory),
                selected: getGeomTypedStyles(merge(featureStyle, optionalDef, defaults.selected), styleFactory),
                hover: getGeomTypedStyles(hoverDef, styleFactory),
                selectedHover: getGeomTypedStyles(merge(hoverDef, defaults.selected), styleFactory)
            };
            return optional;
        });
    }
    return getStyleFunction(styles, hoverHandler);
};

// Style for cluster circles
const clusterStyleCache = {};
export const clusterStyleFunc = (feature, isSelected) => {
    const size = feature.get('features').length;
    const cacheKey = [`${size} ${isSelected}`];
    let style = clusterStyleCache[cacheKey];
    if (!style) {
        style = new olStyle({
            image: new olCircleStyle({
                radius: size > 9 ? 14 : 12,
                stroke: new olStroke({
                    color: '#fff'
                }),
                fill: new olFill({
                    color: isSelected ? '#005d90' : '#3399CC'
                })
            }),
            text: new olText({
                text: size.toString(),
                font: 'bold 14px sans-sherif',
                fill: new olFill({
                    color: '#fff'
                })
            })
        });
        clusterStyleCache[cacheKey] = style;
    }
    return style;
};
export const hiddenStyle = new olStyle({ visibility: 'hidden' });
