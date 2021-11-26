
export const getMVTFeaturesInExtent = (source, extent, idPropName = 'id') => {
    const featuresById = new Map();
    const features = source.getFeaturesInExtent(extent);
    // map will only hold one feature/id so we get rid of duplicates
    features.forEach((feature) => {
        const id = feature.get(idPropName);
        if (typeof id !== 'undefined') {
            featuresById.set(id, feature);
        }
    });
    return Array.from(featuresById.values());
};
