import React from 'react';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { Message } from 'oskari-ui';

// Handler for announcements. Handles state and service calls.

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='announcements' />;

class ViewHandler extends StateHandler {
    constructor (service) {
        super();
        this.service = service;
        this.state = {
            tools: [],
            dontShowAgain: [],
            announcements: [],
            showAsPopup: []
        };
        this.initState();
        this.service.on('tool', () => this.updateState({ tools: this.service.getTools() }));
    }

    initState () {
        this.service.fetchAnnouncements(function (err, announcements) {
            if (err) {
                Messaging.error(getMessage('messages.getFailed'));
            } else {
                const dontShowAgain = this.getDontShowAgainIds(announcements);
                const showAsPopup = announcements.filter(ann => ann.options.showAsPopup && !dontShowAgain.includes(ann.id));
                this.updateState({
                    announcements,
                    dontShowAgain,
                    showAsPopup
                });
            }
        }.bind(this));
    }

    getDontShowAgainIds (announcements = this.state.announcements) {
        const storage = this.service.getIdsFromLocalStorage();
        const ids = announcements.map(a => a.id);
        return ids.filter(id => storage.includes(id));
    }

    setShowAgain (id, dontShow) {
        if (dontShow) {
            this.service.addToLocalStorage(id);
        } else {
            this.service.removeFromLocalStorage(id);
        }
        const dontShowAgain = this.getDontShowAgainIds();
        this.updateState({ dontShowAgain });
    }

    clearPopup () {
        this.updateState({ showAsPopup: [] });
    }

    onPopupChange (currentPopup) {
        this.updateState({ currentPopup });
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'setShowAgain', 'clearPopup', 'onPopupChange'
]);
