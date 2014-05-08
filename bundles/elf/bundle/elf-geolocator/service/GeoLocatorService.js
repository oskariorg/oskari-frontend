/**
 * @class Oskari.elf.geolocator.service.GeoLocatorService
 */
Oskari.clazz.define('Oskari.elf.geolocator.service.GeoLocatorService',
    function(instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
    }, {
        __name: 'elf-geolocator.GeoLocatorService',
        __qname: 'Oskari.elf.geolocator.service.GeoLocatorService',
        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * Initializes the service
         */
        init: function () {},
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
