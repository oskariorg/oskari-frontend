import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class UIService extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.layerlistService = this.sandbox.getService('Oskari.mapframework.service.LayerlistService');
        this._throttleUpdateState = Oskari.util.throttle(this.updateState.bind(this), 1000, { leading: false });
        this.state = {
            activeFilterId: null
        };
        this.state.filters = this._initFilterButtons();
        this._initServiceListeners();
        this.eventHandlers = this._createEventHandlers();
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

    /// Oskari event handling ////////////////////////////////////////////////////////////

    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerFilters.FilterService';
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

    _createEventHandlers () {
        const handlers = {
            'userinterface.ExtensionUpdatedEvent': event => {
                // ExtensionUpdateEvents are fired a lot, only let layerlist extension event to be handled when enabled
                if (event.getExtension().getName() !== this.instance.getName()) {
                    // wasn't me -> do nothing
                    return;
                }
                if (event.getViewState() === 'close' && this.instance.filteredLayerListOpenedByRequest) {
                    this.filteredLayerListOpenedByRequest = false;
                    this.updateState({ activeFilterId: null });
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }
}

export const FilterService = mutatorMixin(UIService, [
    'setActiveFilterId',
    'setSearchText',
    'addFilterButton'
]);
