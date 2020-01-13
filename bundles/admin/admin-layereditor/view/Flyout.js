import React from 'react';
import ReactDOM from 'react-dom';
import { AdminLayerForm } from './AdminLayerForm';
import { LayerWizard } from './LayerWizard';
import { AdminLayerFormHandler } from './AdminLayerFormHandler';
import { Spin } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

export class LayerEditorFlyout extends ExtraFlyout {
    constructor (title, options) {
        super(title, options);
        this.element = null;
        this.loc = null;
        this.dataProviders = [];
        this.mapLayerGroups = [];
        this.uiHandler = new AdminLayerFormHandler(() => this.update());
        this.on('show', () => {
            if (!this.getElement()) {
                this.createUi();
            }
        });
        this.on('hide', () => {
            this.cleanUp();
        });
    }
    setElement (el) {
        this.element = el;
    }
    getElement () {
        return this.element;
    }
    setLocale (loc) {
        this.loc = loc;
    }
    createUi () {
        this.setElement(jQuery('<div></div>'));
        this.addClass('admin-layereditor-flyout');
        this.setContent(this.getElement());
        this.update();
    }
    setLayer (layer) {
        if (!layer) {
            this.uiHandler.resetLayer();
        } else {
            this.uiHandler.fetchLayer(layer.getId());
        }
    }
    setDataProviders (dataProviders) {
        this.dataProviders = dataProviders;
    }
    setMapLayerGroups (mapLayerGroups) {
        this.mapLayerGroups = mapLayerGroups;
    }
    update () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        let uiCode = this.getEditorUI();
        // TODO: Move spinner logic inside of LayerWizard
        if (this.uiHandler.isLoading()) {
            uiCode = <Spin>{ uiCode }</Spin>;
        }

        ReactDOM.render(uiCode, el.get(0));
    }
    getEditorUI () {
        const {
            layer,
            layerTypes,
            versions,
            capabilities,
            loading,
            messages,
            propertyFields,
            rolesAndPermissionTypes,
            credentialsCollapseOpen } = this.uiHandler.getState();
        const controller = this.uiHandler.getController();
        return (
            <LocaleProvider value={{ bundleKey: 'admin-layereditor' }}>
                <LayerWizard
                    layer={layer}
                    controller={controller}
                    capabilities={capabilities}
                    loading={loading}
                    layerTypes={layerTypes}
                    versions={versions}
                    messages={messages}
                    credentialsCollapseOpen={credentialsCollapseOpen}
                    onCancel={() => {
                        this.uiHandler.clearMessages();
                        this.uiHandler.clearCredentialsCollapse();
                    }}>
                    <AdminLayerForm
                        layer={layer}
                        propertyFields={propertyFields}
                        mapLayerGroups={this.mapLayerGroups}
                        dataProviders={this.dataProviders}
                        controller={controller}
                        messages={messages}
                        rolesAndPermissionTypes={rolesAndPermissionTypes}
                        onDelete={() => this.uiHandler.deleteLayer()}
                        onSave={() => this.uiHandler.saveLayer()}
                        onCancel={() => {
                            this.uiHandler.clearMessages();
                            this.hide();
                        }} />
                </LayerWizard>
            </LocaleProvider>
        );
    }
    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.unmountComponentAtNode(el.get(0));
        this.uiHandler.clearMessages();
    }
}
