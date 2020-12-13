/**
 * @class Oskari.framework.bundle.admin-announcements.AdminAnnouncementsBundleInstance
 *
 * Main component and starting point for the admin-announcements functionality.
 *
 * See Oskari.framework.bundle.admin-announcements.AdminAnnouncementsBundleInstance for bundle definition.
 */
Oskari.clazz.define('Oskari.admin.bundle.admin-announcements.AdminAnnouncementsBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        var conf = this.getConfiguration();
        conf.name = 'admin-announcements';
        conf.flyoutClazz = 'Oskari.admin.bundle.admin-announcements.Flyout';
    }, {

        afterStart: function () {
        }

    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
