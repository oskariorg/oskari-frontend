import { AbstractVectorLayer } from '../../mapmodule/domain/AbstractVectorLayer';
/**
 * @class Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer
 *
 * MapLayer of type WFS
 */

export class WFSLayer extends AbstractVectorLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'WFS';
        this._properties = {};
    }
    /* Overriding methods */

    isFilterSupported () {
        return true;
    }

    isSupportedSrs () {
        return true;
    }

    getLayerUrl () {
        return Oskari.urls.getRoute('GetWFSVectorTile') + `&id=${this.getId()}&srs={epsg}&z={z}&x={x}&y={y}`;
    }

    handleDescribeLayer (info) {
        super.handleDescribeLayer(info);
        this._properties = info.properties || {};
    }

    /* Layer type specifics */

    getProperties () {
        return this._properties;
    }

    /**
     * @method getFields
     * @deprecated
     * @return {String[]} fields
     */
    getFields () {
        Oskari.log('WFSLayer').deprecated('getFields()');
        const selection = this.getPropertySelection();
        return selection.length ? ['__fid', ...selection] : [];
    }

    /**
     * @method getLocales
     * @deprecated
     * @return {String[]} locales
     */
    getLocales () {
        Oskari.log('WFSLayer').deprecated('getLocales()');
        const labels = this.getProperties().filter(prop => prop.hidden !== true).map(prop => prop.label || prop.name);
        return labels.length ? ['ID', ...labels] : [];
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
        return this.getProperties().find(prop => prop.name === field)?.format || {};
    }

    /**
     * @method getPropertySelection
     * @return {String[]} propertySelection
     */
    getPropertySelection () {
        return this.getProperties().filter(prop => prop.hidden !== true).map(prop => prop.name);
    }

    /**
     * @method getPropertyLabels
     * @return {json} propertyLabels
     */
    getPropertyLabels () {
        return this.getProperties().reduce((labels, prop) => {
            labels[prop.name] = prop.label || prop.name;
            return labels;
        }, {});
    }

    /**
     * @method getPropertyTypes
     * @return {json} propertyTypes
     */
    getPropertyTypes () {
        return this.getProperties().reduce((types, prop) => {
            types[prop.name] = prop.type;
            return types;
        }, {});
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
        const { commonId, wpsInputType, noDataValue } = this._data;
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
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer', WFSLayer);
