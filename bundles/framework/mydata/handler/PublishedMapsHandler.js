import React from 'react';
import { StateHandler, Messaging, controllerMixin } from 'oskari-ui/util';
import { showSnippetPopup } from '../view/embedded/SnippetPopup';
import { PublishedMapsTab } from '../view/PublishedMaps/PublishedMapsTab';

class MapsHandler extends StateHandler {
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
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'PublishedMapsHandler';
    }

    showHtml (view) {
        this.popupControls = showSnippetPopup(view, this.popupCleanup);
    }

    updateTab () {
        if (this.updater) {
            this.updater(
                <PublishedMapsTab
                    controller={this.getController()}
                    data={this.state.data}
                />
            );
        }
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

    refreshViewsList () {
        this.viewService.loadViews('PUBLISHED', (isSuccess, response) => {
            if (isSuccess) {
                this.updateState({
                    data: response.views
                });
                this.updateTab();
            } else {
                this.showErrorMessage(this.loc('tabs.publishedmaps.error.loadfailed'));
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
        this.showErrorMessage(this.loc('tabs.publishedmaps.error.generic'));
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
        this.viewService.deleteView(view, (isSuccess) => {
            if (isSuccess) {
                this.refreshViewsList();
            } else {
                this.showErrorMessage(this.loc('tabs.publishedmaps.error.notdeleted'));
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
        dialog.makeDraggable();
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
        }

        const resp = this.viewService.isViewLayersLoaded(data, sandbox);
        if (resp.status) {
            this.editRequestSender(data);
        } else {
            this.confirmSetState(() => {
                this.editRequestSender(data);
            }, resp.msg === 'missing');
        }
        this.refreshViewsList();
    }

    setPublished (data) {
        const view = this.getViewById(data.id);
        if (view) {
            const newState = !view.isPublic;
            this.viewService.makeViewPublic(
                data.id,
                newState,
                (isSuccess) => {
                    if (isSuccess) {
                        this.refreshViewsList();
                        this.updateTab();
                    } else {
                        this.showErrorMessage(
                            this.loc('tabs.publishedmaps.error.makePrivate')
                        );
                    }
                });
        }
    }

    showOnMap (data) {
        const srs = data.state.mapfull.state.srs;
        const supported = this.isCurrentProjectionSupportedForView(data);
        if (!supported) {
            this.createProjectionChangeDialog(() => {
                window.location.href = this.constructUrlWithUuid(srs, null, data);
            });
        }

        this.setMapState(data, false, () => {
            this.setMapState(data, true);
        });
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

    setMapState (data, forced, confirmCallback) {
        const sandbox = this.instance.getSandbox();
        const setStateRequestBuilder = Oskari.requestBuilder(
            'StateHandler.SetStateRequest'
        );
        // error handling: check if the layers referenced in view are
        // loaded
        const resp = this.viewService.isViewLayersLoaded(data, sandbox);
        if (resp.status || forced === true) {
            if (setStateRequestBuilder) {
                const req = setStateRequestBuilder(data.state);
                req.setCurrentViewId(data.id);
                sandbox.request(this.instance, req);
            }
        }
        this.confirmSetState(confirmCallback, resp.msg === 'missing');
    }

}

const wrapped = controllerMixin(MapsHandler, [
    'deleteView',
    'editView',
    'setPublished',
    'showOnMap',
    'showHtml'
]);

export { wrapped as PublishedMapsHandler };
