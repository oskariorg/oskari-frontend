/**
 * @class Oskari.mapframework.bundle.plugin.DataSourcePlugin
 * Displays the NLS logo and provides a link to terms of use on top of the map.
 * Gets base urls from localization files.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.DataSourcePlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.template = null;
    this.element = null;
    this.sandbox = null;
    this.tool = null;
}, {
    /** @static @property __name plugin name */
    __name : 'DataSourcePlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },

    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    getMapModule : function() {
        return this.mapModule;
    },

    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if(mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },

    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },

    /**
     * @method init
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        this.template = jQuery("<div class='oskari-datasource'>" +
                "<div class='link'><a href='JavaScript:void(0);'></a></div>" +
            "</div>");
        this.templateinfoIcon = jQuery('<div class="icon-info"></div>');
        this.templategroupTemplate = jQuery('<ul style="padding: 0 12px;"></ul>'); 
        this.templatecontent = jQuery('<div></div>');
        this.templateheading = jQuery('<b></b>');
    },

    /**
     * @method register
     * Interface method for the plugin protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     */
    unregister : function() {

    },

    /**
     * @method startPlugin
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this._createUI();
    },

    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
        
        // TODO: check if added?
        // unbind change listener and remove ui
        this.element.find('a').unbind('click');
        this.element.remove();
        this.element = undefined;
    },

    /**
     * @method start
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },

    /**
     * @method stop
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },

    /** 
     * @property {Object} eventHandlers 
     * @static 
     */
    eventHandlers : {
    },

    /** 
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method _layerListComparator
     * Uses the private property #grouping to sort layer objects in the wanted order for rendering
     * The #grouping property is the method name that is called on layer objects.
     * If both layers have same group, they are ordered by layer.getName()
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
     */
    _layerListComparator : function(a, b) {
        var nameA = a.getOrganizationName().toLowerCase();
        var nameB = b.getOrganizationName().toLowerCase();
        if(nameA == nameB) {
            nameA = a.getName().toLowerCase();
            nameB = b.getName().toLowerCase();          
        }
        if (nameA < nameB) {return -1}
        if (nameA > nameB) {return 1}
        return 0;
    },
    
    /**
     * @method _createUI
     * @private
     * Creates logo and terms of use links on top of map
     */
    _createUI : function() {
        var me = this;
        var sandbox = me._sandbox;
        // get div where the map is rendered from openlayers
        var parentContainer = jQuery(this._map.div);
        if(!this.element) {
            this.element = this.template.clone();
        }
                
        parentContainer.append(this.element);
        
        var pluginLoc = this.getMapModule().getLocalization('plugin', true);
        this.localization = pluginLoc[this.__name];
        
        var link = this.element.find('a');
        link.append( this.localization["link"]); 
        link.bind('click', function(){
            me._openDialog();
            return false;
        });

    },

    /**
     * @method _openDialog
     * @private
     * renders pop-up 
     */
    _openDialog : function() {
        var me = this;
        var sandbox = me._sandbox;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = dialog.createCloseButton( this.localization.button.close);

        var infoIcon = this.templateinfoIcon.clone();
        var groupTemplate = this.templategroupTemplate.clone(); 

        var selectedLayers = this._getLayers();

        var group = null;
        var content = this.templatecontent.clone();
        var currentGroup = null;

        for(var i = 0; i < selectedLayers.length; ++i) {
            var layer = selectedLayers[i];   

            //compare names for grouping
            if (group != layer.getOrganizationName()) {
                //get organization names
                group = layer.getOrganizationName();

                var heading = this.templateheading.clone();    
                if(group){
                    heading.append(group);
                }
                else {
                    heading.append('N/A');
                }
                content.append(heading);
                currentGroup = groupTemplate.clone();
                content.append(currentGroup);
            }

            // append layer
            var layerItem = this._getLayerContainer(layer);
            if(layerItem) {
                currentGroup.append(layerItem);
            }
        }

        dialog.show( this.localization.popup.title, content, [okBtn]);
        dialog.moveTo(this.element.find('a'), 'top');
    },

    /**
     * @method _getLayers
     * @private
     * @return selected layers in the pop-up 
     */
    _getLayers : function() {
        var me = this;
        var selectedLayers = this._sandbox.findAllSelectedMapLayers();  
        //sort the layers
        selectedLayers.sort(function(a, b) {
            return me._layerListComparator(a, b);
        }); 
        return selectedLayers;
    },

     /**
     * @method _getLayers
     * @private
     * appends to metadata link if avaiable wiht layers
     */
    _getLayerContainer : function(layer) {
        var me = this;
        var infoIcon = this.templateinfoIcon.clone();
        var layerName = layer.getName();
        if(layerName) {
            var layerItem = jQuery('<li>' + layerName + '</li>');
            //metadata link
            var uuid = layer.getMetadataIdentifier();
            if(uuid) {    
                var layerIcon = infoIcon.clone();
                layerIcon.bind('click', function() {
                    me._getMetadataInfoCallback(layer);
                });
                layerItem.append(layerIcon);
            }
            return layerItem;
        }
        return null;
    },

    _getMetadataInfoCallback : function(layer) {
        var me = this;
        var sandbox = me._sandbox;
        var uuid = layer.getMetadataIdentifier();
        var additionalUuids = [];
        var additionalUuidsCheck = {};
        additionalUuidsCheck[uuid] = true; 
        var subLayers = layer.getSubLayers(); 
        if( subLayers && subLayers.length > 0 ) {
            for( var s = 0 ; s < subLayers.length;s++) {
                var subUuid = subLayers[s].getMetadataIdentifier();
                if( subUuid && subUuid != "" && !additionalUuidsCheck[subUuid] ) { 
                    additionalUuidsCheck[subUuid] = true;
                    additionalUuids.push({
                        uuid: subUuid
                    });               
                }
            }        
        }
        sandbox.postRequestByName('catalogue.ShowMetadataRequest', [
            { uuid : uuid }, additionalUuids
        ]);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
