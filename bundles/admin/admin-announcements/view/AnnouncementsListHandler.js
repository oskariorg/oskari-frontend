import React from 'react';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { ANNOUNCEMENTS_LOCALSTORAGE } from '../../../framework/announcements/view/Constants';

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
    const index = existing.indexOf(value.toString());
    if (index > -1) {
        existing.splice(index, 1);
    }
    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
};

class ViewHandler extends StateHandler {
    constructor (sandbox) {
        super();
        this.service = sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');
        console.log(this.service);
        this.fetchAdminAnnouncements();
        this.state = {
            announcements: [],
            active: true,
            activeKey: []
        };
    }

    fetchAdminAnnouncements () {
        this.service.fetchAdminAnnouncements(function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.getAdminAnnouncementsFailed'));
            } else {
                this.updateState({
                    announcements: data
                });
            }
        }.bind(this));
    }

    saveAnnouncement (data) {
        this.service.saveAnnouncement(data, function (err) {
            if (err) {
                Messaging.error(getMessage('messages.saveFailed'));
            } else {
                Messaging.success(getMessage('messages.saveSuccess'));
                this.updateState({
                    activeKey: []
                });
                this.fetchAdminAnnouncements();
            }
        }.bind(this));
    }

    // Update all the announcements f.ex. when saved. Set active key as empty so all panels get closed.
    updateAnnouncement (data) {
        this.service.updateAnnouncement(data, function (err, data) {
            if (err) {
                Messaging.error(getMessage('messages.updateFailed'));
                return false;
            } else {
                Messaging.success(getMessage('messages.updateSuccess'));
                removeFromLocalStorageArray(ANNOUNCEMENTS_LOCALSTORAGE, data.id);
                this.updateState({
                    activeKey: []
                });
                this.fetchAdminAnnouncements();
            }
        }.bind(this));
    }

    deleteAnnouncement (id) {
        this.service.deleteAnnouncement(id, function (err) {
            if (err) {
                Messaging.error(getMessage('messages.deleteFailed'));
            } else {
                Messaging.success(getMessage('messages.deleteSuccess'));
                // Update accordion with announcements and keep all closed
                this.updateState({
                    activeKey: []
                });
                this.fetchAdminAnnouncements();
            }
        }.bind(this));
    }
    // Cancel creating a new announcement or editing one. Close all panels.
    cancel (id) {
        if (id !== undefined) {
            this.updateState({
                activeKey: []
            });
        } else {
            const newList = [...this.state.announcements];
            newList.splice(-1, 1);
            this.updateState({
                announcements: newList,
                activeKey: []
            });
        }
    }

    addForm () {
        const newList = [...this.state.announcements];
        newList.push({
            title: Oskari.getMsg('admin-announcements', 'addNewForm')
        });
        this.updateState({
            announcements: newList
        });
    }

    openCollapse (key) {
        this.updateState({
            activeKey: key
        });
    }
}

export const AnnouncementsListHandler = controllerMixin(ViewHandler, [
    'addForm', 'deleteAnnouncement', 'saveAnnouncement', 'updateAnnouncement', 'cancel', 'openCollapse'
]);
