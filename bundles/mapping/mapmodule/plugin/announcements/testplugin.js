import olControlScaleLine from 'ol/control/ScaleLine';
import { closestOnCircle } from 'ol/coordinate';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin
 * Provides scalebar functionality for map
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginScaleBar
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.testplugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.testplugin';
        me._defaultLocation = 'top left';
        me._config = config || {};
        me._index = 3;
        me._name = 'testplugin';
        me._scalebar = null;
        me.templates = {};
        me.annRefs = {};
        me.open = false;
    },{
        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         *
         */
        _initImpl: function () {
            var me = this;
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
        },

        _createEventHandlers: function () {
            return {
                'Publisher2.AnnouncementsChangedEvent': function (evt) {
                    this._handleAnnouncementsChangedEvent(evt);
                }
            };
        },

        _handleAnnouncementsChangedEvent: function (evt) {

            //PÄIVITÄ ILMOITUKSET 
            if (this._config) {
                this._config.announcements = evt.getAnnouncements();
                this.addAnnouncement(this._config.announcements);
            } else {
                this._config = {
                    announcements: evt.getAnnouncements()
                };
                this.addAnnouncement(this._config.announcements);
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
               console.log(div);
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
                this.classList.toggle("active");
                if (content[0].style.maxHeight){
                    content[0].style.visibility = "hidden";
                    content[0].style.padding = null;
                    content[0].style.maxHeight = null;
                } else {
                    content[0].style.visibility = "visible";
                    content[0].style.padding = "5px";
                    content[0].style.maxHeight = content[0].scrollHeight + "px";
                } 
            });
        },
        
        _bindHeader: function (header) {
            var me = this;
            header.on('click', function () {
                if (me.open) {
                    console.log("CLOSE-");
                    me.closeSelection();
                } else {
                    console.log("OPEN");
                    me.openSelection();
                }
            });
        },

        /**
        * @method addAnnouncement
        * Adds given announcement to the list
        * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to add
        */
        addAnnouncement: function (announcements) {
            if(!this.open) {
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
                    if(me.open) {
                        jQuery("div.mapplugin.announcements").append(me.announcementsContent);
                    }
                }
     
                var announcementsDiv = me.announcementsContent.find('div.announcements-content'),
                    div = this.templates.announcement.clone();
                div.find('button').append(announcement.title);
                div.find('div.announcement-content').append(announcement.content);
                me._bindAnnButton(div.find('button'),div.find('div.announcement-content'));
     
                //tähän asti done-ish
                this.annRefs[announcement.id] = div;
                announcementsDiv.append(div);
            });
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
