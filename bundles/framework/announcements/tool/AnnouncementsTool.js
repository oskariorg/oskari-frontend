Oskari.clazz.define('Oskari.framework.announcements.tool.AnnouncementsTool',
    function () {
    }, {
        index: 8,
        pluginName: 'AnnouncementsPlugin',
        allowedLocations: [],
        allowedSiblings: [],
        data: [],
        selectedAnnouncements: [],
        annTitles: [],
        announcements: {},

        isAnnouncementsDialogOpen: false,

        groupedSiblings: true,

        templates: {
            announcements: jQuery('<div id="publisher-layout-announcements" class="tool-options">' + '<div id="publisher-layout-announcementsSelector">' + '<input type="text" name="publisher-announcements" id="publisher-announcements" disabled />' + '<button id="publisher-announcements-button"></button>' + '</div>' + '</div>'),
            announcementsPopup: jQuery('<div id="publisher-announcements-popup">' + '<div id="publisher-announcements-inputs"></div>' + '</div>'),
            inputCheckbox: jQuery('<div><input type="checkbox" /><label></label></div>')
        },

        eventHandlers: {
            'Publisher2.ToolEnabledChangedEvent': function (event) {
                var me = this;
                var tool = event.getTool();
                if (tool.getTool().id === me.getTool().id && tool.isStarted() && this.selectedAnnouncements) {
                    me._sendAnnouncementsChangedEvent(this.selectedAnnouncements);
                }
            }
        },

        init: function (data) {
            var me = this;
            me.data = data;
            me.selectedAnnouncements = [];
            me.annTitles = [];

            if (data.configuration && data.configuration.mapfull && data.configuration.mapfull.conf && data.configuration.mapfull.conf.plugins) {
                _.each(data.configuration.mapfull.conf.plugins, function (plugin) {
                    if (me.getTool().id === plugin.id) {
                        me.setEnabled(true);
                    }
                });
            }

            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.__sandbox.registerForEventByName(me, p);
                }
            }
            const toolPluginMapfullConf = this._getToolPluginMapfullConf();
            if (toolPluginMapfullConf != null) {
                me._sendAnnouncementsChangedEvent(toolPluginMapfullConf.config.announcements);
                toolPluginMapfullConf.config.announcements.forEach(announcement => {
                    me.annTitles.push(announcement.title);
                    me.selectedAnnouncements.push(announcement);
                });
            }
            this.fetchAnnouncements();
            jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(me.annTitles.toString()).attr('announcement-name', me.annTitles.toString());
        },

        getName: function () {
            return 'Oskari.framework.announcements.tool.AnnouncementsTool';
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
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.AnnouncementsPlugin',
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
            var buttonLabel = me.__instance._localization.announcementsTool.buttonLabel,
                template = me.templates.announcements.clone();

            // Set the button handler
            template.find('button').html(buttonLabel).on('click', function () {
                if (me.isAnnouncementsDialogOpen === false) {
                    me._openAnnouncementsDialog(jQuery(this));
                }
            });
            if (me.annTitles.length > 0) {
                template.find('input[name=publisher-announcements]').val(me.annTitles.toString()).attr('announcement-name', me.annTitles.toString());
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
                title = me.__instance._localization.announcementsTool.popup.title,
                content = me.templates.announcementsPopup.clone(),
                announcementInput,
                annName,
                i;
            closeButton.setTitle(me.__instance._localization.announcementsTool.popup.close);
            closeButton.setHandler(function () {
                popup.close(true);
                me.isAnnouncementsDialogOpen = false;
            });
            var aLen = this.announcements.length;

            for (i = 0; i < aLen; ++i) {
                announcementInput = me.templates.inputCheckbox.clone();

                annName = this.announcements[i].title;

                announcementInput.find('input[type=checkbox]').attr({
                    'id': this.announcements[i].id,
                    'name': 'announcement',
                    'value': this.announcements[i].title
                });
                announcementInput.find('label').html(annName).attr({
                    'for': this.announcements[i].title
                });
                if (this.selectedAnnouncements.includes(this.announcements[i]) || me.shouldPreselectAnnouncement(this.announcements[i].id)) {
                    announcementInput.find('input[type=checkbox]').prop('checked', true);
                }

                content.find('div#publisher-announcements-inputs').append(announcementInput);
            }

            // WHAT TO DO WHEN ANNOUNCEMENTS ARE SELECTED
            content.find('input[name=announcement]').on('change', function () {
                var announcement = me._getItemByCode(jQuery(this).val(), me.announcements);
                // check if announcement is already checked, if is, add/remove accordingly
                if (!this.checked) {
                    me.selectedAnnouncements = me.selectedAnnouncements.filter(function (ann) {
                        return ann.title !== announcement.title;
                    });
                    me.annTitles = me.annTitles.filter(function (e) { return e !== announcement.title; });
                    me._sendAnnouncementsChangedEvent(me.selectedAnnouncements);
                } else {
                    me.selectedAnnouncements.push(announcement);
                    me.annTitles.push(announcement.title);
                    me._sendAnnouncementsChangedEvent(me.selectedAnnouncements);
                }
                jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(me.annTitles.toString()).attr('announcement-name', me.annTitles.toString());
            });

            popup.show(title, content, [closeButton]);
            this._announcementsPopup = popup;
            me.isAnnouncementsDialogOpen = true;
        },

        /**
         * Should preselect announcement.
         * @method @private shouldPreselectAnnouncement
         * @param  {Integer} id announcement id
         * @return {Boolean} true if announcement must be preselect, other false
         */
        shouldPreselectAnnouncement: function (id) {
            const toolPluginMapfullConf = this._getToolPluginMapfullConf();
            if (toolPluginMapfullConf) {
                var isPluginConfig = !!((toolPluginMapfullConf && toolPluginMapfullConf.config &&
                    toolPluginMapfullConf.config.announcements));

                if (isPluginConfig) {
                    for (var i = 0; i < toolPluginMapfullConf.config.announcements.length; i++) {
                        if (toolPluginMapfullConf.config.announcements[i].id == '' + id) {
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
         * @private @method _getToolPluginMapfullConf
         * Get map view cofiguration (from mapfull) for this tool
         * @return {Object / null} config or null if not found
         */
        _getToolPluginMapfullConf: function () {
            var me = this;
            var isConfig = !!((me.data && me.data.configuration));
            var isPlugins = !!((isConfig && me.data.configuration.mapfull &&
            me.data.configuration.mapfull.conf && me.data.configuration.mapfull.conf.plugins));
            var toolPlugin = null;
            if (isPlugins) {
                var plugins = me.data.configuration.mapfull.conf.plugins;
                for (var i = 0; i < plugins.length; i++) {
                    var plugin = plugins[i];
                    if (plugin.id === me.getTool().id) {
                        toolPlugin = plugin;
                        break;
                    }
                }
            }
            return toolPlugin;
        },

        fetchAnnouncements: function () {
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: Oskari.urls.getRoute('Announcements'),
                success: (pResp) => {
                    this.announcements = pResp.data;
                },
                error: function (jqXHR, textStatus) {
                }
            });
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
                var pluginConfig = { id: this.getTool().id, config: this.getPlugin().getConfig() };
                var announcementsSelection = me._getAnnouncementsSelection();

                if (announcementsSelection && !jQuery.isEmptyObject(announcementsSelection)) {
                    pluginConfig.config.announcements = announcementsSelection.announcements;
                }
                return {
                    configuration: {
                        mapfull: {
                            conf: {
                                plugins: [pluginConfig]
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
        * Sends an event to notify interested parties that the announcements have changed.
        *
        * @method _sendAnnouncementsChangedEvent
        * @param {Object} announcements the changed announcement
        */
        _sendAnnouncementsChangedEvent: function (announcements) {
            this._sendEvent('Announcements.AnnouncementsChangedEvent', announcements);
        },

        /**
         * Retrieves the item from the list which value matches the code given
         * or null if not found on the list.
         *
         * @method _getItemByCode
         * @param {String} code
         * @param {Array[Object]} list
         * @return {Object/null}
         */
        _getItemByCode: function (code, list) {
            var listLen = list.length,
                i;

            for (i = 0; i < listLen; ++i) {
                if (list[i].title === code) {
                    return list[i];
                }
            }
            return null;
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
