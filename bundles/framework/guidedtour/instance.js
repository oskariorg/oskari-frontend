import { GuidedTourHandler } from './handler/GuidedTourHandler';
/**
 * @class Oskari.mapframework.bundle.guidedtour.GuidedTourBundleInstance
 *
 * Add this to startupsequence to get this bundle started
     {
     bundlename : 'guidedtour',
     bundleinstancename : 'guidedtour'
 */
Oskari.clazz.define(
    'Oskari.framework.bundle.guidedtour.GuidedTourBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (locale) {
        this.sandbox = null;
        this._localization = locale;
        this.mediator = null;
        this._handler = null;
    },
    {
        /**
         * @static
         * @property __name
         */
        __name: 'GuidedTour',

        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getTitle
         * Extension protocol method
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this._localization.title;
        },

        /**
         * @method getDescription
         * Extension protocol method
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this._localization.desc;
        },

        /**
         * @method getSandbox
         * Convenience method to call from Tile and Flyout
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {},

        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            var state = this.state || {};
            // Check cookie 'pti_tour_seen'. Value '1' means that tour
            // is not to be started
            // jQuery cookie plugin:
            //   resources/framework/bundle/guidedtour/js/jquery.cookie.js
            //   github.com/carhartl/jquery-cookie/
            if (jQuery.cookie('pti_tour_seen') === '1' || state.showIntro === false) {
                return;
            }

            var sandbox = Oskari.getSandbox();
            // register to sandbox as a module
            sandbox.register(this);
            // register request handlers
            sandbox.requestHandler(
                'Guidedtour.AddToGuidedTourRequest',
                Oskari.clazz.create('Oskari.framework.bundle.guidedtour.AddToGuidedTourRequestHandler', this)
            );
            this.sandbox = sandbox;
            this._handler = new GuidedTourHandler(this);
        },

        addStep: function (delegate) {
            if (this._handler) {
                this._handler.addStep(delegate);
            }
        },

        /**
         * @method init
         * Module protocol method
         */
        init: function () {
            // headless module so nothing to return
            return null;
        },

        /**
         * @method onEvent
         * Module protocol method/Event dispatch
         */
        onEvent: function (event) {
            var me = this;
            var handler = me.eventHandlers[event.getName()];
            if (!handler) {
                var ret = handler.apply(this, [event]);
                if (ret) {
                    return ret;
                }
            }
            return null;
        },

        /**
         * @static
         * @property eventHandlers
         * Best practices: defining which
         * events bundle is listening and how bundle reacts to them
         */
        eventHandlers: {
            // not listening to any events
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            // unregister module from sandbox
            this.sandbox.unregister(this);
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
