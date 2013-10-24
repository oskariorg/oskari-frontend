/**
 * @class Oskari.mapframework.bundle.userguide.UserGuideBundleInstance
 *
 * Renders help text.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.userguide.UserGuideBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.ui = null;
        this._requestHandlers = {};
        this.attachedToDefault = false;
        this.helper = null;
        this.isContentLoaded = false;
    }, {
        "templates": {
            "userguide": '<div class="oskari-userguide"><span class="oskari-prompt"></span><br /></div>'
        },
        /**
         * @static
         * @property __name
         */
        __name: 'userinterface.UserGuide',
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
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
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
            var me = this;

            if (me.started) {
                return;
            }

            me.started = true;

            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;

            this._localization = Oskari.getLocalization(this.getName());

            var title = this.getLocalization('title'),
                popover = Oskari.clazz.create('Oskari.userinterface.component.Popover', title, ''),
                p;
            this.ui = popover;
            popover.setContent($(this.templates.userguide));

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            // request
            this._requestHandlers['userguide.ShowUserGuideRequest'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequestHandler', sandbox, this);
            sandbox.addRequestHandler('userguide.ShowUserGuideRequest', this._requestHandlers['userguide.ShowUserGuideRequest']);

            //Let's extend UI
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            //sandbox.registerAsStateful(this.mediator.bundleId, this);
            // draw ui
            me.createUi();

            // get help content
            var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', sandbox);
            this.helper = helper;


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
         * implements BundleInstance protocol update method - does nothing atm
         */
        "update": function () {

        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
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

                var isOpen = event.getViewState() !== "close";

                me.displayContent(isOpen);

            }
        },

        /**
         * @method displayContent
         */
        "displayContent": function (isOpen) {
            var me = this;
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
            var tagsTxt = 'help.tags';
            if (this.getLocalization('help') &&
                    this.getLocalization('help').tags) {
                tagsTxt = this.getLocalization('help').tags;
            }

            this.helper.getHelpArticle(
                tagsTxt,
                function (isSuccess, pContent) {
                    var content = pContent;
                    var errorTxt = 'error.generic';
                    if (me.getLocalization('error') &&
                            me.getLocalization('error').generic) {
                        errorTxt = me.getLocalization('error').generic;
                    }
                    if (!isSuccess) {
                        content = errorTxt;
                    } else if (content[helpContentPart]) {
                        content = content[helpContentPart];
                    }
                    me.plugins['Oskari.userinterface.Flyout'].setContent(content);
                    me.isContentLoaded = true;
                }
            );
        },


        /**
         * @method toggleUserInterface
         */

        "toggleUserInterface": function (doOpen, el) {
            var me = this,
                popover = this.ui;
            if (!doOpen) {
                popover.hide();
            } else {
                if (!me.attachedToDefault) {
                    var el2 = me.plugins['Oskari.userinterface.Tile'].getEl();
                    popover.setPlacement('right');
                    popover.attachTo(el2);
                    me.attachedToDefault = true;

                }
                popover.show();

            }
        },
        "scheduleShowUserGuide": function (request) {

            var me = this,
                popover = me.ui,
                isToggle = request.isToggle();

            if (isToggle && popover.shown) {
                /*popover.hide();*/
                me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
                return;
            }

            me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'attach']);

            var userGuideContent = jQuery(this.templates.userguide);

            /* Debug Begin */
            var userGuideData = jQuery('<div />'),
                lang = Oskari.getLang(),
                d = userGuideData.clone(),
                reqContent = request.getContent();
            if (reqContent) {
                userGuideContent.append(reqContent);
            } else {

                d.append("Lang: " + lang);
                userGuideContent.append(d);

                d = userGuideData.clone();
                d.append("Extension: " + request.getExtension());
                userGuideContent.append(d);

                d = userGuideData.clone();
                d.append("Context: " + request.getContext());
                userGuideContent.append(d);

                d = userGuideData.clone();
                d.append("Element: " + (request.getEl() ? "YES" : "NO"));
                userGuideContent.append(d);

            }
            /* Debug End */

            var el = request.getEl(),
                placement = request.getPlacement();

            if (placement) {
                popover.setPlacement(placement);
            }

            if (!el) {
                if (!me.attachedToDefault) {
                    el = me.plugins['Oskari.userinterface.Tile'].getEl();

                    popover.attachTo(el);
                    me.attachedToDefault = true;
                }
            } else {
                popover.hide();
                me.attachedToDefault = false;
                popover.attachTo(el);
            }

            popover.setContent(userGuideContent);

        },
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

            /* request handler cleanup */
            sandbox.removeRequestHandler('userguide.ShowUserGuideRequest', this._requestHandlers['userguide.ShowUserGuideRequest']);

            var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

            sandbox.request(this, request);

            //this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerselection2.Flyout
         * Oskari.mapframework.bundle.layerselection2.Tile
         */
        startExtension: function () {
            /*this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.Flyout', this,
             * this.getLocalization()['flyout']););*/
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.userguide.Tile', this, this.getLocalization('tile'));
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            /*this.plugins['Oskari.userinterface.Flyout'] = null;*/
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
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
         * @return {String} localized text for the description of the component
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

            this.plugins['Oskari.userinterface.Tile'].refresh();
            this.plugins['Oskari.userinterface.Flyout'].setContent('');
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });