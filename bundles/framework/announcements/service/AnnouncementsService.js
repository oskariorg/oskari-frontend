/**
 * @class Oskari.framework.bundle.announcements.AnnouncementsService
 */
(function (Oskari) {
    Oskari.clazz.define('Oskari.framework.bundle.announcements.AnnouncementsService',

        /**
         * @method create called automatically on construction
         * @static
         */
        function (sandbox, locale) {
            this.sandbox = sandbox;
            this.locale = locale;

            // attach on, off, trigger functions
            Oskari.makeObservable(this);
            this.cache = {};
        }, {
            __name: 'Announcements.AnnouncementsService',
            __qname: 'Oskari.framework.bundle.announcements.AnnouncementsService',

            /*******************************************************************************************************************************
            /* PUBLIC METHODS
            *******************************************************************************************************************************/
            // TODO: Create proper error logging/messages for ajax calls
            getQName: function () {
                return this.__qname;
            },
            getName: function () {
                return this.__name;
            },
            getSandbox: function () {
                return this.sandbox;
            },
            getAnnouncements: function (handler) {
                if (typeof handler !== 'function') {
                    return;
                }

                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: Oskari.urls.getRoute('GetAnnouncements'),
                    success: function (pResp) {
                        handler(null, pResp);
                    },
                    error: function (jqXHR, textStatus) {
                        handler('Error', []);
                    }
                });
            },
            getAdminAnnouncements: function (handler) {
                if (typeof handler !== 'function') {
                    return;
                }

                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: Oskari.urls.getRoute('GetAdminAnnouncements'),
                    success: function (pResp) {
                        handler(null, pResp);
                    },
                    error: function (jqXHR, textStatus) {
                        handler('Error', []);
                    }
                });
            },
            saveAnnouncement: function (data, handler) {
                if (typeof handler !== 'function') {
                    return;
                }
                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        params: JSON.stringify(data)
                    },
                    url: Oskari.urls.getRoute('SaveAnnouncement'),
                    success: function (pResp) {
                        handler(null, pResp);
                    },
                    error: function (jqXHR, textStatus) {
                        handler('Error', []);
                    }
                });
            },
            updateAnnouncement: function (data, handler) {
                if (typeof handler !== 'function') {
                    return;
                }
                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        params: JSON.stringify(data)
                    },
                    url: Oskari.urls.getRoute('UpdateAnnouncement'),
                    success: function (pResp) {
                        handler(null, pResp);
                    },
                    error: function (jqXHR, textStatus) {
                        handler('Error', []);
                    }
                });
            },
            deleteAnnouncement: function (data, handler) {
                if (typeof handler !== 'function') {
                    return;
                }

                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        params: JSON.stringify(data)
                    },
                    url: Oskari.urls.getRoute('DeleteAnnouncement'),
                    success: function (pResp) {
                        handler(null, pResp);
                    },
                    error: function (jqXHR, textStatus) {
                        handler('Error', []);
                    }
                });
            }
        }, {
            'protocol': ['Oskari.mapframework.service.Service']
        });
}(Oskari));
