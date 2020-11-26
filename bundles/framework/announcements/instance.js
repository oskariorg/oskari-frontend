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

        afterStart: function () {
        }

    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
