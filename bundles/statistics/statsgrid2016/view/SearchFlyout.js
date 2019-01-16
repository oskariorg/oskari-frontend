Oskari.clazz.define('Oskari.statistics.statsgrid.view.SearchFlyout', function (title, options, instance) {
    this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
    this.instance = instance;
    this.element = null;
    this.sandbox = this.instance.getSandbox();
    this.service = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
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

        var clearBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        clearBtn.addClass('margintopLarge');
        clearBtn.setTitle(this.loc('panels.newSearch.clearButtonTitle'));
        clearBtn.insertTo(container);

        clearBtn.setHandler(function (event) {
            event.stopPropagation();
            selectionComponent.clearSelections();
        });

        selectionComponent.on('indicator.changed', enabled => btn.setEnabled(enabled));
        selectionComponent.on('indicator.parameter.changed', enabled => btn.setEnabled(enabled));

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
    search: function (values) {
        if (!values) {
            return;
        }
        this._filterSelectionsWithIndicatorMetadata(values, filteredSearchValues => {
            this._checkIndicatorData(filteredSearchValues, results => {
                const {searchValuesForIndicators, errors, multiselectStatusMap} = results;
                this._showSearchErrorMessages(errors, multiselectStatusMap);
                this._addIndicators(searchValuesForIndicators);
            });
        });
        this.service.getStateService().setRegionset(values.regionset);
    },

    _filterSelectionsWithIndicatorMetadata: function (searchValues, handleFilteredSearchCb) {
        const indicators = Array.isArray(searchValues.indicator) ? searchValues.indicator : [searchValues.indicator];
        const candidates = [];

        const errorMap = new Map();
        const multiselectStatusMap = new Map();

        let metadataCounter = 0;
        const metadataChecked = () => {
            metadataCounter++;
            if (metadataCounter === indicators.length) {
                handleFilteredSearchCb({
                    candidates,
                    errors: errorMap,
                    multiselectStatusMap
                });
            }
        };

        const getSearchWithModifiedParam = (values, paramKey, paramValue) => {
            const modSelection = {...values.selection, [paramKey]: paramValue};
            return {...values, selections: modSelection};
        };

        indicators.forEach(indicator => {
            if (indicator === '') {
                metadataChecked();
                return;
            }
            const addSearchCandidate = values => {
                candidates.push({...values, indicator});
            };
            this.service.getIndicatorMetadata(searchValues.datasource, indicator, (msg, metadata) => {
                const indicatorName = metadata && metadata.name ? Oskari.getLocalized(metadata.name) : indicator;
                if (!metadata) {
                    errorMap.set(indicatorName, {metadataNotFound: true});
                    metadataChecked();
                    return;
                }
                const { error, multiselectStatus, ...search } = this.getValidSearchValuesForIndicator(metadata, searchValues);
                if (error) {
                    errorMap.set(indicatorName, error);
                    metadataChecked();
                    return;
                }
                if (multiselectStatus) {
                    multiselectStatusMap.set(indicatorName, multiselectStatus);
                }
                search.indicatorName = indicatorName;
                if (search.series) {
                    const seriesKey = search.series.id;
                    search.multiselectParam = seriesKey;
                    search.series.values.forEach(cur => addSearchCandidate(getSearchWithModifiedParam(search, seriesKey, cur)));
                    metadataChecked();
                    return;
                }
                // Handle multiselect values
                let addedMultiselectSearchParameters = false;
                Object.keys(search.selections).forEach(searchParamKey => {
                    const selection = search.selections[searchParamKey];
                    if (!Array.isArray(selection)) {
                        return;
                    }
                    search.multiselectParam = searchParamKey;
                    // Add a search candidate for each selection value
                    selection.forEach(cur => addSearchCandidate(getSearchWithModifiedParam(search, searchParamKey, cur)));
                    addedMultiselectSearchParameters = true;
                });
                // Single value option
                if (!addedMultiselectSearchParameters) {
                    addSearchCandidate(search);
                }
                metadataChecked();
            });
        });
    },

    getValidSearchValuesForIndicator (metadata, searchValues) {
        // Make a deep clone of search values
        var indSearchValues = jQuery.extend(true, {}, searchValues);
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

    _checkIndicatorData: function ({candidates, errors, multiselectStatusMap}, handleIndicatorsCb) {
        const passed = [];
        const failed = [];
        const indicatorsWithSomeData = new Set();

        let indicatorCounter = 0;
        const dataChecked = () => {
            indicatorCounter++;
            if (indicatorCounter === candidates.length) {
                // Handle indicators that failed the test
                failed.forEach(cur => {
                    if (errors.has(cur.indicatorName)) {
                        return;
                    }
                    if (!indicatorsWithSomeData.has(cur.indicator)) {
                        errors.set(cur.indicatorName, {datasetEmpty: true});
                        return;
                    }
                    // Multiselect or series search with some found indicator datasets
                    const multiselectStatus = multiselectStatusMap.get(cur.indicatorName);
                    const invalidValue = cur.selections[multiselectStatus.selector];
                    multiselectStatus.invalid.push(invalidValue);

                    if (cur.series) {
                        // Remove option from indicator's series
                        const searchValuesForIndicator = passed.find(search => search.indicator === cur.indicator);
                        const index = searchValuesForIndicator.series.values.indexOf(invalidValue);
                        if (index !== -1) {
                            searchValuesForIndicator.series.values.splice(index, 1);
                        }
                    }
                });

                handleIndicatorsCb({searchValuesForIndicators: passed, errors, multiselectStatusMap});
            }
        };

        const indicatorPassedDataCheck = candidate => {
            if (!candidate.series || !indicatorsWithSomeData.has(candidate.indicator)) {
                passed.push(candidate);
                indicatorsWithSomeData.add(candidate.indicator);
            }
            dataChecked();
        };
        const indicatorFailedDataCheck = candidate => {
            failed.push(candidate);
            dataChecked();
        };

        candidates.forEach(candidate => {
            const {datasource, indicator, selections, series, regionset} = candidate;
            this.service.getIndicatorData(datasource, indicator, selections, series, regionset, (err, data) => {
                if (err || !data) {
                    indicatorFailedDataCheck(candidate);
                    return;
                }
                let counter = 0;
                const enoughData = !!Object.values(data).find(val => !isNaN(val) && ++counter > 1);
                if (!enoughData) {
                    indicatorFailedDataCheck(candidate);
                    return;
                }
                indicatorPassedDataCheck(candidate);
            });
        });
    },

    _showSearchErrorMessages: function (errors, multiselectStatusMap) {
        if (errors.size + multiselectStatusMap.size === 0) {
            return;
        }
        const content = [];
        errors.forEach((value, indicatorName) => content.push(`<dt>${indicatorName}</dt>`));

        const getInvalidValues = status => {
            status.requested.sort();
            let start;
            let end;
            let rangeCounter = 0;
            const reset = () => {
                start = null;
                end = null;
                rangeCounter = 0;
            };
            const invalidRanges = [];
            const addRange = () => {
                if (!rangeCounter) {
                    return 0;
                }
                if (rangeCounter >= 3) {
                    invalidRanges.push(start + '-' + end);
                    return;
                }
                invalidRanges.push(start);
                if (start !== end) {
                    invalidRanges.push(end);
                }
            };
            status.requested.forEach(val => {
                if (!status.invalid.includes(val)) {
                    addRange();
                    reset();
                    return;
                }
                start = start || val;
                end = val;
                rangeCounter++;
            });
            addRange();
            return invalidRanges.join(',');
        };

        multiselectStatusMap.forEach((status, indicatorName) => {
            if (!errors.has(indicatorName) && status.invalid && status.invalid.length > 0) {
                content.push(`<dt>${indicatorName}</dt><dd>with values${getInvalidValues(status)}</dd>`);
            }
        });
        if (content.length > 0) {
            console.log(content.join(''));
            this.service.error.show('Could not find data for all indicators', content.join(''), 10000);
        }
    },

    _addIndicators: function (searchValuesForIndicators) {
        let latestNewSearch = null;
        searchValuesForIndicators.forEach(searchValues => {
            const {datasource, indicator, selections, series} = searchValues;
            const added = this.service.getStateService().addIndicator(datasource, indicator, selections, series);
            if (added) {
                latestNewSearch = searchValues;
            }
        });
        if (latestNewSearch) {
            const {datasource, indicator, selections, series} = latestNewSearch;
            const hash = this.service.getStateService().getHash(datasource, indicator, selections, series);
            this.service.getStateService().setActiveIndicator(hash);
        }
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
