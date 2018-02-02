Oskari.clazz.category('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 'button-methods', {

    /**
     * @method addToolButton
     *
     * @param {String}
     *            pId identifier so we can manage the button with subsequent requests
     * @param {String}
     *            pGroup identifier for organizing buttons
     * @param {Object} pConfig
     *            JSON config for button
     *
     * Adds a button to the toolbar. Triggered usually by sending
     * Oskari.mapframework.bundle.toolbar.request.AddToolButtonRequest.
     */

    addToolButton: function (pId, pGroup, pConfig) {
        var me = this;
        if (!pId || !pGroup || !pConfig || !pConfig.callback) {
            // no config -> do nothing
            me.sandbox.printDebug("All parameters must be defined in AddToolButtonRequest");
            return;
        }
        var toolbar = me.getToolbarContainer(pConfig ? pConfig.toolbarid : null, pConfig),
            group = null,
            prefixedGroup = (pConfig.toolbarid || 'default') + '-' + pGroup;

        if (!me.buttons[prefixedGroup]) {
            // create group if not existing
            me.buttons[prefixedGroup] = {};
            group = me.templateGroup.clone();
            group.attr('tbgroup', prefixedGroup);
            toolbar.append(group);
            me.groupsToToolbars[prefixedGroup] = pConfig ? pConfig.toolbarid : null;
        } else {
            group = toolbar.find('div.toolrow[tbgroup=' + prefixedGroup + ']');
        }

        if (me.buttons[prefixedGroup][pId]) {
            me._checkToolChildrenPosition(pId, pGroup, pConfig);
            // button already added, dont add again
            return;
        }

        // create button to requested group with requested id
        me.buttons[prefixedGroup][pId] = pConfig;
        var button = me.templateTool.clone();
        button.attr('tool', pId);
        button.attr('title', pConfig.tooltip);
        button.attr('id', 'oskari_toolbar_' + pGroup + '_' + pId);
        button.attr('data-icon', pConfig.iconCls);
        button.attr('data-toggle-change-icon', pConfig.toggleChangeIcon);

        if (Oskari.util.keyExists(me.conf, 'style.toolStyle')) {
            //if style explicitly provided, add that as well
            var style = me.conf.style.toolStyle.indexOf('light') > -1 ? '-light': '-dark';

            button.addClass(pConfig.iconCls);
            if(!me._isAllreadyThemedIcon(pConfig)) {
                button.addClass(pConfig.iconCls + style);
            }
        } else if (me.conf.classes && me.conf.classes[pGroup] && me.conf.classes[pGroup][pId]) {
            ///TODO: this is the "old" way of handling stuff (as seen on the old realiable publisher1).
            //Remove, once we've migrated stuff into using the new way (=style info as part of the toolbar's config).
            button.addClass(me.conf.classes[pGroup][pId].iconCls);
        } else {
            button.addClass(pConfig.iconCls);
        }

        // handling for state setting if the button was not yet on toolbar on setState
        if (me.selectedButton) {
            if (me.selectedButton.id === pId &&
                    me.selectedButton.group === prefixedGroup) {
                button.addClass('selected');
                pConfig.callback(null);
            }
        } else {
            if (pConfig.selected) {
                button.addClass('selected');
                me.selectedButton = {
                    id: pId,
                    group: prefixedGroup
                };
            }
        }
        // if button config states this to be selected -> use as default button
        if (pConfig.selected) {
            me.defaultButton = {
                id: pId,
                group: prefixedGroup
            };
        }
        button.bind('click', function (event) {
            me._clickButton(pId, prefixedGroup);
        });

        var toolbarConfig = this.getToolBarConfigs(this.groupsToToolbars[prefixedGroup]);
        // If created hover style then change icon styles
        if(toolbarConfig && toolbarConfig.createdHover === true) {
            button.hover(function(){
                var buttonEl = jQuery(this);
                if(!buttonEl.hasClass('selected')) {
                    me._addHoverIcon(pConfig,toolbarConfig,button);
                }
                buttonEl.addClass('hover');

            }, function(){
                var buttonEl = jQuery(this);
                buttonEl.removeClass('hover');
                if(!buttonEl.hasClass('selected')) {
                    me._addButtonTheme(pConfig,toolbarConfig,button);
                }
            });
        }

        /* add first or last to group (default last)*/
        if (pConfig.prepend) {
            group.prepend(button);
        } else {
            group.append(button);
        }
        // prefer enabled flag over disabled
        if(pConfig.disabled === true) {
            pConfig.enabled = false;
            delete pConfig.disabled;
        }
        // if button states to be disabled, disable button
        if (pConfig.enabled === false) {
            button.addClass('disabled');
        }

        if(pConfig.childPosition) {
            me._createButtonChildren(pId, pGroup, button, pConfig);
            me._checkToolChildrenPosition(pId, pGroup, pConfig);
        }
        if(pConfig.iconCls) {
            me._addButtonTheme(pConfig,toolbarConfig,button);
        }
    },

    getMapModule: function(){
         return Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
     },

    _checkToolChildrenPosition: function(pId, pGroup, pConfig){
        var me = this,
            prefixedGroup = (pConfig.toolbarid || 'default') + '-' + pGroup,
            btn = this.buttons[prefixedGroup][pId],
            toolbar = me.getToolbarContainer(pConfig ? pConfig.toolbarid : null, pConfig),
            toolbarParent = toolbar.parents('.oskariui-center').find('div').first(),
            offset = toolbarParent.offset(),
            group = toolbar.find('div.toolrow[tbgroup=' + prefixedGroup + ']'),
            button = group.find('div.tool[tool=' + pId + ']');

        if(typeof btn.children === 'undefined' || !pConfig.childPosition) {
            return;
        }

        switch(pConfig.childPosition){
            case 'bottom':
                btn.children.css({
                    position: 'absolute',
                    'background-color': btn.activeColour || '#ffffff',
                    top: offset.top + toolbarParent.outerHeight() + 'px',
                    left: button.offset().left
                });
                break;
        }
    },
    _createButtonChildren: function(pId, pGroup, button, pConfig){
        var me = this,
            buttonChildren = jQuery('<div class="tool-children"></div>'),
            toolbar = me.getToolbarContainer(pConfig ? pConfig.toolbarid : null, pConfig),
            toolbarTopParent = toolbar.parents('.oskariui-center'),
            prefixedGroup = (pConfig.toolbarid || 'default') + '-' + pGroup,
            btn = this.buttons[prefixedGroup][pId],
            children = buttonChildren.clone();

        children.attr({
            'data-button-id': pId,
            'data-group-id': pGroup
        });
        toolbarTopParent.append(children);
        children.hide();
        btn.children = children;
    },

    /**
     * @method _clickButton
     * Handles click of a toolbar button and can be used to click a button
     * programmatically
     * @param {String}
     *            pId identifier for button
     * @param {String}
     *            pGroup identifier for button group
     * @private
     */
    _clickButton: function (pId, pGroup) {
        var me = this,
            e;
        if (!pId) {
            if(this.defaultButton) {
                // use default button if ID param not given
                pId = this.defaultButton.id;
                pGroup = this.defaultButton.group;
            } else {
                e = this.sandbox.getEventBuilder('Toolbar.ToolSelectedEvent')(pId, pGroup);
                this.sandbox.notifyAll(e);

                if(pGroup){
                    var btnGroup = this.buttons[pGroup];
                    for(var pId in btnGroup) {
                        this._deactiveTools(pId,pGroup);
                    }
                }

                this.container.find('.selected').removeClass('selected');
                return;
            }
        }

        var btn = this.buttons[pGroup][pId],
            toolbar,
            group,
            button;

        if (btn.enabled === false) {
            return;
        }

        toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
        group = toolbar.find('div.toolrow[tbgroup=' + pGroup + ']');
        button = group.find('div.tool[tool=' + pId + ']');

        if(typeof btn.selected === 'undefined') {
            btn.selected = button.hasClass('selected');
        }

        if (btn.sticky === true) {

            //only need to deactivate tools when sticky button
            this._deactiveTools(pId,pGroup);

            // button stays on (==sticky) -> remove previous "sticky"
            this._removeToolSelections(pGroup);
            this.selectedButton = {
                id: pId,
                group: pGroup
            };

            // highlight the button
            button.addClass('selected');

            if(btn.activeColour) {
                button.css('background-color', btn.activeColour);

                if(btn.toggleChangeIcon === true) {
                    // Remove button light and dark icons
                    me._removeIconThemes(button, btn);
                    me._changeButtonIconTheme(btn, button, btn.activeColour);
                }
            }
        }

        //toggle selection of this button
        if (btn.toggleSelection) {
            // highlight the button
            if (button.hasClass('selected')) {
                button.removeClass('selected');
                btn.selected = false;
            } else {
                button.addClass('selected');
                btn.selected = true;
            }
        }

        btn.callback(btn.children);

        if(!button.hasClass('selected') && button.hasClass('hover')){
            var toolbarConfig = this.getToolBarConfigs(this.groupsToToolbars[pGroup]);
            me._addHoverIcon(btn,toolbarConfig,button);
        }
        // notify components that tool has changed
        e = this.sandbox.getEventBuilder('Toolbar.ToolSelectedEvent')(pId, pGroup);
        this.sandbox.notifyAll(e);
    },
    _addHoverIcon: function(btnConfig,toolbarConfig,buttonEl){
        var me = this;
        if(!btnConfig || !btnConfig.iconCls || !toolbarConfig || !buttonEl || toolbarConfig.createdHover === false) {
            return;
        }
        me._removeIconThemes(buttonEl, btnConfig);

        var iconEnd = (Oskari.util.isDarkColor(toolbarConfig.colours.hover)) ? 'dark' : 'light';
        buttonEl.addClass(btnConfig.iconCls + '-' + iconEnd);
    },
    _removeIconThemes: function(btnEl, btnConfig){
        var me = this;
        if(!btnConfig || !btnConfig.iconCls || !btnEl) {
            return;
        }
        var iconCls = btnConfig.iconCls;
        if(me._isAllreadyThemedIcon(btnConfig)) {
            iconCls = (btnConfig.iconCls.indexOf('-light') > -1) ? btnConfig.iconCls.substring(0,btnConfig.iconCls.indexOf('-light')) : btnConfig.iconCls.substring(0,btnConfig.iconCls.indexOf('-dark'));
        }
        btnEl.removeClass(iconCls + '-light');
        btnEl.removeClass(iconCls + '-dark');
    },
    /**
     * Add button theme
     * @method  @private _addButtonTheme
     * @param {Object} btnConfig button config
     * @param {Object} toolbarConfig toolbar config
     * @param {Object} buttonEl  button jQuery element
     */
    _addButtonTheme: function(btnConfig, toolbarConfig, buttonEl){
        var me = this;
        if(!btnConfig || !btnConfig.iconCls || !buttonEl) {
            return;
        }
        me._removeIconThemes(buttonEl, btnConfig);

        if(me._isAllreadyThemedIcon(btnConfig)) {
            buttonEl.addClass(btnConfig.iconCls);
        } else if(toolbarConfig && toolbarConfig.colours && toolbarConfig.colours.background) {
            if(Oskari.util.getColorBrightness(toolbarConfig.colours.background) === 'light') {
                buttonEl.addClass(btnConfig.iconCls + '-light');
            } else {
                buttonEl.addClass(btnConfig.iconCls + '-dark');
            }
        }
        else {
            buttonEl.addClass(btnConfig.iconCls + '-' + this.getMapModule().getTheme());
        }
    },
    _isAllreadyThemedIcon: function(btnConfig){
        var isButtonConfig = (btnConfig && btnConfig.iconCls) ? true : false;
        var isLightTheme = (btnConfig.iconCls.indexOf('light') > -1) ? true : false;
        var isDarkTheme = (btnConfig.iconCls.indexOf('dark') > -1) ? true : false;

        if(!isButtonConfig) {
            return false;
        } else if(isLightTheme || isDarkTheme) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * Change button icon theme
     * @method  @priavate _changeButtonIconTheme
     * @param  {Object} btnConfig button config
     * @param  {Object} buttonEl  button jQuery element
     */
    _changeButtonIconTheme: function(btnConfig, buttonEl, color){
        var me = this;
        if(!btnConfig || !btnConfig.activeColour || !buttonEl) {
            return;
        }

        if(me._isAllreadyThemedIcon(btnConfig)) {
            //buttonEl.addClass(btnConfig.iconCls);
            var iconCls = (btnConfig.iconCls.indexOf('-light') > -1) ? btnConfig.iconCls.substring(0,btnConfig.iconCls.indexOf('-light')) : btnConfig.iconCls.substring(0,btnConfig.iconCls.indexOf('-dark'));
            if(buttonEl.hasClass('selected')) {
                if(Oskari.util.isLightColor(color)) {
                    buttonEl.addClass(iconCls + '-light');
                } else {
                    buttonEl.addClass(iconCls + '-dark');
                }
            } else {
                buttonEl.addClass(btnConfig.iconCls);
            }
        } else if(Oskari.util.isLightColor(color)) {
            buttonEl.addClass(btnConfig.iconCls + '-light');
        } else {
            buttonEl.addClass(btnConfig.iconCls + '-dark');
        }
    },

    _deactiveTools: function(pId,pGroup){
        var me = this;
        var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
        var group = toolbar.find('div.toolrow[tbgroup=' + pGroup + ']');
        var button = group.find('div.tool[tool=' + pId + ']');
        button.removeClass('selected');

        var tools = group.find('div.tool');

        for(var id in this.buttons[pGroup]) {
            var btn = this.buttons[pGroup][id];
            var button = group.find('div.tool[tool=' + id + ']');
            // Change default background color back

            if(btn.activeColour) {
                button.css('background-color', '');
                button.removeClass('selected');
                me._removeIconThemes(button, btn);
            }

            var toolbarConfig = this.getToolBarConfigs(this.groupsToToolbars[pGroup]);
            me._changeButtonIconTheme(btn, button, toolbarConfig.colours.background);

            // Change default icon back
            if(btn.toggleChangeIcon === true) {
                me._addButtonTheme(btn,button);
            }
        }
    },
    /**
     * @method _removeToolSelections
     * @private
     * Clears selection from all tools to make room for a new selection
     */
    _removeToolSelections: function (pGroup) {
        var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]),
            tools = toolbar.find('div.tool');
        tools.removeClass('selected');
    },
    /**
     * @method removeToolButton
     *
     * @param {String}
     *            pId identifier for a button (optional)
     * @param {String}
     *            pGroup identifier for group of buttons
     * @param {String}
     *            pToolbarId identifier for toolbar container
     *
     * Removes a button from the toolbar all whole group of buttons if pId is not defined.
     * Triggered usually by sending Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest.
     */
    removeToolButton: function (pId, pGroup, pToolbarId) {
        if (!pGroup) {
            return;
        }
        var toolbarId = pToolbarId || 'default';
        var prefixedGroup = toolbarId + '-' + pGroup;

        if (!this.buttons[prefixedGroup]) {
            return;
        }
        var toolbar = this.getToolbarContainer(this.groupsToToolbars[prefixedGroup]),
            group = toolbar.find('div.toolrow[tbgroup=' + prefixedGroup + ']');
        if (!pId) {
            // delete whole group
            group.remove();
            this.buttons[prefixedGroup] = null;
            delete this.buttons[prefixedGroup];
            // nothing to do after this
            return;
        }
        // remove individual button
        if(this.buttons[prefixedGroup] && this.buttons[prefixedGroup][pId] && this.buttons[prefixedGroup][pId].children) {
            this.buttons[prefixedGroup][pId].children.remove();
        }
        var button = group.find('div.tool[tool=' + pId + ']');
        button.remove();
        this.buttons[prefixedGroup][pId] = null;
        delete this.buttons[prefixedGroup][pId];

        var isSelected = (this.selectedButton && this.selectedButton.group && this.selectedButton.id) ? true : false;
        if(isSelected && this.selectedButton.group === prefixedGroup && this.selectedButton.id === pId) {
            this.selectedButton = null;
            delete this.selectedButton;
        }

        // check if no buttons left -> delete group also?
        var count = 0,
            key;
        for (key in this.buttons[prefixedGroup]) {
            if (this.buttons[prefixedGroup].hasOwnProperty(key)) {
                count++;
            }
        }
        if (count === 0) {
            group.remove();
            this.buttons[prefixedGroup] = null;
            delete this.buttons[prefixedGroup];
        }
    },
    isToolbarEmpty : function(toolbarId) {
        for (var key in this.buttons) {
            if(key.indexOf(toolbarId) === 0) {
                // if any of the groups startwith toolbarId -> not empty
                return false;
            }
        }
        return true;
    },
    /**
     * @method changeToolButtonState
     *
     * @param {String}
     *            pId identifier for a button (optional)
     * @param {String}
     *            pGroup identifier for group of buttons
     * @param {Boolean}
     *            pState  true if enabled, false to disable
     * @param {String}
     *            pToolbarId identifier for toolbar container
     *
     * Enables/disables a button from the toolbar all whole group of buttons if pId is not defined.
     * Triggered usually by sending Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest.
     */
    changeToolButtonState: function (pId, pGroup, pState, pToolbarId) {
        if (!pGroup) {
            return;
        }
        var prefixedGroup = (pToolbarId || 'default') + '-' + pGroup;
        if (this.buttons[prefixedGroup]) {
            var toolbar = this.getToolbarContainer(this.groupsToToolbars[prefixedGroup]),
                group = toolbar.find('div.toolrow[tbgroup=' + prefixedGroup + ']'),
                button,
                buttonContainers,
                b;
            if (pId) {
                button = group.find('div.tool[tool=' + pId + ']');
                this.buttons[prefixedGroup][pId].enabled = pState;
                if (pState) {
                    button.removeClass('disabled');
                } else {
                    button.addClass('disabled');
                }
            } else {
                buttonContainers = group.find('div.tool');
                if (pState) {
                    buttonContainers.removeClass('disabled');
                } else {
                    buttonContainers.addClass('disabled');
                }
                for (b in this.buttons[prefixedGroup]) {
                    if (this.buttons[prefixedGroup].hasOwnProperty(b)) {
                        this.buttons[prefixedGroup][b].enabled = pState;
                    }
                }
            }
        }
    }
});