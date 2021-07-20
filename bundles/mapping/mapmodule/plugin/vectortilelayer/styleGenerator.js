import olStyleStyle from 'ol/style/Style';
import { filterOptionalStyle, getOptionalStyleFilter } from '../../../mapmodule/oskariStyle/filter';

const invisible = new olStyleStyle();

const isHovered = (feature, hoverState) => {
    if (!hoverState) {
        return false;
    }
    const { feature: hoverFeature, property } = hoverState;
    if (!hoverFeature || !property) {
        return false;
    }
    return hoverFeature.get(property) === feature.get(property);
};

export function styleGenerator (styleFactory, style, hoverOptions, hoverState) {
    const styles = {};
    const featureStyle = style.getFeatureStyle();
    const hoverStyle = hoverOptions ? hoverOptions.featureStyle : null;
    styles.base = styleFactory(featureStyle);
    if (hoverStyle) {
        const hoverDef = hoverStyle.inherit === true ? Object.assign({}, featureStyle, hoverStyle) : hoverStyle;
        styles.hover = styleFactory(hoverDef);
    }
    styles.optional = style.getOptionalStyles().map((optionalDef) => {
        const optional = {
            filter: getOptionalStyleFilter(optionalDef),
            style: styleFactory(Object.assign({}, featureStyle, optionalDef))
        };
        if (hoverStyle) {
            const hoverDef = hoverStyle.inherit === true ? Object.assign({}, featureStyle, optionalDef, hoverStyle) : hoverStyle;
            optional.hoverStyle = styleFactory(hoverDef);
        }
        return optional;
    });

    return (feature, resolution) => {
        var hovered = isHovered(feature, hoverState);
        if (!styles) {
            return invisible;
        }
        var found = styles.optional.find(op => filterOptionalStyle(op.filter, feature));
        if (found) {
            return hovered && found.hoverStyle ? found.hoverStyle : found.style;
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
