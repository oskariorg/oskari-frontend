/**
 * @class Oskari.mapframework.mapmodule.GetInfoPlugin
 */
Oskari.clazz
    .define('Oskari.mapframework.mapmodule.GetInfoPlugin',

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
                    var gfi = {};
                    gfi.pkg = 'Oskari.mapframework.mapmodule-plugin.getinfo';
                    gfi.cls = 'GetFeatureInfoHandler';
                    gfi.fqn = gfi.pkg + '.' + gfi.cls;
                    gfi.hndlr = Oskari.clazz.create(gfi.fqn, 
                                                    this._sandbox, 
                                                    me);
                    this.requestHandlers = {};
                    this.requestHandlers.getFeatureInfoHandler = gfi.hndlr;
                    this._sandbox.addRequestHandler(gfi.cls, gfi.hndlr);
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
                    this._getinfoTool = 
                        new (Oskari.$("OpenLayers.Control.GetInfoAdapter"))
                    (
                        {
                            callback : function(loc, 
                                                clickLocation, 
                                                options) {
                                me.handleGetInfo(loc, 
                                                 clickLocation, 
                                                 options);
                            },
                            hoverCallback : function(loc, 
                                                     clickLocation, 
                                                     options) {
                                me.handleGetInfoHover(loc, 
                                                      clickLocation, 
                                                      options);
                            }
                        }
                    );
                    
                    this.getMapModule().addMapControl('getinfo', 
                                                      this._getinfoTool);

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
                        var ajaxUrl = 
                            "/web/fi/kartta" + 
                            "?p_p_id=Portti2Map_WAR_portti2mapportlet" + 
                            "&p_p_lifecycle=1" + 
                            "&p_p_state=exclusive" + 
                            "&p_p_mode=view" + 
                            "&p_p_col_id=column-1" + 
                            "&p_p_col_count=1" + 
                            "&_Portti2Map_WAR" + 
                            "_portti2mapportlet" + 
                            "_fi.mml.baseportlet.CMD=ajax.jsp&";

                        var lonlat = evt.getLonLat();
                        var lon = lonlat.lon;
                        var lat = lonlat.lat;
	                var popupid = "gfi" + lon + "_" + lat;
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

                        jQuery.ajax(
                            {
                                beforeSend : function(x) {
                                    if (x && x.overrideMimeType) {
                                        x.overrideMimeType("application/j-son;charset=UTF-8");
                                    }
                                },
                                success : function(resp) {
                                    if (resp.data && 
                                        resp.data instanceof Array) {
                                        resp.lonlat = lonlat;
                                        var parsed = 
                                            me._parseGfiResponse(resp);
                                        if (!parsed) {
                                            return;
                                        }
                                        parsed.popupid = popupid;
                                        parsed.lonlat = lonlat;
                                        me._showFeatures(parsed);
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
                    return this.eventHandlers[event.getName()].apply(this, 
                                                                     [event]);
                },
                handleGetInfo : function(loc, clickLocation, options) {
                    var me = this;
                    me._sandbox.printDebug("GETINFO " + 
                                           loc.lat + "," + 
                                           loc.lon);
                    this.buildWMSQueryOrWFSFeatureInfoRequest(loc, 
                                                              clickLocation.x, 
                                                              clickLocation.y);

                },
                handleGetInfoHover : function(loc, clickLocation, options) {
                    var me = this;
                    me._sandbox.printDebug("GETINFO HOVER " + 
                                           loc.lat + "," + 
                                           loc.lon);
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
                    content.push(
                        {
                            html: '', // no data to show, only to add button
                            actions : {
                                // TODO: localization
                                "Ok" : function() {
                                    me._closeGfiInfo();
                                }
                            }
                        }
                    );
                    // send out the request
                    var rn = "InfoBox.ShowInfoBoxRequest";
                    var rb = this._sandbox.getRequestBuilder(rn);
                    var r = rb("getinforesult", "GetInfo Result", 
                               content, lonlat, true);
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
                        var data = dataList[ii];
                        html = me._formatGfiDatum(data);
                        if (html != null) {
                            content.push({ html : html });
                        }
                    }
                    return content;
                },

                /**
                 * Formats a GFI datum
                 * 
                 * @param datum
                 */
                _formatGfiDatum : function(datum) {
                    if (!datum.presentationType) {
                        return null;
                    }
                    var html = '';
                    var contentType = (typeof datum.content);
                    var hasHtml = false;
                    if (contentType == 'string') {
                        hasHtml = (datum.content.indexOf('<html>') >= 0);
                        hasHtml = hasHtml ||
                            (datum.content.indexOf('<HTML>') >= 0);
                    }

                    if (datum.presentationType == 'JSON' ||
                        (datum.content && datum.content.parsed)) {
                        html = '<br/><table>';
                        var even = false;
                        var jsonData = datum.content.parsed;
                        for (attr in jsonData) {
                            var value = jsonData[attr];
                            if (value == null) {
                                continue;
                            }
                            if ((value.startsWith &&
                                 value.startsWith('http://')) ||
                                (value.indexOf &&
                                 value.indexOf('http://') == 0)) {
                            // if (value.startsWith('http://')) {
                            // if (value.indexOf('http://') == 0) {
                                value = '<a href="' + value + 
                                    '" target="_blank">' + value + 
                                    '</a>';
                            }
                            html = html + '<tr style="padding: 5px;';
                            if (!even) {
                                html = html + ' background-color: #EEEEEE';
                            }
                            even = !even;
                            html = html + '"><td style="padding: 2px">' + 
                                attr + '</td><td style="padding: 2px">' + 
                                value + '</td></tr>';
                        }
                        html = html + '</table>';        
                
//                  } else if ((datum.presentationType == 'TEXT') || hasHtml) {
                    } else {
                        html = '<div style="overflow:auto">' + 
                            datum.content + '</div>';
                    }
                    return html;
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
                        this.getMapModule().notifyAll(me._sandbox.getEventBuilder('FeaturesGetInfoEvent')(allHighlightedLayers[0], null, lonlat.lon, lonlat.lat, this._map.getProjection, "GetFeatureInfo"));

                    }
                },
                /**
                 * Flattens a GFI response
                 * 
                 * @param {Object} data
                 */
                _parseGfiResponse : function(resp) {
                    var data = resp.data;
                    var coll = [];
                    var lonlat = resp.lonlat;
                    var title = lonlat.lon + ", " + lonlat.lat;

                    var layerCount = resp.layerCount;
                    if (layerCount == 0 || 
                        data.length == 0 || 
                        !(data instanceof Array)) {
                        return;
                    }

                    for (var di = 0; di < data.length; di++) {
                        var datum = data[di];
                        var layerId = datum.layerId;
                        var type = datum.type;

                        if (type == "WFS_LAYER") {
                            var features = datum.features;
                            if (!(features && features.length)) {
                                continue;
                            }
                            for (var fi = 0; fi < features.length; fi++) {
                                var fea = features[fi];
                                var children = fea.children;
                                if (!(children && children.length)) {
                                    continue;
                                }
                                for (var ci = 0; ci < children.length; ci++) {
                                    var child = children[ci];
                                    var pnimi = child['pnr_PaikanNimi'];
                                    if (pnimi &&
                                        pnimi['pnr:kirjoitusasu']) {
			                title = pnimi['pnr:kirjoitusasu'];
		                    }
                                    // TODO: Generate pretty html
                                    // var pretty = JSON.stringify(child,
                                    //                             null,
                                    //                             4);
                                    // pretty = '<pre>' + pretty + '</pre>';
                                    var pretty = this._json2html(child);
                                    coll.push(pretty);
                                }
                            }
                        } else {
                            var pretty = this._formatGfiDatum(datum);
                            if (pretty != null) {
                                coll.push(pretty);
                            }
                        }
                    }
                    return { fragments : coll, 
                             title : title
                           };
                },
            
                _json2html : function(node) {
                    var me = this;
                    if (node == null) {
                        return '';
                    }
                    var even = true;
                    var html = '<table>';
                    for (var key in node) {
                        var value = node[key];
                        var vType = (typeof value).toLowerCase();
                        var vPres = ''
                        switch (vType) {
                        case 'string':
                            if (value.startsWith('http://')) {
                                valpres = 
                                    '<a href="' + value + 
                                    '" target="_blank">' + value + 
                                    '</a>';
                            } else {                                
                                valpres = value;
                            }
                            break;
                        case 'undefined':
                            valpres = 'n/a';
                            break;
                        case 'boolean':
                            valpres = (value ? 'true' : 'false');
                            break;
                        case 'number':
                            valpres = '' + number + '';
                            break;
                        case 'function':
                            valpres = '?';
                            break;
                        case 'object':
                            valpres = this._json2html(value);
                            break;
                        default:
                            valpres = '';
                        }
                        even = !even;
                        html += '<tr style="padding: 5px;';
                        if (even) {
                            html += '">';
                        } else {
                            html += ' background-color: #EEEEEE;">';
                        }
                        html += '' +
                            '<td style="padding: 2px;">' + key + '</td>';
                        html += '' + 
                            '<td style="padding: 2px;">' + valpres + '</td>';
                        html += '</tr>';
                    }
                    html += '</table>';
                    return html;
                },

                /**
                 * Shows multiple features in an infobox
                 * 
                 * @param {Array} data
                 */
                _showFeatures : function(data) {
                    var me = this;
                    var content = {};
                    content.html = '';
                    content.actions = {};
                    content.actions.ok = function() {
                        var rn = "InfoBox.HideInfoBoxRequest";
		        var rb = me._sandbox.getRequestBuilder(rn);
		        var r = rb(data.popupid);
		        me._sandbox.request(me, r);                 
                    };
                    
                    for (var di = 0; di < data.fragments.length; di++) {
                        content.html += data.fragments[di];
                        content.html += '<br /><hr /><br />';
                    }
		    var rn = "InfoBox.ShowInfoBoxRequest";
		    var rb = me._sandbox.getRequestBuilder(rn);
		    var r = rb(data.popupid, 
		               data.title, 
		               [ content ], 
		               data.lonlat, 
		               false);
                    me._sandbox.request(me, r);
                }
            },
            {
                'protocol' : [
                    "Oskari.mapframework.module.Module", 
                    "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
                ]
            });
