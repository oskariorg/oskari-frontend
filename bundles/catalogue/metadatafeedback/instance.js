/**
 * This bundle generates a metadata feedback flyout.
 *
 * @class Oskari.catalogue.bundle.metadatafeedback.MetadataFeedbackBundleInstance
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatafeedback.MetadataFeedbackBundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function () {
    this.sandbox = null;
    this._locale = null;
    this.plugins = {};
    this.loader = null;
    this._requestHandlers = {};
    this.addFeedbackService= null;

}, {
        /**
         * @static
         * @property __name
         */
        __name: 'catalogue.bundle.metadatafeedback',
        /**
         * Module protocol method
         *
         * @method getName
         */
        getName: function () {
            return this.__name;
        },

        /**
         * DefaultExtension method for doing stuff after the bundle has started.
         *
         * @method afterStart
         */
        start: function (sandbox) {
            /* locale */
            this._locale = Oskari.getLocalization(this.getName());

            /* sandbox */
            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            this.sandbox = sandbox;

            sandbox.register(this);

            var addFeedbackAjaxUrl = 'http://localhost:1234/feedback/';
            var addFeedbackServiceName =
                'Oskari.catalogue.bundle.metadatafeedback.service.AddFeedbackService';
            this.addFeedbackService = Oskari.clazz.create(addFeedbackServiceName, addFeedbackAjaxUrl);



            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            /* request handler */
            this._requestHandlers['catalogue.ShowFeedbackRequest'] =
                Oskari.clazz.create(
                    'Oskari.catalogue.bundle.metadatafeedback.request.' +
                    'ShowFeedbackRequestHandler',
                    sandbox,
                    this
                );

            sandbox.addRequestHandler(
                'catalogue.ShowFeedbackRequest',
                this._requestHandlers['catalogue.ShowFeedbackRequest']
            );

            var request = sandbox.getRequestBuilder(
                'userinterface.AddExtensionRequest'
            )(this);
            sandbox.request(this, request);



//sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, 'detach']);


        },

        init: function () {
            return null;
        },

        /**
         * @method update
         *
         * implements bundle instance update method
         */
        update: function () {
        },

        /**
         * @method onEvent
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

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
        getLocale: function () {
            return this._locale;
        },
        getLoader: function () {
            return this.loader;
        },
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            this.plugins['Oskari.userinterface.Flyout'].setContentState(state);
        },

        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            return this.plugins[
                'Oskari.userinterface.Flyout'
                ].getContentState();
        },
        eventHandlers: {},

        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] =
                Oskari.clazz.create(
                    'Oskari.catalogue.bundle.metadatafeedback.Flyout',
                    this,
                    this.getLocale(),
                    this.getLoader()
                );
        }
    },{
    protocol: [
        'Oskari.bundle.BundleInstance',
        'Oskari.mapframework.module.Module',
        'Oskari.userinterface.Extension'
    ]
});