/**
 * @class Oskari.mapframework.ui.module.searchservice.MetadataModule
 * Provides a "metadata"/additional information panel that shows 
 * featureInfo and maplayerInfo(legendimage)
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.searchservice.MetadataModule',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._sandbox = null;
    this.uiItems = {};
}, {
    /** @static @property __name module name */
    __name : "MetadataModule",
    /**
     * @method getName
     * @return {String} module name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sb
     * 			reference to application sandbox
     */
    init : function(sb) {
        this._sandbox = sb;
        var sandbox = sb;
        sandbox.printDebug("Initializing metadata module...");
        sandbox.registerForEventByName(this, 'AfterShowMapLayerInfoEvent');
        sandbox.registerForEventByName(this, 'AfterGetFeatureInfoEvent');
        sandbox.registerForEventByName(this, 'AfterAppendFeatureInfoEvent');

        var resultPanel = Ext.create('Ext.Panel', {
            autoScroll : true,
            layout : 'fit'
        });
        this.uiItems.resultPanel = resultPanel;

        var metadataModulePanel = Ext.create('Ext.Panel', {
            layout : 'fit',
            id : 'MetadataModule', // for selenium selector
            title : sandbox.getText('rightpanel_material_legend_title'),
            items : [this.uiItems.resultPanel],
            border : false,
            frame : false
        });
        this.uiItems.metadataModulePanel = metadataModulePanel;
        return metadataModulePanel;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @method afterShowMapLayerInfoEvent
     * Show map layer info
     *
     * @param {Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent}
     *            event layer event
     */
    afterShowMapLayerInfoEvent : function(event) {
        // clear panel before anything else
        this.uiItems.resultPanel.update('');
        this.uiItems.resultPanel.removeAll();
        // start creating the view
        var layer = event.getMapLayer();
        var sandbox = this._sandbox;

        var legendHtml = sandbox.getText('rightpanel_map_layer_have_not_description');

        // check if we have getLegendImage function and it returns a value
        if(layer.getLegendImage && layer.getLegendImage()) {
            legendHtml = '<img src="' + layer.getLegendImage() + '" alt="' + layer.getName() + '" />';

            // check if we have getCurrentStyle function
            // style legend is from getCapabilities and might
            // be something that we dont want to show
            // -> hence only use it it no default legendImage defined
        } else if(layer.getCurrentStyle && layer.getCurrentStyle().getLegend()) {
            legendHtml = '<img src="' + layer.getCurrentStyle().getLegend() + '" alt="' + layer.getName() + '" />';
        }

        this.uiItems.resultPanel.update(legendHtml);
        // find the main panel (accordion panel in this case) and expand it too
        Oskari.$('UI.facade').expandPart('E');
        this.uiItems.metadataModulePanel.expand(true);
    },
    /**
     * @method afterGetFeatureInfoEvent
     * Show get feature info results
     *
     * @param {Oskari.mapframework.event.common.AfterGetFeatureInfoEvent}
     *            msg result object
     */
    afterGetFeatureInfoEvent : function(event) {
        // clear panel before anything else
        this.uiItems.resultPanel.removeAll();
        // start creating the view
        var response = event.getResponse();

        var sandbox = this._sandbox;
        if(response == true) {
            //TODO: any reason to show here and append stuff later?
            var innerInfoPanel = Ext.create('Ext.Panel', {
                title : '<b>' + sandbox.getText("rightpanel_wms_getfeatureinfo_title") + '</b>',
                id : 'inner_feature_info_panel',
                layout : 'fit',
                autoScroll : true
            });
            this.uiItems.metadataModulePanel.innerInfoPanel = innerInfoPanel;
            this.uiItems.resultPanel.add(innerInfoPanel);
            this.uiItems.metadataModulePanel.expand(true);
        } else {
            if(event.isWfsSelected() == true) {
                sandbox.showPopupText("search_module_popup_layer_is_wfs_title", "search_module_popup_layer_is_wfs_message");
            } else {
                sandbox.showPopupText("mapcontrolsservice_layer_info_layer_not_selected_messagebox_title", "mapcontrolsservice_layer_info_layer_not_selected_messagebox_message");
            }
        }
    },
    /**
     * @method afterAppendFeatureInfoEvent
     * Append additional get feature info results
     *
     * @param {Oskari.mapframework.event.common.AfterAppendFeatureInfoEvent}
     *            msg result object
     */
    afterAppendFeatureInfoEvent : function(event) {
        var messageHtml = "<h3>" + event.getHeader() + "</h3>";
        var msg = event.getMessage();
        // decode from string to json
        if(msg.startsWith('{parsed: {')) {
	        var jsonObj = Ext.decode(msg);
	        if(jsonObj && jsonObj.parsed) {
	        	// got transformed json
	        	msg = this._formatJsonGFI(jsonObj.parsed);
	        }	
        }
        //else treat as html
        
        msg = '<div style="padding: 5px; font: 11px Tahoma, Arial, Helvetica, sans-serif;">' + msg + '</div>';
        this.uiItems.metadataModulePanel.innerInfoPanel.update(messageHtml + msg);
        var sandbox = this._sandbox;
        sandbox.request(this, sandbox.getRequestBuilder('ActionReadyRequest')("GET_FEATURE_INFO", false));
    },
    /**
     * @method _formatJsonGFI
     * @private
     * Formats a parsed GFI response from server to html
     *
     * @param {Object}
     *            jsonData json data object
     * @return {String} formatted html
     */
    _formatJsonGFI : function(jsonData) {
    	var html = '<br/><table>';
    	var even = false;
    	for(attr in jsonData) {
    		var value = jsonData[attr];
    		if(value.startsWith('http://')) {
    			value = '<a href="'+ value + '" target="_blank">' + value + '</a>';
    		}
    		html = html + '<tr style="padding: 5px;';
    		if(!even) {
    			html = html + ' background-color: #EEEEEE';
    		}
    		even = !even;
    		html = html + '"><td style="padding: 2px">' + attr + '</td><td style="padding: 2px">' + value + '</td></tr>';
    	}
    	return html + '</table>';
    },

	/** 
	 * @property {Object} eventHandlers 
	 * @static 
	 */
    eventHandlers : {
        'AfterShowMapLayerInfoEvent' : function(event) {
            this.afterShowMapLayerInfoEvent(event);
        },
        "AfterGetFeatureInfoEvent" : function(event) {
            this.afterGetFeatureInfoEvent(event);
        },
        "AfterAppendFeatureInfoEvent" : function(event) {
            this.afterAppendFeatureInfoEvent(event);
        }
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
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance */