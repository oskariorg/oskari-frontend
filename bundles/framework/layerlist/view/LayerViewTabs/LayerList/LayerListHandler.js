import { StateHandler, Timeout, controllerMixin } from 'oskari-ui/util';
import { FilterHandler } from './Filter/';
import { LayerCollapseHandler } from './LayerCollapse/';
import { GroupingOption } from '../../../model/GroupingOption';
import { Scale } from '../../../model/Scale';
import { GROUPING_PRESET, TEXT_SEARCH_TYPING_TIMEOUT_SETTINGS } from './preset';

const UI_UPDATE_TIMEOUT = 100;
const HEAVY_UI_UPDATE_TIMEOUT = 600;

class ViewHandler extends StateHandler {
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

        this.toolingService = this._createToolingService();
        this.filterHandler = this._createFilterHandler();
        const initialGrouping = groupingOptions[0].getKey();
        this.collapseHandler = this._createLayerCollapseHandler(initialGrouping);

        this.state = {
            loading: false,
            updating: false,
            createTools: this._getCreateTools(),
            grouping: {
                selected: initialGrouping,
                options: groupingOptions
            },
            filter: {
                state: this.filterHandler.getState(),
                controller: this.filterHandler.getController()
            },
            collapse: {
                state: this.collapseHandler.getState(),
                controller: this.collapseHandler.getController()
            }
        };
    }

    _createToolingService () {
        const service = this.sandbox.getService('Oskari.mapframework.service.LayerListToolingService');
        service.on('add', ({ tool }) => {
            if (tool && tool.getTypes().includes(service.TYPE_CREATE)) {
                this.updateState({ createTools: this._getCreateTools() });
            }
        });
        return service;
    }

    _getCreateTools () {
        const createTools = Object.values(this.toolingService.getTools())
            .filter(tool => tool.getTypes().includes(this.toolingService.CREATE));
        return createTools;
    }

    _createLayerCollapseHandler (initialGrouping) {
        const handler = new LayerCollapseHandler(this.instance, initialGrouping);
        handler.addStateListener(collapseState => {
            this.updateState({
                collapse: {
                    state: collapseState,
                    controller: handler.getController()
                },
                updating: false
            });
        });
        return handler;
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
                    controller: this.state.filter.controller
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

            const textLength = searchText ? searchText.length : 0;
            // Search text changed, give user some time to type in his search.
            // The longer the search text the shorted delay.
            let typingTimeoutMs = this.typingTimeoutScale.getValue(textLength);
            typingTimeout = new Timeout(updateLayerFilters, typingTimeoutMs);

            this.updateState(immediateStateChange);
        });

        return handler;
    }

    getFilterHandler () {
        return this.filterHandler;
    }

    getCollapseHandler (grouping = this.state.grouping.selected) {
        this.collapseHandler.setGroupingType(grouping);
        return this.collapseHandler;
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

export const LayerListHandler = controllerMixin(ViewHandler, [
    'setGrouping'
]);
