define([
    "./BaseExtension",
], function(BaseExtension) {

    /**
     * @class Oskari.EnhancedExtension
     *
     */
    var EnhancedExtension = BaseExtension.extend({
        /* O2 helpers */

        getTile: function() {
            return this.plugins['Oskari.userinterface.Tile'];
        },
        setTile: function(t) {
            this.plugins['Oskari.userinterface.Tile'] = t;
        },
        setDefaultTile: function(txt) {
            var tileCls = Oskari.cls().extend('Oskari.userinterface.extension.DefaultTile');
            var tile = tileCls.create(this, {
                title: txt || ''
            });
            this.plugins['Oskari.userinterface.Tile'] = tile;
            return tile;
        },
        getFlyout: function() {
            return this.plugins['Oskari.userinterface.Flyout'];
        },
        setFlyout: function(f) {
            this.plugins['Oskari.userinterface.Flyout'] = f;
        },
        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function() {
            var me = this;
            var conf = this.conf;
            var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            var sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;
            sandbox.register(this);

            /* stateful */
            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

            sandbox.request(this, request);

        },
        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function() {
            var sandbox = this.sandbox;

            /* sandbox cleanup */

            var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            sandbox.unregisterStateful(this.mediator.bundleId);
            sandbox.unregister(this);
            this.sandbox = null;
            this.started = false;
        }
    });

    return EnhancedExtension;
});
