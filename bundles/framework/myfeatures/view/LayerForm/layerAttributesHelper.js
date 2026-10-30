export const setDefaultFilter = (attributes = {}, layerFields = [], visibleFields = []) => {
    const normalizedAttributes = structuredClone(attributes || {});
    normalizedAttributes.data = normalizedAttributes.data || {};
    normalizedAttributes.data.filter = normalizedAttributes.data.filter || {};
    const allFieldsVisible = layerFields.length === visibleFields.length &&
        layerFields.every(field => visibleFields.includes(field.name));

    if (allFieldsVisible) {
        delete normalizedAttributes.data.filter.default;
        if (!Object.keys(normalizedAttributes.data.filter).length) {
            delete normalizedAttributes.data.filter;
        }
        if (!Object.keys(normalizedAttributes.data).length) {
            delete normalizedAttributes.data;
        }
        return normalizedAttributes;
    }

    normalizedAttributes.data.filter.default = structuredClone(visibleFields);
    return normalizedAttributes;
};