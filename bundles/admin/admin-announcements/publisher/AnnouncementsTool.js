import { Messaging } from 'oskari-ui/util';
import { getDateRange, isOutdated } from '../../../framework/announcements/service/util';

Oskari.clazz.define('Oskari.admin.bundle.admin-announcements.publisher.AnnouncementsTool',
    function () {
        this.sandbox = Oskari.getSandbox();
        this.lang = Oskari.getLang();
        this.localization = Oskari.getLocalization('admin-announcements');
        this.announcements = {};
        this.allowedLocations = ['top left', 'top center', 'top right'];
        this.lefthanded = 'top right';
        this.righthanded = 'top left';
        this.index = 8;
        this.pluginName = 'AnnouncementsPlugin';
        this.data = [];
        this.selectedAnnouncements = [];
        this.groupedSiblings = true;
        this.announcementsPopup = null;

        this.templates = {
            announcements: jQuery(
                '<div class="publisher-layout-announcements" class="tool-options">' +
                    '<div>' +
                        '<input type="text" name="publisher-announcements" disabled />' +
                        '<button/>' +
                    '</div>' +
                '</div>'),
            announcementsPopup: jQuery(
                '<div>' +
                    '<div class="publisher-announcements-disclaimer">' + this.localization.tool.popup.disclaimer + '</div>' +
                    '<div class="publisher-announcements-inputs">' +
                        '<h4>' + this.localization.tool.announcementsName + '</h4><h4>' + this.localization.tool.announcementsTime + '</h4>' +
                        '<div class="ann-column ann-title"></div>' +
                        '<div class="ann-column ann-time"/></div>' +
                    '</div>' +
                '</div>'),
            inputCheckbox: jQuery('<div><input type="checkbox" name="announcement"/><label></label></div>')
        };
        this.noUI = false;
    }, {

        init: function (data) {
            const me = this;
            me.data = data;
            me.selectedAnnouncements = [];

            me.noUI = data?.configuration?.announcements?.conf?.plugin?.config?.noUI === true;

            const service = me.sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');

            if (data.configuration && data.configuration.announcements && data.configuration.announcements.conf && data.configuration.announcements.conf.plugin) {
                const myId = me.getTool().id;
                const enabled = data.configuration.announcements.conf.plugin.id === myId;
                me.setEnabled(enabled);
            }

            service.fetchAnnouncements((err, data) => {
                if (err) {
                    Messaging.error(this.localization.messages.getAdminAnnouncementsFailed);
                    return;
                }
                me.announcements = data;
                const toolPluginAnnouncementsConf = me._getToolPluginAnnouncementsConf();
                if (toolPluginAnnouncementsConf !== null) {
                    me.getPlugin().updateAnnouncements(toolPluginAnnouncementsConf.config.announcements);
                    toolPluginAnnouncementsConf.config.announcements.forEach(announcementId => {
                        const announcement = me.announcements.find(ann => ann.id === announcementId);
                        if (announcement !== undefined && me.isAnnouncementValid(announcement)) {
                            // make sure there are no duplicates
                            const alreadyAdded = me.selectedAnnouncements.some(ann => ann.id === announcement.id);
                            if (!alreadyAdded) {
                                me.selectedAnnouncements.push(announcement);
                            }
                        }
                    });
                }
                me.updateSelectedInput();
            });
        },
        _setEnabledImpl: function (enabled) {
            if (enabled && this.selectedAnnouncements) {
                this.getPlugin().updateAnnouncements(this.selectedAnnouncements);
            }
        },

        getName: function () {
            return 'Oskari.framework.announcements.publisher.AnnouncementsTool';
        },

        /**
         * Check if Announcement is inside the given timeframe
         * @method @private isAnnouncementValid
         * @param  {Object} announcement announcement
         * @return {Boolean} true if announcement is valid
         */
        isAnnouncementValid: function (announcement) {
            const announcementEnd = new Date(announcement.endDate);
            const currentDate = new Date();
            return currentDate.getTime() <= announcementEnd.getTime();
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },

        /**
        * Get tool object.
        * @method getTool
        *
        * @returns {Object} tool description
        */
        getTool: function () {
            return {
                id: 'Oskari.framework.announcements.plugin.AnnouncementsPlugin',
                title: 'AnnouncementsPlugin',
                config: {}
            };
        },

        /**
        * Get extra options.
        * @method getExtraOptions
        * @public
        *
        * @returns {Object} jQuery element
        */
        getExtraOptions: function () {
            const me = this;
            const buttonLabel = me.localization.tool.buttonLabel;
            const template = me.templates.announcements.clone();

            // Set the button handler
            template.find('button').html(buttonLabel).on('click', function () {
                if (me.announcementsPopup === null) {
                    me._openAnnouncementsDialog(jQuery(this));
                }
            });

            const labelNoUI = me.localization.publisher.noUI;

            var input = Oskari.clazz.create(
                'Oskari.userinterface.component.CheckboxInput'
            );

            input.setTitle(labelNoUI);
            input.setHandler(function (checked) {
                if (checked === 'on') {
                    me.noUI = true;
                    me.getPlugin().teardownUI();
                } else {
                    me.noUI = false;
                    me.getPlugin().redrawUI(Oskari.util.isMobile());
                }
            });

            input.setChecked(me.noUI);

            var inputEl = input.getElement();
            if (inputEl.style) {
                inputEl.style.width = 'auto';
            }

            template.append(inputEl);

            return template;
        },

        /**
         * Creates and opens the dialog from which to choose the announcements.
         *
         * @method _openAnnouncementsDialog
         */
        _openAnnouncementsDialog: function () {
            const me = this;
            const popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            const title = me.localization.tool.popup.title;
            const content = me.templates.announcementsPopup.clone();

            closeButton.setTitle(me.localization.tool.popup.close);
            closeButton.setHandler(function () {
                popup.close(true);
                me.announcementsPopup = null;
            });

            me.announcements.forEach(announcement => {
                const { title } = Oskari.getLocalized(announcement.locale);
                const dateRange = getDateRange(announcement);

                const announcementInput = me.templates.inputCheckbox.clone();
                const idPrefix = 'oskari_announcement_select_';
                announcementInput.find('input[type=checkbox]').attr({
                    id: idPrefix + announcement.id,
                    value: announcement.id
                });
                announcementInput.find('label').html(title).attr({
                    'for': idPrefix + announcement.id
                });

                if (isOutdated(announcement)) {
                    content.find('div.ann-time').append('<div>' + dateRange + '<div class="icon-warning-light"></div></div>');
                    announcementInput.find('input[type=checkbox]').prop('disabled', true);
                    content.find('div.ann-title').append(announcementInput);
                } else {
                    content.find('div.ann-time').append('<div>' + dateRange + '</div>');
                    me.selectedAnnouncements.forEach(ann => {
                        if (ann.id === announcement.id) {
                            announcementInput.find('input[type=checkbox]').prop('checked', true);
                        }
                    });
                    content.find('div.ann-title').append(announcementInput);
                }
            });

            // Announcement is selected
            content.find('input[name=announcement]').on('change', function () {
                const selectedId = parseInt(this.value);
                const announcement = me.announcements.find(item => item.id === selectedId);
                // check if announcement is already checked, if is, add/remove accordingly
                if (!this.checked) {
                    me.selectedAnnouncements = me.selectedAnnouncements.filter(function (ann) {
                        return ann.id !== announcement.id;
                    });
                } else {
                    me.selectedAnnouncements.push(announcement);
                }
                me.getPlugin().updateAnnouncements(me.selectedAnnouncements);
                me.updateSelectedInput();
            });

            popup.show(title, content, [closeButton]);
            me.announcementsPopup = popup;
        },
        // Shows user the currently selected announcement titles next to the tool (informative input/non-functional)
        updateSelectedInput: function () {
            jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(this.selectedAnnouncements.map(i => i.locale[this.lang].title).toString());
        },

        /**
         * @private @method _getToolPluginAnnouncementsConf
         * @return {Object / null} config or null if not found
         */
        _getToolPluginAnnouncementsConf: function () {
            var me = this;
            var isConfig = !!((me.data && me.data.configuration));
            var isPlugin = !!((isConfig && me.data.configuration.announcements &&
            me.data.configuration.announcements.conf && me.data.configuration.announcements.conf.plugin));
            var toolPlugin = null;
            if (isPlugin) {
                toolPlugin = me.data.configuration.announcements.conf.plugin;
            }
            return toolPlugin;
        },

        _getAnnouncementsSelection: function () {
            const me = this;
            const announcementsSelection = {};
            var pluginValues = me.getPlugin().getSelectedAnnouncements();
            if (pluginValues.announcements) {
                announcementsSelection.announcements = pluginValues.announcements;
            }
            return announcementsSelection;
        },

        /**
        * Get values.
        * @method getValues
        * @public
        *
        * @returns {Object} tool value object
        */
        getValues: function () {
            const me = this;

            if (!this.isEnabled()) {
                return null;
            }
            const pluginConfig = { id: me.getTool().id, config: me.getPlugin().getConfig() };
            const announcementsSelection = me._getAnnouncementsSelection();

            if (announcementsSelection && !jQuery.isEmptyObject(announcementsSelection)) {
                pluginConfig.config.announcements = announcementsSelection.announcements;
            }

            if (me.noUI) {
                pluginConfig.config.noUI = me.noUI;
            }

            return {
                configuration: {
                    announcements: {
                        conf: {
                            plugin: pluginConfig
                        }
                    }
                }
            };
        },

        /**
        * Stop _stopImpl.
        * @method _stopImpl
        */
        _stopImpl: function () {
            if (this.announcementsPopup) {
                this.announcementsPopup.close(true);
            }
        }
    }, {
        extend: ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        protocol: ['Oskari.mapframework.publisher.Tool']
    });
