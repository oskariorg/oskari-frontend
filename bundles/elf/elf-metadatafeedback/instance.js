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
    this.feedbackService = null;

}, {
        /**
         * @static
         * @property templates
         */
        templates: {
            ratingContainer: jQuery('<div class="ratingInfo"></div>'),
            starItem: jQuery('<div class="ratingStar"></div>'),
            numRatings: jQuery('<div class="numRatings"></div>'),
            feedbackTabErrorTemplate: _.template('<article><%=responseText%></article>'),
            feedbackSuccessTemplate: _.template(
                '<article>'+
                '   <div class="feedback-list-rating">'+
                '       <span class="feedback-list-rating-subject"><%=locale.feedbackList.average%>: </span>'+
                '       <%=average%>'+
                '   </div>'+
                '   <br/>'+
                '   <br/>'+
                '   <%_.forEach(feedbacks, function(feedback) { %>'+
                '       <div class="feedbacklist-feedback">'+
                '           <div class="feedback-list-rating">'+
                '               <%=feedback.score%>'+
                '               <span class="feedbacklist-userrole">'+
                '                   <%=locale.userInformation[feedback.userRole] ? locale.userInformation[feedback.userRole] : feedback.userRole%>'+
                '               </span>'+
                '           </div>'+
                '           <br/>'+
                '           <br/>'+
                '           <div>'+
                '               <%=feedback.comment%>'+
                '           </div>'+
                '       </div>'+
                '   <%})%>'+
                '</article>')
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
            var addFeedbackAjaxUrl = this.sandbox.getAjaxUrl()+'action_route=UserFeedback';
            var fetchFeedbackAjaxUrl = this.sandbox.getAjaxUrl()+'action_route=UserFeedback';
            var feedbackServiceName =
                'Oskari.catalogue.bundle.metadatafeedback.service.FeedbackService';
            this.feedbackService = Oskari.clazz.create(feedbackServiceName, addFeedbackAjaxUrl, fetchFeedbackAjaxUrl);

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            this._requestHandlers = {
                'catalogue.ShowFeedbackRequest': Oskari.clazz.create(
                    'Oskari.catalogue.bundle.metadatafeedback.request.' +
                    'ShowFeedbackRequestHandler',
                    sandbox,
                    this
                )
            };

            for (var key in this._requestHandlers) {
                sandbox.addRequestHandler(key, this._requestHandlers[key])
            }

            var request = sandbox.getRequestBuilder(
                'userinterface.AddExtensionRequest'
            )(this);
            sandbox.request(this, request);


            this._activateMetadataSearchResultsShowRating();

            this._addMetadataFeedbackTabToMetadataFlyout();
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
                        this.actionText = '<span id="metadataRatingSpan_'+metadata.id+'" style="display:none;"/>&nbsp;'+me._getAdminMetadataRating(metadata.latestAdminRating);

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
            container.empty();
            container.append(idSpan);
            container.append('&nbsp;'+this._getAdminMetadataRating(metadata.latestAdminRating));
        },
        _addMetadataFeedbackTabToMetadataFlyout: function() {
            var me = this,
                reqBuilder = me.sandbox.getRequestBuilder('catalogue.AddTabRequest');
            var data = {
                'feedback': {
                    template: null,
                    title: me._locale.feedbackList.tabTitle,
                    tabActivatedCallback: function(uuid, panel) {
                        me.feedbackService.fetchFeedback({'category': 'ELF_METADATA' ,'categoryItem': uuid},
                            function(response) {
                                _.each(response[1], function(feedbackItem) {
                                    feedbackItem.score = me._getMetadataRating(feedbackItem);
                                    feedbackItem.comment = feedbackItem.comment.split("\n").join("<br />");
                                });
                                var json = {
                                    'locale': me._locale,
                                    'average': me._getMetadataRating(response[0]),
                                    'feedbacks': response[1]
                                };
                                panel.setContent(_.template(me.templates.feedbackSuccessTemplate(json)));
                            },
                            function(error) {
                                var content = me.templates.feedbackTabErrorTemplate(error);
                            }
                        );
                    }
                }
            };
            var request = reqBuilder(data);
            me.sandbox.request(me, request);
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

        _getAdminMetadataRating: function(score) {
            if (!score) {
                score = 0;
            }
            return this._getMetadataRating({score: score});
        },
        /**
         * @method _getRatingInfo
         * @param {Object} metadata object
         * @return raty stars dom for current metadata
         */
        _getMetadataRating: function(metadata) {
            var me = this;
            var ratingContainer = me.templates.ratingContainer.clone();
            if (typeof metadata.score !== "undefined") {
                var ratingSymbols = me._generateRatingSymbols(metadata.score);
                for (j = 0; j < 5; j++) {
                    starContainer = me.templates.starItem.clone();
                    starContainer.addClass(ratingSymbols[j]);
                    starContainer.data('starId', 'rating-star-' + metadata.id + '-' + j);
                    ratingContainer.append(starContainer);
                }

                if (metadata.amount !== undefined) {
                    var numRatingsContainer = me.templates.numRatings.clone();
                    var numRatingsText = metadata.amount !== undefined ? "("+metadata.amount +")" : "&nbsp;";
                    numRatingsContainer.append(numRatingsText);
                    ratingContainer.append(numRatingsContainer);
                }

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
        _updateRating: function() {
        }

    },{
    protocol: [
        'Oskari.bundle.BundleInstance',
        'Oskari.mapframework.module.Module',
        'Oskari.userinterface.Extension'
    ]
});