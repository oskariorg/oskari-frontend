export const ensureDefaultFilter = (attributes = {}, layerFields = []) => {
    const normalizedAttributes = structuredClone(attributes || {});
    normalizedAttributes.data = normalizedAttributes.data || {};
    normalizedAttributes.data.filter = normalizedAttributes.data.filter || {};
    if (!Array.isArray(normalizedAttributes.data.filter.default)) {
        normalizedAttributes.data.filter.default = layerFields.map(field => field.name).filter(Boolean);
    }
    return normalizedAttributes;
};