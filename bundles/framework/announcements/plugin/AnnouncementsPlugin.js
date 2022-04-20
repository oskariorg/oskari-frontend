/**
 * @class Oskari.framework.bundle.announcements.plugin.AnnouncementsPlugin
 * Provides selected announcements on the map
 */
Oskari.clazz.define('Oskari.framework.announcements.plugin.AnnouncementsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var me = this;
        me.sandbox = Oskari.getSandbox();
        me._loc = Oskari.getLocalization('announcements');
        me._clazz = 'Oskari.framework.announcements.plugin.AnnouncementsPlugin';
        me._defaultLocation = 'top left';
        me._config = config || {};
        me._index = 80;
        me._name = 'AnnouncementsPlugin';
        me.templates = {};
        me.annRefs = {};
        me.open = false;
        me.allAnnouncements = [];
    }, {
        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         */
        init: function () {
            var me = this;
            const service = me.sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');

            me.templates.main = jQuery(
                '<div class="mapplugin announcements">' +
                '  <div class="announcements-header">' +
                '    <div class="announcements-header-icon icon-arrow-white-right"></div>' +
                '  </div>' +
                '</div>');
            me.templates.announcementsContent = jQuery(
                '  <div class="content">' +
                '    <div class="announcements-content">' +
                '    </div>' +
                '  </div>');
            // same as in main, only used when returning from some other layout to default (publisher)
            me.templates.defaultArrow = jQuery('<div class="announcements-header-icon icon-arrow-white-right"></div>');
            me.templates.announcement = jQuery(
                '<div class="announcement">' +
                '   <div>' +
                '       <label>' +
                '           <button class="collapsible"></button>' +
                '       </label>' +
                '       <div class="announcement-content">' +
                '           <div class="announcement-description"></div>' +
                '           <h4>' + me._loc.plugin.valid + ':</h4>' +
                '           <div class="announcement-time"></div>' +
                '       </div>' +
                '   </div>' +
                '</div>`'
            );

            service.fetchAnnouncements((err, data) => {
                if (err) {
                    alert('Error loading announcements');
                    return;
                }
                me.allAnnouncements = data;
                if (me._config.announcements !== undefined) {
                    me.addAnnouncements();
                }
            });
        },

        /**
        * @method openSelection
        * Programmatically opens the plugins interface as if user had clicked it open
        */
        openSelection: function () {
            var me = this,
                div = me.getElement(),
                icon = div.find('div.announcements-header div.announcements-header-icon');
            me.open = true;
            icon.removeClass('icon-arrow-white-right');
            icon.addClass('icon-arrow-white-down');
            div.append(me.announcementsContent);
        },

        /**
        * @method closeSelection
        * Programmatically closes the plugins interface as if user had clicked it close
        */
        closeSelection: function (el) {
            var me = this;
            me.open = false;
            var element = el || me.getElement();
            if (!element) {
                return;
            }
            var icon = element.find('div.announcements-header div.announcements-header-icon');

            icon.removeClass('icon-arrow-white-down');
            icon.addClass('icon-arrow-white-right');
            if (element.find('.content')[0]) {
                element.find('.content').detach();
            }
        },

        /**
         * @private @method _createControlElement
         * Constructs/initializes the indexmap  control for the map.
         *
         * @return {jQuery} element
         */
        _createControlElement: function () {
            var me = this,
                el = me.templates.main.clone(),
                header = el.find('div.announcements-header');

            header.append(me._loc.plugin.title);
            me._bindHeader(header);
            return el;
        },

        _bindAnnButton: function (ann, content) {
            ann.on('click', function () {
                this.classList.toggle('active');
                if (content[0].style.maxHeight) {
                    content[0].style.visibility = 'hidden';
                    content[0].style.padding = null;
                    content[0].style.maxHeight = null;
                } else {
                    content[0].style.visibility = 'visible';
                    content[0].style.padding = '5px';
                    content[0].style.maxHeight = content[0].scrollHeight + 'px';
                }
            });
        },

        _bindHeader: function (header) {
            var me = this;
            header.on('click', function () {
                if (me.open) {
                    me.closeSelection();
                } else {
                    me.openSelection();
                }
            });
        },

        /**
        * @method addAnnouncements
        * Adds announcements to the list from config
        */
        addAnnouncements: function () {
            var me = this;
            const announcementsIds = me._config.announcements;

            const announcements = this.allAnnouncements.filter(ann => announcementsIds.includes(ann.id));

            if (!me.open) {
                delete me.announcementsContent;
            } else {
                me.announcementsContent.find('div.announcements-content').children().remove();
            }
            delete me.annRefs;
            me.annRefs = {};

            announcements.forEach(announcement => {
                if (me.annRefs[announcement.id]) {
                    // already added
                    return;
                }

                if (!me.announcementsContent) {
                    me.announcementsContent = me.templates.announcementsContent.clone();
                    if (me.open) {
                        jQuery('div.mapplugin.announcements').append(me.announcementsContent);
                    }
                }

                var announcementsDiv = me.announcementsContent.find('div.announcements-content'),
                    div = me.templates.announcement.clone();

                const annTime = announcement.begin_date.replace(/-/g, '/') + ' - ' + announcement.end_date.replace(/-/g, '/');

                const loc = Oskari.getLocalized(announcement.locale);
                div.find('button').append(loc.name);
                div.find('div.announcement-description').append(loc.content);
                div.find('div.announcement-time').append(annTime);
                me._bindAnnButton(div.find('button'), div.find('div.announcement-content'));

                me.annRefs[announcement.id] = div;
                announcementsDiv.append(div);
            });
            jQuery.isEmptyObject(me.annRefs) ? jQuery('div.mapplugin.announcements').hide() : jQuery('div.mapplugin.announcements').show();
        },

        /**
         * @method updateAnnouncements
         * Updates announcements to plugin config
         */
        updateAnnouncements: function (announcements) {
            var me = this;
            var annIds = announcements.map(i => i.id || i);
            if (me._config) {
                me._config.announcements = annIds;
                me.addAnnouncements();
            } else {
                me._config = {
                    announcements: annIds
                };
                me.addAnnouncements();
            }
        },

        /**
         * @method getSelectedAnnouncements
         * Returns list of the selected announcements
         * @return {Object} returning object has property announcements, containing a {String[]} json
         * representation of announcements.
         */
        getSelectedAnnouncements: function () {
            return {
                announcements: this._config.announcements
            };
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
