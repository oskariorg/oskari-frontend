import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showMedataPopup } from '../components/description/MetadataPopup';
import { getHashForIndicator } from '../helper/StatisticsHelper';
import { populateIndicatorOptions, validateSelectionsForSearch } from './SearchIndicatorOptionsHelper';
import { getIndicatorMetadata } from './IndicatorHelper';
import { getDatasources, getUnsupportedDatasourceIds, getRegionsets } from '../helper/ConfigHelper';
import { showSearchErrorPopup } from '../view/search/ErrorPopup';

class SearchController extends StateHandler {
    constructor (instance, service, stateHandler) {
        super();
        this.instance = instance;
        this.stateHandler = stateHandler;
        this.service = service;
        this.setState(this.getInitialState());
        this.metadataPopup = null;
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
                    Messaging.error(this.loc(error));
                    this.updateState({loading: false});
                })
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
            const keyWithTime = Object.keys(selectors).find((key) => selectors[key].time);
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
        this.updateState({selectedRegionset});
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
        this.updateState({selectedIndicators});
        if (this.metadataPopup) {
            this.openMetadataPopup();
        }
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

    handleMultipleIndicatorParams (indicators) {
        const combinedSelectors = {};
        const regionsets = new Set();

        const promise = new Promise((resolve, reject) => {
            indicators.forEach((indId, index) => {
                this.handleSingleIndicatorParams(indId, (data) => {
                    // include missing regionsets
                    data.regionsets.forEach(rs => regionsets.add(rs));
                    Object.keys(data.selectors).forEach((name) => {
                        const { values, time } = data.selectors[name];
                        const selector = combinedSelectors[name];
                        if (!selector) {
                            combinedSelectors[name] = { values, time };
                        } else {
                            const existingIds = selector.values.map(s => s.id);
                            const newValues = values.filter(v => !existingIds.includes(v.id));
                            if (newValues.length) {
                                selector.values = [...selector.values, ...newValues].sort((a,b) => b.id - a.id);
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
        const loc = this.loc('panels.newSearch.selectionValues');
        const { selectedDatasource } = this.getState();
        try {
            // TODO: metadata selector allowedValue can be value or { name, id } => handle in one place and cache {id, title} or {value, label}
            const meta = await this.service.getIndicatorMetadata(selectedDatasource, indicatorId);
            const { selectors = [], regionsets = [] } = meta;
            const combinedSelectors = {};
            selectors.forEach((selector) => {
                const { id, allowedValues, time = false } = selector;
                const values = allowedValues.map(val => {
                    // value or { name, id }
                    const valueId = val.id || val;
                    const name = val.name || valueId;
                    const title = loc[id]?.[name] || name;
                    return { id: valueId, title };
                });
                combinedSelectors[id] = { values, time };
            });

            const indicatorParams = {
                selectors: combinedSelectors,
                regionsets
            };
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
        this.updateState({indicatorParams: {...indicatorParams, ...params}});
        this.initParamSelections();
    }

    initParamSelections () {
        const { regionsetFilter, searchTimeseries, indicatorParams, selectedRegionset: rsId } = this.getState();
        const { selectors = {}, regionsets = [], selections: current = {}} = indicatorParams;
        const selections = {};
        const hasValidSelection = (key, allowed, time) => {
            const cur = current[key];
            if (time) {
                if (searchTimeseries) {
                    return cur.length === 2 && cur[0] < cur[1];
                }
                return Array.isArray(cur) && cur.some(id => allowed.includes(id));
            }
            return allowed.includes(cur);
        };
        // use selectors to get rid of removed selectors' selections
        Object.keys(selectors).forEach(key => {
            const { time, values } = selectors[key];
            const allowed = values.map(val => val.id);
            if (hasValidSelection(key, allowed, time)) {
                // has valid selection already, use it
                selections[key] = current[key];
                return;
            }
            const id = allowed[0];
            // time has multi-select => use array
            const selected = time ? [id] : id;
            if (time && searchTimeseries) {
                if (allowed.length < 2) {
                    Messaging.error(this.loc('errors.cannotDisplayAsSeries'));
                    this.updateState({ searchTimeseries: false });
                } else {
                    selected.unshift(allowed[allowed.length - 1]);
                }
            }
            selections[key] = selected;
        });
        // metadata regionsets doesn't have same order than all regionsets
        // select first allowed value from all regionsets
        const allowedIds = regionsetFilter.length ? regionsets.filter(id => regionsetFilter.includes(id)) : regionsets;
        const selectedRegionset = allowedIds.includes(rsId) ? rsId : getRegionsets().find(rs => allowedIds.includes(rs.id))?.id;
        this.updateState({ selectedRegionset, indicatorParams: {...indicatorParams, selections }});
    }

    setParamSelection (param, value) {
        const { indicatorParams } = this.getState();
        const { selections = {}} = indicatorParams;
        this.updateState({
            indicatorParams: {
                ...indicatorParams,
                selections: {...selections, [param]: value }
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
                    refinedSearchValues.push({ id: indicatorId, error: 'indicatorMetadataError'} );
                    continue;
                }
                const values  = this.getRefinedSearch(indicatorId, metadata);
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
        this.updateState({loading: false});
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
        const { selections = {}, selectors = {}} = indicatorParams;
        const keyWithTime = Object.keys(selections).find((key) => selectors[key].time);
        const indSearchValues = {
            id,
            ds: selectedDatasource,
            name: Oskari.getLocalized(metadata.name), // for showing error
            selections: {}
        };

        if (Array.isArray(metadata.regionsets) && !metadata.regionsets.includes(selectedRegionset)) {
            indSearchValues.error = 'notAllowedRegionset';
            return [indSearchValues];
        }
        const multiSelections = [];
        Object.keys(selections).forEach(key => {
            const selector = metadata.selectors.find(selector => selector.id === key);
            // TODO: simplify after metadata response is unified
            const checkAllowed = value => selector.allowedValues.includes(value) || selector.allowedValues.find(obj => obj.id === value);
            if (!selector) {
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
                const range = selectors[key].values
                    .map(val => val.id)
                    .filter(id => id >= first && id <= last)
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
                    const selections = {...indSearchValues.selections, [key]: val};
                    const indicator = {...indSearchValues, selections};
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
            const success = await this.stateHandler.addIndicator(indicator, regionset);
            // TODO: refactor to return error instead of boolean
            if (success) {
                latestHash = indicator.hash;
            } else {
                indicator.error = 'failedToAdd';
            }
        };
        if (latestHash) {
            // Search added some new indicators, let's set the last one as the active indicator.
            this.stateHandler.setActiveIndicator(latestHash);
        }
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
    'showIndicatorForm'
]);

export { wrapped as SearchHandler };
