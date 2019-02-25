import React from 'react';
import ReactDOM from 'react-dom';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

export default class LayerEditorFlyout extends ExtraFlyout {
    constructor (title, options) {
        super(title, options);
        this.element = null;
        this.layerId = null;
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
    createUi () {
        this.setElement(jQuery('<div></div>'));
        this.addClass('admin-layereditor-flyout');
        this.setContent(this.getElement());
        this.update(this.layerId);
    }
    setLayerId (layerId) {
        this.layerId = layerId;
        this.update(layerId);
    }
    update (layerId) {
        const el = this.getElement();
        if (layerId === null || !el) {
            return;
        }
        ReactDOM.render(<div>React content for layer id {layerId}</div>, el.get(0));
    }
    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.unmountComponentAtNode(el.get(0));
    }
}
