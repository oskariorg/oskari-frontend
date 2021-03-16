import { StateHandler, controllerMixin } from 'oskari-ui/util';

export const DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];
export const PROPERTY_NAMES = new Map([
    ['__fid', 'ID'],
    ['__centerX', 'X'],
    ['__centerY', 'Y']
]);

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.wfsPlugin = null;
        this.wfsLayerService = null;
        this.state = {
            isActive: false,
            layerId: null,
            features: [],
            selectedFeatures: {},
            hiddenProperties: {},
            inScale: true
        };
        this.eventHandlers = this._createEventHandlers();
        this.customStateListeners = []; // for jQuery optimization
    }

    getName () {
        return 'FeatureDataHandler';
    }

    addCustomStateListener (consumer) {
        this.customStateListeners.push(consumer);
    }

    // update state without notify() to optimize jQuery rendering
    updateStateSilently (props) {
        this.state = {
            ...this.state,
            ...props
        };
        const updated = Object.keys(props);
        // notify custom state listeners that state has changed but no need to render all components
        this.customStateListeners.forEach(consumer => consumer(this.getState(), updated));
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
            AfterMapLayerAddEvent: event => {}, // TODO init hidden fields??, store layerIds??
            WFSSetFilter: event => {

            },
            WFSFeaturesSelectedEvent: event => {
                if (!this.state.isActive) {
                    return;
                }
                const layerId = event.getMapLayer().getId();
                if (layerId === this.state.layerId) {
                    this._updateSelectedFeatureIds();
                }
            },
            WFSPropertiesEvent: event => {},
            WFSFeatureEvent: event => {

            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    _updateSelectedFeatureIds () {
        const { layerId } = this.state;
        const selectedFeatures = this._getWFSService().getSelectedFeatureIds(layerId);
        this.updateStateSilently({ selectedFeatures });
    }

    _updateFeatureProperties (event) {
        // update viewport properties only when flyout is active/open
        if (!this.state.isActive) {
            return;
        }
        let features = [];
        let inScale = false;
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(this.state.layerId);
        if (layer && layer.isInScale(event.getScale())) {
            features = this._getVisibleFeatures();
            inScale = true;
        }
        this.updateState({ features, inScale });
    }

    _getVisibleFeatures () {
        return this._getWFSPlugin().getLayerFeaturePropertiesInViewport(this.state.layerId);
    }

    setActiveLayer (layerId) {
        if (layerId === this.state.layerId) {
            return;
        }
        const features = this._getVisibleFeatures();
        this.updateState({ layerId, features });
    }

    setIsActive (isActive) {
        if (isActive === this.state.isActive) {
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
        this.updateState({ hiddenProperties }); //
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
