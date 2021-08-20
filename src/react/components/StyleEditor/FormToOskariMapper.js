/*
 * ***************************************************************************************************************************
 * Functions in this file are used to map the logic between AntD form ("flat object" with keys as dot-separated paths referencing parts of oskari style JSON)
 *  and Oskari style (deep structure that needs to be flattened for AntD)
 * ***************************************************************************************************************************
 */
const deepCopy = (style) => JSON.parse(JSON.stringify(style));
/**
 * Takes original oskariStyle as param and returns a function that can be used to get an updated style from AntD form. 
 * The returned function takes param like { 'image.shape': 3}, breaks the dot-separated key to parts and navigates style object structure based on that,
 * updates the referenced object value (for example oskariStyle.image.shape to 3) and returns the modified style
 * @param {Object} originalStyle oskari style JSON that we are going to use as base for updating
 * @returns the modified style (not mutated originalStyle but a new object) 
 */
const createStyleAdjuster = (originalStyle = {}) => {
    const style = deepCopy(originalStyle);
    return (changes) => {
        // changes is like: {image.shape: 3}
        Object.keys(changes).forEach(key => {
            const keyParts = key.split('.');
            let partialStyle = style;
            while (keyParts.length) {
                const partialKey = keyParts.shift();
                if (!keyParts.length) {
                    // found the leaf node. Set value to partialStyle
                    // modifies the style variable as well as partialStyle is a reference to part of it
                    partialStyle[partialKey] = changes[key];
                    break;
                }
                // recurse deeper
                let nextStep = partialStyle[partialKey];
                if (typeof nextStep === 'undefined') {
                    // add missing node/create missing structure
                    nextStep = {};
                    partialStyle[partialKey] = nextStep;
                }
                // set new partialStyle for next iteration
                partialStyle = nextStep;
           }
       });
       // return modified style
       return style;
   };
};

/**
 * Maps an object with deep structure to a flat object with keys having dots to signify structure.
 * Used to feed AntD form an object that populates fields based on Oskari style JSON.
 * @param {Object} style
 */
const createFlatFormObjectFromStyle = (style = {}) => {
    return flattenStyle(style, {});
};

const flattenStyle = (input = {}, result = {}, baseKey = '') => {
    if (typeof input !== 'object') {
        if (baseKey.length) {
            // leaf value
            result[baseKey] = input;
        }
        return result;
    }
    let newBaseKey = '';
    if (baseKey.length > 0) {
        newBaseKey = baseKey + '.';
    }
    Object.keys(input).forEach(styleKey => flattenStyle(input[styleKey], result, newBaseKey + styleKey));
    return result;
};

const convertFillPatternToForm = (style) => {
    switch (style['fill.area.pattern']) {
        case 0:
            style['fill.area.pattern'] = 'DIAGONAL_THIN';
            break;
        case 1:
            style['fill.area.pattern'] = 'DIAGONAL_THICK';
            break;
        case 2:
            style['fill.area.pattern'] = 'HORIZONTAL_THIN';
            break;
        case 3:
            style['fill.area.pattern'] = 'HORIZONTAL_THICK';
            break;
        case 4:
            style['fill.area.pattern'] = 'TRANSPARENT';
            break;
        case 5:
            style['fill.area.pattern'] = 'SOLID';
            break;
        default:
            style['fill.area.pattern'] = 'SOLID';
            break;
    }

    return style;
};

export const FormToOskariMapper = {
    createStyleAdjuster,
    createFlatFormObjectFromStyle,
    convertFillPatternToForm
};
