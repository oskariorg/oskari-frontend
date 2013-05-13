/**
 * @class Oskari.mapframework.mapmodule.GetInfoPlugin
 *
 * Listens to map clicks and requests server for information about the map
 * location for all
 * the layers that have the flag queryable set to true and layer scales matching
 * the current zoom level.
 * Handles MapModulePlugin.GetFeatureInfoRequest and
 * MapModulePlugin.GetFeatureInfoActivationRequest.
 *
 * See
 * http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginGetInfoPlugin
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.GetInfoPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.config = config;
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.enabled = true;
    this.infoboxId = 'getinforesult';
    this._pendingAjaxQuery = {
        busy : false,
        jqhr : null,
        timestamp : null
    };
}, {
	
	templates : {
        table : jQuery('<table class="getinforesult_table"></table>'),
        tableRow : jQuery('<tr></tr>'),
        tableCell : jQuery('<td></td>'),

        header : jQuery('<div class="getinforesult_header">' +
                '<div class="icon-bubble-left"></div>'),
        headerTitle : jQuery('<div class="getinforesult_header_title"></div>')
	},

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
        if (mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method hasUI
     * This plugin has an UI so always returns true
     * @return {Boolean} true
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

        me._sandbox = sandbox;
        me._sandbox.printDebug("[GetInfoPlugin] init");
        me.getGFIHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler', me);
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
        var me = this;
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        this._map = this.getMapModule().getMap();

        this._sandbox.register(this);
        for (p in this.eventHandlers ) {
            this._sandbox.registerForEventByName(this, p);
        }
        this._sandbox.addRequestHandler('MapModulePlugin.GetFeatureInfoRequest', this.getGFIHandler);
        this._sandbox.addRequestHandler('MapModulePlugin.GetFeatureInfoActivationRequest', this.getGFIHandler);
    },
    /**
     * @method stopPlugin
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
        this._sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
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
     * @method setEnabled
     * Enables or disables gfi functionality
     * @param {Boolean} blnEnabled
     *          true to enable, false to disable
     */
    setEnabled : function(blnEnabled) {
        this.enabled = (blnEnabled === true);
        // close existing if disabled
        if (!this.enabled) {
            this._closeGfiInfo();
        }
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'EscPressedEvent' : function(evt) {
            this._closeGfiInfo();
        },
        'MapClickedEvent' : function(evt) {
            if (!this.enabled) {
                // disabled, do nothing
                return;
            }
            var lonlat = evt.getLonLat();
            var x = evt.getMouseX();
            var y = evt.getMouseY();
            this.handleGetInfo(lonlat, x, y);
        },
        'AfterMapMoveEvent' : function(evt) {
            this._cancelAjaxRequest();
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

    /**
     * @method _cancelAjaxRequest
     * @private
     * Cancels any GetInfo ajax request that might be executing.
     */
    _cancelAjaxRequest : function() {
        var me = this;
        if (!me._pendingAjaxQuery.busy) {
            return;
        }
        var jqhr = me._pendingAjaxQuery.jqhr;
        me._pendingAjaxQuery.jqhr = null;
        if (!jqhr) {
            return;
        }
        this._sandbox.printDebug("[GetInfoPlugin] Abort jqhr ajax request");
        jqhr.abort();
        jqhr = null;
        me._pendingAjaxQuery.busy = false;
    },

    /**
     * @method _buildLayerIdList
     * @private
     * Constructs a layer list for valid layers for info queries
     * @return
     * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    _buildLayerIdList : function() {
        var me = this;
        var selected = me._sandbox.findAllSelectedMapLayers();
        var layerIds = null;

        var mapScale = me._sandbox.getMap().getScale();

        for (var i = 0; i < selected.length; i++) {
            var layer = selected[i]

            if (!layer.getQueryable || !layer.getQueryable()) {
                continue;
            }

            if (!layer.isInScale(mapScale)) {
                continue;
            }
            if (!layer.isVisible()) {
                continue;
            }

            if (!layerIds) {
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
     * @method _startAjaxRequest
     * @private
     * Sets internal flags to show that an ajax request is executing currently.
     * @param {Number} dteMs current time in milliseconds
     */
    _startAjaxRequest : function(dteMs) {
        var me = this;
        me._pendingAjaxQuery.busy = true;
        me._pendingAjaxQuery.timestamp = dteMs;

    },
    /**
     * @method _finishAjaxRequest
     * @private
     * Clears internal flags of executing ajax requests so we are clear to start
     * another.
     */
    _finishAjaxRequest : function() {
        var me = this;
        me._pendingAjaxQuery.busy = false;
        me._pendingAjaxQuery.jqhr = null;
        this._sandbox.printDebug("[GetInfoPlugin] finished jqhr ajax request");
    },
    /**
     * @method _notifyAjaxFailure
     * @private
     * Prints debug about ajax call failure.
     */
    _notifyAjaxFailure : function() {
        var me = this;
        me._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo AJAX failed");
    },

    /**
     * @method _isAjaxRequestBusy
     * @private
     * Checks internal flags if and ajax requests is currently executing.
     * @return {Boolean} true if an ajax request is executing currently
     */
    _isAjaxRequestBusy : function() {
        var me = this;
        return me._pendingAjaxQuery.busy;
    },

    /**
     * @method handleGetInfo
     * Send ajax request to get feature info for given location for any
     * visible/valid/queryable layers.
     * Backend processes given layer (ids) as WMS GetFeatureInfo or WFS requests
     * (or in the future WMTS GetFeatureInfo). Aborts any pending ajax query.
     *
     * @param {OpenLayers.LonLat}
     *            lonlat coordinates
     * @param {Number}
     *            x mouseclick on map x coordinate (in pixels)
     * @param {Number}
     *            y mouseclick on map y coordinate (in pixels)
     */
    handleGetInfo : function(lonlat, x, y) {
        var me = this;

        var dte = new Date();
        var dteMs = dte.getTime();

        if (me._pendingAjaxQuery.busy && me._pendingAjaxQuery.timestamp && dteMs - me._pendingAjaxQuery.timestamp < 500) {
            me._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo NOT SENT (time difference < 500ms)");
            return;
        }

        me._cancelAjaxRequest();

        var layerIds = me._buildLayerIdList();

        // let's not start anything we cant' resolve
        if (!layerIds) {
            me._sandbox.printDebug("[GetInfoPlugin] NO layers with featureInfoEnabled, in scale and visible");
            return;
        }

        me._startAjaxRequest(dteMs);

        var ajaxUrl = this._sandbox.getAjaxUrl();

        var lon = lonlat.lon;
        var lat = lonlat.lat;

        var mapVO = me._sandbox.getMap();

        jQuery.ajax({
            beforeSend : function(x) {
                me._pendingAjaxQuery.jqhr = x;
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(resp) {
                if (resp.data && resp.data instanceof Array) {
                    resp.lonlat = lonlat;
                    var parsed = me._parseGfiResponse(resp);
                    if (!parsed) {
                        return;
                    }
                    parsed.popupid = me.infoboxId;
                    parsed.lonlat = lonlat;

                    if (!me._isAjaxRequestBusy()) {
                        return;
                    }

                    me._showFeatures(parsed);

                }

                me._finishAjaxRequest();
            },
            error : function() {
                me._finishAjaxRequest();
                me._notifyAjaxFailure();
            },
            always : function() {
                me._finishAjaxRequest();
            },
            complete : function() {
                me._finishAjaxRequest();
            },
            data : {
                layerIds : layerIds,
                projection : me.mapModule.getProjection(),
                x : x,
                y : y,
                lon : lon,
                lat : lat,
                width : mapVO.getWidth(),
                height : mapVO.getHeight(),
                bbox : mapVO.getBbox().toBBOX(),
                zoom : mapVO.getZoom(),
                srs : mapVO.getSrsName()
            },
            type : 'POST',
            dataType : 'json',
            url : ajaxUrl + 'action_route=GetFeatureInfoWMS'
        });
    },
    /**
     * @method _closeGfiInfo
     * @private
     * Closes the infobox with GFI data
     */
    _closeGfiInfo : function() {
        var rn = "InfoBox.HideInfoBoxRequest";
        var rb = this._sandbox.getRequestBuilder(rn);
        var r = rb(this.infoboxId);
        this._sandbox.request(this, r);
    },
    /**
     * @method _showGfiInfo
     * @private
     * Shows given content in given location using infobox bundle
     * @param {Object[]} content infobox content array
     * @param {OpenLayers.LonLat} lonlat location for the GFI data
     */
    _showGfiInfo : function(content, lonlat) {
        var me = this;
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
        if (!response || !response.data) {
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
            var html = me._formatGfiDatum(data);
            if (html != null) {
                content.push({
                    html : html
                });
            }
        }
        return content;
    },

    /**
     * @method _parseGfiResponse
     * @private
     * Parses and formats a GFI response
     * @param {Object} resp response data to format
     * @return {Object} object { fragments: coll, title: title } where
     *  fragments is an array of JSON { markup: '<html-markup>', layerName:
     * 'nameforlayer', layerId: idforlayer }
     */
    _parseGfiResponse : function(resp) {
        var sandbox = this._sandbox;
        var data = resp.data;
        var coll = [];
        var lonlat = resp.lonlat;
        var title = lonlat.lon + ", " + lonlat.lat;

        var layerCount = resp.layerCount;
        if (layerCount == 0 || data.length == 0 || !( data instanceof Array)) {
            return;
        }

        for (var di = 0; di < data.length; di++) {
            var datum = data[di];
            var layerId = datum.layerId;
            var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
            var layerName = layer ? layer.getName() : '';
            var type = datum.type;

            if (type == "wfslayer") {
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
                        if (pnimi && pnimi['pnr:kirjoitusasu']) {
                            title = pnimi['pnr:kirjoitusasu'];
                        }
                        var pretty = this._json2html(child);
                        coll.push({
                            markup : pretty,
                            layerId : layerId,
                            layerName : layerName,
                            type : type
                        });
                    }
                }
            } else {
                var pretty = this._formatGfiDatum(datum);
                if (pretty != null) {
                    coll.push({
                        markup : pretty,
                        layerId : layerId,
                        layerName : layerName,
                        type : type
                    });
                }
            }
        }

        return {
            fragments : coll,
            title : title
        };
    },

    /**
     * @method _formatJSONValue
     * @private
     * Formats a GFI response value to a jQuery object
     * @param {pValue} datum response data to format
     * @return {jQuery} formatted HMTL
     */
    _formatJSONValue : function(pValue) {
        if (!pValue) {
            return;
        }
        var value = jQuery('<span></span>');
        // if value is an array -> format it first
        // TODO: maybe some nicer formatting?
        if (Object.prototype.toString.call(pValue) === '[object Array]') {
            var placeHolder = '';
            for (var i = 0; i < pValue.length; ++i) {
                var obj = pValue[i];
                for (objAttr in obj) {
                    var innerValue = this._formatJSONValue(obj[objAttr]);
                    if (!innerValue) {
                        continue;
                    }
                    value.append(objAttr);
                    value.append(": ");
                    value.append(innerValue);
                    value.append('<br/>');
                }
            }
        }
        else if (pValue.indexOf && pValue.indexOf('://') > 0 && pValue.indexOf('://') < 7) {
            var label = value;
            var link = jQuery('<a target="_blank"></a>');
            link.attr('href', pValue);
            link.append(pValue);
            value.append(link);
        }
        else {
            value.append(pValue);
        }
        return value;
    },
    /**
     * @method _formatGfiDatum
     * @private
     * Formats a GFI HTML or JSON object to result HTML
     * @param {Object} datum response data to format
     * @return {jQuery} formatted HMTL
     */
    _formatGfiDatum : function(datum) {
        if (!datum.presentationType) {
            return null;
        }
		
		var me = this;

        var response = jQuery('<div></div>');
        var html = '';
        var contentType = ( typeof datum.content);
        var hasHtml = false;
        if (contentType == 'string') {
            hasHtml = (datum.content.indexOf('<html>') >= 0);
            hasHtml = hasHtml || (datum.content.indexOf('<HTML>') >= 0);
        }
        if (datum.presentationType == 'JSON' || (datum.content && datum.content.parsed)) {
            var even = false;
            var rawJsonData = datum.content.parsed;
            var dataArray = [];
        	if (Object.prototype.toString.call(rawJsonData) === '[object Array]') {
        		dataArray = rawJsonData;
        	}
        	else {
        		dataArray.push(rawJsonData);
        	}
        	for(var i=0; i < dataArray.length; ++i) {
        		var jsonData = dataArray[i];
	            var table = me.templates.table.clone();
	            for (var attr in jsonData) {
	                var value = me._formatJSONValue(jsonData[attr]);
	                if (!value) {
	                    continue;
	                }
	                var row = me.templates.tableRow.clone();
	                table.append(row);
	                if (!even) {
						row.addClass("odd");
	                }
	                even = !even;

	                var labelCell = me.templates.tableCell.clone();
	                labelCell.append(attr);
	                row.append(labelCell);
	                var valueCell = me.templates.tableCell.clone();
	                valueCell.append(value);
	                row.append(valueCell);
	            }
	            response.append(table);
        	}
            return response;
        } else {
            response.append(datum.content);
            return response;
        }
        return html;
    },

    /**
     * @method _json2html
     * @private
     * Parses and formats a WFS layers JSON GFI response
     * @param {Object} node response data to format
     * @param {String} layerName name of the layer for this data
     * @return {String} formatted HMTL
     */
    _json2html : function(node, layerName) {
		// TODO use template elements
        var me = this;
        if (node == null) {
            return '';
        }
        var even = true;
        var html = '<table class="getinforesult_table">';
        for (var key in node) {
            var value = node[key];
            var vType = ( typeof value).toLowerCase();
            var vPres = ''
            switch (vType) {
                case 'string':
                    if (value.indexOf('http://') == 0) {
                        valpres = '<a href="' + value + '" target="_blank">' + value + '</a>';
                    } else {
                        valpres = value;
                    }
                    break;
                case 'undefined':
                    valpres = 'n/a';
                    break;
                case 'boolean':
                    valpres = ( value ? 'true' : 'false');
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
            html += '<tr';
            if (even) {
                html += '>';
            } else {
                html += ' class="odd">';
            }
            html += '' + '<td>' + key + '</td>';
            html += '' + '<td>' + valpres + '</td>';
            html += '</tr>';
        }
        html += '</table>';
        return html;
    },

    /**
     * @method _showFeatures
     * Shows multiple features in an infobox.
     * Parameter data is in format:
     *
     *  { fragments: coll, title: title }
     * fragments is an array of JSON { markup: '<html-markup>', layerName:
     * 'nameforlayer', layerId: idforlayer }
     *
     * @param {Array} data
     */
    _showFeatures : function(data) {
        var me = this;
        var content = {};
        var wrapper = jQuery('<div></div>');
        content.html = '';
        content.actions = {};
        for (var di = 0; di < data.fragments.length; di++) {
            var fragment = data.fragments[di]
            var fragmentTitle = fragment.layerName;
            var fragmentMarkup = fragment.markup;

            var contentWrapper = jQuery('<div></div>');

            var headerWrapper = me.templates.header.clone();
            var titleWrapper = me.templates.headerTitle.clone();
            titleWrapper.append(fragmentTitle);
			titleWrapper.attr('title', fragmentTitle);
            headerWrapper.append(titleWrapper);
            contentWrapper.append(headerWrapper);


            if (fragmentMarkup) {
                contentWrapper.append(fragmentMarkup);
            }
            wrapper.append(contentWrapper);
        }
        content.html = wrapper;

        var pluginLoc = this.getMapModule().getLocalization('plugin', true);
        var myLoc = pluginLoc[this.__name];
        data.title = myLoc.title;

        if(!this.config || this.config.infoBox) {
            var rb = me._sandbox.getRequestBuilder("InfoBox.ShowInfoBoxRequest");
            var r = rb(data.popupid, data.title, [content], data.lonlat, true);
            me._sandbox.request(me, r);
        }

        var event = me._sandbox.getEventBuilder("GetInfoResultEvent")(data);
        me._sandbox.notifyAll(event);
    }
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
