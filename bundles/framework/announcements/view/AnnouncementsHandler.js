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

    handleOk (index, title, content, checked) {
        if (checked) {
            localStorage.setItem(title, content);
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

    showModal (title, content) {
        if (localStorage.getItem(title) === content) {
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
