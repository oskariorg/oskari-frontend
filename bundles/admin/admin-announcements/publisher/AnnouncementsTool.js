Oskari.clazz.define('Oskari.admin.bundle.admin-announcements.publisher.AnnouncementsTool',
    function () {
        this.sandbox = Oskari.getSandbox();
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
                    '<div class="publisher-announcements-inputs">' +
                        '<h4>' + this.localization.tool.announcementsName + '</h4><h4>' + this.localization.tool.announcementsTime + '</h4>' +
                        '<div class="ann-column ann-title"></div>' +
                        '<div class="ann-column ann-time"/></div>' +
                    '</div>' +
                '</div>'),
            inputCheckbox: jQuery('<div><input type="checkbox" name="announcement"/><label></label></div>')
        };

        this.eventHandlers = {
            'Publisher2.ToolEnabledChangedEvent': function (event) {
                var me = this;
                var tool = event.getTool();
                if (tool.getTool().id === me.getTool().id && tool.isStarted() && this.selectedAnnouncements) {
                    this.getPlugin().updateAnnouncements(this.selectedAnnouncements);
                }
            }
        };
    }, {

        init: function (data) {
            const me = this;
            me.data = data;
            me.selectedAnnouncements = [];

            const service = me.sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');

            if (data.configuration && data.configuration.announcements && data.configuration.announcements.conf && data.configuration.announcements.conf.plugin) {
                const myId = me.getTool().id;
                const enabled = data.configuration.announcements.conf.plugin.id === myId;
                me.setEnabled(enabled);
            }

            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.__sandbox.registerForEventByName(me, p);
                }
            }

            service.fetchAdminAnnouncements((err, data) => {
                me.announcements = data;
                const toolPluginAnnouncementsConf = me._getToolPluginAnnouncementsConf();
                if (toolPluginAnnouncementsConf !== null) {
                    me.getPlugin().updateAnnouncements(toolPluginAnnouncementsConf.config.announcements);
                    toolPluginAnnouncementsConf.config.announcements.forEach(announcement => {
                        const filteredAnnouncement = me.announcements.filter(ann => ann.id === announcement);
                        if (me.isAnnouncementValid(filteredAnnouncement[0])) {
                            me.selectedAnnouncements.push(filteredAnnouncement[0]);
                        }
                    });
                }

                // Shows user the currently selected announcement titles next to the tool (informative input/non-functional)
                jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(me.selectedAnnouncements.map(i => i.title).toString());
            });
        },

        getName: function () {
            return 'Oskari.framework.announcements.publisher.AnnouncementsTool';
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
        * Is the tool toggled on by default.
        * @method isDefaultTool
        * @public
        *
        * @returns {Boolean} is the tool toggled on by default.
        */
        isDefaultTool: function () {
            return false;
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
                const announcementInput = me.templates.inputCheckbox.clone();
                const annName = announcement.title;
                const annTime = announcement.begin_date.replace(/-/g, '/') + ' - ' + announcement.end_date.replace(/-/g, '/');

                const idPrefix = 'oskari_announcement_select_';
                announcementInput.find('input[type=checkbox]').attr({
                    'id': idPrefix + announcement.id,
                    'value': announcement.title
                });
                announcementInput.find('label').html(annName).attr({
                    'for': idPrefix + announcement.id
                });

                if (me.isAnnouncementValid(announcement)) {
                    content.find('div.ann-time').append('<div>' + annTime + '</div>');
                    if (me.shouldPreselectAnnouncement(announcement)) {
                        announcementInput.find('input[type=checkbox]').prop('checked', true);
                    }
                    content.find('div.ann-title').append(announcementInput);
                } else {
                    content.find('div.ann-time').append('<div>' + annTime + '<div class="icon-warning-light"></div></div>');
                    announcementInput.find('input[type=checkbox]').prop('disabled', true);
                    content.find('div.ann-title').append(announcementInput);
                }
            });

            // Announcement is selected
            content.find('input[name=announcement]').on('change', function () {
                var announcement = me.announcements.find(item => item.title === jQuery(this).val());
                // check if announcement is already checked, if is, add/remove accordingly
                if (!this.checked) {
                    me.selectedAnnouncements = me.selectedAnnouncements.filter(function (ann) {
                        return ann.title !== announcement.title;
                    });
                } else {
                    me.selectedAnnouncements.push(announcement);
                }
                me.getPlugin().updateAnnouncements(me.selectedAnnouncements);

                // Shows user the currently selected announcement titles next to the tool (informative input/non-functional)
                jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(me.selectedAnnouncements.map(i => i.title).toString());
            });

            popup.show(title, content, [closeButton]);
            me.announcementsPopup = popup;
        },

        /**
         * Check if Announcement is inside the given timeframe
         * @method @private isAnnouncementValid
         * @param  {Object} announcement announcement
         * @return {Boolean} true if announcement is valid
         */
        isAnnouncementValid: function (announcement) {
            const announcementEnd = new Date(announcement.end_date);
            const currentDate = new Date();
            return currentDate.getTime() <= announcementEnd.getTime() ? true : false;
        },

        /**
         * Should preselect announcement for tool popup.
         * @method @private shouldPreselectAnnouncement
         * @param  {Integer} id announcement id
         * @return {Boolean} true if announcement must be preselect
         */
        shouldPreselectAnnouncement: function (announcement) {
            const toolPluginAnnouncementsConf = this._getToolPluginAnnouncementsConf();
            if (toolPluginAnnouncementsConf) {
                var isPluginConfig = !!((toolPluginAnnouncementsConf && toolPluginAnnouncementsConf.config &&
                    toolPluginAnnouncementsConf.config.announcements));

                if (isPluginConfig) {
                    for (var i = 0; i < toolPluginAnnouncementsConf.config.announcements.length; i++) {
                        if (toolPluginAnnouncementsConf.config.announcements[i] === announcement.id) {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
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

            if (me.state.enabled) {
                const pluginConfig = { id: me.getTool().id, config: me.getPlugin().getConfig() };
                const announcementsSelection = me._getAnnouncementsSelection();

                if (announcementsSelection && !jQuery.isEmptyObject(announcementsSelection)) {
                    pluginConfig.config.announcements = announcementsSelection.announcements;
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
            } else {
                return null;
            }
        },

        /**
         * "Sends" an event, that is, notifies other components of something.
         *
         * @method _sendEvent
         * @param {String} eventName the name of the event
         * @param {Whatever} eventData the data we want to send with the event
         */
        _sendEvent: function (eventName, eventData) {
            const eventBuilder = Oskari.eventBuilder(eventName);

            if (eventBuilder) {
                const evt = eventBuilder(eventData);
                this.__sandbox.notifyAll(evt);
            }
        },

        /**
        * Stop tool.
        * @method stop
        * @public
        */
        stop: function () {
            var me = this;
            if (me.announcementsPopup) {
                me.announcementsPopup.close(true);
            }
            if (me.__plugin) {
                if (me.__sandbox && me.__plugin.getSandbox()) {
                    me.__plugin.stopPlugin(me.__sandbox);
                }
                me.__mapmodule.unregisterPlugin(me.__plugin);
            }
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.__sandbox.unregisterFromEventByName(me, p);
                }
            }
        }
    }, {
        extend: ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        protocol: ['Oskari.mapframework.publisher.Tool']
    });
