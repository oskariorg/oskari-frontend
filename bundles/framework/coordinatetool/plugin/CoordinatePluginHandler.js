import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showCoordinatePopup } from './CoordinatePopup';
import { PLACEMENTS } from 'oskari-ui/components/window';
import { getTransformedCoordinates, transformCoordinates, isTransformAllowed } from './helper';

class UIHandler extends StateHandler {
    constructor (plugin, mapModule, config) {
        super();
        this.plugin = plugin;
        this.sandbox = Oskari.getSandbox();
        this.loc = Oskari.getMsg.bind(null, 'coordinatetool');
        this.mapModule = mapModule;
        this.config = config;

        const coordinateToolService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.coordinatetool.CoordinateToolService',
            this.sandbox, config || {}
        );
        this.sandbox.registerService(coordinateToolService);
        this.service = coordinateToolService;
        this.mapProjection = this.mapModule.getProjection();
        this.isReverseGeoCode = this.config.isReverseGeocode;
        this.reverseGeocodingIds = this.config.reverseGeocodingIds?.split(',');
        this.setState({
            xy: {},
            latField: '',
            lonField: '',
            loading: false,
            showMouseCoordinates: false,
            selectedProjection: this.mapProjection,
            emergencyInfo: null,
            reverseGeocodeNotImplementedError: false,
            reverseGeoCode: [],
            showReverseGeoCode: false,
            approxValue: false
        });
        this.popupControls = null;
        this.eventHandlers = this.createEventHandlers();
        this.decimalSeparator = Oskari.getDecimalSeparator();
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

    isTransformAllowed () {
        if (typeof this.__transformAllowed !== 'undefined') {
            return this.__transformAllowed;
        }
        const { supportedProjections } = this.config;
        this.__transformAllowed = isTransformAllowed(supportedProjections);
        return this.__transformAllowed;
    }

    // prefer proj specific and default to global format
    getProjectionShowFormat (selectedProj = this.state.selectedProjection) {
        const projection = selectedProj || this.mapProjection;
        const projConfig = this.config?.projectionShowFormat?.[projection] || {};
        const globalFormat = this.config?.projectionShowFormat?.format;
        return projConfig.format || globalFormat;
    }

    // prefer proj specific, global format, deprecated conf and default to mapmodule logic
    getProjectionDecimals (selectedProj = this.state.selectedProjection) {
        const projection = selectedProj || this.mapProjection;
        const conf = this.config;
        const projConfig = conf?.projectionShowFormat?.[projection] || {};
        const globalFormat = conf?.projectionShowFormat?.decimals;
        const decimalCount = projConfig.decimals || globalFormat;
        if (typeof decimalCount === 'number' && decimalCount >= 0) {
            return decimalCount;
        }
        const deprecatedConf = conf?.roundToDecimals;
        if (deprecatedConf) {
            Oskari.log('coordinatetool').warn('Deprecated coordinatetool.conf.roundToDecimals - please use coordinatetool.conf.projectionShowFormat.decimals or ' +
                'coordinatetool.conf.projectionShowFormat["projection"].decimals instead.');
            if (typeof deprecatedConf === 'number' && deprecatedConf >= 0) {
                return conf.roundToDecimals;
            }
        }
        return this.mapModule.getProjectionDecimals(projection);
    }

    async useUserDefinedCoordinates () {
        const data = {
            lonlat: {
                lon: this.formatNumber(this.state.lonField, '.'),
                lat: this.formatNumber(this.state.latField, '.')
            }
        };

        // Check if format should be degrees and add '°' symbol if needed
        const isDegrees = this.getProjectionShowFormat() === 'degrees';
        if (isDegrees) {
            if (data.lonlat.lon.indexOf('°') < 0) data.lonlat.lon = data.lonlat.lon + '°';
            if (data.lonlat.lat.indexOf('°') < 0) data.lonlat.lat = data.lonlat.lat + '°';
        }

        const converted = await this.convertCoordinates(data, this.state.selectedProjection, this.mapProjection);
        this.updateLonLat(converted, true, true, true);
    }

    coordinatesToMetric (data) {
        const converted = Oskari.util.coordinateDegreesToMetric([data.lonlat?.lon, data.lonlat?.lat], 10);

        return {
            lonlat: {
                lon: converted[0],
                lat: converted[1]
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
        if (this.isTransformAllowed() && this.state.selectedProjection !== this.mapProjection) {
            if (Oskari.util.coordinateIsDegrees([data.lonlat?.lon, data.lonlat?.lat])) {
                data = this.coordinatesToMetric(data);
            }
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
            data = await this.convertCoordinates(data, this.mapProjection, this.state.selectedProjection);
            fromServer = true;
        } else if (this.isTransformAllowed() && (this.state.selectedProjection !== this.mapProjection)) {
            try {
                data = transformCoordinates(this.mapModule, data, this.mapProjection, this.state.selectedProjection);
            } catch (e) {
                data = await this.convertCoordinates(data, this.mapProjection, this.state.selectedProjection);
            }
        }

        const isSupported = !!((this.config && Array.isArray(this.config.supportedProjections)));
        const isDifferentProjection = !!((this.state.selectedProjection !== this.mapProjection &&
            data?.lonlat?.lat !== 0 && data?.lonlat?.lon !== 0));

        let lat = parseFloat(data?.lonlat?.lat);
        let lon = parseFloat(data?.lonlat?.lon);

        // Need to show degrees ?
        if (this.isCurrentUnitDegrees() && !isNaN(lat) && !isNaN(lon)) {
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
            this.popupControls = showCoordinatePopup(
                this.getState(),
                this.getController(),
                this.popupLocation(),
                this.config?.supportedProjections,
                this.reverseGeocodingIds?.length > 2,
                () => this.popupCleanup()
            );
            this.updateLonLat(this.getMapXY(), true, true, true);
            this.notifyPopupListeners(true);
        }
    }

    centerMap (coordinates) {
        try {
            const data = coordinates || this.state.xy;
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
        const displayData = (this.state?.lonField && this.state?.latField) ? { lonlat: { lon: this.state.lonField, lat: this.state.latField } } : this.getMapXY();
        const lat = displayData?.lonlat?.lat || data?.lonlat?.lat;
        const lon = displayData?.lonlat?.lon || data?.lonlat?.lon;
        try {
            let msg = null;
            if (Oskari.util.coordinateIsDegrees([lon, lat]) && this.isCurrentUnitDegrees()) {
                msg = {
                    lat,
                    lon
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
            lonlat: {
                lat,
                lon
            }
        };

        // Check at data is given. If data is given then use for it.
        // If not then use input data's and try change data to map projection and use it to place marker
        try {
            data = data || transformCoordinates(this.mapModule, inputLonLatData, this.state.selectedProjection, this.mapProjection);
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
                msg,
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
            lonlat: {
                lat: parseFloat(map.getY()),
                lon: parseFloat(map.getX())
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

    isCurrentUnitDegrees () {
        const projection = this.state.selectedProjection || this.mapProjection;
        const formatDef = this.getProjectionShowFormat(projection);
        const defaultedToMapmodule = formatDef || this.mapModule.getProjectionUnits();
        return defaultedToMapmodule === 'degrees';
    }

    async getTransformedCoordinatesFromServer (data, fromProjection, toProjection) {
        this.setLoading(true);
        data = data || this.getMapXY();
        try {
            const response = await getTransformedCoordinates(this.mapProjection, data, fromProjection, toProjection);
            if (response?.lat && response?.lon) {
                const newData = {
                    lonlat: {
                        lon: response.lon,
                        lat: response.lat
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
        const service = this.service;

        if (!this.popupControls || this.state.reverseGeocodeNotImplementedError) {
            return;
        }

        if (!data || !data.lonlat) {
            // update with map coordinates if coordinates not given
            data = this.getMapXY();
        }

        const reverseGeoCode = [];

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
                            title,
                            name: r.name
                        });
                    }
                    this.updateState({
                        reverseGeoCode
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
                let message = 'Cannot reverse geocode';
                if (messageJSON && messageJSON.error) {
                    message = messageJSON.error;
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
        const sourceProjection = this.mapProjection;

        // If coordinates are not  EPSG:4326 then
        // need to get 'EPSG:4326' coordinates from service
        if (sourceProjection !== 'EPSG:4326') {
            try {
                const response = await getTransformedCoordinates(this.mapProjection, data, sourceProjection, 'EPSG:4326');
                if (response?.lat && response?.lon) {
                    const newData = {
                        lonlat: {
                            lon: response.lon,
                            lat: response.lat
                        }
                    };
                    return this.simplifyEmergencyData(newData);
                }
            } catch (e) {
                Messaging.error(this.loc('display.cannotTransformCoordinates.message'));
            }
        }
        // Else if coordinates are from 'EPSG:4326' then use these
        else {
            return this.simplifyEmergencyData(data);
        }
    }

    async getEmergencyCallInfo (data) {
        if (!this.config.showEmergencyCallMessage) {
            return;
        }
        // update emergency if configured
        const xy = data || this.getMapXY();
        // already in degrees, don't fetch again
        if (this.isCurrentUnitDegrees() && this.mapProjection === 'EPSG:4326') {
            this.updateState({
                emergencyInfo: this.simplifyEmergencyData({
                    lonlat: {
                        lon: xy.lonlat.lon,
                        lat: xy.lonlat.lat
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

    // just simplifying the object
    simplifyEmergencyData (data) {
        return {
            lon: data.lonlat.lon,
            lat: data.lonlat.lat
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
                        lonlat: {
                            lat: parseFloat(event.getLat()),
                            lon: parseFloat(event.getLon())
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
                    lonlat: {
                        lat: parseFloat(lonlat.lat),
                        lon: parseFloat(lonlat.lon)
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
        const handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'toggleMouseCoordinates',
    'isCurrentUnitDegrees',
    'showPopup',
    'setMarker',
    'centerMap',
    'setLonInputValue',
    'setLatInputValue',
    'setLoading',
    'setSelectedProjection',
    'toggleReverseGeoCode',
    'useUserDefinedCoordinates',
    'isMapCentered',
    'popupCleanup'
]);

export { wrapped as CoordinatePluginHandler };
