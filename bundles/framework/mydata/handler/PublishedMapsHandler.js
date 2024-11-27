import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showSnippetPopup } from '../view/embedded/SnippetPopup';

class MapsHandler extends StateHandler {
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
        this.refreshViewsList();
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'PublishedMapsHandler';
    }

    showHtml (view) {
        if (this.popupControls) {
            this.popupCleanup();
        }
        this.popupControls = showSnippetPopup(view, () => this.popupCleanup());
    }

    refreshViewsList () {
        this.updateState({
            loading: true
        });
        this.viewService.loadViews('PUBLISHED', (isSuccess, response) => {
            if (isSuccess) {
                this.updateState({
                    data: response.views,
                    loading: false
                });
            } else {
                Messaging.error(this.loc('tabs.publishedmaps.error.loadfailed'));
                this.updateState({
                    loading: false
                });
            }
        });
    }

    getViewById (id) {
        for (let i = 0; i < this.state.data.length; i += 1) {
            if (this.state.data[i].id === id) {
                // found what we were looking for
                return this.state.data[i];
            }
        }
        // couldn't find view -> show an error
        Messaging.error(this.loc('tabs.publishedmaps.error.generic'));
    }

    confirmSetState (cb, blnMissing) {
        const dialog = Oskari.clazz.create(
            'Oskari.userinterface.component.Popup'
        );
        const okBtn = Oskari.clazz.create(
            'Oskari.userinterface.component.Button'
        );
        okBtn.setTitle(this.loc('tabs.publishedmaps.button.ok'));
        okBtn.addClass('primary');

        okBtn.setHandler(() => {
            dialog.close();
            if (cb && blnMissing) {
                cb();
            }
        });
        const cancelBtn = dialog.createCloseButton(this.loc('tabs.publishedmaps.button.cancel'));
        if (blnMissing) {
            dialog.show(
                this.loc('tabs.publishedmaps.popup.showErrorTitle'),
                this.loc('tabs.publishedmaps.popup.showConfirmMissing'), [cancelBtn, okBtn]
            );
        } else {
            dialog.show(
                this.loc('tabs.publishedmaps.popup.showErrorTitle'),
                this.loc('tabs.publishedmaps.popup.showConfirmNotLoaded'), [cancelBtn]
            );
        }
        dialog.makeModal();
    }

    deleteView (view) {
        this.updateState({
            loading: true
        });
        this.viewService.deleteView(view, (isSuccess) => {
            if (isSuccess) {
                this.refreshViewsList();
            } else {
                Messaging.error(this.loc('tabs.publishedmaps.error.notdeleted'));
                this.updateState({
                    loading: false
                });
            }
        });
    }

    isCurrentProjectionSupportedForView (data) {
        const currentProjection = Oskari.getSandbox().getMap().getSrsName();
        const viewProjection = data.state.mapfull.state.srs;
        return viewProjection === currentProjection;
    }

    constructUrlWithUuid (srs, editUuid, viewData) {
        const sandbox = Oskari.getSandbox();
        let uuid;
        const views = Oskari.app.getSystemDefaultViews();
        views.forEach(function (view) {
            if (view.srsName === srs) {
                uuid = view.uuid;
            }
        });
        let url = sandbox.createURL('/?uuid=' + uuid, false);
        if (viewData) {
            url += this.getMapStateParameters(viewData);
        }
        if (editUuid) {
            url += '&editPublished=' + editUuid;
        }
        return url;
    }

    getMapStateParameters (view) {
        let mapStateParams = '';
        if (view && view.state && view.state.mapfull && view.state.mapfull.state) {
            const state = view.state.mapfull.state;
            // Set zoom and location
            mapStateParams += '&zoomLevel=' + state.zoom + '&coord=' + state.east + '_' + state.north;
            // Set layer parameters
            if (state.selectedLayers) {
                let layerParams = '&mapLayers=';
                state.selectedLayers.forEach(function (layer) {
                    if (layerParams !== '') {
                        layerParams += ',';
                    }
                    layerParams += layer.id + '+' + layer.opacity;
                    if (layer.style) {
                        layerParams += '+' + layer.style;
                    } else {
                        layerParams += '+';
                    }
                });
                mapStateParams += layerParams;
            }
        }
        return mapStateParams;
    }

    createProjectionChangeDialog (cb) {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const btn = dialog.createCloseButton(this.loc('projectionError').ok);
        const cancel = dialog.createCloseButton(this.loc('projectionError').cancel);
        cancel.setHandler(() => {
            dialog.close(true);
        });
        btn.addClass('primary');
        btn.setHandler(() => {
            cb();
            dialog.close(true);
        });
        dialog.show(this.loc('projectionError').title, this.loc('projectionError').msg, [cancel, btn]);
        dialog.makeModal();
    }

    editView (data) {
        const sandbox = Oskari.getSandbox();
        const srs = data.state.mapfull.state.srs;
        const embeddedMapUuid = data.uuid;
        const supported = this.isCurrentProjectionSupportedForView(data);
        if (!supported) {
            this.createProjectionChangeDialog(() => {
                window.location.href = this.constructUrlWithUuid(srs, embeddedMapUuid, data);
            });
            return;
        }

        const resp = this.viewService.isViewLayersLoaded(data, sandbox);
        if (resp.status) {
            this.editRequestSender(data);
        } else {
            this.confirmSetState(() => {
                this.editRequestSender(data);
            }, resp.msg === 'missing');
        }
    }

    setPublished (data) {
        this.updateState({
            loading: true
        });
        const view = this.getViewById(data.id);
        if (view) {
            const newState = !view.isPublic;
            this.viewService.makeViewPublic(
                data.id,
                newState,
                (isSuccess) => {
                    if (isSuccess) {
                        this.refreshViewsList();
                    } else {
                        Messaging.error(
                            this.loc('tabs.publishedmaps.error.makePrivate')
                        );
                        this.updateState({
                            loading: false
                        });
                    }
                });
        }
    }

    editRequestSender (data) {
        const sandbox = Oskari.getSandbox();
        const publishMapEditorRequestBuilder = Oskari.requestBuilder(
            'Publisher.PublishMapEditorRequest'
        );
        if (publishMapEditorRequestBuilder) {
            const req = publishMapEditorRequestBuilder(data);
            sandbox.request(this.instance, req);
        }
        const closeFlyoutRequestBuilder = Oskari.requestBuilder(
            'userinterface.UpdateExtensionRequest'
        );
        if (closeFlyoutRequestBuilder) {
            const closeFlyoutRequest = closeFlyoutRequestBuilder(
                this.instance,
                'close',
                this.instance.getName()
            );
            sandbox.request(this.instance.getName(), closeFlyoutRequest);
        }
    }

    createEventHandlers () {
        const handlers = {
            'Publisher.MapPublishedEvent': (event) => {
                this.refreshViewsList();
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

const wrapped = controllerMixin(MapsHandler, [
    'deleteView',
    'editView',
    'setPublished',
    'showHtml'
]);

export { wrapped as PublishedMapsHandler };
