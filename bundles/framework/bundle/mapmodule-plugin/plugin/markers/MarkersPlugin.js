/**
 * @class Oskari.mapframework.mapmodule.MarkersPlugin
 * Provides marker functionality for the map.
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.MarkersPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (conf) {
        var me = this;
        this.conf = conf;
        this.mapModule = null;
        this.pluginName = null;
        this.dotForm = null;
        this._markers = [];
        this._sandbox = null;
        this._map = null;
        this._svg = false;
        this._defaultIconUrl = "/Oskari/resources/framework/bundle/mapmodule-plugin/images/marker.png";
        this._prevIconUrl = "";
        this._preSVGIconUrl ="data:image/svg+xml,";
        this._font = {
            name: 'dot-markers',
            baseIndex: 57344
        };
        this._defaultData = {
            x: 389000,
            y: 6667000,
            color: "ffde00",
            shape: 2,
            size: 3
        };
        this._localization = null;
        this.buttonGroup = "markers";
        this.buttons = {
            'add': {
                iconCls: 'selection-line', // to-do
                tooltip: 'lisää',
                sticky: true,
                callback: function () {
                    var loc = me.getMapModule().getLocalization('plugin', true)[me.__name].form;
                    me.dotForm = Oskari.clazz.create("Oskari.userinterface.component.visualization-form.DotForm", me, loc, me._defaultData);
                    var dialog = me.dotForm.getDialog();
                    if (dialog) {
                        dialog.close(true);
                    }
                    me.dotForm.showForm(jQuery("div.selection-line")[0],null,"right");
                    me.dotForm.setSaveHandler(function() {
                        var values = me.dotForm.getValues();
                        var reqBuilder = me._sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
                        if (reqBuilder) {
                            var data = {
                                x: 389000,  // Testing
                                y: 6667000,
                                msg: "Piste 1",
                                color: values.color,
                                shape: values.shape,
                                size: values.size
                            };
                            var request = reqBuilder(data);
                            me._sandbox.request(me.getName(), request);
                        }
                        me.dotForm.getDialog().close(true);
                    });
                }
            },
            'clear': {
                iconCls: 'selection-remove', // to-do
                tooltip: 'poista',
                sticky: true,
                callback: function () {
                    me.removeMarkers();
                }
            }
        };
        this.state = {
            markers: []
        };
        this._buttonsAdded = false;
    }, {
        /** @static @property __name plugin name */
        __name: 'MarkersPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },

        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
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
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this;
            this.requestHandlers = {
                addMarkerHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler', sandbox, me),
                removeMarkersHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequestHandler', sandbox, me)
            };
            return null;
        },

        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {

        },

        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Creates the base marker layer.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            this._sandbox = sandbox;

            this._map = this.getMapModule().getMap();
            this._createMapmarkerLayer();

            sandbox.register(this);
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
            this._sandbox.addRequestHandler('MapModulePlugin.AddMarkerRequest', me.requestHandlers.addMarkerHandler);
            this._sandbox.addRequestHandler('MapModulePlugin.RemoveMarkersRequest', me.requestHandlers.removeMarkersHandler);

            // Is SVG supported?
            this._svg = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');

            // Create default marker
            if (typeof Raphael !== "undefined") {
                var paper = Raphael(-100,-100,100,100);
                paper.clear();

                // Testing
                // var lines = paper.path("M0 0L99 99 M0 99 L99 0");
                // lines.attr("stroke", "#000");

                var font = paper.getFont(me._font.name);
                var charIndex = me.getFont().baseIndex+me._defaultData.shape;
                var size = 100;
                var color = "#"+me._defaultData.color;
                paper.print(0,55,String.fromCharCode(charIndex),font,size).attr({"stroke-width": 1, fill: color, "stroke": "#b4b4b4"});
                this._prevIconUrl = this._preSVGIconUrl+paper.toSVG();
            }
            this._registerTools();
            if ((typeof this.state === "undefined") || (this.state === null)) {
                this.state = {
                    markers: []
                }
            }
            this.setState(this.state);
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {

            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }
            sandbox.removeRequestHandler('MapModulePlugin.RemoveMarkersRequest', this.requestHandlers.removeMarkersHandler);
            sandbox.removeRequestHandler('MapModulePlugin.AddMarkerRequest', this.requestHandlers.addMarkerHandler);
            sandbox.unregisterStateful(this.mediator.bundleId);
            sandbox.unregister(this);
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
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterHideMapMarkerEvent': function (event) {
                this.afterHideMapMarkerEvent(event);
            },
            'Toolbar.ToolbarLoadedEvent': function (event) {
                this._registerTools();
            }
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

        /**
         *
         */
        _createMapmarkerLayer: function () {
            var me = this;
            var sandbox = this._sandbox,
                markerLayer = null;

            var state = me.getState();
            if ((typeof state.markerLayer !== "undefined")&&(state.markerLayer !== null)) {
                markerLayer = state.markerLayer;
            } else {
                markerLayer = new OpenLayers.Layer.Vector("OskariMarkers");
            }
            this._map.addLayer(markerLayer);
            this._map.setLayerIndex(markerLayer, 1000);
        },

        /***********************************************************
         * Handle HideMapMarkerEvent
         *
         * @param {Object}
         *            event
         */
        afterHideMapMarkerEvent: function (event) {
            var markerLayer = this._map.getLayersByName("OskariMarkers");
            if (markerLayer !== null && markerLayer !== undefined && markerLayer[0] !== null && markerLayer[0] !== undefined) {
                markerLayer[0].setVisibility(false);
            }
        },

        removeMarkers: function () {
            var me = this;
            var markerLayers = this._map.getLayersByName("OskariMarkers");
            if (markerLayers !== null && markerLayers !== undefined && markerLayers[0] !== null && markerLayers[0] !== undefined) {
                markerLayers[0].removeAllFeatures();
            }
            this._markers.length = 0;
        },

        getMapMarkerBounds: function () {
            var markerLayer = this._map.getLayersByName("OskariMarkers");
            if (markerLayer !== null && markerLayer !== undefined && markerLayer[0] !== null && markerLayer[0] !== undefined) {
                return markerLayer[0].getDataExtent();
            }
        },

        addMapMarker: function (data, id, events) {
            var me = this;
            if (!id) {
                id = this._markers.length + 1;
                id = "id" + id;
            }
//            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);

            // Image data already available
            var iconSrc = null;
            if (me._svg) {
                if ((typeof data.iconUrl !== "undefined")&&(data.iconUrl !== null)) {
                    iconSrc = data.iconUrl;
                } else {
                    // Construct image
                    if (typeof Raphael !== "undefined") {
                        var paper = Raphael(-100,-100,100,100);
                        paper.clear();

                        // Testing
                        // var lines = paper.path("M0 0L99 99 M0 99 L99 0");
                        // lines.attr("stroke", "#000");

                        var font = paper.getFont(me._font.name);
                        var charIndex = me.getFont().baseIndex+data.shape;
                        var size = 100;
                        var color = "#"+data.color;
                        paper.print(0,55,String.fromCharCode(charIndex),font,size).attr({"stroke-width": 1, fill: color, "stroke": "#b4b4b4"});
                        iconSrc = this._preSVGIconUrl+paper.toSVG();
                    }
                }
            } else {
                iconSrc = me._defaultIconUrl;
            }

            var markerLayers = this._map.getLayersByName("OskariMarkers"),
                point = new OpenLayers.Geometry.Point(data.x, data.y),
                marker = new OpenLayers.Feature.Vector(point,null,{
                    externalGraphic: iconSrc,
                    graphicWidth: 50+10*data.size,
                    graphicHeight: 50+10*data.size,
                    fillOpacity: 1,
                    label: data.msg,
                    fontColor: "${favColor}",
                    fontSize: "12px",
                    fontFamily: "Courier New, monospace",
                    fontWeight: "bold",
                    labelAlign: "c",
                    labelXOffset: 10+10*data.size,
                    labelYOffset: 10+10*data.size,
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3
                }),
                i;

            this._markers.push(data);

//            this._markers[id] = data;
            if (events) {
                for (i in events) {
                    if (events.hasOwnProperty(i)) {
                        marker.events.register(i, marker, events[i]);
                    }
                }
            }

            markerLayers[0].addFeatures([marker]);
            this.raiseMarkers(markerLayers[0]);

            // Save generated icon
            me._prevIconUrl = iconSrc;

        },

        // Make sure the marker layer is topmost
        raiseMarkers: function(markerLayer) {
            var layer = null;
            if (typeof markerLayer !== "undefined") {
                layer = markerLayer;
            } else {
                layer = this._map.getLayersByName("OskariMarkers")[0];
            }
            var index = Math.max(this._map.Z_INDEX_BASE.Feature, layer.getZIndex()) + 1;
            layer.setZIndex(index);
        },

        /**
         * Requests the tools to be added to the toolbar.
         *
         * @method registerTool
         */
        _registerTools: function() {
            var me = this;
            // Already registered?
            if (me._buttonsAdded) {
                return;
            }
            var loc = this.getLocalization();
            var sandbox = this.getSandbox();
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            if (typeof reqBuilder === "undefined") {
                return;
            }
            var request;
            var tool;
            for (tool in me.buttons) {
                if (me.buttons.hasOwnProperty(tool)) {
                    if (reqBuilder) {
                        request = reqBuilder(tool, me.buttonGroup, me.buttons[tool]);
                        sandbox.request(me.getName(), request);
                    }
                }
            }
            me._buttonsAdded = true;
        },

        /**
         * Convert hexadecimal color values to decimal values (255,255,255)
         * Green: hexToRgb("#0033ff").g
         * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
         *
         * @method hex
         * hexadecimal color value e.g. '#00ff99'
         */
        hexToRgb: function(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Convert rgb values to hexadecimal color values
         *
         * @method rgbToHex
         * @param {String} rgb decimal color values e.g. 'rgb(255,0,0)'
         */
        rgbToHex: function (rgb) {
            if (rgb.charAt(0) === '#') {
                return rgb.substring(1);
            }
            var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),
                j;
            delete (parts[0]);
            for (j = 1; j <= 3; ++j) {
                parts[j] = parseInt(parts[j], 10).toString(16);
                if (parts[j].length === 1) {
                    parts[j] = '0' + parts[j];
                }
            }
            return parts.join('');
        },

        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function(key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method getSandbox
         *
         * returns sandbox for binding to Oskari app functionality
         *
         */
        getSandbox : function() {
            return this._sandbox;
        },

        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            this.state = state;
            for (var i=0; i<this.state.markers.length; i++) {
                this.addMapMarker(this.state.markers[i]);
            }
        },
        /**
         * Returns markers parameter for map link if any markers on map
         * @return {String} link parameters
         */
        getStateParameters: function () {
            var state = this.getState();
            if(!state || !state.markers) {
                return "";
            }

            var FIELD_SEPARATOR = "|";
            var MARKER_SEPARATOR = "___";
            var markerParams = [];
            _.each(state.markers, function(marker) {
                var str = marker.shape + FIELD_SEPARATOR +
                        marker.size + FIELD_SEPARATOR +
                        marker.color + FIELD_SEPARATOR +
                        marker.x + "_" + marker.y + FIELD_SEPARATOR +
                        marker.msg;
                markerParams.push(str);
            });
            if(markerParams.length > 0) {
                 //markers=shape|size|hexcolor|x_y|User input text___shape|size|hexcolor|x_y|input 2";
                return "&markers=" + markerParams.join(MARKER_SEPARATOR);
            }
            return "";
        },
        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            this.state.markers = [];
            for (var i=0; i<this._markers.length; i++) {
                this.state.markers.push(this._markers[i]);
            }
            return this.state;
        },

        /**
         * @method getFont
         * @return {Object} font
         */
        getFont: function () {
            return this._font;
        },

        /**
         * @method getIcon
         * @return {Object} icon
         */
        getIcon: function () {
            return this._prevIconUrl;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });