import React from 'react';
import { showEditPopup } from './view/AnnouncementsPopup';
import { Messaging } from 'oskari-ui/util';
import { DeleteButton } from 'oskari-ui/components/buttons';
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
        // TODO:
        // REMOVE Flyout, handler
        // clean loc (tile, flyout)

        // admin service for delete, save/edit??
        // or callback notify

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
            const editTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            editTool.setName('announcements-edit');
            editTool.setIconComponent(<EditOutlined/>);
            editTool.setTooltip(this.loc('tools.edit'));
            editTool.setCallback((id) => this.showEditPopup(id));
            editTool.setTypes(['announcement']); // collapse
            this.service.addTool(editTool);

            const deleteTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            const onDelete = () => this.service.deleteAnnouncement('id', err => this.notifyDelete(err));
            deleteTool.setName('announcements-delete');
            deleteTool.setIconComponent(<DeleteButton icon onConfirm={(test) => console.log(test)}/>);
            deleteTool.setTooltip(this.loc('tools.delete'));
            deleteTool.setCallback((id) => this.showDeletePopup(id));
            deleteTool.setTypes(['announcement']); // collapse
            this.service.addTool(deleteTool);

            const addTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            addTool.setName('announcements-add');
            addTool.setIconComponent(<PlusOutlined/>);
            addTool.setTooltip(this.loc('tools.add'));
            addTool.setCallback(() => this.showEditPopup());
            addTool.setTypes(['footer']);
            this.service.addTool(addTool);
        }
    }
);
