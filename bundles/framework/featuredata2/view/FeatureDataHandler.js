import { StateHandler, controllerMixin } from 'oskari-ui/util';

export const DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];
export const PROPERTY_NAMES = new Map([
    ['__fid', 'ID'],
    ['__centerX', 'X'],
    ['__centerY', 'Y']
]);

class ViewHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.wfsPlugin = null;
        this.wfsLayerService = null;
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
        return Oskari.getSandbox().findAllSelectedMapLayers().filter(l => l.hasFeatureData()).map(l => l.getId());
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
            AfterMapMoveEvent: event => this._updateFeatureProperties(event),
            AfterMapLayerAddEvent: event => {
                const layer = event.getMapLayer();
                if (!layer.hasFeatureData()) {
                    return;
                }
                this.updateState({ layerIds: [...this.getState().layerIds, layer.getId()] }, 'layerIds'); // jQuery optimization
            },
            AfterMapLayerRemoveEvent: event => {
                const layer = event.getMapLayer();
                if (!layer.hasFeatureData()) {
                    return;
                }
                const { layerIds, layerId } = this.getState();
                const removedId = layer.getId();
                this.updateState({
                    layerIds: layerIds.filter(id => id !== removedId),
                    layerId: layerId === removedId ? this._getFirstLayerId() : layerId
                }, 'layerIds'); // jQuery optimization
            },
            WFSSetFilter: event => {

            },
            WFSFeaturesSelectedEvent: event => {
                const layerId = event.getMapLayer().getId();
                if (layerId === this.getState().layerId) {
                    this._updateSelectedFeatureIds();
                }
            },
            WFSPropertiesEvent: event => {},
            WFSFeatureEvent: event => {

            }
        };
        const sb = Oskari.getSandbox();
        Object.getOwnPropertyNames(handlers).forEach(p => sb.registerForEventByName(this, p));
        return handlers;
    }

    _updateSelectedFeatureIds () {
        const { layerId } = this.getState();
        const selectedFeatures = this._getWFSService().getSelectedFeatureIds(layerId);
        this.updateState({ selectedFeatures }, 'selectedFeatures');
    }

    _updateFeatureProperties (event) {
        // update viewport properties only when flyout is active/open
        const { isActive, layerId } = this.getState();
        if (!isActive) {
            return;
        }
        let features = [];
        let inScale = false;
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        if (layer && layer.isInScale(event.getScale())) {
            features = this._getVisibleFeatures();
            inScale = true;
        }
        this.updateState({ features, inScale });
    }

    _getVisibleFeatures (layerId = this.getState().layerId) {
        return this._getWFSPlugin().getLayerFeaturePropertiesInViewport(layerId);
    }

    setActiveLayer (layerId) {
        if (layerId === this.getState().layerId) {
            return;
        }
        const features = this._getVisibleFeatures(layerId);
        this.updateState({ layerId, features });
    }

    setIsActive (isActive) {
        if (isActive === this.getState().isActive) {
            return;
        }
        const features = isActive ? this._getVisibleFeatures() : [];
        this.updateState({ isActive, features });
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

    _getWFSPlugin () {
        if (!this.wfsPlugin) {
            this.wfsPlugin = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule').getLayerPlugins('wfs');
        }
        return this.wfsPlugin;
    }

    _getWFSService () {
        if (!this.wfsLayerService) {
            this.wfsLayerService = Oskari.getSandbox().getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        }
        return this.wfsLayerService;
    }
}

export const FeatureDataHandler = controllerMixin(ViewHandler, [
    'setIsActive',
    'setActiveLayer',
    'setHiddenProperty'
]);
