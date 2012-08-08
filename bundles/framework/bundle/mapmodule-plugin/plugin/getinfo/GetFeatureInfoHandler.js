Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.getinfo.GetFeatureInfoHandler', 
                    function(sandbox, getInfoPlugin) {
    this.getInfoPlugin = getInfoPlugin;
    this.sandbox = sandbox;
}, {
    __name : 'GetFeatureInfoHandler',
    getName : function() {
        return this.__name;
    },
    init : function(sandbox) {
    },
    /**
     * @deprecated not used anywhere?
     */
    _getWmsReqParams : function(request, layer) {
    	
    	var map = this.sandbox.getMap();
    	var width = request.getMapWidth();
    	if(!width) {
    		width = map.getWidth();
    	}
    	var height = request.getMapHeight();
    	if(!height) {
    		height = map.getHeight();
    	}
        return 
            'REQUEST=GetFeatureInfo' + 
            '&EXCEPTIONS=application/vnd.ogc.se_xml' + 
            '&SRS=' + this._getSRS(request) + 
            '&VERSION=1.1.1' + 
            '&BBOX=' + this._getBBString(request) + 
            '&X=' + request.getX() + 
            '&Y=' + request.getY() + 
            '&INFO_FORMAT=' + layer.getQueryFormat() + 
            '&QUERY_LAYERS=' + layer.getWmsName() + 
            '&WIDTH=' + width + 
            '&HEIGHT=' + height + 
            '&FEATURE_COUNT=1' + 
            '&FORMAT=image/png' + 
            '&SERVICE=WMS' + 
            '&STYLES=' + layer.getCurrentStyle().getName() + 
            '&LAYERS=' + layer.getWmsName();
    },
    _getWmtsReqParams : function(request, layer) {
    	
        var openLayerList = this.getInfoPlugin._map.getLayersByName('layer_' + layer.getId());
        
     	
        var lonlat = new OpenLayers.LonLat(request.getLon(), request.getLat());
        var tileInfo = openLayerList[0].getTileInfo(lonlat);
        
        
       var params =
       		openLayerList[0].url + '?' +
        	'service=WMTS' + 
            '&request=GetFeatureInfo' + 
            '&version=' + openLayerList[0].version + 
            '&layer=' + openLayerList[0].layer + 
            '&style=' + openLayerList[0].style +
            '&format=text/xml' +
            '&TileMatrixSet=' + openLayerList[0].matrixSet + 
            '&TileMatrix=' + openLayerList[0].getMatrix().identifier + 
            '&TileCol=' + tileInfo.col +
            '&TileRow=' + tileInfo.row +
            '&I=' + tileInfo.i +
            '&J=' + tileInfo.j +
            '&InfoFormat=text/xml';
        
        return params;	    
    },
    _getBBString : function(request) {
    	var extent = request.getBoundingBox();
    	if(!extent) {
    		extent = this.getInfoPlugin.getMapModule().getMap().getExtent();
    	}
        return  extent.left + ',' + 
	            extent.bottom + ',' + 
	            extent.right + ',' + 
	            extent.top;
    },
    _getSRS : function(request) {
    	var srs = request.getSRS();
    	if(!srs) {
    		srs = 'EPSG:3067';
    	}
    	return srs;
    },
    _notifyNotSupported : function(layerName, request) {
        var msgKey = "rightpanel_wms_getfeatureinfo_not_supported_txt";
        var msg = this.sandbox.getText(msgKey) + ": " + layerName + ".";
        var eBuilder = this.sandbox.getEventBuilder('AfterAppendFeatureInfoEvent');
        var e = eBuilder(layerName, msg);
        this.sandbox.copyObjectCreatorToFrom(e, request);
        this.sandbox.notifyAll(e);
    },
    handleRequest : function(core, request) {
        var reqLayers = request.getMapLayers();
        var numReqLayers = reqLayers.length;
        var wfsSelected = (numReqLayers > 0) && reqLayers[0].isLayerOfType('WFS');

        // We're only interested in WMS & WMTS
        var interested = !wfsSelected && (numReqLayers > 0);
        var eBuilder = this.sandbox.getEventBuilder('AfterGetFeatureInfoEvent');
        var e = eBuilder(interested, wfsSelected);
        this.sandbox.copyObjectCreatorToFrom(e, request);
        this.sandbox.notifyAll(e, true);
        if(!interested) {
            return;
        }
        var me = this;
		
        var ajaxCallback = function(name, format) {
            this.name = name;
            this.format = format;
            this.success = function(response) {
            	var msg = "";
                if(this.format === 'application/vnd.ogc.gml' || 
                   this.format === 'application/gnd_ogc.se_xml' || 
                   this.format === 'application/vnd.ogc.wms_xml' || 
                   this.format === 'text/xml') {
                    msg = response.responseText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                } else if(response.responseText === '') {
                    msg = me.sandbox.getText('mapcontrolsservice_not_found_wms_feature_info');
                } else {
                    msg = response.responseText;
                }
                var eBuilder = me.sandbox.getEventBuilder('AfterAppendFeatureInfoEvent');
                var e = eBuilder(name, msg);
                me.sandbox.copyObjectCreatorToFrom(e, request);
                me.sandbox.notifyAll(e, true);
            };
            this.failure = function(response) {
                var eBuilder = me.sandbox.getEventBuilder('AfterAppendFeatureInfoEvent');
                var e = eBuilder(name, response.responseText);
                me.sandbox.copyObjectCreatorToFrom(e, request);
                me.sandbox.notifyAll(e, true);
            };
        };
    	
    	var map = this.sandbox.getMap();
        for(var i = 0; i < numReqLayers; i++) {
            // TODO: move this away from core
            this.sandbox._core.actionInProgressGetFeatureInfo();
            var layer = request.getMapLayers()[i];
            var layerName = layer.getName();
            var format = layer.getQueryFormat();

            var hasFormat = ((format !== null) && (format !== ""));
            if(!layer.getQueryable() || layer.isLayerOfType('WFS') || !hasFormat) {
                this._notifyNotSupported(layerName, request);
                continue;
            }
            
            var url = "";

			if(url.indexOf('?') < 0) {
                url = url + '?';
            }
            if (layer.isLayerOfType('WMTS')) {
                url = this._getWmtsReqParams(request, layer);
            } else if (layer.isLayerOfType('WMS')) {
            	
		    	var width = request.getMapWidth();
		    	if(!width) {
		    		width = map.getWidth();
		    	}
		    	var height = request.getMapHeight();
		    	if(!height) {
		    		height = map.getHeight();
		    	}
                url = startup.globalMapAjaxUrl + "&action_route=GetFeatureInfoWMS"+
                '&REQUEST=GetFeatureInfo' + 
                '&layerId=' + layer.getId() + 
	            '&EXCEPTIONS=application/vnd.ogc.se_xml' + 
	            '&SRS=' + this._getSRS(request) + 
	            '&VERSION=1.1.1' + 
	            '&BBOX=' + map.getExtent()+
	            '&X=' + request.getX() + 
	            '&Y=' + request.getY() + 
	            '&INFO_FORMAT=' + layer.getQueryFormat() + 
	            '&QUERY_LAYERS=' + layer.getWmsName() + 
	            '&WIDTH=' + width + 
	            '&HEIGHT=' + height + 
	            '&FEATURE_COUNT=1' + 
	            '&FORMAT=image/png' + 
	            '&SERVICE=WMS' + 
	            '&STYLES=' + layer.getCurrentStyle().getName() + 
	            '&LAYERS=' + layer.getWmsName();
            } 
			
            var callback = new ajaxCallback(layerName, format);
            this.sandbox.ajax( url, 
            	function(response) {
            		callback.success(response);
        		},
	            function(response) {
	            	callback.failure(response);
	        	}
    		);
        }
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
