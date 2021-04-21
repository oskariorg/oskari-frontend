Oskari.clazz.define('Oskari.mapframework.publisher.tool.AnnouncementsTool',
    function () {
    }, {
        index: 8,
        pluginName: 'testplugin',
        allowedLocations: [],
        allowedSiblings: [],
        data: [],
        selectedAnnouncements: [],
        annTitles: [],

        groupedSiblings: true,

        templates: {
            announcements: jQuery('<div id="publisher-layout-colours" class="tool-options">' + '<div id="publisher-layout-coloursSelector">' + '<input type="text" name="publisher-announcements" id="publisher-announcements" disabled />' + '<button id="publisher-colours"></button>' + '</div>' + '</div>'),
            announcementsPopup: jQuery('<div id="publisher-announcements-popup">' + '<div id="publisher-announcement-inputs"></div>' + '</div>'),
            inputCheckbox: jQuery('<div><input type="checkbox" /><label></label></div>'),
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
            this.fetchAnnouncements();
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
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.testplugin',
                title: 'testplugin',
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

        isAnnouncementsDialogOpen: false,

        /**
    * Get extra options.
    * @method getExtraOptions
    * @public
    *
    * @returns {Object} jQuery element
    */
        getExtraOptions: function () {
            var me = this;
            var buttonLabel = me.__instance._localization.tool.buttonLabel,

            template = me.templates.announcements.clone();

            // Set the button handler
            template.find('button').html(buttonLabel).on('click', function () {
                if (me.isAnnouncementsDialogOpen === false) {
                    me._openAnnouncementsDialog(jQuery(this));
                }
            });

            return template;
        },

        /**
     * Creates and opens the dialog from which to choose the colour scheme.
     * Also handles the creation of the sample gfi popup.
     *
     * @method _openColourDialog
     */
        _openAnnouncementsDialog: function () {
            var me = this,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                title = me.__instance._localization.tool.popup.title,
                content = me.templates.announcementsPopup.clone(),
                announcementInput,
                annName,
                i ;
                
            closeButton.setTitle(me.__instance._localization.tool.popup.close);
            closeButton.setHandler(function () {
                popup.close(true);
                me._announcementsPopup = null;
                me.isAnnouncementsDialogOpen = false;
            });
            var aLen = this.data.length ;

            //ANNOUNCEMENTSIEN MÄÄRÄ
            // Append the colour scheme inputs to the dialog.
            for (i = 0; i < aLen; ++i) {
                announcementInput = me.templates.inputCheckbox.clone();

                //TÄHÄN HAETAAN ANNOUNCEMENTS NIMET
                annName = this.data[i].title ;

                announcementInput.find('input[type=checkbox]').attr({
                    'id': this.data[i].id,
                    'name': 'announcement',
                    'value': this.data[i].title
                });
                announcementInput.find('label').html(annName).attr({
                    'for': this.data[i].title
                });
                if(this.selectedAnnouncements.includes(this.data[i])) {
                    announcementInput.find('input[type=checkbox]').prop('checked', true);
                }

                content.find('div#publisher-announcement-inputs').append(announcementInput);
            }

            // WHAT TO DO WHEN ANNOUNCEMENTS ARE SELECTED// 
            content.find('input[name=announcement]').on('change', function () {
                announcement = me._getItemByCode(jQuery(this).val(), me.data);
                currAnn = jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val();
                //check if announcement is already checked, if is, add/remove accordingly
                if (!this.checked) {
                    me.selectedAnnouncements = me.selectedAnnouncements.filter(function(ann) { 
                        return ann.title !== announcement.title 
                     });
                     me.annTitles = me.annTitles.filter(function(e) { return e !== announcement.title });
                     me._sendAnnouncementsChangedEvent(me.selectedAnnouncements);
                } else {
                    me.selectedAnnouncements.push(announcement);
                    me.annTitles.push(announcement.title)
                    me._sendAnnouncementsChangedEvent(me.selectedAnnouncements);
                }
                jQuery('div.basic_publisher').find('input[name=publisher-announcements]').val(me.annTitles.toString()).attr('data-colour-code', me.annTitles.toString());
            });

            popup.show(title, content, [closeButton]);
            this._announcementsPopup = popup;
            me.isAnnouncementsDialogOpen = true;
        },

        fetchAnnouncements: function () {
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: Oskari.urls.getRoute('Announcements'),
                success: (pResp) => {
                    this.data = pResp.data ;
                },
                error: function (jqXHR, textStatus) {
                    Messaging.error(getMessage('messages.getFailed'));
                }
            });
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
        * Sends an event to notify interested parties that the colour scheme has changed.
        *
        * @method _sendAnnouncementsChangedEvent
        * @param {Object} colourScheme the changed colour scheme
        */
           _sendAnnouncementsChangedEvent: function (announcements) {
               this._sendEvent('Publisher2.AnnouncementsChangedEvent', announcements);
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
