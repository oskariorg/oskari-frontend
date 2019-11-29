import React from 'react';
import ReactDOM from 'react-dom';
import { AdminLayerForm } from './AdminLayerForm';
import { LayerWizard } from './LayerWizard';
import { AdminLayerFormService } from './AdminLayerFormService';
import { Spin } from 'oskari-ui';
import { LocaleContext, MutatorContext } from 'oskari-ui/util';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

export class LayerEditorFlyout extends ExtraFlyout {
    constructor (title, options) {
        super(title, options);
        this.element = null;
        this.loc = null;
        this.dataProviders = [];
        this.mapLayerGroups = [];
        this.service = new AdminLayerFormService(() => this.update());
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
            this.service.resetLayer();
        } else {
            this.service.fetchLayer(layer.getId());
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
        if (this.service.isLoading()) {
            uiCode = <Spin>{ uiCode }</Spin>;
        }

        ReactDOM.render(uiCode, el.get(0));
    }
    getEditorUI () {
        return (
            <LocaleContext.Provider value={{ bundleKey: 'admin-layereditor' }}>
                <MutatorContext.Provider value={this.service}>
                    <LayerWizard
                        layer={this.service.getLayer()}
                        capabilities={this.service.getCapabilities()}
                        loading={this.service.isLoading()}
                        layerTypes={this.service.getLayerTypes()}>
                        <AdminLayerForm
                            mapLayerGroups={this.mapLayerGroups}
                            dataProviders={this.dataProviders}
                            layer={this.service.getLayer()}
                            messages={this.service.getMessages()}
                            rolesAndPermissionTypes={this.service.getRolesAndPermissionTypes()}
                            onDelete={() => this.service.deleteLayer()}
                            onSave={() => this.service.saveLayer()}
                            onCancel={() => {
                                this.service.clearMessages();
                                this.hide();
                            }} />
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>
        );
    }
    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.unmountComponentAtNode(el.get(0));
        this.service.clearMessages();
    }
}
