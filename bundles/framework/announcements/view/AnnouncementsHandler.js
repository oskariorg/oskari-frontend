import React from 'react';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { Message } from 'oskari-ui';

// Handler for announcements. Handles state and service calls.

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='announcements' />;

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.locale = instance.getLocalization();
        this.announcementsService = this._createAnnouncementsService();
        this.state = {
            panels: [],
            modals: [],
            updated: false,
            announcements: [],
            checked: false
        };
    }

    _createAnnouncementsService () {
        const service = this.sandbox.getService('Oskari.framework.bundle.announcements.AnnouncementsService');
        return service;
    }

    getAnnouncements (callback) {
        this.announcementsService.getAnnouncements(function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.getFailed'));
                return;
            }
            callback(data);
        });
    }

    updatePanelsModals (panels, modals) {
        this.updateState({
            panels: panels,
            modals: modals,
            updated: true
        });
    }

    handleOk (index, id, checked) {
        if (checked) {
            localStorage.setItem(id, checked);
            this.updateState({
                checked: false
            });
        }
        const newList = [...this.state.modals];
        newList.splice(index, 1);
        this.updateState({
            modals: newList
        });
    }

    showModal (id) {
        if (localStorage.getItem(id)) {
            return false;
        }
        else {
            return true;
        }
    }

    onCheckboxChange (checked) {
        this.updateState({
            checked: checked
        });
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'getAnnouncements', 'updatePanelsModals', 'handleOk', 'onCheckboxChange', 'showModal'
]);
