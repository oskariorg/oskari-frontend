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
        if (!pId || !pGroup || !pConfig || !pConfig.callback) {
            // no config -> do nothing
            return;
        }
        var me = this;
        var toolbar = this.getToolbarContainer(pConfig ? pConfig.toolbarid : null, pConfig);
        var group = null;
        var prefixedGroup = (pConfig ? pConfig.toolbarid ? pConfig.toolbarid : 'default' : 'default') + '-' + pGroup;
        if (!this.buttons[prefixedGroup]) {
            // create group if not existing
            this.buttons[prefixedGroup] = {};
            group = this.templateGroup.clone();
            group.attr('tbgroup', prefixedGroup);
            toolbar.append(group);
            this.groupsToToolbars[prefixedGroup] = pConfig ? pConfig.toolbarid : null;
        } else {
            group = toolbar.find('div.toolrow[tbgroup=' + prefixedGroup + ']');
        }

        if (this.buttons[prefixedGroup][pId]) {
            // button already added, dont add again
            return;
        }

        // create button to requested group with requested id
        this.buttons[prefixedGroup][pId] = pConfig;
        var button = this.templateTool.clone();
        button.attr('tool', pId);
        button.attr('title', pConfig.tooltip);
        button.addClass(pConfig.iconCls);

        // handling for state setting if the button was not yet on toolbar on setState
        if (this.selectedButton) {
            // FIXME use ===
            if (this.selectedButton.id == pId &&
                this.selectedButton.group == prefixedGroup) {
                button.addClass('selected');
                pConfig.callback();
            }
        } else {
            if (pConfig.selected) {
                button.addClass('selected');
                this.selectedButton = {
                    id: pId,
                    group: prefixedGroup
                };
            }
        }
        // if button config states this to be selected -> use as default button
        if (pConfig.selected) {
            this.defaultButton = {
                id: pId,
                group: prefixedGroup
            };
        }
        button.bind('click', function (event) {
            me._clickButton(pId, prefixedGroup);
        });

        /* add first or last to group (default last)*/
        if (pConfig.prepend) {
            group.prepend(button);
        } else {
            group.append(button);
        }

        // if button states to be disabled, disable button
        if (pConfig.disabled === true) {
            button.addClass('disabled');
        }
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
        if (!pId) {
            // use default button if ID param not given
            pId = this.defaultButton.id;
            pGroup = this.defaultButton.group;
        }

        var btn = this.buttons[pGroup][pId],
            toolbar,
            group,
            button;
        // FIXME use ===
        if (btn.enabled == false) {
            return;
        }
        // FIXME use ===
        if (btn.sticky == true) {
            // notify components that tool has changed
            var e = this.sandbox.getEventBuilder('Toolbar.ToolSelectedEvent')(pId, pGroup);
            this.sandbox.notifyAll(e);
            // button stays on (==sticky) -> remove previous "sticky"
            this._removeToolSelections(pGroup);

            // highlight the button
            toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
            group = toolbar.find('div.toolrow[tbgroup=' + pGroup + ']');
            button = group.find('div.tool[tool=' + pId + ']');
            button.addClass('selected');

            this.selectedButton = {
                id: pId,
                group: pGroup
            };
        }
        //toggle selection of this button
        if (btn.toggleSelection) {
            // highlight the button
            toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
            group = toolbar.find('div.toolrow[tbgroup=' + pGroup + ']');
            button = group.find('div.tool[tool=' + pId + ']');

            if (button.hasClass('selected')) {
                button.removeClass('selected');
            } else {
                button.addClass('selected');
            }
        }


        btn.callback();
    },
    /**
     * @method _removeToolSelections
     * @private
     * Clears selection from all tools to make room for a new selection
     */
    _removeToolSelections: function (pGroup) {
        var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
        var tools = toolbar.find('div.tool');
        tools.removeClass('selected');
    },
    /**
     * @method removeToolButton
     *
     * @param {String}
     *            pId identifier for a button (optional)
     * @param {String}
     *            pGroup identifier for group of buttons
     *
     * Removes a button from the toolbar all whole group of buttons if pId is not defined.
     * Triggered usually by sending Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest.
     */
    removeToolButton: function (pId, pGroup, pToolbarId) {
        if (!pGroup) {
            return;
        }
        var prefixedGroup = pGroup;
        if(pToolbarId) {
            prefixedGroup = pToolbarId + '-' + prefixedGroup;
        } else  {
            prefixedGroup = 'default-' + prefixedGroup;            
        }
        if (this.buttons[prefixedGroup]) {
            var toolbar = this.getToolbarContainer(this.groupsToToolbars[prefixedGroup]);
            var group = toolbar.find('div.toolrow[tbgroup=' + prefixedGroup + ']');
            if (pId) {
                var button = group.find('div.tool[tool=' + pId + ']');
                button.remove();
                this.buttons[prefixedGroup][pId] = null;
                delete this.buttons[prefixedGroup][pId];
                // TODO: check if no buttons left -> delete group also?
                var count = 0
                for (var key in this.buttons[prefixedGroup]) {
                    if (this.buttons[prefixedGroup].hasOwnProperty(key)) { 
                        count++;
                    }
                }
                if(count == 0){
                    group.remove();
                    this.buttons[prefixedGroup] = null;
                    delete this.buttons[prefixedGroup];                    
                }
            } else {
                // delete whole group
                group.remove();
                this.buttons[prefixedGroup] = null;
                delete this.buttons[prefixedGroup];
            }
        }
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
     *
     * Enables/disables a button from the toolbar all whole group of buttons if pId is not defined.
     * Triggered usually by sending Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest.
     */
    changeToolButtonState: function (pId, pGroup, pState) {
        if (!pGroup) {
            return;
        }
        if (this.buttons[pGroup]) {
            var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]),
                group = toolbar.find('div.toolrow[tbgroup=default-' + pGroup + ']'),
                button,
                buttonContainers,
                b;
            if (pId) {
                button = group.find('div.tool[tool=' + pId + ']');
                this.buttons[pGroup][pId].enabled = pState;
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
                for (b in this.buttons[pGroup]) {
                    if (this.buttons[pGroup].hasOwnProperty(b)) {
                        this.buttons[pGroup][b].enabled = pState;
                    }
                }
            }
        }
    }
});