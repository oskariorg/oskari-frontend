/**
 * @class Oskari.harava.bundle.mapmodule.plugin.HaravaDrawSearchGeometryPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.plugin.HaravaDrawSearchGeometryPlugin',

/**
 * @method create called automatically on construction
 * @static
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
        
        var openlayersMap = this.mapModule.getMap();
        
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
    	openlayersMap.addLayers([me._searchLayer,me._oldSearchLayer]);
    	
    	this.searchControls = {
            point: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Point),
            line: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Path),
            regularPolygon: new OpenLayers.Control.DrawFeature(me._searchLayer,
                                OpenLayers.Handler.RegularPolygon),
            polygon: new OpenLayers.Control.DrawFeature(me._searchLayer,
                        OpenLayers.Handler.Polygon),
        };
    	
    	this.searchControls.regularPolygon.handler.setOptions({irregular: true});
    	
    	jQuery('#searchbygeom').append('<div class="search-by-geometry">'
    			+ '<div id="searchbygeom-point" class="searchbygeom-tool searchbygeom-point" title="'+this._locale.tooltips.searchByPoint+'">&nbsp;</div>'
    			//+ '<div id="searchbygeom-line" class="searchbygeom-tool searchbygeom-line" title="'+this._locale.tooltips.searchByLine+'">&nbsp;</div>'
    			+ '<div id="searchbygeom-mapextent" class="searchbygeom-tool searchbygeom-mapextent" title="'+this._locale.tooltips.searchByMapExtent+'">&nbsp;</div>'
    			+ '<div id="searchbygeom-regular-polygon" class="searchbygeom-tool searchbygeom-regular-polygon" title="'+this._locale.tooltips.searchByRegularPolygon+'">&nbsp;</div>'
    			+ '<div id="searchbygeom-polygon" class="searchbygeom-tool searchbygeom-polygon" title="'+this._locale.tooltips.searchByPolygon+'">&nbsp;</div></div>');    	
    	
    	jQuery('.searchbygeom-tool').live('click', function(){
    		    		
    		var id = this.id;
    		if(id!='searchbygeom-mapextent'){
    			jQuery('.searchbygeom-tool').removeClass('active');
    			jQuery(this).addClass('active');
    		}
    		
    		switch(id){
    			case 'searchbygeom-point':
    				me.toggleControl('point');
    				break;
    			case 'searchbygeom-mapextent':
    				//me.toggleControl('mapextent');
    				var openlayersMap = me.mapModule.getMap();
    	        	var mapExtent = openlayersMap.getExtent();
    	        	var mapExtentPolygon = 'POLYGON(('+mapExtent.left+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.top + ','+mapExtent.right+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.bottom + ','+mapExtent.left+' ' +mapExtent.top + '))';
    	        	me._handleSearchByGeom(mapExtentPolygon,'mapextent');
    	        	me._closeGfiInfo();
			    	me.removeAllDrawings();
			    	jQuery('#searchbygeom-mapextent').addClass('active');
			    	window.setTimeout(function(){
			    		jQuery('#searchbygeom-mapextent').removeClass('active');
			    	},200);
			    	
    				break;
    			/*case 'searchbygeom-line':
    				me.toggleControl('line'); 
    				break;*/
    			case 'searchbygeom-polygon':
    				me.toggleControl('polygon'); 
    				break;
    			case 'searchbygeom-regular-polygon':
    				me.toggleControl('regularPolygon');
    				break;
    		}
    	});
    	
    	
    	for(var key in me.searchControls) {
    		openlayersMap.addControl(me.searchControls[key]);
        }
    	
    	// Do default tool selection
    	$('#searchbygeom-point').trigger('click');
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
        
        me._startAjaxRequest(dteMs);
		
        var ajaxUrl = this._sandbox.getAjaxUrl(); 
       
        var mapVO = me._sandbox.getMap();
        var openlayersMap = this.mapModule.getMap();
        var centerLonLat = openlayersMap.getCenter();
        var centerPx = openlayersMap.getViewPortPxFromLonLat(centerLonLat);
        var bufferPx = 8; // used from line at it buffer is 8px from any direction
        centerPx.x = centerPx.x + bufferPx;
        var centerLonLat2 = openlayersMap.getLonLatFromViewPortPx(centerPx);
        var buffer = centerLonLat2.lon - centerLonLat.lon;
        jQuery.ajax({
            beforeSend : function(x) {
            	me._pendingAjaxQuery.jqhr = x;
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(resp) {
            	var mapWidth = mapVO.getWidth();
            	var showAll = false;
            	if(mapWidth>500)
            	{
            		showAll = true;
            	}
            	
            	var infoCol = resp.informationCollections;
            	var orgz = resp.organisations;
            	var projz = resp.projects;
            	var coll = [];
            	
            	// First get organization spesific data
            	var orgName = null;
            	var orgId = null;
            	var orgPretty = "";
            	var orgFirstId = null;
            	var orgFunction ="";
            	
            	$.each(orgz, function(k, org){
            		if(!showAll){
            			if(orgFirstId==null){
            				orgFirstId = org.layerId;
            			}
            			if(typeof Organization !== "undefined"){
            				orgPretty += "<ul><li><a class='searchbygeom-link' onclick='Organization.highlightTable(\""+org.layerId+"\");Organization.showOrganizationInfo(\""+org.layerId+"\", true);'>"+org.name+"</a></li></ul>";
            			} else {
            				orgPretty += "<ul><li>"+org.name+"</li></ul>";
            			}
            			orgName = org.layerName;
            			orgId = org.layerId;
					} else {
						orgPretty += "<ul><li>"+org.name+"</li>"+org.html+"</ul>";
						orgName = org.layerName;
						orgId = org.layerId;
					}
					
					if(typeof Organization !== "undefined" && orgFirstId!=null) {
						Organization.highlightTable(orgFirstId);
						Organization.showOrganizationInfo(orgFirstId, true);
						/*$.each(org.functions, function(k, func){
							eval(func);
						});*/
					}
            	});
            	
            	
            	// Second get project spesific data
            	var projName = null;
            	var projId = null;
            	var projPretty = "";
            	var projFirstId = null;
            	$.each(projz, function(k, proj){
            		if(projFirstId==null){
            			projFirstId = proj.layerId;
        			}
            		
					if(!showAll){
						if(typeof Project !== "undefined"){
							projPretty += "<ul><li><a class='searchbygeom-link' onclick='Project.highlightTable(\""+proj.layerId+"\");Project.showProjectInfo(\""+proj.layerId+"\", true);'>"+proj.name+"</a></li></ul>";
            			} else {
            				projPretty += "<ul><li>"+proj.name+"</li></ul>";
            			}
						projName = proj.layerName;
						projId = proj.layerId;
					} else {
						projPretty += "<ul><li>"+proj.name+"</li>"+proj.html+"</ul>";
						projName = proj.layerName;
						projId = proj.layerId;
					}
					
					if(typeof Project !== "undefined" && projFirstId!=null) {
						Project.highlightTable(projFirstId);
						Project.showProjectInfo(projFirstId, true);
						/*
						$.each(proj.functions, function(k, func){
							eval(func);
						});*/
					}
				});
            	
            	// Third get information collection spesific data
            	var infoName = null;
            	var infoId = null;
            	var infoPretty = "";
            	var infoFirstId = null;
            	$.each(infoCol, function(k, info){
            		if(infoFirstId==null){
            			infoFirstId = info.layerId;
        			}
					if(!showAll){
						if(typeof InformationCollection !== "undefined"){
							infoPretty += "<ul><li><a class='searchbygeom-link' onclick='InformationCollection.highlightTable(\""+info.layerId+"\");InformationCollection.showCollectionInfo(\""+info.layerId+"\", true);'>"+info.name+"</a></li></ul>";
            			} else {
            				infoPretty += "<ul><li>"+info.name+"</li></ul>";
            			}

						infoName = info.layerName;
						infoId = info.layerId;
					} else {
						infoPretty += "<ul><li>"+info.name+"</li>"+info.html+"</ul>";
						infoName = info.layerName;
						infoId = info.layerId;
					}
					
					if(typeof InformationCollection !== "undefined" &&  infoFirstId!=null) {
						InformationCollection.highlightTable(infoFirstId);
						InformationCollection.showCollectionInfo(infoFirstId, true);
						/*
						$.each(info.functions, function(k, func){
							eval(func);
						});
						*/
					}
				});
            	
            	/* Resolve showing order */
            	if(typeof InformationCollection !== "undefined"){
            		if(infoName!=null && infoId!=null){
                		coll.push({markup: infoPretty, layerId: infoId, layerName: infoName});
                	}
            		
            		if(orgName!=null && orgId!=null){
                		coll.push({markup: orgPretty, layerId: orgId, layerName: orgName});
                	}
                	
                	if(projName!=null && projId!=null){
                		coll.push({markup: projPretty, layerId: projId, layerName: projName});
                	}
            	}
            	else if(typeof Project !== "undefined"){
            		if(projName!=null && projId!=null){
                		coll.push({markup: projPretty, layerId: projId, layerName: projName});
                	}
            		
            		if(orgName!=null && orgId!=null){
                		coll.push({markup: orgPretty, layerId: orgId, layerName: orgName});
                	}               	
                	
                	if(infoName!=null && infoId!=null){
                		coll.push({markup: infoPretty, layerId: infoId, layerName: infoName});
                	}
            	}
            	else if(typeof Organization !== "undefined"){
            		if(orgName!=null && orgId!=null){
                		coll.push({markup: orgPretty, layerId: orgId, layerName: orgName});
                	}
                	
                	if(projName!=null && projId!=null){
                		coll.push({markup: projPretty, layerId: projId, layerName: projName});
                	}
                	
                	if(infoName!=null && infoId!=null){
                		coll.push({markup: infoPretty, layerId: infoId, layerName: infoName});
                	}
            	} else {
            		if(orgName!=null && orgId!=null){
                		coll.push({markup: orgPretty, layerId: orgId, layerName: orgName});
                	}
                	
                	if(projName!=null && projId!=null){
                		coll.push({markup: projPretty, layerId: projId, layerName: projName});
                	}
                	
                	if(infoName!=null && infoId!=null){
                		coll.push({markup: infoPretty, layerId: infoId, layerName: infoName});
                	}
            	}
            	
				if(coll.length>0){
					var lonlat = new OpenLayers.LonLat(resp.center.lon, resp.center.lat);
					var parsed = {fragments: coll, title: "Tiedot"};
					parsed.lonlat = lonlat;
					parsed.popupid = me.infoboxId; 
					me._showFeatures(parsed);
				} else {
			    	me._closeGfiInfo();
			    	me.removeAllDrawings();
			    	
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
            	me._finishAjaxRequest();
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
        	var layer = selected[i]

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
	    	if(this.currentSearchMode=='point'){
	    		var lon = feat.geometry.x;
	    		var lat = feat.geometry.y;
	    		
	    		var oMap = this.mapModule.getMap();
	    		var oLonLat = new OpenLayers.LonLat(lon, lat);
	    		var oPx = oMap.getViewPortPxFromLonLat(oLonLat);
	    		
	    		var x = oPx.x;
	    		var y = oPx.y;
	    		Oskari.clazz.globals.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon,lat,x,y]);
	        	
	    	} else {
	    		me._handleSearchByGeom(feat.geometry.toString());
	    	}
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
    	/* data is { fragments: coll, title: title } */
    	/* fragments is an array of JSON { markup: '<html-markup>', layerName: 'nameforlayer', layerId: idforlayer } */
        var me = this;
        var contentHtml = [];
        var content = {};
        content.html = '';
        content.actions = {};
        for (var di = 0; di < data.fragments.length; di++) {
		var fragment =   data.fragments[di]      	
        	var fragmentTitle = fragment.layerName;
        	var fragmentMarkup = fragment.markup;
        	
        	contentHtml.push('<div>');
            contentHtml.push( 
               '<div style="border:1pt solid navy;background-color: #424343;margin-top: 14px; margin-bottom: 10px;height:15px;">' +  
                 '<div class="icon-bubble-left" style="height:15px;display:inline;float:left;"><div></div></div>'+
                 '<div style="color:white;float:left;display:inline;margin-left:8px;">'+fragmentTitle +'</div>'+
               '</div>');
            if( fragmentMarkup ) {   
            	contentHtml.push(fragmentMarkup);
            }
			contentHtml.push('</div>');
        }
        
        content.html = contentHtml.join('');

        var rn = "HaravaInfoBox.ShowInfoBoxRequest";
        var rb = me._sandbox.getRequestBuilder(rn);
        var r = rb(data.popupid, "Info", [content], data.lonlat, true);
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
    	me.toggleControl(searchMode);    	
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
