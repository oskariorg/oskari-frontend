import React from 'react';
import { PLACEMENTS } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { Classification } from '../components/classification/Classification';
import { getPopupOptions } from '../../../mapping/mapmodule/plugin/pluginPopupHelper';
import '../../statsgrid2016/resources/scss/classificationplugin.scss';
import { validateClassification, getLimits, getClassification } from '../helper/ClassificationHelper';
import { getOptionsForType } from '../helper/ColorHelper';

/**
 * @class Oskari.statistics.statsgrid.ClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationPlugin',

    function (instance, config) {
        const me = this;
        me._instance = instance;
        me._config = config || {};
        me._sandbox = instance.getSandbox();
        this.service = instance.getStatisticsService();
        me._locale = Oskari.getMsg.bind(null, 'StatsGrid');
        me._clazz = 'Oskari.statistics.statsgrid.ClassificationPlugin';
        me._index = 9;
        this._defaultLocation = 'right bottom';
        me._name = 'ClassificationPlugin';

        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');
        Oskari.makeObservable(this);

        this._overflowedOffset = null;
        this._previousIsEdit = false;
        this._bindToEvents();
        this.stateHandler = this.service.getStateHandler();
        this.classificationHandler = this.stateHandler.getClassificationHandler();
        this.classificationHandler.initPluginState(this._config, this._instance.isEmbedded());
    }, {
        // buildUI() is the starting point
        buildUI: function () {
            this.render();
            this.trigger('show');
        },
        // this is used to stop this/remove from screen
        stopPlugin: function () {
            this.classificationHandler.closeClassificationContainer();
            this.trigger('hide');
        },
        isVisible: function () {
            return !!this.classificationHandler.getState().classificationContainer;
        },
        toggleUI: function () {
            this.classificcationHandler.getState().classificationContainer ? this.stopPlugin() : this.buildUI();
            return !!this.classificcationHandler?.getState().classificationContainer;
        },
        render: async function () {
            if (!this.classificationHandler) {
                return;
            }
            const state = this.classificationHandler.getState();
            const activeIndicator = this.service.getIndicator(state.activeIndicator);
            if (!activeIndicator || !state.activeRegionset) {
                return;
            }
            const indicatorData = await this.getIndicatorData(activeIndicator, state.activeRegionset);
            if (!indicatorData) {
                return;
            }
            const { data, uniqueCount, minMax } = indicatorData;
            const seriesStats = this.service.getSeriesService().getSeriesStats(activeIndicator.hash);
            const editOptions = this.getEditOptions(activeIndicator, uniqueCount, minMax);
            const classifiedDataset = this.classifyDataset(activeIndicator.classification, seriesStats, data, uniqueCount);
            const classificationControls = this.getClassificationController();
            // Histogram doesn't need to be updated on every events but props are gathered here
            // and histogram is updated only if it's opened, so update here for now
            this.updateHistogram({ ...state, activeIndicator, controller: classificationControls, seriesStats }, classifiedDataset, data, editOptions);
            const ui = (
                <LocaleProvider value={{ bundleKey: this._instance.getName() }}>
                    <Classification
                        { ...state }
                        activeIndicator={activeIndicator}
                        regionset={state.activeRegionset}
                        indicators={state.indicators}
                        editOptions = {editOptions}
                        classifiedDataset = {classifiedDataset}
                        pluginState={state.pluginState}
                        startHistogramView = {() => this.startHistogramView({ ...state, activeIndicator, controller: classificationControls }, classifiedDataset, data, editOptions)}
                        onRenderChange = {() => { /* no-op */ }}
                        controller={this.getClassificationController()}
                    />
                </LocaleProvider>);

            this.classificationHandler.showClassificationContainer(ui, () => this.stopPlugin(), this.__getContainerOpts());
        },
        // Use togglePlugin location when available, otherwise default to bottom right
        __getContainerOpts: function () {
            let opts = {
                placement: PLACEMENTS.BR
            };
            if (this._instance.togglePlugin) {
                opts = getPopupOptions(this._instance.togglePlugin);
            }
            return {
                ...opts,
                id: 'statsgrid_classification'
            };
        },
        getClassificationController: function () {
            // TODO: This function probably shouldn't exist
            const eventBuilder = Oskari.eventBuilder('StatsGrid.ClassificationChangedEvent');
            return {
                setActiveIndicator: hash => this.stateHandler.setActiveIndicator(hash),
                updateClassification: (key, value) => {
                    const { classification } = this.service.getIndicator(this.stateHandler.getState().activeIndicator) || {};
                    if (classification) {
                        classification[key] = value;
                        validateClassification(classification);
                        if (eventBuilder) {
                            this._sandbox.notifyAll(eventBuilder(classification, { [key]: value }));
                        }
                    }
                },
                updateClassificationObj: obj => {
                    const { classification } = this.service.getIndicator(this.stateHandler.getState().activeIndicator) || {};
                    if (classification) {
                        Object.keys(obj).forEach(key => {
                            classification[key] = obj[key];
                        });
                        validateClassification(classification);
                        if (eventBuilder) {
                            this._sandbox.notifyAll(eventBuilder(classification, obj));
                        }
                    }
                }
            };
        },
        getIndicatorData: async function (activeIndicator, activeRegionset) {
            try {
                const isSerie = !!activeIndicator.series;
                const serieSelection = isSerie ? this.service.getSeriesService().getValue() : null;

                const indicatorData = {
                    hash: activeIndicator.hash,
                    regionset: activeRegionset,
                    data: {},
                    uniqueCount: 0,
                    serieSelection
                };
                const data = await this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, activeIndicator.series, activeRegionset);
                if (data) {
                    const validData = Object.fromEntries(Object.entries(data).filter(([key, val]) => val !== null && val !== undefined));
                    const uniqueValues = [...new Set(Object.values(validData))].sort((a, b) => a - b);
                    indicatorData.uniqueCount = uniqueValues.length;
                    indicatorData.data = data;
                    indicatorData.minMax = { min: uniqueValues[0], max: uniqueValues[uniqueValues.length - 1] };
                }
                return indicatorData;
            } catch (error) {
                this.log.warn('Error getting indicator data', activeIndicator, activeRegionset);
            }
        },
        getEditOptions: function (activeIndicator, uniqueCount, minMax) {
            const { type, count, reverseColors, mapStyle, base, method } = activeIndicator.classification;
            const { count: { min, max }, methods, modes, mapStyles, types, fractionDigits } = getLimits(mapStyle, type);

            const colorCount = mapStyle === 'points' ? 2 + count % 2 : count;
            const colorsets = mapStyle === 'points' && type !== 'div' ? [] : getOptionsForType(type, colorCount, reverseColors);

            const disabled = [];
            if (uniqueCount < 3) {
                disabled.push('jenks');
                // only jenks breaks with small unique count, show at least count 2 for others
                if (method !== 'jenks') {
                    uniqueCount = 2;
                }
            }

            // if dataset has negative and positive values it can be divided, base !== 0 has to be given in metadata
            const dividable = minMax && minMax.min < 0 && minMax.max > 0;
            if (typeof base !== 'number' && !dividable) {
                // disable option if base isn't given in metadata or dataset isn't dividable
                disabled.push('div');
            }

            const toOption = (option, value) => ({
                value,
                label: this._locale(`classify.${option}.${value}`),
                disabled: disabled.includes(value)
            });
            const getNumberOptions = (min, max) => Array.from({ length: max - min + 1 }, (v, i) => i + min).map(i => ({ value: i, label: `${i}` }));
            return {
                methods: methods.map(val => toOption('methods', val)),
                modes: modes.map(val => toOption('modes', val)),
                mapStyles: mapStyles.map(val => toOption('mapStyles', val)),
                types: types.map(val => toOption('types', val)),
                counts: getNumberOptions(min, Math.min(uniqueCount, max)),
                fractionDigits: getNumberOptions(0, fractionDigits),
                colorsets
            };
        },
        classifyDataset: function (classification, seriesStats, data, uniqueCount) {
            return getClassification(data, classification, seriesStats, uniqueCount);
        },
        startHistogramView: function (state, classifiedDataset, data, editOptions) {
            this.service.getSeriesService().setAnimating(false);
            this.classificationHandler.getController().showHistogramPopup(state, classifiedDataset, data, editOptions);
        },
        updateHistogram: function (state, classifiedDataset, data, editOptions) {
            this.classificationHandler.updateHistogramPopup(state, classifiedDataset, data, editOptions);
        },
        _bindToEvents: function () {
            // if indicator is removed/added - recalculate the source 1/2 etc links
            this.service.on('StatsGrid.IndicatorEvent', () => this.render());

            // Always show the active indicator - also handles "no indicator selected"
            this.service.on('StatsGrid.ActiveIndicatorChangedEvent', () => this.render());

            // need to update the legend as data changes when regionset changes
            this.service.on('StatsGrid.RegionsetChangedEvent', () => this.render());

            this.service.on('StatsGrid.ClassificationChangedEvent', () => this.render());
            // UI styling changes e.g. disable classification editing, make transparent
            this.service.on('StatsGrid.ClassificationPluginChanged', () => this.render());
            // need to update transparency select
            this.service.on('AfterChangeMapLayerOpacityEvent', () => this.render());
            // need to calculate contents max height and check overflow
            this.service.on('MapSizeChangedEvent', () => this.render());
            // need to update labels
            this.service.on('StatsGrid.ParameterChangedEvent', () => this.render());
            this.service.on('StatsGrid.DatasourceEvent', () => this.render());
        }
    }, {
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
