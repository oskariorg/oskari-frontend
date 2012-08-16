/*
 *
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.featuredataDownload.FeaturedataDownloadModule',
/*
 * @constructor
 ...
 */
function(config) {
    this._sandbox = null;
    this.uiItems = {};
    this._config = config;
    this._highLightedLayer = null;
}, {
    __name : "FeaturedataDownloadModule",
    getName : function() {
        return this.__name;
    },
    init : function(sb) {
        this._sandbox = sb;
        var sandbox = sb;
        var me = this;
        sandbox.printDebug("Initializing featuredata download module...");

        // register for listening events

        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        this._populateLanguageSet(sandbox);

        // config for toolbutton that initiates xml download
        this.toolbar = {
            config : {
                group : 'DataDownload',
                toolId : 'featureDataDownloadXML',
                iconCls : 'featuredata_download_tool',
                tooltip : me.localization.toolbarbuttontext, 
                callback : function() {
                	// do nothing initially
                }
            }
        };

        return;
    },
    _populateLanguageSet : function(sandbox) {

		var lang =  sandbox.getLanguage();
		 // Create this once during startup
		var locale = Oskari.clazz.create('Oskari.mapframework.bundle.featuredataDownload.ui.module.Locale',lang);
        this.localization = locale.getCurrentLocale();
		
		if(!this.localization) {
			// default to fin if unknown localization
			this.localization = locale.getLocale('fi');
		}
    },
    _showLicensePopup : function(licenseURL, layerId, licenseName) {
    	var me = this;
    	var buttonConfigArray = [
    	{
	        text : me.localization.accept,
	        callback : function() {
	        	me._getDataUrl(layerId, licenseName);
	        }
        },
        {
        	text : me.localization.decline
        }];
        this._sandbox.requestByName(this.getName(), "ShowOverlayPopupRequest", [licenseURL, buttonConfigArray]);
    },
    
	_getDataUrl : function(layerId,licenseName) {
		var me = this;
		var lang = Oskari.$().sandbox.getLanguage();
		var postData = "download=featuredata&layerId=" + layerId
					+ "&Language=" + lang;
					
		var mapVO = this._sandbox.getMap();
		var bounds = "&bbox_min_x=" + mapVO.getBbox().left +
					"&bbox_max_x="  + mapVO.getBbox().right +
					"&bbox_min_y="  + mapVO.getBbox().bottom +
					"&bbox_max_y="  + mapVO.getBbox().top +
					"&map_width=" + mapVO.getWidth() + 
					"&map_heigh=" + mapVO.getHeight();
					
		
		postData = postData + bounds;
		if(licenseName) {
			postData = postData + "&" + licenseName + "=accepted";
		}
		jQuery.ajax( {
			dataType : "json",
			type : "POST",
			url : this._config.baseURL,
			data : postData,
			success: function(responseText) {
				me._getDataUrlCallbackSuccess(layerId, responseText);
			},
			complete : function(response, status) {
				me._getDataUrlCallback(layerId, response, status);
			}
		});
	},
    _getDataUrlCallbackSuccess : function(layerId, response) {
		// parse dataUrl and call _showLicensePopup
		// if no dataurl -> show license
		if(response.license) {
			//{"license":{"termsOfUseAccept":"http://www.google.fi"}}
			var licenseName = '';
			for(var key in response.license) {
				if(key) {
					licenseName = key;
					break;
				}
			}
			if(licenseName) {
				this._showLicensePopup(response.license[licenseName], layerId, licenseName);
			}
			else {
				alert(this.localization.errorOnLoad);
			}
		}
		else if(response.downloadUrlParameters) {
			// else if has dataurl -> window.open(dataurl)
			// server only returns params that are appended to the actual dl url
			window.open(this._config.xmlURL + response.downloadUrlParameters);
		}
		else if(response.downloadPermission === 'no') {
			alert(this.localization.accessDenied);
		}
		else {
			alert(this.localization.errorOnLoad);
		}
    },
    _getDataUrlCallback : function(layerId, response, status) {
    	if('error' === status) {
    		alert(this.localization.errorOnLoad);
    	}
    },
					
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
        // sends a request that adds button described in config
        sandbox.request(this, sandbox.getRequestBuilder('MapControls.ToolButtonRequest')(this.toolbar.config, 'add'));
        // disable by default
        this._handleDimLayer();
        this._createLayersWithDLRightsList();
    },
    stop : function(sandbox) {
        // sends a request that removes button described in config
        sandbox.request(this, sandbox.getRequestBuilder('MapControls.ToolButtonRequest')(this.toolbar.config, 'remove'));
    },
    _handleHighlightLayer : function(event) {
        var layer = event.getMapLayer();
        var me = this;
        for(var i = 0; i < this.layerIdList.length; ++i) {
            // check if user has download rights
            if(layer.getId() === this.layerIdList[i]) {
            	this._highLightedLayer = layer;
            	// preset the config for enable
		    	this.toolbar.config.callback = function() {
		            me._getDataUrl(layer.getId());
		        };
            }
        }
        this._checkEnable();
    },
    _handleDimLayer : function() {
    	this._highLightedLayer = null;
        // always disable on dim
        // sends a request that disables button described in config
        this._sandbox.request(this, this._sandbox.getRequestBuilder('MapControls.ToolButtonRequest')(this.toolbar.config, 'disable'));
    },
    _checkEnable : function() {
        if(!this._highLightedLayer) {
        	// no layer highlighted -> do nothing
        	return;
        }
        var scale = this._sandbox.getMap().getScale();
        var layer = this._highLightedLayer;
        // sends a request to enalbe/disable button described in config
        if(scale > layer.getMaxScale() && scale < layer.getMinScale()) {
	        this._sandbox.request(this, this._sandbox.getRequestBuilder('MapControls.ToolButtonRequest')(this.toolbar.config, 'enable'));	
        }
        else {
	        this._sandbox.request(this, this._sandbox.getRequestBuilder('MapControls.ToolButtonRequest')(this.toolbar.config, 'disable'));	
        }
        
    },
    _createLayersWithDLRightsList : function() {
    	
        this.layerIdList = [];
		// TODO: should layersConfig (layer id list) from bundle config
		if(this._config.layers && this._config.layers.length > 0) {
			this.layerIdList = this._config.layers;
		}
		else {
			// default to all WFS layers
	        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
	        var layers = mapLayerService.getAllLayers();
	        
	        for(var i = 0; i < layers.length; i++) {
	            if(layers[i].isLayerOfType('WFS')) {
	                // TODO: check layer.getRights() -> string array has
	                // ~'featuredatadownload'?
	                this.layerIdList.push(layers[i].getId());
	                
	            }
	        }	
		}
    },
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            this._checkEnable();
        },
        'AfterHighlightMapLayerEvent' : function(event) {
            this._handleHighlightLayer(event);
        },
        'AfterDimMapLayerEvent' : function(event) {
            this._handleDimLayer();
        }
    },

    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
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