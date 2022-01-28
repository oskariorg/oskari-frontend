import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olFeature from 'ol/Feature';
import * as olGeom from 'ol/geom';

import '../../request/AddMarkerRequest';
import '../../request/AddMarkerRequestHandler';
import '../../request/RemoveMarkersRequest';
import '../../request/RemoveMarkersRequestHandler';
import '../../request/MarkerVisibilityRequest';
import '../../request/MarkerVisibilityRequestHandler';

import '../../event/AfterAddMarkerEvent';
import '../../event/MarkerClickEvent';
import '../../event/AfterRemoveMarkersEvent';
import { showAddMarkerPopup } from './MarkersForm';
import { ID_PREFIX, PLUGIN_NAME, TOOL_GROUP, DEFAULT_STYLE, STYLE_TYPE } from './constants';

/**
 * @class Oskari.mapframework.mapmodule.MarkersPlugin
 * Provides marker functionality for the map.
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.MarkersPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._clazz =
            'Oskari.mapframework.mapmodule.MarkersPlugin';
        this._name = PLUGIN_NAME;

        this._markers = {}; // hidden markers aren't added to layer

        this.buttons = null;
        this.dialog = null;
        this._buttonsAdded = false;
        this._showAddMarkerPopupOnMapClick = false;

        // Show the marker button
        this._layer = undefined;
        this.log = Oskari.log(PLUGIN_NAME);
        this.popupControls = null;
        this.popupCleanup = () => {
            if (this.popupControls) {
                this.popupControls.close();
                this._showAddMarkerPopupOnMapClick = true;
            }
            this.popupControls = null;
        };
    }, {

        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has an UI so always returns true
         */
        hasUI: function () {
            return true;
        },

        _createEventHandlers: function () {
            return {
                MapClickedEvent: event => this._mapClick(event),
                'Toolbar.ToolbarLoadedEvent': () => this._registerTools(),
                AfterRearrangeSelectedMapLayerEvent: () => this.raiseMarkerLayer(),
                'Toolbar.ToolSelectedEvent': event => {
                    if (event.getToolId() !== 'addMarker' && event.getSticky()) {
                        this.stopMarkerAdd(false);
                    }
                }
            };
        },

        _createRequestHandlers: function () {
            var me = this;
            var sandbox = me.getSandbox();
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
        register: function () {
            this.getMapModule().setLayerPlugin('markers', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('markers', null);
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol.
         * Creates the base marker layer.
         */
        _startPluginImpl: function () {
            this.dialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup'
            );
            this.buttons = {
                addMarker: {
                    iconCls: 'marker-share',
                    tooltip: this.getMsg('buttons.add'),
                    sticky: true,
                    callback: () => this.startMarkerAdd()
                }
            };
            // Register marker tools
            this._registerTools();
        },
        getMarker: function (id) {
            const marker = this._markers[id];
            if (!marker) {
                this.log.warn(`Couldn't find marker with id: ${id}`);
            }
            return marker;
        },
        /**
         * Creates a marker layer
         * @private
         */
        _createMapMarkerLayer: function () {
            const markerLayer = new olLayerVector({ title: 'Markers', source: new olSourceVector() });
            this.getMap().addLayer(markerLayer);
            return markerLayer;
        },
        /**
         * Handles generic map click
         * @private
         * @param  {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event map click
         */
        _mapClick: function (event) {
            // adding a marker
            const { lon, lat } = event.getLonLat();
            const coord = [lon, lat];
            if (this._showAddMarkerPopupOnMapClick) {
                this._showAddMarkerPopupOnMapClick = false;
                const onAdd = values => {
                    this.popupCleanup();
                    this._addMarkerFromPopup(values, coord);
                };
                this.popupControls = showAddMarkerPopup(onAdd, this.popupCleanup);
                return;
            }
            if (!Object.keys(this._markers).length) {
                return;
            }
            this.getMarkersLayer().getSource().getFeaturesAtCoordinate(coord).forEach(feat => this._markerClicked(feat.getId()));
        },
        _addMarkerFromPopup: function (values, coord) {
            const reqBuilder = Oskari.requestBuilder('MapModulePlugin.AddMarkerRequest');
            if (!reqBuilder) {
                this.log.error('MapModulePlugin.AddMarkerRequest is not available');
                return;
            }
            const { msg, style } = values;
            const { image } = style;
            // map style values to marker data
            const { fill, shape, size } = image;
            const data = {
                x: coord[0],
                y: coord[1],
                msg,
                color: fill.color,
                shape,
                size
            };
            this.getSandbox().request(this.getName(), reqBuilder(data));
        },
        /**
         * Called when a marker has been clicked.
         * @method  _markerClicked
         * @private
         * @param  {String} markerId which was clicked
         */
        _markerClicked: function (markerId) {
            const clickEvent = Oskari.eventBuilder('MarkerClickEvent')(markerId);
            this.getSandbox().notifyAll(clickEvent);
        },

        /**
         *
         * @returns {Function}
         */
        addMapLayerToMap: function () {
            return () => this.raiseMarkerLayer();
        },
        getMarkersLayer: function () {
            if (!this._layer) {
                this._layer = this._createMapMarkerLayer();
            }
            return this._layer;
        },

        /**
         * Removes all markers from the layer
         * @param {Boolean} suppressEvent true to suppress from sending event
         * @param {String} markerId marker id
         * @param {Boolean} skipHidden true to not clean unvisibled markers
         */
        removeMarkers: function (markerId, suppressEvent, skipHidden) {
            const layerSource = this.getMarkersLayer().getSource();
            // remove all
            if (!markerId) {
                // Openlayers (doesn't have hidden markers)
                layerSource.clear();
                // internal data structure
                if (skipHidden) {
                    Object.keys(this._markers).forEach(id => {
                        if (this._markers[id].hidden) {
                            return;
                        }
                        delete this._markers[id];
                    });
                } else {
                    this._markers = {};
                }
            } else {
                // layer doesn't have hidden markers
                const { hidden } = this.getMarker(markerId);
                if (!hidden) {
                    const feature = layerSource.getFeatureById(markerId);
                    layerSource.removeFeature(feature);
                }
                // internal data structure
                delete this._markers[markerId];
            }

            if (!suppressEvent) {
                var removeEvent = Oskari.eventBuilder(
                    'AfterRemoveMarkersEvent'
                )(markerId);
                this.getSandbox().notifyAll(removeEvent);
            }
        },

        /**
         * Gets marker bounds in the map
         * @returns {*}
         */
        getMapMarkerBounds: function () {
            return this.getMarkersLayer().getSource().getExtent();
        },

        /**
         * Activate the "add marker mode" on map.
         */
        startMarkerAdd: function () {
            this.enableGfi(false);
            this._showAddMarkerPopupOnMapClick = true;
            const clearBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            const closeBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CloseButton');

            clearBtn.setTitle(this.getMsg('dialog.clear'));
            clearBtn.setHandler(() => this.removeMarkers());
            closeBtn.setHandler(() => this.stopMarkerAdd(true));
            closeBtn.setPrimary(true);

            this.dialog.show(
                this.getMsg('title'),
                this.getMsg('dialog.message'),
                [clearBtn, closeBtn]
            );
            this.getMapModule().getMapEl().addClass(
                'cursor-crosshair'
            );
            this.dialog.moveTo(
                '#toolbar div.toolrow[tbgroup=default-selectiontools]',
                'bottom'
            );
        },
        /**
         * Stops the marker location selector
         */
        stopMarkerAdd: function (selectDefault) {
            this.enableGfi(true);
            this._showAddMarkerPopupOnMapClick = false;
            if (this.dialog) {
                this.dialog.close(true);
            }
            this.getMapModule().getMapEl().removeClass('cursor-crosshair');
            if (!selectDefault) {
                return;
            }
            // ask toolbar to select default tool if available
            const toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            if (toolbarRequest) {
                this.getSandbox().request(this, toolbarRequest());
            }
        },
        _getSanitizedMarker: function (markerData, markerId) {
            const { x, y } = markerData;
            // Validation: coordinates are needed
            if ((typeof x === 'undefined') || (typeof y === 'undefined')) {
                this.log.warn('Undefined coordinate in', markerData);
                return null;
            }
            // Remove null values to get defaults
            Object.keys(markerData).forEach(key => markerData[key] === null && delete markerData[key]);

            // generate id if not provided
            const id = markerId || ID_PREFIX + Oskari.getSeq(this.getName()).nextVal();
            // check for existing marker
            if (this._markers[id]) {
                // remove if found - will be replaced with new config
                // event is suppressed as this is "modify"
                this.removeMarkers(id, true);
            }
            this._markers[id] = markerData;

            const oskariStyle = { ...DEFAULT_STYLE };
            const { color, shape, size, msg } = markerData;

            if (color) {
                oskariStyle.image.fill.color = color.charAt(0) === '#' ? color : '#' + color;
            }
            if (!isNaN(shape)) {
                oskariStyle.image.shape = parseInt(shape);
            }
            if (size) {
                oskariStyle.image.size = size;
            }
            if (msg) {
                oskariStyle.text.labelText = decodeURIComponent(msg);
            }
            return { id, x, y, oskariStyle };
        },

        /**
         * Adds a marker to the map
         * @param {Object} markerData
         * @param {String} id
         * @param {Boolean} suppressEvent true to not send out an event about adding marker
         */
        addMapMarker: function (markerData, markerId, suppressEvent) {
            var me = this;
            // Combine default values with given values
            var data = this._getSanitizedMarker(markerData, markerId);
            if (!data) {
                // validation failed
                this.log.warn('Error while adding marker');
                return;
            }
            const { id, x, y, oskariStyle } = data;
            const layer = this.getMarkersLayer();
            const style = this.getMapModule().getStyle(oskariStyle, STYLE_TYPE);

            const feature = new olFeature(new olGeom.Point([x, y]));
            feature.setId(id);
            feature.setStyle(style);
            layer.getSource().addFeature(feature);
            this.raiseMarkerLayer();

            if (!suppressEvent) {
                var addEvent = Oskari.eventBuilder(
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
        changeMapMarkerVisibility: function (visible, markerId) {
            const suppressEvent = true;
            if (markerId) {
                const marker = this.getMarker(markerId);
                if (visible) {
                    // need to use addMapMarker to create and add feature to map
                    this.addMapMarker(marker, markerId, suppressEvent);
                } else {
                    const layerSource = this.getMarkersLayer().getSource();
                    const feature = layerSource.getFeatureById(markerId);
                    layerSource.removeFeature(feature);
                }
                marker.hidden = !visible;
                return;
            }
            if (visible) {
                const idsToAdd = Object.keys(this._markers).filter(id => this.getMarker(id).hidden);
                // need to use addMapMarker to create and add features to map
                idsToAdd.forEach(id => this.addMapMarker(this.getMarker(id), id, suppressEvent));
                return;
            }
            this.getMarkersLayer().getSource().clear();
            Object.keys(this._markers).forEach(id => {
                this.getMarker(id).hidden = true;
            });
        },

        /**
         * Raises the marker layer above the other layers
         *
         * @param markerLayer
         */
        raiseMarkerLayer: function () {
            this.getMapModule().bringToTop(this.getMarkersLayer());
        },

        /**
         * Requests the tools to be added to the toolbar.
         *
         * @method registerTool
         */
        _registerTools: function () {
            const { markerButton } = this.getConfig();
            if (this._buttonsAdded || markerButton === false) {
                return;
            }
            const sandbox = this.getSandbox();
            if (!sandbox.hasHandler('Toolbar.AddToolButtonRequest')) {
                // Couldn't get the request, toolbar not loaded
                return;
            }
            const reqBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            Object.keys(this.buttons).forEach(btnName => {
                const request = reqBuilder(btnName, TOOL_GROUP, this.buttons[btnName]);
                sandbox.request(this.getName(), request);
            });
            this._buttonsAdded = true;
        },

        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGfi: function (blnEnable) {
            // TODO or use isDrawing
            var sandbox = this.getSandbox();
            var gfiReqBuilder = Oskari.requestBuilder(
                'MapModulePlugin.GetFeatureInfoActivationRequest'
            );
            var hiReqBuilder = Oskari.requestBuilder(
                'WfsLayerPlugin.ActivateHighlightRequest'
            );

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
         * @method setState
         * Set the bundle state
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            const { markers } = state || {};
            // remove markers without sending an AfterRemoveMarkersEvent
            this.removeMarkers(null, true);
            if (markers) {
                markers.forEach(marker => this.addMapMarker(marker, null, true));
            }
        },
        /**
         * Returns markers parameter for map link if any markers on map:
         * "&markers=shape|size|hexcolor|x_y|User input text___shape|size|hexcolor|x_y|input 2"
         * @return {String} link parameters
         */
        getStateParameters: function () {
            const { markers } = this.getState();
            return this.getMarkersString(markers);
        },
        getTransformedStateParameters: function (targetSrs) {
            const mapmodule = this.getMapModule();
            const currentSrs = mapmodule.getProjection();
            if (!targetSrs || targetSrs === currentSrs) {
                return this.getStateParameters();
            }
            const { markers } = this.getState();
            let transformedMarkers;
            try {
                transformedMarkers = markers.map(marker => {
                    const lonlat = mapmodule.transformCoordinates({ lon: marker.x, lat: marker.y }, currentSrs, targetSrs);
                    return {
                        ...marker,
                        x: lonlat.lon,
                        y: lonlat.lat
                    };
                });
            } catch (err) {
                transformedMarkers = [];
            };
            return this.getMarkersString(transformedMarkers);
        },
        getMarkersString: function (markers = []) {
            const FIELD_SEPARATOR = '|';
            const MARKER_SEPARATOR = '___';
            const markerParams = markers.map(marker => {
                var str = marker.shape + FIELD_SEPARATOR +
                    marker.size + FIELD_SEPARATOR;
                if (marker.color.indexOf('#') === 0) {
                    str = str + marker.color.substring(1);
                } else {
                    str = str + marker.color;
                }
                return str + FIELD_SEPARATOR +
                    marker.x + '_' + marker.y + FIELD_SEPARATOR +
                    encodeURIComponent(marker.msg);
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
        getState: function () {
            const markers = Object.values(this._markers).filter(marker => !marker.transient);
            const state = { markers };
            return state;
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @return null
         */
        getOLMapLayers: function () {
            return [this.getMarkersLayer()];
        }

    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
