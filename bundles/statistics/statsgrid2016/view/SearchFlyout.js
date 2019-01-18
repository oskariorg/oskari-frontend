Oskari.clazz.define('Oskari.statistics.statsgrid.view.SearchFlyout', function (title, options, instance) {
    this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
    this.instance = instance;
    this.element = null;
    this.sandbox = this.instance.getSandbox();
    this.service = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.searchBtn = null;
    this.searchPending = false;
    this.searchParametersSelected = false;
    var me = this;
    this.on('show', function () {
        if (!me.getElement()) {
            me.createUi();
            me.addClass('statsgrid-search-flyout');
            me.setContent(me.getElement());
        }
    });
}, {
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    clearUi: function () {
        if (this.element === null) {
            return;
        }
        this.element.empty();
    },
    /**
     * @method lazyRender
     * Called when flyout is opened (by instance)
     * Creates the UI for a fresh start.
     */
    createUi: function (isEmbedded) {
        // empties all
        this.clearUi();
        this.setElement(jQuery('<div class="statsgrid-search-container"></div>'));
        var title = this.loc('flyout.title');
        var parent = this.getElement().parent().parent();
        if (isEmbedded) {
            parent.find('.oskari-flyout-title p').html(title);
            // Remove close button from published
            parent.find('.oskari-flyouttools').hide();
        } else {
            // resume defaults (important if user used publisher)
            parent.find('.oskari-flyout-title p').html(title);
            parent.find('.oskari-flyouttools').show();
        }
        this.addContent(this.getElement(), isEmbedded);
    },
    addContent: function (el, isEmbedded) {
        if (isEmbedded) {
            // no search for embedded map
            return;
        }
        el.append(this.getNewSearchElement());
    },
    getNewSearchElement: function () {
        var me = this;
        var container = jQuery('<div></div>');

        var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', me.instance, me.sandbox);
        container.append(selectionComponent.getPanelContent());

        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.addClass('margintopLarge');
        btn.setPrimary(true);
        btn.setTitle(this.loc('panels.newSearch.addButtonTitle'));
        btn.setEnabled(false);
        btn.insertTo(container);

        btn.setHandler(function (event) {
            event.stopPropagation();
            me.search(selectionComponent.getValues());
        });
        this.searchBtn = btn;

        var clearBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        clearBtn.addClass('margintopLarge');
        clearBtn.setTitle(this.loc('panels.newSearch.clearButtonTitle'));
        clearBtn.insertTo(container);

        clearBtn.setHandler(function (event) {
            event.stopPropagation();
            selectionComponent.clearSelections();
        });

        const searchFormEdited = selectionsOk => {
            this.searchParametersSelected = selectionsOk;
            this.updateSearchButtonEnabled();
        };
        selectionComponent.on('indicator.changed', searchFormEdited);
        selectionComponent.on('indicator.parameter.changed', searchFormEdited);

        // Create accordion and add indicator list to its panel
        var indicatorListAccordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        var indicatorListAccordionPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        var indicatorList = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorList', this.service);

        indicatorListAccordionPanel.setTitle(this.loc('indicatorList.title'));
        indicatorListAccordionPanel.setContent(indicatorList.getElement());
        indicatorListAccordion.addPanel(indicatorListAccordionPanel);

        indicatorListAccordion.insertTo(container);

        return container;
    },
    updateSearchButtonEnabled: function () {
        const enabled = !this.searchPending && this.searchParametersSelected;
        if (this.searchBtn.isEnabled() !== enabled) {
            this.searchBtn.setEnabled(enabled);
        }
    },
    search: function (commonSearchValues) {
        if (!commonSearchValues) {
            return;
        }
        this.service.getStateService().setRegionset(commonSearchValues.regionset);
        this._handleMultipleIndicatorsSearch(commonSearchValues);
    },

    /**
     * @method _getIndividualSearchValues To get indicator specific search selections.
     * Use can have multiple indicators selected and those indicators might have different selections.
     * We can't just use the same values for each indicator.
     *
     * This function rules out any unsupported selection parameters for each indicator and warns user of invalid values.
     * (f.ex.Selected year out of range)
     *
     * @param {Object} commonSearchValues User's selected values from the search form
     */
    _handleMultipleIndicatorsSearch: function (commonSearchValues) {
        const indicators = Array.isArray(commonSearchValues.indicator) ? commonSearchValues.indicator : [commonSearchValues.indicator];
        if (!commonSearchValues.indicator || indicators.length === 0) {
            return;
        }
        const refinedSearchValues = [];
        const errorMap = new Map();
        const multiselectStatusMap = new Map();

        this.searchPending = true;
        this.updateSearchButtonEnabled();

        // Overrides selection key and value from provided search values.
        const getSearchWithModifiedParam = (values, paramKey, paramValue) => {
            const modSelection = {...values.selection, [paramKey]: paramValue};
            return {...values, selections: modSelection};
        };

        let metadataCounter = 0;
        const checkDone = () => {
            metadataCounter++;
            if (metadataCounter === indicators.length) {
                // All metadata requests have finished
                this._addIndicatorsHavingData(refinedSearchValues, errorMap, multiselectStatusMap);
            }
        };

        indicators.forEach(indicator => {
            if (indicator === '') {
                checkDone();
                return;
            }
            // Overrides indicator array to make this search indicator specific.
            const addSearchValues = values => {
                refinedSearchValues.push({...values, indicator});
            };
            // Get indicator metadata to check the search valididty
            this.service.getIndicatorMetadata(commonSearchValues.datasource, indicator, (err, metadata) => {
                // Map possible errors by indicator name
                const indicatorName = metadata && metadata.name ? Oskari.getLocalized(metadata.name) : indicator;
                if (err || !metadata) {
                    errorMap.set(indicatorName, {metadataNotFound: true});
                    checkDone();
                    return;
                }
                const { error, multiselectStatus, ...searchValues } = this._getRefinedSearch(metadata, commonSearchValues);
                if (error) {
                    errorMap.set(indicatorName, error);
                    checkDone();
                    return;
                }
                if (multiselectStatus) {
                    multiselectStatusMap.set(indicatorName, multiselectStatus);
                }
                // Save indicator name for possible error messaging.
                searchValues.indicatorName = indicatorName;

                // Handle multiselect values
                let multivalueParam;
                let multivalueValues;

                if (searchValues.series) {
                    multivalueParam = searchValues.series.id;
                    multivalueValues = searchValues.series.values;
                } else {
                    Object.keys(searchValues.selections).forEach(searchParamKey => {
                        const val = searchValues.selections[searchParamKey];
                        if (!Array.isArray(val)) {
                            return;
                        }
                        multivalueParam = searchParamKey;
                        multivalueValues = val;
                    });
                }
                // Add own search for each value of the serie / multiple select
                if (multivalueParam && multivalueValues) {
                    multivalueValues.forEach(val => addSearchValues(
                        getSearchWithModifiedParam(searchValues, multivalueParam, val))
                    );
                } else {
                    addSearchValues(searchValues);
                }
                checkDone();
            });
        });
    },

    /**
     * @method _getRefinedSearch
     * Makes the actual selection validation based on the indicator metadata.
     *
     * @param {Object} metadata Indicator metadata
     * @param {Object} commonSearchValues the search form values
     * @return {Object} search values suited for an indicator.
     * Adds "error" and "multiselectStatus" information to the search values.
     */
    _getRefinedSearch (metadata, commonSearchValues) {
        // Make a deep clone of search values
        var indSearchValues = jQuery.extend(true, {}, commonSearchValues);
        const {regionset, selections, series} = indSearchValues;

        if (Array.isArray(metadata.regionsets) && !metadata.regionsets.includes(Number(regionset))) {
            indSearchValues.error = {notAllowed: 'regionset'};
            return indSearchValues;
        }
        if (!selections) {
            return indSearchValues;
        }
        Object.keys(selections).forEach(selectionKey => {
            const selector = metadata.selectors.find(selector => selector.id === selectionKey);
            if (!selector) {
                // Remove unsupported selectors silently
                delete selections[selectionKey];
                return;
            }
            const isSeriesSelection = series && series.id === selectionKey;
            const value = isSeriesSelection ? series.values : selections[selectionKey];

            if (!Array.isArray(value)) {
                // Single option
                if (!selector.allowedValues.includes(value)) {
                    indSearchValues.error = {notAllowed: selectionKey};
                }
                return;
            }
            // Multiselect or series
            // Filter out unsupported search param values
            const notAllowed = value.filter(cur =>
                !selector.allowedValues.includes(cur) && !selector.allowedValues.find(obj => obj.id === cur));

            // Set multiselect status for search
            indSearchValues.multiselectStatus = {selector: selectionKey, invalid: notAllowed, requested: [...value]};

            if (notAllowed.length === 0) {
                // Selected values are valid
                return;
            }
            if (notAllowed.length === value.length) {
                // All selected values are out of range
                delete selections[selectionKey];
                indSearchValues.error = {notAllowed: selectionKey};
                return;
            }
            // Filter out unsupported search param values
            if (isSeriesSelection) {
                series.values = value.filter(cur => !notAllowed.includes(cur));
            } else {
                selections[selectionKey] = value.filter(cur => !notAllowed.includes(cur));
            }
        });
        return indSearchValues;
    },

    /**
     * @method _addIndicatorsWithData
     * Performs data check for each search.
     * Adds indicators that have data.
     *
     * @param {Array} searchValues
     * @param {Map} errors
     * @param {Map} multiselectStatusMap
     */
    _addIndicatorsHavingData: function (searchValues, errors, multiselectStatusMap) {
        const indicatorsHavingData = new Set();
        const successfullSearches = [];
        const failedSearches = [];
        let indicatorCounter = 0;

        const checkDone = () => {
            indicatorCounter++;
            if (indicatorCounter >= searchValues.length) {
                // Handle indicators that failed the test
                failedSearches.forEach(cur => this._updateSearchStatusWithFailure(
                    cur,
                    errors,
                    multiselectStatusMap,
                    successfullSearches,
                    indicatorsHavingData
                ));
                this._showSearchErrorMessages(errors, multiselectStatusMap);
                this._addIndicators(successfullSearches);
                this.searchPending = false;
                this.updateSearchButtonEnabled();
            }
        };
        const searchSuccessfull = search => {
            if (!search.series || !indicatorsHavingData.has(search.indicator)) {
                // Add series search only once
                successfullSearches.push(search);
                indicatorsHavingData.add(search.indicator);
            }
            checkDone();
        };
        const searchFailed = search => {
            failedSearches.push(search);
            checkDone();
        };

        if (searchValues.length === 0) {
            checkDone();
            return;
        }

        // Run the searches to see if we get data from the service.
        searchValues.forEach(search => {
            const {datasource, indicator, selections, series, regionset} = search;
            this.service.getIndicatorData(datasource, indicator, selections, series, regionset, (err, data) => {
                if (err || !data) {
                    searchFailed(search);
                    return;
                }
                let counter = 0;
                const enoughData = !!Object.values(data).find(val => !isNaN(val) && ++counter > 1);
                if (!enoughData) {
                    searchFailed(search);
                    return;
                }
                searchSuccessfull(search);
            });
        });
    },

    _updateSearchStatusWithFailure: function (failedSearch, errors, multiselectStatusMap, successfullSearches, indicatorsHavingData) {
        if (errors.has(failedSearch.indicatorName)) {
            return;
        }
        if (!indicatorsHavingData.has(failedSearch.indicator)) {
            errors.set(failedSearch.indicatorName, {datasetEmpty: true});
            return;
        }
        const multiselectStatus = multiselectStatusMap.get(failedSearch.indicatorName);
        const invalidValue = failedSearch.selections[multiselectStatus.selector];
        multiselectStatus.invalid.push(invalidValue);
        if (failedSearch.series) {
            // Remove option from indicator's series
            const seriesSearch = successfullSearches.find(cur => cur.indicator === failedSearch.indicator);
            const index = seriesSearch.series.values.indexOf(invalidValue);
            if (index !== -1) {
                seriesSearch.series.values.splice(index, 1);
            }
            if (seriesSearch.series.values.length < 2) {
                // Can't display as a serie. Downgrade to single indicator.
                delete seriesSearch.series;
            }
        }
    },

    _showSearchErrorMessages: function (errors, multiselectStatusMap) {
        if (errors.size + multiselectStatusMap.size === 0) {
            return;
        }

        const indicatorMessages = [];
        errors.forEach((value, indicatorName) => indicatorMessages.push(indicatorName));

        multiselectStatusMap.forEach((status, indicatorName) => {
            if (!errors.has(indicatorName) && status.invalid && status.invalid.length > 0) {
                indicatorMessages.push(indicatorName + ' (' + this._getInvalidValuesStr(status.invalid, status.requested) + ')');
            }
        });
        if (indicatorMessages.length > 0) {
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okBtn = dialog.createCloseButton('OK');
            const title = this.loc('errors.noDataForIndicators', {indicators: indicatorMessages.length});
            dialog.show(title, indicatorMessages.join('<br>'), [okBtn]);
        }
    },

    _getInvalidValuesStr: function (invalids, all) {
        if (!Array.isArray(invalids) || !Array.isArray(all)) {
            return;
        }

        let start;
        let end;
        let rangeCounter = 0;

        const reset = () => {
            start = null;
            end = null;
            rangeCounter = 0;
        };

        const addRange = () => {
            if (!rangeCounter) {
                return 0;
            }
            if (rangeCounter >= 3) {
                invalidRanges.push(start + ' - ' + end);
                return;
            }
            invalidRanges.push(start);
            if (start !== end) {
                invalidRanges.push(end);
            }
        };

        const invalidRanges = [];
        all.sort();
        all.forEach(val => {
            if (!invalids.includes(val)) {
                addRange();
                reset();
                return;
            }
            start = start || val;
            end = val;
            rangeCounter++;
        });
        if (rangeCounter !== 0) {
            addRange();
        }
        return invalidRanges.join(', ');
    },

    _addIndicators: function (searchValues) {
        let latestNewSearch = null;
        searchValues.forEach(values => {
            const {datasource, indicator, selections, series} = values;
            if (this.service.getStateService().addIndicator(datasource, indicator, selections, series)) {
                // Indicator was not already present at the service
                latestNewSearch = values;
            }
        });
        if (latestNewSearch) {
            // Search added some new indicators, let's set the last one as the active indicator.
            const {datasource, indicator, selections, series} = latestNewSearch;
            const hash = this.service.getStateService().getHash(datasource, indicator, selections, series);
            this.service.getStateService().setActiveIndicator(hash);
        }
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
