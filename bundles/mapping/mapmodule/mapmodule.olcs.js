import { defaults as olInteractionDefaults } from 'ol/interaction';
import OLView from 'ol/View';
import * as olProjProj4 from 'ol/proj/proj4';
import * as olProj from 'ol/proj';
import OLMap from 'ol/Map';
import { defaults as olControlDefaults } from 'ol/control';
// see oskari-frontend/webpack/config.js for additional config required by Cesium

import * as Cesium from 'cesium';

// https://github.com/openlayers/ol-cesium/issues/1094#issuecomment-1710423741
// import OLCesium from 'olcs/OLCesium.js';
import OLCesium from 'olcs';
import { MapModule as MapModuleOl } from './MapModuleClass.ol';
import { LAYER_ID, VECTOR_STYLE } from './domain/constants';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './event/TimeChangedEvent';
import './plugin/layers/LayersPlugin.olcs';

import 'olcs/css/olcs.css';

dayjs.extend(customParseFormat);
// OL-cesium expects to find this global
window.Cesium = Cesium;

// Polyfills DOM4 MouseEvent for olcs if needed
(function (window) {
    try {
        // eslint-disable-next-line no-new, no-use-before-define
        new MouseEvent('test');
        return false; // No need to polyfill
    } catch (e) {
        // Need to polyfill - fall through
    }
    var MouseEvent = function (eventType, params) {
        params = params || { bubbles: false, cancelable: false };
        var mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, params.screenX || 0, params.screenY || 0, params.clientX || 0, params.clientY || 0, false, false, false, false, 0, null);
        return mouseEvent;
    };
    MouseEvent.prototype = Event.prototype;
    window.MouseEvent = MouseEvent;
})(window);

const TILESET_DEFAULT_COLOR = '#ffd2a6';

class MapModuleOlCesium extends MapModuleOl {
    constructor (id, imageUrl, options, mapDivId) {
        super(id, imageUrl, options, mapDivId);
        this._map3D = null;
        this._supports3D = true;
        this._mapReady = false;
        this._mapReadySubscribers = [];
        this._moveEndSubscribers = [];
        this._lastKnownZoomLevel = null;
        this._time = new Date();
        this._log = Oskari.log('MapModuleOlCesium');
    }

    /**
     * @method createMap
     * Creates OlCesium map implementation
     * @return {ol/Map}
     */
    createMap () {
        const me = this;
        olProjProj4.register(window.proj4);
        // this is done BEFORE enhancement writes the values to map domain
        // object... so we will move the map to correct location
        // by making a MapMoveRequest in application startup
        const controls = olControlDefaults({
            zoom: false,
            attribution: true,
            attributionOptions: {
                collapsible: false
            },
            rotate: false
        });

        const map = new OLMap({
            keyboardEventTarget: document,
            target: this.getMapDOMEl(),
            controls,
            interactions: me._olInteractionDefaults,
            moveTolerance: 2
        });

        const projection = olProj.get(me.getProjection());
        map.setView(new OLView({
            projection,
            // actual startup location is set with MapMoveRequest later on
            // still these need to be set to prevent errors
            center: [0, 0],
            zoom: 0,
            resolutions: this.getResolutionArray()
        }));
        const creditContainer = document.createElement('div');
        creditContainer.className = 'cesium-credit-container';
        this._map3D = new OLCesium({
            map,
            time: () => this.getJulianTime(),
            sceneOptions: {
                showCredit: true,
                creditContainer,
                shadows: true,
                contextOptions: {
                    allowTextureFilterAnisotropic: false
                }
            }
        });
        this._map3D.container_.appendChild(creditContainer);

        const scene = this._map3D.getCesiumScene();
        // Vector features sink in the ground. This allows sunken features to be visible through the ground.
        // Setting olcs property 'altitudeMode': 'clampToGround' to vector layer had some effect but wasn't good enough.
        // DepthTestAgainstTerrain should be enabled when 3D-tiles (buildings) are visible.
        scene.globe.depthTestAgainstTerrain = false;
        scene.globe.enableLighting = true;
        scene.shadowMap.darkness = 0.7;
        scene.skyBox = this._createSkyBox();
        scene.sun = new Cesium.Sun();

        // Performance optimization
        this._map3D.enableAutoRenderLoop();
        scene.fog.density = 0.0005;
        scene.fog.screenSpaceErrorFactor = 10;

        // Fix dark imagery
        scene.highDynamicRange = false;

        this._initTerrainProvider();
        this._setupMapEvents(map);
        this._fixDuplicateOverlays(true);

        const updateReadyStatus = function () {
            scene.postRender.removeEventListener(updateReadyStatus);
            me._mapReady = true;
            me._notifyMapReadySubscribers();
        };
        scene.postRender.addEventListener(updateReadyStatus);

        return map;
    }

    _createSkyBox () {
        // Base URL from Webpack DefinePlugin
        const skyboxIconsDir = `${CESIUM_BASE_URL}/Assets/Textures/SkyBox`;
        return new Cesium.SkyBox({
            sources: {
                positiveX: `${skyboxIconsDir}/tycho2t3_80_px.jpg`,
                negativeX: `${skyboxIconsDir}/tycho2t3_80_mx.jpg`,
                positiveY: `${skyboxIconsDir}/tycho2t3_80_py.jpg`,
                negativeY: `${skyboxIconsDir}/tycho2t3_80_my.jpg`,
                positiveZ: `${skyboxIconsDir}/tycho2t3_80_pz.jpg`,
                negativeZ: `${skyboxIconsDir}/tycho2t3_80_mz.jpg`
            }
        });
    }

    /**
     * Fixes an issue with olcs. ol/Overlays are visible for both 2d and 3d map instances at the same time.
     */
    _fixDuplicateOverlays (hide2dOverlay) {
        const className = 'fix-olcs-hideoverlay';
        if (!this.duplicateOverlayFix) {
            this.duplicateOverlayFix = document.createElement('style');
            const css = `
                .${className} > .ol-overlay-container {
                    display:none;
                }
            }`;
            this.duplicateOverlayFix.appendChild(document.createTextNode(css));
            document.head.appendChild(this.duplicateOverlayFix);
        }
        const { classList } = document.querySelector('.ol-viewport > .ol-overlaycontainer-stopevent');
        if (hide2dOverlay) {
            if (classList.contains(className)) {
                return;
            }
            classList.add(className);
            return;
        }
        classList.remove(className);
    }

    /**
     * @method _initTerrainProvider Initializes the terrain defined in module options.
     */
    async _initTerrainProvider () {
        if (!this.getCesiumScene() || !this._options.terrain) {
            return;
        }
        const { providerUrl, ionAssetId, ionAccessToken } = this._options.terrain;
        let terrainProvider = null;
        if (providerUrl) {
            terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(providerUrl);
        }
        if (ionAccessToken) {
            Cesium.Ion.defaultAccessToken = ionAccessToken;
            jQuery('.cesium-credit-container .cesium-credit-logoContainer').css('visibility', 'visible');

            if (ionAssetId) {
                terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(ionAssetId, {
                    requestVertexNormals: false
                });
            } else {
                terrainProvider = await Cesium.createWorldTerrainAsync({
                    requestVertexNormals: false
                });
            }
        }
        if (!terrainProvider) {
            return;
        }
        this.getCesiumScene().terrainProvider = terrainProvider;
    }

    /**
     * Fire operations that have been waiting for the map to initialize.
     */
    _notifyMapReadySubscribers () {
        const me = this;
        this._mapReadySubscribers.forEach(function (fireOperation) {
            fireOperation.operation.apply(me, fireOperation.arguments);
        });
    }

    /**
     * @method notifyMoveEnd
     * Notify other components that the map has moved. Sends a AfterMapMoveEvent and updates the
     * sandbox map domain object with the current map properties.
     * if they move the map through OpenLayers reference. All map movement methods implemented in mapmodule
     * (this class) calls this automatically if not stated otherwise in API documentation.
     */
    notifyMoveEnd () {
        const sandbox = this.getSandbox();
        sandbox.getMap().setMoving(false);
        const camera = this.getCamera().orientation;

        const lonlat = this.getMapCenter();
        this.updateDomain();
        const evt = Oskari.eventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this.getMapZoom(), this.getMapScale(), camera);
        sandbox.notifyAll(evt);
        this._notifyMoveEndSubscribers();
    }

    _notifyMoveEndSubscribers () {
        if (this._moveEndSubscribers.length === 0) return;

        this._moveEndSubscribers.forEach(({ func, args }) => {
            func.apply(this, args);
        });
        this._moveEndSubscribers = [];
    }

    /**
     * Add map event handlers
     * @method @private _setupMapEvents
     */
    _setupMapEvents (map) {
        const cam = this.getCesiumScene().camera;
        cam.moveStart.addEventListener(this.notifyStartMove.bind(this));
        cam.moveEnd.addEventListener(this.notifyMoveEnd.bind(this));

        const handler = new Cesium.ScreenSpaceEventHandler(this.getCesiumScene().canvas);

        const getClickHandler = ctrlModifier => {
            return ({ position }) => {
                if (this.getDrawingMode()) {
                    return;
                }
                const lonlat = this.getMouseLocation(position);
                if (!lonlat) {
                    return;
                }
                const { x, y } = position;
                const mapClickedEvent = Oskari.eventBuilder('MapClickedEvent')(lonlat, x, y, ctrlModifier);
                this._sandbox.notifyAll(mapClickedEvent);
            };
        };

        handler.setInputAction(getClickHandler(false), Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(getClickHandler(true), Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.CTRL);

        const notifyMouseHover = (lonlat, pixel, paused) => {
            var hoverEvent = Oskari.eventBuilder('MouseHoverEvent')(
                lonlat.lon,
                lonlat.lat,
                paused,
                pixel.x,
                pixel.y,
                this.getDrawingMode()
            );
            this._sandbox.notifyAll(hoverEvent);
        };

        let mouseMoveTimer;
        handler.setInputAction(({ endPosition }) => {
            const lonlat = this.getMouseLocation(endPosition);
            if (!lonlat) {
                return;
            }
            notifyMouseHover(lonlat, endPosition, false);
            clearTimeout(mouseMoveTimer);
            // No mouse move in 1000 ms - mouse move paused
            mouseMoveTimer = setTimeout(notifyMouseHover.bind(this, lonlat, endPosition, true), 1000);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    /**
     * @method _getFeaturesAtPixelImpl
     * To get feature properties at given mouse location on screen / div element.
     * @param  {Float} x
     * @param  {Float} y
     * @return {Array} list containing objects with props `properties` and  `layerId`
     */
    _getFeaturesAtPixelImpl (x, y) {
        if (!this._map3D.getEnabled()) {
            return super._getFeaturesAtPixelImpl(x, y);
        }
        const hits = [];
        const picked = this._map3D.getCesiumScene().pick(new Cesium.Cartesian2(x, y));
        if (!picked) {
            return hits;
        }
        const feature = picked.primitive.olFeature;
        const layer = picked.primitive.olLayer;
        if (!feature || !layer) {
            return hits;
        }
        hits.push({
            featureProperties: feature.getProperties(),
            layerId: layer.get(LAYER_ID)
        });
        return hits;
    }
    _forEachFeatureAtPixelImpl (pixel, callback) {
        if (!this._map3D.getEnabled()) {
            super._forEachFeatureAtPixelImpl(pixel, callback);
        }
        const pickedList = this._map3D.getCesiumScene().drillPick(new Cesium.Cartesian2(pixel[0], pixel[1]));
        pickedList.forEach(picked => {
            const feature = picked.primitive.olFeature;
            const layer = picked.primitive.olLayer;
            if (feature && layer) {
                callback(feature, layer);
            }
        });
    }

    /**
     * @method getTime
     * Gets time set for map
     * @return {Date}
     */
    getTime () {
        return this._time || new Date();
    }
    /**
     * @method getJulianTime
     * Gets time set for map in Julian date
     * @return {Cesium.JulianDate}
     */
    getJulianTime () {
        return Cesium.JulianDate.fromDate(this.getTime());
    }
    /**
     * @method getTimeParams
     * Gets time paramaters set for map
     * @return {Object}
     */
    getTimeParams () {
        const time = this.getTime();
        return {
            date: dayjs(time).format('D/M'),
            time: dayjs(time).format('H:mm'),
            year: time.getFullYear()
        };
    }
    /**
     * @method setTime
     * Sets time for map
     * @param {Date} time
     */
    setTime (time) {
        if (!(time instanceof Date)) return;
        this._time = time;
        this.notifyTimeChanged();
    }

    /**
     * @method notifyTimeChanged
     * Notify other components that the time has changed. Sends a TimeChangedEvent
     */
    notifyTimeChanged () {
        const { date, time } = this.getTimeParams();
        const event = Oskari.eventBuilder('TimeChangedEvent')(date, time);
        this.getSandbox().notifyAll(event);
    }

    getMapZoom () {
        var zoomlevel = this.getMap().getView().getZoom();
        if (typeof (zoomlevel) === 'undefined' || zoomlevel === 0) {
            // Cesium view has been zoomed outside ol zoomlevels.
            zoomlevel = this._lastKnownZoomLevel;
        } else {
            this._lastKnownZoomLevel = Math.round(zoomlevel);
        }
        return Math.round(zoomlevel);
    }

    /**
     * @param {Object} layerImpl ol/layer/Layer or Cesium.Cesium3DTileset, olcs specific!
     * @param {Boolean} toBottom if false or missing adds the layer to the top, if true adds it to the bottom of the layer stack
     */
    addLayer (layerImpl, toBottom) {
        if (!layerImpl) {
            return;
        }
        if (layerImpl instanceof Cesium.Cesium3DTileset) {
            this._map3D.getCesiumScene().primitives.add(layerImpl);
        } else {
            this.getMap().addLayer(layerImpl);
            // check for boolean true instead of truthy value since some calls might send layer name as second parameter/functionality has changed
            if (toBottom === true) {
                this.setLayerIndex(layerImpl, 0);
            }
        }
    }

    /**
     * @param {ol/layer/Layer | Cesium.Cesium3DTileset} layer
     */
    setLayerIndex (layerImpl, index) {
        if (layerImpl instanceof Cesium.Cesium3DTileset) {
            return;
        }
        return super.setLayerIndex(layerImpl, index);
    }

    /**
     * @param {ol/layer/Layer | Cesium.Cesium3DTileset} layer
     */
    getLayerIndex (layerImpl) {
        if (layerImpl instanceof Cesium.Cesium3DTileset) {
            return;
        }
        return super.getLayerIndex(layerImpl);
    }

    /**
     * Returns if the layer is currently being shown to the user
     * @param {String|Number|Cesium.Cesium3DTileset|ol.layer} layer id in Oskari or the layer implementation
     */
    isLayerVisible (layer) {
        if (Array.isArray(layer)) {
            return layer.some(l => this.isLayerVisible(l));
        }
        if (layer instanceof Cesium.Cesium3DTileset) {
            this.log.deprecated('isLayerVisible', 'Use layer.isVisibleOnMap() instead');
            return layer.show || false;
        }
        super.isLayerVisible(layer);
    }
    /**
     * @param {Object} layerImpl ol/layer/Layer or Cesium.Cesium3DTileset, olcs specific!
     */
    removeLayer (layerImpl) {
        if (!layerImpl) {
            return;
        }
        if (layerImpl instanceof Cesium.Cesium3DTileset) {
            this._map3D.getCesiumScene().primitives.remove(layerImpl);
            if (!layerImpl.isDestroyed()) {
                layerImpl.destroy();
            }
        } else {
            this.getMap().removeLayer(layerImpl);
            if (typeof layerImpl.destroy === 'function') {
                layerImpl.destroy();
            }
        }
    }

    /**
     * Set
     * @param {boolean} mode drawing mode on or off!
     */
    setDrawingMode (mode) {
        this.isDrawing = !!mode;
        this._set3DModeEnabled(!this.isDrawing);
    }

    /**
     * Enable 3D view.
     */
    _set3DModeEnabled (enable) {
        if (enable === this._map3D.getEnabled()) {
            return;
        }
        var map = this.getMap();
        var interactions = null;
        if (enable) {
            // Remove all ol interactions before switching to 3D view.
            // Editing interactions after ol map is hidden doesn't work.
            interactions = map.getInteractions();
            if (interactions) {
                var removals = [];
                interactions.forEach(function (cur) {
                    removals.push(cur);
                });
                removals.forEach(function (cur) {
                    map.removeInteraction(cur);
                });
            }
            this._fixDuplicateOverlays(true);
        } else {
            // Add default interactions to 2d view.
            interactions = olInteractionDefaults({
                altShiftDragRotate: false,
                pinchRotate: false
            });
            interactions.forEach(function (cur) {
                map.addInteraction(cur);
            });
            this._fixDuplicateOverlays(false);
        }
        this._map3D.setEnabled(enable);
    }

    /**
     * Returns camera's position and orientation for state saving purposes.
     */
    getCamera () {
        var view = {};
        var olcsCam = this._map3D.getCamera();
        var coords = olcsCam.getPosition();
        view.location = {
            x: coords[0],
            y: coords[1],
            altitude: olcsCam.getAltitude()
        };
        var sceneCam = this._map3D.getCesiumScene().camera;
        view.orientation = {
            heading: Cesium.Math.toDegrees(sceneCam.heading),
            pitch: Cesium.Math.toDegrees(sceneCam.pitch),
            roll: Cesium.Math.toDegrees(sceneCam.roll)
        };
        return view;
    }

    /**
     * Turns on 3D view and positions the camera.
     *
     * Options example:
     * Camera location in map projection coordinates (EPSG:3857)
     * Orientation values in degrees
     * {
        location: {
            x: 2776460.39,
            y: 8432972.40,
            altitude: 1000.0 //meters
        },
        orientation: {
            heading: 90.0,  // east, default value is 0.0 (north)
            pitch: -90,     // default value (looking down)
            roll: 0.0       // default value
        }
    * }
    *
    */
    setCamera (options) {
        this._set3DModeEnabled(true);
        this._resetMoveMode();

        if (this._mapReady) {
            if (options) {
                var camera = this._map3D.getCesiumScene().camera;
                var view = {};
                if (options.location) {
                    var pos = options.location;
                    var lonlat = olProj.transform([parseInt(pos.x, 10), parseInt(pos.y, 10)], this.getProjection(), 'EPSG:4326');
                    view.destination = Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], parseInt(pos.altitude, 10));
                }
                if (options.orientation) {
                    view.orientation = {
                        heading: this._toRadians(parseInt(options.orientation.heading, 10)),
                        pitch: this._toRadians(parseInt(options.orientation.pitch, 10)),
                        roll: this._toRadians(parseInt(options.orientation.roll, 10))
                    };
                }
                camera.setView(view);
                this._map3D.getCamera().updateView();
            }
        } else {
            // Cesium is not ready yet. Fire after it has been initialized properly.
            this._mapReadySubscribers.push({
                operation: this.setCamera,
                arguments: [options]
            });
        }
    }
    /**
     * Function to reset map move mode and 3D camera controls to default.
     * This is needed since user might click reset map view or pan map on panbuttons when camera is in rotate mode.
     */
    _resetMoveMode () {
        this.setCameraToMoveMode();
        const cameraControlsPlugin = this._pluginInstances.CameraControls3dPlugin;
        if (cameraControlsPlugin) {
            cameraControlsPlugin.resetState();
        }
    }
    /**
     * Set camera to rotate mode
     *
     * returns boolean operationFailed
     */
    setCameraToRotateMode () {
        const scene = this.getCesiumScene();
        const { camera } = scene;

        // Get target to look at with ray from globe surface
        const ray = camera.getPickRay(new Cesium.Cartesian2(
            Math.round(scene.canvas.clientWidth / 2),
            Math.round(scene.canvas.clientHeight / 2)
        ));

        const lookAtTarget = scene.globe.pick(ray, scene);

        if (Cesium.defined(lookAtTarget)) {
            camera.lookAt(lookAtTarget, camera.position);
            this._disableMapMoveControls();
            return false;
        } else {
            this._log.warn('LookAtTarget cannot be determined. Maybe looking at space.');
            return true;
        }
    }
    panMapByPixels (pX, pY) {
        const plugin = this._pluginInstances.CameraControls3dPlugin;
        if (plugin && plugin.isRotating()) {
            this._resetMoveMode();
            this._moveEndSubscribers.push({
                func: super.panMapByPixels,
                args: [pX, pY, true, true]
            });
            return;
        }
        super.panMapByPixels(pX, pY, true, true);
    }

    setCameraToMoveMode () {
        const camera = this.getCesiumScene().camera;
        camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        this._map3D.getCamera().updateView();
        this._enableMapMoveControls();
    }
    _disableMapMoveControls () {
        const styleClass = 'map-move-control-disabled';
        const mapInMobileMode = Oskari.util.isMobile();
        var controlSelectors;

        if (mapInMobileMode) {
            controlSelectors = this._getMobileMapControlSelectors();
        } else {
            controlSelectors = this._getDesktopMapControlSelectors();
            // Zoom bar need more handling than other controls
            const zoomBar = jQuery('.mappluginsContainer').find('.zoombar');
            zoomBar.addClass(styleClass);
            zoomBar.children().addClass(styleClass);
            const slider = zoomBar.find('.slider');
            slider.slider('disable');
        }

        controlSelectors.forEach(controlClass => {
            const control = jQuery(controlClass);
            control.addClass(styleClass);
        });
    }
    _enableMapMoveControls () {
        const styleClass = 'map-move-control-disabled';
        const mapInMobileMode = Oskari.util.isMobile();
        var controlSelectors;

        if (mapInMobileMode) {
            controlSelectors = this._getMobileMapControlSelectors();
        } else {
            controlSelectors = this._getDesktopMapControlSelectors();
            // Zoom bar need more handling than other controls
            const zoomBar = jQuery('.mappluginsContainer').find('.zoombar');
            zoomBar.removeClass(styleClass);
            zoomBar.children().removeClass(styleClass);
            const slider = zoomBar.find('.slider');
            slider.slider('enable');
        }

        controlSelectors.forEach(controlClass => {
            const control = jQuery(controlClass);
            control.removeClass(styleClass);
        });
    }
    _getMobileMapControlSelectors () {
        return ['.mobileToolbarContent .mobile-zoom-in', '.mobileToolbarContent .mobile-zoom-out', '.mobileToolbarContent .mobile-my-location', '.mobileToolbarContent .mobile-xy', '.mobileToolbarContent .mobile-north', '.mobileToolbarContent .camera-controls-3d i:nth-child(3)', '.mobileToolbarContent .camera-controls-3d i:nth-child(4)'];
    }
    _getDesktopMapControlSelectors () {
        return ['.mappluginsContainer .maprotator', '.mappluginsContainer .coordinatetool', '.mappluginsContainer .mylocationplugin'];
    }
    _toRadians (value) {
        return !isNaN(value) ? Cesium.Math.toRadians(value) : undefined;
    }

    /**
     * Returns state for mapmodule including plugins that have getState() function
     * @method getState
     * @return {Object} properties for each pluginName
     */
    getState () {
        var state = {
            plugins: {}
        };
        var pluginName;
        for (pluginName in this._pluginInstances) {
            if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getState) {
                state.plugins[pluginName] = this._pluginInstances[pluginName].getState();
            }
        }
        if (this._map3D.getEnabled()) {
            state.camera = this.getCamera();
            state.timePoint = this.getTimeParams();
        }
        return state;
    }

    /**
     *
     * @method centerMap
     * Moves the map to the given position and zoomlevel. Overrides 2d centerMap function.
     * @param {Number[] | Object} lonlat coordinates to move the map to
     * @param {Number/OpenLayers.Bounds/Object} zoomLevel zoomlevel to set the map to
     * @param {Boolean} suppressEnd deprecated
     * @param {Object} options  has values for heading, pitch, roll and duration
     */
    centerMap (lonlat, zoom, suppressEnd, options = {}) {
        lonlat = this.normalizeLonLat(lonlat);
        if (!this.isValidLonLat(lonlat.lon, lonlat.lat)) {
            return false;
        }

        if (zoom === null || zoom === undefined) {
            zoom = { type: 'zoom', value: this.getMapZoom() };
        } else {
            const { top, bottom, left, right } = zoom.value || zoom;
            if (!isNaN(top) && !isNaN(bottom) && !isNaN(left) && !isNaN(right)) {
                const zoomOut = top === bottom && left === right;
                const suppressEvent = zoomOut;
                this.zoomToExtent({ top, bottom, left, right }, suppressEvent, suppressEvent);
                if (zoomOut) {
                    this.zoomToScale(2000);
                }
                this.getMap().getView().setCenter([lonlat.lon, lonlat.lat]);
                return true;
            }
        }

        if (options.animation) {
            const location = olProj.transform([lonlat.lon, lonlat.lat], this.getProjection(), 'EPSG:4326');
            const cameraHeight = this._zoomToAltitude(zoom);
            const duration = options.duration ? options.duration : 3000;
            const animationDuration = duration / 1000;

            let camera;
            if (options.heading && options.roll && options.pitch) {
                camera = {
                    heading: options.heading,
                    roll: options.roll,
                    pitch: options.pitch
                };
            }
            const complete = () => this.notifyMoveEnd();
            // 3d map now only supports one animation so ignore the parameter, and just fly
            this._flyTo(location[0], location[1], cameraHeight, animationDuration, camera, complete);
            return true;
        }
        if (!isNaN(zoom)) {
            // backwards compatibility
            zoom = { type: 'zoom', value: zoom };
        }

        const view = this.getMap().getView();
        const zoomValue = zoom.type === 'scale' ? view.getZoomForResolution(zoom.value) : zoom.value;
        view.setCenter([lonlat.lon, lonlat.lat]);
        view.setZoom(zoomValue);
        this.notifyMoveEnd();
        return true;
    }

    /**
     * @method _flyTo fly to coords with options
     *
     * @param {Number} x longitude
     * @param {Number} y latitude
     * @param {Number} z zoom/cameraheight
     * @param {Number} duration animation duration in seconds
     * @param {Object} camera orientation of camera, heading pitch and roll
     * @param {Function} complete function to run when animation is completed
     * @param {Function} cancel function to run when animation is cancelled
     */
    _flyTo (x, y, z, duration, cameraAngles, complete, cancel) {
        const camera = this.getCesiumScene().camera;
        let flyToParams = { destination: Cesium.Cartesian3.fromDegrees(x, y, z) };
        flyToParams = duration ? { ...flyToParams, duration: duration } : flyToParams;
        flyToParams = cameraAngles ? { ...flyToParams, orientation: cameraAngles } : flyToParams;
        flyToParams = complete ? { ...flyToParams, complete: complete } : flyToParams;
        flyToParams = cancel ? { ...flyToParams, cancel: cancel } : flyToParams;
        camera.flyTo(flyToParams);
    }

    /**
     * @method _altitudeToZoom
     *
     * Formula taken from
     * https://stackoverflow.com/questions/36544209/converting-altitude-to-z-level-and-vice-versa/41260276#41260276
     * @param {Number} altitude
     * @return {Number} zoomLevel for OL maps
     */
    _altitudeToZoom (altitude) {
        const A = 40487.57;
        const B = 0.00007096758;
        const C = 91610.74;
        const D = -40467.74;

        return (D + (A - D) / (1 + Math.pow(altitude / C, B))) - 4;
    }

    /**
     * @method _zoomToAltitude
     *
     * Formula taken from
     * https://stackoverflow.com/questions/36544209/converting-altitude-to-z-level-and-vice-versa/37142662#37142662
     * @param {Object | Number} zoom zoom as number, scale or zoom objext
     * @return {Number} Altitude for 3d maps
     */
    _zoomToAltitude (zoom) {
        if (zoom === null || zoom === undefined) {
            zoom = { type: 'zoom', value: this.getMapZoom() };
        }
        if (typeof zoom !== 'object') {
            zoom = { type: 'zoom', value: zoom };
        }
        const zoomLevel = zoom.type === 'scale' ? this.getResolutionForScale(zoom.value) : zoom.value;
        const A = 40487.57;
        const B = 0.00007096758;
        const C = 91610.74;
        const D = -40467.74;

        return C * Math.pow((A - D) / ((zoomLevel + 4) - D) - 1, 1 / B);
    }

    /**
     * @method tourMap
     * Moves the map from point to point. Overrides 2d tourMap function.
     * @param {Object[]} coordinates array of coordinates to move the map along
     * @param {Object | Number} zoom absolute zoomlevel to set the map to
     * @param {Object} options options, such as animation, duration, delay and camera
     *     Usable animations: fly/pan/zoomPan
     */
    tourMap (coordinates, zoom, options = {}) {
        const me = this;
        const duration = !isNaN(options.duration) ? options.duration : 3000;
        const delayOption = !isNaN(options.delay) ? options.delay : 750;
        const animationDuration = duration / 1000;
        const cameraHeight = this._zoomToAltitude(zoom);
        const coords = coordinates.map(coord => olProj.transform([coord.lon, coord.lat], this.getProjection(), 'EPSG:4326'));
        // check for 3d map options
        const getCameraOpts = (opts, defaultOpts) => {
            if (!opts) {
                return defaultOpts;
            }
            return {
                heading: Cesium.Math.toRadians(opts.heading),
                roll: Cesium.Math.toRadians(opts.roll),
                pitch: Cesium.Math.toRadians(opts.pitch)
            };
        };
        const camera = getCameraOpts(options.camera);
        let index = 0;
        let delay = 0;
        let status = { steps: coordinates.length, step: 0 };

        const next = () => {
            this.notifyTourEvent(status);
            if (index < coordinates.length) {
                const location = coords[index];
                const locOptions = coordinates[index];
                const cameraValues = getCameraOpts(locOptions.camera, camera);
                const heightValue = locOptions.zoom ? this._zoomToAltitude(locOptions.zoom) : cameraHeight;
                const locationDuration = locOptions.duration ? locOptions.duration / 1000 : animationDuration;
                status = { ...status, step: index + 1 };
                let cancelled = () => this.notifyTourEvent(status, true);
                setTimeout(function () {
                    me._flyTo(location[0], location[1], heightValue, locationDuration, cameraValues, next, cancelled);
                    delay = !isNaN(locOptions.delay) ? locOptions.delay : delayOption;
                    index++;
                }, delay);
            }
        };
        next();
    }

    /**
     * Returns state for mapmodule including plugins that have getStateParameters() function
     * @method getStateParameters
     * @return {String} link parameters for map state
     */
    getStateParameters () {
        var params = '';
        var pluginName;

        if (this._map3D.getEnabled()) {
            var cam = this.getCamera();
            const { date, time } = this.getTimeParams();
            params +=
                '&cam=' + cam.location.x.toFixed(0) +
                '_' + cam.location.y.toFixed(0) +
                '_' + cam.location.altitude.toFixed(0) +
                '_' + cam.orientation.heading.toFixed(2) +
                '_' + cam.orientation.pitch.toFixed(2) +
                '_' + cam.orientation.roll.toFixed(2);
            params += '&time=' + date +
                '_' + time;
        }

        for (pluginName in this._pluginInstances) {
            if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getStateParameters) {
                params = params + this._pluginInstances[pluginName].getStateParameters();
            }
        }
        return params;
    }

    /**
     * Returns color expressions modified with layer opacity
     * @param {String | Object} colorDef Cesium style expression or object containing conditions array
     * @param {Number} opacity Layer opacity
     */
    _getColorExpressionsWithOpacity (colorDef, opacity) {
        if (!colorDef || isNaN(opacity)) {
            return colorDef;
        }
        const modifyExpression = expression => `(${expression}) * color('#FFF',${opacity})`;

        if (colorDef.conditions) {
            colorDef.conditions = colorDef.conditions.map(condition => {
                let cond = condition[0];
                let expression = modifyExpression(condition[1]);
                return [cond, expression];
            });
        } else {
            colorDef = modifyExpression(colorDef);
        }
        return colorDef;
    }

    /**
     * Creates style based on JSON
     * @param {VectorStyle} style
     * @param {number} opacity
     * @return {Cesium.Cesium3DTileStyle} style Cesium specific!
     */
    get3DStyle (style, opacity = 1) {
        if (opacity > 1) {
            opacity = opacity / 100.0;
        }
        let cesiumStyle;
        if (style.getType() === VECTOR_STYLE.OSKARI) {
            cesiumStyle = this.oskariStyleToCesium(style.getFeatureStyle());
        } else {
            cesiumStyle = style.getFeatureStyle();
            if (cesiumStyle.color) {
                // modify color by setting the layer opacity
                cesiumStyle.color = this._getColorExpressionsWithOpacity(cesiumStyle.color, opacity);
            } else {
                // Set light brown default color
                cesiumStyle.color = `color('${TILESET_DEFAULT_COLOR}', ${opacity})`;
            }
        }
        return new Cesium.Cesium3DTileStyle(cesiumStyle);
    }

    oskariStyleToCesium (featureStyle, opacity) {
        // TODO: should we support whole oskari style ??
        const cesiumStyle = {};
        // Set light brown default color;
        let color = TILESET_DEFAULT_COLOR;
        if (Oskari.util.keyExists(featureStyle, 'fill.color')) {
            color = featureStyle.fill.color;
            if (color.indexOf('rgb(') > -1) {
                // else check at if color is rgb
                color = '#' + Oskari.util.rgbToHex(color);
            }
        }
        cesiumStyle.color = `color('${color}', ${opacity})`;

        if (Oskari.util.keyExists(featureStyle, 'image.sizePx')) {
            cesiumStyle.pointSize = `${featureStyle.image.sizePx}`;
        }
        return cesiumStyle;
    }

    /**
     * To get Cesium scene object.
     * @return {Cesium.Scene} scene
     */
    getCesiumScene () {
        return this._map3D.getCesiumScene();
    }

    /**
     * To get mouse location on map
     * @param {Cesium.Cartesian2} position x,y on window
     * @return lonlat in map projection
     */
    getMouseLocation (position) {
        const scene = this.getCesiumScene();
        const { camera, globe } = scene;

        const ray = camera.getPickRay(position);
        const cartesian = globe.pick(ray, scene);
        if (!cartesian) {
            return;
        }
        const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
        let location = [
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude)
        ];
        location = olProj.transform(location, 'EPSG:4326', this.getProjection());
        const lonlat = { lon: location[0], lat: location[1] };
        return lonlat;
    }

    getVersion () {
        const olVersion = super.getVersion();
        return olVersion + ' - Cesium/' + Cesium.VERSION;
    }
}

Oskari.clazz.defineES(
    'Oskari.mapframework.ui.module.common.MapModule',
    MapModuleOlCesium,
    {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module']
    }
);
