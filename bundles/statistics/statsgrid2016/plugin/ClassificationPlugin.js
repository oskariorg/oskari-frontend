import React from 'react';
import ReactDOM from 'react-dom';
import { GenericContext } from '../../../../src/reactUtil/genericContext';
import Classification from '../components/Classification';
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

        if (instance.isEmbedded()) {
            this._defaultLocation = config.legendLocation;
        } else {
            this._defaultLocation = 'right bottom';
        }

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
        this._overflowedOffset = null;
        this._previousIsEdit = false;
        this._transparent = false;
        this._bindToEvents();
    }, {
        _setLayerToolsEditModeImpl: function () {
            if (!this.getElement()) {
                return;
            }
            if (!this.inLayerToolsEditMode()) {
                this.setLocation(
                    this.getElement().parents('.mapplugins').attr(
                        'data-location'
                    )
                );
            }
        },
        _createControlElement: function () {
            if (this.element !== null) {
                return this.element;
            }
            this.element = this._templates.main.clone();
            this.element.css('z-index', 15001);
            this.render();
            return this.element;
        },
        rendered: function (isUpdate, isEdit) {
            if (isUpdate) {
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
            } else {
                this._calculatePluginSize();
                this._overflowCheck();
            }
        },
        render: function (activeClassfication) {
            if (!this.element) return;
            const node = this.element.get(0);
            const indicators = this.getIndicatorProps();
            const classifications = this.getClassificationProps(indicators, activeClassfication);
            const legendProps = this.getLegendProps(indicators, classifications);
            const classification = legendProps.classification;
            if (classification && classifications.values.count !== classification.getGroups().length) {
                // classification count changed!!
                this.service.getStateService().updateActiveClassification('count', classification.getGroups().length);
                return;
            }

            ReactDOM.render((
                <GenericContext.Provider value={{loc: this._locale, service: this.service}}>
                    <Classification indicators = {indicators} classifications = {classifications}
                        legendProps = {legendProps} isEdit = {this._previousIsEdit}
                        onRenderChange = {this.rendered.bind(this)}/>
                </GenericContext.Provider>
            ), node);
        },
        getIndicatorProps: function () {
            const indicators = {
                selected: [],
                data: {}
            };
            const state = this.service.getStateService();
            const active = state.getActiveIndicator();
            indicators.active = active;
            indicators.regionset = state.getRegionset();
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
            this.service.getIndicatorData(active.datasource, active.indicator, active.selections, active.series, indicators.regionset, (err, data) => {
                if (data) {
                    indicators.data = data;
                }
                if (err) {
                    this.log.warn('Error getting indicator data', active, indicators.regionset);
                }
            });
            return indicators;
        },
        getClassificationProps: function (indicators, classification) {
            const props = {
                countRange: []
            };
            const service = this.service.getClassificationService();
            const colorsService = this.service.getColorService();
            const values = classification || this.service.getStateService().getClassificationOpts(indicators.active.hash);
            props.values = values;
            props.methods = service.getAvailableMethods();
            props.modes = service.getAvailableModes();
            props.types = colorsService.getAvailableTypes();
            props.validOptions = service.getAvailableOptions(indicators.data);
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
        getLegendProps: function (indicators, classifications) {
            const data = indicators.data;
            const serieStats = indicators.serieStats;
            const classificationOpts = classifications.values;
            const props = {};
            if (Object.keys(data).length !== 0) {
                props.classification = this.service.getClassificationService().getClassification(data, classificationOpts, serieStats);
            }
            props.colors = this.service.getColorService().getColorsForClassification(classificationOpts, true);
            return props;
        },

        redrawUI: function () {
            this.teardownUI();
            this._buildUI();
            return false;
        },
        toggleUI: function () {
            this.element ? this.teardownUI() : this._buildUI();
            return !!this.element;
        },
        teardownUI: function () {
            var element = this.getElement();
            // detach old element from screen
            if (element) {
                this.removeFromPluginContainer(element, true);
                this.element = null;
                this.trigger('hide');
            }
        },
        _buildUI: function () {
            this.addToPluginContainer(this._createControlElement());
            this._makeDraggable();
            this._overflowCheck();
            if (this._instance.isEmbedded() && this._config.transparent) {
                this.makeTransparent(true);
            } else if (this._transparent === true) {
                this.makeTransparent(true);
            }
            this.trigger('show');
        },
        _makeDraggable: function () {
            this.getElement().draggable();
        },
        makeTransparent: function (transparent) {
            this._transparent = transparent;
            var element = this.getElement();
            if (!element) {
                return;
            }
            if (transparent) {
                element.removeClass('statsgrid-classification-plugin');
                element.addClass('statsgrid-classification-plugin-transparent');
            } else {
                element.removeClass('statsgrid-classification-plugin-transparent');
                element.addClass('statsgrid-classification-plugin');
            }
        },
        getElement: function () {
            return this.element;
        },
        enableClassification: function (enabled) {
            this.service.getStateService().enableClassification(enabled);
        },
        stopPlugin: function () {
            this.teardownUI();
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        _createEventHandlers: function () {
            return {
                // 'StatsGrid.ActiveIndicatorChangedEvent' : function(evt) {
                // },
                MapSizeChangedEvent: function () {
                    this._calculatePluginSize();
                }
            };
        },
        _calculatePluginSize: function () {
            var element = this.getElement();

            if (!element) {
                return;
            }
            var height = this.getSandbox().getMap().getHeight();
            var headerHeight = element.find('.active-header').first().height();
            if (Oskari.util.isMobile()) {
                element.find('.accordion').css({
                    'max-height': (height * 0.8 - headerHeight) + 'px'
                });
            } else if (!Oskari.util.isMobile()) {
                element.find('.accordion').css({
                    'max-height': (height * 0.8 - headerHeight) + 'px'
                });
            }
        },
        _overflowCheck: function (storeOverflow) {
            var pluginEl = this.getElement();
            if (!pluginEl) {
                return;
            }
            if (pluginEl.css('position') === 'absolute') {
                var top = pluginEl.offset().top;
                var bottom = top + pluginEl.height();
                var offsetToWindowBottom = jQuery(window).height() - bottom - 10; // add margin 10
                if (this._defaultLocation.includes('bottom')) {
                    var pluginContainer = jQuery('.mapplugins.bottom.right');
                    var containerHeight = pluginContainer.outerHeight();
                    var offsetToContainer = pluginEl.position().left + pluginEl.outerWidth() + 10;
                    if (offsetToContainer > 0) {
                        offsetToWindowBottom = offsetToWindowBottom - containerHeight + 10; // remove margin 10
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
            // if the selected indicator has no data & edit panel is open -> close it
            this.service.on('StatsGrid.ActiveIndicatorChangedEvent', event => this.render());

            // need to update the legend as data changes when regionset changes
            this.service.on('StatsGrid.RegionsetChangedEvent', event => this.render());

            this.service.on('StatsGrid.ClassificationChangedEvent', event => this.render(event.getCurrent()));

            // UI styling changes e.g. disable classification editing, make transparent
            this.service.getStateService().on('ClassificationContainerChanged', () => this.render());

            this.service.on('AfterChangeMapLayerOpacityEvent', (event) => this.render());
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
