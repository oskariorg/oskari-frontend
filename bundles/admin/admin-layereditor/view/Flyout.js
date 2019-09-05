import React from 'react';
import ReactDOM from 'react-dom';
import { AdminLayerForm } from './AdminLayerForm';
import { AdminLayerFormService } from './AdminLayerFormService';
import { GenericContext } from '../../../../src/react/util.jsx';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

export class LayerEditorFlyout extends ExtraFlyout {
    constructor (title, options) {
        super(title, options);
        this.element = null;
        this.layerId = null;
        this.layer = null;
        this.loc = null;
        this.dataProviders = [];
        this.mapLayerGroups = [];
        this.service = new AdminLayerFormService();
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
        this.update(this.layer, this.dataProviders, this.mapLayerGroups, this.loc);
    }
    setLayerId (layerId) {
        this.layerId = layerId;
        this.update(layerId);
    }
    setLayer (layer) {
        this.layer = layer;
        this.update(layer, this.dataProviders, this.mapLayerGroups, this.loc);
    }
    setDataProviders (dataProviders) {
        this.dataProviders = dataProviders;
    }
    setMapLayerGroups (mapLayerGroups) {
        this.mapLayerGroups = mapLayerGroups;
    }

    update (layer, dataProviders, mapLayerGroups, loc) {
        const me = this;
        const el = this.getElement();
        if (layer === null || !el) {
            return;
        }
        const renderUI = () => {
            ReactDOM.render(
                <GenericContext.Provider value={{ loc: loc }}>
                    <AdminLayerForm
                        mutator={this.service.getMutator()}
                        mapLayerGroups={mapLayerGroups}
                        dataProviders={dataProviders}
                        layer={this.service.getLayer()}
                        message={this.service.getMessage()}
                        onDelete={() => this.service.deleteLayer()}
                        onSave={() => this.service.saveLayer()}
                        onCancel={() => me.hide()} />
                </GenericContext.Provider>,
                el.get(0));
        };
        this.service.initLayerState(layer);
        this.service.setListener(renderUI);
        renderUI();
    }
    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.unmountComponentAtNode(el.get(0));
    }
}
