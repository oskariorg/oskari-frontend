/**
 * @class Oskari.mapframework.mapmodule.GetInfoPlugin
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.GetInfoPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.enabled = true;
}, {
    /** @static @property __name plugin name */
    __name : 'GetInfoPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
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
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        this._sandbox.printDebug("[GetInfoPlugin] init");
        var gfih = 'Oskari.mapframework.mapmodule-plugin.getinfo.GetFeatureInfoHandler';
        this.requestHandlers = {
            getFeatureInfoHandler : Oskari.clazz.create(gfih, this._sandbox, me)
        };
        this._sandbox.addRequestHandler('GetFeatureInfoRequest', this.requestHandlers.getFeatureInfoHandler);
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

        /**
         * getinfo
         */
        this._getinfoTool = new (Oskari.$("OpenLayers.Control.GetInfoAdapter"))({
            callback : function(loc, clickLocation, options) {
                me.handleGetInfo(loc, clickLocation, options);
            },
            hoverCallback : function(loc, clickLocation, options) {
                me.handleGetInfoHover(loc, clickLocation, options);
            }
        });

        this.getMapModule().addMapControl('getinfo', this._getinfoTool);

        this._sandbox.register(this);
        for (p in this.eventHandlers ) {
            this._sandbox.registerForEventByName(this, p);
        }
        // sandbox.printDebug("[GetInfoPlugin] Registering " +
        // this.requestHandlers.mapClickHandler);
        // sandbox.addRequestHandler('MapModulePlugin.MapClickRequest',
        // this.requestHandlers.mapClickHandler);
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

        for (p in this.eventHandlers ) {
            this._sandbox.unregisterFromEventByName(this, p);
        }
        // sandbox.removeRequestHandler('MapModulePlugin.MapClickRequest',
        // this.requestHandlers.mapClickHandler);
        this._sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
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
        var me = this;
        if(blnEnabled == true) {
            // enable with a small delay 
            // so myplaces draw finish will not trigger this
            setTimeout(function() {
                me.enabled = true;
            }, 500);
        }
        else {
            this.enabled = false;
        }
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'Toolbar.ToolSelectedEvent' : function(event) {
            this.setEnabled(('basictools' == event.getGroupId() &&
                 'select' == event.getToolId()));
        },
        'AfterDeactivateAllOpenlayersMapControlsButNotMeasureToolsEvent' : function(event) {
            this.afterDeactivateAllOpenlayersMapControlsButNotMeasureToolsEvent();
        },
        'AfterDeactivateAllOpenlayersMapControlsEvent' : function(event) {
            this.afterDeactivateAllOpenlayersMapControlsEvent(event);
        },
        'MapClickedEvent' : function(evt) {
            if(!this.enabled) {
                // disabled, do nothing
                return;
            }

            var me = this;
            var ajaxUrl = "/web/fi/kartta" + "?p_p_id=Portti2Map_WAR_portti2mapportlet" + "&p_p_lifecycle=1" + "&p_p_state=exclusive" + "&p_p_mode=view" + "&p_p_col_id=column-1" + "&p_p_col_count=1" + "&_Portti2Map_WAR" + "_portti2mapportlet" + "_fi.mml.baseportlet.CMD=ajax.jsp&";

            var lonlat = evt.getLonLat();
            var lon = lonlat.lon;
            var lat = lonlat.lat;
	    var popupid = "wfs" + lon + "_" + lat;
            var x = evt.getMouseX();
            var y = evt.getMouseY();
            var projection = 'EPSG:3067';
            var width = this._sandbox.getMap().getWidth();
            var height = this._sandbox.getMap().getHeight();
            var bbox = this._sandbox.getMap().getBbox();
	    var zoom = this._sandbox.getMap().getZoom();

            var selected = this._sandbox.findAllSelectedMapLayers();
            var layerIds = ""
            for (var i = 0; i < selected.length; i++) {
                if (layerIds !== "") {
                    layerIds += ",";
                }
                layerIds += selected[i].getId();
            }

            jQuery.ajax({
                beforeSend : function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success : function(resp) {
		    if (resp.data &&
			resp.data.type &&
			resp.data.type == "WFS_LAYER" &&
			resp.data.features &&
			resp.data.features[0] &&
			resp.data.features[0].children &&
			resp.data.features[0].children[0]) {

			var raw = resp.data.features[0].children[0];
			var title = "WFS";
			if (raw['pnr_PaikanNimi']['pnr:kirjoitusasu']) {
			    title = raw['pnr_PaikanNimi']['pnr:kirjoitusasu'];
			}
			var pretty = JSON.stringify(raw, null, 4);
			var content = {};
			content.html = '<pre>' + pretty + '</pre>';
			content.actions = {};
			content.actions.ok = function() {
			    var rn = "InfoBox.HideInfoBoxRequest";
			    var rb = me._sandbox.getRequestBuilder(rn);
			    var r = rb(popupid);
			    me._sandbox.request(me, r);
			};
			var rn = "InfoBox.ShowInfoBoxRequest";
			var rb = me._sandbox.getRequestBuilder(rn);
			var r = rb(popupid, 
				   title, 
				   [ content ], 
				   lonlat, 
				   false);
			me._sandbox.request(me, r);
		    } else {
			var content = me._formatResponseForInfobox(resp);
			if(content.length > 0) {
                            me._showGfiInfo(content, lonlat);
			}
		    }
                },
                error : function() {
                    alert("GetInfo failed.");
                },
                type : 'POST',
                dataType : 'json',
                url : ajaxUrl + 
		    'action_route=GetFeatureInfoWMS' + 
		    '&layerIds=' + layerIds + 
		    '&projection=' + projection + 
		    '&x=' + x + '&y=' + y + 
		    '&lon=' + lon + '&lat=' + lat + 
		    '&width=' + width + '&height=' + height + 
		    '&bbox=' + bbox + '&zoom=' + zoom
            });

            // if (this._activated) {
            //   this.buildWMSQueryOrWFSFeatureInfoRequest(lonlat,
            // 					    mouseX,
            // 					    mouseY);
            // }

        },
        'AfterHighlightMapLayerEvent' : function(event) {
            this._activated = true;
        },
        'AfterDimMapLayerEvent' : function(event) {
            this._activated = false;
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var me = this;
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    handleGetInfo : function(loc, clickLocation, options) {
        var me = this;
        me._sandbox.printDebug("GETINFO " + loc.lat + "," + loc.lon);
        this.buildWMSQueryOrWFSFeatureInfoRequest(loc, clickLocation.x, clickLocation.y);

    },
    handleGetInfoHover : function(loc, clickLocation, options) {
        var me = this;
        me._sandbox.printDebug("GETINFO HOVER " + loc.lat + "," + loc.lon);
    },
    /**
     * @method _closeGfiInfo
     * @private
     * Closes the infobox with GFI data 
     */
    _closeGfiInfo : function() {
        var rn = "InfoBox.HideInfoBoxRequest";
        var rb = this._sandbox.getRequestBuilder(rn);
        var r = rb("getinforesult");
        this._sandbox.request(this, r);
    },
    /**
     * @method _showGfiInfo
     * @private
     * Shows given content in given location using infobox bundle 
     * @param {Object[]} content infobox content array
     * @param {OpenLayers.LonLat} lonlat location for the GFI data
     */
    _showGfiInfo : function(content,lonlat) {
        var me = this;
        // setup close button as an extra content
        content.push({
            html: '', // no data to show, only to add button
            actions : {
                // TODO: localization
                "Ok" : function() {
                    me._closeGfiInfo();
                }
            }
        });
        // send out the request
        var rn = "InfoBox.ShowInfoBoxRequest";
        var rb = this._sandbox.getRequestBuilder(rn);
        var r = rb("getinforesult", "GetInfo Result", content, lonlat, true);
        this._sandbox.request(me, r);
        
    },
    /**
     * @method _formatResponseForInfobox
     * @private
     * Parses the GFI JSON response to a content array that can be 
     * shown with infobox bundle
     * @param {Object} response response from json query
     * @return {Object[]} 
     */
    _formatResponseForInfobox : function(response) {

        var content = [];
        if(!response || !response.data) {
            return content;
        }
        var me = this;
        var dataList = [];
        // TODO: fix in serverside!
        if (!response.data.length) {
            // not an array
            dataList.push(response.data);
        } else {
            dataList = response.data;
        }

        for (var ii = 0; ii < dataList.length; ii++) {
            var html = '';
            var data = dataList[ii];

            if (data.presentationType == 'TEXT') {
                html = '<div style="overflow:auto">' + data.content + '</div>';
            } else {
                html = '<br/><table>';
                var even = false;
                // TODO: not tested
                var jsonData = data.content;
                for (attr in jsonData) {
                    var value = jsonData[attr];
                    if (value.startsWith('http://')) {
                        value = '<a href="' + value + '" target="_blank">' + value + '</a>';
                    }
                    html = html + '<tr style="padding: 5px;';
                    if (!even) {
                        html = html + ' background-color: #EEEEEE';
                    }
                    even = !even;
                    html = html + '"><td style="padding: 2px">' + attr + '</td><td style="padding: 2px">' + value + '</td></tr>';
                }
                html + '</table>';
            }

            content.push({
                html : html
            });
        }
        return content;
    },

    /**
     * converts given array to CSV
     *
     * @param {Object}
     *            array
     */
    arrayToCSV : function(array) {
        var me = this;
        var separatedValues = "";

        for (var i = 0; i < array.length; i++) {
            separatedValues += array[i];
            if (i < array.length - 1) {
                separatedValues += ",";
            }
        }

        return separatedValues;
    },

    /***********************************************************
     * Build WMS GetFeatureInfo request
     *
     * @param {Object}
     *            e
     */
    buildWMSQueryOrWFSFeatureInfoRequest : function(lonlat, mouseX, mouseY) {

        var me = this;
        var sandbox = me._sandbox;
        var allHighlightedLayers = me._sandbox.findAllHighlightedLayers();

        this._projectionCode = 'EPSG:3067';

        if (allHighlightedLayers[0] && allHighlightedLayers[0] != null && (allHighlightedLayers[0].isLayerOfType('WMS') || allHighlightedLayers[0].isLayerOfType('WMTS'))) {

            var mapWidth = me._sandbox.getMap().getWidth();
            var mapHeight = me._sandbox.getMap().getHeight();
            var bbox = me._sandbox.getMap().getBbox();

            var queryLayerIds = me._sandbox.findAllHighlightedLayers();

            var b = me._sandbox.getRequestBuilder('GetFeatureInfoRequest');
            var r = b(queryLayerIds, lonlat.lon, lonlat.lat, mouseX, mouseY, mapWidth, mapHeight, bbox, this._projectionCode);
            me._sandbox.request(this, r);

        } else if (allHighlightedLayers[0] && allHighlightedLayers[0] != null && allHighlightedLayers[0].isLayerOfType('VECTOR')) {
            this.getMapModule().notifyAll(me._sandbox
            .getEventBuilder('FeaturesGetInfoEvent')(allHighlightedLayers[0], null, lonlat.lon, lonlat.lat, this._map.getProjection, "GetFeatureInfo"));

        }
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
