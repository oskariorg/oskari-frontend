/**
 * @class Oskari.layeranalytics.StatusBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define('Oskari.layeranalytics.StatusBundle', function () { }, {
    create: function () {
        return Oskari.clazz.create('Oskari.layeranalytics.StatusBundleInstance');
    },
    update: function (manager, bundle, bi, info) { }
}, {
    protocol: ['Oskari.bundle.Bundle'],
    source: {
        scripts: [{
            type: 'text/javascript',
            src: './instance.js'
        }]
    }
});

Oskari.bundle_manager.installBundleClass('layeranalytics', 'Oskari.layeranalytics.StatusBundle');
