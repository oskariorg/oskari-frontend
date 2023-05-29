import { StateHandler, controllerMixin } from 'oskari-ui/util';

export const ID_FIELD = '__fid';
export const DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];
export const DEFAULT_PROPERTY_LABELS = new Map([
    ['__fid', 'ID'],
    ['__centerX', 'X'],
    ['__centerY', 'Y']
]);

class ViewHandler extends StateHandler {
    constructor (selectionService, consumer) {
        super();
        this._mapmodule = null;
        this.selectionService = selectionService;
        this.setState({
            isActive: false,
            layerId: this._getFirstLayerId(),
            features: [],
            inScale: true,
            layerIds: this._getSelectedLayerIds(),
            selectedFeatures: [],
            hiddenProperties: {}
        });
        this.eventHandlers = this._createEventHandlers();
        this.addStateListener(consumer);
    }

    getName () {
        return 'FeatureDataHandler';
    }

    _getFirstLayerId () {
        const layersIds = this._getSelectedLayerIds();
        return layersIds.length ? layersIds[0] : null;
    }

    _getSelectedLayerIds () {
        return Oskari.getSandbox().findAllSelectedMapLayers()
            .filter(l => l.hasFeatureData() && l.isVisible())
            .map(l => l.getId());
    }

    // override updateState for jQuery optimization
    updateState (props, updated) {
        this.state = {
            ...this.state,
            ...props
        };
        this.stateListeners.forEach(consumer => consumer(this.getState(), updated));
    }

    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    _createEventHandlers () {
        const handlers = {
            AfterMapMoveEvent: () => this._afterMapMove(),
            AfterMapLayerAddEvent: event => {
                this._addLayer(event.getMapLayer());
            },
            AfterMapLayerRemoveEvent: event => {
                this._removeLayer(event.getMapLayer());
            },
            WFSFeaturesSelectedEvent: event => {
                const layerId = event.getMapLayer().getId();
                if (layerId === this.getState().layerId) {
                    const selectedFeatures = event.getWfsFeatureIds();
                    this.updateState({ selectedFeatures }, 'selectedFeatures');
                }
            },
            MapLayerVisibilityChangedEvent: event => {
                const layer = event.getMapLayer();
                if (layer.isVisible()) {
                    this._addLayer(layer);
                } else {
                    this._removeLayer(layer);
                }
            },
            MapLayerEvent: event => {
                if (event.getOperation() !== 'update') {
                    return;
                }
                const id = event.getLayerId();
                if (this.state.layerIds.includes(id)) {
                    // notify to render
                    this.updateState({}, 'layerUpdate');
                }
            }
        };
        const sb = Oskari.getSandbox();
        Object.getOwnPropertyNames(handlers).forEach(p => sb.registerForEventByName(this, p));
        return handlers;
    }

    _addLayer (layer) {
        if (!layer.hasFeatureData() || !layer.isVisible()) {
            return;
        }
        const addedId = layer.getId();
        const { layerIds, layerId } = this.getState();
        if (layerIds.includes(addedId)) {
            return;
        }
        this.updateState({ layerIds: [...layerIds, addedId] }, 'layerIds'); // jQuery optimization
        if (!layerId) {
            this.setActiveLayer(addedId);
        }
    }

    _removeLayer (layer) {
        if (!layer.hasFeatureData()) {
            return;
        }
        const { layerIds, layerId } = this.getState();
        const removedId = layer.getId();
        if (!layerIds.includes(removedId)) {
            return;
        }
        this.updateState({ layerIds: layerIds.filter(id => id !== removedId) }, 'layerIds'); // jQuery optimization
        if (layerId === removedId) {
            this.setActiveLayer(this._getFirstLayerId());
        }
    }

    _afterMapMove () {
        // update viewport properties only when flyout is active/open
        if (!this.getState().isActive) {
            return;
        }
        this.updateState(this.getLayerState());
    }

    setActiveLayer (layerId) {
        if (layerId === this.getState().layerId) {
            return;
        }
        const selectedFeatures = this._getSelectedFeatureIds(layerId);
        const layerState = this.getLayerState(layerId);
        this.updateState({ layerId, selectedFeatures, ...layerState });
    }

    setIsActive (isActive) {
        if (isActive === this.getState().isActive) {
            return;
        }
        const layerState = isActive ? this.getLayerState() : {};
        this.updateState({ isActive, ...layerState });
    }

    getLayerState (layerId = this.getState().layerId) {
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        const features = this._getCurrentFeatureProperties(layerId);
        const inScale = !!layer && layer.isInScale();
        return {
            inScale,
            features
        };
    }

    setHiddenProperty (property) {
        let hiddenProperties = [...this.state.hiddenProperties];
        if (hiddenProperties.contains(property)) {
            hiddenProperties = hiddenProperties.filter(p => p !== property);
        } else {
            hiddenProperties.push(property);
        }
        this.updateState({ hiddenProperties });
    }

    _getCurrentFeatureProperties (layerId) {
        if (!this._mapmodule) {
            this._mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        }
        if (!this._mapmodule || typeof this._mapmodule.getVectorFeatures !== 'function') {
            return [];
        }
        const result = this._mapmodule.getVectorFeatures(null, { layers: [layerId] });
        if (!result[layerId] || !result[layerId].features) {
            return [];
        }

        return result[layerId].features.map(feature => feature.properties);
    }

    _getSelectedFeatureIds (layerId) {
        if (!this.selectionService) {
            return [];
        }
        return this.selectionService.getSelectedFeatureIdsByLayer(layerId);
    }
}

export const FeatureDataHandler = controllerMixin(ViewHandler, [
    'setIsActive',
    'setActiveLayer',
    'setHiddenProperty'
]);
