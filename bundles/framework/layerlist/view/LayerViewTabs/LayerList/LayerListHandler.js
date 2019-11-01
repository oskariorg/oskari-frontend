import { StateHandler, Timeout, mutatorMixin } from 'oskari-ui/util';
import { FilterHandler } from './Filter/';
import { LayerCollapseHandler } from './LayerCollapse/';
import { GroupingOption } from '../../../model/GroupingOption';
import { Scale } from '../../../model/Scale';
import { GROUPING_PRESET, TEXT_SEARCH_TYPING_TIMEOUT_SETTINGS } from './preset';

const UI_UPDATE_TIMEOUT = 100;
const HEAVY_UI_UPDATE_TIMEOUT = 600;

class UIStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.locale = instance.getLocalization();

        const { MIN_CHAR_COUNT, MAX_CHAR_COUNT, MIN, MAX } = TEXT_SEARCH_TYPING_TIMEOUT_SETTINGS;
        this.typingTimeoutScale = new Scale({
            min: MIN_CHAR_COUNT,
            max: MAX_CHAR_COUNT,
            rangeMin: MAX,
            rangeMax: MIN,
            outOfRange: MIN
        });

        // Replace GROUPING_PRESET with bundle configuration later.
        const groupingOptions = GROUPING_PRESET.map(option =>
            new GroupingOption(option.key, this.locale.grouping[option.localeKey], option.method));

        this.filterHandler = this._createFilterHandler();
        this.layerCollapseHandlers = this._createLayerCollapseHandlers(groupingOptions);
        const selectedGrouping = groupingOptions[0].getKey();
        const collapseHandler = this.getCollapseHandler(selectedGrouping);

        this.state = {
            loading: false,
            updating: false,
            showAddButton: this.sandbox.hasHandler('ShowLayerEditorRequest'),
            grouping: {
                selected: selectedGrouping,
                options: groupingOptions
            },
            filter: {
                state: this.filterHandler.getState(),
                mutator: this.filterHandler.getMutator()
            },
            collapse: {
                state: collapseHandler.getState(),
                mutator: collapseHandler.getMutator()
            }
        };
    }

    _createLayerCollapseHandlers (groupingOptions) {
        const handlers = {};
        groupingOptions.forEach(option => {
            const handler = new LayerCollapseHandler(this.instance, option.getMethod());
            handler.addStateListener(collapseState => {
                if (option.getKey() !== this.state.grouping.selected) {
                    // Not the active grouping, ignore.
                    return;
                }
                this.updateState({
                    collapse: {
                        state: collapseState,
                        mutator: handler.getMutator()
                    },
                    updating: false
                });
            });
            handlers[option.getKey()] = handler;
        });
        return handlers;
    }

    _createFilterHandler () {
        const handler = new FilterHandler(this.instance);

        let previousState = null;
        const updateLayerFilters = () => {
            previousState = handler.getState();
            const { activeFilterId, searchText } = previousState;
            this.updateState({ updating: true });
            setTimeout(() => this.getCollapseHandler().setFilter(activeFilterId, searchText), UI_UPDATE_TIMEOUT);
        };

        let typingTimeout = null;
        handler.addStateListener(filterState => {
            const { searchText } = filterState;
            const searchTextChanged = previousState && previousState.searchText !== searchText;

            const immediateStateChange = {
                filter: {
                    state: filterState,
                    mutator: this.state.filter.mutator
                }
            };
            if (!searchTextChanged) {
                updateLayerFilters();
                this.updateState(immediateStateChange);
                return;
            }
            if (typingTimeout && typingTimeout.isPending()) {
                typingTimeout.cancel();
            }

            // Search text changed, give user some time to type in his search.
            // The longer the search text the shorted delay.
            let typingTimeoutMs = this.typingTimeoutScale.getValue(searchText.length);
            typingTimeout = new Timeout(updateLayerFilters, typingTimeoutMs);

            this.updateState(immediateStateChange);
        });

        return handler;
    }

    getFilterHandler () {
        return this.filterHandler;
    }

    getCollapseHandler (grouping = this.state.grouping.selected) {
        return this.layerCollapseHandlers[grouping];
    }

    loadLayers () {
        const mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.updateState({ loading: true });
        const successCB = () => {
            this.updateState({ loading: false });
        };
        const failureCB = () => {
            this.updateState({
                loading: false,
                error: this.locale.errors.loadFailed
            });
            alert(this.locale.errors.loadFailed);
        };
        const forceProxy = this.instance.conf && this.instance.conf.forceProxy;
        mapLayerService.loadAllLayerGroupsAjax(successCB, failureCB, { forceProxy });
    }

    updateAdminState () {
        this.updateState({
            showAddButton: this.sandbox.hasHandler('ShowLayerEditorRequest')
        });
    }

    setGrouping (groupingKey) {
        const handler = this.getCollapseHandler(groupingKey);
        if (!handler) {
            return;
        }
        this.updateState({
            grouping: {
                options: this.state.grouping.options,
                selected: groupingKey
            },
            updating: true
        });
        const { activeFilterId, searchText } = this.state.filter.state;
        setTimeout(() => handler.setFilter(activeFilterId, searchText), HEAVY_UI_UPDATE_TIMEOUT);
    }
}

export const LayerListHandler = mutatorMixin(UIStateHandler, [
    'setGrouping'
]);
