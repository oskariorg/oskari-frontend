import olStyleStyle from 'ol/style/Style';
import { filterOptionalStyle, getOptionalStyleFilter } from '../../../mapmodule/oskariStyle/filter';

const invisible = new olStyleStyle();

export function styleGenerator (styleFactory, style) {
    const styles = {};
    const featureStyle = style.getFeatureStyle();
    styles.base = styleFactory(featureStyle);
    styles.optional = style.getOptionalStyles().map((optionalDef) => {
        const optional = {
            filter: getOptionalStyleFilter(optionalDef),
            style: styleFactory(Object.assign({}, featureStyle, optionalDef))
        };
        return optional;
    });

    return feature => {
        if (!styles) {
            return invisible;
        }
        if (styles.optional) {
            var found = styles.optional.find(op => filterOptionalStyle(op.filter, feature));
            if (found) {
                return found.style;
            }
        }
        if (styles.base) {
            return styles.base;
        }
        return invisible;
    };
}
