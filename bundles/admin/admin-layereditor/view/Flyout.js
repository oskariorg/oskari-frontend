import React from 'react';
import ReactDOM from 'react-dom';
import {AdminLayerForm} from './AdminLayerForm';
import {GenericContext} from '../../../../src/react/util.jsx';

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
        ReactDOM.render(
            <GenericContext.Provider value={{loc: loc, lang: Oskari.getLang()}}>
                <AdminLayerForm layer={layer} dataProviders={dataProviders} mapLayerGroups={mapLayerGroups} flyout={me} />
            </GenericContext.Provider>,
            el.get(0));
    }
    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.unmountComponentAtNode(el.get(0));
    }
}
