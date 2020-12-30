import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import olVectorSource from 'ol/source/Vector';
import olVectorLayer from 'ol/layer/Vector';
import olGeoJSON from 'ol/format/GeoJSON';
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
        this._layer = delegate.getLayer();

        this._metadata = this._getTimeSeriesMetadata(delegate.getLayer());
        this._wfsFeatures = null;
        this._geojson = new olGeoJSON();
        this._timeseriesWfsLayerStyleName = 'timeseriesStyle';
        this._defaultWfsStyleDef = {
            stroke: {
                width: 1,
                color: 'rgba(0, 0, 0, 0.8)'
            },
            fill: {
                color: 'rgba(24, 219, 218, 0.5)'
            }
        };
        this._wfsLayer = null;
        this.stateHandler = new TimeSeriesRangeControlHandler(delegate, () => this.updateUI(), () => this.requestNewTimeRange());
    }

    getName () {
        return this._name;
    }

    _startPluginImpl (sandbox) {
        super._startPluginImpl(sandbox);
        if (!this._wfsLayer) {
            this._wfsLayer = this._createWFSLayer();
        }
        this.getMapModule().addLayer(this._wfsLayer);
    }

    _stopPluginImpl (sandbox) {
        super._stopPluginImpl(sandbox);
        this.getMapModule().removeLayer(this._wfsLayer);
    }

    requestNewTimeRange () {
        this._updateWMSLayer();
        this._updateWFSLayer();
    }

    _updateWMSLayer () {
        const [startTime, endTime] = this._getTimeRange();
        const newTime = `${startTime.toISOString()}/${endTime.toISOString()}`;
        this._delegate.requestNewTime(newTime);
    }

    _updateWFSLayer () {
        const [startTime, endTime] = this._getTimeRange();
        const { attribute } = this._metadata;
        const features = this._wfsFeatures.filter(feature => {
            const time = moment(feature.get(attribute));
            return startTime < time && time < endTime;
        });
        const source = this._wfsLayer.getSource();
        source.clear();
        source.addFeatures(features);
    }

    _getTimeRange () {
        const { value } = this.stateHandler.getState();
        const [startYear, endYear] = value;
        const startTime = moment.utc(startYear.toString()).startOf('year');
        const endTime = moment.utc(endYear.toString()).endOf('year');
        return [startTime, endTime];
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
            this._wfsFeatures = this._geojson.readFeatures(json);
            this._updateWFSLayer();
        });
    }

    _getTimeSeriesMetadata (layer) {
        const options = layer.getOptions();
        const timeseries = options.timeseries || {};
        return timeseries.metadata || {};
    }

    _createWFSLayer () {
        const { layer: layerId, toggleLevel } = this._metadata;
        if (!layerId || !toggleLevel || toggleLevel < 0) {
            return;
        }

        const source = new olVectorSource();
        const style = this._getWFSLayerStyle(layerId);
        const layer = new olVectorLayer({
            source,
            style,
            maxZoom: toggleLevel
        });
        return layer;
    }

    _getWFSLayerStyle (layerId) {
        const service = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        const layer = service.findMapLayer(layerId);
        const styles = layer.getOptions().styles;
        const layerStyleDef = styles[this._timeseriesWfsLayerStyleName] || {};
        const featureStyleDef = layerStyleDef.featureStyle || this._defaultWfsStyleDef;
        return this.getMapModule().getStyle(featureStyleDef);
    }
}

Oskari.clazz.defineES(
    'Oskari.mapframework.bundle.timeseries.TimeSeriesRangeControlPlugin',
    TimeSeriesRangeControlPlugin,
    {
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
