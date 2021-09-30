import { VectorStyle } from '../../mapmodule/domain/VectorStyle';
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

    createStylesFromOptions (clear) {
        if (clear === true) {
            this._styles = [];
        }
        // Read options object for styles and hover options
        const options = this.getOptions() || {};
        const { styles = {} } = options;
        Object.keys(styles).forEach(styleId => {
            const style = new VectorStyle(styleId, null, 'normal', styles[styleId]);
            this.addStyle(style);
        });
        // Remove styles from options to be sure that VectorStyle is used
        delete options.styles;
    }

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
        if (!names.length) {
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
            const labels = this._propertySelection.map(p => this._propertyLabels[p] || p);
            return ['ID', ...labels];
        }
        const locales = Object.values(this._propertyLabels);
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
        return [...this._propertySelection];
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
     * @deprecated
     * @return {json} wpsLayerParams
     */
    getWpsLayerParams () {
        const { data = {} } = this.getAttributes();
        const { commonId, wpsInputType, noDataValue } = data;
        const wps = {};
        if (typeof commonId !== 'undefined') {
            wps.join_key = commonId;
        }
        if (typeof wpsInputType !== 'undefined') {
            wps.input_type = wpsInputType;
        }
        if (typeof noDataValue !== 'undefined') {
            wps.no_data = noDataValue;
        }
        return wps;
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
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer', WFSLayer);
