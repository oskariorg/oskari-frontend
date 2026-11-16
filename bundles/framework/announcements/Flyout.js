import { AnnouncementsView } from './view/AnnouncementsView';
import { getReactRoot } from 'oskari-ui/components/window';


/**
 * @class Oskari.framework.bundle.announcements.Flyout
 *
 * Renders the announcements flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.announcements.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.announcements.AnnouncementsBundleInstance} instance
     *    reference to component that created the flyout
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.announcementsHandler = null;
        this.container = null;
        this.announcementsView = new AnnouncementsView(this.instance);
    }, {
        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, flyout) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('announcements')) {
                jQuery(this.container).addClass('announcements');
            }
            if (!flyout.hasClass('announcements')) {
                flyout.addClass('announcements');
            }
        },

        /**
        * Cretes AnnouncementsHandler with given service
        * @method createAnnouncementsHandler
        */
        initHandler: function (handler) {
            this.announcementsHandler = handler;
            this.announcementsHandler.addStateListener((state) => this.render(state));
        },
        /**
         * @method render
         * Renders React content
         */
        render: function (state) {
            if (!this.container) {
                return;
            }
            getReactRoot(this.container).render(this.announcementsView.getContent(state));
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultFlyout']
    });
