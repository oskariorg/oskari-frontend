/**
 * @class Oskari.statistics.statsgrid.StateService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.StateService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox, service) {
        this.sandbox = sandbox;
        this.service = service;
        this.indicators = [];
        this.regionset = null;
        this.activeIndicator = null;
        this.activeRegion = null;
        this.selectedSeriesValue = null;
        this.lastSelectedClassification = {};
        this._defaults = {
            classification: {
                count: 5,
                method: 'jenks',
                color: 'Blues',
                type: 'seq',
                mode: 'discontinuous',
                reverseColors: false,
                mapStyle: 'choropleth',
                transparency: 100, // or from statslayer
                min: 10,
                max: 60,
                showValues: false
            },
            classificationPluginState: {
                editEnabled: true,
                transparent: false
            }
        };
        this._timers = {};
        this.classificationPluginState = {};
        Oskari.makeObservable(this);
    }, {
        __name: 'StatsGrid.StateService',
        __qname: 'Oskari.statistics.statsgrid.StateService',

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        getClassificationPluginState: function () {
            return this.classificationPluginState;
        },

        // Used only when plugin is started (doesn't trigger event)
        initClassificationPluginState: function (conf, isEmbedded) {
            const defaults = this._defaults.classificationPluginState;
            if (isEmbedded) {
                if (conf.hasOwnProperty('transparent')) {
                    defaults.transparent = conf.transparent;
                }
                if (conf.hasOwnProperty('allowClassification')) {
                    defaults.editEnabled = conf.allowClassification;
                }
            }
            Object.assign(this.classificationPluginState, defaults);
        },
        toggleClassificationPluginState: function (key) {
            if (this.classificationPluginState.hasOwnProperty(key)) {
                const value = !this.classificationPluginState[key];
                this.updateClassificationPluginState(key, value);
                return value;
            }
        },
        resetClassificationPluginState: function (key) {
            const defaults = this._defaults.classificationPluginState;
            if (defaults.hasOwnProperty(key)) {
                this.updateClassificationPluginState(key, defaults[key]);
            }
        },
        updateClassificationPluginState: function (key, value) {
            if (this.classificationPluginState[key] === value) {
                return;
            }
            this.classificationPluginState[key] = value;
            this.trigger('ClassificationPluginChanged', { key: key, value: value });
        },
        updateClassificationTransparency: function (transparency) {
            const indicator = this.getActiveIndicator();
            if (indicator) {
                indicator.classification.transparency = transparency;
            }
        },
        getStateForRender: function () {
            const activeIndicator = this.getActiveIndicator();
            const regionset = this.getRegionset();
            if (!activeIndicator || !regionset) {
                return { error: 'noActive' };
            }
            // TODO: maybe create labels on addIndicataor
            const indicators = [];
            this.getIndicators().forEach(ind => {
                const { hash } = ind;
                this.service.getUILabels(ind, label => indicators.push({ hash, title: label.full }));
            });
            return {
                activeIndicator,
                regionset,
                indicators,
                seriesStats: this.service.getSeriesService().getSeriesStats(activeIndicator.hash)
            };
        },
        getStateForClassification: function () {
            return {
                ...this.getStateForRender(),
                pluginState: this.getClassificationPluginState(),
                controller: this.getClassificationController()
            };
        },

        getClassificationController: function () {
            const eventBuilder = Oskari.eventBuilder('StatsGrid.ClassificationChangedEvent');
            return {
                setActiveIndicator: hash => this.setActiveIndicator(hash),
                updateClassification: (key, value) => {
                    const { classification } = this.getActiveIndicator() || {};
                    if (classification) {
                        classification[key] = value;
                        this.validateClassification(classification);
                        if (eventBuilder) {
                            this.sandbox.notifyAll(eventBuilder(classification, { [key]: value }));
                        }
                    }
                },
                updateClassificationObj: obj => {
                    const { classification } = this.getActiveIndicator() || {};
                    if (classification) {
                        Object.keys(obj).forEach(key => {
                            classification[key] = obj[key];
                        });
                        this.validateClassification(classification);
                        if (eventBuilder) {
                            this.sandbox.notifyAll(eventBuilder(classification, obj));
                        }
                    }
                }
            };
        },
        /**
         * Resets the current state and sends events about the changes.
         * Removes all selected indicators, selected region and regionset is set to undefined
         */
        resetState: function () {
            this.activeIndicator = null;
            this.regionset = null;
            this.indicators = [];
            this.activeRegion = null;
            const eventBuilder = Oskari.eventBuilder('StatsGrid.StateChangedEvent');
            this.sandbox.notifyAll(eventBuilder(true));
        },
        setState: function (state = {}) {
            const { regionset, indicators = [], active: activeHash, activeRegion } = state;
            this.regionset = regionset;
            this.activeRegion = activeRegion;
            // map to keep stored states work properly
            this.indicators = indicators.map(ind => {
                const hash = ind.hash || this.getHash(ind.ds, ind.id, ind.selections, ind.series);
                return {
                    datasource: Number(ind.ds),
                    indicator: ind.id,
                    selections: ind.selections,
                    series: ind.series,
                    hash,
                    classification: ind.classification || this.getClassificationOpts(hash)
                };
            // published maps or saved views may contain dublicate indicators => filter dublicates
            }).filter((ind, i, inds) => inds.findIndex(find => (find.hash === ind.hash)) === i);

            const active = this.indicators.find(ind => ind.hash === activeHash);
            if (active) {
                const { classification, series, selections } = active;
                if (classification) {
                    this.lastSelectedClassification = classification;
                }
                if (series) {
                    this.service.getSeriesService().setValues(series.values, selections[series.id]);
                }
            }
            this.activeIndicator = active || null;
            const eventBuilder = Oskari.eventBuilder('StatsGrid.StateChangedEvent');
            this.sandbox.notifyAll(eventBuilder());
        },
        getState: function () {
            // map to keep stored states work properly
            const indicators = this.indicators
                .filter(ind => !ind.indicator.startsWith('RuntimeIndicator'))
                .map(ind => {
                    return {
                        ds: ind.datasource,
                        id: ind.indicator,
                        selections: ind.selections,
                        series: ind.series,
                        classification: ind.classification || this.getClassificationOpts(ind.hash)
                    };
                });
            const activeInd = this.getActiveIndicator();
            return {
                indicators,
                active: activeInd ? activeInd.hash : null,
                activeRegion: this.getRegion(),
                regionset: this.getRegionset()
            };
        },
        /**
         * Returns id of the current regionset
         * @return {Number} id of current regionset
         */
        getRegionset: function () {
            return this.regionset;
        },
        /**
         * Sets the current regionset and sends out event notifying about the change
         * @param {Number|String} regionset id of the selected regionset
         */
        setRegionset: function (regionset) {
            var previousSet = this.regionset;
            this.regionset = Number(regionset);

            if (isNaN(this.regionset)) {
                this.regionset = null;
            }

            // notify if regionset changed
            if (previousSet !== this.regionset) {
                var eventBuilder = Oskari.eventBuilder('StatsGrid.RegionsetChangedEvent');
                this.sandbox.notifyAll(eventBuilder(this.regionset, previousSet));
            }
        },
        /**
         * Toggle the region.
         * @param  {Number} region id for the region that was selected. Assumes it's from the current regionset.
         * @param {String} componentId component id
         */
        toggleRegion: function (region, componentId) {
            // TODO: why does this need componentId?
            var me = this;

            // if region is same than previous then unselect region
            if (region === me.activeRegion) {
                region = null;
            }
            clearTimeout(me._timers.setActiveRegion);

            me._timers.setActiveRegion = setTimeout(function () {
                me.activeRegion = region;
                // notify
                var eventBuilder = Oskari.eventBuilder('StatsGrid.RegionSelectedEvent');
                // TODO: send which region was deselected so implementations can optimize rendering!!!!
                me.sandbox.notifyAll(eventBuilder(me.getRegionset(), region, null, componentId));
            }, 100);
        },

        /**
         * Gets the active region.
         * @method  @public getRegion
         * @return {null|Number} null or selected region
         */
        getRegion: function () {
            return this.activeRegion;
        },

        /**
         * Gets getClassificationOpts
         * @param  {String} indicatorHash indicator hash
         */
        getClassificationOpts: function (indicatorHash, opts = {}) {
            const indicator = this.getIndicator(indicatorHash) || {};
            const lastSelected = { ...this.lastSelectedClassification };
            delete lastSelected.manualBounds;
            delete lastSelected.fractionDigits;
            delete lastSelected.base;

            const metadataClassification = {};
            // Note! Assumes that the metadata has been loaded when selecting the indicator from the list to get a sync response
            // don't try this at home...
            this.service.getIndicatorMetadata(indicator.datasource || opts.ds, indicator.indicator || opts.id, (err, data = {}) => {
                if (err) {
                    // unable to get metadata, ignored since this only enhances the classification and is not required
                    return;
                }
                const metadata = data.metadata || {};
                if (typeof metadata.isRatio === 'boolean') {
                    metadataClassification.mapStyle = metadata.isRatio ? 'choropleth' : 'points';
                }
                if (typeof metadata.decimalCount === 'number') {
                    metadataClassification.fractionDigits = metadata.decimalCount;
                }
                if (typeof metadata.base === 'number') {
                    // if there is a base value the data is divided at base value
                    // TODO: other stuff based on this
                    metadataClassification.base = metadata.base;
                    metadataClassification.type = 'div';
                }
            });
            const result = jQuery.extend({}, this._defaults.classification, lastSelected, metadataClassification);
            this.validateClassification(result);
            return result;
        },
        validateClassification: function (classification) {
            const colorService = this.service.getColorService();
            if (!colorService.validateColor(classification)) {
                classification.color = colorService.getDefaultColor(classification);
            }
            const { max } = classification.mapStyle === 'points'
                ? this.service.getClassificationService().getRangeForPoints()
                : colorService.getRangeForColor(classification.color);
            if (classification.count > max) {
                classification.count = max;
            }
        },
        /**
         * Returns an wanted indicator.
         * @param  {String} indicatorHash indicator hash
         * @return {Object[]} wanted indicator or null if not found
         */
        getIndicator: function (indicatorHash) {
            if (typeof indicatorHash !== 'string') {
                return null;
            }
            for (var i = 0; i < this.indicators.length; i++) {
                var ind = this.indicators[i];
                if (ind.hash === indicatorHash) {
                    return ind;
                }
            }
            return null;
        },
        /**
         * Returns true if an indicator matching the datasource and id is still selected with any parameters.
         * Can be used to check if we should show the dataprovider information for the indicator or not.
         * @param  {Number}  ds datasource id
         * @param  {String}  id Indicator id
         * @return {Boolean} true if this indicator with any selections is still part of the selected indicators
         */
        isSelected: function (ds, id) {
            for (var i = 0; i < this.indicators.length; i++) {
                var ind = this.indicators[i];
                if (ind.datasource === ds && ind.indicator === id) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Returns an array of objects containing details (datasource, id, selections) of currently selected indicators.
         * @return {Object[]} currently selected indicators
         */
        getIndicators: function () {
            return this.indicators;
        },
        hasIndicators: function () {
            return this.indicators.length > 0;
        },
        isSeriesActive: function () {
            const active = this.getActiveIndicator();
            return active && !!active.series;
        },

        /**
         * @method  @public getIndicatorIndex Gets indicator index startin number 0
         * @param  {String} indicatorHash indicator hash
         * @return {Integer} indicator index
         */
        getIndicatorIndex: function (indicatorHash) {
            for (var i = 0; i < this.indicators.length; i++) {
                var ind = this.indicators[i];
                if (ind.hash === indicatorHash) {
                    return i;
                }
            }
            return null;
        },
        /**
         * Sets the active indicator and sends an event about the change
         * Note! Timeseries relies on this so the event need to be sent even if the indicator doesn't change.
         * @param {String} indicatorHash the unique hash from selected indicators details. See getHash()
         */
        setActiveIndicator: function (indicatorHash) {
            var me = this;
            clearTimeout(me._timers.setActiveIndicator);

            // This must be on some way to discard set active indicator if calling repeatly.
            // Because of published map editing, active indicator is changed always when adding indicator.
            me._timers.setActiveIndicator = setTimeout(function () {
                var previous = me.activeIndicator;

                // reset previous
                me.activeIndicator = null;
                me.indicators.forEach(function (ind) {
                    if (ind.hash === indicatorHash) {
                        me.activeIndicator = ind;
                    }
                });
                // get a default if requested was not found
                if (!me.activeIndicator) {
                    me.activeIndicator = me.getActiveIndicator();
                } else {
                    if (me.activeIndicator.classification) {
                        me.lastSelectedClassification = me.activeIndicator.classification;
                    }
                }
                // notify
                var eventBuilder = Oskari.eventBuilder('StatsGrid.ActiveIndicatorChangedEvent');
                me.sandbox.notifyAll(eventBuilder(me.activeIndicator, previous));
            }, 100);
        },
        /**
         * Returns object describing the active indicator or null if there are no indicators selected.
         * @return {Object} null if no active indicator or an object with indicator details
         */
        getActiveIndicator: function () {
            if (this.activeIndicator) {
                // return selected indicator
                return this.activeIndicator;
            }
            if (!this.indicators.length) {
                // no indicators present -> null
                return null;
            }
            // return latest if not set
            return this.indicators[this.indicators.length - 1];
        },
        /**
         * Adds indicator to selected indicators. Triggers event to notify about change
         * and sets the added indicator as the active one triggering another event.
         * @param  {Number} datasrc    datasource id
         * @param  {Number} indicator  indicator id
         * @param  {Object} selections object containing the parameters for the indicator
         * @param  {Object} series object containing series values
         * @param {Object} classification indicator classification
         *
         * @return {Object} false if indicator is already selected or an object describing the added indicator (includes parameters as an object)
         */
        addIndicator: function (datasrc, indicator, selections, series, classification) {
            var ind = {
                datasource: Number(datasrc),
                indicator: indicator,
                selections: selections,
                series: series,
                hash: this.getHash(datasrc, indicator, selections, series)
            };
            // init classification values if not given
            ind.classification = classification || this.getClassificationOpts(ind.hash, {
                ds: datasrc,
                id: indicator
            });
            var found = false;
            this.indicators.forEach(function (existing) {
                if (existing.hash === ind.hash) {
                    found = true;
                }
            });
            if (found) {
                return false;
            }

            if (series) {
                const seriesService = this.service.getSeriesService();
                seriesService.setValues(series.values);
                ind.selections[series.id] = seriesService.getValue();
                // Discontinuos mode is problematic for series data,
                // because each class has to get at least one hit -> set distinct mode.
                ind.classification.mode = 'distinct';
            }
            this.indicators.push(ind);

            // notify
            var eventBuilder = Oskari.eventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(ind.datasource, ind.indicator, ind.selections, ind.series));
            return ind;
        },
        /**
         * Remove an indicator from selected indicators. Triggers event to notify about change
         * and if the removed indicator was the active one, resets the active indicator triggering another event.
         * @param  {Number} datasrc    datasource id
         * @param  {Number} indicator  indicator id
         * @param  {Object} selections object containing the parameters for the indicator
         * @param  {Object} series object containing series values for the indicator
         * @return {Object}            an object describing the removed indicator (includes parameters as an object)
         */
        removeIndicator: function (datasrc, indicator, selections, series) {
            var newIndicators = [];
            var hash = this.getHash(datasrc, indicator, selections, series);
            var removedIndicator = null;
            this.indicators.forEach(function (ind) {
                if (ind.hash !== hash) {
                    newIndicators.push(ind);
                } else {
                    removedIndicator = ind;
                }
            });
            this.indicators = newIndicators;

            if (removedIndicator && removedIndicator.hash && this.activeIndicator && this.activeIndicator.hash === removedIndicator.hash) {
                // active was the one removed -> reset active
                this.setActiveIndicator();
            }
            if (this.hasIndicators()) {
                // notify
                var eventBuilder = Oskari.eventBuilder('StatsGrid.IndicatorEvent');
                this.sandbox.notifyAll(eventBuilder(datasrc, indicator, selections, series, true));
            } else {
                // if no indicators then reset state
                // last indicator removal should act like all indicators or layer was removed
                this.resetState();
            }

            return removedIndicator;
        },
        /**
         * Returns a string that can be used to identify an indicator including selections.
         * Shouldn't be parsed to detect which indicator is in question, but used as a simple
         * token to identify a selected indicator or set an active indicator
         * @param  {Number} datasrc    datasource id
         * @param  {Number} indicator  indicator id
         * @param  {Object} selections object containing the parameters for the indicator
         * @param  {Object} series object containing series values for the indicator
         * @return {String}            an unique id for the parameters
         */
        getHash: function (datasrc, indicator, selections, series) {
            var hash = datasrc + '_' + indicator;
            var seriesKey = '';
            if (typeof series === 'object' && series !== null) {
                seriesKey = series.id;
                hash += '_' + series.id + '=' + series.values[0] + '-' + series.values[series.values.length - 1];
            }
            if (typeof selections === 'object') {
                hash = hash + '_' + Object.keys(selections).filter(function (key) {
                    // exclude series selection
                    return seriesKey !== key;
                }).sort().map(function (key) {
                    return key + '=' + JSON.stringify(selections[key]);
                }).join(':');
            }
            return hash;
        },
        addFilter: function (filter) {
            // notify
            var eventBuilder = Oskari.eventBuilder('StatsGrid.Filter');
            this.sandbox.notifyAll(eventBuilder(filter));
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
