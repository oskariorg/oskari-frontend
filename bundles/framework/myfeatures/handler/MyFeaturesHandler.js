import { Messaging, StateHandler, controllerMixin } from 'oskari-ui/util';
import { showLayerForm } from '../view/LayerForm';
import { BUNDLE_KEY, MAX_SIZE, ERRORS, LAYER_TYPE } from '../constants';

class MyFeaturesHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            data: [],
            loading: false
        });
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, BUNDLE_KEY);
        this.eventHandlers = this.createEventHandlers();
        this.refreshLayersList();
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyFeaturesHandler';
    }

    showLayerDialog (values) {
        const { id } = values;
        const isImport = !id;
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
        const save = values => this.importFile(values);
        const update = values => this.updateLayer(id, values);
        const onOk = isImport ? save : update;
        this.popupControls = showLayerForm(values, conf, onOk, () => this.popupCleanup());
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
            .getAllLayers().filter(layer => layer.isLayerOfType(LAYER_TYPE));
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
            const result = await this.instance.getService().importFile(file, locale, style, sourceSrs);
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
                maxSize: this.instance.handler.getMaxSize(),
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

    async editLayer (id) {
        this.updateState({
            loading: true
        });
        try {
            const layerJson = await this.instance.getService().getLayerForEdit(id);
            const values = {
                id,
                locale: {
                    ...layerJson.locale
                },
                style: {
                    ...layerJson?.options?.styles?.default?.featureStyle
                }
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
            await this.instance.getService().updateLayer(id, values);
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

    async deleteLayer (id) {
        this.updateState({
            loading: true
        });
        try {
            const success = await this.instance.getService().deleteLayer(id);
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
    'addLayerToMap'
]);

export { wrapped as MyFeaturesHandler };
