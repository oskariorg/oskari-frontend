/**
 * @class Oskari.framework.bundle.announcements.AnnouncementsBundleInstance
 *
 * Main component and starting point for the announcements functionality.
 *
 * See Oskari.framework.bundle.announcements.AnnouncementsBundleInstance for bundle definition.
 */
Oskari.clazz.define('Oskari.framework.bundle.announcements.AnnouncementsBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
    }, {

        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;
            me.sandbox = Oskari.getSandbox();
            me.sandbox.register(me);

            this.announcementsService = Oskari.clazz.create('Oskari.framework.announcements.service.AnnouncementsService', me.sandbox);
            me.sandbox.registerService(this.announcementsService);

            if (me.conf && me.conf.plugin) {
                const mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule');
                const plugin = Oskari.clazz.create('Oskari.framework.announcements.plugin.AnnouncementsPlugin', me.conf.plugin.config);
                mapModule.registerPlugin(plugin);
                mapModule.startPlugin(plugin);
            }
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        stop: function () {
            this.sandbox = null;
            jQuery('div#announcements-popup').remove();
            this.started = false;
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
