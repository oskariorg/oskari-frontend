const PROPERTY_FIELDS = [
    'URL',
    'CREDENTIALS',
    'API_KEY',
    'NAME',
    'TILE_MATRIX',
    'LOCALIZED_NAMES',
    'ORGANIZATION_NAME',
    'GROUPS',
    'SRS',
    'SELECTED_TIME',
    'REALTIME',
    'REFRESH_RATE',
    'LEGEND_URL',
    'OPACITY',
    'SCALE',
    'STYLE',
    'STYLE_JSON',
    'EXT_STYLE_JSON',
    'HOVER_JSON',
    'CLUSTERING_DISTANCE',
    'METAINFO',
    'WFS_RENDER_MODE',
    'WFS_JOB_TYPE',
    'WFS_IS_RESOLVE_DEPTH',
    'GFI_RESPONSE_TYPE',
    'GFI_XSLT',
    'GFI_CONTENT',
    'CAPABILITIES_UPDATE_RATE',
    'ATTRIBUTES',
    'ATTRIBUTIONS'
];

// Common fields are enforced on composing model.
const COMMON_PROPERTY_FIELDS = [
    'NAME',
    'LOCALIZED_NAMES',
    'ORGANIZATION_NAME',
    'GROUPS',
    'OPACITY',
    'SCALE'
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
     */
    constructor (fields, versions) {
        this.versions = getValidatedVersions(versions) || ALL_VERSIONS;
        this.propertyFields = new Map(COMMON_PROPERTY_FIELDS.map(key => [key, this.versions]));
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
        const validVersions = getValidatedVersions(versions) || this.versions;
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
        this.versions = getValidatedVersions(versions) || ALL_VERSIONS;
        for (const field in this.propertyFields.keys()) {
            this.propertyFields.set(field, this.versions);
        }
    }
    /**
     * @return {string[]} Versions with composing support
     */
    getVersions () {
        if (this.versions === ALL_VERSIONS) {
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
