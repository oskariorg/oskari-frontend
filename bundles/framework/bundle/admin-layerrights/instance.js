/**
 * @class Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance
 *
 * Main component and starting point for the layer rights management functionality.
 *
 * See Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        "use strict";
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.service = null;
    }, {

        /**
         * @static
         * @property __name
         */
        __name: 'admin-layerrights',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        "getName": function () {
            "use strict";
            return this.__name;
        },

        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            "use strict";
            this.sandbox = sandbox;
        },

        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            "use strict";
            return this.sandbox;
        },

        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for
         * current language.
         * If key-parameter is not given, returns the whole localization
         * data.
         *
         * @param {String} key (optional) if given, returns the value for
         *         key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            "use strict";
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        "start": function () {
            "use strict";
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                ajaxUrl = null;

            if (me.started) {
                return;
            }

            me.started = true;

            me.sandbox = sandbox;

            me.localization = Oskari.getLocalization(me.getName());

            // TODO ajaxUrl can only have the baseUrl as we have multiple actionroutes
            if (conf && conf.url) {
                ajaxUrl = this.conf.url;
            } else {
                ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetAllRoles';
            }


            sandbox.register(me);
            for (var p in me.eventHandlers) {
                sandbox.registerForEventByName(me, p);
            }

            //Let's extend UI
            var reqName = 'userinterface.AddExtensionRequest',
                reqBuilder = sandbox.getRequestBuilder(reqName),
                request = reqBuilder(this);
            sandbox.request(this, request);

            sandbox.registerAsStateful(me.mediator.bundleId, this);

            // draw ui
            me.createUi();
        },

        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        "init": function () {
            "use strict";
            return null;
        },

        /**
         * @method update
         * implements BundleInstance protocol update method - does
         * nothing atm
         */
        "update": function () {
            "use strict";
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event
         * object
         * Event is handled forwarded to correct #eventHandlers if found
         * or discarded if not.
         */
        onEvent: function (event) {
            "use strict";
            var handler = this.eventHandlers[event.getName()];
            if (!handler)
                return;

            return handler.apply(this, [event]);

        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {},

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop": function () {
            "use strict";
            var me = this,
                sandbox = me.sandbox(),
                reqName = 'userinterface.RemoveExtensionRequest',
                reqBuilder = sandbox.getRequestBuilder(reqName);

            for (var p in me.eventHandlers) {
                sandbox.unregisterFromEventByName(me, p);
            }

            sandbox.request(me, reqBuilder(me));

            me.sandbox.unregisterStateful(me.mediator.bundleId);
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
            "use strict";
            this.plugins['Oskari.userinterface.Flyout'] =
                Oskari.clazz.create('Oskari.framework.bundle.admin-layerrights.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] =
                Oskari.clazz.create('Oskari.framework.bundle.admin-layerrights.Tile', this);
        },

        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol
         * stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            "use strict";
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
            "use strict";
            return this.plugins;
        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            "use strict";
            return this.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * component
         */
        getDescription: function () {
            "use strict";
            return this.getLocalization('desc');
        },

        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            "use strict";
            var me = this;
            me.plugins['Oskari.userinterface.Flyout'].setContent();
            me.plugins['Oskari.userinterface.Tile'].refresh();
        },

        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            "use strict";
            this.plugins['Oskari.userinterface.Flyout'].setState(state);
        },

        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            "use strict";
            return this.plugins['Oskari.userinterface.Flyout'].getState();
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);