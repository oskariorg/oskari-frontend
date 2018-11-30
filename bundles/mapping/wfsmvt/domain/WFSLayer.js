import VectorTileLayer from '../../mapmodule/plugin/vectortilelayer/VectorTileLayer';

export default class WFSLayer extends VectorTileLayer {
    constructor () {
        super();
        /* Layer Type */
        this._layerType = 'WFS';
        this._featureData = true;
        this._fields = []; // property names
        this._locales = []; // property name locales
        this._activeFeatures = []; // features on screen
        this._selectedFeatures = []; // filtered features
        this._clickedFeatureIds = []; // clicked feature ids (map)
        this._clickedFeatureListIds = []; // clicked feature ids (list)
        this._clickedGeometries = []; // clicked feature geometries [[id, geom]..]
        this._propertyTypes = {}; // name and describeFeatureType type (hashmap, json) (Analysis populates)
        this._wpsLayerParams = {}; // wfs/wps analysis layer params (hashmap, json)    (Analysis populates)
        this._styles = []; /* Array of styles that this layer supports */
        this._customStyle = null;
        this._filterJson = null;
        this._internalOpened = false;

        this.localization = Oskari.getLocalization('MapWfs2');
    }
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
     * @method getClickedGeometries
     * @return {String[[]..]} featureId, geometry
     */
    getClickedGeometries () {
        return this._clickedGeometries;
    }

    /**
     * @method setClickedGeometries
     * @param {String[[]..]} id,geom
     */
    setClickedGeometries (fgeom) {
        this._clickedGeometries = fgeom;
    }
    /**
     * @method addClickedGeometries
     * @param {[]} id,geom
     */
    addClickedGeometries (fgeom) {
        for (var j = 0; j < fgeom.length; ++j) {
            this._clickedGeometries.push(fgeom[j]);
        }
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
        if (this.getCustomStyle()) {
            var locOwnStyle = this.localization['own-style'];
            var style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
            style.setName('oskari_custom');
            style.setTitle(locOwnStyle);
            style.setLegend('');
            return this._styles.concat([style]);
        }
        return this._styles;
    }
    /**
     * @method setWMSLayerId
     * @param {String} id
     * Unique identifier for map layer used to reference the WMS layer,
     * which is linked to WFS layer for to use for rendering
     */
    setWMSLayerId (id) {
        this._WMSLayerId = id;
    }
    /**
     * @method getWMSLayerId
     * @return {String}
     * Unique identifier for map layer used to reference the WMS layer,
     * which is linked to WFS layer for to use for rendering
     * (e.g. MapLayerService)
     */
    getWMSLayerId () {
        return this._WMSLayerId;
    }
    /**
     * @method getTileGrid
     * Returns tile grid from options or default tile grid (EPSG:3067)
     */
    getTileGrid () {
        return this._options.tileGrid || {
            origin: [-548576, 8388608],
            resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
            tileSize: [256, 256]
        };
    }
}
