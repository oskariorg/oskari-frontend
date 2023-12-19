import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showSidePanel } from 'oskari-ui/components/window';
import { FORMAT_OPTIONS, PREVIEW_SCALED_WIDTH, UNSUPPORTED_FOR_CONFIGURED_SCALE } from './constants';

class UIHandler extends StateHandler {
    constructor (consumer, instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this.setState({
            size: 'A4',
            format: 'application/pdf',
            mapTitle: '',
            showScale: true,
            showDate: true,
            previewImage: null,
            scaleType: 'map',
            scale: null,
            showTimeSeriesDate: true,
            // impl for toggling coordinates is commented out in JSX. This will be enabled on future release.
            showCoordinates: false,
            coordinatePosition: 'center',
            coordinateProjection: 'map',
            isTimeSeries: false
        });
        this.sidePanel = null;
        this.eventHandlers = this.createEventHandlers();
        this.addStateListener(consumer);
    };

    getName () {
        return this.instance.getName();
    }

    updatePanel (title, content) {
        if (this.sidePanel) {
            this.sidePanel.update(title, content);
        }
    }

    showPanel (title, content, onClose) {
        if (!this.sidePanel) {
            this.sidePanel = showSidePanel(title, content, onClose);
        }
        if (this._isTimeSeriesActive()) {
            this.updateState({ isTimeSeries: true });
        }
    }

    closePanel () {
        if (this.sidePanel) {
            this.sidePanel.close();
            this.sidePanel = null;
        }
    }

    updateField (field, value) {
        this.updateState({
            [field]: value
        });
        if (field === 'size') {
            this.refreshPreview(true);
        }
        if (field === 'scale') {
            this.mapModule.zoomToScale(value, false);
        }
    }

    updateScaleType (scaleType) {
        let scale = null;
        if (scaleType === 'configured') {
            // select closest value by current scale
            const mapScale = this.mapModule.getMapScale();
            const scales = this.instance.scaleOptions;
            scale = scales.reduce((prev, curr) => Math.abs(curr - mapScale) < Math.abs(prev - mapScale) ? curr : prev);
            this.mapModule.zoomToScale(scale, false);

            // notify user about ignored layers
            const unsupported = this._getVisibleLayers()
                .filter(layer => UNSUPPORTED_FOR_CONFIGURED_SCALE.includes(layer.getLayerType()))
                .map(layer => layer.getName());
            if (unsupported.length) {
                const msg = this.instance.loc('BasicView.scale.unsupportedLayersMessage');
                Messaging.warn({
                    content: `${msg}: ${unsupported.join()}.`,
                    duration: 10
                });
            }
            // disable map zoom
            this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest', [['zoom']]);
            this.sandbox.postRequestByName('DisableMapMouseMovementRequest', [['zoom']]);
        } else {
            this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest', [['zoom']]);
            this.sandbox.postRequestByName('EnableMapMouseMovementRequest', [['zoom']]);
        }
        this.updateState({ scaleType, scale });
    }

    refreshPreview () {
        const baseLayer = this.mapModule.getBaseLayer();
        this.updateState({
            previewImage: this.getUrlForPreview(baseLayer),
            baseLayerId: baseLayer?.getId()
        });
    }

    printMap () {
        // ask for optimized link with non-visible layers excluded
        const optimized = true;
        const srs = this.sandbox.getMap().getSrsName();
        const maplinkArgs = this.sandbox.generateMapLinkParameters({ srs }, optimized);
        const params = this.gatherParamsFromState();

        const url = Oskari.urls.getRoute('GetPrint', params) + '&' + maplinkArgs;

        Oskari.log('BasicPrintout').debug('PRINT POST URL ' + url);
        const payload = {
            customStyles: this.getSelectedCustomStyles()
        };
        this.getPostPrint(url, params, payload);
    }

    _getResolution () {
        if (this.instance.conf.scaleSelection && this.state.scaleType === 'configured') {
            this.mapModule.getExactResolution(this.state.scale);
        }
        return this.sandbox.getMap().getResolution();
    }

    _getVisibleLayers () {
        // use same visibility filter as mapfull
        return this.sandbox.findAllSelectedMapLayers()
            .filter(l => l.isVisibleOnMap());
    }

    _getTopmostTimeseries () {
        return this._getVisibleLayers().findLast(l => l.hasTimeseries());
    }

    _isTimeSeriesActive () {
        return !!this._getTopmostTimeseries();
    }

    _getTimeParam () {
        const layer = this._getTopmostTimeseries();
        if (!layer) {
            return '';
        }
        return layer.getParams().time || '';
    }

    gatherParamsFromState () {
        const params = {
            pageSize: this.state.size,
            format: this.state.format,
            resolution: this._getResolution(),
            pageTitle: this.state.mapTitle,
            pageScale: this.state.showScale,
            pageDate: this.state.showDate,
            pageTimeSeriesTime: this.state.showTimeSeriesDate,
            lang: Oskari.getLang(),
            coordinateSRS: this.mapModule.getProjection()
        };

        if (this.state.scale) {
            params.scaleText = '1:' + this.state.scale;
        }

        // check if other target crs setting beside default has been selected
        if (this.state.showCoordinates) {
            params.coordinateInfo = this.state.coordinatePosition;
            params.coordinateSRS = this.state.coordinateProjection === 'map' ? this.mapModule.getProjection() : this.state.coordinateProjection;
        }
        if (this.state.isTimeSeries) {
            const time = this._getTimeParam();
            params.time = time;
            if (this.state.showTimeSeriesDate) {
                const splittedTime = time.split('/')[0];
                params.formattedTime = Oskari.util.formatDate(splittedTime);
                params.timeseriesPrintLabel = this.instance.loc('BasicView.content.pageTimeSeriesTime.printLabel');
            }
        }
        return params;
    }

    /**
     * @private @method openPostPrint
     * Sends the gathered map data to the server to save them/publish the map.
     *
     * @param {String} printUrl
     * @param {Object} params
     * @param {Object} customStyles
     *
     */
    getPostPrint (printUrl, params, payload) {
        let fileName = params.pageTitle || 'print';
        const format = FORMAT_OPTIONS.find(format => format.mime === params.format);
        if (format) {
            fileName += '.' + format.name;
        }

        this.updateState({
            loading: true
        });
        const successCb = blob => {
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                const url = window.URL.createObjectURL(blob);
                const elem = document.createElement('a');
                elem.href = url;
                elem.download = fileName;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
                window.URL.revokeObjectURL(url);
            }
            this.updateState({
                loading: false
            });
        };
        const errorCb = error => {
            Oskari.log('BasicPrintout').error(error);
            this.updateState({
                loading: false
            });
            Messaging.error(Oskari.getMsg('Printout', 'BasicView.error.saveFailed'));
        };
        this.instance.getService().fetchPrint(printUrl, payload, successCb, errorCb);
    }

    getSelectedCustomStyles () {
        const customStyles = {};
        this._getVisibleLayers().forEach(l => {
            const style = l.getCurrentStyle();
            if (typeof style.isRuntimeStyle === 'function' && style.isRuntimeStyle()) {
                customStyles[l.getId()] = style.getFeatureStyle();
            }
        });
        return customStyles;
    }

    getUrlForPreview (layer) {
        if (!layer) {
            return null;
        }
        const map = Oskari.getSandbox().getMap();

        const mapLayers =
            layer.getId() + ' ' +
            layer.getOpacity() + ' ' +
            layer.getCurrentStyle().getName();

        const params = {
            format: 'image/png',
            pageSize: this.state.size,
            resolution: this._getResolution(),
            srs: map.getSrsName(),
            coord: `${map.getX()}_${map.getY()}`,
            mapLayers,
            scaledWidth: PREVIEW_SCALED_WIDTH,
            coordinateSRS: this.mapModule.getProjection()
        };
        if (layer.hasTimeseries()) {
            params.time = this._getTimeParam();
        }
        return Oskari.urls.getRoute('GetPrint', params);
    }

    createEventHandlers () {
        const onLayerEvent = event => {
            const layer = event.getMapLayer();
            const id = this.state.baseLayerId;
            if (!id || layer.getId() === id) {
                // only baselayer is shown in preview
                this.refreshPreview();
            }
            if (layer.hasTimeseries()) {
                this.updateState({
                    isTimeSeries: this._isTimeSeriesActive()
                });
            }
        };
        const handlers = {
            MapLayerVisibilityChangedEvent: onLayerEvent,
            AfterMapMoveEvent: () => this.refreshPreview(),
            AfterMapLayerAddEvent: onLayerEvent,
            AfterChangeMapLayerStyleEvent: onLayerEvent,
            AfterMapLayerRemoveEvent: (event) => {
                if (event.getMapLayer().getId() === this.state.baseLayerId) {
                    this.updateState({ baseLayerId: null });
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        const handler = this.eventHandlers[e.getName()];
        if (!handler || !this.sidePanel) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'updateField',
    'updateScaleType',
    'printMap'
]);

export { wrapped as PrintoutHandler };
