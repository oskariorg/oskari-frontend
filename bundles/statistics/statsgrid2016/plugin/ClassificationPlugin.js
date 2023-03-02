import React from 'react';
import { showMovableContainer, PLACEMENTS } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { Classification } from '../components/classification/Classification';
import { showHistogramPopup } from '../components/manualClassification/HistogramForm';
import { getPopupOptions } from '../../../mapping/mapmodule/plugin/pluginPopupHelper';
import '../resources/scss/classificationplugin.scss';
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
        me._fixedLocation = true;
        me._name = 'ClassificationPlugin';
        // for publisher dragndrop to work needs to have at least:
        // -  mapplugin-class in parent template
        // - _setLayerToolsEditModeImpl()
        // - publisher tool needs to implement getPlugin()

        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');
        Oskari.makeObservable(this);

        this._overflowedOffset = null;
        this._previousIsEdit = false;
        this.indicatorData = {};
        this._bindToEvents();
        this.service.getStateService().initClassificationPluginState(this._config, this._instance.isEmbedded());
        this.histogramControls = null;

        this.containerController = null;
    }, {
        // buildUI() is the starting point
        buildUI: function () {
            this.render();
            this.trigger('show');
        },
        // this is used to stop this/remove from screen
        stopPlugin: function () {
            if (this.containerController) {
                this.containerController.close();
                this.containerController = null;
            }
            this.trigger('hide');
        },
        isVisible: function () {
            return !!this.containerController;
        },
        toggleUI: function () {
            this.containerController ? this.stopPlugin() : this.buildUI();
            return !!this.containerController;
        },
        render: function () {
            const { error, ...state } = this.service.getStateService().getStateForClassification();
            if (error) {
                return;
            }
            const { data, status, uniqueCount, minMax } = this.getIndicatorData(state);
            if (status === 'PENDING') {
                return;
            }
            const editOptions = this.getEditOptions(state, uniqueCount, minMax);
            const classifiedDataset = this.classifyDataset(state, data, uniqueCount);
            // Histogram doesn't need to be updated on every events but props are gathered here
            // and histogram is updated only if it's opened, so update here for now
            this.updateHistogram(state, classifiedDataset, data, editOptions);
            const ui = (
                <LocaleProvider value={{ bundleKey: this._instance.getName() }}>
                    <Classification
                        { ...state }
                        editOptions = {editOptions}
                        classifiedDataset = {classifiedDataset}
                        startHistogramView = {() => this.startHistogramView(state, classifiedDataset, data, editOptions)}
                        onRenderChange = {() => { /* no-op */ }}
                    />
                </LocaleProvider>);
            if (this.containerController) {
                this.containerController.update(ui);
                return;
            }
            this.containerController = showMovableContainer(ui, () => this.stopPlugin(), this.__getContainerOpts());
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
        getIndicatorData: function (state) {
            const { activeIndicator, regionset: activeRegionset } = state;
            const isSerie = !!activeIndicator.series;
            const { status, hash, regionset } = this.indicatorData;
            const serieSelection = isSerie ? this.service.getSeriesService().getValue() : null;
            if (status !== 'PENDING' && hash === activeIndicator.hash && regionset === activeRegionset) {
                if (!isSerie || serieSelection === this.indicatorData.serieSelection) {
                    return this.indicatorData;
                }
            }
            this.indicatorData = {
                hash: activeIndicator.hash,
                regionset: activeRegionset,
                data: {},
                uniqueCount: 0,
                serieSelection,
                status: 'PENDING'
            };
            this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, activeIndicator.series, activeRegionset, (err, data) => {
                if (this.indicatorData.hash !== activeIndicator.hash) return; // not latest active indicator response
                if (data) {
                    const validData = Object.fromEntries(Object.entries(data).filter(([key, val]) => val !== null && val !== undefined));
                    const uniqueValues = [...new Set(Object.values(validData))].sort((a, b) => a - b);
                    this.indicatorData.uniqueCount = uniqueValues.length;
                    this.indicatorData.data = data;
                    this.indicatorData.minMax = { min: uniqueValues[0], max: uniqueValues[uniqueValues.length - 1] };
                    this.indicatorData.status = 'DONE';
                }
                if (err) {
                    this.log.warn('Error getting indicator data', activeIndicator, activeRegionset);
                    this.indicatorData.status = 'ERROR';
                }
                this.render();
            });
            return this.indicatorData;
        },
        getEditOptions: function (state, uniqueCount, minMax) {
            const { activeIndicator } = state;
            const { type, count, reverseColors, mapStyle, base, method } = activeIndicator.classification;
            const { count: { min, max }, methods, modes, mapStyles, types, fractionDigits } = this.service.getClassificationService().getLimits(mapStyle, type);

            const colorCount = mapStyle === 'points' ? 2 + count % 2 : count;
            const colorsets = mapStyle === 'points' && type !== 'div' ? [] : this.service.getColorService().getOptionsForType(type, colorCount, reverseColors);

            const disabled = [];
            if (uniqueCount < 3) {
                disabled.push('jenks');
                // only jenks breaks with small unique count, show at least count 2 for others
                if (method !== 'jenks') {
                    uniqueCount = 2;
                }
            }

            // if dataset has negative and positive values it can be divided, base !== 0 has to be given in metadata
            const dividable = minMax.min < 0 && minMax.max > 0;
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
        classifyDataset: function (state, data, uniqueCount) {
            const { activeIndicator: { classification }, seriesStats } = state;
            return this.service.getClassificationService().getClassification(data, classification, seriesStats, uniqueCount);
        },
        startHistogramView: function (state, classifiedDataset, data, editOptions) {
            if (this.histogramControls) {
                // already opened, do nothing
                return;
            }
            this.service.getSeriesService().setAnimating(false);
            const onClose = () => this.histogramCleanup();
            this.histogramControls = showHistogramPopup(state, classifiedDataset, data, editOptions, onClose);
        },
        histogramCleanup: function () {
            if (this.histogramControls) {
                this.histogramControls.close();
            }
            this.histogramControls = null;
        },
        updateHistogram: function (state, classifiedDataset, data, editOptions) {
            if (!this.histogramControls) {
                return;
            }
            this.histogramControls.update(state, classifiedDataset, data, editOptions);
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
            this.service.getStateService().on('ClassificationPluginChanged', () => this.render());
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
