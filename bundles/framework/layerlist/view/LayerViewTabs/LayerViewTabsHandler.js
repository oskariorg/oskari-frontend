import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { LayerListHandler } from './LayerList';
import { SelectedLayersHandler } from './SelectedLayers';

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.layerListHandler = this._createLayerListHandler();
        this.selectedLayersHandler = this._createSelectedLayersHandler();
        this.state = {
            layerList: {
                state: this.layerListHandler.getState(),
                controller: this.layerListHandler.getController()
            },
            selectedLayers: {
                state: this.selectedLayersHandler.getState(),
                controller: this.selectedLayersHandler.getController()
            },
            autoFocusSearch: true
        };
        this.eventHandlers = this._createEventHandlers();
    }

    _createLayerListHandler () {
        const handler = new LayerListHandler(this.instance);
        handler.addStateListener(layerListState => this.updateState({
            autoFocusSearch: false,
            layerList: {
                state: layerListState,
                controller: this.state.layerList.controller
            }
        }));
        return handler;
    }

    _createSelectedLayersHandler () {
        const handler = new SelectedLayersHandler(this.instance);
        handler.addStateListener(selectedLayersState => {
            this.updateState({
                selectedLayers: {
                    state: selectedLayersState,
                    controller: this.state.selectedLayers.controller
                }
            });
        });
        return handler;
    }
    getLayerListHandler () {
        return this.layerListHandler;
    }

    setTab (tab) {
        this.updateState({
            autoFocusSearch: true,
            tab
        });
    }

    /// Oskari event handling ////////////////////////////////////////////////////////////

    /**
     * "Module" name for event handling
     */
    getName () {
        return 'LayerViewTabsHandler';
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
        const updateSelectedLayers = () => this.selectedLayersHandler.updateLayers();
        const handlers = {
            'userinterface.ExtensionUpdatedEvent': event => {
                // ExtensionUpdateEvents are fired a lot, only let layerlist extension event to be handled when enabled
                if (event.getExtension().getName() !== this.instance.getName()) {
                    // wasn't me -> do nothing
                    return;
                }
                if (event.getViewState() === 'attach') {
                    this.updateState({ autoFocusSearch: true });
                    return;
                }
                if (event.getViewState() === 'close') {
                    const filterHandler = this.getLayerListHandler().getFilterHandler();
                    if (filterHandler.hasStashedState()) {
                        filterHandler.useStashedState();
                    }
                }
            },
            'MapLayerEvent': event => {
                const layerId = event.getLayerId();
                if (['add', 'remove'].includes(event.getOperation()) && layerId) {
                    // refresh layer list on add/remove when layerId is provided
                    this.getLayerListHandler().updateState({});
                    return;
                }
                if (!['update', 'sticky', 'tool'].includes(event.getOperation())) {
                    return;
                }
                if (layerId) {
                    const { layers } = this.selectedLayersHandler.getState();
                    if (!layers.find(layer => layer.getId() === layerId)) {
                        return;
                    }
                }
                updateSelectedLayers();
            },
            'MapLayerVisibilityChangedEvent': event => this.selectedLayersHandler.updateVisibilityInfo(event),
            'AfterMapLayerRemoveEvent': updateSelectedLayers,
            'AfterMapLayerAddEvent': updateSelectedLayers,
            'AfterRearrangeSelectedMapLayerEvent': updateSelectedLayers,
            'AfterChangeMapLayerStyleEvent': updateSelectedLayers,
            'AfterChangeMapLayerOpacityEvent': updateSelectedLayers
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }
}

export const LayerViewTabsHandler = controllerMixin(ViewHandler, [
    'setTab'
]);
