export const getTypedStyle = (styleDef, type) => {
    const { image, stroke: { area, ...stroke } , fill, ...rest } = styleDef;
    if (type === 'point') {
        return { image, ...rest };
    }
    if (type === 'line') {
        return { stroke, ...rest };
    }
    if (type === 'area') {
        return { stroke: { area }, fill, ...rest };
    }
    return styleDef;
};

export const recognizeChanges = (original = {}, updated = {}) => {
    return Object.entries(updated).reduce((diff, [key, val]) => {
        const originalVal = original[key];
        if (typeof val === 'object') {
            const objDiff = recognizeChanges(originalVal, val);
            if (Object.keys(objDiff).length) {
                diff[key] = objDiff;
            }
        } else if (originalVal !== val) {
            diff[key] = val;
        }
        return diff;
    }, {});
};
