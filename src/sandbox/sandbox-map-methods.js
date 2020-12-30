/**
 * @class Oskari.Sandbox.mapMethods
 *
 * This category class adds map related methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.Sandbox', 'map-methods', {

    /**
     * @method getMap
     * Returns map domain object
     *
     * @return {Oskari.mapframework.domain.Map}
     */
    getMap: function () {
        return this.getService('mapmodule.state');
    },

    /**
     *
     * @method syncMapState
     * Convenience method to send out a map move request with the values on
     * {Oskari.mapframework.domain.Map} domain object (see #getMap()).
     *
     * @param {Boolean} blnInitialMove (optional)
     *          If true, will clear the map history after moving. Defaults to false.
     * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
     * (optional)
     *          Refreshes the map state so that the added layers are shown correctly
     */
    syncMapState: function (blnInitialMove, mapModule) {
        var mapDomain = this.getMap();
        var zoom = mapDomain.getZoom();
        var maxZoom = 13;

        if (mapModule) {
            maxZoom = mapModule.getMaxZoomLevel();
        }

        if (blnInitialMove === true && zoom == maxZoom) {
            // workaround, openlayers needs to be nudged a bit to actually draw
            // the map images if we enter at max zoomlevel
            // so if zoom == max zoom level -> send a dummy request to get openlayers working
            // correctly
            // TODO: find out why OL needs this
            this.postRequestByName('MapMoveRequest', [mapDomain.getX(), mapDomain.getY(), 0], true);
        }
        this.postRequestByName('MapMoveRequest', [mapDomain.getX(), mapDomain.getY(), zoom], true);
    },

    /**
     * @method generateMapLinkParameters
     * Generates query string for an URL that has the maps state with coordinates, zoom and selected map layers
     *
     * @param {Object} extraParams - object with parameters to add {param: value}
     * @param {Boolean} optimized - hint for stateful components to leavy some params out (like hidden layers etc when we want to get the state for printing etc)
     * @return {String}
     */
    generateMapLinkParameters: function (extraParams = {}, optimized = false) {
        if (typeof extraParams !== 'object') {
            this.getLog().warn('Extra params for map links is not an object (ignoring)', extraParams);
            extraParams = {};
        }
        // get stateful component parameters
        const bundleStates = Object.values(this.getStatefulComponents())
            .map(bundle => {
                if (!bundle || typeof bundle.getStateParameters !== 'function') {
                    // invalid bundle or getStateParameters() is not implemented for stateful bundle
                    return;
                }
                return bundle.getStateParameters(optimized);
            })
            .filter(value => typeof value !== 'undefined');

        const additionalParams = Object.keys(extraParams).map(function (param) {
            return param + '=' + extraParams[param];
        });

        // Use array join to make sure the values are always separated with '&', but not the first or last
        return bundleStates.concat(additionalParams).join('&') || null;
    }
});
