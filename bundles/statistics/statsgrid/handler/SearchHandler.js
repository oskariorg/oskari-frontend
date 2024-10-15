import { AsyncStateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { getHashForIndicator } from '../helper/StatisticsHelper';
import { populateIndicatorOptions, validateSelectionsForSearch } from './SearchIndicatorOptionsHelper';
import { getIndicatorMetadata } from './IndicatorHelper';
import { getDatasources, getUnsupportedDatasourceIds, getRegionsets } from '../helper/ConfigHelper';
import { showSearchErrorPopup } from '../view/search/ErrorPopup';

class SearchController extends AsyncStateHandler {
    constructor (instance, stateHandler) {
        super();
        this.instance = instance;
        this.stateHandler = stateHandler;
        this.setState(this.getInitialState());
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.SearchHandler');
    }

    getName () {
        return 'SearchHandler';
    }

    getInitialState (isReset) {
        const ds = getDatasources().length === 1 ? getDatasources()[0] : null;
        if (ds && !isReset) {
            // prepopulate indicator options
            setTimeout(() => this.fetchindicatorOptions(ds.id), 10000);
        }
        return {
            searchTimeseries: false,
            selectedIndicators: [],
            regionsetFilter: [],
            selectedDatasource: ds ? ds.id : null,
            selectedRegionset: null,
            disabledDatasources: [],
            indicatorOptions: ds && isReset ? this.getState().indicatorOptions : [],
            indicatorParams: {}, // selectors, selected, selections
            isUserDatasource: ds ? ds.type === 'user' : false,
            loading: false
        };
    }

    clearSearch () {
        this.updateState(this.getInitialState(true));
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
                    this.updateState({
                        indicatorOptions: this.validateIndicatorList(indicators),
                        loading: !complete
                    });
                    if (complete && !isUserDatasource && !indicators.length) {
                        // show notification about empty indicator list for non-myindicators datasource
                        Messaging.error(this.loc('errors.indicatorListIsEmpty'));
                    }
                },
                error => {
                    const errorMsg = this.loc('errors')[error] || this.loc('errors.indicatorListError');
                    Messaging.error(errorMsg);
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
        const hasFilter = regionsetFilter.length > 0;
        const isDisabled = (regionsets) => hasFilter && !regionsetFilter.some(regionsetId => regionsets.includes(regionsetId));
        const results = indicators.map(ind => {
            return {
                ...ind,
                disabled: isDisabled(ind.regionsets)
            };
        });
        results.sort((a, b) => a.disabled - b.disabled);
        return results;
    }

    setSearchTimeseries (searchTimeseries) {
        const { selectors } = this.getState().indicatorParams;
        if (selectors && searchTimeseries) {
            const keyWithTime = selectors.find(sel => sel.time)?.id;
            if (!keyWithTime) {
                Messaging.error(this.loc('errors.cannotDisplayAsSeries'));
                this.updateState({ searchTimeseries: false });
                return;
            }
        }
        this.updateState({ searchTimeseries });
        this.initParamSelections();
    }

    setSelectedRegionset (selectedRegionset) {
        this.updateState({ selectedRegionset });
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
        const disabledDatasources = getUnsupportedDatasourceIds(value);
        if (disabledDatasources.length) {
            if (disabledDatasources.includes(this.getState().selectedDatasource)) {
                this.clearSearch();
                return;
            }
            this.updateState({
                // reset any selected indicators because if they are disabled, user can't unselect them
                selectedIndicators: [],
                indicatorParams: {},
                selectedRegionset: null,
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
            indicatorParams: {},
            selectedRegionset: null
        });
        this.fetchindicatorOptions();
    }

    setSelectedIndicators (selectedIndicators) {
        this.updateState({ selectedIndicators });
        if (!selectedIndicators.length) {
            this.updateState({ indicatorParams: {}, selectedRegionset: null });
            return;
        }
        if (selectedIndicators.length > 1) {
            this.handleMultipleIndicatorParams(selectedIndicators);
        } else {
            this.handleSingleIndicatorParams(selectedIndicators[0]);
        }
    }

    handleMultipleIndicatorParams (indicators) {
        const combinedSelectors = [];
        const regionsets = new Set();

        const promise = new Promise((resolve, reject) => {
            indicators.forEach((indId, index) => {
                this.handleSingleIndicatorParams(indId, (params) => {
                    // include missing regionsets
                    params.regionsets.forEach(rs => regionsets.add(rs));
                    params.selectors.forEach((selector) => {
                        const existing = combinedSelectors.find(s => s.id === selector.id);
                        if (!existing) {
                            combinedSelectors.push(selector);
                        } else {
                            const existingIds = existing.values.map(s => s.id);
                            const newValues = selector.values.filter(v => !existingIds.includes(v.id));
                            if (newValues.length) {
                                existing.values = [...existing.values, ...newValues].sort((a, b) => b.value - a.value);
                            }
                        }
                    });
                });
                if (index === indicators.length - 1) resolve();
            });
        });
        promise.then(() => {
            const indicatorParams = {
                selectors: combinedSelectors,
                regionsets: [...regionsets]
            };
            this.setIndicatorParams(indicatorParams);
        });
    }

    async handleSingleIndicatorParams (indicatorId, cb) {
        const { selectedDatasource } = this.getState();
        try {
            const meta = await getIndicatorMetadata(selectedDatasource, indicatorId);
            const { selectors = [], regionsets = [] } = meta;
            const indicatorParams = { selectors, regionsets };
            if (typeof cb === 'function') {
                cb(indicatorParams);
            } else {
                this.setIndicatorParams(indicatorParams);
            }
        } catch (error) {
            Messaging.error(this.loc('errors.indicatorMetadataError'));
        }
    }

    setIndicatorParams (params) {
        const { indicatorParams } = this.getState();
        this.updateState({ indicatorParams: { ...indicatorParams, ...params } });
        this.initParamSelections();
    }

    initParamSelections () {
        const { regionsetFilter, searchTimeseries, indicatorParams, selectedRegionset: rsId } = this.getState();
        const { selectors = [], regionsets = [], selections: current = {} } = indicatorParams;
        const selections = {};
        const hasValidSelection = (id, allowed, time) => {
            const cur = current[id];
            if (time) {
                if (searchTimeseries) {
                    return cur.length === 2 && cur[0] < cur[1];
                }
                return Array.isArray(cur) && cur.some(value => allowed.includes(value));
            }
            return allowed.includes(cur);
        };
        // use selectors to get rid of removed selectors' selections
        selectors.forEach(({ time, values, id }) => {
            const allowed = values.map(v => v.value);
            if (hasValidSelection(id, allowed, time)) {
                // has valid selection already, use it
                selections[id] = current[id];
                return;
            }
            const value = allowed[0];
            // time has multi-select => use array
            const selected = time ? [value] : value;
            if (time && searchTimeseries) {
                if (allowed.length < 2) {
                    Messaging.error(this.loc('errors.cannotDisplayAsSeries'));
                    this.updateState({ searchTimeseries: false });
                } else {
                    selected.unshift(allowed[allowed.length - 1]);
                }
            }
            selections[id] = selected;
        });
        // metadata regionsets doesn't have same order than all regionsets
        // select first allowed value from all regionsets
        const allowedIds = regionsetFilter.length ? regionsets.filter(id => regionsetFilter.includes(id)) : regionsets;
        const selectedRegionset = allowedIds.includes(rsId) ? rsId : getRegionsets().find(rs => allowedIds.includes(rs.id))?.id;
        this.updateState({ selectedRegionset, indicatorParams: { ...indicatorParams, selections } });
    }

    setParamSelection (param, value) {
        const { indicatorParams } = this.getState();
        const { selections = {} } = indicatorParams;
        this.updateState({
            indicatorParams: {
                ...indicatorParams,
                selections: { ...selections, [param]: value }
            }
        });
    }

    search () {
        this.updateState({ loading: true });
        this.handleMultipleIndicatorsSearch();
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
    async handleMultipleIndicatorsSearch () {
        const state = this.getState();
        // Form should be disabled with invalid selections
        if (!validateSelectionsForSearch(state)) {
            // nothing selected
            return;
        }
        let refinedSearchValues = [];
        const datasourceId = state.selectedDatasource;
        for (const indicatorId of state.selectedIndicators) {
            // Get indicator metadata to check the search valididty
            try {
                const metadata = await getIndicatorMetadata(datasourceId, indicatorId);
                if (!metadata) {
                    refinedSearchValues.push({ id: indicatorId, error: 'indicatorMetadataError' });
                    continue;
                }
                const values = this.getRefinedSearch(indicatorId, metadata);
                refinedSearchValues = [...refinedSearchValues, ...values];
            } catch (error) {
                Messaging.error(this.loc('errors.indicatorMetadataError'));
            }
        }
        await this.addIndicators(refinedSearchValues.filter(i => !i.error), state.selectedRegionset);
        // addIndicators sets error if failed to add => filter afterward
        const errors = refinedSearchValues.filter(i => i.error || i.partialSeries);
        if (errors.length) {
            const isPartial = errors.length !== refinedSearchValues.length;
            showSearchErrorPopup(errors, isPartial);
        }
        this.updateState({ loading: false });
    }

    /**
     * @method getRefinedSearch
     * Makes the actual selection validation based on the indicator metadata.
     *
     * @param {Object} metadata Indicator metadata
     * @return {Object} search values suited for an indicator.
     * Adds "error" and "multiselectStatus" information to the search values.
     */
    getRefinedSearch (id, metadata) {
        const { indicatorParams, searchTimeseries, selectedRegionset, selectedDatasource } = this.getState();
        const { selections = {}, selectors = [] } = indicatorParams;
        const keyWithTime = Object.keys(selections).find((key) => selectors.find(s => s.id === key && s.time));
        const indSearchValues = {
            id,
            ds: selectedDatasource,
            name: metadata.name, // for showing error
            selections: {}
        };

        if (Array.isArray(metadata.regionsets) && !metadata.regionsets.includes(selectedRegionset)) {
            indSearchValues.error = 'notAllowedRegionset';
            return [indSearchValues];
        }
        const multiSelections = [];
        Object.keys(selections).forEach(key => {
            const metaSelector = metadata.selectors.find(selector => selector.id === key);
            // use metadata for validity check. Params have combined selectors.
            const checkAllowed = value => metaSelector.values.find(obj => obj.value === value);
            if (!metaSelector) {
                indSearchValues.error = 'indicatorMetadataError';
                return;
            }
            const values = selections[key];
            // single
            if (!Array.isArray(values)) {
                indSearchValues.selections[key] = values;
                if (!checkAllowed(values)) {
                    indSearchValues.error = 'invalidSelection';
                }
                return;
            }
            // series
            if (key === keyWithTime && searchTimeseries) {
                const [first, last] = values;
                // should always find values as keyWithTime is selected from selectors
                const range = selectors.find(s => s.id === keyWithTime).values
                    .map(val => val.value)
                    .filter(val => val >= first && val <= last)
                    .reverse();
                const allowedValues = range.filter(checkAllowed);
                indSearchValues.series = {
                    id: keyWithTime,
                    values: allowedValues
                };
                if (range.length !== allowedValues.length) {
                    const invalids = range.filter(val => !checkAllowed(val));
                    const all = range;
                    indSearchValues.partialSeries = { invalids, all };
                }
                if (allowedValues < 2) {
                    indSearchValues.error = 'cannotDisplayAsSeries';
                }
                indSearchValues.selections[key] = first;
                return;
            }
            multiSelections.push({
                key,
                values,
                invalid: values.filter(val => !checkAllowed(val))
            });
        });
        // Add own search for each value of the multiple select
        if (multiSelections.length) {
            const indicators = [];
            multiSelections.forEach(({ key, values, invalid }) => {
                values.forEach(val => {
                    const selections = { ...indSearchValues.selections, [key]: val };
                    const indicator = { ...indSearchValues, selections };
                    if (invalid.includes(val)) {
                        indicator.error = 'invalidSelection';
                    }
                    indicators.push(indicator);
                });
            });
            return indicators;
        }
        return [indSearchValues];
    }

    async addIndicators (searchValues, regionset) {
        let latestHash = null;
        for (let i = 0; i < searchValues.length; i++) {
            const indicator = searchValues[i];
            indicator.hash = getHashForIndicator(indicator);
            const { success, error } = await this.stateHandler.addIndicator(indicator, regionset);
            if (success) {
                latestHash = indicator.hash;
            } else if (error) {
                indicator.error = error;
            }
        };
        if (latestHash) {
            // Search added some new indicators, let's set the last one as the active indicator.
            this.stateHandler.setActiveIndicator(latestHash);
        }
    }

    showIndicatorForm () {
        const { selectedDatasource, selectedIndicators } = this.getState();
        const formHandler = this.instance.getViewHandler()?.formHandler;
        if (!formHandler) {
            return;
        }
        const indicator = selectedIndicators.length === 1 ? selectedIndicators[0] : null;
        formHandler.showIndicatorPopup(selectedDatasource, indicator);
    }

    openMetadataPopup (indicator) {
        let indicators = [];
        if (indicator) {
            indicators = [indicator];
        } else {
            const { selectedIndicators, selectedDatasource: ds } = this.getState();
            indicators = selectedIndicators.map(id => ({ id, ds }));
        }
        this.instance.getViewHandler()?.openMetadataPopup(indicators);
    }
}

const wrapped = controllerMixin(SearchController, [
    'setSearchTimeseries',
    'setSelectedRegionset',
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
