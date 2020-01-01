const layerPropertyFields = {
    URL: 'url',
    NAME: 'name',
    LOCALIZED_NAMES: 'localizedNames',
    GROUP_ID: 'groupId',
    ORGANIZATION_NAME: 'organizationName',
    GROUPS: 'maplayerGroups',
    OPACITY: 'opacity',
    SCALE: 'scale',
    PASSWORD: 'password'
};
// Common property fields for all layer types and versions
const commonFields = [
    layerPropertyFields.NAME,
    layerPropertyFields.LOCALIZED_NAMES,
    layerPropertyFields.GROUP_ID,
    layerPropertyFields.ORGANIZATION_NAME,
    layerPropertyFields.GROUPS,
    layerPropertyFields.OPACITY,
    layerPropertyFields.SCALE
].map(field => [field, true]);

class LayerComposingModel {
    constructor (fields) {
        this.propertyFields = new Map(commonFields);
        if (Array.isArray(fields)) {
            fields.forEach(cur => {
                if (typeof cur === 'string') {
                    this.setPropertyField(cur);
                    return;
                }
                if (typeof cur === 'object') {
                    const { field, versions } = cur;
                    this.setPropertyField(field, versions);
                }
            });
        }
    }
    setPropertyField (field, versions = true) {
        if (!field) {
            return;
        }
        this.propertyFields.set(field, versions);
    }
    getPropertyFields (version) {
        if (!version) {
            return Array.from(this.propertyFields.keys());
        }
        return Array.from(this.propertyFields)
            .filter(entry => {
                const supportedVersions = entry[1];
                return supportedVersions === true || supportedVersions.includes(version);
            })
            .map(entry => entry[0]);
    }
};
// Assign static property fields
Object.keys(layerPropertyFields).forEach(key => {
    LayerComposingModel[key] = layerPropertyFields[key];
});
Oskari.clazz.defineES('Oskari.mapframework.domain.LayerComposingModel', LayerComposingModel);
