/**
 * @class Oskari.mapframework.mapmodule.MarkersPlugin
 * Provides marker functionality for the map.
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.MarkersPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function(conf, state) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.mapmodule.MarkersPlugin';
        me._name = 'MarkersPlugin';

        me.state = state;
        me.dotForm = null;
        me._markers = {};
        me._unVisibleMarkers = {};
        me._markerFeatures = {};
        me._nextMarkerId = 0;
        me._svg = false;
        me._defaultIconUrlSize = 32;
        me._prevIconUrl = '';
        me._preSVGIconUrl = 'data:image/svg+xml;base64,';
        me._font = {
            name: 'dot-markers',
            baseIndex: 57344
        };
        me._defaultData = {
            x: 0,
            y: 0,
            color: 'ffde00',
            stroke: 'b4b4b4',
            msg: '',
            shape: 2,
            size: 1,
            transient: false
        };
        me._strokeStyle = {
            'stroke-width': 1,
            'stroke': '#b4b4b4'
        };
        me.buttonGroup = 'selectiontools';
        me.buttons = null;
        me.dialog = null;
        me._buttonsAdded = false;
        me._waitingUserClickToAddMarker = false;

        // Show the marker button
        me._showMarkerButton = true;
        if ((conf) && (typeof conf.markerButton === "boolean")) {
            me._showMarkerButton = conf.markerButton;
        }
        this.__layer = undefined;

    }, {
        getDefaultIconUrl : function() {
            return this.getImagePath() + 'marker.png';
        },
        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has an UI so always returns true
         */
        hasUI: function() {
            return true;
        },

        _createEventHandlers: function() {
            var me = this;

            return {
                MapClickedEvent: function(event) {
                    me.__mapClick(event);
                },
                'Toolbar.ToolbarLoadedEvent': function() {
                    me._registerTools();
                },
                AfterRearrangeSelectedMapLayerEvent: function() {
                    me.raiseMarkerLayer();
                }
            };
        },

        _createRequestHandlers: function() {
            var me = this,
                sandbox = me.getSandbox();

            return {
                'MapModulePlugin.AddMarkerRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequestHandler',
                    sandbox,
                    me
                ),
                'MapModulePlugin.RemoveMarkersRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequestHandler',
                    sandbox,
                    me
                ),
                'MapModulePlugin.MarkerVisibilityRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.MarkerVisibilityRequestHandler',
                    sandbox,
                    me
                )
            };
        },

        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function() {
            this.getMapModule().setLayerPlugin('markers', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function() {
            this.getMapModule().setLayerPlugin('markers', null);
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol.
         * Creates the base marker layer.
         */
        _startPluginImpl: function() {
            var me = this;

            this.__layer = me._createMapMarkerLayer();

            var loc = me.getLocalization();
            me.dialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup'
            );

            me.buttons = {
                'add': {
                    iconCls: 'marker-share',
                    tooltip: loc.buttons.add,
                    sticky: true,
                    callback: function() {
                        me.__toolButtonClicked();
                    }
                }
            };

            // Is SVG supported?
            me._svg = document.implementation.hasFeature(
                'http://www.w3.org/TR/SVG11/feature#Image',
                '1.1'
            );

            // Register marker tools
            me._registerTools();

            // Creates markers on the map
            me.setState(this.state);
        },
        /**
         * Handle toolbar tool click.
         * Activate the "add marker mode" on map.
         */
        __toolButtonClicked : function() {
            var me = this;
            me.enableGfi(false);
            me._waitingUserClickToAddMarker = true;
            var loc = me.getLocalization();
            var diaLoc = loc.dialog,
                controlButtons = [],
                clearBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'
                );

            clearBtn.setTitle(loc.buttons.clear);
            clearBtn.setHandler(function() {
                me.removeMarkers();
                me.stopMarkerAdd();
                me.enableGfi(true);
            });
            controlButtons.push(clearBtn);
            cancelBtn.setHandler(function() {
                me.stopMarkerAdd();
                me.enableGfi(true);
            });
            cancelBtn.setPrimary(true);
            controlButtons.push(cancelBtn);

            me.dialog.show(
                diaLoc.title,
                diaLoc.message,
                controlButtons
            );
            me.getMapModule().getMapEl().addClass(
                'cursor-crosshair'
            );
            me.dialog.moveTo(
                '#toolbar div.toolrow[tbgroup=default-selectiontools]',
                'bottom'
            );
        },

        /**
         * Creates a marker layer
         * @private
         */
        _createMapMarkerLayer: function() {
            var me = this,
                markerLayer = new ol.layer.Vector({title: 'Markers', source: new ol.source.Vector()});

            me.getMap().addLayer(markerLayer);
            me.raiseMarkerLayer(markerLayer);
            return markerLayer;
        },
        /**
         * Handles generic map click
         * @private
         * @param  {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event map click
         */
        __mapClick : function(event) {

            // adding a marker
            if(this._waitingUserClickToAddMarker) {
                this._showForm(event.getMouseX(), event.getMouseY());
                return;
            }
            var me = this;
            this.getMap().forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], function (feature, layer) {
                if(layer === me.getMarkersLayer()) {
                    me.__markerClicked(feature.get('id'));
                }
            });
        },
        /**
         * Called when a marker has been clicked.
         * @method  __markerClicked
         * @private
         * @param  {String} markerId which was clicked
         */
        __markerClicked: function(markerId) {
            var sandbox = this.getSandbox();
            var clickEvent = sandbox.getEventBuilder('MarkerClickEvent')(markerId);
            sandbox.notifyAll(clickEvent);
        },

        /**
         *
         * @returns {Function}
         */
        addMapLayerToMap: function() {
            var me = this;
            return function() {
                me.raiseMarkerLayer();
            };
        },
        getMarkersLayer: function() {
            // call _createMapMarkerLayer if not created yet?
            return this.__layer;
        },

        /**
         * Removes all markers from the layer
         * @param {Boolean} suppressEvent true to suppress from sending event
         * @param {String} optionalMarkerId marker id
         * @param {Boolean} notCleanUnvisibleMarkers true to not clean unvisibled markers
         */
        removeMarkers: function(suppressEvent, optionalMarkerId, notCleanUnvisibleMarkers) {
            var me = this,
                sandbox = me.getSandbox(),
                markerLayer = this.getMarkersLayer();
            if (!markerLayer) {
                sandbox.printWarn('Tried to remove markers, but lost the layer');
                return;
            }

            // remove all
            if (!optionalMarkerId) {
                // Openlayers
                markerLayer.getSource().clear();
                // internal data structure
                delete me._markers;
                me._markers = {};
                delete me._markerFeatures;
                me._markerFeatures = {};
                if(!notCleanUnvisibleMarkers) {
                    delete me._unVisibleMarkers;
                    me._unVisibleMarkers = {};
                }
            }
            // remove single marker
            else {
                var marker = me._markerFeatures[optionalMarkerId];
                if (!marker) {
                    sandbox.printWarn('Tried to remove non-existing marker with id: ' + optionalMarkerId);
                    return;
                }
                // Openlayers
                markerLayer.getSource().removeFeature(marker);
                // internal data structure
                me._markers[optionalMarkerId] = null;
                delete me._markers[optionalMarkerId];
                me._markerFeatures[optionalMarkerId] = null;
                delete me._markerFeatures[optionalMarkerId];
                if(!notCleanUnvisibleMarkers) {
                    me._unVisibleMarkers[optionalMarkerId] = null;
                    delete me._unVisibleMarkers[optionalMarkerId];
                }
            }


            if (!suppressEvent) {
                var removeEvent = sandbox.getEventBuilder(
                    'AfterRemoveMarkersEvent'
                )(optionalMarkerId);
                sandbox.notifyAll(removeEvent);
            }
        },

        /**
         * Gets marker bounds in the map
         * @returns {*}
         */
        getMapMarkerBounds: function() {
            var markerLayer = this.getMarkersLayer();
            if (markerLayer) {
                return markerLayer.getDataExtent();
            }
        },

        /**
         * Shows a configuration form for new marker visualization
         * @param e
         * @private
         */
        _showForm: function(clickX, clickY) {
            var me = this;
            // if we dont set false here the user can click map again and a new popup is opened on top of the existing one
            me._waitingUserClickToAddMarker = false;
            var lonlat = me._map.getCoordinateFromPixel([
                clickX,
                clickY
            ]);
            var loc = me.getLocalization().form;
            me.dotForm = Oskari.clazz.create(
                'Oskari.userinterface.component.visualization-form.DotForm',
                me,
                loc,
                me._defaultData
            );
            var dialog = me.dotForm.getDialog();
            if (dialog) {
                dialog.close(true);
            }
            me.dotForm.showForm(jQuery('div.selection-line')[0], {
                messageEnabled: true
            }, 'right');

            me.dotForm.setSaveHandler(function() {
                var values = me.dotForm.getValues(),
                    reqBuilder = me.getSandbox().getRequestBuilder(
                        'MapModulePlugin.AddMarkerRequest'
                    );

                if (reqBuilder) {
                    var data = {
                        x: lonlat[0],
                        y: lonlat[1],
                        msg: values.message,
                        color: values.color,
                        shape: values.shape,
                        size: values.size
                    };
                    var request = reqBuilder(data);
                    me.getSandbox().request(me.getName(), request);
                    me.stopMarkerAdd();
                }
                me.dotForm.getDialog().close(true);
                me.enableGfi(true);
            });

            me.dotForm.setCancelHandler(function() {
                // return to wait another click for a marker
                me.dotForm.getDialog().close();
                me._waitingUserClickToAddMarker = true;
            });
        },

        /**
         * Stops the marker location selector
         */
        stopMarkerAdd: function() {
            var me = this;
            var sandbox = this.getSandbox();
            me._waitingUserClickToAddMarker = false;
            if (me.dialog) {
                me.getMapModule().getMapEl().removeClass('cursor-crosshair');
                me.dialog.close(true);
            }

            // ask toolbar to select default tool if available
            var toolbarRequest = sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest');
            if(toolbarRequest) {
                sandbox.request(me, toolbarRequest());
            }
        },

        /**
         * Adds an array of markers to the map
         * @param markers
         */
        addMapMarkers: function(markers) {
            var i;
            for (i = 0; i < markers.length; i += 1) {
                this.addMapMarker(markers[i], null, true);
            }
        },

        __getSanitizedMarker: function(markerData, id) {
            // Validation: coordinates are needed
            if ((typeof markerData.x === 'undefined') || (typeof markerData.y === 'undefined')) {
                this.getSandbox().printWarn('Undefined coordinate in', markerData);
                return null;
            }

            // Combine default values with given values
            var data = jQuery.extend(true, _.cloneDeep(this._defaultData), markerData);

            // generate id if not provided
            data.id = id;
            if (!id) {
                data.id = 'M' + this._nextMarkerId++;
            }
            return data;
        },

        /**
         * Adds a marker to the map
         * @param {Object} markerData
         * @param {String} id
         * @param {Boolean} suppressEvent true to not send out an event about adding marker
         */
        addMapMarker: function(markerData, id, suppressEvent) {
            var me = this,
                size;

            // Combine default values with given values
            var data = this.__getSanitizedMarker(markerData, id);
            if (!data) {
                // validation failed
                this.getSandbox().printWarn('Error while adding marker');
                return;
            }

            // check for existing marker
            if (this._markers[data.id]) {
                // remove if found - will be replaced with new config
                // event is suppressed as this is "modify"
                this.removeMarkers(true, data.id);
            }

            // Check if marker is unvisible
            if(this._unVisibleMarkers[data.id]) {
                this._unVisibleMarkers[data.id] = null;
                delete this._unVisibleMarkers[data.id];
            }


            // Image data already available
            var iconSrc = null;
            if (me._svg) {
                if ((typeof data.iconUrl !== 'undefined') && (data.iconUrl !== null)) {
                    iconSrc = data.iconUrl;
                    if (jQuery.isNumeric(markerData.size)) {
                        size = data.size;
                    } else {
                        size = me._defaultIconUrlSize;
                    }
                } else {
                    // Construct image
                    //iconSrc = this.constructImage(data);
                    //size = this._getSizeInPixels(data.size);
                    size = data.size;
                }
            } else {
                iconSrc = me.getDefaultIconUrl();
                //size = this._getSizeInPixels(data.size);
                size = data.size;
            }
            if (typeof data.color === 'string') {
                if(data.color.charAt(0)!=='#') {
                    data.color = '#' + data.color;
                }
            } else {
                 data.color = me._defaultData.color;
            }
            if (typeof data.stroke === 'string') {
                 if(data.stroke.charAt(0)!=='#') {
                     data.stroke = '#' + data.stroke;
                 }
            } else {
                  data.stroke = me._defaultData.stroke;
            }
            var style = {
                image : {
                    color: data.color,
                    size: data.size,
                    shape: data.shape,
                    offsetX: data.offsetX,
                    offsetY: data.offsetY,
                    stroke: data.stroke
                },
                text : {
                    font: 'bold 16px Arial',
                    textAlign: 'left',
                    textBaseline: 'middle',
                    offsetX: 8 + 2 * data.size,
                    offsetY: 8,
                    fill : {
                        color : '#000000'
                    },
                    stroke : {
                    	color: '#ffffff',
                    	width: 1
                    }
                }
            };
            if(data.msg) {
                try {
                    style.text.labelText = decodeURIComponent(data.msg);
                } catch(e) {
                    // For some reason this is called when getting stateparameters.
                    // Message is not urlencoded at that point and % causes error to be thrown
                    style.text.labelText = data.msg;
                }
            }
            var markerLayer = this.getMarkersLayer();
            var markerStyle = this.getMapModule().getStyle(style);
            var newMarker = new ol.Feature({id: data.id, geometry: new ol.geom.Point([data.x, data.y])});

            this._markerFeatures[data.id] = newMarker;
            this._markers[data.id] = data;
            newMarker.setStyle(markerStyle);

            markerLayer.getSource().addFeature(newMarker);
            this.raiseMarkerLayer(markerLayer);

            // Save generated icon
            me._prevIconUrl = iconSrc;

            // Update the state
            me.updateState();

            if (!suppressEvent) {
                var addEvent = me.getSandbox().getEventBuilder(
                    'AfterAddMarkerEvent'
                )(data, data.id);
                me.getSandbox().notifyAll(addEvent);
            }
        },

        /**
         * Change map marker visibility.
         * @method  @public changeMapMarkerVisibility
         * @param  {Boolean} visible  visibility is marker visible or not. True if show marker, else false.
         * @param  {String} markerId  optional marker id for marker to change it's visibility, all markers visibility changed if not given. If a marker with same id
         *                  exists, it will be changed visibility.
         */
        changeMapMarkerVisibility: function(visible, markerId){
            // Check hiding for wanted marker
            if(!visible && markerId) {
                if (this._markers[markerId]) {
                    this._unVisibleMarkers[markerId] = _.cloneDeep(this._markers[markerId]);
                    // remove if found
                    // event is suppressed as this is "modify"
                    this.removeMarkers(true, markerId, true);
                    delete this._markers[markerId];
                }
            }
            // Check hiding for all markers
            else if(!visible) {
                for(var key in this._markers) {
                    this._unVisibleMarkers[key] = _.cloneDeep(this._markers[key]);
                    // remove if found
                    // event is suppressed as this is "modify"
                    this.removeMarkers(true, key, true);
                    delete this._markers[key];
                }
            }
            // Check showing for wanted marker
            else if(visible && markerId){
                if (this._unVisibleMarkers[markerId]) {
                    this._markers[markerId] = _.cloneDeep(this._unVisibleMarkers[markerId]);
                    // remove if found
                    // event is suppressed as this is "modify"
                    this.addMapMarker(this._markers[markerId], markerId, true);
                    delete this._unVisibleMarkers[markerId];
                }
            }
            // Check showing for all markers
            else if(visible){
                for(var key in this._unVisibleMarkers) {
                    this._markers[key] = _.cloneDeep(this._unVisibleMarkers[key]);
                    // remove if found
                    // event is suppressed as this is "modify"
                    this.addMapMarker(this._markers[key], key, true);
                    delete this._unVisibleMarkers[key];
                }
            }
        },

        /**
         * Constructs a marker image dynamically
         * @param marker
         * @returns {*}
         */
        constructImage: function(marker) {
            var me = this,
                iconSrc = me.getDefaultIconUrl();

            return iconSrc;
        },

        /**
         * Converts from abstract marker size to real pixel size
         *
         * @param size Abstract size
         * @returns {number} Size in pixels
         * @private
         */
         //--> method moved to AbstractMapModule.js
        /*_getSizeInPixels: function(size) {
            return 40 + 10 * size;
        },*/

        /**
         * Raises the marker layer above the other layers
         *
         * @param markerLayer
         */
        raiseMarkerLayer: function(layer) {
            if (!layer) {
                layer = this.getMarkersLayer();
            }
            this.getMapModule().bringToTop(layer);
        },

        /**
         * Requests the tools to be added to the toolbar.
         *
         * @method registerTool
         */
        _registerTools: function() {
            var me = this,
                request,
                tool,
                sandbox = this.getSandbox();

            // Is button available or already added the button?
            if (!me._showMarkerButton || me._buttonsAdded) {
                return;
            }

            if (!sandbox.hasHandler('Toolbar.AddToolButtonRequest')) {
                // Couldn't get the request, toolbar not loaded
                return;
            }
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');

            for (tool in me.buttons) {
                if (me.buttons.hasOwnProperty(tool)) {
                    request = reqBuilder(
                        tool,
                        me.buttonGroup,
                        me.buttons[tool]
                    );
                    sandbox.request(me.getName(), request);
                }
            }
            me._buttonsAdded = true;
        },

        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGfi: function(blnEnable) {
            var sandbox = this.getSandbox(),
                evtB = sandbox.getEventBuilder(
                    'DrawFilterPlugin.SelectedDrawingEvent'
                ),
                gfiReqBuilder = sandbox.getRequestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest'
                ),
                hiReqBuilder = sandbox.getRequestBuilder(
                    'WfsLayerPlugin.ActivateHighlightRequest'
                );

            // notify components to reset any saved "selected place" data
            if (evtB) {
                sandbox.notifyAll(evtB());
            }

            // enable or disable gfi requests
            if (gfiReqBuilder) {
                sandbox.request(this.getName(), gfiReqBuilder(blnEnable));
            }

            // enable or disable wfs highlight
            if (hiReqBuilder) {
                sandbox.request(this.getName(), hiReqBuilder(blnEnable));
            }
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
            if (key) {
                return this._loc[key];
            }
            return this._loc;
        },

        /**
         * @method setState
         * Set the bundle state
         * @param {Object} state bundle state as JSON
         */
        setState: function(state) {
            this.state = state;
            // remove markers without sending an AfterRemoveMarkersEvent
            this.removeMarkers(true);
            if (this.state && this.state.markers) {
                this.addMapMarkers(this.state.markers);
            }
        },
        /**
         * Returns markers parameter for map link if any markers on map:
         * "&markers=shape|size|hexcolor|x_y|User input text___shape|size|hexcolor|x_y|input 2"
         * @return {String} link parameters
         */
        getStateParameters: function() {
            var state = this.getState();
            if (!state || !state.markers) {
                return '';
            }

            var FIELD_SEPARATOR = '|',
                MARKER_SEPARATOR = '___',
                markerParams = [];
            _.each(state.markers, function(marker) {
                var str = marker.shape + FIELD_SEPARATOR +
                    marker.size + FIELD_SEPARATOR;
                    if(marker.color.indexOf('#') === 0) {
                        str = str + marker.color.substring(1);
                    } else {
                        str = str + marker.color;
                    }
                    str = str  + FIELD_SEPARATOR +
                    marker.x + '_' + marker.y + FIELD_SEPARATOR +
                    encodeURIComponent(marker.msg);
                markerParams.push(str);
            });
            if (markerParams.length > 0) {
                return '&markers=' + markerParams.join(MARKER_SEPARATOR);
            }
            return '';
        },
        /**
         * @method getState
         * Returns the bundle state
         * @return {Object} bundle state as JSON
         */
        getState: function() {
            this.updateState();
            return jQuery.extend({}, this.state);
        },

        /**
         *  Updates the bundle state.
         */
        updateState: function() {
            var me = this;

            if ((typeof me.state === 'undefined') || (me.state === null)) {
                me.state = {};
            }
            me.state.markers = [];
            _.each(me._markers, function(marker) {
                if(!marker.transient) {
                    me.state.markers.push(marker);
                }
            });
        },

        /**
         * @method getFont
         * Returns a marker shape font
         * @return {Object} font
         */
        getFont: function() {
            return this._font;
        },

        /**
         * @method getIcon
         * Return a marker icon
         * @return {Object} icon
         */
        getIcon: function() {
            return this._prevIconUrl;
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @return null
         */
        getOLMapLayers: function() {
            // TODO: Should return the markers layer?
            return null;
        }

    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);