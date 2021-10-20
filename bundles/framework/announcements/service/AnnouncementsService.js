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
    * Makes an ajax call to get announcements
    */
    fetchAnnouncements: function () {
        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            url: Oskari.urls.getRoute('Announcements'),
            success: (pResp) => {
                return pResp.data;
            },
            error: function (jqXHR, textStatus) {
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
