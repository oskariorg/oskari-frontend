import { AbstractVectorLayer } from '../../domain/AbstractVectorLayer';
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
        this._properties = [];
    }

    /* Overriding methods */
    hasFeatureData () {
        return true;
    }

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
        this._properties = info.properties || [];
    }

    getGeometryType (raw) {
        if (raw) {
            return this._properties.find(p => p.type === 'geometry')?.rawType;
        }
        return super.getGeometryType();
    }

    /* Layer type specifics */

    replaceFeatureId () {
        return this._controlData.replaceFeatureId;
    }

    getProperties (all) {
        if (all) {
            return this._properties;
        }
        return this._properties.filter(p => p.type !== 'geometry' && !p.hidden);
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
        return this.getProperties().map(prop => prop.name);
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
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer', WFSLayer);
