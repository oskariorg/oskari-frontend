import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showCoordinatePopup } from './CoordinatePopup';
import { PLACEMENTS } from 'oskari-ui/components/window';
import { getTransformedCoordinates, transformCoordinates, formatDegrees } from './helper';

class UIHandler extends StateHandler {
    constructor (plugin, mapModule, config, instance) {
        super();
        this.instance = instance;
        this.plugin = plugin;
        this.sandbox = Oskari.getSandbox();
        this.loc = Oskari.getMsg.bind(null, 'coordinatetool');
        this.mapModule = mapModule;
        this.config = config;
        this.originalProjection = this.mapModule.getProjection();
        this.isReverseGeoCode = this.config.isReverseGeocode;
        this.reverseGeocodingIds = this.config.reverseGeocodingIds?.split(',');
        this.setState({
            xy: {},
            latField: '',
            lonField: '',
            loading: false,
            showMouseCoordinates: false,
            selectedProjection: this.originalProjection,
            emergencyInfo: null,
            reverseGeocodeNotImplementedError: false,
            reverseGeoCode: [],
            showReverseGeoCode: false,
            approxValue: false
        });
        this.popupControls = null;
        this.eventHandlers = this.createEventHandlers();
        this.decimalSeparator = Oskari.getDecimalSeparator();
        this.preciseTransform = Array.isArray(this.config.supportedProjections);
        this.popupListeners = [];
        this.addStateListener(() => this.updatePopup());
    };

    addPopupListener (func) {
        this.popupListeners.push(func);
    }

    notifyPopupListeners (isOpen) {
        this.popupListeners.forEach(func => func(isOpen));
    }

    getName () {
        return 'CoordinatePluginHandler';
    }

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
        this.notifyPopupListeners(false);
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
    }

    toggleMouseCoordinates () {
        this.updateState({
            showMouseCoordinates: !this.state.showMouseCoordinates
        });
    }

    toggleReverseGeoCode () {
        this.updateState({
            showReverseGeoCode: !this.state.showReverseGeoCode
        });
    }

    setLonInputValue (value) {
        this.updateState({
            lonField: value
        });
    }

    setLatInputValue (value) {
        this.updateState({
            latField: value
        });
    }

    async useUserDefinedCoordinates () {
        let data = {
            lonlat: {
                lon: this.state.lonField,
                lat: this.state.latField
            }
        };
        const converted = await this.convertCoordinates(data, this.state.selectedProjection, this.originalProjection);
        this.updateLonLat(converted, true, true, true);
    }

    coordinatesToMetric (data) {
        const converted = Oskari.util.coordinateDegreesToMetric([data.lonlat?.lon, data.lonlat?.lat], 10);
        const lon = converted[0];
        const lat = converted[1];

        return {
            'lonlat': {
                'lon': lon,
                'lat': lat
            }
        };
    }

    isMapCentered () {
        const mapXy = this.getMapXY();
        if (
            mapXy?.lonlat?.lon === this.state.xy?.lonlat?.lon &&
            mapXy?.lonlat?.lat === this.state.xy?.lonlat?.lat
        ) {
            return true;
        }
        return false;
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

    async convertCoordinates (data, fromProjection, toProjection) {
        if (this.preciseTransform && this.state.selectedProjection !== this.originalProjection) {
            if (Oskari.util.coordinateIsDegrees([data.lonlat?.lon, data.lonlat?.lat])) {
                data = this.coordinatesToMetric(data);
            }
            data = {
                lonlat: {
                    lon: this.formatNumber(data?.lonlat?.lon, '.'),
                    lat: this.formatNumber(data?.lonlat?.lat, '.')
                }
            };
            data = await this.getTransformedCoordinatesFromServer(data, fromProjection, toProjection);
        }
        return data;
    }

    updateLonLat (data, getDataFromServer = false, updateReverseGeoCode = false, updateEmergencyCallInfo = false) {
        if (!data || !data.lonlat) {
            // update with map coordinates if coordinates not given
            data = this.getMapXY();
        }

        this.updateState({
            xy: data
        });

        if (this.isReverseGeoCode && updateReverseGeoCode) {
            this.updateReverseGeocode(data);
        }

        if (updateEmergencyCallInfo) {
            this.getEmergencyCallInfo(data);
        }

        this.updateDisplayValues(data, getDataFromServer);
    }

    async updateDisplayValues (data, getDataFromServer) {
        let fromServer = false;

        if (getDataFromServer) {
            data = await this.convertCoordinates(data, this.originalProjection, this.state.selectedProjection);
            fromServer = true;
        } else if (this.preciseTransform && (this.state.selectedProjection !== this.originalProjection)) {
            try {
                data = transformCoordinates(this.mapModule, data, this.originalProjection, this.state.selectedProjection);
            } catch (e) {
                data = await this.convertCoordinates(data, this.originalProjection, this.state.selectedProjection);
            }
        }

        const isSupported = !!((this.config && Array.isArray(this.config.supportedProjections)));
        const isDifferentProjection = !!((this.state.selectedProjection !== this.originalProjection &&
            data?.lonlat?.lat !== 0 && data?.lonlat?.lon !== 0));

        let lat = parseFloat(data?.lonlat?.lat);
        let lon = parseFloat(data?.lonlat?.lon);

        // Need to show degrees ?
        if (this.allowDegrees() && !isNaN(lat) && !isNaN(lon)) {
            const degreePoint = Oskari.util.coordinateMetricToDegrees([lon, lat], this.getProjectionDecimals());
            lon = degreePoint[0];
            lat = degreePoint[1];
        }
        // Otherwise show meter units
        else if (!isNaN(lat) && !isNaN(lon)) {
            lat = lat.toFixed(this.getProjectionDecimals());
            lon = lon.toFixed(this.getProjectionDecimals());
            lat = this.formatNumber(lat, this.decimalSeparator);
            lon = this.formatNumber(lon, this.decimalSeparator);
        }

        this.updateState({
            latField: lat,
            lonField: lon,
            approxValue: !fromServer && isSupported && isDifferentProjection
        });
    }

    setSelectedProjection (projection) {
        this.updateState({
            selectedProjection: projection
        });
        this.updateDisplayValues(this.state.xy, true);
    }

    showPopup () {
        if (this.popupControls) {
            this.popupCleanup();
        } else {
            const crsText = this.loc('display.crs')[this.state.selectedProjection] || this.loc('display.crs.default', { crs: this.state.selectedProjection });
            this.popupControls = showCoordinatePopup(
                this.getState(),
                this.getController(),
                this.popupLocation(),
                this.config?.supportedProjections,
                this.preciseTransform,
                crsText,
                this.decimalSeparator,
                this.reverseGeocodingIds?.length > 2,
                () => this.popupCleanup()
            );
            this.updateLonLat(this.getMapXY(), true, true, true);
            this.notifyPopupListeners(true);
        }
    }

    centerMap (coordinates) {
        try {
            let data = coordinates || this.state.xy;
            this.centerMapToSelectedCoordinates(data);
        } catch (e) {
            Messaging.error(this.loc('display.checkValuesDialog.message'));
        }
    }

    centerMapToSelectedCoordinates (data) {
        if (this.mapModule.isValidLonLat(data.lonlat.lon, data.lonlat.lat)) {
            this.sandbox.postRequestByName('MapMoveRequest', [data.lonlat.lon, data.lonlat.lat, this.sandbox.getMap().getZoom()]);
            this.updateLonLat(data, true, true, true);
        } else {
            Messaging.error(this.loc('display.checkValuesDialog.message'));
        }
    }

    setMarker () {
        this.centerMap();
        const data = this.state.xy || this.getMapXY();
        const displayData = { lonlat: { lon: this.state.lonField, lat: this.state.latField } } || this.getMapXY();
        let lat = displayData?.lonlat?.lat || data?.lonlat?.lat;
        let lon = displayData?.lonlat?.lon || data?.lonlat?.lon;
        try {
            let msg = null;
            if (Oskari.util.coordinateIsDegrees([lon, lat]) && this.allowDegrees()) {
                msg = {
                    lat: lat,
                    lon: lon
                };
            } else {
                msg = {
                    lat: displayData?.lonlat?.lat,
                    lon: displayData?.lonlat?.lon
                };
            }
            this.addMarker(data, msg);
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
            data = data || transformCoordinates(this.mapModule, inputLonLatData, this.state.selectedProjection, this.originalProjection);
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
        const projection = this.state.selectedProjection || this.originalProjection;
        let showDegrees = (this.mapModule.getProjectionUnits() === 'degrees');
        const projFormats = this.config.projectionShowFormat || {};
        const formatDef = projFormats[projection];

        if (formatDef) {
            showDegrees = (formatDef.format === 'degrees');
        }
        return showDegrees;
    }

    allowDegrees (checkedProjection) {
        const selectedProjection = this.state.selectedProjection ? this.state.selectedProjection : this.originalProjection;
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
        const selectedProjection = this.state.selectedProjection ? this.state.selectedProjection : this.originalProjection;
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

    async getTransformedCoordinatesFromServer (data, fromProjection, toProjection) {
        this.setLoading(true);
        data = data || this.getMapXY();
        try {
            const response = await getTransformedCoordinates(this.originalProjection, data, fromProjection, toProjection);
            if (response?.lat && response?.lon) {
                const newData = {
                    'lonlat': {
                        'lon': response.lon,
                        'lat': response.lat
                    }
                };
                this.setLoading(false);
                return newData;
            } else {
                this.setLoading(false);
                return data;
            }
        } catch (e) {
            this.setLoading(false);
            Messaging.error(this.loc('display.cannotTransformCoordinates.message'));
        }
    }

    updateReverseGeocode (data) {
        const service = this.instance.getService();

        if (!this.popupControls || this.state.reverseGeocodeNotImplementedError) {
            return;
        }

        if (!data || !data.lonlat) {
            // update with map coordinates if coordinates not given
            data = this.getMapXY();
        }

        let reverseGeoCode = [];

        service.getReverseGeocode(
            // Success callback
            (response) => {
                const hasResponse = !!((response && response.length > 0));
                const locale = this.loc('display.reversegeocode');
                // type title is not found in locales
                if (hasResponse && locale[response[0].channelId]) {
                    for (let i = 0; i < response.length; i++) {
                        const r = response[i];
                        let title = locale[r.channelId].label;
                        if (!title) {
                            title = r.type;
                        }
                        reverseGeoCode.push({
                            title: title,
                            name: r.name
                        });
                    }
                    this.updateState({
                        reverseGeoCode: reverseGeoCode
                    });
                } else {
                    this.updateState({
                        reverseGeoCode: []
                    });
                }
            },
            // Error callback
            (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status === 501) {
                    this.updateState({
                        reverseGeocodeNotImplementedError: true
                    });
                }
                let messageJSON;
                try {
                    messageJSON = jQuery.parseJSON(jqXHR.responseText);
                } catch (err) {}
                let message = this.instance.getName() + ': Cannot reverse geocode';
                if (messageJSON && messageJSON.error) {
                    message = this.instance.getName() + ': ' + messageJSON.error;
                }

                Oskari.log('coordinatetool').warn(message);
                this.updateState({
                    reverseGeoCode: []
                });
            },
            data.lonlat.lon, data.lonlat.lat
        );
    }

    async getEmergencyCallCoordinatesFromServer (data) {
        // get the transform from current data
        const sourceProjection = this.originalProjection;

        // If coordinates are not  EPSG:4326 then
        // need to get 'EPSG:4326' coordinates from service
        if (sourceProjection !== 'EPSG:4326') {
            try {
                const response = await getTransformedCoordinates(this.originalProjection, data, sourceProjection, 'EPSG:4326');
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

    async getEmergencyCallInfo (data) {
        const xy = data || this.getMapXY();

        // update emergency if configured
        if (this.config.showEmergencyCallMessage) {
            // already in degrees, don't fetch again
            if (this.allowDegrees() && this.originalProjection === 'EPSG:4326') {
                this.updateState({
                    emergencyInfo: this.formatEmergencyCallMessage({
                        'lonlat': {
                            'lon': xy.lonlat.lon,
                            'lat': xy.lonlat.lat
                        }
                    })
                });
            } else {
                await this.getEmergencyCallCoordinatesFromServer(data)
                    .then(emergencyData => {
                        this.updateState({
                            emergencyInfo: emergencyData
                        });
                    });
            }
        }
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
                    if (event.isPaused()) {
                        this.updateLonLat(data, true, true, true);
                    } else {
                        this.updateLonLat(data, false, false, false);
                    }
                }
            },
            /**
             * @method AfterMapMoveEvent
             * Shows map center coordinates after map move
             */
            AfterMapMoveEvent: function (event) {
                if (!this.popupControls) return;
                if (!this.state.showMouseCoordinates) {
                    this.updateLonLat(this.getMapXY(), true, true, true);
                }
            },
            /**
             * @method MapClickedEvent
             * @param {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event
             */
            MapClickedEvent: function (event) {
                if (!this.popupControls) return;
                const lonlat = event.getLonLat();
                const data = {
                    'lonlat': {
                        'lat': parseFloat(lonlat.lat),
                        'lon': parseFloat(lonlat.lon)
                    }
                };
                if (!this.showMouseCoordinates) {
                    this.updateLonLat(data, true, true, true);
                }
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
    'setLonInputValue',
    'setLatInputValue',
    'setLoading',
    'setSelectedProjection',
    'allowDegrees',
    'formatDegrees',
    'toggleReverseGeoCode',
    'useUserDefinedCoordinates',
    'isMapCentered',
    'popupCleanup'
]);

export { wrapped as CoordinatePluginHandler };
