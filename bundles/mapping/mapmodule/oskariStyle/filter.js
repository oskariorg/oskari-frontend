import { FILTER } from './constants';

const { GREATER, LESS, LESS_EQUAL, GREATER_EQUAL, NOT_IN, IN, EQUAL, NOT_LIKE, LIKE, REG_EXP, WILD_CARD } = FILTER;

export const getOptionalStyleFilter = style => {
    const options = {};
    if (style.hasOwnProperty('property')) {
        options.property = style.property;
    }
    if (style.hasOwnProperty('AND')) {
        options.AND = style.AND;
    }
    if (style.hasOwnProperty('OR')) {
        options.OR = style.OR;
    }
    return options;
};

export const filterOptionalStyle = (filter, feature) => {
    const featProps = feature.getProperties();
    const { AND, OR, property } = filter;
    if (AND) {
        return AND.every(filter => filterProperty(filter, featProps[filter.key]));
    }
    if (OR) {
        return !!OR.find(filter => filterProperty(filter, featProps[filter.key]));
    }
    if (property) {
        return filterProperty(property, featProps[property.key]);
    }
    return false;
};

const filterProperty = (property, featValue) => {
    if (!property.hasOwnProperty('key') || featValue === undefined) return false;
    const ignoreCase = property.caseSensitive !== true;

    if (property.hasOwnProperty(GREATER)) {
        // check if range
        if (property.hasOwnProperty(LESS)) {
            return featValue < property[LESS] && featValue > property[GREATER];
        } else if (property.hasOwnProperty(LESS_EQUAL)) {
            return featValue <= property[LESS_EQUAL] && featValue > property[GREATER];
        }
        return featValue > property[GREATER];
    }
    if (property.hasOwnProperty(GREATER_EQUAL)) {
        // check if range
        if (property.hasOwnProperty(LESS)) {
            return featValue < property[LESS] && featValue >= property[GREATER_EQUAL];
        } else if (property.hasOwnProperty(LESS_EQUAL)) {
            return featValue <= property[LESS_EQUAL] && featValue >= property[GREATER_EQUAL];
        }
        return featValue >= property[GREATER_EQUAL];
    }
    if (property.hasOwnProperty(LESS)) {
        return featValue < property[LESS];
    }
    if (property.hasOwnProperty(LESS_EQUAL)) {
        return featValue <= property[LESS_EQUAL];
    }
    if (property.hasOwnProperty(EQUAL)) {
        const styleValue = property[EQUAL];
        if (ignoreCase) {
            return String(styleValue).toLowerCase() === String(featValue).toLowerCase();
        }
        return styleValue === featValue;
    }
    if (property.hasOwnProperty(IN) || property.hasOwnProperty(NOT_IN)) {
        const not = property.hasOwnProperty(NOT_IN);
        const styleValue = not ? property[NOT_IN] : property[IN];
        let match;
        if (Array.isArray(styleValue)) {
            if (ignoreCase) {
                const strFeat = String(featValue).toLowerCase();
                match = styleValue.map(v => String(v).toLowerCase()).includes(strFeat);
            } else {
                match = styleValue.includes(featValue);
            }
        } else if (ignoreCase) {
            match = String(styleValue).toLowerCase() === String(featValue).toLowerCase();
        } else {
            match = styleValue === featValue;
        }

        if (match === undefined) return false;
        return not ? !match : match;
    }
    if (property.hasOwnProperty(LIKE) || property.hasOwnProperty(NOT_LIKE)) {
        const not = property.hasOwnProperty(NOT_LIKE);
        const strValue = ignoreCase ? String(featValue).toLowerCase() : String(featValue);
        const styleValue = not ? property[NOT_LIKE] : property[LIKE];
        let match;
        if (ignoreCase) {
            match = likeMatcher(strValue, String(styleValue).toLowerCase());
        } else {
            match = likeMatcher(strValue, String(styleValue));
        }
        return not ? !match : match;
    }
    if (property.hasOwnProperty(REG_EXP)) {
        const regexp = ignoreCase ? RegExp(property[REG_EXP], 'i') : RegExp(property[REG_EXP]);
        return regexp.test(featValue);
    }
    const ignoredOperators = Object.keys(property).filter(k => !(k === 'key' || k === 'caseSensitive'));
    if (ignoredOperators.length === 0) return false;
    Oskari.log('Oskari.mapping.mapmodule.oskariStyle').debug('Optional style has redundant keys: ' + ignoredOperators);
    return false;
};

const likeMatcher = (featValue, like) => {
    const endsWildCard = like.charAt(like.length - 1) === WILD_CARD;
    const startsWildCard = like.charAt(0) === WILD_CARD;
    let val;
    if (endsWildCard && startsWildCard) {
        val = like.substr(1, like.length - 2);
    } else if (endsWildCard) {
        val = like.substr(0, like.length - 2);
    } else if (startsWildCard) {
        val = like.substr(1);
    } else {
        Oskari.log('Oskari.mapping.mapmodule.oskariStyle').info('Optional style\'s filter like operator does not have wild card, use value operator instead');
        return false;
    }
    return featValue.includes(val);
};
