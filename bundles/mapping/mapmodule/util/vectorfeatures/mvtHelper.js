export const getMVTFeaturesInExtent = (layer, extent, idPropName = 'id') => {
    const featuresById = new Map();
    const features = layer.getFeaturesInExtent(extent);
    // map will only hold one feature/id so we get rid of duplicates
    features.forEach((feature) => {
        const id = feature.get(idPropName);
        if (typeof id !== 'undefined') {
            featuresById.set(id, feature);
        }
    });
    return Array.from(featuresById.values());
};
