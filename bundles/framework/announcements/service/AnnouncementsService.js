/**
 * @class Oskari.framework.announcements.service.AnnouncementsService
 *
 */
Oskari.clazz.define('Oskari.framework.announcements.service.AnnouncementsService',

    function () {
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.framework.announcements.service.AnnouncementsService',

        /**
        * @method getQName
        * @return {String} fully qualified name for service
        */
        getQName: function () {
            return this.__qname;
        },

        /** @static @property __name service name */
        __name: 'AnnouncementsService',

        /**
        * @method getName
        * @return {String} service name
        */
        getName: function () {
            return this.__name;
        },

        /**
        * @method fetchAnnouncements
        *
        * Makes an ajax call to get active announcements.
        * For admin user all announcements are returned.
        */
        fetchAnnouncements: function (handler) {
            if (typeof handler !== 'function') {
                return;
            }
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: Oskari.urls.getRoute('Announcements'),
                success: (announcements) => {
                    handler(null, announcements);
                },
                error: function (jqXHR, textStatus) {
                    handler('Error', []);
                }
            });
        },

        /**
        * @method saveAnnouncements
        *
        * Makes an ajax call to save new announcement
        */
        saveAnnouncement: function (data, handler) {
            if (typeof handler !== 'function') {
                return;
            }
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data),
                url: Oskari.urls.getRoute('Announcements'),
                success: function (pResp) {
                    handler(null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    handler('Error', []);
                }
            });
        },

        /**
        * @method updateAnnouncements
        *
        * Makes an ajax call to update announcement
        */
        updateAnnouncement: function (data, handler) {
            if (typeof handler !== 'function') {
                return;
            }
            jQuery.ajax({
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data),
                url: Oskari.urls.getRoute('Announcements'),
                success: function (pResp) {
                    handler(null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    handler('Error', []);
                }
            });
        },

        /**
        * @method deleteAnnouncements
        *
        * Makes an ajax call to delete announcement
        */
        deleteAnnouncement: function (data, handler) {
            if (typeof handler !== 'function') {
                return;
            }

            jQuery.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: Oskari.urls.getRoute('Announcements', { id: data }),
                success: function (pResp) {
                    handler(null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    handler('Error', []);
                }
            });
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        'protocol': ['Oskari.mapframework.service.Service']
    });
