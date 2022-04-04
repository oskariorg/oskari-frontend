import React from 'react';
import { StateHandler, Messaging, controllerMixin } from 'oskari-ui/util';
import { showViewForm } from '../view/ViewForm/ViewForm';
import { MyViewsTab } from '../view/MyViews/MyViewsTab';

class ViewsHandler extends StateHandler {
    constructor (consumer, instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            data: []
        });
        this.updater = null;
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'PersonalData');
        this.viewService = Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.service.ViewService', Oskari.urls.getRoute());
        this.addStateListener(consumer);

        this.registerTool();
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyViewsHandler';
    }

    updateTab () {
        if (this.updater) {
            this.updater(
                <MyViewsTab
                    controller={this.getController()}
                    data={this.state.data}
                />
            );
        }
    }

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    showErrorMessage (title, message, buttonText) {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const button = dialog.createCloseButton(buttonText);
        button.addClass('primary');
        dialog.show(title, message, [button]);
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
        const onSave = values => this.sandbox.postRequestByName('StateHandler.SaveStateRequest', [values.name, values.description, values.isDefault]);
        const onEdit = values => this.viewService.updateView(id, values.name, values.description, values.isDefault, editCb);
        const onOk = id ? onEdit : onSave;
        // create popup
        this.popupControls = showViewForm(view, onOk, this.popupCleanup);
    }

    handleSaveViewResponse (isSuccess) {
        if (isSuccess) {
            Messaging.success(this.loc('tabs.myviews.save.success'));
            this.refreshViewsList();
        } else {
            Messaging.error(this.loc('tabs.myviews.error.notsaved'));
        }
        this.popupCleanup();
    }

    refreshViewsList () {
        this.viewService.loadViews('USER', (isSuccess, response) => {
            if (isSuccess) {
                const views = response.views;
                views.forEach((view) => {
                    view.name = Oskari.util.sanitize(view.name);
                    view.description = Oskari.util.sanitize(view.description);
                });
                this.updateState({ data: views });
                this.updateTab(
                    'myviews',
                    <MyViewsTab
                        controller={this.getController()}
                        data={views}
                    />
                )
            } else {
                this.showErrorMessage(me.loc('tabs.myviews.error.loadfailed'));
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
        this.viewService.deleteView(view, (isSuccess) => {
            if (isSuccess) {
                if (Oskari.app.getUuid() === view.uuid) {
                    // Deleting the current map view. Load default view but don't lose user's layers.
                    window.location.href = this.getDefaultViewUrlWithCurrentMapParams(view.srsName);
                } else {
                    this.refreshViewsList();
                }
            } else {
                this.showErrorMessage(Oskari.getMsg('PersonalData', 'tabs.myviews.error.notdeleted'));
            }
        });
    }

    editView (data) {
        this.promptForView(data);
    }

    setDefaultView (data) {
        // start spinner
        this.sandbox.postRequestByName('ShowProgressSpinnerRequest', [true]);
        this.viewService.updateView(data.id, data.name, data.description, !data.isDefault, (isSuccess) => {
            this.sandbox.postRequestByName('ShowProgressSpinnerRequest', [false]);
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
            this.sandbox.request(this.consumer, req);
        }
    }

    saveCurrent () {
        this.promptForView();
    }

    getDefaultViewUrlWithCurrentMapParams (srsName) {
        let uuid;
        const defaultViews = Oskari.app.getSystemDefaultViews();
        defaultViews.forEach((defaultView) => {
            if (defaultView.srsName === srsName) {
                uuid = defaultView.uuid;
            }
        });
        let url = this.sandbox.createURL('/?uuid=' + uuid, true);
        url += this.sandbox.generateMapLinkParameters();
        return url;
    }

    createEventHandlers () {
        const handlers = {
            'StateSavedEvent': event => {
                this.handleSaveViewResponse(!event.isError());
            },
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

    setUpdateFunc (update) {
        this.updater = update;
    }

    showErrorMessage (title, message, buttonText) {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const button = dialog.createCloseButton(buttonText);
        button.addClass('primary');
        dialog.show(title, message, [button]);
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
