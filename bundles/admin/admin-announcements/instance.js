
import { AdminAnnouncementsHandler } from './service/AdminAnnouncementsHandler';

const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');
/**
 * @class Oskari.framework.bundle.admin-announcements.AdminAnnouncementsBundleInstance
 *
 * Main component and starting point for the admin-announcements functionality.
 *
 * See Oskari.framework.bundle.admin-announcements.AdminAnnouncementsBundleInstance for bundle definition.
 */
Oskari.clazz.defineES('Oskari.admin.admin-announcements.instance',
    class AdminAnnouncements extends BasicBundle {
        constructor () {
            super();
            this.__name = 'admin-announcements';
            this.handler = null;
        }

        _startImpl () {
            const annService = this.sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');
            this.handler = new AdminAnnouncementsHandler(this, annService);
            annService.registerAdminController(this.handler.getController());
        }
    }
);
