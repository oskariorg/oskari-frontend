import React from 'react';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { TimeSeriesRangeControl } from './TimeSeriesRange/TimeSeriesRangeControl';
import { TimeSeriesRangeControlHandler } from './TimeSeriesRange/TimeSeriesRangeControlHandler';
import { createRoot } from 'react-dom/client';

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
        this.mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');

        this._delegate = delegate;

        this.stateHandler = new TimeSeriesRangeControlHandler(delegate, () => this.updateUI());
        this._updateCurrentViewportBbox();
        this._reactRoot = null;
    }

    hasUI () {
        return true;
    }

    isShouldStopForPublisher () {
        // prevent publisher to stop this plugin and start it again when leaving the publisher
        return false;
    }

    getControlState () {
        const { value } = this.stateHandler.getState();
        let time;
        if (Array.isArray(value)) {
            time = value.map(item => item.toString());
        } else {
            time = value.toString();
        }
        return { time };
    }

    setControlState (state) {
        const { time } = state;
        if (!time) {
            // don't set initial value if state doesn't have time value
            return;
        }
        let mode;
        let value;
        if (Array.isArray(time)) {
            mode = 'range';
            value = [parseInt(time[0], 10), parseInt(time[1], 10)];
        } else {
            mode = 'year';
            value = parseInt(time);
        }
        this.stateHandler.setInitialValue(value, mode);
    }

    getName () {
        return this._name;
    }

    getReactRoot (element) {
        if (!this._reactRoot) {
            this._reactRoot = createRoot(element);
        }
        return this._reactRoot;
    }

    updateUI () {
        const mountElement = this.getReactMountElement();
        if (!mountElement) {
            return;
        }
        this.getReactRoot(mountElement).render(
            <LocaleProvider value={{ bundleKey: 'timeseries' }}>
                <ThemeProvider value={this.mapModule.getMapTheme()}>
                    <TimeSeriesRangeControl
                        {...this.stateHandler.getState()}
                        controller={this.stateHandler.getController()}
                        isMobile={this._isMobile}
                    />
                </ThemeProvider>
            </LocaleProvider>
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

    /**
     * Compares delegate to controls own delegate to see if it's being controlled by this plugin
     * @param {Oskari.mapframework.bundle.timeseries.TimeseriesDelegate} delegate for comparison
     * @returns {Boolean}
     */
    isControlling (delegate) {
        if (!delegate) {
            return false;
        }
        if (!this._delegate) {
            return false;
        }
        if (this._delegate._clazz !== delegate._clazz) {
            return false;
        }
        // we only have the WMSAnimator at this time but check that delegate is it so we can expect to find getLayer()
        if (this._delegate._clazz !== 'Oskari.mapframework.bundle.timeseries.WMSAnimator') {
            return false;
        }
        // here we can be sure that delegate and this._delegate are both WMSAnimator
        const myLayer = this._delegate.getLayer();
        const theirLayer = delegate.getLayer();
        if (!myLayer || !theirLayer) {
            return false;
        }

        return myLayer.getId() === theirLayer.getId();
    }

    _createControlElement () {
        return jQuery('<div class="mapplugin timeseriesrangecontrolplugin"></div>');
    }

    _createEventHandlers () {
        return {
            AfterMapMoveEvent: () => this._updateCurrentViewportBbox(),
            MapSizeChangedEvent: () => {
                const isMobileCurrent = Oskari.util.isMobile();
                const isMobilePrevious = this._getMobileMode();
                if (isMobilePrevious !== isMobileCurrent) {
                    this._setMobileMode(isMobileCurrent);
                    this.redrawUI(isMobileCurrent, true);
                }
            }
        };
    }

    _getMobileMode () {
        return this._isMobile;
    }

    _setMobileMode (isMobile) {
        this._isMobile = isMobile;
    }

    _updateCurrentViewportBbox () {
        const sandbox = this.getSandbox();
        const currentBbox = sandbox.getMap().getBbox();
        const zoomLevel = sandbox.getMap().getZoom();
        this.stateHandler.setCurrentViewportBbox(currentBbox, zoomLevel);
    }
}

Oskari.clazz.defineES(
    'Oskari.mapframework.bundle.timeseries.TimeSeriesRangeControlPlugin',
    TimeSeriesRangeControlPlugin,
    {
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
