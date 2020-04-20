import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { FILTER_ALL_LAYERS } from '..';

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.layerlistService = this.sandbox.getService('Oskari.mapframework.service.LayerlistService');
        this.state = {
            activeFilterId: FILTER_ALL_LAYERS,
            searchText: null,
            filters: this.initFilters()
        };
        this.layerlistService.on('Layerlist.Filter.Button.Add',
            ({ properties }) => this.addFilter(properties));
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
        this.updateState({ searchText });
    }

    addFilter (filter) {
        this.updateState({ filters: [...this.state.filters, filter] });
    }
}

export const FilterHandler = controllerMixin(ViewHandler, [
    'setActiveFilterId',
    'setSearchText'
]);
