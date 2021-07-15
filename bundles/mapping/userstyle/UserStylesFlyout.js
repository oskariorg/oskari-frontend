import React from 'react';
import ReactDOM from 'react-dom';
import { UserStyles } from './view/UserStyles';
import { LocaleProvider } from 'oskari-ui/util';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');
const options = {
    width: 500,
    cls: 'user-styles-flyout'
};
export class UserStylesFlyout extends ExtraFlyout {
    constructor (instance) {
        super(null, options);
        this.instance = instance;
        this.element = null;
        this.loc = Oskari.getMsg.bind(null, 'userstyle');
        this.on('show', () => {
            if (!this.getElement()) {
                this.createUi();
            }
        });
        this.on('hide', () => {
            this.cleanUp();
        });
        this.instance.getService().on('update', () => {
            this.update();
        });
    }

    setElement (el) {
        this.element = el;
    }

    getElement () {
        return this.element;
    }

    createUi () {
        const xPosition = jQuery('#mapdiv').position().left;
        const offset = 150;

        this.setElement(jQuery('<div></div>'));
        this.setTitle(this.loc('title'));
        this.setContent(this.getElement());
        this.move(xPosition + offset, 15, true);
        this.makeDraggable({
            handle: '.oskari-flyouttoolbar',
            scroll: false
        });
        this.update();
    }

    setLayerId (layerId) {
        this.layerId = layerId;
    }

    update () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        const uiCode = this.getEditorUI();

        ReactDOM.render(uiCode, el.get(0));
    }

    getEditorUI () {
        const service = this.instance.getService();
        const styles = service.getUserStylesForLayer(this.layerId);
        const removeUserStyleHandler = service.removeUserStyle.bind(service);
        return (
            <LocaleProvider value={{ bundleKey: 'userstyle' }}>
                <UserStyles layerId={this.layerId} styles={styles} removeUserStyleHandler={removeUserStyleHandler}></UserStyles>
            </LocaleProvider>
        );
    }

    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.unmountComponentAtNode(el.get(0));
        delete this.element;
    }
}
