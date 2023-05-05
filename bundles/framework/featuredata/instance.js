/**
 * @class Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance
 *
 * Main component and starting point for the "featuredata" functionality.
 *
 * See Oskari.mapframework.bundle.featuredata.FeatureDataBundle for bundle definition.
 *
 */

Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance',
    function () {},
    {
        /**
         * @static
         * @property __name
         */
        __name: 'FeatureData',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
        },
        start: function () {
            const sandboxName = (this.conf ? this.conf.sandbox : null) || 'sandbox';
            this.sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox.register(this);
            this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

            this.createUi();
        },
        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.plugin.FeaturedataPlugin', this.conf);
            this.mapModule.registerPlugin(this.plugin);
            this.mapModule.startPlugin(this.plugin);
        }
    });
