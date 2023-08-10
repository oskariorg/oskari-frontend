const PROPERTY_FIELDS = [
    'API_KEY',
    'ATTRIBUTES',
    'ATTRIBUTIONS',
    'CAPABILITIES',
    'CAPABILITIES_STYLES',
    'CESIUM_ION',
    'CLUSTERING_DISTANCE',
    'CREDENTIALS',
    'EXTERNAL_VECTOR_STYLES',
    'GFI_CONTENT',
    'GFI_TYPE',
    'GFI_XSLT',
    'GROUPS',
    'HOVER',
    'LOCALIZED_NAMES',
    'METADATAID',
    'NAME',
    'OPACITY',
    'ORGANIZATION_NAME',
    'REALTIME',
    'SINGLE_TILE',
    'REFRESH_RATE',
    'SCALE',
    'COVERAGE',
    'SELECTED_TIME',
    'SRS',
    'VECTOR_STYLES',
    'TILE_GRID',
    'TIMES',
    'URL',
    'VERSION',
    'WFS_LAYER',
    'DECLUTTER'
];

// Common fields are enforced on composing model.
const COMMON_PROPERTY_FIELDS = [
    'ATTRIBUTES',
    'GROUPS',
    'LOCALIZED_NAMES',
    'METADATAID',
    'NAME',
    'OPACITY',
    'ORGANIZATION_NAME',
    'SCALE',
    'COVERAGE'
];

const ALL_VERSIONS = 'all';

/**
 * @private
 * @param {string[]|string} [versions]
 * @return {string[]} Version array
 */
const getValidatedVersions = versions => {
    if (Array.isArray(versions)) {
        return versions;
    }
    if (typeof versions !== 'string') {
        return;
    }
    return [versions];
};

/**
 * @classdesc Describes available properties for a layer and it's versions.
 */
class LayerComposingModel {
    /**
     * @param {string[]} fields
     * @param {string[]|string} [versions] Supported layer versions. All versions supported by default.
     * @param {string[]} [skipFields] Fields to skip in constructor. Some layer types don't use all the common fields.
     */
    constructor (fields, versions, skipFields) {
        this.versions = getValidatedVersions(versions);
        this.propertyFields = new Map(COMMON_PROPERTY_FIELDS
            .filter(key => !skipFields ? key : !skipFields.includes(key) ? key : null)
            .map(key => [key, this.versions || ALL_VERSIONS]));

        if (Array.isArray(fields)) {
            fields.forEach(cur => this.setPropertyField(cur, this.versions));
        }
    }

    /**
     * Registers a property for the layer model.
     *
     * @param {string} field Layer property key. One of LayerComposingModel.PROPERTY_FIELDS.
     * @param {string[]|string} [versions] Layer versions where the property is supported in.
     */
    setPropertyField (field, versions) {
        if (!field || !PROPERTY_FIELDS.includes(field)) {
            return;
        }
        const validVersions = getValidatedVersions(versions) || this.versions || ALL_VERSIONS;
        if (!validVersions) {
            return;
        }
        this.propertyFields.set(field, validVersions);
    }

    /**
     * To get layer property fields.
     *
     * @param {string} [version] Require fields for a specific layer version.
     * @return {string[]} Property fields for the layer model.
     */
    getPropertyFields (version) {
        if (!version) {
            return Array.from(this.propertyFields.keys());
        }

        return Array.from(this.propertyFields)
            .filter(entry => {
                const supportedVersions = entry[1];
                return supportedVersions === ALL_VERSIONS || supportedVersions.includes(version);
            })
            .map(entry => entry[0]);
    }

    /**
     * Set supported layer versions. Overrides add previously set property field versions.
     * @param {string[]|string} [versions] Layer versions where the property is supported in.
     */
    setVersions (versions) {
        this.versions = getValidatedVersions(versions);
        for (const field in this.propertyFields.keys()) {
            this.propertyFields.set(field, this.versions);
        }
    }

    /**
     * @return {string[]} Versions with composing support
     */
    getVersions () {
        if (!this.versions) {
            return [];
        }
        return [...this.versions];
    }
};
// Assign static property fields
PROPERTY_FIELDS.forEach(key => {
    LayerComposingModel[key] = key;
});
LayerComposingModel.PROPERTY_FIELDS = PROPERTY_FIELDS;
LayerComposingModel.COMMON_PROPERTY_FIELDS = COMMON_PROPERTY_FIELDS;

Oskari.clazz.defineES('Oskari.mapframework.domain.LayerComposingModel', LayerComposingModel);
