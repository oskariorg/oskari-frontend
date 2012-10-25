/**
 * @class Oskari.mapframework.core.Core
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-methods', {

    /**
     * @method updateMousePositionOnMap
     * 
     * Updates the mouse position in map domain
     * @param {Integer} x mouseposition x coordinate
     * @param {Integer} y mouseposition y coordinate
     * @deprecated
     */
    updateMousePositionOnMap : function(x, y) {
        var map = this._map;
        map.updateMousePosition(x, y);
    },
    doSniffing : function(layersArray) {
        /* Check if map movements should be logged */
        if(this._doSniffing) {
            var sniffer = this.getService('Oskari.mapframework.service.UsageSnifferService');
            var visibleLayers = new Array();
            var scale = this._map.getScale();

            /* Loop layers and their sublayers */
            for(var i = 0; i < layersArray.length; i++) {
                var layer = layersArray[i];

                /* first check sublayers */
                for(var j = 0; j < layer.getSubLayers().length; j++) {
                    var subLayer = layer.getSubLayers()[j];
                    if(subLayer.isVisible() && subLayer.getMinScale() >= scale && subLayer.getMaxScale() <= scale) {
                        visibleLayers.push(subLayer);
                    }
                }

                /* then layer it self if it is not a base layer */
                if(!layer.isBaseLayer() && layer.isVisible() && layer.getMinScale() >= scale && layer.getMaxScale() <= scale) {
                    visibleLayers.push(layer);
                }
            }
            if(visibleLayers.length > 0) {
                sniffer.registerMapMovement(visibleLayers, this._map.getX(), this._map.getY(), this._map.getZoom(), this._map.getBbox().toBBOX(), this._mapIdFromUrl);
            }
        }
    },

    generateUrlToCurrentPage : function() {

        var locationPath = window.location.pathname;

        /* This will remove sessionId, if such exits */
        if(locationPath.match(";")) {
            locationPath = locationPath.substring(0, locationPath.indexOf(";"));
        }

        var baseUrl = window.location.protocol + "//" + window.location.host + locationPath;
        return baseUrl;
    },
    handleDrawPolygonRequest : function(request) {
        var polygon = request.getPolygon();
        var event = this.getEventBuilder(
        'AfterDrawPolygonEvent')(polygon);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleDrawSelectedPolygonRequest : function(request) {
        var polygon = request.getPolygon();
        var event = this.getEventBuilder(
        'AfterDrawSelectedPolygonEvent')(polygon);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleSelectPolygonRequest : function(request) {
        var id = request.getId();
        var groupId = request.getGroupId();
        var event = this.getEventBuilder(
        'AfterSelectPolygonEvent')(id, groupId);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleUpdateHiddenValueRequest : function(request) {
        var polygon = request.getPolygon();
        var event = this.getEventBuilder(
        'AfterUpdateHiddenValueEvent')(polygon);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleErasePolygonRequest : function(request) {
        var id = request.getId();
        var event = this.getEventBuilder(
        'AfterErasePolygonEvent')(id);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleRemovePolygonRequest : function(request) {
        var id = request.getId();
        var groupId = request.getGroupId();
        var showPol = request.getShowPol();
        var event = this.getEventBuilder(
        'AfterRemovePolygonEvent')(id, groupId, showPol);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleHideMapMarkerRequest : function(request) {
        /* Set marker state to domain */
        this._map.setMarkerVisible(false);

        var event = this.getEventBuilder(
        'AfterHideMapMarkerEvent')();
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    }
});
