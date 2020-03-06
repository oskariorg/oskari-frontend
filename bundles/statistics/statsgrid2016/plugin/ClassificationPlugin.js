import React from 'react';
import ReactDOM from 'react-dom';
import { GenericContext } from 'oskari-ui/util';
import { Classification } from '../components/classification/Classification';
import { ManualClassificationView } from '../components/manualClassification/View';
import '../resources/scss/classificationplugin.scss';
/**
 * @class Oskari.statistics.statsgrid.ClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationPlugin',

    function (instance, config, locale, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.ClassificationPlugin';
        me._index = 9;
        this._defaultLocation = me._config.legendLocation || 'right bottom';
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
        // publisher tool writes location to statsgrid.conf.legendLocation since this is not only a plugin
        //  for this reason we need to call setLocation() manually as location is not in the default path "config.location.classes"
        // me.setLocation(config.legendLocation || me._defaultLocation);

        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');
        Oskari.makeObservable(this);

        this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
        this.node = null;
        this._overflowedOffset = null;
        this._previousIsEdit = false;
        this.indicatorData = {};
        this._bindToEvents();
        this.service.getStateService().initClassificationPluginState(this._config, this._instance.isEmbedded());
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
        render: function (activeClassfication) {
            if (!this.node) {
                this.buildUI();
                return;
            }
            const stateService = this.service.getStateService();
            const activeIndicator = stateService.getActiveIndicator();
            const regionset = stateService.getRegionset();
            if (!activeIndicator || !regionset) return;
            const indicators = this.getIndicatorProps(activeIndicator, regionset);
            const indicatorData = this.getIndicatorData(activeIndicator, regionset, stateService.isSeriesActive());
            if (indicatorData.status === 'PENDING') return;
            const classifications = this.getClassificationProps(activeIndicator, activeClassfication, indicatorData);
            const legendProps = this.getLegendProps(indicatorData.data, classifications.values, indicators.serieStats);
            const controller = this.service.getStateService().getClassificationController();
            const classification = legendProps.classification;
            // TODO: These should be handled elsewhere
            if (classification) {
                if (classifications.values.method === 'manual' && !classifications.values.manualBounds) {
                    // store manual bounds based on last used bounds
                    controller.updateClassification('manualBounds', classification.bounds);
                    return;
                }
                if (classifications.values.count !== classification.getGroups().length) {
                    // classification count changed!!
                    controller.updateClassification('count', classification.getGroups().length);
                    return;
                }
            }
            const pluginState = this.service.getStateService().getClassificationPluginState();
            const manualView = this.getManualViewProps(classifications.values);

            ReactDOM.render((
                <GenericContext.Provider value={{ loc: this._locale }}>
                    <Classification indicators = {indicators} classifications = {classifications}
                        legendProps = {legendProps} pluginState = {pluginState}
                        onRenderChange = {this.rendered.bind(this)}
                        indicatorData = {indicatorData}
                        controller = {controller}
                        manualView = {manualView}/>
                </GenericContext.Provider>
            ), this.node);
        },
        getIndicatorData: function (activeIndicator, activeRegionset, isSerie) {
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
                serieSelection,
                status: 'PENDING'
            };
            this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, activeIndicator.series, activeRegionset, (err, data) => {
                if (this.indicatorData.hash !== activeIndicator.hash) return; // not latest active indicator response
                if (data) {
                    this.indicatorData.data = data;
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
        getIndicatorProps: function (active, regionset) {
            const indicators = {
                active,
                regionset,
                selected: []
            };
            if (active.series) {
                indicators.serieStats = this.service.getSeriesService().getSeriesStats(active.hash);
            }
            this.service.getStateService().getIndicators().forEach((ind) => {
                this.service.getUILabels(ind, label => {
                    indicators.selected.push({
                        id: ind.hash,
                        title: label.full
                    });
                });
            });

            return indicators;
        },
        getClassificationProps: function (activeIndicator, classification, indicatorData) {
            const props = {
                countRange: []
            };
            const service = this.service.getClassificationService();
            const colorsService = this.service.getColorService();
            const values = classification || this.service.getStateService().getClassificationOpts(activeIndicator.hash);
            props.values = values;
            props.methods = service.getAvailableMethods();
            props.modes = service.getAvailableModes();
            props.mapStyles = service.getAvailableMapStyles();
            props.types = colorsService.getAvailableTypes();
            props.validOptions = service.getAvailableOptions(indicatorData.data);
            if (values.mapStyle !== 'choropleth') {
                props.colors = colorsService.getDefaultSimpleColors();
            } else {
                props.colors = colorsService.getOptionsForType(values.type, values.count, values.reverseColors);
            }
            const range = colorsService.getRange(values.type, values.style);
            for (let i = range.min; i <= range.max; i++) {
                props.countRange.push(i);
            }
            return props;
        },
        getLegendProps: function (data, classificationOpts, serieStats) {
            const props = {};
            if (Object.keys(data).length !== 0) {
                props.classification = this.service.getClassificationService().getClassification(data, classificationOpts, serieStats);
            }
            props.colors = this.service.getColorService().getColorsForClassification(classificationOpts, true);
            return props;
        },
        getManualViewProps: function (classification) {
            if (classification.method !== 'manual') return;
            const { seriesService, classificationService, colorService } = this.service.getAllServices();
            return {
                view: new ManualClassificationView(classificationService, colorService, classification),
                setAnimating: seriesService.setAnimating
            };
        },

        redrawUI: function () {
            // No need to redraw because mobile & desktop is same
            return false;
        },
        toggleUI: function () {
            return this.service.getStateService().toggleClassificationPluginState('visible');
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
            if (this.element) {
                return;
            }
            this.addToPluginContainer(this._createControlElement());
            this._makeDraggable();
            this.node = this.element.get(0);
            this.render();
        },
        _makeDraggable: function () {
            this.getElement().draggable();
        },
        getElement: function () {
            return this.element;
        },
        stopPlugin: function () {
            this.teardownUI();
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        _overflowCheck: function (storeOverflow) {
            var pluginEl = this.getElement();
            if (!pluginEl) {
                return;
            }
            if (pluginEl.css('position') === 'absolute') {
                const { top, left } = pluginEl.offset();
                const bottom = top + pluginEl.height();
                const wHeight = jQuery(window).height();
                let offsetToWindowBottom = wHeight - bottom - 10; // add margin 10
                if (this._defaultLocation.includes('bottom')) {
                    const pluginContainer = jQuery('.mapplugins.bottom.right');
                    const containerHeight = pluginContainer.outerHeight();
                    const offsetToContainer = pluginEl.position().left + pluginEl.outerWidth() + 10;
                    if (offsetToContainer > 0) {
                        offsetToWindowBottom = offsetToWindowBottom - containerHeight + 10; // remove margin 10
                    }
                    // prevent to flow over top when map size is changed
                    if (top < 0) {
                        pluginEl.css('top', containerHeight - wHeight + 'px');
                    }
                    // prevent to flow over left when map size is changed
                    if (left < 0) {
                        const wWidth = jQuery(window).width();
                        const containerWidth = pluginContainer.outerWidth();
                        pluginEl.css('left', containerWidth - wWidth + 'px');
                    }
                }
                if (offsetToWindowBottom < 0) {
                    if (storeOverflow === true) {
                        this._overflowedOffset = offsetToWindowBottom;
                    }
                    pluginEl.css('top', pluginEl.position().top + offsetToWindowBottom + 'px');
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
            // resulting a misfuctioning duplicate classification element on screen.
            return false;
        },
        _bindToEvents: function () {
            // if indicator is removed/added - recalculate the source 1/2 etc links
            this.service.on('StatsGrid.IndicatorEvent', event => this.render());

            // Always show the active indicator - also handles "no indicator selected"
            this.service.on('StatsGrid.ActiveIndicatorChangedEvent', event => this.render());

            // need to update the legend as data changes when regionset changes
            this.service.on('StatsGrid.RegionsetChangedEvent', event => this.render());

            this.service.on('StatsGrid.ClassificationChangedEvent', event => this.render(event.getCurrent()));

            // UI styling changes e.g. disable classification editing, make transparent
            this.service.getStateService().on('ClassificationPluginChanged', ({ key, value }) => {
                if (key === 'visible') {
                    value ? this.trigger('show') : this.trigger('hide');
                }
                this.render();
            });
            // need to update transparency select
            this.service.on('AfterChangeMapLayerOpacityEvent', event => this.render());
            // need to calculate contents max height and check overflow
            this.service.on('MapSizeChangedEvent', event => this.render());
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
