import { Messaging } from 'oskari-ui/util';
import { BUNDLE_KEY, LOCAL_STORAGE_KEY, LOCAL_STORAGE_SEPARATOR } from '../constants';
/**
 * @class Oskari.framework.announcements.service.AnnouncementsService
 *
 */
Oskari.clazz.define('Oskari.framework.announcements.service.AnnouncementsService',

    function () {
        this.tools = [];
        this.announcements = null;
        this.adminController = null;
        Oskari.makeObservable(this);
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
        registerAdminController: function (controller) {
            this.adminController = controller;
            this.trigger('controller');
        },
        getAdminController: function () {
            return this.adminController;
        },
        getAnnouncement: function (id) {
            return this.getAnnouncements().find(ann => ann.id === id);
        },
        getAnnouncements: function () {
            return this.announcements || [];
        },
        storeAnnouncements: function (announcements) {
            this.announcements = announcements;
            this.trigger('fetch');
        },
        getIdsFromLocalStorage: function () {
            // Get the existing ids or empty array
            const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
            return existing ? existing.split(LOCAL_STORAGE_SEPARATOR).map(id => parseInt(id)) : [];
        },
        addToLocalStorage: function (id) {
            const existing = this.getIdsFromLocalStorage();
            if (existing.includes(id)) {
                return;
            }
            existing.push(id);
            this._storeIdsToLocalStorage(existing);
        },
        removeFromLocalStorage: function (id) {
            const existing = this.getIdsFromLocalStorage();
            const updated = existing.filter(item => item !== id);
            this._storeIdsToLocalStorage(updated);
        },
        _storeIdsToLocalStorage: function (ids) {
            // Save ids to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, ids.join(LOCAL_STORAGE_SEPARATOR));
        },
        /**
        * @method fetchAnnouncements
        *
        * Makes an ajax call to get active announcements.
        * For admin user all announcements are returned.
        */
        fetchAnnouncements: function (handler, force) {
            if (typeof handler !== 'function') {
                handler = error => this.fetchErrorNotifier(error);
            }
            if (this.announcements && !force) {
                handler(null, this.announcements);
            }
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: Oskari.urls.getRoute('Announcements'),
                success: (announcements) => {
                    this.storeAnnouncements(announcements);
                    handler(null, announcements);
                },
                error: function (jqXHR, textStatus) {
                    handler('Error', []);
                }
            });
        },
        fetchErrorNotifier: function (error) {
            if (error) {
                Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'messages.getFailed'));
            }
        }
    }, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
        protocol: ['Oskari.mapframework.service.Service']
    });
