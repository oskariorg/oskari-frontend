import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showGroupingPopup } from './GroupingPopup';

class UIService extends StateHandler {
    constructor () {
        super();
        this.initialState = {
            loading: false,
            headerMessageKey: null,
            value: {},
            deleteLayers: false,
            deleteGroups: false,
            confirmOpen: false
        };
        this.setState(this.initialState);
        this.saveAction = null;
        this.cancelAction = null;
        this.popupControls = null;
    }
    showPopup (title, options, deleteMapLayersText) {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.popupControls = showGroupingPopup(title, options, deleteMapLayersText, this.getController(), this.getState(), () => this.closePopup());
    }
    closePopup () {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.reset();
        this.popupControls = null;
    }
    updatePopup () {
        if (this.popupControls) {
            this.popupControls.update(this.state);
        }
    }
    setSaveAction (saveAction) {
        this.saveAction = saveAction;
    }
    setCancelAction (cancelAction) {
        this.cancelAction = cancelAction;
    }
    setDeleteAction (deleteAction) {
        this.deleteAction = deleteAction;
    }
    setValue (value) {
        this.updateState({ value });
        this.updatePopup();
    }
    setDeleteLayers (value) {
        this.updateState({ deleteLayers: value });
        this.updatePopup();
    }
    setLoading () {
        this.updateState({
            loading: !!this.state.loading
        });
        this.updatePopup();
    }
    setConfirmOpen (open) {
        this.updateState({
            confirmOpen: open
        });
        this.updatePopup();
    }
    save (id, parentId) {
        if (typeof this.saveAction !== 'function') {
            return;
        }
        const { value } = this.getState();
        this.updateState({ loading: true });
        this.saveAction(value, id, parentId);
    }
    cancel () {
        if (typeof this.cancelAction !== 'function') {
            return;
        }
        const { value } = this.getState();
        this.cancelAction(value);
    }
    delete (id) {
        if (typeof this.deleteAction !== 'function') {
            return;
        }
        this.deleteAction(id, this.getState().deleteLayers);
    }
    reset () {
        this.setState(this.initialState);
        this.saveAction = null;
        this.cancelAction = null;
        this.deleteAction = null;
    }
}

// Add getController function to the service. List which functions are available for the components.
// controllerMixin extends the service by adding getController function. The function returns a Controller object.
const wrapped = controllerMixin(UIService, [
    'setValue',
    'save',
    'cancel',
    'delete',
    'setDeleteLayers',
    'subgroupError',
    'showPopup',
    'closePopup',
    'setSaveAction',
    'setDeleteAction',
    'setCancelAction',
    'setLoading',
    'setConfirmOpen'
]);

export { wrapped as LayerListFormHandler };
