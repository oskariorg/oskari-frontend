import React from 'react';
import ReactDOM from 'react-dom';
import { AdminLayerForm, AdminLayerFormHandler } from './AdminLayerForm';
import { LayerWizard } from './LayerWizard';
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
        this.update();
    }
    setMapLayerGroups (mapLayerGroups) {
        this.mapLayerGroups = mapLayerGroups;
        this.update();
    }
    update () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.render(this.getEditorUI(), el.get(0));
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
            credentialsCollapseOpen,
            tab,
            scales
        } = this.uiHandler.getState();
        const controller = this.uiHandler.getController();
        return (
            <LocaleProvider value={{ bundleKey: 'admin-layereditor' }}>
                <LayerWizard
                    layer={layer}
                    controller={controller}
                    capabilities={capabilities}
                    propertyFields={propertyFields}
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
                        controller={controller}
                        capabilities={capabilities}
                        propertyFields={propertyFields}
                        mapLayerGroups={this.mapLayerGroups}
                        dataProviders={this.dataProviders}
                        versions={versions}
                        messages={messages}
                        rolesAndPermissionTypes={this.uiHandler.getAdminMetadata()}
                        validators={this.uiHandler.getValidatorFunctions(layer.type)}
                        tab={tab}
                        scales={scales}
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
