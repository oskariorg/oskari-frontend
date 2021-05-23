/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.AnnouncementsPlugin
 * Provides selected announcements on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.AnnouncementsPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.AnnouncementsPlugin';
        me._defaultLocation = 'top left';
        me._config = config || {};
        me._index = 3;
        me._name = 'AnnouncementsPlugin';
        me.templates = {};
        me.annRefs = {};
        me.open = false;
    }, {
        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         */
        _initImpl: function () {
            var me = this;
            Oskari.on('app.start', function (details) {
                const rpcService = Oskari.getSandbox().getService('Oskari.mapframework.bundle.rpc.service.RpcService');
                if (!rpcService) {
                    return;
                }
                rpcService.addFunction('getAnnouncements', function () {
                    return new Promise((resolve) => {
                        me._getAnnouncements(announcements => resolve(announcements));
                    });
                });
            });

            me._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage(), true).plugin.AnnouncementsPlugin;
            me.templates.main = jQuery(
                '<div class="mapplugin announcements">' +
                '  <div class="header">' +
                '    <div class="header-icon icon-arrow-white-right"></div>' +
                '  </div>' +
                '</div>');
            me.templates.announcementsContent = jQuery(
                '  <div class="content">' +
                '    <div class="announcements-content">' +
                '    </div>' +
                '  </div>');
            // same as in main, only used when returning from some other layout to default (publisher)
            me.templates.defaultArrow = jQuery('<div class="header-icon icon-arrow-white-right"></div>');
            me.templates.announcement = jQuery(
                `<div class="announcement">
                    <div>
                        <label>
                            <button class="collapsible"></button>
                        </label>
                        <div class="announcement-content">
                        </div>
                    </div>
                </div>`
            );

            me.templates.contentHeader = jQuery(
                '<div class="content-header">' +
                '  <div class="content-header-title"></div>' +
                '  <div class="content-close icon-close-white"></div>' +
                '</div>'
            );
            if (this._config.announcements) {
                this.addAnnouncements();
            }
        },

        _getAnnouncements: function (callback) {
            if (typeof callback !== 'function') {
                return;
            }
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: Oskari.urls.getRoute('Announcements'),
                success: (pResp) => {
                    callback(pResp.data);
                },
                error: function () {
                    callback([{ error: this.locale.announcementsError }]);
                }
            });
        },

        _createEventHandlers: function () {
            return {
                'Announcements.AnnouncementsChangedEvent': function (evt) {
                    this._handleAnnouncementsChangedEvent(evt);
                }
            };
        },

        _handleAnnouncementsChangedEvent: function (evt) {
            if (this._config) {
                this._config.announcements = evt.getAnnouncements();
                this.addAnnouncements();
            } else {
                this._config = {
                    announcements: evt.getAnnouncements()
                };
                this.addAnnouncements();
            }
        },

        /**
        * @method openSelection
        * Programmatically opens the plugins interface as if user had clicked it open
        */
        openSelection: function () {
            var me = this,
                div = this.getElement(),
                icon = div.find('div.header div.header-icon');
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
            this.open = false;
            var element = el || this.getElement();
            if (!element) {
                return;
            }
            var icon = element.find('div.header div.header-icon');

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
                header = el.find('div.header');

            header.append(this._loc.title);
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
            var announcements = this._config.announcements;
            if (!this.open) {
                delete this.announcementsContent;
            } else {
                jQuery('div.announcements-content').children().remove();
            }
            delete this.annRefs;
            this.annRefs = {};

            announcements.forEach(announcement => {
                if (this.annRefs[announcement.id]) {
                    // already added
                    return;
                }

                var me = this;

                if (!me.announcementsContent) {
                    me.announcementsContent = me.templates.announcementsContent.clone();
                    if (me.open) {
                        jQuery('div.mapplugin.announcements').append(me.announcementsContent);
                    }
                }

                var announcementsDiv = me.announcementsContent.find('div.announcements-content'),
                    div = this.templates.announcement.clone();

                div.find('button').append(announcement.title);
                div.find('div.announcement-content').append(announcement.content);
                me._bindAnnButton(div.find('button'), div.find('div.announcement-content'));

                this.annRefs[announcement.id] = div;
                announcementsDiv.append(div);
            });
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
