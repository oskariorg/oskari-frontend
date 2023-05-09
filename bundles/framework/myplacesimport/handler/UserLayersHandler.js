import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showLayerForm } from '../view/LayerForm';
import { MAX_SIZE, ERRORS } from '../constants';

class UserLayersHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            data: [],
            loading: false
        });
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlacesImport');
        this.eventHandlers = this.createEventHandlers();
        this.layerMetaType = 'USERLAYER';
        this.refreshLayersList();
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'UserLayersHandler';
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
            isImport
        };
        const onSuccess = () => this.popupCleanup();
        const onError = (error = ERRORS.GENERIC) => {
            if (this.popupControls) {
                this.popupControls.update(error);
            }
        };
        const save = values => {
            this.updateState({
                loading: true
            });
            this.instance.getService().submitUserLayer(values, onSuccess, onError);
        };
        const update = values => {
            this.updateState({
                loading: true
            });
            this.instance.getService().updateUserLayer(id, values, onSuccess, onError);
        };
        const onOk = isImport ? save : update;
        this.popupControls = showLayerForm(values, conf, onOk, () => this.popupCleanup());
    }

    getMaxSize () {
        const confMax = this.instance.conf.maxFileSizeMb;
        return isNaN(confMax) ? MAX_SIZE : parseInt(confMax);
    }

    openLayer (id) {
        const addMLrequestBuilder = Oskari.requestBuilder('AddMapLayerRequest');
        // const mapMoveByContentReqBuilder = Oskari.requestBuilder('MapModulePlugin.MapMoveByLayerContentRequest');
        const addMlRequest = addMLrequestBuilder(id, {
            zoomContent: true
        });
        this.sandbox.request(this.instance, addMlRequest);
        // const mapMoveByContentRequest = mapMoveByContentReqBuilder(id, true);
        // this.sandbox.request(this.instance, mapMoveByContentRequest);
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

    editUserLayer (id) {
        const layer = this.instance.getMapLayerService().findMapLayer(id);
        const values = {
            locale: layer.getLocale(),
            style: layer.getCurrentStyle().getFeatureStyle(),
            id
        };
        this.showLayerDialog(values);
    }

    deleteUserLayer (id) {
        this.updateState({
            loading: true
        });
        this.instance.getService().deleteUserLayer(id);
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

const wrapped = controllerMixin(UserLayersHandler, [
    'editUserLayer',
    'deleteUserLayer',
    'openLayer'
]);

export { wrapped as UserLayersHandler };
