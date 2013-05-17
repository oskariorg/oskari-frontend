/**
 * @class Oskari.mapframework.bundle.publisher.PublisherBundleInstance
 *
 * Main component and starting point for the "map publisher" functionality. Publisher 
 * is a wizardish tool to configure a subset of map functionality. It uses the map
 * plugin functionality to start and stop plugins when the map is running. Also it 
 * changes plugin language and map size.
 * 
 * See Oskari.mapframework.bundle.publisher.PublisherBundle for bundle definition. 
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.publisher.PublisherBundleInstance", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
    this.started = false;
    this.plugins = {};
    this.localization = null;
    this.publisher = null;
    this.disabledLayers = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'Publisher',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    "getName" : function() {
        return this.__name;
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
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
     * @method start
     * Implements BundleInstance protocol start method
     */
    "start" : function() {
        var me = this;

        if(me.started)
            return;

        me.started = true;

                var conf = this.conf ;
        var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
        var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;
        
        this.localization = Oskari.getLocalization(this.getName());
        
        sandbox.register(me);
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }

        //Let's extend UI
        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

        //sandbox.registerAsStateful(this.mediator.bundleId, this);
        // draw ui
        me._createUi();


        // create request handlers
        me.publishMapEditorRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler', me);

        // register request handlers
        sandbox.addRequestHandler('Publisher.PublishMapEditorRequest', me.publishMapEditorRequestHandler);
    },
    /**
     * @method init
     * Implements Module protocol init method - does nothing atm
     */
    "init" : function() {
        return null;
    },
    /**
     * @method update
     * Implements BundleInstance protocol update method - does nothing atm
     */
    "update" : function() {

    },
    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
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
         * @method AfterMapLayerRemoveEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
         * 
         * Calls flyouts handleLayerSelectionChanged() method
         */
        'AfterMapLayerRemoveEvent' : function(event) {
            this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
        },
        /**
         * @method AfterMapLayerAddEvent
         * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
         * 
         * Calls flyouts handleLayerSelectionChanged() method
         */
        'AfterMapLayerAddEvent' : function(event) {
            this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
        },
        /**
         * @method MapLayerEvent
         * @param {Oskari.mapframework.event.common.MapLayerEvent} event
         */
        'MapLayerEvent' : function(event) {
            this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
        },
        /**
         * @method Publisher.MapPublishedEvent
         * @param {Oskari.mapframework.bundle.publisher.event.MapPublishedEvent} event
         */
        'Publisher.MapPublishedEvent' : function(event) {
            var loc = this.getLocalization();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = dialog.createCloseButton(loc['BasicView'].buttons.ok);
            okBtn.addClass('primary');
            
            // /published/{language}/{mapId}
            var url = loc['published'].urlPrefix + 
                  '/published/' + event.getLanguage() + '/' + event.getId();
            var iframeCode = '<iframe src="' + url + '" width="' + event.getWidth() + 
                            '" height="' + event.getHeight() + '"></iframe>';
            var textarea = 
                '<textarea rows="3" cols="80">' +
                iframeCode +
                '</textarea>';
            var content = loc['published'].desc + '<br/>' + textarea;
                
            dialog.show(loc['published'].title, content, [okBtn]);
            this.setPublishMode(false);
        }
    },

    /**
     * @method stop
     * Implements BundleInstance protocol stop method
     */
    "stop" : function() {
        var sandbox = this.sandbox();
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
        sandbox.request(this, request);

        //this.sandbox.unregisterStateful(this.mediator.bundleId);
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
     * @method startExtension
     * implements Oskari.userinterface.Extension protocol startExtension method
     * Creates a flyout and a tile:
     * Oskari.mapframework.bundle.publisher.Flyout
     * Oskari.mapframework.bundle.publisher.Tile
     */
    startExtension : function() {
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.Flyout', this);
        this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.Tile', this);
    },
    /**
     * @method stopExtension
     * implements Oskari.userinterface.Extension protocol stopExtension method
     * Clears references to flyout and tile
     */
    stopExtension : function() {
        this.plugins['Oskari.userinterface.Flyout'] = null;
        this.plugins['Oskari.userinterface.Tile'] = null;
    },
    /**
     * @method getPlugins
     * implements Oskari.userinterface.Extension protocol getPlugins method
     * @return {Object} references to flyout and tile
     */
    getPlugins : function() {
        return this.plugins;
    },
    /**
     * @method getTitle 
     * @return {String} localized text for the title of the component 
     */
    getTitle : function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription 
     * @return {String} localized text for the description of the component 
     */
    getDescription : function() {
        return this.getLocalization('desc');
    },
    /**
     * @method _createUi
     * @private
     * (re)creates the UI for "publisher" functionality
     */
    _createUi : function() {
        var me = this;
        this.plugins['Oskari.userinterface.Flyout'].createUi();
        this.plugins['Oskari.userinterface.Tile'].refresh();
    },

    /**
     * @method setPublishMode
     * Transform the map view to publisher mode if parameter is true and back to normal if false.
     * Makes note about the map layers that the user cant publish, removes them for publish mode and 
     * returns them when exiting the publish mode.
     * 
     * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
     * @param {Layer[]} deniedLayers layers that the user can't publish
     * @param {Object} data View data that is used to prepopulate publisher (optional)
     */
    setPublishMode : function(blnEnabled, deniedLayers, data) {
        var me = this;
        var map = jQuery('#contentMap');
        var tools = jQuery('#maptools');

        // check if statsgrid mode is on
        // -> disable statsgrid mode

        var statsgrid = jQuery('.statsgrid-contentMap');
        if(statsgrid.length > 0) {

            var selectedLayers = me.sandbox.findAllSelectedMapLayers();
            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                if(layer.getLayerType() === "stats") {
                    var request = this.sandbox.getRequestBuilder('StatsGrid.StatsGridRequest')(false, layer);
                    this.sandbox.request(me.getName(), request);
                }
            }


//            var request = this.sandbox.getRequestBuilder('StatsGrid.StatsGridRequest')(me, false, null);
//            this.sandbox.request(me.getName(), request);
            //me.sandbox.postRequestByName('StatsGrid.StatsGridRequest',[false, layer]);
        }

        if (blnEnabled == true) {
            this.disabledLayers = deniedLayers;
            this.oskariLang = Oskari.getLang();
            // remove denied
            this._removeLayers();
            
            map.addClass('mapPublishMode');
            // close all flyouts - TODO: how about popups/gfi?

            //postRequestByName brakes mode change functionality! me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'close']);
            var request = this.sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(me, 'close', me.getName());
            this.sandbox.request(me.getName(), request);

                
            // proceed with publisher view
            this.publisher = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.BasicPublisher', 
                this, this.getLocalization('BasicView'), data);
            this.publisher.render(map);
            this.publisher.setEnabled(true);
        
}       else {
            jQuery('#contentMap').width('');
            jQuery('.oskariui-left').css({'width': '', 'height': '100%', 'float': ''}).removeClass('published-grid-left');
            jQuery('.oskariui-center').css({'width': '100%', 'float': ''}).removeClass('published-grid-center');

            Oskari.setLang(this.oskariLang);
            if(this.publisher) {
                this.publisher.setEnabled(false);
                this.publisher.destroy();
            }
            // first return all needed plugins before adding the layers back
            map.removeClass('mapPublishMode');
            this._addLayers();
        }
        // publishing mode should be sent to mapfull to disable resizing
        var requestBuilder = me.sandbox.getRequestBuilder('MapFull.MapResizeEnabledRequest');
        if(requestBuilder) {
            // got the builder, request can be sent
            var request =  requestBuilder(!blnEnabled);
            me.sandbox.request(me, request);
        }
    },
    /**
     * @method _addLayers
     * Adds temporarily removed layers to map
     * @private
     */
    _addLayers : function() {
        var me = this;
        var sandbox = this.sandbox;
        var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
        if(this.disabledLayers) {
            for(var i=0; i < this.disabledLayers.length; ++i) {
                // remove
                var layer = this.disabledLayers[i];
                sandbox.request(me, addRequestBuilder(layer.getId(), true));
            }
        }
    },
    /**
     * @method _removeLayers
     * Removes temporarily layers from map that the user cant publish
     * @private
     */
    _removeLayers : function() {
        var me = this;
        var sandbox = this.sandbox;
        var removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
        if(this.disabledLayers) {
            for(var i=0; i < this.disabledLayers.length; ++i) {
                // remove
                var layer = this.disabledLayers[i];
                sandbox.request(me, removeRequestBuilder(layer.getId()));
            }
        }
    },
    /**
     * @method hasPublishRight
     * Checks if the layer can be published.
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * layer
     *      layer to check
     * @return {Boolean} true if the layer can be published
     */
    hasPublishRight : function(layer) {
        // permission might be "no_publication_permission"
        // or nothing at all
        return (layer.getPermission('publish') == 'publication_permission_ok');
    },
    /**
     * @method getLayersWithoutPublishRights
     * Checks currently selected layers and returns a subset of the list
     * that has the layers that can't be published. If all selected
     * layers can be published, returns an empty list.
     * @return
     * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     * list of layers that can't be published.
     */
    getLayersWithoutPublishRights : function() {
        var deniedLayers = [];
        var selectedLayers = this.sandbox.findAllSelectedMapLayers();
        for (var i = 0; i < selectedLayers.length; ++i) {
            var layer = selectedLayers[i];
            if (!this.hasPublishRight(layer)) {
                deniedLayers.push(layer);
            }
        }
        return deniedLayers;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
