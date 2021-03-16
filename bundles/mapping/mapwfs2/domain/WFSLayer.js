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
        this._propertySelection = []; // names to order and limit visible properties
        this._propertyLabels = {};
        this._propertyTypes = {};
        this._styles = []; /* Array of styles that this layer supports */
        this._customStyle = null;
        this._userStyles = [];
        this.localization = Oskari.getLocalization('MapWfs2');
        this.sandbox = Oskari.getSandbox();
    }
    /* Overriding methods */

    hasFeatureData () {
        return true;
    }

    isFilterSupported () {
        return true;
    }

    getLegendImage () {
        return null;
    }

    isSupportedSrs () {
        return true;
    }

    getLayerUrl () {
        return Oskari.urls.getRoute('GetWFSVectorTile') + `&id=${this.getId()}&srs={epsg}&z={z}&x={x}&y={y}`;
    }

    /* Layer type specific s */

    /**
     * @method getFields
     * @deprecated
     * @return {String[]} fields
     */
    getFields () {
        const id = '__fid';
        if (this._propertySelection.length) {
            return [id, ...this._propertySelection];
        }
        let names = Object.keys(this._propertyLabels);
        if (names.length) {
            names = Object.keys(this._propertyTypes);
        }
        if (names.length) {
            return [id, ...names];
        }
        return [];
    }

    /**
     * @method setFields
     * @deprecated
     * @param {String[]} fields
     */
    setFields () {
        Oskari.log('WFSLayer').deprecated('setFields');
    }

    /**
     * @method getLocales
     * @deprecated
     * @return {String[]} locales
     */
    getLocales () {
        if (this._propertySelection.length) {
            const labels = this._propertySelection.map(p => this._propertyNames[p] || p);
            return ['ID', ...labels];
        }
        const locales = Object.values(this._propertyNames);
        return locales.length ? ['ID', ...locales] : locales;
    }

    /**
     * @method setLocales
     * @deprecated
     * @param {String[]} locales
     */
    setLocales () {
        Oskari.log('WFSLayer').deprecated('setLocales');
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
     * @method setPropertySelection
     * @param {String[]} propertySelection
     */
    setPropertySelection (propertySelection) {
        this._propertySelection = propertySelection;
    }

    /**
     * @method getPropertySelection
     * @return {String[]} propertySelection
     */
    getPropertySelection () {
        return [...this.propertySelection];
    }

    /**
     * @method setPropertyLabels
     * @param {json} propertyLabels
     */
    setPropertyLabels (propertyLabels) {
        this._propertyLabels = propertyLabels;
    }

    /**
     * @method getPropertyLabels
     * @return {json} propertyLabels
     */
    getPropertyLabels () {
        return { ...this._propertyLabels };
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
        return { ...this._propertyTypes };
    }

    /**
     * @method setWpsLayerParams
     * @deprecated
     * @param {json} wpsLayerParams
     */
    setWpsLayerParams () {
        Oskari.log('WFSLayer').deprecated('setWpsLayerParams');
    }

    /**
     * @method getWpsLayerParams
     * @return {json} wpsLayerParams
     */
    getWpsLayerParams () {
        const { wpsParams = {} } = this.getAttributes();
        return wpsParams;
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
        // update custom style
        const style = this._userStyles.filter(style => style.name === styleName)[0];
        this.setCustomStyle(style);
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer', WFSLayer);
