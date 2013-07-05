/**
 * @class Oskari.mapframework.sandbox.Sandbox.mapMethods
 *
 * This category class adds map related methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'map-methods', {
    
    /**
     * @method getMap
     * Returns map domain object
     *
     * @return {Oskari.mapframework.domain.Map}
     */
    getMap : function() {
        return this._core.getMap();
    },

    /** 
     * 
     * @method syncMapState
     * Convenience method to send out a map move request with the values on
     * {Oskari.mapframework.domain.Map} domain object (see #getMap()).
     *
     * @param {Boolean} blnInitialMove (optional)
     * 			If true, will clear the map history after moving. Defaults to false.
     * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
     * (optional)
     * 			Refreshes the map state so that the added layers are shown correctly
     */
    syncMapState : function(blnInitialMove, mapModule) {
        var mapDomain = this._core.getMap();
        var zoom = mapDomain.getZoom();
        var marker = mapDomain.isMarkerVisible();
        
        if (blnInitialMove === true && zoom == 12) {
            // workaround, openlayers needs to be nudged a bit to actually draw
            // the map images if we enter at zoomlevel 12
            // so if zoom == 12 -> send a dummy request to get openlayers working
            // correctly
            // TODO: find out why OL needs this
            this._core.processRequest(this._core.getRequestBuilder('MapMoveRequest')(mapDomain.getX(), mapDomain.getY(), 0, false));
        }

        this._core.processRequest(this._core.getRequestBuilder('MapMoveRequest')(mapDomain.getX(), mapDomain.getY(), zoom, marker));
        if (blnInitialMove === true) {
            // clear history
            this._core.processRequest(this._core.getRequestBuilder('ClearHistoryRequest')());
        }
    },

    /**
     * @method generateMapLinkParameters
     * Generates query string for an URL that has the maps state with coordinates, zoom and selected map layers
     * 
     * Options syntax/supported fields:  {
     *     marker : <boolean, default false>,
     *     forceCache : <boolean, default true>,
     *     noSavedState : <boolean, default true>
     * } 
     * 
     * @param {Object} options - overrides default parameter values (optional) 
     * @return {String}
     */
    generateMapLinkParameters : function(options) {
        // get stateful component parameters
        // Note! These parameters must be passed to the server in index.js to be used
        var components = this.getStatefulComponents(),
            iterator = null,
            component = null,
            optionsLinkParameterArray = [],
            componentLinkParameterArray = [];
        for (iterator in components) {
            component = components[iterator];

            // Make sure the function exists and is a function
            if (component.getStateParameters && typeof component.getStateParameters === "function") {
                componentLinkParameterArray.push(component.getStateParameters());
            }
        }

        // use given options or empty object to have the strings only once
        options = options || {"showMarker": false, "forceCache": false, "noSavedState": false};

        for (iterator in options) {
            optionsLinkParameterArray.push(iterator + '=' + (options[iterator] !== false));
        }

        // Use array join to make sure the values are always separated with '&', but not the first or last
        return componentLinkParameterArray.concat(optionsLinkParameterArray).join('&') || null;
    }
});
