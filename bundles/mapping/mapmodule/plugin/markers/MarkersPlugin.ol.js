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
import { showAddMarkerPopup } from './view/MarkersForm';
import { showMarkerPopup } from './view/MarkerPopup';
import { ID_PREFIX, PLUGIN_NAME, TOOL_GROUP, DEFAULT_STYLE, STYLE_TYPE, DEFAULT_DATA, SEPARATORS } from './constants';

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

        this._hiddenMarkers = {}; // id: olFeature
        this._styleData = {}; // store values as it's hard to get them from feature's ol style

        this.buttons = null;
        this.markerPopupControls = null;
        this._buttonsAdded = false;
        this._showAddMarkerPopupOnMapClick = false;

        // Show the marker button
        this._layer = undefined;
        this.log = Oskari.log(PLUGIN_NAME);
        this.popupControls = null;
        this.popupCleanup = (restartTool = true) => {
            if (this.popupControls) {
                this.popupControls.close();
                this._showAddMarkerPopupOnMapClick = true;
            }
            this.popupControls = null;
            if (Oskari.util.isMobile() && !this.markerPopupControls && restartTool) {
                this.startMarkerAdd();
            }
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
                'Toolbar.ToolSelectedEvent': event => {
                    if (event.getToolId() !== 'addMarker' && event.getSticky()) {
                        if (this.popupControls) {
                            this.popupCleanup(false);
                        }
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
            this.buttons = {
                addMarker: {
                    iconCls: 'marker-share',
                    tooltip: this.getMsg('tooltip'),
                    sticky: true,
                    callback: () => this.startMarkerAdd()
                }
            };
            // Register marker tools
            this._registerTools();
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
         * Handles generic map click
         * @private
         * @param  {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event map click
         */
        _mapClick: function (event) {
            if (Oskari.util.isMobile()) {
                this.keepToolActive = true;
                if (this.markerPopupControls) {
                    this.closeMarkerPopup();
                }
                this.keepToolActive = false;
            }
            if (!this._showAddMarkerPopupOnMapClick) {
                // get markers from layer by pixel so we get result based on visualization and not the coordinate for the point
                const pixels = [event.getMouseX(), event.getMouseY()];
                this.getMarkersLayer()
                    .getFeatures(pixels)
                    .then(featureList => featureList
                        .forEach((feature) => this._markerClicked(feature.getId())));
                return;
            }
            // adding a marker
            const { lon, lat } = event.getLonLat();
            const coord = [lon, lat];
            this._showAddMarkerPopupOnMapClick = false;
            const onAdd = style => {
                this.popupCleanup();
                this._addMarkerFromPopup(coord, style);
            };
            this.popupControls = showAddMarkerPopup(onAdd, this.popupCleanup);
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
        getMarkersLayer: function () {
            if (!this._layer) {
                this._layer = new olLayerVector({ title: 'Markers', source: new olSourceVector() });
                this.getMapModule().addOverlayLayer(this._layer);
            }
            return this._layer;
        },
        getOLMapLayers: function () {
            return [];
        },
        getMapMarkerBounds: function () {
            return this.getMarkersLayer().getSource().getExtent();
        },
        closeMarkerPopup: function () {
            if (this.markerPopupControls) {
                this.markerPopupControls.close();
            }
            this.markerPopupControls = null;
            if (!this.keepToolActive) {
                this.stopMarkerAdd();
            }
        },
        /**
         * Activate the "add marker mode" on map.
         */
        startMarkerAdd: function () {
            this.enableGfi(false);
            this._showAddMarkerPopupOnMapClick = true;

            if (!this.markerPopupControls) {
                this.markerPopupControls = showMarkerPopup(() => this.removeMarkers(), () => this.closeMarkerPopup());
            }

            this.getMapModule().setCursorStyle('crosshair');
        },
        /**
         * Stops the marker location selector
         */
        stopMarkerAdd: function (selectDefault = true) {
            this.enableGfi(true);
            this._showAddMarkerPopupOnMapClick = false;
            if (this.markerPopupControls) {
                this.closeMarkerPopup();
            }
            if (this.popupControls) {
                this.popupCleanup();
            }
            this.getMapModule().setCursorStyle('');
            if (!selectDefault) {
                return;
            }
            // ask toolbar to select default tool if available
            const toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            if (toolbarRequest) {
                this.getSandbox().request(this, toolbarRequest());
            }
        },
        addMapMarker: function (markerData, markerId) {
            // Combine default values with given values
            const { id, x, y, ...styleData } = this._getSanitizedMarker(markerData, markerId);
            if (!id) {
                // validation failed
                this.log.warn('Error while adding marker');
                return;
            }
            this._styleData[id] = styleData;
            const style = this._getStyleFromMarkerData(styleData);
            this._addMarkerToMap(id, [x, y], style);
        },
        removeMarkers: function (id) {
            if (id) {
                delete this._hiddenMarkers[id];
                delete this._styleData[id];
                this._removeMarkerFromMap(id);
            } else {
                // remove all
                this.getMarkersLayer().getSource().clear();
                this._hiddenMarkers = {};
                this._styleData = {};
            }
            const removeEvent = Oskari.eventBuilder('AfterRemoveMarkersEvent')(id);
            this.getSandbox().notifyAll(removeEvent);
        },
        _getSanitizedMarker: function (markerData, markerId) {
            const { x, y, shape, msg, color, ...other } = markerData;
            // Validation: coordinates are needed
            if ((typeof x === 'undefined') || (typeof y === 'undefined')) {
                this.log.warn('Undefined coordinate in', markerData);
                return {};
            }
            // generate id if not provided
            const id = markerId || ID_PREFIX + Oskari.getSeq(this.getName()).nextVal();
            const sanitized = { id, x, y, ...DEFAULT_DATA };

            if (typeof shape !== 'undefined') {
                sanitized.shape = isNaN(shape) ? shape : parseInt(shape);
            }
            if (msg) {
                sanitized.msg = decodeURIComponent(msg);
            }
            if (color) {
                sanitized.color = color.charAt(0) === '#' ? color.substring(1) : color;
            }
            Object.keys(other).forEach(key => {
                const value = other[key];
                if (typeof value !== 'undefined') {
                    sanitized[key] = value;
                }
            });
            return sanitized;
        },
        /**
         * Close enough "backwards compatibility" workaround for marker size when using external graphic/svg as icon.
         * If the requested size is below 10 -> use the formula used pre-2.7 to calculate size.
         * Otherwise keep the requested size (documented as pixel size).
         * @param {Number} requestedSize pixel value or previously supported value of 1-5 like for built-in symbols. Cut off point for logic is at 10.
         */
        __workaroundForBackwardsCompatibilitySize: function (requestedSize) {
            if (typeof requestedSize === 'number' && requestedSize < 10) {
                const mapmodule = this.getMapModule();
                if (mapmodule && typeof mapmodule.getPixelForSize === 'function') {
                    return mapmodule.getPixelForSize(requestedSize);
                }
            }
            return requestedSize;
        },
        _getStyleFromMarkerData: function (markerData) {
            const style = jQuery.extend(true, {}, DEFAULT_STYLE);
            const { color, shape, size, msg, offsetX, offsetY } = markerData;
            style.image.fill.color = '#' + color;
            style.image.shape = shape;
            style.text.labelText = msg;
            // use pixel size if shape is svg or url
            if (typeof shape === 'string') {
                style.image.sizePx = this.__workaroundForBackwardsCompatibilitySize(size);
            } else {
                style.image.size = size;
            }
            if (typeof offsetX !== 'undefined') {
                style.image.offsetX = offsetX;
            }
            if (typeof offsetY !== 'undefined') {
                style.image.offsetY = offsetY;
            }
            return style;
        },
        _addMarkerFromPopup: function (coord, style) {
            const id = ID_PREFIX + Oskari.getSeq(this.getName()).nextVal();
            const { image, text } = style;
            const { fill, shape, size } = image;
            const styleData = {
                color: fill.color.substring(1),
                shape,
                size,
                msg: text.labelText
            };
            this._styleData[id] = styleData;
            this._addMarkerToMap(id, coord, style);
        },

        _addMarkerToMap: function (id, coord, style) {
            const layerSource = this.getMarkersLayer().getSource();
            const olStyle = this.getMapModule().getStyle(style, STYLE_TYPE);

            const feature = new olFeature(new olGeom.Point(coord));
            feature.setId(id);
            feature.setStyle(olStyle);

            if (layerSource.hasFeature(feature)) {
                // ol doesn't add features with same id, update existing
                const existing = layerSource.getFeatureById(id);
                existing.setGeometry(new olGeom.Point(coord));
                existing.setStyle(olStyle);
            } else {
                layerSource.addFeature(feature);
            }
            const data = this._featureToMarkerData(feature);
            const addEvent = Oskari.eventBuilder('AfterAddMarkerEvent')(data, id);
            this.getSandbox().notifyAll(addEvent);
        },
        _removeMarkerFromMap: function (id) {
            const layerSource = this.getMarkersLayer().getSource();
            const feature = layerSource.getFeatureById(id);
            if (feature) {
                layerSource.removeFeature(feature);
            }
        },
        _featureToMarkerData: function (feature) {
            const id = feature.getId();
            const coord = feature.getGeometry().getCoordinates();
            const styleData = this._styleData[id];
            return {
                id,
                x: coord[0],
                y: coord[1],
                ...styleData
            };
        },
        /**
         * Change map marker visibility.
         * @method  @public changeMapMarkerVisibility
         * @param  {Boolean} visible  visibility is marker visible or not.
         * @param  {String} id  optional marker id for marker to change it's visibility, all markers visibility changed if not given.
         */
        changeMapMarkerVisibility: function (visible, id) {
            const layerSource = this.getMarkersLayer().getSource();
            const update = feature => {
                if (!feature) {
                    // not found for requested id (invalid id or feature is visible/hidden already)
                    return;
                }
                const fid = feature.getId();
                if (visible) {
                    layerSource.addFeature(feature);
                    delete this._hiddenMarkers[fid];
                } else {
                    this._hiddenMarkers[fid] = feature;
                    layerSource.removeFeature(feature);
                }
            };

            if (id) {
                const feature = visible ? this._hiddenMarkers[id] : layerSource.getFeatureById(id);
                update(feature);
            } else {
                const features = visible ? Object.values(this._hiddenMarkers) : layerSource.getFeatures();
                features.forEach(f => update(f));
            }
        },
        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGfi: function (blnEnable) {
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
            // Clear state
            this.getMarkersLayer().getSource().clear();
            this._hiddenMarkers = {};
            this._styleData = {};

            const { markers } = state || {};
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
            const { FIELD, MARKER, COORD } = SEPARATORS;
            const markerParams = markers.map(marker => {
                const { shape, size, color, x, y, msg } = marker;
                const encodedMsg = encodeURIComponent(msg);
                return shape + FIELD + size + FIELD + color + FIELD + x + COORD + y + FIELD + encodedMsg;
            });
            if (markerParams.length > 0) {
                return '&markers=' + markerParams.join(MARKER);
            }
            return '';
        },
        /**
         * @method getState
         * Returns the bundle state
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            if (!this.getMarkersLayer().getVisible()) {
                return {};
            }
            const markers = this.getMarkersLayer().getSource().getFeatures()
                .map(feat => this._featureToMarkerData(feat))
                .filter(markerData => !markerData.transient);
            return { markers };
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
