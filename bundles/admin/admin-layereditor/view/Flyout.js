import React from 'react';
import { AdminLayerForm, AdminLayerFormHandler } from './AdminLayerForm';
import { LayerWizard } from './LayerWizard';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { createRoot } from 'react-dom/client';

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
        this._reactRoot = null;
    }

    getReactRoot (element) {
        if (!this._reactRoot) {
            this._reactRoot = createRoot(element);
        }
        return this._reactRoot;
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
            this.uiHandler.resetForm();
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
        this.uiHandler.setMapLayerGroups(mapLayerGroups);
        this.update();
    }

    update () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        this.getReactRoot(el.get(0)).render(this.getEditorUI());
    }

    getEditorUI () {
        const {
            layer,
            layerTypes,
            versions,
            capabilities,
            loading,
            propertyFields,
            credentialsCollapseOpen,
            tab,
            scales,
            metadata
        } = this.uiHandler.getState();
        const controller = this.uiHandler.getController();
        return (
            <LocaleProvider value={{ bundleKey: 'admin-layereditor' }}>
                <ThemeProvider>
                    <LayerWizard
                        layer={layer}
                        controller={controller}
                        capabilities={capabilities}
                        propertyFields={propertyFields}
                        loading={loading}
                        layerTypes={layerTypes}
                        versions={versions}
                        credentialsCollapseOpen={credentialsCollapseOpen}
                        onCancel={() => {
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
                            rolesAndPermissionTypes={this.uiHandler.getAdminMetadata()}
                            validators={this.uiHandler.getValidatorFunctions(layer.type)}
                            validationErrors={this.uiHandler.validateUserInputValues(layer)}
                            tab={tab}
                            scales={scales}
                            metadata={metadata}
                            onDelete={() => this.uiHandler.deleteLayer()}
                            onSave={() => this.uiHandler.saveLayer()}
                            onCancel={() => {
                                this.hide();
                            }} />
                    </LayerWizard>
                </ThemeProvider>
            </LocaleProvider>
        );
    }

    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        this.getReactRoot(el.get(0)).unmount();
        this.uiHandler.resetMap();
    }
}
