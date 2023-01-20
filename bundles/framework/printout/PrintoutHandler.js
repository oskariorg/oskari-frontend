import React from 'react';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import ReactDOM from 'react-dom';
import { PrintoutPanel } from './view/PrintoutPanel';
import { SIZE_OPTIONS, FORMAT_OPTIONS, PAGE_OPTIONS, SCALE_OPTIONS, TIME_OPTION, WINDOW_SIZE, PARAMS } from './constants';

class UIHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance,
        this.sandbox = Oskari.getSandbox();
        this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this.setState({
            size: 'A4',
            format: 'application/pdf',
            mapTitle: '',
            showScale: true,
            showDate: true,
            previewImage: null,
            isMapStateChanged: false
        });
        this.sidePanel = null;
        this.timeseriesPlugin = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModuleTimeseriesControlPlugin');
        this.eventHandlers = this.createEventHandlers();
    };

    showPanel (container) {
        this.sidePanel = container;
        ReactDOM.render(
            <PrintoutPanel
                controller={this.controller}
                state={this.state}
            />,
            this.sidePanel[0]
        );
    }

    updatePanel () {
        if (this.sidePanel) {
            ReactDOM.render(
                <PrintoutPanel
                    controller={this.controller}
                    state={this.state}
                />,
                this.sidePanel[0]
            );
        }
    }

    getName() {
        return 'Printout';
    }

    closePanel () {
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
        ReactDOM.unmountComponentAtNode(this.sidePanel[0]);
        this.sidePanel.remove();
        this.sidePanel = null;
    }
    
    updateField (field, value) {
        this.updateState({
            [field]: value
        });
        if (field === 'size') {
            this.refreshPreview();
        } else {
            this.updatePanel();
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
        this.updatePanel();
    }

    printMap (selections) {
        const { maplinkArgs, customStyles, ...params } = selections || this.gatherParams();
        if (this.isTimeSeriesActive()) {
            params[PARAMS.TIME] = this.timeseriesPlugin.getCurrentTime();
            if (params.pageTimeSeriesTime) {
                params[PARAMS.FORMATTED_TIME] = this.timeseriesPlugin.getCurrentTimeFormatted();
                params[PARAMS.SERIES_LABEL] = Oskari.getMsg('Printout', 'BasicView.content.pageTimeSeriesTime.printLabel');
            }
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

        const scale = this.state.showScale;
        let scaleText = '';

        if (this.instance.conf.scaleSelection && this.state.showScale) {
            resolution = this.mapmodule.getExactResolution(scale);
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

    isTimeSeriesActive () {
        const hasLayers = this.instance.sandbox.findAllSelectedMapLayers().filter(l => l.getAttributes().times).length > 0;
        return hasLayers && !!this.timeseriesPlugin;
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

        let url = Oskari.urls.getRoute('GetPrint') +
            '&format=image/png' +
            '&pageSize=' + pageSize +
            '&resolution=' + map.getResolution() +
            '&srs=' + map.getSrsName() +
            '&coord=' + map.getX() + '_' + map.getY() +
            '&mapLayers=' + mapLayers;

        if (Number.isInteger(scaledWidth)) {
            url += '&scaledWidth=' + scaledWidth;
        }

        return url;
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
    'showPanel',
    'updateField',
    'closePanel',
    'printMap'
]);

export { wrapped as PrintoutHandler };
