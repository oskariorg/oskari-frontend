/**
 * @class Oskari.admin.admin-announcements.event.AnnouncementsChangedEvent
 *
 * Used to notify getinfo plugin that the colour scheme has changed.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.event.AnnouncementsChangedEvent',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} announcements new list of announcements
     */
    function (announcements) {
        this._announcements = announcements;
    }, {
        /** @static @property __name event name */
        __name: 'Publisher2.AnnouncementsChangedEvent',
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
         * Returns the new colour scheme
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
