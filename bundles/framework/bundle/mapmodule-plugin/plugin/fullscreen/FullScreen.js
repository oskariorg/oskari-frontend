/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        var me = this;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me._fullscreen = null;
        me.templates = {};
    }, {
        /** @static @property __name plugin name */
        __name: 'FullScreenPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol.
         * Creates a template for the full screen toggle button.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this,
                fsimg = this.getMapModule().getImageUrl() + '/framework/bundle/mapmodule-plugin/plugin/fullscreen/images/';

            // template
            this.templates.main = jQuery(
                '<div class="fullscreenDiv">' +
                    '<img class="fullscreenDivImg" src="' + fsimg + 'hide-navigation.png' + '"></img>' +
                    '</div>'
            );
        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {

        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Adds the fullscreen toggle button to the DOM.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            this._map = this.getMapModule().getMap();

            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.registerForEventByName(me, p);
                }
            }
            me.createUI();
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol.
         * Removes the fullscreen toggle button from the map div
         * and unregisters itself from the core.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;
            jQuery('div.fullscreenDiv').remove();

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);
            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * Sets the location of the control.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            me.conf.location = location;

            // reset plugin if active
            if (me.element) {
                me.stopPlugin();
                me.startPlugin();
            }
        },
        /**
         * @method createUI
         * Binds a click event to the toggle image and adds the div to the DOM.
         */
        createUI: function () {
            var me = this,
                fsimg = this.getMapModule().getImageUrl() + '/framework/bundle/mapmodule-plugin/plugin/fullscreen/images/',
                containerClasses = 'top left',
                position = 1;

            if (!me.element) {
                me.element = me.templates.main.clone();
            }

            me.element.find('.fullscreenDivImg').bind('click', function (event) {
                event.preventDefault();
                me._sandbox.postRequestByName('MapFull.MapWindowFullScreenRequest');

                if (jQuery(this).attr('src').match(/hide-navigation/)) {
                    jQuery(this).attr('src', fsimg + 'show-navigation.png');
                } else {
                    jQuery(this).attr('src', fsimg + 'hide-navigation.png');
                }
            });

            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }
            //parentContainer.append(me.element);
            me.getMapModule().setMapControlPlugin(me.element, containerClasses, position);
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {},

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });