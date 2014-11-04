/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin
 * Provides publisher toolbar container
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePublisherToolbarPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (conf) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin';
        me._defaultLocation = 'top left';
        me._index = 0;
        me._name = 'PublisherToolbarPlugin';

        me.toolbarId = conf.toolbarId;
        me.toolbarContent = 'publishedToolbarContent';
        me.toolbarPopupContent = 'publishedToolbarPopupContent';
        me.toolbarContainer = 'publishedToolbarContainer'; // Note! this needs to match styles and templates
    }, {
        // templates for tools-mapplugin
        templates: {
            main: jQuery(
                '<div class="mapplugin tools">' +
                '  <div class="icon menu-rounded-dark"></div>' +
                '  <div class="publishedToolbarContainer">' +
                '    <div class="tools-top-arrow"></div>' +
                '  </div>' +
                '</div>'
            ),
            container: jQuery('<div></div>'),
            publishedToolbarPopupContent: jQuery(
                '<div class="publishedToolPopupContent">' +
                '  <h3></h3>' +
                '  <div class="content"></div>' +
                '  <div class="actions"></div>' +
                '</div>'
            )
        },

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         *
         *
         */
        _initImpl: function () {
            var me = this,
                reqBuilder = me.getSandbox().getRequestBuilder(
                    'ToolSelectionRequest'
                ),
                gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest',
                gfiReqBuilder = me.getSandbox().getRequestBuilder(gfiRn);

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
                            tooltip: me._loc.history.back,
                            prepend: true,
                            enabled: false,
                            sticky: false,
                            callback: function () {
                                me.getSandbox().request(
                                    me,
                                    reqBuilder('map_control_tool_prev')
                                );
                            }
                        },
                        'history_forward': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-history-forward-dark',
                            tooltip: me._loc.history.next,
                            enabled: false,
                            sticky: false,
                            callback: function () {
                                me.getSandbox().request(
                                    me,
                                    reqBuilder('map_control_tool_next')
                                );
                            }
                        }
                    }
                }, {
                    'name': 'basictools',
                    'buttons': {
                        'measureline': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-measure-line-dark',
                            tooltip: me._loc.measure.line,
                            enabled: false,
                            sticky: true,
                            callback: function () {
                                var rn = 'map_control_measure_tool';
                                me.getSandbox().request(me, gfiReqBuilder(false));
                                me.getSandbox().request(me, reqBuilder(rn));
                            }
                        },
                        'measurearea': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-measure-area-dark',
                            tooltip: me._loc.measure.area,
                            enabled: false,
                            sticky: true,
                            callback: function () {
                                var rn = 'map_control_measure_area_tool';
                                me.getSandbox().request(me, gfiReqBuilder(false));
                                me.getSandbox().request(me, reqBuilder(rn));
                            }
                        }
                    }
                }
            ];
        },

        _createRequestHandlers: function () {
            return {
                'Toolbar.ToolContainerRequest': Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolContainerRequestHandler', this)
            };
        },

        _setLayerToolsEditModeImpl: function () {
            if (this.inLayerToolsEditMode()) {
                // close toolbar
                this.getElement().find('.' + this.toolbarContainer).hide();
                // disable icon
                this.getElement().find('div.icon').unbind('click');
            } else {
                // enable icon
                this._bindIcon();
            }
        },

        show: function (isShown) {
            var showHide = isShown ? 'show' : 'hide';
            this.getSandbox().requestByName(
                this,
                'Toolbar.ToolbarRequest',
                [
                    this.toolbarId,
                    showHide
                ]
            );
        },

        destroy: function () {
            this.getSandbox().requestByName(
                this,
                'Toolbar.ToolbarRequest',
                [
                    this.toolbarId,
                    'remove'
                ]
            );
        },

        changeName: function (title) {
            this.getSandbox().requestByName(
                this,
                'Toolbar.ToolbarRequest',
                [
                    this.toolbarId,
                    'changeName',
                    title
                ]
            );
        },

        /**
         * @private @method _createControlElement
         */
        _createControlElement: function () {
            var me = this,
                el,
                toolscontainer,
                sandbox = me.getSandbox(),
                container,
                containers = [me.toolbarContent, me.toolbarPopupContent],
                i,
                ilen;

            el = me.template.clone();
            container = el.find('.' + me.toolbarContainer);

            for (i = 0, ilen = containers.length; i < ilen; i += 1) {
                // create configured containers
                me.templates.container
                    .clone()
                    .attr('class', containers[i])
                    .appendTo(container);
            }

            // hide container
            toolscontainer = el.find('.' + me.toolbarContainer);
            toolscontainer.hide();
            return el;
        },

        refresh: function () {
            var me = this,
                conf = me.getConfig();

            me._bindIcon();

            if (conf) {
                if (conf.toolStyle) {
                    me.changeToolStyle(conf.toolStyle, me.getElement());
                }
                if (conf.font) {
                    me.changeFont(conf.font, me.getElement());
                }
            }
        },

        _bindIcon: function () {
            var me = this,
                el = me.getElement(),
                icon = el.find('div.icon'),
                toolscontainer = el.find('.' + me.toolbarContainer);

            icon.unbind('click');
            icon.bind('click', function () {
                toolscontainer.toggle();
            });
        },

        setToolbarContainer: function () {
            var me = this,
                sandbox = me.getSandbox(),
                builder = sandbox.getRequestBuilder('Toolbar.ToolbarRequest');

            if (me.toolbarId && (me.toolbarContent) && builder !== null && builder !== undefined) {
                // add toolbar when toolbarId and target container is configured
                // We assume the first container is intended for the toolbar
                sandbox.requestByName(
                    me,
                    'Toolbar.ToolbarRequest',
                    [
                        me.toolbarId,
                        'add',
                        {
                            title: me._loc.title,
                            show: false,
                            toolbarContainer: me.getElement().find('.' + me.toolbarContent),
                            closeBoxCallback: function () {
                                // this is useless, I guess.  
                                //view.prepareMode(false);
                            }
                        }
                    ]
                );
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
            div = div || me.getElement();

            if (!div) {
                return;
            }

            // 
            var resourcesPath = me.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/publishertoolbar/images/',
                styledImg = imgPath + 'menu-' + style + '.png',
                icon = div.find('.icon'),
                toolsContent = div.find('.' + me.toolbarContent),
                toolsPopupContent = div.find('.' + me.toolbarPopupContent),
                blackOrWhite = style ? style.split('-')[1] : 'dark';

            var styledImgClass = 'menu-' + style;

            if (style === null) {
                icon.removeAttr('style');
                toolsContent.removeClass('light', 'dark');
                toolsPopupContent.removeClass('light', 'dark');
            } else {
                icon.removeClass();
                icon.addClass('icon menu-' + style);

                if (blackOrWhite === 'dark') {
                    toolsContent.removeClass('light').addClass('dark');
                    toolsPopupContent.removeClass('light').addClass('dark');
                } else {
                    toolsContent.removeClass('dark').addClass('light');
                    toolsPopupContent.removeClass('dark').addClass('light');
                }
            }

            var toolbarContent = me.getElement().find('.' + me.toolbarContent),
                key,
                buttonKey,
                i;
            // TODO
            // ridiculous way of manipulating dom objects based on configs
            // it would be so much better if all the tools would know their own view
            for (key in me.buttonGroups) {
                if (me.buttonGroups.hasOwnProperty(key)) {
                    var confGroup = me.buttonGroups[key],
                        domGroup = toolbarContent.find('div.toolrow[tbgroup=' + me.toolbarId + '-' + confGroup.name + ']');
                    for (buttonKey in confGroup.buttons) {
                        if (confGroup.buttons.hasOwnProperty(buttonKey)) {
                            var confButton = confGroup.buttons[buttonKey],
                                iconClassParts = confButton.iconCls.split('-'),
                                iconClass = iconClassParts[0],
                                lastInd = iconClassParts.length - 1;
                            if (!(iconClassParts[lastInd] === 'dark' || iconClassParts[lastInd] === 'light')) {
                                iconClassParts.push('dark');
                                lastInd += 1;
                            }
                            for (i = 1; i < iconClassParts.length; i += 1) {
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
         * @method changeFont
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @param {String} fontId
         * @param {jQuery} div
         */
        changeFont: function (fontId, div) {
            div = div || this.getElement();

            if (!div || !fontId) {
                return;
            }

            // The elements where the font style should be applied to.
            var elements = [];
            elements.push(div.find('.publishedToolbarPopupContent'));

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;
            this.getMapModule().changeCssClasses(
                classToAdd,
                testRegex,
                elements
            );
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
                className = data.className || '', // defaults to empty
                title = data.title || '', // defaults to empty
                content = data.content || '', // defaults to empty
                buttons = data.buttons || [], // defaults to empty
                toolbarDiv = me.getElement().find('.' + me.toolbarContent),
                contentDiv = me.getElement().find('.' + className),
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
                contentDiv.addClass('publishedToolPopupContent ' + className);
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
                me.getElement().find('.' + me.toolbarPopupContent).append(contentDiv);
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
                className = data.className || 'publishedToolPopupContent', // defaults to publishedToolbarPopupContent
                toolbarDiv = me.getElement().find('.' + me.toolbarContent),
                contentDiv = me.getElement().find('.' + className);

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
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });