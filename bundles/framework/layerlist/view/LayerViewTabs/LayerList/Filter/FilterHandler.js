import { StateHandler, controllerMixin } from 'oskari-ui/util';

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.layerlistService = this.sandbox.getService('Oskari.mapframework.service.LayerlistService');
        this.state = {
            activeFilterId: null,
            searchText: null,
            filters: Object.values(this.layerlistService.getLayerlistFilterButtons())
        };
        this.layerlistService.on('Layerlist.Filter.Button.Add',
            ({ properties }) => this.addFilter(properties));
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
