/**
 * @class Oskari.liikennevirasto.bundle.mapmodule.plugin.LakapaTransportSelectorPlugin
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.mapmodule.plugin.LakapaTransportSelectorPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function(locale, conf) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.enabled = true;
    this._locale = locale;
    this._conf = conf;
    this._croppingLayer = null;
    this._oldCroppingLayer = null;
    this._reqularControl = null;
    this.noMessageCleaning = false;
    this.templateTransportContainer = jQuery('<div id="transport-selector-container"></div>');
    this.templateTransportSelectorDiv = jQuery('<div class="transport-selector-select-div"></div>');
    this.templateTransportCroppingSelectorDiv = jQuery('<div class="transport-cropping-selector-select-div"></div>');
    this.templateBetaTag = jQuery('<div class="transport-selector-div-beta-tag">BETA</div>');
    this.templateLanguageDiv = jQuery('<div class="transport-selector-div-language"><a id="language-fi" data-language="fi" class="language-selector" href="">fi</a> | <a id="language-sv" data-language="sv" class="language-selector" href="">sv</a> | <a id="language-en" data-language="en" class="language-selector" href="">en</a></div>');
    this.templateTransportSelectorDivTitle = jQuery('<div class="transport-selector-div-title"></div>');
    this.templateTransportCroppingSelect = jQuery('<div id="transport-cropping-selector-select"></div>');
    this.templateTransportRoad = jQuery('<div id="transport-road" class="transport transport-road" data-transport="road"></div>');
    this.templateTransportSea = jQuery('<div id="transport-sea" class="transport transport-sea" data-transport="sea"></div>');
    this.templateTransportDigiroad = jQuery('<div id="transport-digiroad" class="transport transport-digiroad" data-transport="digiroad"></div>');
    this.templateTransportRailway = jQuery('<div id="transport-railway" class="transport transport-railway" data-transport="railway"></div>');
    this.templateTransportClearDiv = jQuery('<div class="transport-clear"></div>');
    this.templateTransportAreaSelector = jQuery('<div id="transport-cropping-tool-button"><div id="transport-select-cropping-tool"></div></div>');
    this.templateConfirmMessage = jQuery('<div id="transport-confirm-message"><div id="transport-confirm-message-title"></div><div id="transport-confirm-message-message">testi viesti</div><div id="transport-confirm-message-buttons"><div id="transport-message-confirm-ok" class="transport-button"></div><div id="transport-message-confirm-cancel" class="transport-button"></div><div id="transport-message-confirm-clear"></div></div></div>');
    this.templateEmptyOption = jQuery('<option></option>');
    this.templateCropButton = jQuery('<div class="transport-select-cropping-button cropping-button"></div>');

    this.selectedTransport = null;
    this.selectedCropping = null;

    this.selectionLayer = null;

    this._pendingAjaxQuery = {
        	busy: false,
        	jqhr: null,
        	timestamp: null
    };

    this._pendingAjaxQuery2 = {
        	busy: false,
        	jqhr: null,
        	timestamp: null
    };

    this._pendingDigiroadAjaxQuery = {
        	busy: false,
        	jqhr: null,
        	timestamp: null
        };

    this._pendingMapAjaxQuery = {
        	busy: false,
        	jqhr: null,
        	timestamp: null
        };

    this.featureStyle = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(
            {
                pointRadius: 8,
                strokeColor: this._conf.selector.selectedFillColor,
                fillColor: this._conf.selector.selectedFillColor,
                fillOpacity: this._conf.selector.selectedFillOpacity,
                strokeOpacity: 1,
                strokeWidth: 3
        })
    });

}, {
    /** @static @property __name plugin name */
    __name : 'LakapaTransportSelectorPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * Set state
     * @method setState
     * @param {Object} state
     * @public
     */
    setState: function(state){
        var me = this;
        me._conf = state;

        jQuery('#transport-'+me._conf.selector.selected_transport).trigger('click');
        jQuery('.cropping-button').removeClass('enabled');
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
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        me._sandbox = sandbox;
        me._sandbox.printDebug("[LakapaTransportSelectorPlugin] init");

        me._croppingLayer = new OpenLayers.Layer.Vector("Lakapa cropping layer", {
    		eventListeners : {
                "featuresadded" : function(layer) {
                    me.finishedDrawing();
                }
            }
    	});

        me._oldCroppingLayer = new OpenLayers.Layer.Vector("Lakapa old cropping layer",{
                styleMap: me.featureStyle});

        me._reqularControl = new OpenLayers.Control.DrawFeature(me._croppingLayer,
                OpenLayers.Handler.RegularPolygon,{handlerOptions: {irregular:true}});
        me._map.addControl(me._reqularControl);
        me.selectionLayer = new OpenLayers.Layer.Vector("LAKAPA selection", {styleMap:
            new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
        });

        me._map.addLayers([me._croppingLayer,me._oldCroppingLayer,me.selectionLayer]);
    },
    /**
     * @method _disableAllTransportTools
     * @private
     */
    _disableAllTransportTools: function(){
    	jQuery('.transport').addClass('disable');
    	jQuery('#transport-select-cropping-tool').addClass('disable');
    },
    /**
     * @method _enableAllTransportTools
     * @private
     */
    _enableAllTransportTools: function(){
    	jQuery('.transport').removeClass('disable');
    	jQuery('#transport-select-cropping-tool').removeClass('disable');
    },
    /**
     * @method disable
     * @public
     */
    disable: function(){
    	var me = this;
    	me._disableAllTransportTools();
    },
    /**
     * @method enable
     * @public
     */
    enable: function(){
    	var me = this;
    	me._enableAllTransportTools();
    },
    /**
     * @method _isLayerOnCroppingLayers
     * @private
     * @param layerId
     * @returns {Boolean}
     */
    _isLayerOnCroppingLayers: function (layerId) {
    	var me = this;
        var isValue = false;
        var rc = me._conf.selector.transport_cropping_layers.road;
        var rac = me._conf.selector.transport_cropping_layers.railway;
        var sc = me._conf.selector.transport_cropping_layers.sea;
        if(rc!=null && rc.length>0){
	        for(var i=0;i<rc.length;i++){
	        	var l = rc[i];
	        	if(l.id==layerId){
	        		isValue = true;
	        	}
	        }
        }

        if(rac!=null && rac.length>0){
	        for(var i=0;i<rac.length;i++){
	        	var l = rac[i];
	        	if(l.id==layerId){
	        		isValue = true;
	        	}
	        }
        }

        if(sc!=null && sc.length>0){
	        for(var i=0;i<sc.length;i++){
	        	var l = sc[i];
	        	if(l.id==layerId){
	        		isValue = true;
	        	}
	        }
        }
        return isValue;
    },
    /**
     * @method _buildLayerList
     * @private
     * Build visible layer list
     * @return {Array} layers
     */
    _buildLayerList: function()  {
        var me = this;
    	var selected = me._sandbox.findAllSelectedMapLayers();
        var layerIds = [];

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
			if( layer._type=='BASE_LAYER'){
				continue;
			}

			if( layer._layerType=='WMTS'){
			    continue;
			}

			if(me._isLayerOnCroppingLayers(layer.getId())){
				continue;
			}

            layerIds.push(layer);
        }

        return layerIds;
    },
    /**
     * @method _sendBasketRequest
     * @private
     * @param {Object} bbox
     * @param {Array} files selected files
     * @param {String} croppingMode selected cropping mode
     * @param {String} identifier, example digiroad
     * @param {Array} features
     */
    _sendBasketRequest: function(bbox, files, croppingMode, identifier, features){
    	var me = this;
    	var selectedLayers = files;
    	if(files==null){
    		selectedLayers=me._buildLayerList();
    	}

    	if(croppingMode==null){
    		croppingMode = me.selectedCropping;
    	}
    	jQuery.each(selectedLayers, function(index, layer){
    	    var transport = 'road';
            var insName = layer._inspireName;
            if(insName==me._locale.transport_road){
                transport = 'road';
            } else if(insName==me._locale.transport_sea){
                transport = 'sea';
            } else if(insName==me._locale.transport_railway_line){
                transport = 'railway';
            } else if(insName==me._locale.transport_beta) {
            	transport = 'beta';
            } else {
                transport = 'digiroad';
            }
            me._sandbox.postRequestByName('AddToBasketRequest', [bbox,[layer],croppingMode, transport, identifier,features]);
    	});


    },
    /**
     * @method showMessage
     * @param {String} title
     * @param {String} message
     */
    showMessage: function(title,message, handler){
    	var me = this;
    	me._showMessage(title, message, handler, null,false);
    },
    /**
     * @method _addToBasket
     * @private
     * @param features
     * @param disableThis
     */
    _addToBasket:function(features, disableThis){
    	var me = this;
    	var feat = null;
    	var bounds = {
    			left: null,
    			bottom: null,
    			right:null,
    			top:null
    	};
    	var cropping = me.selectedCropping;
    	if(disableThis!=null){
    		me.selectedCropping = null;
    		disableThis.removeClass('enabled');
    	}

    	if(features.length>0){
    		var featBounds = features[0].geometry.getBounds();
    		bounds.left = featBounds.left;
    		bounds.bottom = featBounds.bottom;
    		bounds.right = featBounds.right;
    		bounds.top = featBounds.top;
    		feat = features[0];
    	}

    	me._reqularControl.deactivate();
    	me._oldCroppingLayer.removeAllFeatures();

    	me._disableAllTransportTools();
    	me._oldCroppingLayer.addFeatures(features);

    	me._oldCroppingLayer.refresh();
    	me._oldCroppingLayer.redraw();
    	me._oldCroppingLayer.setVisibility(true);

    	if(feat!=null){
    		var drawnArea = feat.geometry.getArea();
    		var limit = null;
    		var isSelectedSomeRealLayers = false;

    		try{
    			limit = me._conf.selector.transport_cropping_areas[me.selectedTransport].areaLimitInSquareMeters;
    		} catch(err){}

    		if(me.selectedCropping=='lastreqular'){
    			me._map.zoomToExtent(me._oldCroppingLayer.getDataExtent());
    		}

    		var selectedLayers = me._buildLayerList();
    		if(selectedLayers.length==0){
    			var okClick = function(){
    				me._croppingLayer.removeAllFeatures();
    				me._oldCroppingLayer.removeAllFeatures();
    				if(me.selectedCropping!='mapextent'
    					&& me.selectedCropping!='lastreqular'
    					){
    					me._reqularControl.activate();
    				} else {
    					me._deactivateCropSelectedArea();
    				}
    				me._enableAllTransportTools();
    			};
    			me._showMessage(me._locale.message_no_selected_layers_title, me._locale.message_no_selected_layers_message, okClick, null,false);

    		} else {
	    		if(limit!=null && drawnArea>limit){
	    			var okClick = function(){
	    				me._croppingLayer.removeAllFeatures();
	    				me._oldCroppingLayer.removeAllFeatures();
	    				if(me.selectedCropping!='mapextent'
	    					&& me.selectedCropping!='lastreqular'
	    					){
	    					me._reqularControl.activate();
	    				} else {
	    					me._deactivateCropSelectedArea();
	    				}
	    				me._enableAllTransportTools();
	    			};

	    			var cancelClick  = function(){
	    				me._croppingLayer.removeAllFeatures();
	    				me._oldCroppingLayer.removeAllFeatures();
	    				if(me.selectedCropping!='mapextent'
	    					&& me._selectedCropping!='lastreqular'
	    					){
	    					me._reqularControl.activate();
	    				} else {
	    					me._deactivateCropSelectedArea();
	    				}
	    				me._enableAllTransportTools();
	    			};
	    			me._showMessage(me._locale.message_area_too_big_title, me._locale.message_area_too_big_message, okClick, cancelClick, false);

	    		} else {
	    			var okClick = function(){
	    				me._croppingLayer.removeAllFeatures();
	    				me._oldCroppingLayer.removeAllFeatures();
	    				if(me.selectedCropping!='mapextent'
	    					&& me.selectedCropping!='lastreqular'
	    					){
	    					me._reqularControl.activate();
	    				} else {
	    					me._deactivateCropSelectedArea();
	    				}
	    				me._enableAllTransportTools();

	    				if(me.selectedCropping=='newreqular'){
	    					var geometryString = feat.geometry.toString();
	    					me._saveLastSelectedRegion(geometryString);
	    				}
	    				me._sendBasketRequest(bounds,null,cropping, null);
	    			};

	    			var cancelClick  = function(){
	    				me._croppingLayer.removeAllFeatures();
	    				me._oldCroppingLayer.removeAllFeatures();
	    				if(me.selectedCropping!='mapextent'
	    					&& me.selectedCropping!='lastreqular'
	    					){
	    					me._reqularControl.activate();
	    				} else {
	    					me._deactivateCropSelectedArea();
	    				}
	    				me._enableAllTransportTools();
	    			};

	    			me._showMessage(me._locale.message_add_area_to_basket_title, me._locale.message_add_area_to_basket_message, okClick, cancelClick, true, me._locale.message_digiroad_move_button);
	    		}
	    	}
    	}
    },
    /**
     * @method finishedDrawing
     * Finish drawing
     */
    finishedDrawing : function(){
    	var me = this;
    	var features = me._croppingLayer.features;
    	me._addToBasket(features);
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
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        var me = this;
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }

        me._sandbox.printDebug("[LakapaTransportSelectorPlugin] startPlugin");

        this._map = this.getMapModule().getMap();

        me._sandbox.register(this);

        for(var p in me.eventHandlers) {
        	me._sandbox.registerForEventByName(this, p);
        }

        var transportContainer = me.templateTransportContainer.clone();
        var transportSelectorDiv = me.templateTransportSelectorDiv.clone();
        var transportCroppingSelectorDiv = me.templateTransportCroppingSelectorDiv.clone();
        var transportSelectorDivTitle = me.templateTransportSelectorDivTitle.clone();
        var transportSelectorLanguageDiv = me.templateLanguageDiv.clone();

        var transportCroppingSelect = me.templateTransportCroppingSelect.clone();
        var transportRoadSelectorDiv = me.templateTransportRoad.clone();
        var transportSeaSelectorDiv = me.templateTransportSea.clone();
        var transportRailwaySelectorDiv = me.templateTransportRailway.clone();
        var transportDigiroadSelectorDiv = me.templateTransportDigiroad.clone();

        var transportClearSelectorDiv = me.templateTransportClearDiv.clone();
        var transportCroppingButton = me.templateTransportAreaSelector.clone();
        var transportMessageConfirm = me.templateConfirmMessage.clone();

        transportMessageConfirm.find('#transport-message-confirm-ok').html(me._locale.message_button_ok);
        transportMessageConfirm.find('#transport-message-confirm-cancel').html(me._locale.message_button_cancel);

        jQuery('body').append(transportMessageConfirm);

        transportRoadSelectorDiv.attr('title', me._locale.transport_all);
        transportRoadSelectorDiv.append("<span>"+me._locale.transport_all+"</span");
        //transportRoadSelectorDiv.html("<div>"+me._locale.transport_all+"</div");
        transportSeaSelectorDiv.attr('title', me._locale.transport_sea);
        transportRailwaySelectorDiv.attr('title', me._locale.transport_railway_line);
        transportDigiroadSelectorDiv.attr('title', me._locale.transport_digiroad);
        transportDigiroadSelectorDiv.append("<span>"+me._locale.transport_digiroad+"</span");
        //transportDigiroadSelectorDiv.html(me._locale.transport_digiroad);
        transportSelectorDivTitle.html(me._locale.transport_title);

        var selectorDiv = jQuery('#transport-selector');
        if(selectorDiv.length>0){
        	selectorDiv.append(transportContainer);

        	var selectorButtonsDiv = jQuery('#transport-selector-buttons');
        	if(selectorButtonsDiv.length>0){
        		selectorButtonsDiv.parent().find('#emptybar').after(transportSelectorLanguageDiv);
        		selectorButtonsDiv.append(transportSelectorDivTitle);
        		selectorButtonsDiv.append(transportSelectorDiv);
        	} else {
        		transportContainer.append(transportSelectorLanguageDiv);
        		transportContainer.append(transportSelectorDivTitle);
        		transportContainer.append(transportSelectorDiv);
        	}
        } else {
        	jQuery('#maptools').append(transportSelectorLanguageDiv);
        	jQuery('#maptools').append(transportContainer);
        	transportContainer.append(transportSelectorDivTitle);
            transportContainer.append(transportSelectorDiv);
        }

        transportSelectorDiv.append(transportRoadSelectorDiv);
        transportSelectorDiv.append("<br/>");
//        transportSelectorDiv.append(transportSeaSelectorDiv);
        //transportSelectorDiv.append(transportRailwaySelectorDiv);
        transportSelectorDiv.append(transportDigiroadSelectorDiv);
        transportSelectorDiv.append(transportClearSelectorDiv);
        transportContainer.append(transportCroppingSelectorDiv);
        transportContainer.append(transportCroppingSelect);
        //Handle language change functionality
        var language = jQuery.cookie('language');
        jQuery("#language-"+language+"").addClass("language-selected");
        jQuery('.transport-selector-div-language a').unbind('click');
        jQuery('.transport-selector-div-language a').bind('click', function(evt){
        	evt.preventDefault();
        	//Get the language data attribute from this anchor
        	var language = jQuery(this).attr('data-language');
        	//Create a handler for language change request
        	var okHandler = function(){
                me._sandbox.postRequestByName('ChangeLanguageRequest', [language]);
            };
            //Show the message to the user
        	me._showMessage(
        			me._locale.message_change_language_title,
        			me._locale.message_change_language_message,
        			okHandler,
        			null,
        			true,
        			me._locale.message_change_language_ok,
        			me._locale.message_change_language_cancel);
        	return false;
        });
        jQuery('.transport').unbind('click');
        jQuery('.transport').bind('click', function(){
        	if(!jQuery(this).hasClass('disable')){
        		var transport = jQuery(this).attr('data-transport');
        		me._sandbox.postRequestByName('TransportChangedRequest', [transport]);

        		me.unSelectCroppingTool();
        		jQuery('#transport-cropping-selector-select').empty();

	        	var id = jQuery(this)[0].id;
	        	var selVal = id.split('-');

        		jQuery('.transport').removeClass('active');
        		jQuery('#'+id).addClass('active');
        		jQuery('.transport').addClass('disable');
        		jQuery('#transport-cropping-tool-button').hide();
        		me.selectedTransport = selVal[1];
        		me._removeAllSelectedLayers();
        		me._addTransportActiveLayers();
        	}
        });

        transportCroppingSelectorDiv.html(me._locale.cropping_title);

        jQuery('#transport-'+me._conf.selector.selected_transport).trigger('click');
    },
    /**
     * @method showOnMap
     * @public
     * @param bbox
     */
    showOnMap: function(bbox){
    	var me = this;
    	me._oldCroppingLayer.removeAllFeatures();

    	if(bbox==null){
    		return;
    	}

    	var wkt = new OpenLayers.Format.WKT();
		var wktObject = 'POLYGON(('+bbox.left+' ' + bbox.bottom + ',' + bbox.left + ' ' + bbox.top +',' + bbox.right + ' ' + bbox.top + ',' + bbox.right + ' ' + bbox.bottom + ',' + bbox.left+' ' + bbox.bottom + '))';
		var feature = wkt.read(wktObject);
		var newStyle = OpenLayers.Util.applyDefaults(newStyle, OpenLayers.Feature.Vector.style['default']);
		   	newStyle.strokeColor = me._conf.selector.selectedFillColor;
		   	newStyle.strokeOpacity = 1;
		   	newStyle.fillColor = me._conf.selector.selectedFillColor;
		   	newStyle.fillOpacity = me._conf.selector.selectedFillOpacity;


		feature.style = newStyle;

		var features = [feature];

    	me._oldCroppingLayer.addFeatures(features);

    	me._oldCroppingLayer.refresh();
    	me._oldCroppingLayer.redraw();
    	me._oldCroppingLayer.setVisibility(true);
    	me._map.zoomToExtent(me._oldCroppingLayer.getDataExtent());
    },
    /**
     * @method showFeatureOnMap
     * @public
     * @param bbox
     */
    showFeatureOnMap: function(feature){
    	var me = this;
    	me._oldCroppingLayer.removeAllFeatures();

    	if(feature==null){
    		return;
    	}

    	me._oldCroppingLayer.addFeatures(feature);

    	me._oldCroppingLayer.refresh();
    	me._oldCroppingLayer.redraw();
    	me._oldCroppingLayer.setVisibility(true);
    	me._map.zoomToExtent(me._oldCroppingLayer.getDataExtent());
    },
    /**
     * @method hideSelectionOnMap
     * @public
     */
    hideSelectionOnMap: function(){
    	var me = this;
    	me._oldCroppingLayer.removeAllFeatures();
    },
    /**
     * @method _activateCropSelectedArea
     * @private
     */
    _activateCropSelectedArea: function(){
    	var me = this;

    	if(me.selectedCropping!='mapextent' &&
    			me.selectedCropping!='lastreqular'){
    		me._reqularControl.activate();
    	}

    	if(me.selectedCropping=='mapextent'){
    		var b = me._map.getExtent();
    		var wkt = new OpenLayers.Format.WKT();
    		var wktObject = 'POLYGON(('+b.left+' ' + b.bottom + ',' + b.left + ' ' + b.top +',' + b.right + ' ' + b.top + ',' + b.right + ' ' + b.bottom + ',' + b.left+' ' + b.bottom + '))';
    		var feature = wkt.read(wktObject);
    		var features = [feature];
    		me._addToBasket(features, jQuery("[data-cropping-tool='"+me.selectedCropping+"']"));
    	} else if(me.selectedCropping=='lastreqular'){
    		var wkt = new OpenLayers.Format.WKT();
    		var wktObject = null;
    		try{
    			wktObject = me._conf.selector.transport_cropping_areas[me.selectedTransport].lastReqular;
    		} catch(err){}

    		if(wktObject == null){
    			me._disableAllTransportTools();
    			me._showMessage(me._locale.message_no_last_cropping_selection_title, me._locale.message_no_last_cropping_selection_message, function(){
    				me._deactivateCropSelectedArea();
    				me._enableAllTransportTools();
    			},null, false);

    		} else {
    			var feature = wkt.read(wktObject);

    			if(feature==null){
    				me._disableAllTransportTools();
    				me._showMessage(me._locale.message_no_last_cropping_selection_title, me._locale.message_no_last_cropping_selection_message, function(){
        				me._deactivateCropSelectedArea();
        				me._enableAllTransportTools();
        			},null, false);
    			} else {
    				var features = [feature];
    				me._addToBasket(features, jQuery("[data-cropping-tool='"+me.selectedCropping+"']"));
    			}
    		}
    	}
    },
    /**
     * @method _deactivateCropSelectedArea
     * @private
     */
    _deactivateCropSelectedArea: function(){
    	var me = this;
    	me._reqularControl.deactivate();
		jQuery('#transport-select-cropping-tool').attr('title', me._locale.cropping_area_selector_button_select);
		jQuery('#transport-select-cropping-tool').removeClass('enabled');
    },
    /**
     * @method _hideMessage
     * @private
     */
    _hideMessage: function(){
    	jQuery('#transport-message-confirm-ok').unbind('click');
    	jQuery('#transport-message-confirm-cancel').unbind('click');
    	jQuery('#transport-confirm-message').hide();
    },
    /**
     * @method _showMessage
     * @private
     * @param {String} title
     * @param {String} message
     * @param {Function} okClickHandler
     * @param {Function} cancelClickHandler
     * @param {Boolean} showCancel
     * @param {String} okButtonText
     * @param {String} cancelButtonText
     */
    _showMessage: function(title, message, okClickHandler, cancelClickHandler, showCancel, okButtonText,cancelButtonText){
    	var me = this;
    	if(title==null || message == null){
    		return;
    	}
    	if(showCancel==null){
    		showCancel = false;
    	}

    	if(okButtonText==null){
    		okButtonText = me._locale.message_button_ok;
    	}

    	if(cancelButtonText==null){
    		cancelButtonText = me._locale.message_button_cancel;
    	}

    	jQuery('#transport-confirm-message-title').html(title);
    	jQuery('#transport-confirm-message-message').html(message);

    	jQuery('#transport-message-confirm-ok').html(okButtonText);
    	jQuery('#transport-message-confirm-cancel').html(cancelButtonText);

    	jQuery('#transport-message-confirm-ok').unbind('click');
    	jQuery('#transport-message-confirm-cancel').unbind('click');

    	jQuery('#transport-message-confirm-ok').bind('click', function(){
    		me._hideMessage();
    		if(typeof okClickHandler == 'function'){
    			okClickHandler();
    		}
    	});
    	if(showCancel==true){
    		jQuery('#transport-message-confirm-cancel').show();
	    	jQuery('#transport-message-confirm-cancel').bind('click', function(){
	    		me._hideMessage();
	    		if(typeof cancelClickHandler == 'function'){
	    			cancelClickHandler();
	    		}
	    	});
    	} else {
    		jQuery('#transport-message-confirm-cancel').hide();
    	}
    	jQuery('#transport-confirm-message').show();

    },
    /**
     * @method _disableAllCroppingLayers
     * @private
     */
    _disableAllCroppingLayers: function(){
    	var me = this;

    	jQuery(me._conf.selector.transport_cropping_layers, function(index,transport){
    	    jQuery(transport,function(layerindex,layer){
    	        var id = layer.id;
    	        me._sandbox.postRequestByName('RemoveMapLayerRequest', [id]);
    	    });
    	});
    },
    /**
     * Is value on array
     * @method isValueOnArray
     * @public
     * @param {String} value value to check
     * @param {Array} array to check
     * @return {Boolean} is value on array
     */
     isValueOnArray: function (value, array) {
         var isValue = false;
         for (var i in array) {
             if (i != null) {
                 var v = array[i];
                 if (v == value) {
                     isValue = true;
                 }
             }
         }
         return isValue;
     },
    /**
     * Create cropping selection.
     * @method _createCroppingSelection
     * @private
     */
    _createCroppingSelection: function(){
    	var me = this;

    	var transportCroppingSelector = jQuery('#transport-cropping-selector-select');
    	transportCroppingSelector.empty();

		var specialCroppingLayerNames = [];
    	for(var a in me._conf.selector.special_cropping_layers){
	    	if(me._conf.selector.special_cropping_layers[a] != null && me._conf.selector.special_cropping_layers[a].length>0){
	    		jQuery.each(me._conf.selector.special_cropping_layers[a], function(index, value) {
	    			specialCroppingLayerNames.push(value.name.toUpperCase());
	    		});
	    	}
    	}

    	var options = [];
    	if(me._conf.selector.transport_cropping_areas[me.selectedTransport] != null && me._conf.selector.transport_cropping_areas[me.selectedTransport].options.length>0){
    		options = me._conf.selector.transport_cropping_areas[me.selectedTransport].options;
    	}

    	jQuery.each(options, function(index, value) {
    		var langText = me._locale['cropping_transport_'+me.selectedTransport+'_option_'+value];

    		if(langText==null){
    			langText = me._locale.cropping_selection_no_language;
    		}
    		var temp = me.templateCropButton.clone();
    		temp.html(langText);
    		temp.attr('data-cropping-tool',value);

    		temp.attr('title',me._locale['tooltip_'+value]);
    		transportCroppingSelector.append(temp);
    	});

    	// add cropping selectors per layers
    	var transportCroppingLayers = [];

    	if(me._conf.selector.transport_cropping_layers[me.selectedTransport] != null && me._conf.selector.transport_cropping_layers[me.selectedTransport].length>0){
    		transportCroppingLayers = me._conf.selector.transport_cropping_layers[me.selectedTransport];
    	}

    	jQuery.each(transportCroppingLayers, function(index, value) {
    		var temp = me.templateCropButton.clone();
    		var testValue = value.name.toUpperCase();
    		var isValueOnSpecialCrop = me.isValueOnArray(testValue,specialCroppingLayerNames);

    		if(isValueOnSpecialCrop==false && value.id != 'transport-koko-suomi'){
    			temp.html(value.name);
    			temp.attr('data-cropping-tool',value.id);
    			temp.attr('data-cropping-tool-wms',value.wmsName);
    			temp.attr('data-cropping-tool-wms-url',value.wmsUrl);
    			temp.attr('title', me._locale.tooltip_cropping_layer);
    			transportCroppingSelector.append(temp);
    		} else if (value.id == 'transport-koko-suomi'){
    		    temp.html(value.name);
                temp.attr('data-cropping-tool',value.id);
                temp.attr('data-cropping-tool-wms',value.wmsName);
                temp.attr('data-cropping-tool-wms-url',value.wmsUrl);
                temp.attr('title', me._locale.tooltip_cropping_layer_full_finland);
                transportCroppingSelector.append(temp);
    		}
    	});

    	jQuery('.cropping-button').unbind('click');
    	jQuery('.cropping-button').bind('click', function(){
    	    if(jQuery(this).attr('data-cropping-tool') == 'transport-koko-suomi'){
                jQuery('.cropping-button').removeClass('enabled');
                me.unSelectCroppingTool(true);
                if(jQuery('.lakapa-basket-data[data-identifier="digiroad"][data-layer-name="full-finland"]').length>0){
                    me._showMessage(me._locale.message_title_digiroad_all_ready_added_title, me._locale.message_title_digiroad_all_ready_added_message, null, null, false, null,null);
                } else {
                    var okHandler = function(){
                        var files = [{name: me._locale.digiroad_full_finland, feature: {
                            attributes: {
                                livimaakunta: 'full-finland',
                                livitiedostokoko: 0
                            }
                        }}];
                        me._sendBasketRequest(null, files, null, 'digiroad');
                    };

                    me._showMessage(me._locale.message_digiroad_add_to_basket_full_finland_title, me._locale.message_digiroad_add_to_basket_full_finland_message, okHandler, null, true, me._locale.message_digiroad_move_button, me._locale.message_button_cancel);
                }
            } else {
	    		if(jQuery(this).hasClass('enabled')){
	    			me.unSelectCroppingTool();
	    		} else {
	    			me.unSelectCroppingTool();
		    		jQuery('.cropping-button').removeClass('enabled');
		    		jQuery(this).addClass('enabled');

		    		me.selectedCropping = jQuery(this).attr('data-cropping-tool');
		    		me._reqularControl.deactivate();
		    		me._disableAllCroppingLayers();

		    		if(me.selectedCropping!='newreqular' &&
		        			me.selectedCropping!='lastreqular' &&
		        			me.selectedCropping!='mapextent'
		        				){
		        		me._sandbox.postRequestByName('AddMapLayerRequest', [me.selectedCropping, true]);
		        	} else {
		        		me._activateCropSelectedArea();
		        	}

	    		}
            }
    	});

    	jQuery('.cropping-button').tipsy({gravity: 'w'});
    	jQuery('.transport').removeClass('disable');
    },
    /**
     * @method _addTransportActiveLayers
     * @private
     */
    _addTransportActiveLayers: function(){
        var me = this;
        if(me.timers==null) me.timers = {};
        clearTimeout(me.timers.addTransportActiveLayers);
        me.timers.addTransportActiveLayers = window.setTimeout(function(){
            var activeLayers = me._conf.selector['transport-activate-layers'];
            var transportActiveLayers = activeLayers[me.selectedTransport];

            jQuery.each(transportActiveLayers, function(index, layerName){
                me._sandbox.postRequestByName('AddMapLayerRequest', [layerName, true]);
            });
        },500);

    },
    /**
     * @method _removeAllSelectedLayers
     * @private
     */
    _removeAllSelectedLayers: function(){
    	var me = this;
  	  	var selected = me._sandbox.findAllSelectedMapLayers();

  	  	jQuery.each(selected, function(index, value) {
  	  		if(value!=null && value.getId()!='base_35'){
  	  			me._sandbox.postRequestByName('RemoveMapLayerRequest', [value.getId()]);
  	  		}
  	  	});
    	window.setTimeout(function(){me._removeAllAndAddTransportLayers();},500);
    },
    /**
     * @method _removeAllLayers
     * @private
     */
    _removeAllAndAddTransportLayers: function(){
    	var me = this;

    	var mapService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
  	  	var allLayers = mapService.getAllLayers();


  	  	jQuery.each(allLayers, function(index, value) {
  	      if(value!=null && value.getId()!='base_35'){
  	    	  mapService.removeLayer(value.getId());
  	      }
  	  	});

  	  	var allLayers = mapService.getAllLayers();
  	  	if(allLayers.length>1){
  		   me._removeAllAndAddTransportLayers();
  	  	} else {
  	  	   me._addLayers();
  	  	   me._createCroppingSelection();
  	  	}
    },
    /**
     * @method _addLayers
     * @private
     * @param {String} transport
     */
    _addLayers: function(){
    	var me = this;
    	var mapService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');

    	var layers = [];
    	if(me._conf.selector.transport_layers[me.selectedTransport]!=null){
    		layers = me._conf.selector.transport_layers[me.selectedTransport];
    	}
    	jQuery.each(layers, function(index,layerJSON){
    		var oskariLayer = mapService.createMapLayer(layerJSON);
    		mapService.addLayer(oskariLayer);
    	});

    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        var me = this;
        // hide infobox if open
        me._closeGfiInfo();

        for(p in this.eventHandlers) {
        	this._sandbox.unregisterFromEventByName(this, p);
		}

        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }

        this._sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.Sandbox} sandbox
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
     * @method _notifyAjaxFailure
     * @private
     * Notify ajax failure
     */
    _notifyAjaxFailure: function() {
    	 var me = this;
    	 me._sandbox.printDebug("[LakapaTransportSelectorPlugin] AJAX failed");
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
    	this._sandbox.printDebug("[LakapaTransportSelectorPlugin] Abort jqhr ajax request");
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
        this._sandbox.printDebug("[LakapaTransportSelectorPlugin] finished jqhr ajax request");
    },/**
     * @method _notifyAjaxFailure2
     * @private
     * Notify ajax failure
     */
    _notifyAjaxFailure2: function() {
    	 var me = this;
    	 me._sandbox.printDebug("[LakapaTransportSelectorPlugin] AJAX failed");
    },
    /**
     * @method _isAjaxRequestBusy2
     * @private
     * Check at if ajax request is busy
     * @return {Boolean} true if ajax request is busy, else false
     */
    _isAjaxRequestBusy2: function() {
    	var me = this;
    	return me._pendingAjaxQuery2.busy;
    },
    /**
     * @method _cancelAjaxRequest2
     * @private
     * Cancel ajax request
     */
    _cancelAjaxRequest2: function() {
    	var me = this;
    	if( !me._pendingAjaxQuery2.busy ) {
    		return;
    	}
    	var jqhr = me._pendingAjaxQuery2.jqhr;
    	me._pendingAjaxQuery2.jqhr = null;
    	if( !jqhr) {
    		return;
    	}
    	this._sandbox.printDebug("[LakapaTransportSelectorPlugin] Abort jqhr ajax request");
    	jqhr.abort();
    	jqhr = null;
    	me._pendingAjaxQuery2.busy = false;
    },
    /**
     * @method _starAjaxRequest2
     * @private
     * Start ajax request
     */
    _startAjaxRequest2: function(dteMs) {
    	var me = this;
		me._pendingAjaxQuery2.busy = true;
		me._pendingAjaxQuery2.timestamp = dteMs;

    },
    /**
     * @method _finishAjaxRequest
     * @private
     * Finish ajax request
     */
    _finishAjaxRequest2: function() {
    	var me = this;
    	me._pendingAjaxQuery2.busy = false;
        me._pendingAjaxQuery2.jqhr = null;
        this._sandbox.printDebug("[LakapaTransportSelectorPlugin] finished jqhr ajax request");
    },
    /**
     * @method _saveLastSelectedRegion
     * @param {String} geometryString
     * @private
     * Save last selected region
     */
    _saveLastSelectedRegion: function(geometryString){
    	var me = this;
    	if(!Oskari.user().isLoggedIn()){
    		return;
    	}
    	var dte = new Date();
        var dteMs = dte.getTime();

        if( me._pendingAjaxQuery.busy && me._pendingAjaxQuery.timestamp &&
            	dteMs - me._pendingAjaxQuery.timestamp < 500 ) {
            	me._sandbox.printDebug("[LakapaTransportSelectorPlugin] Save last selected region NOT SENT (time difference < 500ms)");
            	return;
        }

        me._conf.selector.transport_cropping_areas.road.lastReqular = geometryString;
    	me._conf.selector.transport_cropping_areas.railway.lastReqular = geometryString;
    	me._conf.selector.transport_cropping_areas.sea.lastReqular = geometryString;

        me._cancelAjaxRequest();
        me._startAjaxRequest(dteMs);

        var ajaxUrl = me._sandbox.getAjaxUrl();

        jQuery.ajax({
            beforeSend : function(x) {
            	me._pendingAjaxQuery.jqhr = x;
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/json;charset=UTF-8");
                }
            },
            success : function(resp) {
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
                selectedRegion : geometryString,
                lang: Oskari.getLang()
            },
            type : 'POST',
            dataType : 'json',
            url : ajaxUrl + 'action_route=SaveSelectedRegion'
        });

    },
    /**
     * Unselect cropping tool
     * @method unSelectCroppingTool
     * @public
     */
    unSelectCroppingTool: function(noNeedToRemoveLayer){
    	var me = this;
    	me._reqularControl.deactivate();
    	if(noNeedToRemoveLayer==null){
    		noNeedToRemoveLayer = false;
    	}
    	me._oldCroppingLayer.removeAllFeatures();
    	me.selectionLayer.removeAllFeatures();
    	if(me.selectedCropping!='newreqular' &&
    			me.selectedCropping!='lastreqular' &&
    			me.selectedCropping!='mapextent'
    				){
    			me._sandbox.postRequestByName('RemoveMapLayerRequest', [me.selectedCropping]);
    	}
    	me.selectedCropping = null;
    	me.noMessageCleaning = noNeedToRemoveLayer;
    	jQuery('.cropping-button').removeClass('enabled');
    	me._sandbox.postRequestByName('RefreshLiviBasketRequest', []);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
    	'Toolbar.ToolSelectedEvent' : function(event){
    		this.unSelectCroppingTool();
    	},
    	'MapClickedEvent' : function(evt) {
            if(this.selectedCropping=='newreqular' ||
                    this.selectedCropping=='lastreqular' ||
                    this.selectedCropping=='mapextent'	||
                    this.selectedCropping==null
            ) {
                // disabled, do nothing
                return;
            }
            var lonlat = evt.getLonLat();
            var x = evt.getMouseX();
            var y = evt.getMouseY();

            if(this.selectedCropping=='transport-croppingDigiroad-'+this._conf.maakuntarajatNimi && this.selectedTransport=='digiroad'){
            	this.handleGetDigiroadInfo(lonlat, x, y);
            } else if(this.selectedCropping!='newreqular' &&
            		this.selectedCropping!='lastreqular' &&
            		this.selectedCropping!='mapextent'){
            	this.handleGetMapInfo(lonlat, x, y);
            }
        },
        'AfterMapMoveEvent' : function(evt) {
        	this._cancelDigiroadAjaxRequest();
        	this._cancelMapAjaxRequest();
        },
		'AfterMapLayerRemoveEvent' : function(event) {
			this._cancelDigiroadAjaxRequest();
        	this._cancelMapAjaxRequest();

        	var selectedLayers = this._buildLayerList();
        	if(selectedLayers.length==0){
        		this._croppingLayer.removeAllFeatures();
        	    this._oldCroppingLayer.removeAllFeatures();
        	    this.selectionLayer.removeAllFeatures();
        	}
        	if(this.noMessageCleaning==true){
        		this.noMessageCleaning = false;
        	} else {
        		this._hideMessage();
        	}
		},
		'AfterMapLayerAddEvent' : function(event) {
			this._cancelDigiroadAjaxRequest();
        	this._cancelMapAjaxRequest();

        	this._hideMessage();

        	this._map.setLayerIndex(this._croppingLayer, 1000000);
        	this._map.setLayerIndex(this._oldCroppingLayer, 1000000);
        	this._map.setLayerIndex(this.selectionLayer, 1000000);
		}
    },
    /**
     * @method _cancelDigiroadAjaxRequest
     * @private
     * Cancels ajax request
     */
    _cancelDigiroadAjaxRequest: function() {
    	var me = this;
    	if( !me._pendingDigiroadAjaxQuery.busy ) {
    		return;
    	}
    	var jqhr = me._pendingDigiroadAjaxQuery.jqhr;
    	me._pendingDigiroadAjaxQuery.jqhr = null;
    	if( !jqhr) {
    		return;
    	}
    	jqhr.abort();
    	jqhr = null;
    	me._pendingDigiroadAjaxQuery.busy = false;
    },
    /**
     * @method _startDigiroadAjaxRequest
     * @private
     * Start ajax request
     * @param dteMs {Integer} Datetime timestamp in milliseconds
     */
    _startDigiroadAjaxRequest: function(dteMs) {
    	var me = this;
		me._pendingDigiroadAjaxQuery.busy = true;
		me._pendingDigiroadAjaxQuery.timestamp = dteMs;

    },
    /**
     * @method _finishDigiroadAjaxRequest
     * @private
     * Finish ajax request
     */
    _finishDigiroadAjaxRequest: function() {
    	var me = this;
    	me._pendingDigiroadAjaxQuery.busy = false;
        me._pendingDigiroadAjaxQuery.jqhr = null;
    },
    /**
     * @method _cancelMapAjaxRequest
     * @private
     * Cancels ajax request
     */
    _cancelMapAjaxRequest: function() {
    	var me = this;
    	if( !me._pendingMapAjaxQuery.busy ) {
    		return;
    	}
    	var jqhr = me._pendingMapAjaxQuery.jqhr;
    	me._pendingMapAjaxQuery.jqhr = null;
    	if( !jqhr) {
    		return;
    	}
    	jqhr.abort();
    	jqhr = null;
    	me._pendingMapAjaxQuery.busy = false;
    },
    /**
     * @method _startMapAjaxRequest
     * @private
     * Start ajax request
     * @param dteMs {Integer} Datetime timestamp in milliseconds
     */
    _startMapAjaxRequest: function(dteMs) {
    	var me = this;
		me._pendingMapAjaxQuery.busy = true;
		me._pendingMapAjaxQuery.timestamp = dteMs;

    },
    /**
     * @method _finishMapAjaxRequest
     * @private
     * Finish ajax request
     */
    _finishMapAjaxRequest: function() {
    	var me = this;
    	me._pendingMapAjaxQuery.busy = false;
        me._pendingMapAjaxQuery.jqhr = null;
    },
    /**
     * @method buildSelectedDigiroadfiles
     * @public
     * Build selected digiroad files list
     * @param {Boolean} returnArray
     */
    buildSelectedDigiroadfiles: function(returnArray){
    	var me = this;
    	var arrSel = [];

    	var retArr = [];

    	if(returnArray==null){
    		returnArray = false;
    	}

    	for(var i=0;i<me.selectionLayer.features.length;i++){
    		var f = me.selectionLayer.features[i];
    		arrSel.push(f.attributes.livimaakunta);
    		retArr.push({
    			name: f.attributes.livimaakunta,
    			feature: f
    		});
    	}

    	var selected = arrSel.join(',');
    	if(returnArray==false){
    		return selected;
    	} else {
    		return retArr;
    	}
    },
    /**
     * Get fileSizes
     * @param identifier
     * @returns {Number}
     */
    getFilesSizes: function(identifier){
    	var fileSize = 0;
    	jQuery('.lakapa-basket-data').each(function(){
    		if(jQuery(this).attr('data-identifier')==identifier){
    			fileSize += parseFloat(jQuery(this).attr('data-file-size'));
    		}
    	});
    	return fileSize;
    },
    /**
	 * @method handleGetMapInfo
	 * send ajax request to get feature info for given location for any visible layers
	 *
	 * backend processes given layer (ids) as WMS GetFeatureInfo or WFS requests
	 * (or in the future WMTS GetFeatureInfo)
	 *
	 * aborts any pending ajax query
	 *
	 */
    handleGetMapInfo : function(lonlat, x, y) {
        var me = this;

        var selectedLayers = me._buildLayerList();
		if(selectedLayers.length==0){
			var okClick = function(){
				me._croppingLayer.removeAllFeatures();
				me._oldCroppingLayer.removeAllFeatures();
				if(me.selectedCropping!='mapextent'
					&& me.selectedCropping!='lastreqular'
					){
					me._reqularControl.activate();
				} else {
					me._deactivateCropSelectedArea();
				}
				me._enableAllTransportTools();
			};
			me._showMessage(me._locale.message_no_selected_layers_title, me._locale.message_no_selected_layers_message, okClick, null,false);
			return;
		}

        var dte = new Date();
        var dteMs = dte.getTime();

        if( me._pendingMapAjaxQuery.busy && me._pendingMapAjaxQuery.timestamp &&
        	dteMs - me._pendingMapAjaxQuery.timestamp < 500 ) {
        	me._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo NOT SENT (time difference < 500ms)");
        	return;
        }

        me._cancelMapAjaxRequest();

        me._startMapAjaxRequest(dteMs);

        var ajaxUrl = this._sandbox.getAjaxUrl();

        var lon = lonlat.lon;
        var lat = lonlat.lat;

        var selected = '';

        var sel = jQuery("[data-cropping-tool='"+me.selectedCropping+"']");
        var wmsLayer = sel.attr('data-cropping-tool-wms');
        var wmsUrl = sel.attr('data-cropping-tool-wms-url');

        var mapVO = me._sandbox.getMap();

          jQuery.ajax({
	            beforeSend : function(x) {
	            	me._pendingMapAjaxQuery.jqhr = x;
	                if (x && x.overrideMimeType) {
	                    x.overrideMimeType("application/json;charset=UTF-8");
	                }
	            },
	            success : function(resp) {
	            	var geojson_format = new OpenLayers.Format.GeoJSON();
            		var features = geojson_format.read(resp.features);

            		if(features!=null){
	            		var f = features[0];

	            		var identifier = '';
	            		jQuery.each(f.attributes, function(key, value){
	            			identifier += key + '_' + value;
	            			identifier += '__';
	            		});

	            		var founded = me.selectionLayer.getFeaturesByAttribute("livi_yksiloiva_tunnus",identifier);

		            	if(founded!= null && founded.length>0){
		            		me.selectionLayer.removeFeatures(founded);

		            		// Check at if there is not any features then hide messagebox
		            		if(me.selectionLayer.features.length==0){
		            		    me._hideMessage();
		            		}
		            	} else {
		            		var newStyle = OpenLayers.Util.applyDefaults(newStyle, OpenLayers.Feature.Vector.style['default']);
		            		var ses = resp.sessionKeys.join(',');
		     			   	newStyle.strokeColor = me._conf.selector.selectedFillColor;
		     			   	newStyle.strokeOpacity = 1;
		     			   	newStyle.fillColor = me._conf.selector.selectedFillColor;
		     			   	newStyle.fillOpacity = me._conf.selector.selectedFillOpacity;

		            		for(var i=0;i<features.length;i++){
		            			features[i].style = newStyle;
		            			features[i].attributes['livi_yksiloiva_tunnus'] = identifier;
		            			features[i].attributes['livi_sessio_tunnus'] = ses;
		            		}
		            		me.selectionLayer.addFeatures(features);

		            		var okHandler = function(){
	            				var files = me.buildSelectedDigiroadfiles(true);
	            				me._sendBasketRequest(null, null, null,
	            				        null, me.selectionLayer.features);
	            				me.selectionLayer.removeAllFeatures();
	            			};
	            			me._showMessage(me._locale.message_special_cropping_add_to_basket_title, me._locale.message_special_cropping_add_to_basket_message, okHandler, null, true, me._locale.message_digiroad_move_button, me._locale.message_digiroad_continue_button);
		            	}
            		}
	            	me._finishMapAjaxRequest();
	            },
	            error : function() {
	            	me._finishMapAjaxRequest();
	            },
	            always: function() {
	            	me._finishMapAjaxRequest();
	            },
	            complete: function() {
	            	me._finishMapAjaxRequest();
	            },
	            data : {
	                projection : me.mapModule.getProjection(),
	                x : x,
	                y : y,
	                lon : lon,
	                lat : lat,
	                width : mapVO.getWidth(),
	                height : mapVO.getHeight(),
	                bbox : mapVO.getBbox().toBBOX(),
	                zoom : mapVO.getZoom(),
	                lang: Oskari.getLang(),
	                selected: selected,
	                wmsLayer: wmsLayer,
	                wmsUrl: wmsUrl
	            },
	            type : 'POST',
	            dataType : 'json',
	            url : ajaxUrl + 'action_route=GetMapFeatureInfoWMS'
	        });
    },
    /**
	 * @method handleGetDigiroadInfo
	 * send ajax request to get feature info for given location for any visible layers
	 *
	 * backend processes given layer (ids) as WMS GetFeatureInfo or WFS requests
	 * (or in the future WMTS GetFeatureInfo)
	 *
	 * aborts any pending ajax query
	 *
	 */
    handleGetDigiroadInfo : function(lonlat, x, y) {
        var me = this;

        var dte = new Date();
        var dteMs = dte.getTime();

        if( me._pendingDigiroadAjaxQuery.busy && me._pendingDigiroadAjaxQuery.timestamp &&
        	dteMs - me._pendingDigiroadAjaxQuery.timestamp < 500 ) {
        	me._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo NOT SENT (time difference < 500ms)");
        	return;
        }

        me._cancelDigiroadAjaxRequest();

        me._startDigiroadAjaxRequest(dteMs);

        var ajaxUrl = this._sandbox.getAjaxUrl();

        var lon = lonlat.lon;
        var lat = lonlat.lat;

        var mapVO = me._sandbox.getMap();

        var selected = me.buildSelectedDigiroadfiles();

        var basketSelected = [];
        jQuery('.lakapa-basket-data').each(function(){
    		if(jQuery(this).attr('data-identifier')=='digiroad'){
    			basketSelected.push(jQuery(this).attr('data-layer-name'));
    		}
    	});
        var sBasketSelected = basketSelected.join(',');

        var fileSizes = me.getFilesSizes('digiroad');
        if(fileSizes>me._conf.digiroadMaxFileSize){
        	me._showMessage(me._locale.message_digiroad_max_file_size_basket_title, me._locale.message_digiroad_max_file_size_basket_message, null, null, false);
        } else {
	        jQuery.ajax({
	            beforeSend : function(x) {
	            	me._pendingDigiroadAjaxQuery.jqhr = x;
	                if (x && x.overrideMimeType) {
	                    x.overrideMimeType("application/json;charset=UTF-8");
	                }
	            },
	            success : function(resp) {
	            	var founded = me.selectionLayer.getFeaturesByAttribute("livimaakunta",resp.maakunta);
	            	var isZipFile = resp.isZipFile;
	            	if(isZipFile==true){
		            	if(founded!=null && founded.length>0){
		            		me.selectionLayer.removeFeatures(founded);

		            		// Check at if there is not any features then hide messagebox
                            if(me.selectionLayer.features.length==0){
                                me._hideMessage();
                            }
		            	} else {
		            		if(resp.isOverSize==false){
		            			if(jQuery('.lakapa-basket-data[data-identifier="digiroad"][data-layer-name="'+resp.maakunta+'"]').length>0){
		    	    				me._showMessage(me._locale.message_title_digiroad_all_ready_added_title, me._locale.message_title_digiroad_all_ready_added_message, null, null, false, null,null);
		    	    			} else {
				            		var geojson_format = new OpenLayers.Format.GeoJSON();
				            		var features = geojson_format.read(resp.features);

				            		var newStyle = OpenLayers.Util.applyDefaults(newStyle, OpenLayers.Feature.Vector.style['default']);
				     			   	newStyle.strokeColor = me._conf.selector.selectedFillColor;
				     			   	newStyle.strokeOpacity = 1;
				     			   	newStyle.fillColor = me._conf.selector.selectedFillColor;
				     			   	newStyle.fillOpacity = me._conf.selector.selectedFillOpacity;

				            		for(var i=0;i<features.length;i++){
				            			features[i].style = newStyle;
				            		}
				            		me.selectionLayer.addFeatures(features);

				            		var okHandler = function(){
			            				var files = me.buildSelectedDigiroadfiles(true);
			            				me._sendBasketRequest(null, files, null, 'digiroad');
			            				me.selectionLayer.removeAllFeatures();
			            			};

			            			var cancelHandler =function(){
			            			    //me.selectionLayer.removeAllFeatures();
			            			};
		            			me._showMessage(me._locale.message_digiroad_add_to_basket_title, me._locale.message_digiroad_add_to_basket_message, okHandler, cancelHandler, true, me._locale.message_digiroad_move_button, me._locale.message_digiroad_continue_button);
		    	    			}
		            		} else {
		            			var layerSelected = me.buildSelectedDigiroadfiles(true);

		            			if(layerSelected.length>0){
			            			var okHandler = function(){
			            				var files = me.buildSelectedDigiroadfiles(true);
			            				me._sendBasketRequest(null, files, null, 'digiroad');
			            				me.selectionLayer.removeAllFeatures();
			            			};
		            				me._showMessage(me._locale.message_digiroad_max_file_size_title, me._locale.message_digiroad_max_file_size_message, okHandler, null, true, me._locale.message_digiroad_move_button, me._locale.message_digiroad_change_button);
		            			} else {
		            				me._showMessage(me._locale.message_digiroad_max_file_size_title, me._locale.message_digiroad_max_file_size_basket_message2 , null, null, false);

		            			}
		            		}
		            	}
	            	} else {
	            		me._showMessage(me._locale.message_digiroad_not_found_title, me._locale.message_digiroad_not_found_message1 + ' "'+resp.maakunta+'" '+me._locale.message_digiroad_not_found_message2+'.', null, null, false);
	            	}

	            	me._finishDigiroadAjaxRequest();
	            },
	            error : function() {
	            	me._finishDigiroadAjaxRequest();
	            },
	            always: function() {
	            	me._finishDigiroadAjaxRequest();
	            },
	            complete: function() {
	            	me._finishDigiroadAjaxRequest();
	            },
	            data : {
	                projection : me.mapModule.getProjection(),
	                x : x,
	                y : y,
	                lon : lon,
	                lat : lat,
	                width : mapVO.getWidth(),
	                height : mapVO.getHeight(),
	                bbox : mapVO.getBbox().toBBOX(),
	                zoom : mapVO.getZoom(),
	                lang: Oskari.getLang(),
	                selected: selected,
	                allreadyBasket: sBasketSelected
	            },
	            type : 'POST',
	            dataType : 'json',
	            url : ajaxUrl + 'action_route=GetDigiroadFeatureInfoWMS'
	        });
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
    	var handler = this.eventHandlers[event.getName()];

        if(!handler)
        	return;

        return handler.apply(this, [event]);
    }
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
