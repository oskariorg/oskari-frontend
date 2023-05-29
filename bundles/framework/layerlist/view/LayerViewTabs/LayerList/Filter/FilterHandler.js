import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { FILTER_ALL_LAYERS } from '..';

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.layerlistService = this.sandbox.getService('Oskari.mapframework.service.LayerlistService');
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');

        this.state = {
            activeFilterId: FILTER_ALL_LAYERS,
            searchText: '',
            filters: this.getFiltersProvidingResults(this.initFilters())
        };
        this.layerlistService.on('Layerlist.Filter.Button.Add',
            ({ properties }) => this.addFilter(properties));

        const throttledUpdate = Oskari.util.throttle(
            this.refreshActiveFilters.bind(this), 1000, { leading: false });
        this.eventHandlers = {
            'MapLayerEvent': event => {
                if (['add', 'remove'].includes(event.getOperation())) {
                    // heavy op -> throttle
                    throttledUpdate();
                }
            }
        };
        Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.registerForEventByName(this, p));
    }

    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerList.FilterHandler';
    }
    /**
    * @method onEvent
    * @param {Oskari.mapframework.event.Event} event a Oskari event object
    * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
    */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    initFilters () {
        // Add all layers selection to first
        const all = {
            text: Oskari.getMsg('LayerList', 'filter.all.title'),
            tooltip: Oskari.getMsg('LayerList', 'filter.all.tooltip'),
            id: FILTER_ALL_LAYERS
        };
        return [all, ...Object.values(this.layerlistService.getLayerlistFilterButtons())];
    }

    setActiveFilterId (activeFilterId) {
        this.updateState({ activeFilterId });
    }

    setSearchText (searchText) {
        this.updateState({ searchText: searchText });
    }

    getFiltersProvidingResults (filters) {
        const layerService = this.mapLayerService;
        return filters.filter(filter => filter.id === FILTER_ALL_LAYERS || layerService.filterHasLayers(filter.id));
    }

    refreshActiveFilters () {
        this.updateState({ filters: this.getFiltersProvidingResults(this.initFilters()) });
    }

    addFilter (filter) {
        this.updateState({ filters: this.getFiltersProvidingResults([...this.state.filters, filter]) });
    }
}

export const FilterHandler = controllerMixin(ViewHandler, [
    'setActiveFilterId',
    'setSearchText'
]);
