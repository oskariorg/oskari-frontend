import React from 'react';
import { LocaleProvider, Messaging } from 'oskari-ui/util';
import { getReactRoot } from 'oskari-ui/components/window';
import { Helper } from './Helper';
import { SidePanel } from './SidePanel';
import { DrawingHelper } from './DrawingHelper';
import { confirmEdit } from './EditConfirmation';

/**
 * @class Oskari.bundles.framework.myfeatures-content-editor.view.SideContentEditor
 */
Oskari.clazz.define('Oskari.bundles.framework.myfeatures-content-editor.view.SideContentEditor',
    function (sandbox, layerId, onExit) {
        this.sandbox = sandbox;
        this.onExit = onExit;
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');

        this.loc = Oskari.getMsg.bind(null, 'ContentEditor');
        Oskari.makeObservable(this);
        this.loading = false;
        this.on('loading', (newValue) => {
            this.loading = newValue;
            this._update();
        });
        this.on('update', () => this._update());
        this._setCurrentLayer(layerId);

    }, {
        __name: 'ContentEditor',
        /**
         * @method @public getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        getCurrentLayer: function () {
            return this._currentLayer;
        },
        /**
         *
         * Strips 'myf_' - prefix from myfeatures layer id
         *
         **/
        getCurrentLayerUUID: function() {
            const id = this.getCurrentLayer().id;
            return id.substring(4, id.length);
        },
        editFeature: function (geojson, confirmed) {
            //if (this._feature.)
            //confirmEdit(() => this._update());
            if (typeof geojson === 'undefined') {
                // reset feature we were editing
                this._feature = undefined;
                this._update();
                return;
            }

            if (!confirmed && this._feature && this._feature.id !== geojson.id) {
                confirmEdit(this.loc, () => this.editFeature(geojson, true));
            } else {
                // remove _oid (internal normalized id by Oskari) from properties
                const {_oid, ...rest} = geojson.properties
                const feature = {
                    ...geojson,
                    properties: {
                        ...rest
                    }
                };
                this._feature = feature;
                this._update();
            }
        },
        getCurrentFeature: function () {
            return this._feature;
        },
        getElement: function () {
            return this._el;
        },
        /**
         * Renders view to given DOM element
         * @method @public render
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            this._el = container;
            this._update();
        },
        _update: function () {
            const el = this.getElement();
            const root = getReactRoot(el);
            if (!el || !root)  {
                return;
            }
            root.render(
                <LocaleProvider value={{ bundleKey: 'ContentEditor' }}>
                    <SidePanel
                        loading={this.loading}
                        layer={this.getCurrentLayer()}
                        feature={this.getCurrentFeature()}
                        onSave={(feature) => this._saveFeature(feature)}
                        onDelete={(featureId) => this._deleteFeature(featureId)}
                        onClose={this.onExit}
                        onCancel={() => this._stopEditing()}
                        startNewFeature={() => this._startNewFeature()}
                    />
                </LocaleProvider>);
        },
        _setCurrentLayer: function (layerId) {
            const mapLayer = this.mapLayerService.findMapLayer(layerId);
            this._currentLayer = {
                id: layerId,
                name: mapLayer.getName(Oskari.getDefaultLanguage())
            };
            // Oskari.getSandbox().postRequestByName('ContentEditor.ShowContentEditorRequest', [2662])
            this.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
            this._hideOtherVectorLayers(layerId);
            this.trigger('loading', true);
            Helper.describeLayer(layerId).then(metadata => {
                this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [false, this.getName()]);
                this._currentLayer.geometryType = metadata.geometryType;
                this._currentLayer.fieldTypes = metadata.types;
                this.trigger('loading', false);
                return;
            }).catch(() => {
                // error is shown on side panel if we didn't get
                //  the geometryType for layer so we don't need to handle it here
                this.trigger('loading', false);
            });
        },
        _stopEditing: function () {
            this.editFeature(undefined);
        },
        _startNewFeature: function () {
            this.editFeature({
                type: 'Feature',
                properties: {}
            });
        },

        _saveFeature: function (feature) {
            // this is stoopid. fid should probably be a part of the feature. Or a modifiable prop?
            const fid = feature?.properties?.fid || null;
            delete feature.properties.fid;
            const newMyFeature = {
                layerId: this.getCurrentLayerUUID(),
                fid: fid,
                id: feature.id,
                geometry: feature.geometry,
                properties: feature.properties
            };
            const isNew = typeof feature.id === 'undefined';
            const url = Oskari.urls.getRoute('MyFeaturesFeature', {
                layerId: this.getCurrentLayer().id,
                crs: this.sandbox.getMap().getSrsName()
            });
            fetch(url, {
                method: isNew ? 'POST': 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMyFeature)
            }).then(response => {
                if (!response.ok) {
                    return Promise.reject(Error('Save failed'));
                }
                return response.json();
            }).then(() => {
                this._stopEditing();
                setTimeout(() => {
                    this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [this.getCurrentLayer().id, true]);
                    Messaging.success(this.loc('ContentEditorView.featureUpdate.success'));
                }, 500);
                return;
            }).catch(() => Messaging.error(this.loc('ContentEditorView.featureUpdate.error')));
        },

        _deleteFeature: function (featureId) {
            const url = Oskari.urls.getRoute('VectorFeatureWriter', {
                layerId: this.getCurrentLayer().id,
                featureId,
                crs: this.sandbox.getMap().getSrsName()
            });
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    return Promise.reject(Error('Delete failed'));
                }
                return response.json();
            }).then(() => {
                this._stopEditing();
                setTimeout(() => {
                    this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [this.getCurrentLayer().id, true]);
                    Messaging.success(this.loc('ContentEditorView.featureDelete.success'));
                }, 500);
            }).catch(() => Messaging.error(this.loc('ContentEditorView.featureDelete.error')));
        },

        /**
         * Destroys/removes this view from the screen.
         * @method @public destroy
         */
        destroy: function () {
            DrawingHelper.stopDrawing();
            // Restore layers hidden when the editor was started
            this._tempHiddenLayers.forEach((layer) => this._changeLayerVisibility(layer.getId(), true));
            this._tempHiddenLayers = null;

            this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true, this.getName()]);
            this.getElement().remove();
        },

        /**
         * Temporarily hides layers from map that the user isn't editing
         * @method _hideOtherVectorLayers
         * @private
         */
         _hideOtherVectorLayers: function (currentLayerId) {
            const visibleSelectedLayers = this.sandbox.findAllSelectedMapLayers().filter(layer => layer.isVisible());
            const layersToHide = visibleSelectedLayers
                .filter(layer => layer.getId() !== currentLayerId)
                .filter(layer => layer.isLayerOfType('WFS'));
            // hide other WFS layers that are visible on the map
            layersToHide.forEach(layer => this._changeLayerVisibility(layer.getId(), false));
            this._tempHiddenLayers = layersToHide;
        },

        _changeLayerVisibility: function (layerId, isVisible) {
            this.sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layerId, isVisible]);
        }
    });
