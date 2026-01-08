import { StateHandler } from 'oskari-ui/util';
import { Helper } from './Helper';
import { DrawingHelper } from './DrawingHelper';
import { confirmEdit } from './EditConfirmation';


export class FeatureEditorPanelHandler extends StateHandler {

    constructor() {
        super();
        this.state = {
            currentLayer: null,
            feature: null,
            loading: false
        };

        this.name = 'FeatureEditor';
        this.sandbox = Oskari.getSandbox();
        this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this.mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.eventHandlers = {
            FeatureEvent: function (event) {
                if (event.getOperation() !== 'click') {
                    return;
                }
                const currentLayerId = this.getCurrentLayer().id;
                const editLayerFeatures = event.getFeatures().filter(f => f.layerId === currentLayerId);
                if (!editLayerFeatures.length) {
                    // no features hit on layer that we are currently editing
                    return;
                }
                // found one -> edit it
                this.editFeature(editLayerFeatures[0].geojson.features[0]);
            }
        };

    }

    getSandbox () {
        return this.sandbox;
    }

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    init(layerId, featureId) {
        if (!layerId) {
            return;
        }
        Object.keys(this.eventHandlers).forEach(eventName => {
            this.getSandbox().registerForEventByName(this, eventName);
        });
        Helper.describeLayer(layerId).then(metadata => {
            this.getSandbox().postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [false, this.getName()]);
            this.setCurrentLayer(layerId, metadata.geometryType, metadata.types);
            if (featureId) {
                const featuresMap = this.mapModule.getVectorFeatures(null, { layers: [layerId] });
                const features = featuresMap[layerId] ? featuresMap[layerId].features : null;
                const feature = features?.filter((feature) => feature.id === featureId)?.[0] ?? null;
                this.setFeature(feature)
            }
            return;
        }).catch(() => {
            this.setLoading(false);
        });
    }

    /**
     * Destroys/removes this view from the screen.
     * @method @public destroy
     */
    destroy () {
        Object.keys(this.eventHandlers).forEach(eventName => {
            this.getSandbox().unregisterFromEventByName(this, eventName);
        });

        this.stateListeners = [];
        this.updateState({
            currentLayer: null,
            feature: null
        });
        DrawingHelper.stopDrawing();
        // Restore layers hidden when the editor was started
        this._tempHiddenLayers.forEach((layer) => this.changeLayerVisibility(layer.getId(), true));
        this._tempHiddenLayers = null;

        this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true, this.getName()]);
    }

    /**
     * @method @public getName
     * @return {String} the name for the component
     */
    getName () {
        return this.name;
    }

    getCurrentLayer () {
        return this.getState().currentLayer;
    }

    setCurrentLayer (layerId, geometryType, types) {
        const mapLayer = this.mapLayerService.findMapLayer(layerId);
        this.getSandbox().postRequestByName('AddMapLayerRequest', [layerId]);
        this.hideOtherVectorLayers(layerId);
        const newState = {
            id: layerId,
            geometryType: geometryType,
            fieldTypes: types,
            name: mapLayer.getName(Oskari.getDefaultLanguage())
        };

        this.updateState({
            currentLayer: newState
        },);
    }

    setFeature(feature) {
        this.updateState({
            feature
        });
    }

    getFeature () {
        return this.getState().feature;
    }

    setLoading(loading) {
        this.updateState({ loading });
    }

    getLoading() {
        return this.getState().loading;
    }
    /**
     * Temporarily hides layers from map that the user isn't editing
     * @method hideOtherVectorLayers
     */
    hideOtherVectorLayers (layerId) {
        const visibleSelectedLayers = this.getSandbox().findAllSelectedMapLayers().filter(layer => layer.isVisible());
        const layersToHide = visibleSelectedLayers
            .filter(layer => layer.getId() !== layerId)
            .filter(layer => layer.isLayerOfType('WFS'));
        // hide other WFS layers that are visible on the map
        layersToHide.forEach(layer => this.changeLayerVisibility(layer.getId(), false));
        this._tempHiddenLayers = layersToHide;
    }

    changeLayerVisibility (layerId, isVisible) {
        this.getSandbox().postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layerId, isVisible]);
    }

    startNewFeature () {
        this.editFeature({
            type: 'Feature',
            properties: {}
        });
    }

    editFeature (geojson, confirmed) {
        if (typeof geojson === 'undefined') {
            // reset feature we were editing
            this.updateState({
                feature: null
            });
            return;
        }

        if (!confirmed && this.getFeature() && this.getFeature().id !== geojson.id) {
            confirmEdit(this.loc, () => this.editFeature(geojson, true));
        } else {
            // remove _oid (internal normalized id by Oskari) from properties
            delete geojson.properties?.oid;
            const { ...rest } = geojson.properties;
            const feature = {
                ...geojson,
                properties: {
                    ...rest
                }
            };
            this.updateState({
                feature
            });
        }
    }
}
