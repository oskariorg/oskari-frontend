/**
 * @class Oskari.mapframework.bundle.mappublished.MenuPlugin
 * Displays the NLS menu and provides a link to terms of use on top of the map.
 * Gets base urls from localization files.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.MenuPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (conf) {
        this.conf = conf;
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.element = null;
    }, {

        templates: {
            main: jQuery(
                "<div class='mapplugin menuplugin'>" +
                    "<div class='icon'></div>" +
                    "<div class='menucontainer'>" +
                        "<div class='olPopupContent'>" +
                            "<div class='menuTopArrow'></div>" +
                            "<div class='menuContent' >" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
            ),
            container: jQuery("<div></div>")
        },

        /** @static @property __name plugin name */
        __name: 'MenuPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has an UI so always returns true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
        },
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {},
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {},
        /**
         * @method startPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._map = me.getMapModule().getMap();

            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.registerForEventByName(me, p);
                }
            }
            me._createUI();
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }

            me._sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;

            // TODO: check if added?
            // unbind change listener and remove ui
            if (me.element) {
                me.element.find('div.icon').off('click');
            }
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
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
        },

        /** 
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            }
        },

        /**
         * Sets the location of the menu.
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
         * @method _createUI
         * @private
         * Creates menu and terms of use links on top of map
         */
        _createUI: function () {
            var me = this,
                sandbox = me._sandbox,
                pluginLoc = me.getMapModule().getLocalization('plugin', true),
                myLoc = pluginLoc[me.__name],
                icon,
                linkParams,
                mapUrl,
                termsUrl,
                containerClasses = 'top left',
                position = 1,
                dataSources,
                containers = ((me.conf && me.conf.containers)? me.conf.containers : []);

            if (!me.element) {
                me.element = me.templates.main.clone();
                var wrapper = me.element.find('div.menuContent');
                for (var i = 0, ilen = containers.length; i < ilen; i++) {
                    // create configured containers
                    me.templates.container
                        .clone()
                        .attr("id", containers[i])
                        .appendTo(wrapper)
                }
            }

            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }

            //parentContainer.append(me.element);
            me.getMapModule().setMapControlPlugin(me.element, containerClasses, position);

            // hide container
            menucontainer = me.element.find('.menucontainer');
            menucontainer.hide();

            icon = me.element.find('div.icon');
            icon.on('click', function () {
                menucontainer.toggle();
            });
        }


    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });