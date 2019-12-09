import React from 'react';
import ReactDOM from 'react-dom';
import { LocalizationComponent, TextInput, Button, Message } from 'oskari-ui';
import { LocaleContext } from 'oskari-ui/util';
import styled from 'styled-components';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

export class LocalizingFlyout extends ExtraFlyout {
    constructor (title, options) {
        super(title, options);
        this.mountPoint = document.createElement('div');
        this.addClass('admin-localizing-flyout');
        this.setContent(this.mountPoint);
        this.on('show', this.render.bind(this));
        this.on('hide', this.cleanUp.bind(this));
    }
    setActionRoute (action) {
        this.action = action;
    }
    doAction (value) {
        this.hide();
    }
    render () {
        let locales = {};
        let ui = (
            <LocaleContext.Provider value={{ bundleKey: 'admin-layereditor' }}>
                <div>
                    <Message messageKey={this.options.headerKey} />
                </div>
                <LocalizationComponent
                    collapse={false}
                    single={true}
                    languages={Oskari.getSupportedLanguages()}
                    onChange={value => { locales = value; }}
                >
                    <TextInput />
                </LocalizationComponent>
                <Button onClick={() => this.doAction(locales)}>
                    <Message messageKey='save'/>
                </Button>
                <Button onClick={() => this.hide()}>
                    <Message messageKey='cancel'/>
                </Button>
            </LocaleContext.Provider>
        );
        ReactDOM.render(ui, this.mountPoint);
    }
    cleanUp () {
        ReactDOM.unmountComponentAtNode(this.mountPoint);
    }
}
