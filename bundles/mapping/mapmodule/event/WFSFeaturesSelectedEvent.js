/**
 * @class Oskari.mapframework.bundle.mapwfs2.event.WFSFeaturesSelectedEvent
 *
 * Used to indicate that a WFS Feature has been selected and components should highlight it in UI
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.event.WFSFeaturesSelectedEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String[]}
 *            wfsFeatureIds WFS feature id selection list
 * @param {Oskari.mapframework.domain.WfsLayer}
 *            mapLayer highlighted/selected maplayer
 * @param {Boolean}
 *            keepCollection true if this should append previous selection
 */
    function (wfsFeatureIds, mapLayer, keepCollection) {
        this._wfsFeatureIds = wfsFeatureIds;
        this._keepCollection = !!keepCollection;
        this._mapLayer = mapLayer;
    }, {
    /** @static @property __name event name */
        __name: 'WFSFeaturesSelectedEvent',
        /**
     * @method getName
     * @return {String} event name
     */
        getName: function () {
            return this.__name;
        },
        /**
     * @method getWfsFeatureIds
     * @return {String[]} WFS feature id selection list
     */
        getWfsFeatureIds: function () {
            return this._wfsFeatureIds;
        },
        /**
     * @method isKeepSelection
     * @return {Boolean} true if this should append previous selection
     */
        isKeepSelection: function () {
            return this._keepCollection;
        },
        /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.WfsLayer} mapLayer highlighted/selected maplayer
     */
        getMapLayer: function () {
            return this._mapLayer;
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        'protocol': ['Oskari.mapframework.event.Event']
    });
