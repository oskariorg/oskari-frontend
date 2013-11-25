/**
 * @class Oskari.mapframework.core.Core.mapMethods
 *
 * This category class adds map related methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-methods', {

    /**
     * @method _handleHideMapMarkerRequest
     * Sends out a AfterHideMapMarkerEvent to hide the marker
     * TODO: this should be refactored so that markers plugin keeps track of markers and
     * handles the HideMapMarkerRequest directly!
     * @deprecated
     * @param {Oskari.mapframework.request.common.HideMapMarkerRequest} request
     * @private
     */
    _handleHideMapMarkerRequest: function (request) {
        /* Set marker state to domain */
        this._map.setMarkerVisible(false);

        var evt = this.getEventBuilder('AfterHideMapMarkerEvent')();
        this.copyObjectCreatorToFrom(evt, request);
        this.dispatch(evt);
    }
});