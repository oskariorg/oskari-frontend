import { StateHandler, mutatorMixin } from 'oskari-ui/util';
import { FilterHandler } from './FilterHandler';
import { CollapseHandler } from './LayerCollapse/';
import { GroupingOption } from '../../../model/GroupingOption';

const TEXT_SEARCH_THROTTLE = 1000;
const UI_UPDATE_TIMEOUT = 100;
const HEAVY_UI_UPDATE_TIMEOUT = 300;

const GROUPING_PRESET = [
    {
        key: 'THEME',
        localeKey: 'inspire',
        method: 'getInspireName'
    },
    {
        key: 'ORGANIZATION',
        localeKey: 'organization',
        method: 'getOrganizationName'
    }
];

class UIStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.locale = instance.getLocalization();

        // Replace GROUPING_PRESET with bundle configuration later.
        const groupingOptions = GROUPING_PRESET.map(option =>
            new GroupingOption(option.key, this.locale.filter[option.localeKey], option.method));

        this._initFilterHandler();
        this._initCollapseHandlers(groupingOptions);

        this.state = {
            loading: false,
            grouping: {
                selected: groupingOptions[0].getKey(),
                options: groupingOptions
            }
        };
        this._updateFilter();
        this._updateCollapse();
    }

    _initCollapseHandlers (groupingOptions) {
        const handlers = {};
        groupingOptions.forEach(option => {
            const handler = new CollapseHandler(this.instance, option.getMethod());
            handler.addStateListener(state => {
                if (option.getKey() !== this.state.grouping.selected) {
                    // Not the active grouping, ignore.
                    return;
                }
                this._updateCollapse();
            });
            handlers[option.getKey()] = handler;
        });
        this.collapseHandlers = handlers;
    }

    _initFilterHandler () {
        const uiHandler = new FilterHandler(this.instance);

        let previousFilter = null;
        const updateLayerFilters = (filterState) => {
            previousFilter = filterState;
            const { activeFilterId, searchText } = filterState;
            setTimeout(() => {
                this._getCurrentCollapseHandler().setFilter(activeFilterId, searchText);
            }, UI_UPDATE_TIMEOUT);
        };

        const throttledLayerFilterUpdate = Oskari.util.throttle(
            updateLayerFilters, TEXT_SEARCH_THROTTLE, { leading: false });

        uiHandler.addStateListener(filterState => {
            const { searchText } = filterState;
            if (previousFilter && previousFilter.searchText !== searchText) {
                // Search text changed, give user some time to type in his search.
                throttledLayerFilterUpdate(filterState);
            } else {
                updateLayerFilters(filterState);
            }
            this._updateFilter();
        });

        this.filterHandler = uiHandler;
    }

    _getCurrentCollapseHandler () {
        return this.collapseHandlers[this.state.grouping.selected];
    }

    _updateFilter () {
        this.updateState({
            filter: {
                state: this.filterHandler.getState(),
                mutator: this.filterHandler.getMutator()
            }
        });
    }

    _updateCollapse () {
        const handler = this._getCurrentCollapseHandler();
        this.updateState({
            collapse: {
                state: handler.getState(),
                mutator: handler.getMutator()
            }
        });
    }

    loadLayers () {
        const mapLayerService = this.instance.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
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

    setGrouping (groupingKey) {
        const handler = this.collapseHandlers[groupingKey];
        if (!handler) {
            return;
        }
        const oldState = this.state.grouping;
        this.updateState({
            grouping: {
                ...oldState,
                selected: groupingKey
            }
        });
        setTimeout(() => {
            // Grouping changed, update collapse state with current selections
            const { activeFilterId, searchText } = this.state.filter.state;
            handler.setFilter(activeFilterId, searchText);
        }, HEAVY_UI_UPDATE_TIMEOUT);
    }
}

export const LayerListHandler = mutatorMixin(UIStateHandler, [
    'setGrouping'
]);
