import { StateHandler, Messaging, controllerMixin } from 'oskari-ui/util';
import { showViewForm } from '../view/ViewForm/ViewForm';

class ViewsHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            data: [],
            loading: false
        });
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'MyData');
        this.viewService = this.instance.getViewService();
        this.eventHandlers = this.createEventHandlers();
        this.registerTool();
        this.refreshViewsList();
    };

    getName () {
        return 'MyViewsHandler';
    }

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    showErrorMessage (message) {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const button = dialog.createCloseButton(this.loc('tabs.myviews.button.ok'));
        button.addClass('primary');
        dialog.show(this.loc('tabs.myviews.error.title'), message, [button]);
    }

    promptForView (view) {
        const { id } = view || {};
        if (this.popupControls) {
            if (this.popupControls.id === id) {
                this.popupControls.bringToTop();
                return;
            }
            this.popupCleanup();
        }
        const editCb = success => this.handleSaveViewResponse(success);
        const onSave = values => {
            this.updateState({
                loading: true
            });
            this.sandbox.postRequestByName('StateHandler.SaveStateRequest', [values.name, values.description, values.isDefault]);
        };
        const onEdit = values => {
            this.updateState({
                loading: true
            });
            this.viewService.updateView(id, values.name, values.description, values.isDefault, editCb);
        };
        const onOk = id ? onEdit : onSave;
        // create popup
        this.popupControls = showViewForm(view, onOk, () => this.popupCleanup());
    }

    handleSaveViewResponse (isSuccess) {
        if (isSuccess) {
            Messaging.success(this.loc('tabs.myviews.save.success'));
            this.refreshViewsList();
        } else {
            Messaging.error(this.loc('tabs.myviews.error.notsaved'));
            this.updateState({
                loading: false
            });
        }
        this.popupCleanup();
    }

    refreshViewsList () {
        this.updateState({
            loading: true
        });
        this.viewService.loadViews('USER', (isSuccess, response) => {
            if (isSuccess) {
                const views = response.views;
                views.forEach((view) => {
                    view.name = Oskari.util.sanitize(view.name);
                    view.description = Oskari.util.sanitize(view.description);
                });
                this.updateState({
                    data: views,
                    loading: false
                });
            } else {
                this.showErrorMessage(this.loc('tabs.myviews.error.loadfailed'));
                this.updateState({
                    loading: false
                });
            }
        });
    }

    registerTool () {
        if (!Oskari.requestBuilder('StateHandler.SaveStateRequest')) {
            return;
        }
        const loggedIn = Oskari.user().isLoggedIn();
        const tool = {
            iconCls: 'tool-save-view',
            sticky: false,
            disabled: !loggedIn,
            tooltip: this.loc('tabs.myviews.button.toolbarsave'),
            prepend: true,
            callback: () => {
                if (loggedIn) {
                    this.promptForView();
                }
            }
        };
        this.sandbox.postRequestByName('Toolbar.AddToolButtonRequest', ['save_view', 'viewtools', tool]);
    }

    deleteView (view) {
        this.updateState({
            loading: true
        });
        this.viewService.deleteView(view, (isSuccess) => {
            if (isSuccess) {
                if (Oskari.app.getUuid() === view.uuid) {
                    // Deleting the current map view. Load default view but don't lose user's layers.
                    window.location.href = this.getDefaultViewUrlWithCurrentMapParams(view.srsName);
                } else {
                    this.refreshViewsList();
                }
            } else {
                this.showErrorMessage(Oskari.getMsg('MyData', 'tabs.myviews.error.notdeleted'));
                this.updateState({
                    loading: false
                });
            }
        });
    }

    editView (data) {
        this.promptForView(data);
    }

    setDefaultView (data) {
        this.updateState({
            loading: true
        });
        this.viewService.updateView(data.id, data.name, data.description, !data.isDefault, (isSuccess) => {
            this.handleSaveViewResponse(isSuccess);
        });
    }

    openView (data) {
        if (data.srsName !== this.sandbox.getMap().getSrsName()) {
            window.location.href = data.url;
            return;
        }
        const rb = Oskari.requestBuilder('StateHandler.SetStateRequest');
        if (rb) {
            const req = rb(data.state);
            req.setCurrentViewId(data.id);
            this.sandbox.request(this.instance, req);
        }
    }

    saveCurrent () {
        this.promptForView();
    }

    getDefaultViewUrlWithCurrentMapParams (srsName) {
        const systemDefault = Oskari.app.getSystemDefaultViews()
            .find((defaultView) => defaultView.srsName === srsName);
        let url = this.sandbox.createURL('/?', true);
        if (systemDefault) {
            // use uuid if available so server doesn't need to provide the global default
            url += 'uuid=' + systemDefault.uuid + '&';
        }
        url += this.sandbox.generateMapLinkParameters();
        return url;
    }

    createEventHandlers () {
        const handlers = {
            'StateSavedEvent': event => {
                this.handleSaveViewResponse(!event.isError());
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(ViewsHandler, [
    'deleteView',
    'editView',
    'setDefaultView',
    'openView',
    'saveCurrent'
]);

export { wrapped as MyViewsHandler };
