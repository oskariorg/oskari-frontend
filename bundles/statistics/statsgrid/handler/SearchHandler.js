import { AsyncStateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showMedataPopup } from '../components/description/MetadataPopup';
import { getHashForIndicator } from '../helper/StatisticsHelper';
import { populateIndicatorOptions } from './SearchIndicatorOptionsHelper';
import { getIndicatorMetadata, getIndicatorData } from './IndicatorHelper';
import { getDatasources, getUnsupportedDatasourceIds, getRegionsets } from '../helper/ConfigHelper';

const getValueAsArray = (selection) => {
    if (selection === null || typeof selection === 'undefined') {
        return [];
    }
    if (Array.isArray(selection)) {
        return selection;
    }
    return [selection];
};

class SearchController extends AsyncStateHandler {
    constructor (instance, stateHandler) {
        super();
        this.instance = instance;
        this.stateHandler = stateHandler;
        this.setState(this.getInitialState());
        this.metadataPopup = null;
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.SearchHandler');
    }

    getName () {
        return 'SearchHandler';
    }

    getInitialState () {
        const ds = getDatasources().length === 1 ? getDatasources()[0] : null;
        // TODO: if ds => trigger populateIndicatorOptions => indicatorOptions
        return {
            searchTimeseries: false,
            selectedIndicators: [],
            regionsetFilter: [],
            selectedDatasource: ds ? ds.id : null,
            disabledDatasources: [],
            indicatorOptions: [],
            indicatorParams: null,
            isUserDatasource: ds ? ds.type === 'user' : false,
            loading: false
        };
    }

    clearSearch () {
        this.updateState(this.getInitialState());
    }

    async populateForm (indicator) {
        const { id, ds } = indicator;
        this.updateState({ selectedDatasource: ds });
        await this.fetchindicatorOptions();
        const indicators = id ? [id] : [];
        this.setSelectedIndicators(indicators);
    }

    onCacheUpdate ({ datasourceId, indicator }) {
        const { selectedDatasource, selectedIndicators } = this.getState();
        if (datasourceId && selectedDatasource === datasourceId) {
            this.fetchindicatorOptions();
        }
        if (indicator && selectedIndicators.includes(indicator.id)) {
            this.fetchIndicatorParams();
        }
    }

    async fetchindicatorOptions () {
        const { selectedDatasource, isUserDatasource } = this.getState();
        if (!selectedDatasource) {
            return;
        }

        this.updateState({
            loading: true
        });

        try {
            populateIndicatorOptions(selectedDatasource,
                response => {
                    const { indicators = [], complete = false } = response;
                    const results = indicators.map(ind => {
                        return {
                            id: ind.id,
                            title: Oskari.getLocalized(ind.name),
                            regionsets: ind.regionsets
                        };
                    });
                    this.updateState({
                        indicatorOptions: this.validateIndicatorList(results),
                        loading: !complete
                    });
                    if (complete && !isUserDatasource && !results.length) {
                        // show notification about empty indicator list for non-myindicators datasource
                        Messaging.error(this.loc('errors.indicatorListIsEmpty'));
                    }
                },
                error => {
                    Messaging.error(this.loc(error));
                    this.updateState({ loading: false });
                });
        } catch (error) {
            Messaging.error(this.loc('errors.indicatorListError'));
            this.updateState({
                indicatorOptions: [],
                loading: false
            });
        }
    }

    validateIndicatorList (indicators = []) {
        const { regionsetFilter } = this.getState();
        const hasRegionSetRestriction = Array.isArray(regionsetFilter) && regionsetFilter.length > 0;
        const supportsRegionset = (regionsets) => regionsetFilter.some(regionsetId => {
            return regionsets.includes(regionsetId);
        });
        const results = indicators.map(ind => {
            const value = {
                ...ind,
                disabled: false
            };
            if (hasRegionSetRestriction) {
                value.disabled = !supportsRegionset(ind.regionsets);
            }
            return value;
        });
        results.sort((a, b) => a.disabled - b.disabled);
        return results;
    }

    setSearchTimeseries (searchTimeseries) {
        this.updateState({
            searchTimeseries: !!searchTimeseries
        });

        const selectors = this.getState().indicatorParams?.selectors;
        if (!selectors) {
            return;
        }
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
                    ...this.getState().indicatorParams,
                    selected: {
                        ...this.getState().indicatorParams.selected,
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

    setRegionsetFilter (value) {
        this.updateState({
            regionsetFilter: value
        });
        if (!value || !value.length) {
            this.updateState({
                disabledDatasources: [],
                indicatorOptions: this.validateIndicatorList(this.getState().indicatorOptions)
            });
            return;
        }
        const disabledDatasources = getUnsupportedDatasourceIds(this.getState().regionsetFilter);
        if (disabledDatasources.length) {
            if (disabledDatasources.includes(this.getState().selectedDatasource)) {
                this.clearSearch();
                return;
            }
            this.updateState({
                // reset any selected indicators because if they are disabled, user can't unselect them
                selectedIndicators: [],
                indicatorParams: null,
                disabledDatasources,
                indicatorOptions: this.validateIndicatorList(this.getState().indicatorOptions)
            });
        }
    }

    setSelectedDatasource (value) {
        const ds = getDatasources().find(ds => ds.id === value) || {};
        this.updateState({
            selectedDatasource: ds.id || null,
            isUserDatasource: ds.type === 'user',
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

    // indicator is state handler's selected indicator (on map)
    async openMetadataPopup (indicator = null) {
        const datasource = indicator ? indicator.ds : this.getState().selectedDatasource;
        const indicatorIds = indicator ? [indicator.id] : this.getState().selectedIndicators;

        const data = await this.prepareMetadataPopupData(datasource, indicatorIds);
        if (this.metadataPopup) {
            this.metadataPopup.update(data);
        } else {
            this.metadataPopup = showMedataPopup(data, () => this.closeMetadataPopup());
        }
    }

    async prepareMetadataPopupData (datasource, indicatorIds) {
        const result = [];
        for (const id of indicatorIds) {
            try {
                const data = await getIndicatorMetadata(datasource, id);
                if (!data) {
                    return;
                }
                result.push(data);
            } catch (error) {
                return;
            }
        }
        return result;
    }

    closeMetadataPopup () {
        if (this.metadataPopup) {
            this.metadataPopup.close();
        }
        this.metadataPopup = null;
    }

    fetchIndicatorParams () {
        if (!this.getState().selectedIndicators || this.getState().selectedIndicators.length === 0) {
            this.updateState({
                indicatorParams: null
            });
            return;
        }

        if (this.getState().selectedIndicators.length > 1) {
            this.handleMultipleIndicatorParams();
        } else {
            this.handleSingleIndicatorParams(this.getState().selectedIndicators[0]);
        }
    }

    handleMultipleIndicatorParams () {
        const indicators = this.getState().selectedIndicators.filter((n) => { return n !== ''; });
        const combinedValues = {};
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
                        if (value.selectors[selectorName].time) {
                            combinedValues[selectorName].values.sort((a, b) => b.id - a.id);
                        }
                    });
                });
                if (index === indicators.length - 1) resolve();
            });
        });
        promise.then(() => {
            const data = {
                datasrc: this.getState().selectedDatasource,
                indicators: this.getState().selectedIndicators,
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

    async handleSingleIndicatorParams (indId, cb) {
        const panelLoc = this.loc('panels.newSearch');
        try {
            const { selectedDatasource, selectedIndicators } = this.getState();
            const result = await getIndicatorMetadata(selectedDatasource, indId);
            const combinedValues = {};
            result?.selectors.forEach((selector) => {
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
                    combinedValues[selector.id].values.push(valObject);
                });
                if (selector.time) {
                    combinedValues[selector.id].values.sort((a, b) => b.id - a.id);
                }
            });

            if (result.regionsets.length === 0) {
                Messaging.error(this.loc('errors.regionsetsIsEmpty'));
            }

            const data = {
                datasrc: selectedDatasource,
                selectors: combinedValues,
                indicators: selectedIndicators,
                regionset: result.regionsets,
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
        } catch (error) {
            Messaging.error(this.loc('errors.indicatorMetadataError'));
        }
    }

    initParamSelections (selectors, regionsets) {
        const { regionsetFilter, searchTimeseries } = this.getState();
        const selections = {};
        Object.keys(selectors).forEach(key => {
            let selected;
            if (selectors[key].time) {
                // time has multi-select => use array
                selected = [selectors[key].values[0].id];
                if (searchTimeseries) {
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
        // metadata regionsets doesn't have same order than all regionsets
        // select first allowed value from all regionsets
        const allowedIds = regionsetFilter.length ? regionsets.filter(id => regionsetFilter.includes(id)) : regionsets;
        selections.regionsets = getRegionsets().find(rs => allowedIds.includes(rs.id))?.id;
        return selections;
    }

    setParamSelection (param, value, index = null) {
        let val;
        if (index !== null) {
            val = this.getState().indicatorParams.selected[param];
            val[index] = value;
        } else {
            val = value;
        }
        this.updateState({
            indicatorParams: {
                ...this.getState().indicatorParams,
                selected: {
                    ...this.getState().indicatorParams.selected,
                    [param]: val
                }
            }
        });
    }

    getSearchValues () {
        const data = {
            datasource: this.getState().selectedDatasource,
            indicator: this.getState().selectedIndicators,
            regionset: this.getState().indicatorParams.selected.regionsets,
            selections: {
                ...this.getState().indicatorParams.selected
            }
        };

        const keyWithTime = Object.keys(this.getState().indicatorParams.selected).find((key) => this.getState().indicatorParams.selectors[key]?.time);

        if (keyWithTime && this.getState().searchTimeseries) {
            data.selections[keyWithTime] = this.getState().indicatorParams.selected[keyWithTime][0];
            const values = this.getState().indicatorParams.selectors[keyWithTime].values.filter(val => val.id >= this.getState().indicatorParams.selected[keyWithTime][0] && val.id <= this.getState().indicatorParams.selected[keyWithTime][1]).reverse();
            data.series = {
                id: keyWithTime,
                values: values.map(val => val.id || val)
            };
        } else if (keyWithTime) {
            data.selections[keyWithTime] = this.getState().indicatorParams.selected[keyWithTime];
        }

        return data;
    }

    search () {
        this.updateState({
            loading: true
        });
        const searchData = this.getSearchValues();
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
    async handleMultipleIndicatorsSearch (commonSearchValues) {
        const indicators = getValueAsArray(commonSearchValues.indicator);
        if (indicators.length === 0) {
            // nothing selected
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

        for (const indicator of indicators) {
            if (indicator === '') {
                checkDone();
                return;
            }
            // Overrides indicator array to make this search indicator specific.
            const addSearchValues = values => {
                refinedSearchValues.push({ ...values, indicator });
            };
            // Get indicator metadata to check the search valididty
            try {
                const metadata = await getIndicatorMetadata(commonSearchValues.datasource, indicator);
                // Map possible errors by indicator name
                const indicatorName = metadata && metadata.name ? Oskari.getLocalized(metadata.name) : indicator;
                if (!metadata) {
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
            } catch (error) {
                Messaging.error(this.loc('errors.indicatorMetadataError'));
            }
        }
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
        const indSearchValues = jQuery.extend(true, {}, commonSearchValues);
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
        const nextBatch = async () => {
            const batch = batches.pop();
            if (batch) {
                await consumeBatch(batch);
            }
        };
        const consumeBatch = async batch => {
            for (const search of batch) {
                // TODO: search values indicator => id, datasource => ds
                const { datasource: ds, indicator: id, regionset, ...rest } = search;
                try {
                    // TODO: addIndicator returns false if indicator couldn't be added
                    // these could be removed?
                    const data = await getIndicatorData({ id, ds, ...rest }, regionset);
                    if (!data) {
                        searchFailed(search);
                        return;
                    }
                    const enoughData = Object.values(data).some(val => !isNaN(val));
                    if (!enoughData) {
                        searchFailed(search);
                        return;
                    }
                    searchSuccessfull(search);
                } catch (error) {
                    searchFailed(search);
                }
            }
            nextBatch();
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

    async addIndicators (searchValues) {
        let latestHash = null;
        for (let i = 0; i < searchValues.length; i++) {
            // TODO: search values indicator => id, datasource => ds
            const { datasource: ds, indicator: id, regionset, ...rest } = searchValues[i];
            const indicator = { id, ds, ...rest };
            indicator.hash = getHashForIndicator(indicator);
            if (await this.stateHandler.addIndicator(indicator, regionset)) {
                latestHash = indicator.hash;
            }
        };
        if (latestHash) {
            // Search added some new indicators, let's set the last one as the active indicator.
            this.stateHandler.setActiveIndicator(latestHash);
        }
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
        const { selectedDatasource, selectedIndicators } = this.getState();
        const formHandler = this.instance.getViewHandler().formHandler;
        if (!formHandler) {
            return;
        }
        const indicator = selectedIndicators.length === 1 ? selectedIndicators[0] : null;
        formHandler.showIndicatorPopup(selectedDatasource, indicator);
    }
}

const wrapped = controllerMixin(SearchController, [
    'setSearchTimeseries',
    'setRegionsetFilter',
    'setSelectedDatasource',
    'setSelectedIndicators',
    'toggleFlyout',
    'closeSearchFlyout',
    'clearSearch',
    'openMetadataPopup',
    'setParamSelection',
    'search',
    'showIndicatorForm',
    'populateForm'
]);

export { wrapped as SearchHandler };
