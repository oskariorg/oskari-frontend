//import React from 'react';
import { StateHandler } from 'oskari-ui/util';
import { Helper } from './Helper';
// import { SidePanel } from './SidePanel';
//import { DrawingHelper } from './DrawingHelper';
import { confirmEdit } from './EditConfirmation';


export class ContentEditorPanelHandler extends StateHandler {

    constructor() {
        super();
        this.state = {
            currentLayer: null,
            feature: null
        };

        this.name = 'FeatureEditor';
        this.sandbox = Oskari.getSandbox();
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

    init(layerId) {
        Object.keys(this.eventHandlers).forEach(eventName => {
            this.getSandbox().registerForEventByName(this, eventName);
        });
        Helper.describeLayer(layerId).then(metadata => {
            this.getSandbox().postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [false, this.getName()]);
            this.setCurrentLayer(layerId, metadata.geometryType, metadata.types);
            return;
        }).catch(() => {
            // this.trigger('loading', false);
        });
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
        });
    }

    getFeature () {
        return this.getState().feature;
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
        //if (this._feature.)
        //confirmEdit(() => this._update());
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
