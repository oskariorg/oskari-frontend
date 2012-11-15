/**
 * @class Oskari.framework.bundle.mapwfs.MapWfsBundleInstance
 * Adds WFS click selection support for map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.MapWfsBundleInstance",
/**
 * @method create called automatically on construction
 * @static
 *
 */
function() {
    this._localization = null;
    this._pluginInstances = {};
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'MapWFS',
    /**
     * @method getName
     * @return {String} the name for the component
     */
    "getName" : function() {
        return this.__name;
    },
    /**
     * @method setSandbox
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Sets the sandbox reference to this component
     */
    setSandbox : function(sandbox) {
        this.sandbox = sandbox;
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method start
     * implements BundleInstance start methdod
     */
    "start" : function() {

        var me = this;
        if(me.started) {
            return;
        }
        me.started = true;

        var sandbox = Oskari.$("sandbox");
        me.sandbox = sandbox;
        sandbox.register(me);
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
    },
    /**
     * @method update
     *
     * implements bundle instance update method
     */
    "update" : function() {

    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    "stop" : function() {
        var sandbox = this.sandbox;

        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    "init" : function() {
        var me = this;

        // headless
        return null;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if(!handler)
            return;

        return handler.apply(this, [event]);

    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'MapClickedEvent' : function(evt) {
            
            // don't process while moving
            if(this.sandbox.getMap().isMoving()) {
                return;
            }
            var lonlat = evt.getLonLat();
            var mouseX = evt.getMouseX();
            var mouseY = evt.getMouseY();
            this._getFeatureIds(lonlat, mouseX, mouseY);
        }
    },
    /***********************************************************
     * WFS FeatureInfo request
     *
     * @param {Object}
     *            e
     */
    _getFeatureIds : function(lonlat, mouseX, mouseY) {
        
        var me = this;
        var sandbox = this.sandbox;
        var allHighlightedLayers = sandbox.findAllHighlightedLayers();
        // Safety check
        // This case highlighted layer is the first one as there should not be more than one selected
        if(allHighlightedLayers.length == 0 || !allHighlightedLayers[0] || !allHighlightedLayers[0].isLayerOfType('WFS')) {
            // nothing to do, not wfs or nothing highlighted
            return;
        }
        if(allHighlightedLayers.length != 1) {
            throw "Trying to highlight WFS feature but there is either too many or none selected WFS layers. Size: " + allHighlightedLayers.length;
        }

        var layer = allHighlightedLayers[0];
        // Safety check at layer is in scale
        if(!layer.isInScale()) {
            core.printDebug('Trying to hightlight WFS feature from wfs layer that is not in scale!');
            return;
        }

        var map = sandbox.getMap();
        var imageBbox = this._map.getExtent();
        var parameters = "&flow_pm_wfsLayerId=" + layer.getId() + 
                         "&flow_pm_point_x=" + lonlat.lon + 
                         "&flow_pm_point_y=" + lonlat.lat + 
                         "&flow_pm_bbox_min_x=" + imageBbox.left + 
                         "&flow_pm_bbox_min_y=" + imageBbox.bottom + 
                         "&flow_pm_bbox_max_x=" + imageBbox.right + 
                         "&flow_pm_bbox_max_y=" + imageBbox.top + 
                         "&flow_pm_zoom_level=" + map.getZoom() +
                         "&flow_pm_map_width=" + map.getWidth() + 
                         "&flow_pm_map_heigh=" + map.getHeight() + 
                         "&actionKey=GET_HIGHLIGHT_WFS_FEATURE_IMAGE_BY_POINT";

        var keepCollection = sandbox.isCtrlKeyDown();

        jQuery.ajax({
            dataType : "json",
            type : "POST",
            url : this.endpointUrl + parameters,
            data : parameters,
            success : function(response) {
                me._handleGetFeatureIdsResponse(response, layer, keepCollection);
            }
        });
    },
    // Send out event so other components can highlight selected features
    _handleGetFeatureIdsResponse : function(response, layer, keepCollection) {
        var sandbox = this.sandbox;
        if(response.error == "true") {
            sandbox.printWarn("Couldn't get feature id for selected map point.");
        }
        // TODO: check if we want to do it with eval
        var selectedFeatures = eval("(" + response.selectedFeatures + ")");
        var featureIds = [];
        if(selectedFeatures != null && selectedFeatures.id != null) {
            featureIds = selectedFeatures.id;
        }

        var builder = sandbox.getEventBuilder('WFSFeaturesSelectedEvent');
        var event = builder(featureIds, layer, keepCollection);
        sandbox.notifyAll(event);
    }
}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
