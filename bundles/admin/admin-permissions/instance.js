import './Flyout';
import './Tile';

/**
 * @class Oskari.admin.bundle.admin-layerrights.AdminLayerRightsBundleInstance
 *
 * Main component and starting point for the layer rights management functionality.
 *
 * See Oskari.admin.bundle.admin-layerrights.AdminLayerRightsBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.admin.bundle.admin-permissions.AdminPermissionsBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.service = null;
    }, {

        /**
         * @static
         * @property __name
         */
        __name: 'admin-permissions',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        'getName': function () {
            return this.__name;
        },

        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },

        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        'start': function () {
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            if (me.started) {
                return;
            }

            me.started = true;

            me.sandbox = sandbox;

            sandbox.register(me);
            for (var p in me.eventHandlers) {
                sandbox.registerForEventByName(me, p);
            }

            // Let's extend UI
            var reqName = 'userinterface.AddExtensionRequest',
                reqBuilder = Oskari.requestBuilder(reqName),
                request = reqBuilder(this);
            sandbox.request(this, request);

            // draw ui
            me.createUi();
        },

        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        'init': function () {
            return null;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does
         * nothing atm
         */
        'update': function () {

        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        'stop': function () {
            var me = this,
                sandbox = me.sandbox(),
                reqName = 'userinterface.RemoveExtensionRequest',
                reqBuilder = Oskari.requestBuilder(reqName);

            for (var p in me.eventHandlers) {
                sandbox.unregisterFromEventByName(me, p);
            }

            sandbox.request(me, reqBuilder(me));

            me.sandbox.unregister(me);
            me.started = false;
        },

        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol
         * startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.publisher.Flyout
         * Oskari.mapframework.bundle.publisher.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] =
                Oskari.clazz.create('Oskari.admin.bundle.admin-permissions.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] =
                Oskari.clazz.create('Oskari.admin.bundle.admin-permissions.Tile', this);
        },

        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol
         * stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },

        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins
         * method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return Oskari.getMsg('admin-permissions', 'title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * component
         */
        getDescription: function () {
            return Oskari.getMsg('admin-permissions', 'desc');
        },

        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            var me = this;
            me.plugins['Oskari.userinterface.Flyout'].renderContent();
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);
