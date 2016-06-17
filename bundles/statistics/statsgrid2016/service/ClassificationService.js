/**
 * @class Oskari.statistics.statsgrid.ClassificationService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (sandbox) {
        this.sandbox = sandbox;
    }, {
        __name: "StatsGrid.ClassificationService",
        __qname: "Oskari.statistics.statsgrid.ClassificationService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        doSomeStuffWithGeostats : function(indicatorData) {
            var gstats = new geostats(indicatorData)
            // TODO: stuff...
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
