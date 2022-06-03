import { showEditPopup } from './view/AnnouncementsPopup';
import { Tool } from './Tool';
import { Messaging } from 'oskari-ui/util';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

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
            this.loc = Oskari.getMsg.bind(null, this.__name);
            this.popupControls = null;
            this.service = null;
        }

        _startImpl () {
            this.service = this.sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');
            this.setupAdminTooling();
        }

        showEditPopup (id) {
            if (this.popupControls) {
                this.popupCleanup();
            }
            const announcement = this.service.getAnnouncement(id);
            const onClose = () => this.popupCleanup();
            const onSubmit = (announcement) => {
                const isNew = !announcement.id;
                this.service.submitAnnouncement(announcement, err => this.notifySubmit(err, isNew));
                onClose();
            };
            const onDelete = () => {
                this.service.deleteAnnouncement(id, err => this.notifyDelete(err));
                onClose();
            };
            this.popupControls = showEditPopup(announcement, onSubmit, onDelete, onClose);
        }

        notifyDelete (error) {
            if (error) {
                Messaging.error(this.loc('messages.deleteFailed'));
            } else {
                Messaging.success(this.loc('messages.deleteSuccess'));
            }
        }

        notifySubmit (error, isNew) {
            const key = isNew ? 'save' : 'update';
            if (error) {
                Messaging.error(this.loc(`messages.${key}Failed`));
            } else {
                Messaging.success(this.loc(`messages.${key}Success`));
            }
        }

        popupCleanup () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        }

        setupAdminTooling () {
            if (!this.service) {
                return;
            }
            const editTool = new Tool('announcements-edit', EditOutlined);
            editTool.setTooltip(this.loc('tools.edit'));
            editTool.setTypes(['announcement']);
            editTool.setCallback((id) => this.showEditPopup(id));
            this.service.addTool(editTool);

            const deleteTool = new Tool('announcements-delete', null);
            deleteTool.setTooltip(this.loc('tools.delete'));
            deleteTool.setCallback((id) => this.service.deleteAnnouncement(id, err => this.notifyDelete(err)));
            deleteTool.setTypes(['announcement']);
            this.service.addTool(deleteTool);

            const addTool = new Tool('announcements-add', PlusOutlined);
            addTool.setTooltip(this.loc('tools.add'));
            addTool.setCallback(() => this.showEditPopup());
            addTool.setTypes(['footer']);
            this.service.addTool(addTool);
        }
    }
);
