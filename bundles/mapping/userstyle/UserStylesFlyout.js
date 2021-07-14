import React from 'react';
import ReactDOM from 'react-dom';
import { UserStyles } from './view/UserStyles';
import { LocaleProvider } from 'oskari-ui/util';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

export class UserStylesFlyout extends ExtraFlyout {
    constructor (title, options) {
        super(title, options);
        this.element = null;
        this.loc = Oskari.getMsg.bind(null, 'userstyle');
        this.service = Oskari.getSandbox().getService(
            'Oskari.mapframework.userstyle.service.UserStyleService');
        this.removeUserStyleHandler = this.service.removeStyle.bind(this.service);

        this.on('show', () => {
            if (!this.getElement()) {
                this.createUi();
            }
        });
        this.on('hide', () => {
            this.cleanUp();
        });
        this.service.on('update', () => {
            this.update();
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
        this.addClass('user-styles-list-flyout');
        this.setContent(this.getElement());
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
        const styles = this.service.getUserStylesForLayer(this.layerId);
        return (
            <LocaleProvider value={{ bundleKey: 'userstyle' }}>
                <UserStyles layerId={this.layerId} styles={styles} removeUserStyleHandler={this.removeUserStyleHandler}></UserStyles>
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
