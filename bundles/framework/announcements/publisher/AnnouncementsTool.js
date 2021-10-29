Oskari.clazz.define('Oskari.mapframework.publisher.tool.AnnouncementsTool',
    function () {
        this.sandbox = Oskari.getSandbox();
        this.localization = Oskari.getLocalization("announcements");
        this.announcements = {};
        this.allowedLocations = ['top left', 'top center', 'top right'];
        this.lefthanded = 'top right';
        this.righthanded = 'top left';
        this.index = 8;
        this.pluginName = 'AnnouncementsPlugin';
        this.data = [];
        this.selectedAnnouncements = [];
        this.annTitles = [];
        this.isAnnouncementsDialogOpen = false;
        this.groupedSiblings = true;

        this.templates = {
            announcements: jQuery('<div id="publisher-layout-announcements" class="tool-options">' + '<div>' + '<input type="text" name="publisher-announcements" disabled />' + '<button></button>' + '</div>' + '</div>'),
            announcementsPopup: jQuery('<div>' + '<div id="publisher-announcements-inputs"></div>' + '</div>'),
            inputCheckbox: jQuery('<div><input type="checkbox" /><label></label></div>')
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
            var me = this;
            me.data = data;
            me.selectedAnnouncements = [];
            me.annTitles = [];

            const service = me.sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');

            if (data.configuration && data.configuration.announcements && data.configuration.announcements.conf && data.configuration.announcements.conf.plugin) {
                const myId = me.getTool().id;
                const enabled = data.configuration.announcements.conf.plugin.id === myId ? true : false ;
                me.setEnabled(enabled);

            }
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.__sandbox.registerForEventByName(me, p);
                }
            }

            service.fetchAnnouncements((announcements) => {
                me.announcements = announcements;
                const toolPluginAnnouncementsConf = me._getToolPluginAnnouncementsConf();
                if (toolPluginAnnouncementsConf !== null) {
                    me.getPlugin().updateAnnouncements(toolPluginAnnouncementsConf.config.announcements);
                    toolPluginAnnouncementsConf.config.announcements.forEach(announcement => {
                        const filteredAnnouncement = me.announcements.filter(ann => ann.id === announcement )
                        me.annTitles.push(filteredAnnouncement[0].title);
                        me.selectedAnnouncements.push(filteredAnnouncement[0]);
                    });
                }
                jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(me.annTitles.toString());
            });
        },

        getName: function () {
            return 'Oskari.mapframework.publisher.tool.AnnouncementsTool';
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
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
                id: 'Oskari.framework.bundle.announcements.plugin.AnnouncementsPlugin',
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
            var me = this;
            var buttonLabel = me.localization.tool.buttonLabel,
                template = me.templates.announcements.clone();

            // Set the button handler
            template.find('button').html(buttonLabel).on('click', function () {
                if (me.isAnnouncementsDialogOpen === false) {
                    me._openAnnouncementsDialog(jQuery(this));
                }
            });
            if (me.annTitles.length > 0) {
                template.find('input[name=publisher-announcements]').val(me.annTitles.toString());
            }
            return template;
        },

        /**
         * Creates and opens the dialog from which to choose the announcements.
         *
         * @method _openAnnouncementsDialog
         */
        _openAnnouncementsDialog: function () {
            var me = this,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                title = me.localization.tool.popup.title,
                content = me.templates.announcementsPopup.clone(),
                announcementInput,
                annName,
                i;

            closeButton.setTitle(me.localization.tool.popup.close);
            closeButton.setHandler(function () {
                popup.close(true);
                me.isAnnouncementsDialogOpen = false;
            });
            var aLen = me.announcements.length;

            for (i = 0; i < aLen; ++i) {
                announcementInput = me.templates.inputCheckbox.clone();

                annName = me.announcements[i].title;

                announcementInput.find('input[type=checkbox]').attr({
                    'id': me.announcements[i].id,
                    'name': 'announcement',
                    'value': me.announcements[i].title
                });
                announcementInput.find('label').html(annName).attr({
                    'for': me.announcements[i].title
                });
                if (me.shouldPreselectAnnouncement(me.announcements[i])) {
                    announcementInput.find('input[type=checkbox]').prop('checked', true);
                }

                content.find('div#publisher-announcements-inputs').append(announcementInput);
            }

            // WHAT TO DO WHEN ANNOUNCEMENTS ARE SELECTED
            content.find('input[name=announcement]').on('change', function () {
                var announcement = me.announcements.find(item => item.title === jQuery(this).val());
                // check if announcement is already checked, if is, add/remove accordingly
                if (!this.checked) {
                    me.selectedAnnouncements = me.selectedAnnouncements.filter(function (ann) {
                        return ann.title !== announcement.title;
                    });
                    me.annTitles = me.annTitles.filter(function (e) { return e !== announcement.title; });

                    me.getPlugin().updateAnnouncements(me.selectedAnnouncements );
                } else {
                    me.selectedAnnouncements.push(announcement);
                    me.annTitles.push(announcement.title);

                    me.getPlugin().updateAnnouncements(me.selectedAnnouncements );
                }
                jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(me.annTitles.toString());
            });

            popup.show(title, content, [closeButton]);
            me._announcementsPopup = popup;
            me.isAnnouncementsDialogOpen = true;
        },

        /**
         * Should preselect announcement.
         * @method @private shouldPreselectAnnouncement
         * @param  {Integer} id announcement id
         * @return {Boolean} true if announcement must be preselect, other false
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
            var me = this,
                announcementsSelection = {};
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
            var me = this;

            if (me.state.enabled) {
                var pluginConfig = { id: me.getTool().id, config: me.getPlugin().getConfig() };
                var announcementsSelection = me._getAnnouncementsSelection();
                console.log(announcementsSelection);

                if (announcementsSelection && !jQuery.isEmptyObject(announcementsSelection)) {
                    pluginConfig.config.announcements = announcementsSelection.announcements;
                    console.log(pluginConfig.config.announcements);
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
            var eventBuilder = Oskari.eventBuilder(eventName),
                evt;

            if (eventBuilder) {
                evt = eventBuilder(eventData);
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
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
