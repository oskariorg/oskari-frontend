import { StateHandler, mutatorMixin } from 'oskari-ui/util';

class UIService extends StateHandler {
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

        this.eventHandlers = this._createEventHandlers();
    }

    setActiveFilterId (filterId) {
        const { activeFilterId: previous } = this.state;
        const activeFilterId = previous === filterId ? null : filterId;
        this.updateState({ activeFilterId });
    }

    setSearchText (searchText) {
        this.updateState({ searchText });
    }

    addFilter (filter) {
        this.updateState({ filters: [...this.state.filters, filter] });
    }

    /// Oskari event handling ////////////////////////////////////////////////////////////

    /**
     * "Module" name for event handling
     */
    getName () {
        return 'FilterHandler';
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

export const FilterHandler = mutatorMixin(UIService, [
    'setActiveFilterId',
    'setSearchText'
]);
