import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showSidePanel } from 'oskari-ui/components/window';
import { SIZE_OPTIONS, FORMAT_OPTIONS, PARAMS, COORDINATE_POSITIONS, COORDINATE_PROJECTIONS } from './constants';

class UIHandler extends StateHandler {
    constructor (consumer, instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
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
            showTimeSeriesDate: false,
            isMapStateChanged: false,
            showCoordinates: false,
            coordinatePosition: COORDINATE_POSITIONS[0],
            coordinateProjection: COORDINATE_PROJECTIONS[0]
        });
        this.sidePanel = null;
        this.timeseriesPlugin = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModuleTimeseriesControlPlugin');
        this.eventHandlers = this.createEventHandlers();
        this.addStateListener(consumer);
    };

    updatePanel (title, content) {
        if (this.sidePanel) {
            this.sidePanel.update(title, content);
        }
    }

    showPanel (title, content, onClose) {
        if (!this.sidePanel) {
            this.sidePanel = showSidePanel(title, content, onClose);
        }
    }

    getName () {
        return 'Printout';
    }

    closePanel () {
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
        if (this.sandbox._mapMode === 'mapPrintoutMode') {
            delete this.sandbox._mapMode;
        }
        if (this.sidePanel) {
            this.sidePanel.close();
            this.sidePanel = null;
            const builder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            this.sandbox.request(this.instance, builder());
            this.sandbox.postRequestByName('EnableMapMouseMovementRequest', [['rotate']]);
        }
    }

    updateField (field, value) {
        this.updateState({
            [field]: value
        });
        if (field === 'size') {
            this.refreshPreview(true);
        }
    }

    refreshPreview (isUpdate) {
        if (isUpdate) {
            const url = this.getUrlForPreview(200);
            this.updateState({
                previewImage: url
            });
        } else {
            this.updateState({
                previewImage: null
            });
        }
    }

    printMap (selections) {
        const { maplinkArgs, customStyles, ...params } = selections || this.gatherParams();
        if (this.state.showTimeSeriesDate) {
            params[PARAMS.TIME] = this.timeseriesPlugin.getCurrentTime();
            if (params.pageTimeSeriesTime) {
                params[PARAMS.FORMATTED_TIME] = this.timeseriesPlugin.getCurrentTimeFormatted();
                params[PARAMS.SERIES_LABEL] = Oskari.getMsg('Printout', 'BasicView.content.pageTimeSeriesTime.printLabel');
            }
        }
        if (this.state.showCoordinates) {
            params[PARAMS.COORDINATE_POSITION] = this.state.coordinatePosition;
            params[PARAMS.COORDINATE_PROJECTION] = this.state.coordinateProjection === 'map' ? this.mapModule.getProjection() : this.state.coordinateProjection;
        }
        const paramsList = Object.keys(params).map(key => '&' + key + '=' + params[key]);
        const url = Oskari.urls.getRoute('GetPrint') + '&' + maplinkArgs + paramsList.join('');

        Oskari.log('BasicPrintout').debug('PRINT POST URL ' + url);
        this.getPostPrint(url, params, customStyles);
    }

    gatherParams () {
        const pageSize = this.state.size;
        const format = this.state.format || FORMAT_OPTIONS[0].mime;

        let resolution = this.sandbox.getMap().getResolution();

        const scale = this.state.scale;
        let scaleText = '';

        if (this.instance.conf.scaleSelection && this.state.scaleType === 'configured') {
            resolution = this.mapModule.getExactResolution(scale);
            scaleText = '1:' + scale;
        }
        const pageTitle = encodeURIComponent(this.state.mapTitle);
        const srs = this.sandbox.getMap().getSrsName();
        const customStyles = this.getSelectedCustomStyles();
        // printMap has been called outside so keep this separation for mapLinkArgs and selections
        // ask for optimized link with non-visible layers excluded
        const optimized = true;
        const maplinkArgs = this.sandbox.generateMapLinkParameters({ srs, resolution, scaleText }, optimized);
        const pageScale = this.state.showScale;
        const pageDate = this.state.showDate;

        return { maplinkArgs, pageSize, format, customStyles, pageTitle, pageScale, pageDate };
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
    getPostPrint (printUrl, params, customStyles) {
        const payload = { customStyles };
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
        let customStyles = {};
        const selectedLayers = this.sandbox.findAllSelectedMapLayers();

        selectedLayers.forEach(l => {
            const style = l.getCurrentStyle();
            if (typeof style.isRuntimeStyle === 'function' && style.isRuntimeStyle()) {
                customStyles[l.getId()] = style.getFeatureStyle();
            }
        });
        return customStyles;
    }

    isLandscape (pageSize) {
        const ps = pageSize || this.state.size;
        const opt = SIZE_OPTIONS.find(o => o.value === ps);
        return opt ? opt.landscape : SIZE_OPTIONS[0].landscape;
    }

    getUrlForPreview (scaledWidth) {
        const pageSize = this.state.size;
        const map = Oskari.getSandbox().getMap();
        const baseLayer = this.mapModule.getBaseLayer();

        let mapLayers = '';
        if (baseLayer) {
            mapLayers = baseLayer.getId() + ' ' +
            baseLayer.getOpacity() + ' ' +
            baseLayer.getCurrentStyle().getName();
        }

        let params = {
            format: 'image/png',
            pageSize,
            resolution: map.getResolution(),
            srs: map.getSrsName(),
            coord: `${map.getX()}_${map.getY()}`,
            mapLayers
        };

        if (Number.isInteger(scaledWidth)) {
            params.scaledWidth = scaledWidth;
        }

        return Oskari.urls.getRoute('GetPrint', params);
    }

    createEventHandlers () {
        const handlers = {
            'MapLayerVisibilityChangedEvent': function (event) {
                /* we might get 9 of these if 9 layers would have been selected */
                if (this.sidePanel && this.state.isMapStateChanged) {
                    this.updateState({
                        isMapStateChanged: false
                    });
                    this.refreshPreview(true);
                }
            },
            'AfterMapMoveEvent': function (event) {
                this.updateState({
                    isMapStateChanged: true
                });
                if (this.sidePanel) {
                    this.refreshPreview(true);
                }
                this.updateState({
                    isMapStateChanged: false
                });
            },
            'AfterMapLayerAddEvent': function (event) {
                this.updateState({
                    isMapStateChanged: true
                });
                if (this.sidePanel) {
                    this.refreshPreview(false);
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this.updateState({
                    isMapStateChanged: true
                });
                if (this.sidePanel) {
                    this.refreshPreview(false);
                }
            },
            'AfterChangeMapLayerStyleEvent': function (event) {
                this.updateState({
                    isMapStateChanged: true
                });
                if (this.sidePanel) {
                    this.refreshPreview(false);
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
    'updatePanel',
    'showPanel',
    'updateField',
    'closePanel',
    'printMap'
]);

export { wrapped as PrintoutHandler };
