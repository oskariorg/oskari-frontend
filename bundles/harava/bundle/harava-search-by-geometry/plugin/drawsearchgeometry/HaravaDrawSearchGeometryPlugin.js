/**
 * @class Oskari.harava.bundle.mapmodule.plugin.HaravaDrawSearchGeometryPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.plugin.HaravaDrawSearchGeometryPlugin',

/**
 * @method create called automatically on construction
 * @static
 * @param {Object} locale array
 */
function(locale) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.enabled = true;
    this._searchLayer = null;
    this._oldSearchLayer = null;
    this.searchControls = null;
    this.currentSearchMode = null;
    this._locale = locale;
    
    this._pendingAjaxQuery = {
    	busy: false,
    	jqhr: null,
    	timestamp: null
    };
    
    this.featureStyle = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(
            {
                pointRadius: 8,
                strokeColor: "#1C7372",
                fillColor: "#1C7372",
                fillOpacity: 0.3,
                strokeOpacity: 0.4,
                strokeWidth: 3
        })
    });    
    this.templateSearchByGeom = jQuery('<div class="search-by-geometry"></div>');
    this.templateSearchByGeomHomeTool = jQuery('<div id="searchbygeom-home" class="searchbygeom-tool searchbygeom-home"></div>');
    this.templateSearchByGeomPanTool = jQuery('<div id="searchbygeom-pan" class="searchbygeom-tool searchbygeom-pan"></div>');
    this.templateSearchByGeomPointTool = jQuery('<div id="searchbygeom-point" class="searchbygeom-tool searchbygeom-point"></div>');
    this.templateSearchByGeomMapExtentTool = jQuery('<div id="searchbygeom-mapextent" class="searchbygeom-tool searchbygeom-mapextent"></div>');
    this.templateSearchByGeomRegularPolygonTool = jQuery('<div id="searchbygeom-regular-polygon" class="searchbygeom-tool searchbygeom-regular-polygon"></div>');
    this.templateSearchByGeomPolygonTool = jQuery('<div id="searchbygeom-polygon" class="searchbygeom-tool searchbygeom-polygon"></div>');
    this.templateSearchByGeomSearchIndicator = jQuery('<div id="searchbygeom-searchindicator" class="searchbygeom-searchindicator"></div>');
    this.templateSearchByGeomEmpty = jQuery('<div style="clear:both;"></div>');
}, {
    /** @static @property __name plugin name */
    __name : 'HaravaDrawSearchGeometryPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
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
     * Toggle plugin visibility
     * @param visible
     */
    toggleVisibility: function(visible){
    	var me = this;
    	if(visible){
    		jQuery('#searchbygeom').show();
    	}
    	else{
    		jQuery('#searchbygeom').hide();
    		jQuery('#searchbygeom-pan').trigger('click');
    		me.removeAllDrawings();
    		me._closeGfiInfo();
    	}
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        this._sandbox = sandbox;
        this._sandbox.printDebug("[HaravaDrawSearchGeometryPlugin] init");
        
    	me._searchLayer = new OpenLayers.Layer.Vector("Harava search geometry layer", {
    		eventListeners : {
                "featuresadded" : function(layer) {
                	// send an event that the drawing has been completed
                    me.finishedDrawing();
                }
            },
            styleMap: this.featureStyle
    	});
    	me._oldSearchLayer = new OpenLayers.Layer.Vector("Harava old search geometry layer", {
    		styleMap: this.featureStyle
    	});
    	me._map.addLayers([me._searchLayer,me._oldSearchLayer]);
    	
    	this.searchControls = {
            point: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Point),
            line: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Path),
            regularPolygon: new OpenLayers.Control.DrawFeature(me._searchLayer,
                                OpenLayers.Handler.RegularPolygon),
            polygon: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Polygon)
        };
    	
    	this.searchControls.regularPolygon.handler.setOptions({irregular: true});
    	
    	var searchContainer = me.templateSearchByGeom.clone();
    	var searchHomeContainer = me.templateSearchByGeomHomeTool.clone();
    	searchHomeContainer.attr('title',this._locale.tooltips.homeMap);    	
    	var searchPanContainer = me.templateSearchByGeomPanTool.clone();
    	searchPanContainer.attr('title',this._locale.tooltips.panMap);    	
    	var searchPointContainer = me.templateSearchByGeomPointTool.clone();
    	searchPointContainer.attr('title',this._locale.tooltips.searchByPoint);    		
    	var searchMapExtentContainer = me.templateSearchByGeomMapExtentTool.clone();
    	searchMapExtentContainer.attr('title',this._locale.tooltips.searchByMapExtent);    	
    	var searchRegularPolygonContainer = me.templateSearchByGeomRegularPolygonTool.clone();
    	searchRegularPolygonContainer.attr('title',this._locale.tooltips.searchByRegularPolygon);    	
    	var searchPolygonContainer = me.templateSearchByGeomPolygonTool.clone();
    	searchPolygonContainer.attr('title',this._locale.tooltips.searchByPolygon);    	
    	
    	var searchIndicator = me.templateSearchByGeomSearchIndicator.clone();
    	var searchEmptyContainer = me.templateSearchByGeomEmpty.clone();
    	
    	jQuery('#searchbygeom').append(searchContainer);
    	jQuery(searchContainer).append(searchIndicator);
    	jQuery(searchContainer).append(searchHomeContainer);
    	jQuery(searchContainer).append(searchPanContainer);
    	jQuery(searchContainer).append(searchPointContainer);
    	jQuery(searchContainer).append(searchMapExtentContainer);    	
    	jQuery(searchContainer).append(searchPolygonContainer);
    	jQuery(searchContainer).append(searchRegularPolygonContainer);    	
    	jQuery(searchContainer).append(searchEmptyContainer);
    	
    	jQuery('.searchbygeom-tool').live('click', function(){
    		var id = this.id;
    		if(id!='searchbygeom-mapextent' && id!='searchbygeom-home'){
    			jQuery('.searchbygeom-tool').removeClass('active');
    			jQuery(this).addClass('active');
    		}
    		
    		switch(id){
    			case 'searchbygeom-point':
    				me.toggleControl('point');
    				break;
    			case 'searchbygeom-mapextent':
    	        	var mapExtent = me._map.getExtent();
    	        	var mapExtentPolygon = 'POLYGON(('+mapExtent.left+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.top + '))';
    	        	me._handleSearchByGeom(mapExtentPolygon,'mapextent');
    	        	me._closeGfiInfo();
			    	me.removeAllDrawings();
			    	jQuery('#searchbygeom-mapextent').addClass('active');
			    	window.setTimeout(function(){
			    		jQuery('#searchbygeom-mapextent').removeClass('active');
			    	},200);
			    	
    				break;
    			case 'searchbygeom-line':
    				me.toggleControl('line'); 
    				break;
    			case 'searchbygeom-polygon':
    				me.toggleControl('polygon'); 
    				break;
    			case 'searchbygeom-regular-polygon':
    				me.toggleControl('regularPolygon');
    				break;
    			case 'searchbygeom-pan':
    				me.toggleControl('pan');
    				break;
    			case 'searchbygeom-home':
    				var mapExtent = me._map.getExtent();
    	        	var mapExtentPolygon = 'POLYGON(('+mapExtent.left+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.top + '))';
    	        	me._handleSearchByGeom(mapExtentPolygon,'returnToHome');
    	        	me._closeGfiInfo();
			    	me.removeAllDrawings();
			    	jQuery('#searchbygeom-home').addClass('active');
			    	window.setTimeout(function(){
			    		jQuery('#searchbygeom-home').removeClass('active');
			    	},200);
			    	
			    	// Do default tool selection
			    	jQuery('#searchbygeom-pan').trigger('click');
    		}
    	});
    	
    	
    	for(var key in me.searchControls) {
    		me._map.addControl(me.searchControls[key]);
        }
    	
    	// Do default tool selection
    	jQuery('#searchbygeom-pan').trigger('click');
    },
    /**
     * @method _handleSearchByGeom
     * Handle geometry area selection
     * @param {String} geom geometry string
     * @param {String} tool name, overrides currentSearchMode
     */
    _handleSearchByGeom : function(geom, tool) {
        var me = this;
        var type = this.currentSearchMode;
        if(tool!=null){
        	type=tool;
        }
        var dte = new Date();
        var dteMs = dte.getTime();
        
        if( me._pendingAjaxQuery.busy && me._pendingAjaxQuery.timestamp &&  
        	dteMs - me._pendingAjaxQuery.timestamp < 500 ) {
        	me._sandbox.printDebug("[HaravaDrawSearchGeometryPlugin] HaravaDrawSearchGeometry NOT SENT (time difference < 500ms)");
        	return; 
        } 
        
        me._cancelAjaxRequest();
        
        var layerIds = me._buildLayerIdList();
        
        /* let's not start anything we cant' resolve */
        if( !layerIds  ) {
        	me._sandbox.printDebug("[GetInfoPlugin] NO layers with featureInfoEnabled, in scale and visible");
        	return;
        }
        $('#searchbygeom-searchindicator').addClass('show');
        me._startAjaxRequest(dteMs);
		
        var ajaxUrl = this._sandbox.getAjaxUrl(); 
       
        var mapVO = me._sandbox.getMap();
        var centerLonLat = me._map.getCenter();
        var centerPx = me._map.getViewPortPxFromLonLat(centerLonLat);
        var bufferPx = 8; // used from line at it buffer is 8px from any direction
        centerPx.x = centerPx.x + bufferPx;
        var centerLonLat2 = me._map.getLonLatFromViewPortPx(centerPx);
        var buffer = centerLonLat2.lon - centerLonLat.lon;
        jQuery.ajax({
            beforeSend : function(x) {
            	me._pendingAjaxQuery.jqhr = x;
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(resp) {
            	var funcs = resp.funcs;
            	
            	var html = resp.html;
            	
            	me._finishAjaxRequest();
            	
            	jQuery.each(funcs, function(k, func){
            		eval(func);
            	});
            	
				if(html!=null && html!=''){
					var lonlat = new OpenLayers.LonLat(resp.center.lon, resp.center.lat);
					var parsed = {html: html, title: "Tiedot"};
					parsed.lonlat = lonlat;
					parsed.popupid = me.infoboxId; 
					me._showFeatures(parsed);
				} else {
			    	me._closeGfiInfo();
			    	me.removeAllDrawings();
			    	if(resp.funcs==null || resp.funcs.length==0 || resp.funcs=='' ){
				    	if(Message!=null && typeof Message.createMessage === "function" 
				    		&& typeof Message.showMessage === "function" 
				    			&& typeof Message.closeMessage === "function"){
				    		Message.createMessage(me._locale.tooltips.searchNotFound,me._locale.tooltips.searchNotFoundOkButton);
				    		Message.showMessage();
				    		$("#aMessage").click(function(){
				    			Message.closeMessage();
				    			return false;
				    		});
				    	} else {
				    		alert(me._locale.tooltips.searchNotFound);
				    	}
			    	}
				}
            	
            },
            error : function() {
            	me._finishAjaxRequest();
                me._notifyAjaxFailure();
            },
            always: function() {
            	me._finishAjaxRequest();
            },
            complete: function() {
            	me._finishAjaxRequest();
            },
            data : {
                layerIds : layerIds,
                projection : me.mapModule.getProjection(),
                geom : geom,
                lang: Oskari.getLang(),
                type: type,
                zoom : mapVO.getZoom(),
                buffer: buffer
            },
            type : 'POST',
            dataType : 'json',
            url : ajaxUrl + 'action_route=GetFeatureInfoBySelectedGeometry'
        });
        
    },
    /**
     * @method _cancelAjaxRequest
     * @private
     * Cancel ajax request 
     */
    _cancelAjaxRequest: function() {
    	var me = this;
    	if( !me._pendingAjaxQuery.busy ) {
    		return;
    	}
    	var jqhr = me._pendingAjaxQuery.jqhr;
    	me._pendingAjaxQuery.jqhr = null;
    	if( !jqhr) {
    		return;
    	}    	
    	this._sandbox.printDebug("[HaravaDrawSearchGeometryPlugin] Abort jqhr ajax request");
    	jqhr.abort();
    	jqhr = null;
    	me._pendingAjaxQuery.busy = false;
    },
    /**
     * @method _starAjaxRequest
     * @private
     * Start ajax request 
     */
    _startAjaxRequest: function(dteMs) {
    	var me = this;
		me._pendingAjaxQuery.busy = true;
		me._pendingAjaxQuery.timestamp = dteMs;

    },
    /**
     * @method _finishAjaxRequest
     * @private
     * Finish ajax request 
     */
    _finishAjaxRequest: function() {
    	var me = this;
    	me._pendingAjaxQuery.busy = false;
        me._pendingAjaxQuery.jqhr = null;
        $('#searchbygeom-searchindicator').removeClass('show');
        this._sandbox.printDebug("[HaravaDrawSearchGeometryPlugin] finished jqhr ajax request");
    },
    /**
     * @method _buildLayerList
     * @private
     * Build visible layer id list 
     * @return {Array} layer ids
     */
    _buildLayerIdList: function()  {
        var me = this;
    	var selected = me._sandbox.findAllSelectedMapLayers();
        var layerIds = null;
        
 		var mapScale = me._sandbox.getMap().getScale();
        
        for (var i = 0; i < selected.length; i++) {
        	var layer = selected[i];

        	if( !layer.isInScale(mapScale) ) {
				continue;
			}
			if( !layer.isFeatureInfoEnabled() ) {
				continue;
			}        	
			if( !layer.isVisible() ) {
				continue;
			}
			
			if( !layerIds ) {
				layerIds = "";
			}
			        	
            if (layerIds !== "") {
                layerIds += ",";
            }

            layerIds += layer.getId();
        }
        
        return layerIds;
    },
    /**
     * @method _notifyAjaxFailure
     * @private
     * Notify ajax failure 
     */
    _notifyAjaxFailure: function() {
    	 var me = this;
    	 me._sandbox.printDebug("[HaravaDrawSearchGeometryPlugin] GetFeatureInfo AJAX failed");
    },
    /**
     * @method _isAjaxRequestBusy
     * @private
     * Check at if ajax request is busy
     * @return {Boolean} true if ajax request is busy, else false
     */
    _isAjaxRequestBusy: function() {
    	var me = this;
    	return me._pendingAjaxQuery.busy;
    },
    /**
     * @method removeAllDrawings
     * Remove drawed area selection on openlayer map
     */
    removeAllDrawings: function(){
    	var me = this;
    	if(me._searchLayer!=null){
    		me._searchLayer.removeAllFeatures();
    	}
    	if(me._oldSearchLayer!=null){
    		me._oldSearchLayer.removeAllFeatures();
    	}
    },
    /**
     * @method finishedDrawing
     * Finish drawing
     */
    finishedDrawing : function(){
    	var me = this;
    	var feat = me._searchLayer.features[0];
    	
    	me._closeGfiInfo();
    	if(feat!=null){
    		me._handleSearchByGeom(feat.geometry.toString());	    	
    	}
    	me._searchLayer.removeAllFeatures();
    	me._oldSearchLayer.removeAllFeatures();
    	me._oldSearchLayer.addFeatures([feat]);
    	
    },
    /**
     * Shows multiple features in an infobox
     *
     * @param {Array} data
     */
    _showFeatures : function(data) {
    	var me = this;
        var contentHtml = [];
        var content = {};
        content.html = data.html;
        var rn = "HaravaInfoBox.ShowInfoBoxRequest";
        var rb = me._sandbox.getRequestBuilder(rn);
        var r = rb(data.popupid, "Info", [content], data.lonlat, true,null,null,true);
        me._sandbox.request(me, r);
    },
    /**
     * @method startSearch
     * Start searching by geometry
     * @param {String} searchMode search mode of plugin
     */
    startSearch : function(searchMode){
    	var me = this;
    	me._closeGfiInfo();
    	me.removeAllDrawings();
    	switch(searchMode){
			case 'point':
				jQuery('#searchbygeom-point').trigger('click');
				break;
			case 'mapextent':
				jQuery('#searchbygeom-mapextent').trigger('click');
				break;
			case 'polygon':
				jQuery('#searchbygeom-polygon').trigger('click'); 
				break;
			case 'regularPolygon':
				jQuery('#searchbygeom-regular-polygon').trigger('click');
				break;
			case 'pan':
				jQuery('#searchbygeom-pan').trigger('click');
				break;
		}
    },
    /**
     * Enables the given search control
     * Disables all the other search controls
     * @param searchMode search control to activate (if undefined, disables all
     * controls)
     * @method
     */
    toggleControl : function(searchMode) {
    	this.currentSearchMode = searchMode;
    	var me = this;
        for(var key in this.searchControls) {
            var control = this.searchControls[key];
            if(searchMode == key) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
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
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        var me = this;
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        this._map = this.getMapModule().getMap();

        this._sandbox.register(this);
        for (p in this.eventHandlers ) {
            this._sandbox.registerForEventByName(this, p);
        }
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
        var me = this;
        // hide infobox if open
        me._closeGfiInfo();
        
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        
        var openlayersMap = this.mapModule.getMap();
        
        if(me._searchLayer!=null){
        	openlayersMap.removeLayer(me._searchLayer);
    	}
    	if(me._oldSearchLayer!=null){
    		openlayersMap.removeLayer(me._oldSearchLayer);
    	}
        
        
        this._sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method _closeGfiInfo
     * @private
     * Closes the infobox with GFI data
     */
    _closeGfiInfo : function() {
        var rn = "HaravaInfoBox.HideInfoBoxRequest";
        var rb = this._sandbox.getRequestBuilder(rn);
        var r = rb(this.infoboxId);
        this._sandbox.request(this, r);
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @method setEnabled
     * Enables or disables gfi functionality
     * @param {Boolean} blnEnabled
     *          true to enable, false to disable
     */
    setEnabled : function(blnEnabled) {
        this.enabled = (blnEnabled === true);
        // close existing if disabled
        if(!this.enabled) {
            this._closeGfiInfo();
        }
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
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        /*var me = this;
        return this.eventHandlers[event.getName()].apply(this, [event]);
        */
    }
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
