/**
 * @class Oskari.framework.announcements.event.AnnouncementsChangedEvent
 *
 * Used to notify getinfo plugin that the announcements have changed.
 */
Oskari.clazz.define('Oskari.framework.announcements.event.AnnouncementsChangedEvent',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} announcements new list of announcements
     */
    function (announcements) {
        this._announcements = announcements;
    }, {
        /** @static @property __name event name */
        __name: 'Announcements.AnnouncementsChangedEvent',
        /**
         * @method getName
         * Returns event name
         * @return {String}
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getStyle
         * Returns new announcements
         * @return {Object}
         */
        getAnnouncements: function () {
            return this._announcements;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
