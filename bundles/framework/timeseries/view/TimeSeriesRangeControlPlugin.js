import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { TimeSeriesRangeControl } from './TimeSeriesRange/TimeSeriesRangeControl';
import { TimeSeriesRangeControlHandler } from './TimeSeriesRange/TimeSeriesRangeControlHandler';

const BasicMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin');
/**
 * @class Oskari.mapframework.bundle.timeseries.TimeSeriesRangeControlPlugin
 */
class TimeSeriesRangeControlPlugin extends BasicMapModulePlugin {
    constructor (delegate, conf) {
        super(conf);
        this._clazz = 'Oskari.mapframework.bundle.timeseries.TimeSeriesRangeControlPlugin';
        this._name = 'TimeSeriesRangeControlPlugin';
        this._defaultLocation = 'top left';
        this._log = Oskari.log(this._name);
        this._toolOpen = false;
        this._element = null;
        this._isMobile = Oskari.util.isMobile();
        this._delegate = delegate;
        this.stateHandler = new TimeSeriesRangeControlHandler(delegate, () => this.updateUI());
    }

    getName () {
        return this._name;
    }

    updateUI () {
        const mountElement = this.getReactMountElement();
        if (!mountElement) {
            return;
        }
        ReactDOM.render(
            <LocaleProvider value={{ bundleKey: 'timeseries' }}>
                <TimeSeriesRangeControl
                    {...this.stateHandler.getState()}
                    controller={this.stateHandler.getController()}
                    isMobile={this._isMobile}
                />
            </LocaleProvider>,
            mountElement
        );
    }

    getReactMountElement () {
        const element = this.getElement();
        return element && element.get(0);
    }

    redrawUI (mapInMobileMode, forced) {
        super.redrawUI(mapInMobileMode, forced);
        this.updateUI();
        this.updateDataYears();
        this.makeDraggable();
    }

    makeDraggable () {
        const element = this.getElement();
        if (!element) {
            return;
        }
        element.draggable({
            scroll: false,
            handle: '.timeseries-range-drag-handle' // the drag handle class is defined in react component
        });
    }

    _createControlElement () {
        return jQuery('<div class="mapplugin timeseriesrangecontrolplugin"></div>');
    }

    _createEventHandlers () {
        return {
            AfterMapMoveEvent: (event) => this.updateDataYears()
        };
    }

    updateDataYears () {
        const sandbox = this.getSandbox();
        const layer = this._delegate.getLayer();
        const options = layer.getOptions();
        const timeseries = options.timeseries || {};
        const metadata = timeseries.metadata || {};
        const attribute = metadata.attribute || 'time';
        const layerId = metadata.layer;
        if (!layerId) {
            return;
        }

        const url = Oskari.urls.getRoute('GetWFSFeatures', {
            id: layerId,
            bbox: sandbox.getMap().getBboxAsString(),
            srs: sandbox.getMap().getSrsName()
        });
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                // TODO: add error handling
                return Promise.reject(new Error('GetWFSFeatures error'));
            }
            return response.json();
        }).then(json => {
            const yearSet = new Set();
            const { features } = json;
            features.forEach(feature => {
                const time = feature.properties[attribute];
                if (time) {
                    const year = moment(time).year();
                    yearSet.add(year);
                }
            });
            this.stateHandler.updateDataYears(Array.from(yearSet));
        });
    }
}

Oskari.clazz.defineES(
    'Oskari.mapframework.bundle.timeseries.TimeSeriesRangeControlPlugin',
    TimeSeriesRangeControlPlugin,
    {
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
