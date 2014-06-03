/**
 * @class Oskari.mapframework.bundle.search.SearchBundleInstance
 *
 * Main component and starting point for the "search" functionality.
 * Provides search functionality for the map.
 *
 * See Oskari.mapframework.bundle.search.SearchBundle for bundle definition.
 *
 */
Oskari.clazz
    .define("Oskari.mapframework.bundle.search.SearchBundleInstance",

        /**
         * @method create called automatically on construction
         * @static
         */

        function () {
            this.sandbox = null;
            this.started = false;
            this.plugins = {};
            this.localization = null;
            this.service = null;
            this.tabPriority = 1.0;
            this.disableDefault = false;
        }, {
            /**
             * @static
             * @property __name
             */
            __name: 'Search',
            /**
             * @method getName
             * @return {String} the name for the component
             */
            "getName": function () {
                return this.__name;
            },
            /**
             * @method setSandbox
             * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
             * Sets the sandbox reference to this component
             */
            setSandbox: function (sandbox) {
                this.sandbox = sandbox;
            },
            /**
             * @method getSandbox
             * @return {Oskari.mapframework.sandbox.Sandbox}
             */
            getSandbox: function () {
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
                if (!this._localization) {
                    this._localization = Oskari.getLocalization(this.getName());
                }
                if (key && this._localization[key]) {
                    return this._localization[key];
                }
                if (!this.localization) {
                    return {};
                }
                return this._localization;
            },
            /**
             * @method start
             * implements BundleInstance protocol start methdod
             */
            "start": function () {
                var me = this;

                if (me.started) {
                    return;
                }

                me.started = true;

                var conf = this.conf,
                    sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                    sandbox = Oskari.getSandbox(sandboxName);

                me.sandbox = sandbox;

                this.localization = Oskari.getLocalization(this.getName());

                var ajaxUrl = null;
                if (this.conf && this.conf.url) {
                    ajaxUrl = this.conf.url;
                } else {
                    ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetSearchResult';
                }

                // Default tab priority
                if (this.conf && typeof this.conf.priority === 'number') {
                    this.tabPriority = this.conf.priority;
                }

                // Create default UI or not?
                if (this.conf && this.conf.disableDefault === true) {
                    this.disableDefault = true;
                }

                var servName =
                    'Oskari.mapframework.bundle.search.service.SearchService';
                this.service = Oskari.clazz.create(servName, ajaxUrl);

                sandbox.register(me);
                var p;
                for (p in me.eventHandlers) {
                    if (me.eventHandlers.hasOwnProperty(p)) {
                        sandbox.registerForEventByName(me, p);
                    }
                }

                //Let's extend UI
                var reqName = 'userinterface.AddExtensionRequest',
                    reqBuilder = sandbox.getRequestBuilder(reqName),
                    request = reqBuilder(this);
                sandbox.request(this, request);

                sandbox.registerAsStateful(this.mediator.bundleId, this);

                // draw ui
                me.createUi();

                // UI exists and we can hook up the request handler
                this.requestHandlers = {
                    addTabRequestHandler: Oskari.clazz.create(
                        'Oskari.mapframework.bundle.search.request.AddTabRequestHandler',
                        sandbox, this.plugins['Oskari.userinterface.Flyout']),
                    addSearchResultActionRequestHandler: Oskari.clazz.create(
                        'Oskari.mapframework.bundle.search.request.SearchResultActionRequestHandler',
                        sandbox, this.plugins['Oskari.userinterface.Flyout'])
                };
                sandbox.addRequestHandler(
                    'Search.AddTabRequest',
                    this.requestHandlers.addTabRequestHandler);
                sandbox.addRequestHandler(
                    'Search.AddSearchResultActionRequest',
                    this.requestHandlers.addSearchResultActionRequestHandler);
                sandbox.addRequestHandler(
                    'Search.RemoveSearchResultActionRequest',
                    this.requestHandlers.addSearchResultActionRequestHandler);
            },
            /**
             * @method init
             * implements Module protocol init method - does nothing atm
             */
            "init": function () {
                return null;
            },
            /**
             * @method update
             * implements BundleInstance protocol update method - does
             * nothing atm
             */
            "update": function () {

            },
            /**
             * @method onEvent
             * @param {Oskari.mapframework.event.Event} event a Oskari event
             * object
             * Event is handled forwarded to correct #eventHandlers if found
             * or discarded if not.
             */
            onEvent: function (event) {

                var handler = this.eventHandlers[event.getName()];
                if (!handler) {
                    return;
                }

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
                var sandbox = this.sandbox(),
                    p;
                for (p in this.eventHandlers) {
                    if (this.eventHandlers.hasOwnProperty(p)) {
                        sandbox.unregisterFromEventByName(this, p);
                    }
                }

                var reqName = 'userinterface.RemoveExtensionRequest',
                    reqBuilder = sandbox.getRequestBuilder(reqName),
                    request = reqBuilder(this);

                sandbox.request(this, request);

                this.sandbox.unregisterStateful(this.mediator.bundleId);
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
                    Oskari.clazz.create('Oskari.mapframework.bundle.search.Flyout',
                        this);
                this.plugins['Oskari.userinterface.Tile'] =
                    Oskari.clazz.create('Oskari.mapframework.bundle.search.Tile',
                        this);
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
                return this.getLocalization('title');
            },
            /**
             * @method getDescription
             * @return {String} localized text for the description of the
             * component
             */
            getDescription: function () {
                return this.getLocalization('desc');
            },
            /**
             * @method createUi
             * (re)creates the UI for "selected layers" functionality
             */
            createUi: function () {
                var me = this;
                this.plugins['Oskari.userinterface.Flyout'].createUi();
                this.plugins['Oskari.userinterface.Tile'].refresh();
            },
            /**
             * @method setState
             * @param {Object} state bundle state as JSON
             */
            setState: function (state) {
                this.plugins['Oskari.userinterface.Flyout'].setState(state);
            },
            /**
             * @method getState
             * @return {Object} bundle state as JSON
             */
            getState: function () {
                return this.plugins['Oskari.userinterface.Flyout'].getState();
                /*
        var state = {
        
        };
        
        return state;
          */
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