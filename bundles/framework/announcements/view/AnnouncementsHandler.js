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
        this.state = {
            panels: [],
            modals: [],
            updated: false,
            announcements: [],
            checked: false
        };
    }

    getAnnouncements (callback) {
        if (typeof callback !== 'function') {
            return;
        }

        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            url: Oskari.urls.getRoute('GetAnnouncements'),
            success: function (pResp) {
                callback(pResp);
            },
            error: function (jqXHR, textStatus) {
                Messaging.error(getMessage('messages.getFailed'));
            }
        });
    }

    updatePanelsModals (panels, modals) {
        this.updateState({
            panels: panels,
            modals: modals,
            updated: true
        });
    }

    setAnnouncementAsSeen (index, checked, id) {
        if (checked) {
            this.addToLocalStorageArray('oskari-announcements', id);
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
        var announcements = localStorage.getItem('oskari-announcements');
        // is the modal stored in the localstorage aka has it been set to not show again
        if (announcements && announcements.includes(id)) {
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

    /**
     * Add an item to a localStorage() array
     * @param {String} name  The localStorage() key
     * @param {String} value The localStorage() value
     */
    addToLocalStorageArray (name, value) {
        // Get the existing data
        var existing = localStorage.getItem(name);

        // If no existing data, create an array
        // Otherwise, convert the localStorage string to an array
        existing = existing ? existing.split(',') : [];

        // Add new data to localStorage Array
        existing.push(value);

        // Save back to localStorage
        localStorage.setItem(name, existing.toString());
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'getAnnouncements', 'updatePanelsModals', 'setAnnouncementAsSeen', 'onCheckboxChange', 'showModal'
]);
