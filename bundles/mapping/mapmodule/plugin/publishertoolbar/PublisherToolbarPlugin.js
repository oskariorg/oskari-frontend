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

        me.toolbarId = 'PublisherToolbar';
        me.toolbarContent = 'publishedToolbarContent';
        me.toolbarPopupContent = 'publishedToolbarPopupContent';
        me.toolbarContainer = 'publishedToolbarContainer'; // Note! this needs to match styles and templates
        me.activeTool;

        me._mobileDefs = {
            buttons:  {
                'mobile-publishedtoolbar': {
                    iconCls: 'mobile-menu',
                    tooltip: '',
                    sticky: true,
                    toggleChangeIcon: true,
                    show: true,
                    callback: function () {
                        if (me.popup && me.popup.isVisible()) {
                            me.popup.getJqueryContent().detach();
                            me.popup.close(true);
                            me.popup = null;
                            var sandbox = me.getSandbox();
                            var toolbarRequest = sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')(null, 'mobileToolbar-mobile-toolbar');
                            sandbox.request(me, toolbarRequest);
                        } else {
                            me._openToolsPopup();
                        }
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };

        me._buttons = conf.buttons || [];

    }, {
        // templates for tools-mapplugin
        templates: {
            main: jQuery(
                '<div class="mapplugin tools">' +
                '  <div class="icon menu-rounded-dark"></div>' +
                '  <div class="publishedToolbarContainer">' +
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
                sandbox = me.getSandbox(),
                reqBuilder = sandbox.getRequestBuilder(
                    'ToolSelectionRequest'
                ),
                gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest',
                gfiReqBuilder = sandbox.getRequestBuilder(gfiRn),
                mapmodule = me.getMapModule(),
                theme = mapmodule.getTheme(),
                wantedTheme = (theme === 'dark') ? 'light' : 'dark',
                themeColours = mapmodule.getThemeColours(wantedTheme);

            me.template = jQuery(me.templates.main);

            /////////////////////////////////
            // ADD TOOL CONFIGURATION HERE //
            /////////////////////////////////
            me.buttonGroups = [
                {
                    'name': 'basictools',
                    'buttons': {
                        'history_back': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-history-back',
                            tooltip: me._loc.history.back,
                            prepend: true,
                            sticky: false,
                            callback: function () {
                                if(sandbox.mapMode !== 'mapPublishMode') {
                                    if (!reqBuilder) {
                                        var reqBuilder = sandbox.getRequestBuilder(
                                            'ToolSelectionRequest'
                                        );
                                    }
                                    sandbox.request(
                                        me,
                                        reqBuilder('map_control_tool_prev')
                                    );
                                }
                            }
                        },
                        'history_forward': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-history-forward',
                            tooltip: me._loc.history.next,
                            sticky: false,
                            callback: function () {
                                if(sandbox.mapMode !== 'mapPublishMode') {
                                    if (!reqBuilder) {
                                        var reqBuilder = sandbox.getRequestBuilder(
                                            'ToolSelectionRequest'
                                        );
                                    }
                                    sandbox.request(
                                        me,
                                        reqBuilder('map_control_tool_next')
                                    );
                                }
                            }
                        },
                        'measureline': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-measure-line',
                            tooltip: me._loc.measure.line,
                            sticky: (sandbox.mapMode !== 'mapPublishMode') ? true : false,
                            toggleChangeIcon: (sandbox.mapMode !== 'mapPublishMode') ? true : false,
                            activeColour: themeColours.activeColour,
                            callback: function () {
                                if(sandbox.mapMode !== 'mapPublishMode') {
                                    if (me.activeTool === "measureline") {
                                        sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['measureline', true]);
                                        me.activeTool = undefined;
                                        var toolbarRequest = sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')(null, 'PublisherToolbar-basictools');
                                        sandbox.request(me, toolbarRequest);
                                    } else {
                                        if (me.activeTool === "measurearea") {
                                            sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['measurearea', true]);
                                            me.activeTool = undefined;
                                        }
                                        var rn = 'map_control_measure_tool';
                                        if (gfiReqBuilder) {
                                            sandbox.request(me, gfiReqBuilder(false));
                                        }
                                        if (!reqBuilder) {
                                            var reqBuilder = sandbox.getRequestBuilder(
                                                'ToolSelectionRequest'
                                            );
                                        }
                                        sandbox.request(me, reqBuilder(rn));
                                        me.activeTool = "measureline";
                                    }
                                }
                            }
                        },
                        'measurearea': {
                            toolbarid: me.toolbarId,
                            iconCls: 'tool-measure-area',
                            tooltip: me._loc.measure.area,
                            sticky: (sandbox.mapMode !== 'mapPublishMode') ? true : false,
                            toggleChangeIcon: (sandbox.mapMode !== 'mapPublishMode') ? true : false,
                            activeColour: themeColours.activeColour,
                            callback: function () {
                                if(sandbox.mapMode !== 'mapPublishMode') {
                                    if (me.activeTool === "measurearea") {
                                        sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['measurearea', true]);
                                        me.activeTool = undefined;
                                        var toolbarRequest = sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')(null, 'PublisherToolbar-basictools');
                                        sandbox.request(me, toolbarRequest);
                                    } else {
                                        if (me.activeTool === "measureline") {
                                            sandbox.postRequestByName('DrawTools.StopDrawingRequest', ['measureline', true]);
                                            me.activeTool = undefined;
                                        }
                                        var rn = 'map_control_measure_area_tool';
                                        if (gfiReqBuilder) {
                                            sandbox.request(me, gfiReqBuilder(false));
                                        }
                                        if (!reqBuilder) {
                                            var reqBuilder = sandbox.getRequestBuilder(
                                                'ToolSelectionRequest'
                                            );
                                        }
                                        sandbox.request(me, reqBuilder(rn));
                                        me.activeTool = "measurearea";
                                    }
                                }
                            }
                        }
                    }
                }
            ];
        },

        _createRequestHandlers: function () {
            return {
                'Toolbar.ToolContainerRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.toolbar.request.ToolContainerRequestHandler',
                    this
                )
            };
        },

        _setLayerToolsEditModeImpl: function () {
            if(!this.getElement()) {
                return;
            }
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
        _createControlElement: function (mapInMobileMode) {
            var me = this,
                el,
                sandbox = me.getSandbox();

            el = me.template.clone();
            if (!me._toolbarContent) {
                me._createToolbar(mapInMobileMode);
                me._addToolButtons();
            }
            return el;
        },

        teardownUI : function() {
            var me = this;

            //remove old element
            this.removeFromPluginContainer(this.getElement());

            if (me.popup && me.popup.isVisible()) {
                me.popup.getJqueryContent().detach();
                me.popup.close(true);
                me.popup = null;
            }
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function(mapInMobileMode, forced) {
            if(!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }

            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();
            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if(!forced && toolbarNotReady) {
                return true;
            }

            this.teardownUI();

            me._element = me._createControlElement(mapInMobileMode);

            var changeToolStyle = function(toolstyle, div){
                var div = div || me.getElement(),
                    toolStyle = toolstyle || me.getToolStyleFromMapModule();

                if (!div) {
                    return;
                }
                //no default exists for the menu icon, using rounded-dark instead...
                if (!toolStyle) {
                    toolStyle = "rounded-dark";
                }

                var imgPath = me.getImagePath(),
                    styledImg = imgPath + 'menu-' + toolStyle + '.png',
                    icon = div.find('.icon'),
                    blackOrWhite = toolStyle ? toolStyle.split('-')[1] : 'dark';

                var styledImgClass = 'menu-' + toolStyle;

                if (toolStyle === null) {
                    icon.removeAttr('style');
                } else {
                    icon.removeClass();
                    icon.addClass('icon menu-' + toolStyle);
                }


            };

            if (!toolbarNotReady && mapInMobileMode) {
                changeToolStyle(null, me._element);
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                this.addToPluginContainer(me._element);
                changeToolStyle();
                me._bindIcon();
            }

        },

        _createToolbar: function (mapInMobileMode) {
            var me = this,
                request,
                sandbox = me.getSandbox(),
                builder = sandbox.getRequestBuilder('Toolbar.ToolbarRequest'),
                mapmodule = me.getMapModule(),
                theme = mapmodule.getTheme(),
                wantedTheme = (theme === 'dark') ? 'light' : 'dark',
                themeColours = mapmodule.getThemeColours(wantedTheme);

            if (builder) {
                me._toolbarContent = me.templates.container.clone();
                request = builder(
                        me.toolbarId,
                        'add',
                        {
                            show: true,
                            toolbarContainer: me._toolbarContent,
                            disableHover: mapInMobileMode,
                            colours: {
                                hover: themeColours.hoverColour,
                                background: themeColours.backgroundColour
                            }
                        }
                );
                sandbox.request(me.getName(), request);

            }
        },

        _addToolButtons: function () {
            var me = this,
                sandbox = this.getSandbox(),
                toolbarId = me.toolbarId,
                addToolButtonBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            if(!addToolButtonBuilder) {
                return;
            }

            if (me._buttons.length === 0) {
                return;
            }

            for (group in me.buttonGroups) {
                if (me.buttonGroups.hasOwnProperty(group)) {
                    var buttonGroup = me.buttonGroups[group],
                        tool;
                    for (tool in buttonGroup.buttons) {
                        if (_.indexOf(me._buttons, tool) !== -1) {
                            var buttonConf = buttonGroup.buttons[tool];
                            buttonConf.toolbarid = toolbarId;
                            sandbox.request(this, addToolButtonBuilder(tool, buttonGroup.name, buttonGroup.buttons[tool]));
                        }
                    }
                }
            }
        },

        addToolButton: function (toolName) {
            var me = this,
                sandbox = me.getSandbox(),
                toolbarId = me.toolbarId,
                addToolButtonBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
            if(!addToolButtonBuilder) {
                return;
            }

            for (group in me.buttonGroups) {
                if (me.buttonGroups.hasOwnProperty(group)) {
                    var buttonGroup = me.buttonGroups[group];
                    if (buttonGroup.buttons[toolName]) {
                        var buttonConf = buttonGroup.buttons[toolName];
                        buttonConf.toolbarid = toolbarId;
                        sandbox.request(this, addToolButtonBuilder(toolName, buttonGroup.name, buttonGroup.buttons[toolName]));
                    }
                }
            }
        },

        removeToolButton: function (toolName) {
            var me = this,
                sandbox = me.getSandbox(),
                toolbarId = me.toolbarId;

            if (!sandbox) {
                return;
            }
            var removeToolButtonBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');

            if(!removeToolButtonBuilder) {
                return;
            }

            for (group in me.buttonGroups) {
                if (me.buttonGroups.hasOwnProperty(group)) {
                    var buttonGroup = me.buttonGroups[group];
                    if (buttonGroup.buttons[toolName]) {
                        var buttonConf = buttonGroup.buttons[toolName];
                        buttonConf.toolbarid = toolbarId;
                        sandbox.request(this, removeToolButtonBuilder(toolName, buttonGroup.name, toolbarId));
                    }
                }
            }

        },

        _bindIcon: function () {
            var me = this,
                el = me.getElement(),
                icon = el.find('div.icon');

            icon.unbind('click');
            icon.bind('click', function () {
                if (me.popup && me.popup.isVisible()) {
                    me.popup.getJqueryContent().detach();
                    me.popup.close(true);
                    me.popup = null;
                } else {
                    me._openToolsPopup();
                }
            });
        },

        _openToolsPopup: function () {
            var me = this,
                conf = me.conf,
                mapmodule = me.getMapModule(),
                isMobile = Oskari.util.isMobile(),
                sandbox = me.getSandbox(),
                popupService = sandbox.getService('Oskari.userinterface.component.PopupService');

            var popupTitle = "Toolbar",
                el = jQuery(me.getMapModule().getMobileDiv()).find('#oskari_toolbar_mobile-toolbar_mobile-publishedtoolbar'),
                topOffsetElement = jQuery('div.mobileToolbarDiv'),
                theme = mapmodule.getTheme(),
                wantedTheme = (theme === 'dark') ? 'light' : 'dark',
                themeColours = mapmodule.getThemeColours(wantedTheme);

            me.popup = popupService.createPopup();
            me.popup.addClass('toolbar-popup');
            me.popup.setColourScheme({"bgColour": "#e6e6e6"});
            if (isMobile) {
                popupService.closeAllPopups(true);
            }
            me.popup.show(undefined, me._toolbarContent);

            if (isMobile) {
                me.popup.moveTo(el, 'bottom', true, topOffsetElement);
                me.popup.addClass('mobile');
            } else {
                me.popup.moveTo(me.getElement(), 'bottom', true);
            }

            me.popup.setColourScheme({
                'bodyBgColour': themeColours.backgroundColour
            });

           if(sandbox.mapMode === 'mapPublishMode') {
               var request,
                    builder = sandbox.getRequestBuilder('Toolbar.ToolbarRequest'),
                    mapmodule = me.getMapModule(),
                    theme = mapmodule.getTheme(),
                    wantedTheme = (theme === 'dark') ? 'light' : 'dark',
                    themeColours = mapmodule.getThemeColours(wantedTheme);

                if (builder) {
                    request = builder(
                            me.toolbarId,
                            'update',
                            {
                                colours: {
                                    hover: themeColours.hoverColour,
                                    background: themeColours.backgroundColour
                                }
                            }
                    );
                    sandbox.request(me.getName(), request);

                }
            }

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
                            toolbarContainer: me.getElement().find('.' + me.toolbarContent)
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
        changeToolStyle: function (toolstyle, div) {
            var me = this;
            me.redrawUI();
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
        },

        _stopPluginImpl: function (sandbox) {
            this.teardownUI();

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