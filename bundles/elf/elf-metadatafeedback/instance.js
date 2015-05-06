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
         * @property templates
         */
        templates: {
            ratingContainer: jQuery('<div class="ratingInfo"></div>'),
            starItem: jQuery('<div class="ratingStar"></div>'),
            numRatings: jQuery('<div class="numRatings"></div>')
        },
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
                p;

            sandbox = Oskari.getSandbox(sandboxName);

            this.sandbox = sandbox;

            sandbox.register(this);

            var addFeedbackAjaxUrl = this.sandbox.getAjaxUrl()+'action_route=GiveMetadataFeedback';
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


            this._activateMetadataSearchResultsShowRating();


        },
        /**
         * Activate metadata search results show license link
         * @method _activateMetadataSearchResultsShowRating
         * @private
         */
        _activateMetadataSearchResultsShowRating: function(){
            var me = this,
                reqBuilder = me.sandbox.getRequestBuilder('AddSearchResultActionRequest');

            if (reqBuilder) {
                var data = {
                    actionElement: jQuery('<div class="ratingInfo"></div>'),
                    callback: function(metadata) {
                        me.sandbox.postRequestByName('catalogue.ShowFeedbackRequest', [metadata]);
                    },
                    bindCallbackTo: null,
                    actionTextElement: null,
                    actionText: null,
                    showAction: function(metadata) {
                        //add the span with metadata's id to be able to identify and update rating later
                        this.actionText = '<span id="metadataRatingSpan_'+metadata.id+'" style="display:none;"/>'+me._getMetadataRating(metadata);
                        return true;
                    }
                };
                var request = reqBuilder(data);
                me.sandbox.request(me, request);
            }
        },
        updateMetadataRating: function(metadata) {
            var idSpan = $('#metadataRatingSpan_'+metadata.id);
            var container = idSpan.parent();
            container.html(idSpan.html()+this._getMetadataRating(metadata));
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
        },

        /**
         * @method _getRatingInfo
         * @param {Object} metadata object
         * @return raty stars dom for current metadata
         */
        _getMetadataRating: function(metadata) {
            var me = this;
            var ratingContainer = me.templates.ratingContainer.clone();
            if (typeof metadata.rating !== "undefined") {
                var ratingSymbols = me._generateRatingSymbols(metadata.rating);
                for (j = 0; j < 5; j++) {
                    starContainer = me.templates.starItem.clone();
                    starContainer.addClass(ratingSymbols[j]);
                    starContainer.data('starId', 'rating-star-' + metadata.id + '-' + j);
                    ratingContainer.append(starContainer);
                }

                numRatingsContainer = me.templates.numRatings.clone();
                var numRatingsText = metadata.numRatings !== undefined ? "("+metadata.numRatings +")" : "&nbsp;";
                numRatingsContainer.append(numRatingsText);
                ratingContainer.append(numRatingsContainer);

            }
            return ratingContainer.html();
        },
        /**
         *
         *  @method _generateRatingSymbols
         *
         */
        _generateRatingSymbols: function(input) {
            if ((typeof input === "undefined")||(input === null)) {
                return null;
            }
            var ratingSymbols = [];
            var score = Number(input);
            var i;
            for (i=0; i<5; i++) {
                if (score < i+0.25) {
                    ratingSymbols.push("icon-star-off");
                } else if ((i+0.25 <= score)&&(score < i+0.75)) {
                    ratingSymbols.push("icon-star-half");
                } else {
                    ratingSymbols.push("icon-star-on");
                }
            }
            return ratingSymbols;
        },
        _updateRating: function(metadata) {
        }

    },{
    protocol: [
        'Oskari.bundle.BundleInstance',
        'Oskari.mapframework.module.Module',
        'Oskari.userinterface.Extension'
    ]
});