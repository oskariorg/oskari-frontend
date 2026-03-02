import { Messaging, StateHandler, controllerMixin } from 'oskari-ui/util';
import { showLayerForm } from '../view/LayerForm';
import { BUNDLE_KEY, MAX_SIZE, ERRORS, MY_FEATURES_LAYER_TYPE } from '../constants';
import { showFeatureEditorFlyout } from '../view/FeatureEditorFlyout/FeatureEditorFlyout';

class MyFeaturesHandler extends StateHandler {
    constructor (instance, myFeaturesLayerService) {
        super();
        this.instance = instance;
        this.myFeaturesLayerService = myFeaturesLayerService;
        this.sandbox = instance.getSandbox();
        this.setState({
            data: [],
            loading: false,
            selectedLayerId: null,
            selectedFeatureId: null,
            savedFeature: null
        });
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, BUNDLE_KEY);
        this.eventHandlers = this.createEventHandlers();

        this.refreshLayersList();
        this.addStateListener(() => {
            if (this.featureEditorControls) {
                const { selectedLayerId, savedFeature, data } = this.getState();
                this.featureEditorControls.update(selectedLayerId, null, data, this, savedFeature);
            }
        });
    };

    getSandbox() {
        return this.sandbox;
    }

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyFeaturesHandler';
    }

    showLayerDialog (values) {
        const { id, isNew } = values;
        const isImport = !id && !isNew;
        if (this.popupControls) {
            // already opened
            if (this.popupControls.id === id) {
                this.popupControls.bringToTop();
                return;
            }
            // remove previous popup
            this.popupCleanup();
        }
        const conf = {
            maxSize: this.getMaxSize(),
            unzippedMaxSize: this.getMaxSize() * 15,
            isImport
        };
        const getOkCallback = () => {
            if (isNew) {
                return (values) => this.createLayer(values);
            };
            if (isImport) {
                return (values) => this.importFile(values);
            }
            return (values) => this.updateLayer(id, values);
        };

        const addNewFeature = () => { this.popupCleanup(); this.showFeatureEditorDialog(id); };
        this.popupControls = showLayerForm(values, conf, getOkCallback(), () => this.popupCleanup(), addNewFeature);
    }


    setFeatureEditorLayer(layerId) {
        this.updateState({
            selectedLayerId: layerId
        });
    }

    /**
     * Opens the flyout to edit the features of the given layer
     * @param {String} layerId layer id
     * @param { int } featureId feature technical id
     */
    showFeatureEditorDialog (layerId, featureId) {
        this.updateState({
            selectedLayerId: layerId,
            selectedFeatureId: featureId
        });

        if (this.featureEditorControls) {
            this.closeFeatureEditorFlyout();
        }

        this.featureEditorControls = showFeatureEditorFlyout(layerId, featureId, this?.state?.data, this, null);
    }

    closeFeatureEditorFlyout () {
        if (this.featureEditorControls) {
            this.featureEditorControls.close();
        }
        this.featureEditorControls = null;
        this.updateState({
            selectedLayerId: null,
            selectedFeatureId: null,
            savedFeature: null
        });
    }

    getMaxSize () {
        const confMax = this.instance.conf?.maxFileSizeMb;
        return isNaN(confMax) ? MAX_SIZE : parseInt(confMax);
    }

    addLayerToMap (id) {
        const addMLrequestBuilder = Oskari.requestBuilder('AddMapLayerRequest');
        const addMlRequest = addMLrequestBuilder(id, {
            zoomContent: true
        });
        this.sandbox.request(this.instance, addMlRequest);
    }

    refreshLayersList () {
        this.updateState({
            loading: true
        });
        const layers = this.instance.getMapLayerService()
            .getAllLayers().filter(layer => layer.isLayerOfType(MY_FEATURES_LAYER_TYPE));
        this.updateState({
            data: layers,
            loading: false
        });
    }

    async importFile (values) {
        const { sourceSrs, locale, style, file } = values;
        this.updateState({
            loading: true
        });
        try {
            const result = await this.myFeaturesLayerService.importFile(file, locale, style, sourceSrs);
            this.addLayerToMap(result.id);

            Messaging.success({
                content: this.loc('flyout.success', { count: result?.featureCount }),
                duration: 10
            });
            this.popupCleanup();
            const featuresSkipped = result?.warning?.featuresSkipped;
            if (!featuresSkipped) {
                return;
            }
            Messaging.warn({
                content: this.loc('flyout.warning.features_skipped', { count: featuresSkipped }),
                duration: 10
            });
        } catch (err) {
            Oskari.log('MyFeatures').info(err?.oskariInfo);
            const info = err?.oskariInfo?.info;
            const { error, extensions = [], cause, parser } = info || {};
            let errorKey = error || ERRORS.GENERIC;
            // Parser error has cause which is used for localized message
            if (error === ERRORS.PARSER) {
                if (cause === ERRORS.NO_SRS) {
                    errorKey = parser === 'shp' ? 'shpNoSrs' : 'noSrs';
                } else if (cause === ERRORS.FORMAT) {
                    errorKey = cause;
                }
            }
            // pass args for localization even them aren't needed for requested errorKey
            const args = {
                maxSize: this.getMaxSize(),
                extensions: extensions.join(',')
            };
            // Only unknown srs is handled differently, use cause for callback
            Messaging.error({
                content: this.loc(`flyout.error.${errorKey}`, args),
                duration: 10
            });
            if (this.popupControls) {
                this.popupControls.update(cause || ERRORS.GENERIC, values);
            }

        } finally {
            this.updateState({
                loading: false
            });
        }
    }

    exportLayer (layerId) {
        window.location.href = this.myFeaturesLayerService.exportLayer(layerId);
    }

    async editLayer (id) {
        this.updateState({
            loading: true
        });
        try {
            const layerJson = await this.myFeaturesLayerService.getLayerForEdit(id);
            const attributes = layerJson?.attributes || {};
            if (!attributes?.data) {
                attributes.data = {};
            }
            const values = {
                id,
                locale: {
                    ...layerJson.locale
                },
                style: {
                    ...layerJson?.options?.styles?.default?.featureStyle
                },
                layerFields: layerJson?.layerFields,
                attributes: attributes
            };
            this.showLayerDialog(values);
        } catch (err) {
            Messaging.error({
                content: this.loc(`flyout.error.${ERRORS.GENERIC}`),
                duration: 10
            });
        } finally {
            this.updateState({
                loading: false
            });
        }
    }

    async updateLayer (id, values) {
        this.updateState({
            loading: true
        });

        try {
            await this.myFeaturesLayerService.updateLayer(id, values);
            Messaging.success({
                content: this.loc('tab.notification.editedMsg'),
                duration: 10
            });
            this.popupCleanup();
        } catch (err) {
            Messaging.error({
                content: this.loc('tab.error.editMsg'),
                duration: 10
            });
            if (this.popupControls) {
                this.popupControls.update(err || ERRORS.GENERIC, values);
            }

        } finally {
            this.updateState({
                loading: false
            });
        }
    }

    async createLayer(values) {
        this.updateState({
            loading: true
        });

        try {
            await this.myFeaturesLayerService.createLayer(values);
            Messaging.success({
                content: this.loc('tab.notification.createdMsg'),
                duration: 10
            });
            this.popupCleanup();
        } catch (err) {
            Messaging.error({
                content: this.loc('tab.error.createMsg'),
                duration: 10
            });
            if (this.popupControls) {
                this.popupControls.update(err || ERRORS.GENERIC, values);
            }

        } finally {
            this.updateState({
                loading: false
            });
        }

    }

    async deleteLayer (id) {
        this.updateState({
            loading: true
        });
        try {
            const success = await this.myFeaturesLayerService.deleteLayer(id);
            if (success) {
                Messaging.success({
                    content: this.loc('tab.notification.deletedMsg'),
                    duration: 10
                });
            }
        } catch (err) {
            Oskari.log('MyFeatures').error(err);
            Messaging.error({
                content: this.loc('tab.error.deleteMsg'),
                duration: 10
            });
        } finally {
            this.updateState({
                loading: false
            });
        }
    }

    async saveFeature(layer, feature) {
        const layerId = layer?.id || null;
        const newMyFeature = {
            layerId: layerId,
            id: feature.id,
            geometry: feature.geometry,
            properties: this.cleanProperties(layer?.fieldTypes, feature)
        };
        const isNew = typeof feature.id === 'undefined';
        const url = Oskari.urls.getRoute('MyFeaturesFeature', {
            layerId: layerId,
            crs: this.getSandbox().getMap().getSrsName()
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
        }).then((savedFeature) => {
            this.updateState({
                savedFeature: savedFeature
            });
            // we need to provide the full feature instead of feature id because we don't really have a convenient way of
            // knowing our maplayerupdaterequest was succesful and the feature can now be found on the layer.
            // Elsewhere we always use featureId
            //this.featureEditorControls.update(layerId, null, this, savedFeature);
            setTimeout(() => {
                this.getSandbox().postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [layerId, true]);
                Messaging.success(this.loc('featureEditor.featureUpdate.success'));
            }, 500);
            return;
        }).catch(() => Messaging.error(this.loc('featureEditor.featureUpdate.error')));
    }

    async deleteFeature(layerId, featureId) {
        const url = Oskari.urls.getRoute('MyFeaturesFeature', {
            layerId: layerId,
            id: featureId
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

            // TODO: should deletefeature maybe return something useful?
            return;
        }).then(() => {
            this.closeFeatureEditorFlyout();
            setTimeout(() => {
                this.getSandbox().postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [layerId, true]);
                Messaging.success(this.loc('featureEditor.featureDelete.success'));
            }, 500);
            return;
        }).catch((exception) => Messaging.error(this.loc('featureEditor.featureDelete.error') + exception));
    }

    cleanProperties(fieldTypes, feature) {
        // clean up excess properties not defined in layers fieldtypes
        // might include stuff added by openlayers (__fid) or additional attributes obtained from server
        if (!fieldTypes || !Object.keys(fieldTypes).length) {
            return feature?.properties || {};
        }

        const propsToSave = Object.fromEntries(
            Object.keys(fieldTypes)
                .filter(key => key in feature.properties)
                .map(key => [key, feature?.properties[key]])
        );

        return propsToSave;
    }

    createEventHandlers () {
        const handlers = {
            MapLayerEvent: (event) => {
                const operation = event.getOperation();
                if (operation === 'add' || operation === 'update' || operation === 'remove') {
                    this.refreshLayersList();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        const handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(MyFeaturesHandler, [
    'editLayer',
    'deleteLayer',
    'exportLayer',
    'addLayerToMap',
    'showLayerDialog',
    'showFeatureEditorDialog',
    'closeFeatureEditorFlyout',
    'setFeatureEditorLayer'
]);

export { wrapped as MyFeaturesHandler };
