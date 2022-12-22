import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showCoordinatePopup } from './CoordinatePopup';
import { PLACEMENTS } from 'oskari-ui/components/window';
import { getTransformedCoordinatesFromServer, transformCoordinates, formatDegrees } from './helper';

const cloneJSON = (original) => JSON.parse(JSON.stringify(original));

class UIHandler extends StateHandler {
    constructor (plugin, mapModule, config, instance) {
        super();
        this.instance = instance;
        this.plugin = plugin;
        this.sandbox = Oskari.getSandbox();
        this.loc = Oskari.getMsg.bind(null, 'coordinatetool');
        this.mapModule = mapModule;
        this.config = config;
        this.setState({
            xy: {},
            displayXy: {},
            loading: false,
            popupControls: null,
            showMouseCoordinates: false,
            selectedProjection: this.mapModule.getProjection(),
            originalProjection: this.mapModule.getProjection(),
            emergencyInfo: null,
            showReverseGeoCode: false
        });
        this.popupControls = null;
        this.eventHandlers = this.createEventHandlers();
        this.decimalSeparator = Oskari.getDecimalSeparator();
        this.preciseTransform = Array.isArray(this.config.supportedProjections);
        this.updateLonLat();
        this.getEmergencyCallInfo(this.state.xy);
    };

    getName () {
        return 'CoordinatePluginHandler';
    }

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    updatePopup () {
        if (this.popupControls) {
            this.popupControls.update(this.state);
        }
    }

    setLoading (status) {
        this.updateState({
            loading: status
        });
        this.updatePopup();
    }

    toggleMouseCoordinates () {
        this.updateState({
            showMouseCoordinates: !this.state.showMouseCoordinates
        });
        this.updatePopup();
    }

    toggleReverseGeoCode () {
        this.updateState({
            showReverseGeoCode: !this.state.showReverseGeoCode
        });
        this.updatePopup();
    }

    setLon (value) {
        const data = {
            'lonlat': {
                'lon': value,
                'lat': this.state?.xy?.lonlat?.lat
            }
        };
        this.updateLonLat(data);
    }

    setlat (value) {
        const data = {
            'lonlat': {
                'lon': this.state?.xy?.lonlat?.lon,
                'lat': value
            }
        };
        this.updateLonLat(data);
    }

    popupLocation () {
        const location = this.plugin.getLocation();
        if (location.includes('right')) {
            return PLACEMENTS.RIGHT;
        } else if (location.includes('left')) {
            return PLACEMENTS.LEFT;
        } else if (location.includes('top')) {
            return PLACEMENTS.TOP;
        } else {
            return PLACEMENTS.BOTTOM;
        }
    }

    updateLonLat (data, fromServer = false) {
        let xy = data;
        if (!xy || !xy.lonlat) {
            // update with map coordinates if coordinates not given
            xy = this.getMapXY();
        }

        this.updateState({
            xy: xy
        });

        if (this.preciseTransform && !fromServer) {
            try {
                const fromProjection = this.mapModule.getProjection();
                const toProjection = this.state.selectedProjection;
                xy = transformCoordinates(this.mapModule, xy, fromProjection, toProjection);
            } catch (e) {
                this.updateState({
                    xy: {},
                    displayXy: {}
                });
            }
        }

        const isSupported = !!((this.config && Array.isArray(this.config.supportedProjections)));
        const isDifferentProjection = !!((this.state.selectedProjection !== this.mapModule.getProjection() &&
            xy.lonlat.lat !== 0 && xy.lonlat.lon !== 0));
        let lat = parseFloat(xy.lonlat.lat);
        let lon = parseFloat(xy.lonlat.lon);

        lat = lat + '';
        lon = lon + '';
        if (lat.indexOf('~') === 0) {
            lat = lat.substring(1, lat.length);
        }
        lat = lat.replace(/,/g, '.');
        if (lon.indexOf('~') === 0) {
            lon = lon.substring(1, lat.length);
        }
        lon = lon.replace(/,/g, '.');

        lat = lat + '';
        lon = lon + '';
        if (lat.indexOf('~') === 0) {
            lat = lat.substring(1, lat.length);
        }
        lat = lat.replace(/,/g, '.');
        if (lon.indexOf('~') === 0) {
            lon = lon.substring(1, lat.length);
        }
        lon = lon.replace(/,/g, '.');

        // Need to show degrees ?
        if (this.allowDegrees() && !isNaN(lat) && !isNaN(lon)) {
            const degreePoint = Oskari.util.coordinateMetricToDegrees([lon, lat], this.getProjectionDecimals());
            lon = degreePoint[0];
            lat = degreePoint[1];
        }
        // Otherwise show meter units
        else if (!isNaN(lat) && !isNaN(lon)) {
            lat = parseFloat(lat);
            lon = parseFloat(lon);
            lat = lat.toFixed(this.getProjectionDecimals());
            lon = lon.toFixed(this.getProjectionDecimals());
            lat = this.formatNumber(lat, this.decimalSeparator);
            lon = this.formatNumber(lon, this.decimalSeparator);
        }

        // Not from server
        if (isSupported && isDifferentProjection && !fromServer) {
            lat = '~' + lat;
            lon = '~' + lon;
        }

        if (fromServer) {
            if (lon.indexOf('~') >= 0) {
                lon = lon.replace('~', '');
            }
            if (lat.indexOf('~') >= 0) {
                lat = lat.replace('~', '');
            }
        }

        this.updateState({
            displayXy: {
                'lonlat': {
                    'lon': lon,
                    'lat': lat
                }
            },
            loading: false
        });

        this.updatePopup();
    }

    setSelectedProjection (projection) {
        this.updateState({
            selectedProjection: projection
        });
        this.updateLonLat();
    }

    showPopup () {
        if (this.popupControls) {
            this.popupCleanup();
        } else {
            const crsText = this.loc('display.crs')[this.state.selectedProjection] || this.loc('display.crs.default', { crs: this.state.selectedProjection });
            this.popupControls = showCoordinatePopup(this.getState(), this.getController(), this.popupLocation(), this.config?.supportedProjections, this.preciseTransform, crsText, this.decimalSeparator, () => this.popupCleanup());
        }
    }

    centerMap () {
        try {
            const data = this.state.xy;
            if (!this.preciseTransform) {
                this.centerMapToSelectedCoordinates(data);
            } else {
                if (this.selectedProjection === this.mapModule.getProjection()) {
                    this.centerMapToSelectedCoordinates(data);
                } else {
                    this.getTransformedCoordinatesFromServer(data, false, false, true);
                }
            }
        } catch (e) {
            Messaging.error(this.loc('display.checkValuesDialog.message'));
        }
    }

    centerMapToSelectedCoordinates (data) {
        if (this.mapModule.isValidLonLat(data.lonlat.lon, data.lonlat.lat)) {
            const moveReqBuilder = Oskari.requestBuilder('MapMoveRequest');
            const moveReq = moveReqBuilder(data.lonlat.lon, data.lonlat.lat);
            this.sandbox.request(this, moveReq);
        } else {
            Messaging.error(this.loc('display.checkValuesDialog.message'));
        }
    }

    setMarker () {
        const data = this.state.xy || this.getMapXY();
        let lat = data?.lonlat?.lat;
        let lon = data?.lonlat?.lon;
        try {
            let msg = null;
            if (Oskari.util.coordinateIsDegrees([lon, lat]) && this.allowDegrees()) {
                msg = {
                    lat: lat,
                    lon: lon
                };
            }

            if (!this.preciseTransform) {
                this.addMarker(data, msg);
                this.centerMapToSelectedCoordinates(data);
            } else {
                if (this.state.selectedProjection === this.mapModule.getProjection()) {
                    this.addMarker(data, msg);
                    this.centerMapToSelectedCoordinates(data);
                } else {
                    this.getTransformedCoordinatesFromServer(data, true, false, true, msg);
                }
            }
        } catch (e) {
            Messaging.error(this.loc('display.checkValuesDialog.message'));
        }
    }

    addMarker (data, messageData) {
        const reqBuilder = Oskari.requestBuilder('MapModulePlugin.AddMarkerRequest');
        let lat = parseFloat(data.lonlat.lat);
        let lon = parseFloat(data.lonlat.lon);
        const inputLonLatData = {
            'lonlat': {
                'lat': lat,
                'lon': lon
            }
        };

        // Check at data is given. If data is given then use for it.
        // If not then use input data's and try change data to map projection and use it to place marker
        try {
            data = data || transformCoordinates(this.mapModule, inputLonLatData, this.state.selectedProjection, this.mapModule.getProjection());
        } catch (err) {
            // Cannot transform coordinates in transformCoordinates -function
            Messaging.error(this.loc('cannotTransformCoordinates.message'));
            return;
        }

        lat = lat.toFixed(this.getProjectionDecimals());
        lon = lon.toFixed(this.getProjectionDecimals());

        if (reqBuilder) {
            const msgLon = (messageData && messageData.lon) ? messageData.lon : lon;
            const msgLat = (messageData && messageData.lat) ? messageData.lat : lat;
            let msg = msgLat + ', ' + msgLon;
            if (this.config.supportedProjections) {
                msg += ' (' + (this.loc(`display.coordinatesTransform.projections.${this.state.selectedProjection}`) || this.state.selectedProjection) + ')';
            }

            const marker = {
                x: data.lonlat.lon,
                y: data.lonlat.lat,
                msg: msg,
                size: 5,
                color: 'ee9900',
                shape: 2
            };
            this.sandbox.request(this.plugin, reqBuilder(marker));
        }
    }

    getMapXY () {
        const map = this.sandbox.getMap();
        const data = {
            'lonlat': {
                'lat': parseFloat(map.getY()),
                'lon': parseFloat(map.getX())
            }
        };
        return data;
    }

    formatNumber (coordinate, decimalSeparator) {
        if (typeof coordinate !== 'string') {
            coordinate = coordinate + '';
        }
        coordinate = coordinate.replace('.', decimalSeparator);
        coordinate = coordinate.replace(',', decimalSeparator);
        return coordinate;
    }

    showDegrees () {
        const projection = this.state.selectedProjection || this.mapModule.getProjection();
        let showDegrees = (this.mapModule.getProjectionUnits() === 'degrees');
        const projFormats = this.config.projectionShowFormat || {};
        const formatDef = projFormats[projection];

        if (formatDef) {
            showDegrees = (formatDef.format === 'degrees');
        }
        return showDegrees;
    }

    allowDegrees (checkedProjection) {
        const selectedProjection = this.state.selectedProjection ? this.state.selectedProjection : this.mapModule.getProjection();
        const projection = checkedProjection || selectedProjection;

        const isProjectionShowConfig = !!((this.config.projectionShowFormat && this.config.projectionShowFormat[projection] && this.config.projectionShowFormat[projection].format));
        let isDegrees = !!(((isProjectionShowConfig && this.config.projectionShowFormat[projection].format === 'degrees') || this.mapModule.getProjectionUnits() === 'degrees'));

        const isAllProjectionConfig = !!((this.config.projectionShowFormat && typeof this.config.projectionShowFormat.format === 'string'));
        if (!isProjectionShowConfig && isAllProjectionConfig) {
            isDegrees = (this.config.projectionShowFormat.format === 'degrees');
        }
        return isDegrees;
    }

    formatDegrees (lon, lat, type) {
        return formatDegrees(lon, lat, type);
    }

    getProjectionDecimals (checkedProjection) {
        const conf = this.config;
        const selectedProjection = this.state.selectedProjection ? this.state.selectedProjection : this.mapModule.getProjection();
        const projection = checkedProjection || selectedProjection;
        const isProjectionShowConfig = !!((conf.projectionShowFormat && conf.projectionShowFormat[projection] && typeof conf.projectionShowFormat[projection].decimals === 'number'));

        let decimals = (isProjectionShowConfig) ? conf.projectionShowFormat[projection].decimals : this.mapModule.getProjectionDecimals(selectedProjection);

        const isAllProjectionConfig = !!((conf.projectionShowFormat && typeof conf.projectionShowFormat.decimals === 'number'));

        if (!isProjectionShowConfig && isAllProjectionConfig) {
            decimals = conf.projectionShowFormat.decimals;
        } else if (!isProjectionShowConfig && conf.roundToDecimals) {
            decimals = conf.roundToDecimals;
            this.sandbox.printWarn('Deprecated coordinatetool.conf.roundToDecimals - please use coordinatetool.conf.projectionShowFormat.decimals or ' +
                'coordinatetool.conf.projectionShowFormat["projection"].decimals instead.');
        }
        return decimals;
    }

    markersSupported () {
        const builder = Oskari.requestBuilder('MapModulePlugin.AddMarkerRequest');
        return !!builder;
    }

    async getTransformedCoordinatesFromServer (data, showMarker, swapProjections, centerMap, markerMessageData) {
        this.setLoading(true);
        data = data || this.getMapXY();
        let fromProj = this.state.selectedProjection;
        let toProj = this.mapModule.getProjection();

        if (swapProjections) {
            fromProj = this.mapModule.getProjection();
            toProj = this.state.selectedProjection;
        }

        try {
            const response = await getTransformedCoordinatesFromServer(this.mapModule, data, fromProj, toProj);
            if (response?.lat && response?.lon) {
                const newData = {
                    'lonlat': {
                        'lon': response.lon,
                        'lat': response.lat
                    }
                };

                if (showMarker) {
                    this.addMarker(newData, markerMessageData);
                }

                if (showMarker || centerMap) {
                    this.centerMap(newData);
                }

                if (!centerMap) {
                    this.updateLonLat(newData, true);
                }
            } else {
                this.updateLonLat();
            }
        } catch (e) {
            Messaging.error('display.cannotTransformCoordinates.message');
        }
        this.setLoading(false);
    }

    updateReverseGeocode (data) {}

    async getEmergencyCallCoordinatesFromServer (data) {
        // get the transform from current data
        const sourceProjection = this.mapModule.getProjection();

        // If coordinates are not  EPSG:4326 then
        // need to get 'EPSG:4326' coordinates from service
        if (sourceProjection !== 'EPSG:4326') {
            try {
                const response = await getTransformedCoordinatesFromServer(this.mapModule, data, sourceProjection, 'EPSG:4326');
                if (response?.lat && response?.lon) {
                    const newData = {
                        'lonlat': {
                            'lon': response.lon,
                            'lat': response.lat
                        }
                    };
                    return this.formatEmergencyCallMessage(newData);
                }
            } catch (e) {
                Messaging.error(this.loc('display.cannotTransformCoordinates.message'));
            }
        }
        // Else if coordinates are from 'EPSG:4326' then use these
        else {
            return this.formatEmergencyCallMessage(data);
        }
    }

    getEmergencyCallInfo (data) {
        const xy = data || this.getMapXY();

        // update emergency if configured
        if (this.config.showEmergencyCallMessage) {
            // already in degrees, don't fetch again
            if (this.allowDegrees() && this.mapModule.getProjection() === 'EPSG:4326') {
                this.updateState({
                    emergencyInfo: this.formatEmergencyCallMessage({
                        'lonlat': {
                            'lon': xy.lonlat.lon,
                            'lat': xy.lonlat.lat
                        }
                    })
                });
            } else {
                this.getEmergencyCallCoordinatesFromServer(data)
                    .then(emergencyData => {
                        this.updateState({
                            emergencyInfo: emergencyData
                        });
                    });
            }
        } else {
            this.updateState({
                emergencyInfo: null
            });
        }
        this.updatePopup();
    }

    formatEmergencyCallMessage (data) {
        const degmin = formatDegrees(data.lonlat.lon, data.lonlat.lat, 'min');

        let minutesX = '' + parseFloat(degmin.minutesX.replace(this.decimalSeparator, '.')).toFixed(3);
        minutesX = minutesX.replace('.', this.decimalSeparator);

        let minutesY = '' + parseFloat(degmin.minutesY.replace(this.decimalSeparator, '.')).toFixed(3);
        minutesY = minutesY.replace('.', this.decimalSeparator);

        return {
            degreesX: this.loc('display.compass.i') + ' ' + degmin.degreesX,
            degreesY: this.loc('display.compass.p') + ' ' + degmin.degreesY,
            minutesX,
            minutesY
        };
    }

    showReverseGeoCodeCheckbox () {
        return this.config?.reverseGeocodingIds?.split(',').length > 2;
    }

    createEventHandlers () {
        const handlers = {
            /**
             * @method MouseHoverEvent
             * See PorttiMouse.notifyHover
             */
            MouseHoverEvent: function (event) {
                if (this.state.showMouseCoordinates && !this.state.loading) {
                    const data = {
                        'lonlat': {
                            'lat': parseFloat(event.getLat()),
                            'lon': parseFloat(event.getLon())
                        }
                    };
                    const dataServer = cloneJSON(data);

                    this.updateLonLat(cloneJSON(data));

                    if (event.isPaused() && this.preciseTransform) {
                        this.getTransformedCoordinatesFromServer(dataServer, false, true);
                    }

                    if (event.isPaused() && this.config.isReverseGeocode) {
                        this.updateReverseGeocode(cloneJSON(data));
                    }

                    if (event.isPaused()) {
                        this.getEmergencyCallInfo(cloneJSON(data));
                    }
                }
            },
            /**
             * @method AfterMapMoveEvent
             * Shows map center coordinates after map move
             */
            AfterMapMoveEvent: function (event) {
                if (!this.state.showMouseCoordinates) {
                    this.updateState({
                        loading: true
                    });

                    if (this.preciseTransform) {
                        this.getTransformedCoordinatesFromServer(null, false, true);
                    } else {
                        this.updateLonLat();
                    }
                }
                this.getEmergencyCallInfo();
            },
            /**
             * @method MapClickedEvent
             * @param {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event
             */
            MapClickedEvent: function (event) {
                const lonlat = event.getLonLat();
                const data = {
                    'lonlat': {
                        'lat': parseFloat(lonlat.lat),
                        'lon': parseFloat(lonlat.lon)
                    }
                };
                const dataServer = cloneJSON(data);
                if (!this.showMouseCoordinates) {
                    if (this.preciseTransform) {
                        this.getTransformedCoordinatesFromServer(dataServer, false, true);
                    } else {
                        this.updateLonLat(data);
                    }
                }

                this.getEmergencyCallInfo(cloneJSON(data));
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'toggleMouseCoordinates',
    'showDegrees',
    'showPopup',
    'markersSupported',
    'setMarker',
    'centerMap',
    'setLat',
    'setLon',
    'setLoading',
    'setSelectedProjection',
    'allowDegrees',
    'formatDegrees',
    'popupCleanup',
    'showReverseGeoCodeCheckbox'
]);

export { wrapped as CoordinatePluginHandler };
