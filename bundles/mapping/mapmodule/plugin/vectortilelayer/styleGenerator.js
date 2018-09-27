import olStyleStyle from 'ol/style/Style';

const invisible = new olStyleStyle();

export default function styleGenerator(styleFactory, styleDef) {
    const styleCache = {};
    Object.keys(styleDef).forEach((layerName) => {
        const styles = {};
        const layerStyleDef = styleDef[layerName];
        const featureStyle = layerStyleDef.featureStyle;
        if (featureStyle) {
            styles.base = styleFactory(featureStyle);
        }
        const optionalStyles = layerStyleDef.optionalStyles;
        if (optionalStyles) {
            styles.optional = optionalStyles.map((optionalDef) => {
                return {
                    key: optionalDef.property.key,
                    value: optionalDef.property.value,
                    style: styleFactory(Object.assign({}, featureStyle, optionalDef))
                }
            });
        }
        styleCache[layerName] = styles;
    })
    return (feature, resolution) => {
        var styles = styleCache[feature.get('layer')];
        if (!styles) {
            return invisible;
        }
        if (styles.optional) {
            var found = styles.optional.find((op) => {
                return feature.get(op.key) === op.value;
            });
            if (found) {
                return found.style;
            }
        }
        if (styles.base) {
            return styles.base;
        }
        return invisible;
    }
}