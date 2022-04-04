import React from 'react';
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.sandbox = Oskari.getSandbox();
        this.viewService = Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.service.ViewService', Oskari.urls.getRoute());
        this.setState({
            tabs: []
        });
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'PersonalData');
        this.addStateListener(consumer);
        this.eventHandlers = this.createEventHandlers();
    }

    addTab (id, title, component) {
        this.updateState({
            tabs: [
                ...this.state.tabs,
                {
                    id,
                    title,
                    component
                }
            ]
        });
    }

    updateTab (id, component) {
        this.updateState({
            tabs: this.state.tabs.map(t => {
                if (t.id === id) {
                    return {
                        ...t,
                        component
                    };
                }
                return t;
            })
        })
    }

    getName () {
        return 'MyDataHandler';
    }

    showErrorMessage (title, message, buttonText) {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const button = dialog.createCloseButton(buttonText);
        button.addClass('primary');
        dialog.show(title, message, [button]);
    }

    createEventHandlers () {
        const handlers = {
            'StateSavedEvent': event => {
                this.handleSaveViewResponse(!event.isError());
            },
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(UIHandler, [
    
]);

export { wrapped as MyDataHandler };
