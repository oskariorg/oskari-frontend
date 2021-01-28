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
        this._sandbox = Oskari.getSandbox();
        this._delegate = delegate;

        this.stateHandler = new TimeSeriesRangeControlHandler(delegate, () => this.updateUI());
        this._updateCurrentViewportBbox();
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
        this.makeDraggable();
    }

    makeDraggable () {
        const element = this.getElement();
        if (!element) {
            return;
        }
        element.draggable({
            scroll: false,
            // the drag handle class is defined in react component
            handle: '.timeseries-range-drag-handle'
        });
    }

    _createControlElement () {
        return jQuery('<div class="mapplugin timeseriesrangecontrolplugin"></div>');
    }

    _createEventHandlers () {
        return {
            AfterMapMoveEvent: () => this._updateCurrentViewportBbox()
        };
    }

    _updateCurrentViewportBbox () {
        const sandbox = this.getSandbox();
        const currentBbox = sandbox.getMap().getBbox();
        this.stateHandler.setCurrentViewportBbox(currentBbox);
    }
}

Oskari.clazz.defineES(
    'Oskari.mapframework.bundle.timeseries.TimeSeriesRangeControlPlugin',
    TimeSeriesRangeControlPlugin,
    {
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
