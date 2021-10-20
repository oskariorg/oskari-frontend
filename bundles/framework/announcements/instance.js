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
        var conf = this.getConfiguration();
        conf.name = 'announcements';
        conf.flyoutClazz = 'Oskari.framework.bundle.announcements.Flyout';
    }, {

        start: function () {
            var announcementsServiceName =
                'Oskari.framework.announcements.service.AnnouncementsService';
            me.searchService = Oskari.clazz.create(announcementsServiceName);
        }

    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
