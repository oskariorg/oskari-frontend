import React from 'react';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { announcementsCalls } from './AnnouncementsCalls';
import { Message } from 'oskari-ui';

/*
Handler for admin-announcements forms.
*/

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='admin-announcements' />;

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.locale = instance.getLocalization();
        this.announcementsCalls = announcementsCalls();
        this.newTitle = 'Uusi ilmoitus';
        this.state = {
            update: false,
            announcements: [],
            title: 'Uusi Ilmoitus',
            updated: false,
            active: true,
            activeKey: []

        };
    }

    getAdminAnnouncements (callback) {
        this.announcementsCalls.getAdminAnnouncements(function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.getAdminAnnouncementsFailed'));
                return;
            }
            callback(data);
        });
    }

    saveAnnouncement (data) {
        this.announcementsCalls.saveAnnouncement(data, function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.saveFailed'));
            } else {
                Messaging.success(getMessage('messages.saveSuccess'));
            }
        });
        this.updateState({
            updated: false,
            activeKey: []
        });
    }

    // Update all the announcements f.ex. when saved. Set active key as empty so all panels get closed.
    updateAnnouncement (data) {
        this.announcementsCalls.updateAnnouncement(data, function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.updateFailed'));
            }
        });
        this.updateState({
            updated: false,
            activeKey: []
        });
    }

    deleteAnnouncement (index, id) {
        const test = { id };

        // TODO: Better/different way to confirm deleting an announcement
        if (window.confirm(this.instance.getLocalization('deleteAnnouncementConfirm'))) {
            this.announcementsCalls.deleteAnnouncement(test, function (err) {
                if (err) {
                    Messaging.error(getMessage('messages.deleteFailed'));
                    return;
                }
                Messaging.success(getMessage('messages.deleteSuccess'));
            });
            const newList = [...this.state.announcements];
            newList.splice(index, 1);

            // Update accordion with announcements and keep all closed
            this.updateState({
                announcements: newList,
                activeKey: []
            });
        }
    }

    // Cancel creating a new announcement or editing one. Close all panels.
    cancel (index, id) {
        if (id !== undefined) {
            this.updateState({
                updated: false,
                activeKey: []
            });
        } else {
            const newList = [...this.state.announcements];
            newList.splice(index, 1);
            this.updateState({
                announcements: newList,
                activeKey: []
            });
        }
    }
    // Create new announcement (Rename?)
    addForm () {
        const newList = [...this.state.announcements];
        newList.push({
            title: this.newTitle
        });
        this.updateState({
            announcements: newList,
            title: this.newTitle
        });
    }

    pushAnnouncements (data) {
        this.updateState({
            announcements: data,
            updated: true
        });
    }

    updateTitle (value) {
        this.updateState({
            title: value
        });
    }
    toggleActive () {
        this.updateState({
            active: !this.state.active
        });
    }

    updateActiveKey (key) {
        this.updateState({
            activeKey: key
        });
    }
}

export const AnnouncementsFormMapperHandler = controllerMixin(ViewHandler, [
    'pushAnnouncements', 'getAdminAnnouncements', 'addForm', 'deleteAnnouncement', 'updateTitle', 'toggleActive', 'saveAnnouncement', 'updateAnnouncement', 'cancel', 'updateActiveKey'
]);
