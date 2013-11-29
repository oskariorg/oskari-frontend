/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin
 * Provides map tools container
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePublisherToolbarPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (conf) {
        var me = this;
        me.conf = conf;
        me.element = null;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me._scalebar = null;

        //FIXME conffiin?
        this.toolbarId = 'publishedMap';

    }, {
        // templates for tools-mapplugin
        templates: {
            main: jQuery(
                '<div class="mapplugin tools">' +
                    "<div class='icon'></div>" +
                    "<div class='tools-container'>" +
                    "<div class='olPopupContent'>" +
                    "<div class='tools-top-arrow'></div>" +
                    "<div class='tools-content' >" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    '</div>'
            ),
            container: jQuery("<div></div>")
        },

        /** @static @property __name plugin name */
        __name: 'PublisherToolbarPlugin',

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
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this,
                pluginLoc = me.getMapModule().getLocalization('plugin', true),
                reqBuilder = me._sandbox.getRequestBuilder('ToolSelectionRequest'),
                gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest',
                gfiReqBuilder = me._sandbox.getRequestBuilder(gfiRn);
            me.localization = pluginLoc[me.__name];
            me.template = jQuery(me.templates.main);

            /////////////////////////////////
            // ADD TOOL CONFIGURATION HERE //
            /////////////////////////////////
            me.buttonGroups =
                [
                    {
                        'name': 'history',
                        'buttons': {
                            'history_back': {
                                toolbarid: me.toolbarId,
                                iconCls: 'tool-history-back',
                                tooltip: me.localization.history.back,
                                prepend: true,
                                sticky: false,
                                callback: function () {
                                    me._sandbox.request(me, reqBuilder('map_control_tool_prev'));
                                }
                            },
                            'history_forward': {
                                toolbarid: me.toolbarId,
                                iconCls: 'tool-history-forward',
                                tooltip: me.localization.history.next,
                                sticky: false,
                                callback: function () {
                                    me._sandbox.request(me, reqBuilder('map_control_tool_next'));
                                }
                            }
                        }
                    }, {
                        'name': 'basictools',
                        'buttons': {
                            'measureline': {
                                toolbarid: me.toolbarId,
                                iconCls: 'tool-measure-line',
                                tooltip: me.localization.measure.line,
                                sticky: true,
                                callback: function () {
                                    var rn = 'map_control_measure_tool';
                                    me._sandbox.request(me, gfiReqBuilder(false));
                                    me._sandbox.request(me, reqBuilder(rn));
                                }
                            },
                            'measurearea': {
                                toolbarid: me.toolbarId,
                                iconCls: 'tool-measure-area',
                                tooltip: me.localization.measure.area,
                                sticky: true,
                                callback: function () {
                                    var rn = 'map_control_measure_area_tool';
                                    me._sandbox.request(me, gfiReqBuilder(false));
                                    me._sandbox.request(me, reqBuilder(rn));
                                }
                            }
                        }
                    }
                ];
        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {},
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {},

        /**
         * Sets the location of the tools container.
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
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Adds the tools container to the map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._map = me.getMapModule().getMap();

            //register plugin
            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    //register event listeners
                    me._sandbox.registerForEventByName(me, p);
                }
            }

            me._createUI();
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol.
         * Removes the scalebar from map controls.
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
            me.destroy();
            me._sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;
            if (me.element) {
                me.element.remove();
                me.element = undefined;
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
        eventHandlers: {},

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

        show: function (isShown) {
            var showHide = isShown ? 'show' : 'hide';
            this._sandbox.requestByName(this, 'Toolbar.ToolbarRequest', [this.toolbarId, showHide]);
        },
        destroy: function () {
            this._sandbox.requestByName(this, 'Toolbar.ToolbarRequest', [this.toolbarId, 'remove']);
        },
        changeName: function (title) {
            this._sandbox.requestByName(this, 'Toolbar.ToolbarRequest', [this.toolbarId, 'changeName', title]);
        },

        /**
         * @method _createUI
         * sample toolbar for statistics functionality
         */
        _createUI: function () {
            var me = this,
                sandbox = me._sandbox,
                content,
                containerClasses = 'top left',
                position = 1,
                containers = ((me.conf && me.conf.containers) ? me.conf.containers : []);
            // TODO: containers? 
            // I guess the idea is to have some kind of toolbar container vs. tool's content container


            if (!me.element) {
                me.element = me.template.clone();
                var wrapper = me.element.find('div.tools-content'),
                    i,
                    ilen;
                for (i = 0, ilen = containers.length; i < ilen; i++) {
                    // create configured containers
                    me.templates.container
                        .clone()
                        .attr("id", containers[i])
                        .appendTo(wrapper);
                }
            }

            if (this.conf && this.conf.toolStyle) {
                this.changeToolStyle(this.conf.toolStyle, me.element);
            }

            // add classes (top, bottom, left, right, center)
            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }
            me.getMapModule().setMapControlPlugin(me.element, containerClasses, position);

            // add toolbar
            sandbox.requestByName(me, 'Toolbar.ToolbarRequest', [me.toolbarId, 'add', {
                title: me.localization.title,
                show: false,
                toolbarContainer: me.element.find('.tools-content'),
                closeBoxCallback: function () {
                    view.prepareMode(false);
                }
            }]);

            // hide container
            var toolscontainer = me.element.find('.tools-container');
            toolscontainer.hide();

            var icon = me.element.find('div.icon');
            icon.on('click', function () {
                toolscontainer.toggle();
            });

        },
        /**
         * @method getToolOptions
         * Function to return plugin options
         * Currently, this needs more work to make it more general solution
         */
        getToolOptions: function () {
            var me = this;
            return me.buttonGroups;
        },
        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            div = div || this.element;
            var me = this;

            if (!style || !div) {
                return;
            }

            var resourcesPath = this.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/maptools/images/',
                styledImg = imgPath + 'menu-' + style + '.png',
                icon = div.find('.icon'),
                toolsContent = div.find('.tools-content'),
                blackOrWhite = style.split("-")[1];

            icon.css({
                'background-image': 'url("' + styledImg + '")'
            });

            if (blackOrWhite === "dark") {
                toolsContent.removeClass('light').addClass('dark'); //css({'background-color': '#424343'})                
            } else {
                toolsContent.removeClass('dark').addClass('light'); //css({'background-color': '#ffffff'})
            }

            var toolbarContent = me.element.find('.tools-content'),
                key,
                buttonKey,
                i;
            for (key in me.buttonGroups) {
                if (me.buttonGroups.hasOwnProperty(key)) {
                    var confGroup = me.buttonGroups[key];
                    var domGroup = toolbarContent.find('div.toolrow[tbgroup=' + me.toolbarId + '-' + confGroup.name + ']');
                    for (buttonKey in confGroup.buttons) {
                        if (confGroup.buttons.hasOwnProperty(buttonKey)) {
                            var confButton = confGroup.buttons[buttonKey];
                            var iconClassParts = confButton.iconCls.split("-");
                            var iconClass = iconClassParts[0];
                            var lastInd = iconClassParts.length - 1;
                            if (!(iconClassParts[lastInd] === "dark" || iconClassParts[lastInd] === "light")) {
                                iconClassParts.push('dark');
                                lastInd++;
                            }
                            for (i = 1; i < iconClassParts.length; i++) {
                                if (i < lastInd) {
                                    iconClass += '-' + iconClassParts[i];
                                } else {
                                    iconClass += '-' + blackOrWhite; //i.e. "rounded-light"
                                }
                            }
                            //var color = iconClass[iconClass.length-1];
                            var domButton = domGroup.find('.' + confButton.iconCls)
                                .removeClass(confButton.iconCls)
                                .addClass(iconClass);
                            confButton.iconCls = iconClass;
                        }
                    }
                }
            }
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });