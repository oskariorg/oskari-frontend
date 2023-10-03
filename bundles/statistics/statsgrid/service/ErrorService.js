import { Messaging } from 'oskari-ui/util';
/**
 * @class Oskari.statistics.statsgrid.ErrorService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ErrorService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox) {
        this.sandbox = sandbox;
    }, {
        __name: 'StatsGrid.ErrorService',
        __qname: 'Oskari.statistics.statsgrid.ErrorService',

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        show: function (title, content, duration = 5) {
            // all components uses 'Error' as title, doesn't make sense to use it with Messaging API
            Messaging.warn({ content, duration });
        },
        warn: function (message) {
            Messaging.warn({ content: message });
        },
        error: function (message) {
            Messaging.error({ content: message });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
