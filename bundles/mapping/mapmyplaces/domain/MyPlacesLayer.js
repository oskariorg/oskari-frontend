/**
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer
 *
 * MapLayer of type MyPlaces
 */
const WFSLayer = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');

export class MyPlacesLayer extends WFSLayer {
    constructor () {
        super();
        /* Layer Type */
        this._layerType = 'MYPLACES';
        this._metaType = 'MYPLACES';
    }
    /* Layer type specific functions */

    /**
     * Sets the wms url for the layer.
     *
     * @method setWmsUrl
     * @param {String} wmsUrl
     */
    setWmsUrl (wmsUrl) {
        this._wmsUrl = wmsUrl;
    }

    /**
     * Returns the wms url of the layer.
     *
     * @method getWmsUrl
     * @return {String}
     */
    getWmsUrl () {
        return this._wmsUrl;
    }

    /**
     * @method setWmsName
     * @param {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWmsName (wmsName) {
        this._wmsName = wmsName;
    }

    /**
     * @method getWmsName
     * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWmsName () {
        return this._wmsName;
    }

    isFilterSupported () {
        // this defaults to false in AbstractLayer, but WFSLayer returns true.
        // Not sure if this is something we want, but it's the same behavior as before but NOT having
        // WFS and analysis referenced in AbstractLayer
        return false;
    }
}
Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer', MyPlacesLayer);
