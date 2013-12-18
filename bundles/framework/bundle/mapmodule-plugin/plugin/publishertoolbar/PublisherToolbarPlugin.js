/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin
 * Provides publisher toolbar container
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePublisherToolbarPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (conf) {
        var me = this;
        me.conf = conf || {};
        me.element = null;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me._scalebar = null;
        me.toolbarId = me.conf.toolbarId;
        me.toolbarContent = 'publishedToolbarContent';
        me.toolbarPopupContent = 'publishedToolbarPopupContent';
        me.toolbarContainer = 'publishedToolbarContainer'; // Note! this needs to match styles and templates

    }, {
        // templates for tools-mapplugin
        templates: {
            main: jQuery(
                '<div class="mapplugin tools" data-clazz="Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin">' +
                    "<div class='icon'></div>" +
                    "<div class='publishedToolbarContainer'>" +
                    "<div class='tools-top-arrow'></div>" +
                    "</div>" +
                    '</div>'
            ),
            container: jQuery("<div></div>"),
            publishedToolbarPopupContent: jQuery('<div class="publishedToolPopupContent"><h3></h3><div class="content"></div><div class="actions"></div></div>')
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
            me.buttonGroups = [
                {
                    'name': 'history',
                    'buttons': {
                        'history_back': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-history-back-dark',
                            tooltip: me.localization.history.back,
                            prepend: true,
                            enabled: false,
                            sticky: false,
                            callback: function () {
                                me._sandbox.request(me, reqBuilder('map_control_tool_prev'));
                            }
                        },
                        'history_forward': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-history-forward-dark',
                            tooltip: me.localization.history.next,
                            enabled: false,
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
                            iconCls: 'tool-measure-line-dark',
                            tooltip: me.localization.measure.line,
                            enabled: false,
                            sticky: true,
                            callback: function () {
                                var rn = 'map_control_measure_tool';
                                me._sandbox.request(me, gfiReqBuilder(false));
                                me._sandbox.request(me, reqBuilder(rn));
                            }
                        },
                        'measurearea': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-measure-area-dark',
                            tooltip: me.localization.measure.area,
                            enabled: false,
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

            this.requestHandlers = {
                toolContainerRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolContainerRequestHandler', me)
            };
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

            me._sandbox.addRequestHandler('Toolbar.ToolContainerRequest', this.requestHandlers.toolContainerRequestHandler);

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
                toolscontainer,
                sandbox = me._sandbox,
                container,
                content,
                containerClasses = 'top left',
                position = 1,
                containers = [me.toolbarContent, me.toolbarPopupContent],
                i,
                ilen;

            if (!me.element) {
                me.element = me.template.clone();
                container = me.element.find('.' + me.toolbarContainer);

                for (i = 0, ilen = containers.length; i < ilen; i++) {
                    // create configured containers
                    me.templates.container
                        .clone()
                        .attr("class", containers[i])
                        .appendTo(container);
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

            // hide container
            toolscontainer = me.element.find('.' + me.toolbarContainer);
            toolscontainer.hide();

            var icon = me.element.find('div.icon');
            icon.on('click', function () {
                toolscontainer.toggle();
            });

            if (me.conf && me.conf.font) {
                me.changeFont(me.conf.font, content);
            }

        },
        setToolbarContainer: function () {
            var me = this,
                sandbox = me._sandbox;
            var builder = sandbox.getRequestBuilder('Toolbar.ToolbarRequest');
            // FIXME use !==
            if (me.toolbarId && (me.toolbarContent) && builder != null) {
                // add toolbar when toolbarId and target container is configured
                // We assume the first container is intended for the toolbar
                sandbox.requestByName(me, 'Toolbar.ToolbarRequest', [me.toolbarId, 'add', {
                    title: me.localization.title,
                    show: false,
                    toolbarContainer: me.element.find('.' + me.toolbarContent),
                    closeBoxCallback: function () {
                        // this is useless, I guess.  
                        //view.prepareMode(false);
                    }
                }]);
            }
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
            var me = this;
            div = div || me.element;

            if (!style || !div) {
                return;
            }

            var resourcesPath = me.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/images/',
                styledImg = imgPath + 'menu-' + style + '.png',
                icon = div.find('.icon'),
                toolsContent = div.find('.' + me.toolbarContent),
                toolsPopupContent = div.find('.' + me.toolbarPopupContent),
                blackOrWhite = style.split("-")[1];

            icon.css({
                'background-image': 'url("' + styledImg + '")'
            });

            if (blackOrWhite === "dark") {
                toolsContent.removeClass('light').addClass('dark');
                toolsPopupContent.removeClass('light').addClass('dark');
            } else {
                toolsContent.removeClass('dark').addClass('light');
                toolsPopupContent.removeClass('dark').addClass('light');
            }

            var toolbarContent = me.element.find('.' + me.toolbarContent),
                key,
                buttonKey,
                i;
            // TODO
            // ridiculous way of manipulating dom objects based on configs
            // it would be so much better if all the tools would know their own view
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
        },

        /**
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @method changeFont
         * @param {String} fontId
         * @param {jQuery} div
         */
        changeFont: function (fontId, div) {
            div = div || this.element;

            if (!div || !fontId) {
                return;
            }

            // The elements where the font style should be applied to.
            var elements = [];
            elements.push(div.find('.publishedToolbarPopupContent'));

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;
            this.getMapModule().changeCssClasses(classToAdd, testRegex, elements);
        },

        /**
         * Set tool content container content based on the passed in data values.
         * data contains:
         * {String} data.class class definitions for the container
         * {String} data.title title for the container
         * {String} data.content content for the container
         * {Oskari.userinterface.component.Button[]} data.buttons buttons to show on dialog
         *
         * Note button handlers seem to malfunction if removed and reattached, therefore buttons are not reused.
         * className, title, and content can be reused.
         *
         * @method setToolContent
         * @param {Object} data
         */
        setToolContent: function (data) {
            var me = this,
                className = data.className || "", // defaults to empty
                title = data.title || "", // defaults to empty
                content = data.content || "", // defaults to empty
                buttons = data.buttons || [], // defaults to empty
                toolbarDiv = me.element.find('.' + me.toolbarContent),
                contentDiv = me.element.find('.' + className),
                appendContentDiv = false,
                actionDiv,
                i,
                contentHeight,
                reasonableHeight;

            if (contentDiv.length === 0) {
                // no container found, clone a new one
                contentDiv = me.templates.publishedToolbarPopupContent.clone();
                appendContentDiv = true;
            }
            contentDiv.find('h3').html(title);
            contentDiv.find('.content').html(content);

            if (className) {
                contentDiv.removeClass();
                contentDiv.addClass("publishedToolPopupContent " + className);
            }

            // buttons cannot be reattached so that they are functional, it also requires some other stuff, hence the TODO
            if (appendContentDiv && buttons && buttons.length > 0) {
                actionDiv = contentDiv.find('.actions');
                // TODO: save button references and clean up previous buttons
                actionDiv.empty();
                for (i = 0; i < buttons.length; i += 1) {
                    buttons[i].insertTo(actionDiv);
                }
            } else if (appendContentDiv) {
                // if no actions, the user can click on tool content to close it
                contentDiv.bind('click', function () {
                    me.resetToolContent();
                });
            }

            // attach to container
            if (appendContentDiv) {
                me.element.find('.' + me.toolbarPopupContent).append(contentDiv);
                toolbarDiv.hide();
            }

            return contentDiv;
        },

        /**
         * Set tool content container content based on the passed in values.
         */
        resetToolContent: function (data) {
            // clear and show toolbar
            var me = this,
                className = data.className || "publishedToolPopupContent", // defaults to publishedToolbarPopupContent
                toolbarDiv = me.element.find('.' + me.toolbarContent),
                contentDiv = me.element.find('.' + className);

            contentDiv.remove();
            toolbarDiv.show();
        },
        getToolConfs: function () {
            var me = this,
                confs = {},
                i,
                confGroup,
                j,
                confButton;
            for (i in me.buttonGroups) {
                if (me.buttonGroups.hasOwnProperty(i)) {
                    confGroup = me.buttonGroups[i];
                    // create button groups for confs
                    confs[confGroup.name] = {};

                    for (j in confGroup.buttons) {
                        if (confGroup.buttons.hasOwnProperty(j)) {
                            confButton = confGroup.buttons[j];
                            // create buttons and add necessary confs
                            confs[confGroup.name][j] = {
                                'iconCls': confButton.iconCls
                            };
                        }
                    }
                }
            }
            return confs;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });