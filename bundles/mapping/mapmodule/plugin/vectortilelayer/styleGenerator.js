import olStyleStyle from 'ol/style/Style';
import {FTR_PROPERTY_ID} from '../../domain/constants';

const invisible = new olStyleStyle();

const isHovered = (feature, hoverState) => {
    if (hoverState && hoverState.feature) {
        if (hoverState.propertyId) {
            return hoverState.propertyId === feature.get(FTR_PROPERTY_ID);
        } else {
            return hoverState.feature === feature;
        }
    }
    return false;
};

export default function styleGenerator (styleFactory, styleDef, hoverOptions, hoverState) {
    const styleCache = {};
    Object.keys(styleDef).forEach((layerName) => {
        const styles = {};
        const layerStyleDef = styleDef[layerName];
        const featureStyle = layerStyleDef.featureStyle;
        const hoverStyle = hoverOptions ? hoverOptions.featureStyle : null;
        if (featureStyle) {
            styles.base = styleFactory(featureStyle);
        }
        if (hoverStyle) {
            const hoverDef = hoverStyle.inherit === true ? Object.assign({}, featureStyle, hoverStyle) : hoverStyle;
            styles.hover = styleFactory(hoverDef);
        }
        const optionalStyles = layerStyleDef.optionalStyles;
        if (optionalStyles) {
            styles.optional = optionalStyles.map((optionalDef) => {
                const optional = {
                    key: optionalDef.property.key,
                    value: optionalDef.property.value,
                    style: styleFactory(Object.assign({}, featureStyle, optionalDef))
                };
                if (hoverStyle) {
                    const hoverDef = hoverStyle.inherit === true ? Object.assign({}, featureStyle, hoverStyle) : hoverStyle;
                    optional.hoverStyle = styleFactory(hoverDef);
                }
                return optional;
            });
        }
        styleCache[layerName] = styles;
    });
    return (feature, resolution) => {
        var hovered = isHovered(feature, hoverState);
        var styles = styleCache[feature.get('layer')];
        if (!styles) {
            return invisible;
        }
        if (styles.optional) {
            var found = styles.optional.find((op) => {
                return feature.get(op.key) === op.value;
            });
            if (found) {
                return hovered && found.hoverStyle ? found.hoverStyle : found.style;
            }
        }
        if (hovered && styles.hover) {
            return styles.hover;
        }
        if (styles.base) {
            return styles.base;
        }
        return invisible;
    };
}
