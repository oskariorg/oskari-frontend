import React from 'react';
import ReactDOM from 'react-dom';
import { AdminLayerForm } from './AdminLayerForm';
import { LayerWizard } from './LayerWizard';

import { AdminLayerFormService } from './AdminLayerFormService';
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
        this.service.initLayerState(layer);
        this.update();
    }
    setDataProviders (dataProviders) {
        this.dataProviders = dataProviders;
    }
    setMapLayerGroups (mapLayerGroups) {
        this.mapLayerGroups = mapLayerGroups;
    }

    update () {
        const me = this;
        const el = this.getElement();
        if (!el) {
            return;
        }

        ReactDOM.render(
            <LocaleContext.Provider value={this.loc}>
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
                            onDelete={() => this.service.deleteLayer()}
                            onSave={() => this.service.saveLayer()}
                            onCancel={() => {
                                this.service.clearMessages();
                                me.hide();
                            }} />
                    </LayerWizard>
                </MutatorContext.Provider>
            </LocaleContext.Provider>, el.get(0));
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
