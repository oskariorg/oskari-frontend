import React from 'react';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_SEPARATOR } from './Constants';

// Handler for announcements. Handles state and service calls.

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='announcements' />;

class ViewHandler extends StateHandler {
    constructor (service) {
        super();
        this.service = service;
        this.state = {
            dontShowAgain: [],
            announcements: [],
            showAsPopup: []
        };
        this.initState();
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
        const storage = this.getIdsFromLocalStorage();
        const ids = announcements.map(a => a.id);
        return ids.filter(id => storage.includes(id));
    }

    setShowAgain (id, dontShow) {
        if (dontShow) {
            this.addToLocalStorage(id);
        } else {
            this.removeFromLocalStorage(id);
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

    getIdsFromLocalStorage () {
        // Get the existing ids or empty array
        const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
        return existing ? existing.split(LOCAL_STORAGE_SEPARATOR).map(id => parseInt(id)) : [];
    }

    storeIdsToLocalStorage (ids) {
        // Save ids to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, ids.join(LOCAL_STORAGE_SEPARATOR));
    }

    addToLocalStorage (id) {
        const existing = this.getIdsFromLocalStorage();
        if (existing.includes(id)) {
            return;
        }
        existing.push(id);
        this.storeIdsToLocalStorage(existing);
    }

    removeFromLocalStorage (id) {
        const existing = this.getIdsFromLocalStorage();
        const updated = existing.filter(item => item !== id);
        this.storeIdsToLocalStorage(updated);
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'setShowAgain', 'clearPopup', 'onPopupChange'
]);
