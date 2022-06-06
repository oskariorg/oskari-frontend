import { controllerMixin, Messaging } from 'oskari-ui/util';
import { showEditPopup } from '../view/AnnouncementsPopup';

class Handler {
    constructor (instance, service) {
        this.instance = instance;
        this.service = service;
        this.loc = Oskari.getMsg.bind(null, instance.getName());
        this.popupControls = null;
    }

    getName () {
        return 'AdminAnnouncementsHandler';
    }

    fetchAnnouncements () {
        this.service.fetchAnnouncements(null, true);
    }

    getAnnouncement (id) {
        return this.service.getAnnouncement(id);
    }

    showEditPopup (id) {
        if (this.popupControls) {
            this.popupCleanup();
        }
        const announcement = this.getAnnouncement(id);
        const onClose = () => this.popupCleanup();
        const onSubmit = (announcement) => {
            if (announcement.id) {
                this.updateAnnouncement(announcement);
            } else {
                this.saveAnnouncement(announcement);
            }
            onClose();
        };
        const onDelete = () => {
            this.deleteAnnouncement(id);
            onClose();
        };
        this.popupControls = showEditPopup(announcement, onSubmit, onDelete, onClose);
    }

    popupCleanup () {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.popupControls = null;
    }

    /**
    * @method saveAnnouncements
    *
    * Makes an ajax call to save new announcement
    */
    saveAnnouncement (data) {
        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            url: Oskari.urls.getRoute('Announcements'),
            success: () => {
                this.fetchAnnouncements();
                Messaging.success(this.loc('messages.saveSuccess'));
            },
            error: () => Messaging.error(this.loc('messages.saveFailed'))
        });
    }

    /**
    * @method updateAnnouncements
    *
    * Makes an ajax call to update announcement
    */
    updateAnnouncement (data) {
        jQuery.ajax({
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            url: Oskari.urls.getRoute('Announcements'),
            success: () => {
                this.fetchAnnouncements();
                Messaging.success(this.loc('messages.updateSuccess'));
            },
            error: () => Messaging.error(this.loc('messages.updateFailed'))
        });
    }

    /**
    * @method deleteAnnouncements
    *
    * Makes an ajax call to delete announcement
    */
    deleteAnnouncement (id) {
        jQuery.ajax({
            type: 'DELETE',
            dataType: 'json',
            url: Oskari.urls.getRoute('Announcements', { id }),
            success: () => {
                this.fetchAnnouncements();
                Messaging.success(this.loc('messages.deleteSuccess'));
            },
            error: () => Messaging.error(this.loc('messages.deleteFailed'))
        });
    }
}
export const AdminAnnouncementsHandler = controllerMixin(Handler, [
    'showEditPopup', 'deleteAnnouncement'
]);
