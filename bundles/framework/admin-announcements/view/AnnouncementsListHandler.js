import React from 'react';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { announcementsHelper } from './AnnouncementsHelper';
import { Message } from 'oskari-ui';

/*
Handler for admin-announcements forms.
*/

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='admin-announcements' />;

/**
* Remove item from a localStorage() array
* @param {String} name  The localStorage() key
* @param {String} value The localStorage() value
*/
const removeFromLocalStorageArray = (name, value) => {
    // Get the existing data
    var existing = localStorage.getItem(name);
    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];
    // Get index of announcement id and remove it from the array
    const index = existing.indexOf(value);
    if (index > -1) {
        existing.splice(index, 1);
    }
    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
};

class ViewHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.announcementsHelper = announcementsHelper();
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
        this.announcementsHelper.getAdminAnnouncements(function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.getAdminAnnouncementsFailed'));
                return;
            }
            callback(data);
        });
    }

    saveAnnouncement (data) {
        this.announcementsHelper.saveAnnouncement(data, function (err, data) {
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
        this.announcementsHelper.updateAnnouncement(data, function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.updateFailed'));
                return false;
            } else {
                Messaging.success(getMessage('messages.updateSuccess'));
                removeFromLocalStorageArray('oskari-announcements', data.data[0].toString());
            }
        });
        this.updateState({
            updated: false,
            activeKey: []
        });
    }

    deleteAnnouncement (index, id) {
        this.id = { id };
        this.announcementsHelper.deleteAnnouncement(this.id, function (err) {
            if (err) {
                Messaging.error(getMessage('messages.deleteFailed'));
            } else {
                Messaging.success(getMessage('messages.deleteSuccess'));
            }
        });
        const newList = [...this.state.announcements];
        newList.splice(index, 1);

        // Update accordion with announcements and keep all closed
        this.updateState({
            announcements: newList,
            activeKey: []
        });
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

export const AnnouncementsListHandler = controllerMixin(ViewHandler, [
    'pushAnnouncements', 'getAdminAnnouncements', 'addForm', 'deleteAnnouncement', 'updateTitle', 'toggleActive', 'saveAnnouncement', 'updateAnnouncement', 'cancel', 'updateActiveKey'
]);
