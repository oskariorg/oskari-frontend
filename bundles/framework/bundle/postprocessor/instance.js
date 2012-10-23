/**
 * @class Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance
 *
 * Used for highlighting wfs features on pageload etc. Calls other bundles to accomplish stuff 
 * after everything has been loaded and started.
 *
 * See Oskari.mapframework.bundle.postprocessor.PostProcessorBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'PostProcessor',
    /**
     * @method getName
     * @return {String} the name for the component
     */
    "getName" : function() {
        return this.__name;
    },
    /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
    "start" : function() {
        var me = this;
        var sandbox = Oskari.$("sandbox");
        this.sandbox = sandbox;
        if(this.state) {
            var hiliteLayerId = this.state.highlightFeatureLayerId; 
            
            if(hiliteLayerId) {
                var isLoaded = sandbox.findMapLayerFromAllAvailable(hiliteLayerId) != null;
                if(isLoaded) {
                    this._highlightFeature(hiliteLayerId, this.state.highlightFeatureId);
                }
                else {
                    // layer not loaded ->
                    // register listening to 'MapLayerEvent' and let it trigger a retry
                    for(p in me.eventHandlers) {
                        sandbox.registerForEventByName(me, p);
                    }
                }
            }
            
        }
    },
    /**
     * @method _highlightFeature
     * @private
     * Adds the layer if its not yet selected
     */
    _highlightFeature : function(layerId, featureId) {
        if(featureId && layerId) {
            var layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
            if(layer) {
                var builder = this.sandbox.getEventBuilder('WFSFeaturesSelectedEvent');
                var featureIdList = [];
                // check if the param is already an array
                if(Object.prototype.toString.call( featureId ) === '[object Array]' ) {
                    featureIdList = featureId;
                }
                else {
                    featureIdList.push(featureId);
                }
                var event = builder(featureIdList, layer);
                this.sandbox.notifyAll(event);
            }
            else {
                this.sandbox.printWarn('Postprocessing failed for feature ' + featureId + 
                ' and layer ' + layerId);
            }
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method MapLayerEvent
         * If start has already campleted hilighting, this won't trigger, if not
         * this calls highlight no the selected target
         * @param {Oskari.mapframework.event.common.MapLayerEvent} event
         */
        'MapLayerEvent' : function(event) {
            // layerId in event is null for initial ajax load
            if('add' == event.getOperation() && !event.getLayerId()) {
                this._highlightFeature(this.state.highlightFeatureLayerId, this.state.highlightFeatureId);
            }
        }
    },
    /**
     * @method init
     * implements Module protocol init method - does nothing atm
     */
    "init" : function() {
        return null;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    "update" : function() {

    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    "stop" : function() {
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
