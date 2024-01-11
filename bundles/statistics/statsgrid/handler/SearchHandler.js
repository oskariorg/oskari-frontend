import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showSearchFlyout } from '../view/search/SearchFlyout';
import { prepareData, showMedataPopup } from '../components/description/MetadataPopup';

class SearchController extends StateHandler {
    constructor (stateHandler, service, instance, sandbox) {
        super();
        this.instance = instance;
        this.sandbox = sandbox;
        this.stateHandler = stateHandler;
        this.service = service;
        this.setState({
            ...this.stateHandler.getState(),
            searchTimeseries: false,
            regionsetOptions: [],
            datasourceOptions: [],
            indicatorOptions: [],
            selectedRegionsets: [],
            selectedDatasource: null,
            selectedIndicators: [],
            disabledIndicators: [],
            disabledDatasources: [],
            indicatorParams: null,
            isUserDatasource: false,
            loading: false,
            flyout: null
        });
        this.metadataPopup = null;
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.eventHandlers = this.createEventHandlers();
        this.addStateListener(() => this.updateFlyout());
    };

    getName () {
        return 'SearchHandler';
    }

    toggleFlyout (show, extraOnClose) {
        if (show) {
            if (!this.state.flyout) {
                this.showSearchFlyout(extraOnClose);
            }
        } else {
            this.closeSearchFlyout();
        }
    }

    showSearchFlyout (extraOnClose) {
        this.fetchRegionsets();
        this.fetchDatasources();
        this.updateState({
            flyout: showSearchFlyout(this.getState(), this.getController(), () => {
                this.closeSearchFlyout();
                if (extraOnClose) extraOnClose();
            })
        });
    }

    closeSearchFlyout () {
        if (this.state.flyout) {
            this.state.flyout.close();
            this.updateState({
                flyout: null
            });
        }
    }

    updateFlyout () {
        if (this.state.flyout) {
            this.state.flyout.update(this.getState());
        }
    }

    clearSearch () {
        this.updateState({
            searchTimeseries: false,
            selectedDatasource: null,
            selectedIndicators: [],
            selectedRegionsets: [],
            disabledIndicatorIDs: [],
            disabledDatasources: [],
            indicatorOptions: [],
            indicatorParams: null,
            isUserDatasource: false
        });
    }

    fetchRegionsets () {
        this.updateState({
            regionsetOptions: this.service.getRegionsets()
        });
    }

    fetchDatasources () {
        this.updateState({
            datasourceOptions: this.service.getDatasources()
        });
    }

    fetchindicatorOptions () {
        if (!this.state.selectedDatasource || this.state.selectedDatasource === '') {
            return;
        }
        const hasRegionSetRestriction = Array.isArray(this.state.selectedRegionsets) && this.state.selectedRegionsets.length > 0;

        this.updateState({
            loading: true
        });

        const results = [];
        const disabledIndicatorIDs = [];
        const dataLoaded = new Promise((resolve, reject) => {
            this.service.getIndicatorList(this.state.selectedDatasource, (err, result) => {
                if (err) {
                    // notify error!!
                    Oskari.log('Oskari.statistics.statsgrid.IndicatorSelection').warn('Error getting indicator list');
                    Messaging.error(this.loc('errors.indicatorListError'));
                    reject(new Error(err));
                    return;
                }
                for (const ind of result?.indicators) {
                    const resultObj = {
                        id: ind.id,
                        title: Oskari.getLocalized(ind.name)
                    };
                    results.push(resultObj);
                    if (hasRegionSetRestriction) {
                        const supportsRegionset = this.state.selectedRegionsets.some((iter) => {
                            return ind.regionsets.indexOf(Number(iter)) !== -1;
                        });
                        if (!supportsRegionset) {
                            disabledIndicatorIDs.push(ind.id);
                        }
                    }
                }
                if (result.complete) {
                    const userDatasource = this.service.getUserDatasource();
                    const isUserDatasource = !!userDatasource && '' + userDatasource.id === '' + this.state.selectedDatasource;
                    if (!isUserDatasource && result.indicators.length === 0) {
                        // show notification about empty indicator list for non-myindicators datasource
                        Messaging.error(this.loc('errors.indicatorListIsEmpty'));
                    }
                    resolve();
                }
            });
        });
        dataLoaded
            .then(() => {
                this.updateState({
                    indicatorOptions: results,
                    disabledIndicators: disabledIndicatorIDs,
                    loading: false
                });
            })
            .catch(() => {
                this.updateState({
                    indicatorOptions: [],
                    disabledIndicators: [],
                    loading: false
                });
            });
    }

    setSearchTimeseries (searchTimeseries) {
        this.updateState({
            searchTimeseries: searchTimeseries
        });

        const selectors = this.state.indicatorParams?.selectors;
        if (selectors) {
            const keyWithTime = Object.keys(selectors).find((key) => selectors[key].time);
            if (keyWithTime) {
                let selected = selectors[keyWithTime].values[0].id;
                if (searchTimeseries) {
                    if (selectors[keyWithTime].values?.length <= 1) {
                        Messaging.error(this.loc('errors.cannotDisplayAsSeries'));
                        this.updateState({
                            searchTimeseries: false
                        });
                    } else {
                        const selectValues = [
                            selected,
                            selectors[keyWithTime].values[selectors[keyWithTime].values.length - 1].id
                        ];
                        selected = [...selectValues].sort((a, b) => (a - b));
                    }
                }
                this.updateState({
                    indicatorParams: {
                        ...this.state.indicatorParams,
                        selected: {
                            ...this.state.indicatorParams.selected,
                            [keyWithTime]: selected
                        }
                    }
                });
            } else if (searchTimeseries) {
                Messaging.error(this.loc('errors.cannotDisplayAsSeries'));
                this.updateState({
                    searchTimeseries: false
                });
            }
        }
    }

    setSelectedRegionsets (value) {
        this.updateState({
            selectedRegionsets: value
        });
        if (value && value.length > 0) {
            const unsupportedDatasources = this.service.getUnsupportedDatasetsList(this.state.selectedRegionsets);
            if (unsupportedDatasources) {
                const ids = unsupportedDatasources.map((iteration) => iteration.id);
                if (ids.includes(this.state.selectedDatasource)) {
                    this.clearSearch();
                }
                this.updateState({
                    disabledDatasources: ids
                });
            }
        } else {
            this.updateState({
                disabledDatasources: []
            });
        }
    }

    setSelectedDatasource (value) {
        this.updateState({
            selectedDatasource: value,
            isUserDatasource: this.service.getDatasource(Number(value)).type === 'user',
            selectedIndicators: [],
            indicatorParams: null
        });
        this.fetchindicatorOptions();
    }

    setSelectedIndicators (value) {
        this.updateState({
            selectedIndicators: value
        });
        if (this.metadataPopup) {
            this.openMetadataPopup();
        }
        this.fetchIndicatorParams();
    }

    openMetadataPopup (indicator = null) {
        const datasource = indicator ? indicator.datasource : this.state.selectedDatasource;
        const indicators = indicator ? indicator.indicator : this.state.selectedIndicators;
        prepareData(this.service, datasource, indicators, (result) => {
            if (this.metadataPopup) {
                this.metadataPopup.update(result);
            } else {
                this.metadataPopup = showMedataPopup(result, () => this.closeMetadataPopup());
            }
        });
    }

    closeMetadataPopup () {
        if (this.metadataPopup) {
            this.metadataPopup.close();
        }
        this.metadataPopup = null;
    }

    fetchIndicatorParams () {
        if (!this.state.selectedIndicators || this.state.selectedIndicators.length === 0) {
            this.updateState({
                indicatorParams: null
            });
            return;
        }

        if (this.state.selectedIndicators.length > 1) {
            this.handleMultipleIndicatorParams();
        } else {
            this.handleSingleIndicatorParams(this.state.selectedIndicators[0]);
        }
    }

    removeIndicator (indicator) {
        this.stateHandler.getController().removeIndicator(indicator);
    }

    handleMultipleIndicatorParams () {
        const indicators = this.state.selectedIndicators.filter((n) => { return n !== ''; });
        let combinedValues = {};
        let regionsets = [];

        const addMissingElements = (list, newValues, propertyName) => {
            if (!list) {
                return [].concat(newValues);
            }

            return list.concat(newValues.filter((value) => {
                return !list.some((existingItem) => {
                    if (propertyName) {
                        return existingItem[propertyName] === value[propertyName];
                    }
                    return existingItem === value;
                });
            }));
        };
        const promise = new Promise((resolve, reject) => {
            indicators.forEach((indId, index) => {
                this.handleSingleIndicatorParams(indId, (value) => {
                    // include missing regionsets
                    regionsets = addMissingElements(regionsets, value.regionset);
                    Object.keys(value.selectors).forEach((selectorName) => {
                        if (!combinedValues[selectorName]) {
                            combinedValues[selectorName] = {
                                values: [],
                                time: !!value.selectors[selectorName].time
                            };
                        }
                        combinedValues[selectorName].values = addMissingElements(combinedValues[selectorName].values, value.selectors[selectorName].values, 'id');
                    });
                });
                if (index === indicators.length - 1) resolve();
            });
        });
        promise.then(() => {
            const data = {
                datasrc: this.state.selectedDatasource,
                indicators: this.state.selectedIndicators,
                selectors: combinedValues,
                regionset: regionsets,
                selected: {}
            };
            data.selected = this.initParamSelections(data.selectors, data.regionset);
            this.updateState({
                indicatorParams: data
            });
        });
    }

    handleSingleIndicatorParams (indId, cb) {
        const panelLoc = this.loc('panels.newSearch');
        this.service.getIndicatorMetadata(this.state.selectedDatasource, indId, (err, indicator) => {
            if (err) {
                // notify error!!
                Messaging.error(this.loc('errors.indicatorMetadataError'));
                return;
            }
            const combinedValues = {};
            indicator.selectors.forEach((selector) => {
                selector.allowedValues.forEach((val) => {
                    if (!combinedValues[selector.id]) {
                        combinedValues[selector.id] = {
                            values: [],
                            time: selector.time || false
                        };
                    }
                    const name = val.name || val.id || val;
                    const optName = (panelLoc.selectionValues[selector.id] && panelLoc.selectionValues[selector.id][name]) ? panelLoc.selectionValues[selector.id][name] : name;

                    const valObject = {
                        id: val.id || val,
                        title: optName
                    };
                    combinedValues[selector.id]['values'].push(valObject);
                });
            });

            if (indicator.regionsets.length === 0) {
                Messaging.error('errors.regionsetsIsEmpty');
            }

            const data = {
                datasrc: this.state.selectedDatasource,
                selectors: combinedValues,
                indicators: this.state.selectedIndicators,
                regionset: indicator.regionsets,
                selected: {}
            };
            if (typeof cb === 'function') {
                cb(data);
            } else {
                data.selected = this.initParamSelections(data.selectors, data.regionset);
                this.updateState({
                    indicatorParams: data
                });
            }
        });
    }

    initParamSelections (selectors, regionsets) {
        let selections = {};
        Object.keys(selectors).forEach(key => {
            let selected;
            if (selectors[key].time) {
                selected = selectors[key].values[0].id;
                if (this.state.searchTimeseries) {
                    if (selectors[key].values?.length <= 1) {
                        Messaging.error(this.loc('errors.cannotDisplayAsSeries'));
                        this.updateState({
                            searchTimeseries: false
                        });
                    } else {
                        const series = [selected, selectors[key].values[selectors[key].values.length - 1].id];
                        selected = [...series].sort((a, b) => (a - b));
                    }
                }
            } else {
                selected = selectors[key].values[0].id;
            }

            selections[key] = selected;
        });
        selections.regionsets = regionsets[0];
        return selections;
    }

    setParamSelection (param, value, index = null) {
        let val;
        if (index !== null) {
            val = this.state.indicatorParams.selected[param];
            val[index] = value;
        } else {
            val = value;
        }
        this.updateState({
            indicatorParams: {
                ...this.state.indicatorParams,
                selected: {
                    ...this.state.indicatorParams.selected,
                    [param]: val
                }
            }
        });
    }

    getSearchValues () {
        const data = {
            datasource: this.state.selectedDatasource,
            indicator: this.state.selectedIndicators,
            regionset: this.state.indicatorParams.selected.regionsets,
            selections: {
                ...this.state.indicatorParams.selected
            }
        };

        const keyWithTime = Object.keys(this.state.indicatorParams.selected).find((key) => this.state.indicatorParams.selectors[key].time);

        if (this.state.searchTimeseries) {
            data.selections[keyWithTime] = this.state.indicatorParams.selected[keyWithTime][0];
            const values = this.state.indicatorParams.selectors[keyWithTime].values.filter(val => val.id >= this.state.indicatorParams.selected[keyWithTime][0] && val.id <= this.state.indicatorParams.selected[keyWithTime][1]).reverse();
            data.series = {
                id: keyWithTime,
                values: values.map(val => val.id || val)
            };
        } else if (keyWithTime) {
            data.selections[keyWithTime] = this.state.indicatorParams.selected[keyWithTime];
        }

        return data;
    }

    search () {
        this.updateState({
            loading: true
        });
        const searchData = this.getSearchValues();
        this.service.getStateService().setRegionset(searchData.regionset);
        this.handleMultipleIndicatorsSearch(searchData);
    }

    /**
     * @method getIndividualSearchValues To get indicator specific search selections.
     * Use can have multiple indicators selected and those indicators might have different selections.
     * We can't just use the same values for each indicator.
     *
     * This function rules out any unsupported selection parameters for each indicator and warns user of invalid values.
     * (f.ex.Selected year out of range)
     *
     * @param {Object} commonSearchValues User's selected values from the search form
     */
    handleMultipleIndicatorsSearch (commonSearchValues) {
        const indicators = Array.isArray(commonSearchValues.indicator) ? commonSearchValues.indicator : [commonSearchValues.indicator];
        if (!commonSearchValues.indicator || indicators.length === 0) {
            return;
        }
        const refinedSearchValues = [];
        const errorMap = new Map();
        const multiselectStatusMap = new Map();

        // Overrides selection key and value from provided search values.
        const getSearchWithModifiedParam = (values, paramKey, paramValue) => {
            const modSelection = { ...values.selections, [paramKey]: paramValue };
            return { ...values, selections: modSelection };
        };

        let metadataCounter = 0;
        const checkDone = () => {
            metadataCounter++;
            if (metadataCounter === indicators.length) {
                // All metadata requests have finished
                this.addIndicatorsHavingData(refinedSearchValues, errorMap, multiselectStatusMap);
            }
        };

        indicators.forEach(indicator => {
            if (indicator === '') {
                checkDone();
                return;
            }
            // Overrides indicator array to make this search indicator specific.
            const addSearchValues = values => {
                refinedSearchValues.push({ ...values, indicator });
            };
            // Get indicator metadata to check the search valididty
            this.service.getIndicatorMetadata(commonSearchValues.datasource, indicator, (err, metadata) => {
                // Map possible errors by indicator name
                const indicatorName = metadata && metadata.name ? Oskari.getLocalized(metadata.name) : indicator;
                if (err || !metadata) {
                    errorMap.set(indicatorName, { metadataNotFound: true });
                    checkDone();
                    return;
                }
                const { error, multiselectStatus, ...searchValues } = this.getRefinedSearch(metadata, commonSearchValues);

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
    }

    /**
     * @method getRefinedSearch
     * Makes the actual selection validation based on the indicator metadata.
     *
     * @param {Object} metadata Indicator metadata
     * @param {Object} commonSearchValues the search form values
     * @return {Object} search values suited for an indicator.
     * Adds "error" and "multiselectStatus" information to the search values.
     */
    getRefinedSearch (metadata, commonSearchValues) {
        // Make a deep clone of search values
        var indSearchValues = jQuery.extend(true, {}, commonSearchValues);
        const { regionset, selections, series } = indSearchValues;

        if (Array.isArray(metadata.regionsets) && !metadata.regionsets.includes(Number(regionset))) {
            indSearchValues.error = { notAllowed: 'regionset' };
            return indSearchValues;
        }
        if (!selections) {
            return indSearchValues;
        }

        Object.keys(selections).forEach(selectionKey => {
            const selector = metadata.selectors.find(selector => selector.id === selectionKey);
            const checkNotAllowed = value => {
                value = value.id || value;
                return !selector.allowedValues.includes(value) && !selector.allowedValues.find(obj => obj.id === value);
            };

            if (!selector) {
                // Remove unsupported selectors silently
                delete selections[selectionKey];
                return;
            }
            const isSeriesSelection = series && series.id === selectionKey;
            const value = isSeriesSelection ? series.values : selections[selectionKey];

            if (!Array.isArray(value)) {
                // Single option
                if (checkNotAllowed(value)) {
                    indSearchValues.error = { notAllowed: selectionKey };
                }
                return;
            }
            // Multiselect or series
            // Filter out unsupported search param values
            const notAllowed = value.filter(checkNotAllowed);

            // Set multiselect status for search
            indSearchValues.multiselectStatus = { selector: selectionKey, invalid: notAllowed, requested: [...value] };

            if (notAllowed.length === 0) {
                // Selected values are valid
                return;
            }
            if (notAllowed.length === value.length) {
                // All selected values are out of range
                delete selections[selectionKey];
                indSearchValues.error = { notAllowed: selectionKey };
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
    }

    /**
     * @method addIndicatorsWithData
     * Performs data check for each search.
     * Adds indicators that have data.
     *
     * @param {Array} searchValues
     * @param {Map} errors
     * @param {Map} multiselectStatusMap
     */
    addIndicatorsHavingData (searchValues, errors, multiselectStatusMap) {
        const indicatorsHavingData = new Set();
        const successfullSearches = [];
        const failedSearches = [];
        let indicatorCounter = 0;

        const checkDone = () => {
            indicatorCounter++;
            if (indicatorCounter >= searchValues.length) {
                // Handle indicators that failed the test
                failedSearches.forEach(cur => this.updateSearchStatusWithFailure(
                    cur,
                    errors,
                    multiselectStatusMap,
                    successfullSearches,
                    indicatorsHavingData
                ));
                this.showSearchErrorMessages(successfullSearches, errors, multiselectStatusMap);
                this.addIndicators(successfullSearches);
                this.updateState({
                    loading: false
                });
                this.stateHandler.getController().fetchIndicators();
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
        const batchSize = 1;
        const batches = [];
        let batch;
        searchValues.forEach((search, index) => {
            if (index % batchSize === 0) {
                batch = [];
                batches.push(batch);
            }
            batch.push(search);
        });
        const nextBatch = () => {
            let batch = batches.pop();
            if (batch) {
                consumeBatch(batch);
            }
        };
        const consumeBatch = batch => {
            const dataPromises = [];
            batch.forEach((search, index) => {
                const { datasource, indicator, selections, series, regionset } = search;
                const promise = new Promise((resolve, reject) => {
                    this.service.getIndicatorData(datasource, indicator, selections, series, regionset, (err, data) => {
                        if (err || !data) {
                            searchFailed(search);
                            resolve();
                            return;
                        }
                        const enoughData = Object.values(data).some(val => !isNaN(val));
                        if (!enoughData) {
                            searchFailed(search);
                            resolve();
                            return;
                        }
                        searchSuccessfull(search);
                        resolve();
                    });
                });
                dataPromises.push(promise);
            });
            Promise.all(dataPromises).then(nextBatch);
        };
        nextBatch();
    }

    updateSearchStatusWithFailure (failedSearch, errors, multiselectStatusMap, successfullSearches, indicatorsHavingData) {
        if (errors.has(failedSearch.indicatorName)) {
            return;
        }
        if (!indicatorsHavingData.has(failedSearch.indicator)) {
            errors.set(failedSearch.indicatorName, { datasetEmpty: true });
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
    }

    showSearchErrorMessages (successfullSearches, errors, multiselectStatusMap) {
        if (errors.size + multiselectStatusMap.size === 0) {
            return;
        }

        const indicatorMessages = [];
        errors.forEach((value, indicatorName) => indicatorMessages.push(indicatorName));

        multiselectStatusMap.forEach((status, indicatorName) => {
            if (!errors.has(indicatorName) && status.invalid && status.invalid.length > 0) {
                indicatorMessages.push(indicatorName + ' (' + this.getInvalidValuesStr(status.invalid, status.requested) + ')');
            }
        });
        if (indicatorMessages.length > 0) {
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okBtn = dialog.createCloseButton('OK');
            let title;
            if (successfullSearches.length > 0) {
                title = this.loc('errors.onlyPartialDataForIndicators', { indicators: indicatorMessages.length });
            } else {
                title = this.loc('errors.noDataForIndicators', { indicators: indicatorMessages.length });
            }
            dialog.show(title, indicatorMessages.join('<br>'), [okBtn]);
        }
    }

    addIndicators (searchValues) {
        let latestNewSearch = null;
        searchValues.forEach(values => {
            const { datasource, indicator, selections, series } = values;
            if (this.service.getStateService().addIndicator(datasource, indicator, selections, series)) {
                // Indicator was not already present at the service
                latestNewSearch = values;
            }
        });
        if (latestNewSearch) {
            // Search added some new indicators, let's set the last one as the active indicator.
            const { datasource, indicator, selections, series } = latestNewSearch;
            const hash = this.service.getStateService().getHash(datasource, indicator, selections, series);
            this.service.getStateService().setActiveIndicator(hash);
        }
        /* if (this.getSpinner()) {
            this.getSpinner().stop();
        } */
    }

    getInvalidValuesStr (invalids, all) {
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
    }

    showIndicatorForm () {
        const formHandler = this.stateHandler.getController().getFormHandler();
        if (this.state.selectedIndicators?.length === 1) {
            formHandler.showIndicatorPopup(this.state.selectedDatasource, this.state.selectedIndicators[0]);
        } else {
            formHandler.showIndicatorPopup(this.state.selectedDatasource);
        }
    }

    createEventHandlers () {
        this.service.on('StatsGrid.IndicatorEvent', (event) => {
            this.fetchindicatorOptions();
        });
    }
}

const wrapped = controllerMixin(SearchController, [
    'setSearchTimeseries',
    'setSelectedRegionsets',
    'setSelectedDatasource',
    'setSelectedIndicators',
    'toggleFlyout',
    'closeSearchFlyout',
    'clearSearch',
    'openMetadataPopup',
    'setParamSelection',
    'search',
    'removeIndicator',
    'showIndicatorForm'
]);

export { wrapped as SearchHandler };
