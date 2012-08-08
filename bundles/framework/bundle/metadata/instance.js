/**
 * @class Oskari.framework.bundle.metadata.MetadataSearchInstance
 * 
 * This bundle adds a selection box plugin to the map and updates the metadata
 * search forms hidden fields to pass that selection to the search implementation
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.metadata.MetadataSearchInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.buttons = {};
}, {
    __name : 'MetadataSearch',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {
    },
    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
    	
    	
        var me = this;
        var sandbox = Oskari.$('sandbox');
        this.sandbox = sandbox;
        
        this.setupToolbar();
        
        // register plugin for map (drawing for selection box)
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin');
        mapModule.registerPlugin(drawPlugin);
        mapModule.startPlugin(drawPlugin);
        this.drawPlugin = drawPlugin;
        
        this.setupInitialSelection();
        // start listening to plugins selection
        drawPlugin.addListener(function(geometry) {
            me.selectionChanged(geometry);
        });
        
        sandbox.register(me);
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
         
    },

    /**
     * @method setupToolbar
     * Renders the toolbar and buttons
     */
    setupToolbar : function() {
        var me = this;
        var buttonsHtml =  jQuery(
        '<div style="position:absolute; top:20px; left:20px; z-index:10000; background-color:#333333; height: 32px;width: 64px;" class="Metadata tools">' +
        '</div>');
        
        var panTool = jQuery('<div class="tool tool-pan" tool="select" title="Pan"></div>');
        var selectTool = jQuery('<div class="tool tool-measure-area" tool="measurearea" title="Measure area"></div>');
        this.buttons.pan = panTool;
        this.buttons.select = selectTool;
        
        var reqBuilder = this.sandbox.getRequestBuilder('ToolSelectionRequest');
        panTool.bind('click', function(event){
            panTool.css('backgroundColor','#000000');
            selectTool.css('backgroundColor','#333438');
            me.sandbox.request(me, reqBuilder('map_control_navigate_tool'));
            me.drawPlugin.stopDrawing();
        });
        
        selectTool.bind('click', function(event){
            panTool.css('backgroundColor','#333438');
            selectTool.css('backgroundColor','#000000');
            me.drawPlugin.startDrawing();
        });
        
        buttonsHtml.append(panTool);
        buttonsHtml.append(selectTool);
        
        jQuery('#mapdiv').append(buttonsHtml);
    },
    
    /**
     * @method setupInitialSelection
     * Reads the forms #metadataBbox field and sets 
     * up the geometry on the map if any
     */
    setupInitialSelection : function() {
        // check if form has an initial selection box
        var initialGeometry = jQuery('#metadataBbox').val();
        if(initialGeometry) {
            var wkt = new OpenLayers.Format.WKT();
            var features = wkt.read(initialGeometry);
            if(features) {
                // use the initial box
                this.drawPlugin.setDrawing(features.geometry);
            }
        }
    },
    
    /**
     * @method selectionChanged
     * Resets toolbar and updates metadata search forms fields to
     * current selection
     * @param {OpenLayers.Geometry} geometry new selection
     */
    selectionChanged : function(geometry) {
        // remove hilight from select and move it to pan
        this.buttons.select.css('backgroundColor','#333438');
        this.buttons.pan.css('backgroundColor','#000000');
        // update metadata search form fields
        jQuery('#metadataBbox').val(geometry);
        // transform coordinates to 'EPSG:4326'
        var currentProj = this.drawPlugin.getMapModule().getMap().getProjectionObject();
        var strBounds = geometry.transform(currentProj, new OpenLayers.Projection("EPSG:4326")).getBounds().toString();
        jQuery('#tmpMetadataBbox').val(strBounds.replace(/,/g, "_"));
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
    },
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
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
    }
}, {
    protocol : ['Oskari.bundle.BundleInstance','Oskari.mapframework.module.Module']
});