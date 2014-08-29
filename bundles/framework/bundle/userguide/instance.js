/**
 * @class Oskari.mapframework.bundle.userguide.UserGuideBundleInstance
 *
 * Renders help text.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.userguide.UserGuideBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._requestHandlers = {};
        this.attachedToDefault = false;
        this.helper = null;
        this.isContentLoaded = false;
        this.defaultConf = {
            name: 'userinterface.UserGuide',
            'tileClazz': 'Oskari.userinterface.extension.DefaultTile',
            flyoutClazz: 'Oskari.mapframework.bundle.userguide.Flyout'
        };
    }, {
        /**
         * @method afterstart
         * implements BundleInstance protocol start methdod
         */
        afterStart: function (sandbox) {
            var title = this.getLocalization('title');

            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            // request
            this._requestHandlers['userguide.ShowUserGuideRequest'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequestHandler', sandbox, this);
            sandbox.addRequestHandler('userguide.ShowUserGuideRequest', this._requestHandlers['userguide.ShowUserGuideRequest']);

            // draw ui
            this.plugins['Oskari.userinterface.Flyout'].createUi();

            // get help content
            var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', sandbox);
            this.helper = helper;


        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {

            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;

                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isOpen = event.getViewState() !== 'close';

                me.displayContent(isOpen);

            }
        },

        /**
         * @method displayContent
         */

        displayContent: function (isOpen) {
            var me = this,
                newtab,
                i;
            if (!isOpen) {
                return;
            }
            if (me.isContentLoaded) {
                return;
            }

            var helpContentPart = 'help.contentPart';
            if (me.getLocalization('help') &&
                me.getLocalization('help').contentPart) {
                helpContentPart = me.getLocalization('help').contentPart;
            }

            var userGuideTabs = me.plugins['Oskari.userinterface.Flyout'].getUserGuideTabs();

            function closureMagic (tagsTxt) {
                return function (isSuccess, pContent) {
                    var content = pContent,
                        errorTxt = 'error.generic';
                    if (me.getLocalization('error') &&
                        me.getLocalization('error').generic) {
                        errorTxt = me.getLocalization('error').generic;
                    }
                    if (!isSuccess) {
                        content = errorTxt;
                    } else if (content[helpContentPart]) {
                        content = content[helpContentPart];
                    }

                    me.plugins['Oskari.userinterface.Flyout'].setContent(content, tagsTxt);
                    me.isContentLoaded = true;
                };
            }

            if (this.conf.tabs) {
                for (i = 0; i < userGuideTabs.length; i += 1) {
                    newtab = userGuideTabs[i];
                    this.helper.getHelpArticle(
                        newtab.tags,
                        closureMagic(newtab.tags)
                    );
                    debugger;
                }
            } else {
                me.tagsTxt = me.getLocalization('help').tags;
                me.helper.getHelpArticle(
                    me.tagsTxt,
                    closureMagic(me.tagsTxt)
                );
            }
        },


        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        'stop': function() {
            var sandbox = this.sandbox(),
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            /* request handler cleanup */
            sandbox.removeRequestHandler('userguide.ShowUserGuideRequest', this._requestHandlers['userguide.ShowUserGuideRequest']);

            var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

            sandbox.request(this, request);

            //this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    });
