/**
 * @class Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer
 *
 * MapLayer of type WFS
 */

const VectorTileLayer = Oskari.clazz.get('Oskari.mapframework.mapmodule.VectorTileLayer');

export class WFSLayer extends VectorTileLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'WFS';
        this._featureData = true;
        this._fields = []; // property names
        this._locales = []; // property name locales
        this._activeFeatures = []; // features on screen
        this._selectedFeatures = []; // filtered features
        this._clickedFeatureIds = []; // clicked feature ids (map)
        this._clickedFeatureListIds = []; // clicked feature ids (list)
        this._clickedGeometries = []; // clicked feature geometries [[id  geom]..]
        this._propertyTypes = {}; // name and describeFeatureType type (hashmap  json) (Analysis populates)
        this._wpsLayerParams = {}; // wfs/wps analysis layer params (hashmap  json)    (Analysis populates)
        this._styles = []; /* Array of styles that this layer supports */
        this._customStyle = null;
        this._filterJson = null;
        this._internalOpened = false;
        this._userStyles = [];
        this.localization = Oskari.getLocalization('MapWfs2');
        this.sandbox = Oskari.getSandbox();
    }

    /* Layer type specific s */

    /**
     * @method getFields
     * @return {String[]} fields
     */
    getFields () {
        return this._fields;
    }

    /**
     * @method setFields
     * @param {String[]} fields
     */
    setFields (fields) {
        this._fields = fields;
    }

    /**
     * @method getLocales
     * @return {String[]} locales
     */
    getLocales () {
        return this._locales;
    }

    /**
     * @method setLocales
     * @param {String[]} locales
     */
    setLocales (locales) {
        this._locales = locales;
    }

    /**
     * Returns an formatter object for given field name.
     * The object can have type and params like:
     * {
     *   type: "link",
     *   params: {
     *     label: "Link title"
     *   }
     * }
     * But it can be an empty config if nothing is configured.
     * This is used to instruct GFI value formatting
     * @param {String} field feature property name that might have formatter options configured
     */
    getFieldFormatMetadata (field) {
        if (typeof field !== 'string') {
            return {};
        }
        const { data = {} } = this.getAttributes();
        const { format } = data;
        if (typeof format !== 'object') {
            return {};
        }
        return format[field] || {};
    }

    /**
     * @method getActiveFeatures
     * @return {Object[]} features
     */
    getActiveFeatures () {
        return this._activeFeatures;
    }

    /**
     * @method setActiveFeature
     * @param {Object} feature
     */
    setActiveFeature (feature) {
        this._activeFeatures.push(feature);
    }

    /**
     * @method setActiveFeatures
     * @param {Object[]} features
     */
    setActiveFeatures (features) {
        this._activeFeatures = features;
    }

    /**
     * @method getSelectedFeatures
     * @return {Object[]} features
     */
    getSelectedFeatures () {
        return this._selectedFeatures;
    }

    /**
     * @method setSelectedFeature
     * @param {Object} feature
     */
    setSelectedFeature (feature) {
        this._selectedFeatures.push(feature);
    }

    /**
     * @method setSelectedFeatures
     * @param {Object[]} features
     */
    setSelectedFeatures (features) {
        this._selectedFeatures = features;
    }

    /**
     * @method getClickedFeatureIds
     * @return {String[]} featureIds
     */
    getClickedFeatureIds () {
        return this._clickedFeatureIds;
    }

    /**
     * @method setClickedFeatureId
     * @param {String} id
     */
    setClickedFeatureId (id) {
        this._clickedFeatureIds.push(id);
    }

    /**
     * @method setClickedFeatureIds
     * @param {String[]} features
     */
    setClickedFeatureIds (ids) {
        this._clickedFeatureIds = ids;
    }

    /**
     * @method getClickedFeatureListIds
     * @return {String[]} featureIds
     */
    getClickedFeatureListIds () {
        return this._clickedFeatureListIds;
    }

    /**
     * @method setClickedFeatureListId
     * @param {String} id
     */
    setClickedFeatureListId (id) {
        this._clickedFeatureListIds.push(id);
    }

    /**
     * @method setClickedFeatureListIds
     * @param {String} id
     */
    setClickedFeatureListIds (ids) {
        this._clickedFeatureListIds = ids;
    }

    /**
     * @method setPropertyTypes
     * @param {json} propertyTypes
     */
    setPropertyTypes (propertyTypes) {
        this._propertyTypes = propertyTypes;
    }

    /**
     * @method getPropertyTypes
     * @return {json} propertyTypes
     */
    getPropertyTypes () {
        return this._propertyTypes;
    }

    /**
     * @method setWpsLayerParams
     * @param {json} wpsLayerParams
     */
    setWpsLayerParams (wpsLayerParams) {
        this._wpsLayerParams = wpsLayerParams;
    }

    /**
     * @method getWpsLayerParams
     * @return {json} wpsLayerParams
     */
    getWpsLayerParams () {
        return this._wpsLayerParams;
    }

    /**
     * @method getFilterJson
     * @return {Object[]} filterJson
     */
    getFilterJson () {
        return this._filterJson;
    }

    /**
     * @method setFilterJson
     * @param {Object} filterJson
     */
    setFilterJson (filterJson) {
        this._filterJson = filterJson;
    }

    /**
     * Overriding getLegendImage for WFS
     *
     * @method getLegendImage
     * @return {String} URL to a legend image
     */
    getLegendImage () {
        return null;
    }

    /**
     * @method setCustomStyle
     * @param {json} customStyle
     */
    setCustomStyle (customStyle) {
        this._customStyle = customStyle;
    }

    /**
     * @method getCustomStyle
     * @return {json} customStyle
     */
    getCustomStyle () {
        return this._customStyle;
    }

    /**
     * @method getStyles
     * @return {Oskari.mapframework.domain.Style[]}
     * Gets layer styles
     */
    getStyles () {
        if (this._userStyles.length > 0) {
            const styles = this._userStyles.map(s => {
                const style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
                style.setName(s.name);
                style.setTitle(s.title);
                style.setLegend('');
                return style;
            });
            return this._styles.concat(styles);
        }
        return this._styles;
    }

    /**
     * @method getStyleDef
     * @param {String} styleName
     * @return {Object}
     */
    getStyleDef (styleName) {
        const userStyleWithMetadata = this._userStyles.filter(s => s.name === styleName)[0];
        if (userStyleWithMetadata) {
            return { [this._layerName]: { featureStyle: userStyleWithMetadata.style } };
        }
        if (this._options.styles) {
            return this._options.styles[styleName];
        }
    }

    /**
     * To get distance between features when clustering kicks in.
     *  @method getClusteringDistance
     *  @return {Number} Distance between features in pixels
     */
    getClusteringDistance () {
        return this._options.clusteringDistance;
    }

    /**
     * To setup clustering. Sets the minimum distance between features before clustering kicks in.
     *  @method setClusteringDistance
     *  @return {Number} Distance between features in pixels
     */
    setClusteringDistance (distance) {
        this._options.clusteringDistance = distance;
    }

    /**
     * @method isSupportedSrs
     * Wfs layer is always supported
     */
    isSupportedSrs () {
        return true;
    }

    /**
     * @method setWMSLayerId
     * @param {String} id
     * Unique identifier for map layer used to reference the WMS layer
     * which is linked to WFS layer for to use for rendering
     */
    setWMSLayerId (id) {
        this._WMSLayerId = id;
    }

    /**
     * @method getWMSLayerId
     * @return {String}
     * Unique identifier for map layer used to reference the WMS layer
     * which is linked to WFS layer for to use for rendering
     * (e.g. MapLayerService)
     */
    getWMSLayerId () {
        return this._WMSLayerId;
    }

    /**
     * @method getLayerUrl
     * Superclass override
     */
    getLayerUrl () {
        return Oskari.urls.getRoute('GetWFSVectorTile') + `&id=${this.getId()}&srs={epsg}&z={z}&x={x}&y={y}`;
    }

    isFilterSupported () {
        return true;
    }

    saveUserStyle (styleWithMetadata) {
        if (!styleWithMetadata) {
            return;
        }
        const index = this._userStyles.findIndex(s => s.name === styleWithMetadata.name);
        if (index !== -1) {
            this._userStyles[index] = styleWithMetadata;
        } else {
            this._userStyles.push(styleWithMetadata);
        }
        // Set style to layer
        this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [this.getId(), styleWithMetadata.name]);
    }

    removeStyle (name) {
        const index = this._userStyles.findIndex(s => s.name === name);
        if (index !== -1) {
            this._userStyles.splice(index, 1);
        }

        // Remove style from layer if active.
        const customStyleWrapper = this.getCustomStyle();
        if (customStyleWrapper && customStyleWrapper.name === name) {
            this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [this.getId(), 'default']);
        } else {
            // Only notify to update list of styles in selected layers.
            const event = Oskari.eventBuilder('MapLayerEvent')(this.getId(), 'update');
            this.sandbox.notifyAll(event);
        }
    }

    selectStyle (styleName) {
        // Select style with logic in AbstractLayer
        super.selectStyle(styleName);
        // If style one of custom styles, set it to WFSLayer
        const style = this._userStyles.filter(style => style.name === styleName)[0];
        if (style) {
            this.setCustomStyle(style);
        }
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer', WFSLayer);
