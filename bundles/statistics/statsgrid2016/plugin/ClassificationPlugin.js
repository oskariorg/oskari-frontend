import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { Classification } from '../components/classification/Classification';
import { showHistogramPopup } from '../components/manualClassification/HistogramForm';
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
        me.element = null;
        me._templates = {
            main: jQuery('<div class="mapplugin statsgrid-classification-plugin"></div>')
        };
        // for publisher dragndrop to work needs to have at least:
        // -  mapplugin-class in parent template
        // - _setLayerToolsEditModeImpl()
        // - publisher tool needs to implement getPlugin()

        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');
        Oskari.makeObservable(this);

        this.node = null;
        this._overflowedOffset = null;
        this._previousIsEdit = false;
        this.indicatorData = {};
        this._bindToEvents();
        this.service.getStateService().initClassificationPluginState(this._config, this._instance.isEmbedded());
        this.histogramControls = null;
    }, {
        _createControlElement: function () {
            if (this.element !== null) {
                return this.element;
            }
            this.element = this._templates.main.clone();
            this.element.css('z-index', 15001);
            return this.element;
        },
        rendered: function (isEdit) {
            // check if edit classification state is changed
            if (isEdit !== this._previousIsEdit) {
                if (isEdit) {
                    this._overflowCheck(true);
                } else {
                    this._restoreOverflow();
                }
                this._previousIsEdit = isEdit;
            }
            this._overflowCheck();
        },
        render: function () {
            if (!this.node) {
                return;
            }
            const { error, ...state } = this.service.getStateService().getStateForClassification();
            if (error) return;
            const { data, status, uniqueCount, minMax } = this.getIndicatorData(state);
            if (status === 'PENDING') return;
            const editOptions = this.getEditOptions(state, uniqueCount, minMax);
            const classifiedDataset = this.classifyDataset(state, data, uniqueCount);
            // Histogram doesn't need to be updated on every events but props are gathered here
            // and histogram is updated only if it's opened, so update here for now
            this.updateHistogram(state, classifiedDataset, data, editOptions);

            ReactDOM.render((
                <LocaleProvider value={{ bundleKey: this._instance.getName() }}>
                    <Classification
                        { ...state }
                        editOptions = {editOptions}
                        classifiedDataset = {classifiedDataset}
                        startHistogramView = {() => this.startHistogramView(state, classifiedDataset, data, editOptions)}
                        onRenderChange = {this.rendered.bind(this)}
                    />
                </LocaleProvider>
            ), this.node);
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
        redrawUI: function () {
            // No need to redraw because mobile & desktop is same
            return false;
        },
        toggleUI: function () {
            this.element ? this.teardownUI() : this.buildUI();
            return !!this.element;
        },
        teardownUI: function () {
            var element = this.getElement();
            if (this.node) {
                ReactDOM.unmountComponentAtNode(this.node);
                this.node = null;
            }
            if (element) {
                this.removeFromPluginContainer(element);
                this.element = null;
            }
            this.trigger('hide');
        },
        buildUI: function () {
            if (!this.element) {
                this.addToPluginContainer(this._createControlElement());
                this._makeDraggable();
                this.node = this.element.get(0);
                this.render();
            }
            this.trigger('show');
        },
        _makeDraggable: function () {
            this.getElement().draggable({
                handle: '.classification-header,.classification-legend'
            });
        },
        getElement: function () {
            return this.element;
        },
        stopPlugin: function () {
            this.teardownUI();
        },
        _overflowCheck: function (storeOverflow) {
            // This is messy.
            // FIXME: Lets refactor this in a way that it is using the popup/windowing system we have for React
            // Currently this draggable window is placed inside a plugin container.
            var pluginEl = this.getElement();
            if (!pluginEl) {
                return;
            }
            const MARGIN = 10;
            const position = pluginEl.css('position');
            if (!['absolute', 'relative'].includes(position)) {
                // left side plugins use relative
                // right side plugins use absolute
                return;
            }

            const locationList = this.getLocation().split(' ');
            const pluginContainer = jQuery('.mapplugins.' + locationList.join('.'));
            const pluginContainerWidth = pluginContainer.outerWidth();
            const pluginHeight = pluginEl.outerHeight();
            const pluginWidth = pluginEl.outerWidth();
            if (locationList.includes('bottom')) {
                // 0 is the plugin container top and we want to move it up
                const idealTop = 0 - pluginHeight - MARGIN;
                pluginEl.css('top', idealTop + 'px');
            }
            if (locationList.includes('right')) {
                const idealLeft = 0 + pluginContainerWidth - pluginWidth - MARGIN;
                pluginEl.css('left', idealLeft + 'px');
            }

            if (locationList.includes('top')) {
                const idealTop = 5 * MARGIN;
                pluginEl.css('top', idealTop + 'px');
            }
            if (locationList.includes('left')) {
                pluginEl.css('left', MARGIN + 'px');
                if (locationList.includes('bottom')) {
                    pluginEl.css('top', -MARGIN + 'px');
                }
            }
        },
        _restoreOverflow: function () {
            var pluginEl = this.getElement();
            if (this._overflowedOffset === null || !pluginEl) {
                return;
            }
            pluginEl.css('top', pluginEl.position().top - this._overflowedOffset + 'px');
            this._overflowedOffset = null;
        },
        hasUI: function () {
            // Plugin has ui element but returns false, because
            // otherwise publisher would stop this plugin and start it again when leaving the publisher,
            // instance updates visibility
            return false;
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
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
