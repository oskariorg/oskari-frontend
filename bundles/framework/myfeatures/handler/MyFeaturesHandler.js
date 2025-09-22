import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showLayerForm } from '../view/LayerForm';
import { MAX_SIZE, ERRORS } from '../constants';

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
        this.loc = Oskari.getMsg.bind(null, 'MyFeatures');
        this.eventHandlers = this.createEventHandlers();
        this.layerMetaType = 'USERLAYER';
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
        const onSuccess = () => this.popupCleanup();
        const onError = (error = ERRORS.GENERIC, values) => {
            if (this.popupControls) {
                this.popupControls.update(error, values);
            }
        };
        const save = values => {
            this.updateState({
                loading: true
            });
            this.instance.getService().submitMyFeatures(values, onSuccess, (err) => onError(err, values));
        };
        const update = values => {
            this.updateState({
                loading: true
            });
            this.instance.getService().updateMyFeatures(id, values, onSuccess, (err) => onError(err, values));
        };
        const onOk = isImport ? save : update;
        this.popupControls = showLayerForm(values, conf, onOk, () => this.popupCleanup());
    }

    getMaxSize () {
        const confMax = this.instance.conf?.maxFileSizeMb;
        return isNaN(confMax) ? MAX_SIZE : parseInt(confMax);
    }

    openLayer (id) {
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
        const layers = this.instance.getMapLayerService().getAllLayersByMetaType(this.layerMetaType);
        this.updateState({
            data: layers,
            loading: false
        });
    }

    editMyFeature (id) {
        const layer = this.instance.getMapLayerService().findMapLayer(id);
        const values = {
            locale: layer.getLocale(),
            style: layer.getCurrentStyle().getFeatureStyle(),
            id
        };
        this.showLayerDialog(values);
    }

    deleteMyFeature (id) {
        this.updateState({
            loading: true
        });
        this.instance.getService().deleteMyFeature(id);
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
    'editMyFeature',
    'deleteMyFeature',
    'openLayer'
]);

export { wrapped as MyFeaturesHandler };
