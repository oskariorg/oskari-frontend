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
        this.loc = Oskari.getMsg.bind(null, this.getName());
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
        getName: function () {
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
        start: function () {
            if (this.started) {
                return;
            }
            this.started = true;
            const conf = this.conf || {};
            const sandboxName = conf.sandbox || 'sandbox';
            this.sandbox = Oskari.getSandbox(sandboxName);

            this.sandbox.register(this);
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.registerForEventByName(this, p));
            // Let's extend UI
            const reqBuilder = Oskari.requestBuilder('userinterface.AddExtensionRequest');
            this.sandbox.request(this, reqBuilder(this));

            // draw ui
            this.createUi();
        },

        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does
         * nothing atm
         */
        update: function () {

        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            const reqBuilder = Oskari.requestBuilder('userinterface.RemoveExtensionRequest');
            this.sandbox.request(this, reqBuilder(this));
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.unregisterFromEventByName(this, p));

            this.sandbox.unregister(this);
            this.started = false;
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
            return this.loc('title');
        },

        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].renderContent();
        },
        closeFlyout: function () {
            this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event
         * object
         * Event is handled forwarded to correct #eventHandlers if found
         * or discarded if not.
         */
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Reset flyout when closed
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                if (event.getExtension().getName() !== this.getName()) {
                    // not me -> do nothing
                    return;
                }
                if (event.getViewState() === 'close') {
                    this.plugins['Oskari.userinterface.Flyout'].resetFlyout();
                }
            },
            'MapLayerEvent': function (event) {
                if (event.getOperation() !== 'update') {
                    // handle update layer only
                    return;
                }
                this.plugins['Oskari.userinterface.Flyout'].handler?.onLayerUpdate();
            }
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);
