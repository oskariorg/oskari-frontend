import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class Service extends StateHandler {
    constructor () {
        super();
        this.layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
        this._throttleUpdateState = Oskari.util.throttle(this.updateState.bind(this), 1000, { leading: false });
        this.state = {
            activeFilterId: null
        };
        this.state.filters = this._initFilterButtons();
        this._initServiceListeners();
    }
    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerFilters.StateHandler';
    }
    _initServiceListeners () {
        this.layerlistService.on('Layerlist.Filter.Button.Add', ({ filterId, properties }) => {
            this.addFilterButton(filterId, properties);
        });
    }
    _initFilterButtons () {
        const buttons = this.layerlistService.getLayerlistFilterButtons();
        Object.values(buttons).forEach(button => this._setFilterStyle(button));
        return buttons;
    }
    _setFilterStyle (button, activeFilterId = this.state.activeFilterId) {
        const isActive = activeFilterId && activeFilterId === button.id;
        button.cls.current = isActive ? button.cls.active : button.cls.deactive;
    }

    setActiveFilterId (filterId) {
        let { activeFilterId, filters } = this.state;
        activeFilterId = activeFilterId === filterId ? null : filterId;
        Object.values(filters).forEach(button => this._setFilterStyle(button, activeFilterId));
        filters = { ...filters };
        this.updateState({
            activeFilterId,
            filters
        });
    }

    setSearchText (searchText) {
        this.updateState({ searchText });
    }

    addFilterButton (filterId, button) {
        this._setFilterStyle(button);
        const filters = {
            ...this.state.filters,
            [filterId]: button
        };
        this.updateState({ filters });
    }
}

export const FilterService = mutatorMixin(Service, [
    'setActiveFilterId',
    'setSearchText',
    'addFilterButton'
]);
