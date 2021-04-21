Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.AnnouncementsPlugin',
    function (config) {
        var me = this;
        me._config = config || {};
        me._clazz = 'Oskari.mapframework.bundle.mapmodule.plugin.AnnouncementsPlugin';
        me._defaultLocation = 'top right';
        me._toolOpen = false;
        me._index = 80;
        me.templates = {};
        me._log = Oskari.log('Oskari.mapframework.bundle.mapmodule.plugin.AnnouncementsPlugin');
    }, {
        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         *
         */
        _initImpl: function () {
            console.log("INITIMPL");
            var me = this;
            me._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage(), true).plugin.AnnouncementsPlugin;
            console.log(me._loc);
            me.templates.main = jQuery(
                '<div class="mapplugin announcements">' +
                '  <div class="header">' +
                '    <div class="header-icon icon-arrow-white-right"></div>' +
                '  </div>' +
                '</div>');
                
            console.log("INITIMPL");
            me.templates.announcementsContent = jQuery(
                '  <div class="content">' +
                '    <div class="announcements-content">' +
                '        <div class="selected-announcements"></div>' +
                '    </div>' +
                '  </div>');
            // same as in main, only used when returning from some other layout to default (publisher)
            console.log("INITIMPL");
            me.templates.defaultArrow = jQuery('<div class="header-icon icon-arrow-white-right"></div>');
            me.templates.announcement = jQuery(
                `<div class="announcement">
                    <div><label><span></span></label></div>
                </div>`
            );
            console.log("INITIMPL");

            me.templates.contentHeader = jQuery(
                '<div class="content-header">' +
                '  <div class="content-header-title"></div>' +
                '  <div class="content-close icon-close-white"></div>' +
                '</div>'
            );
            console.log("INITIMPL2");
            //this.addAnnouncements();
        },
        //DONE
        /*
        _toggleToolState: function () {
            var el = this.getElement();
            if (this.popup && this.popup.isVisible()) {
                if (el) {
                    el.removeClass('active');
                }
                this.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', [null, 'mobileToolbar-mobile-toolbar']);
                this.popup.close(true);
            } else {
                if (el) {
                    el.addClass('active');
                }
                this.openSelection(true);
            }
        },*/
        _createUI: function () {
            console.log("test");
            this._element = this._createControlElement();
            this.handleEvents();
            this.addToPluginContainer(this._element);
            console.log("test2");
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function () {
            var conf = this._config;
            var isMobile = Oskari.util.isMobile();
            if (this.getElement()) {
                this.teardownUI(true);
            }
            if (isMobile) {
                var mobileDefs = this.getMobileDefs();
                this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                this._createMobileUI();
            } else {
                this._createUI();
            }
        },
        teardownUI: function () {
        // detach old element from screen
            if (!this.getElement()) {
                return;
            }
            var mobileDefs = this.getMobileDefs();
            this.getElement().detach();
            this.removeFromPluginContainer(this.getElement());
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        hasUi: function () {
            return !this._config.noUI;
        },
        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function () {
            return this._element;
        },
        stopPlugin: function () {
            this.teardownUI();
        },
        
        _createEventHandlers: function () {
            return {
                'Publisher2.event.AnnouncementsChangedEvent': function (evt) {
                    this._handleAnnouncementsChangedEvent(evt);
                }
            };
        },

        _handleAnnouncementsChangedEvent: function (evt) {

            //PÄIVITÄ ILMOITUKSET 
            if (this._config) {
                console.log(evt.getAnnouncements());
                this._config.announcements = evt.getAnnouncements();
                this.addAnnouncement(this._config.announcements);
            } else {
                this._config = {
                    announcements: evt.getAnnouncements()
                };
                this.addANnouncement(this._config.announcements);
            }
        },
        
        /**
        * @method addAnnouncement
        * Adds given announcement to the list
        * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to add
        */
        addAnnouncement: function (announcement, el) {
            console.log("TULI");
           if (this.layerRefs[layer.getId()]) {
               // already added
               return;
           }

           var me = this;

           if (!me.announcementsContent) {
               me.announcementsContent = me.templates.announcementsContent.clone();
           }

           var announcementsDiv = me.announcementsContent.find('div.announcements-content'),
               div = this.templates.announcement.clone();
               console.log("HEP");
               console.log(announcement);

           div.find('span').append(announcement.getName());

           input.attr('value', announcement.getId());

           //tähän asti done-ish

           div.find('span').before(input);
           this.layerRefs[layer.getId()] = div;
           announcementsDiv.append(div);

           if (announcementsDiv.find('.layer').length > 0) {
               var pluginLoc = me.getMapModule().getLocalization('plugin'),
                   myLoc = pluginLoc[me._name],
                   header = me.templates.layerHeader.clone();

               header.append(myLoc.chooseOtherLayers);
               announcementsDiv.parent().find('.layerHeader').remove();
               announcementsDiv.before(header);
           }

           me._setupStyleChange(layer, div);

           me.sortLayers();
       },

       /**
        * @private @method  _createControlElement
        * Creates the whole ui from scratch and writes the plugin in to the UI.
        * Tries to find the plugins placeholder with 'div.mapplugins.left' selector.
        * If it exists, checks if there are other bundles and writes itself as the first one.
        * If the placeholder doesn't exist the plugin is written to the mapmodules div element.
        *
        *
        */
       _createControlElement: function () {
           var me = this,
               el = me.templates.main.clone(),
               header = el.find('div.header');

           header.append(this._loc.title);

           me._bindHeader(header);

           if (!me.layerContent) {
               me.layerContent = me.templates.announcementsContent.clone();
               //me.setupLayers(undefined, el);
           }

           return el;
       },
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