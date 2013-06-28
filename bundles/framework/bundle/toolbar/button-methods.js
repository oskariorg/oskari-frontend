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
    addToolButton : function(pId, pGroup, pConfig) {
        if(!pId || !pGroup || !pConfig || !pConfig.callback) {
            // no config -> do nothing
            return;
        }
        var me = this;
        var toolbar = this.getToolbarContainer(pConfig ? pConfig.toolbarid : null, pConfig );
        var group = null;
        if(!this.buttons[pGroup]) {
            // create group if not existing
            this.buttons[pGroup] = {};
            group = this.templateGroup.clone();
            group.attr('tbgroup', pGroup);
            toolbar.append(group);
            this.groupsToToolbars[pGroup] = pConfig ? pConfig.toolbarid : null;
        }
        else {
            group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
        }
        
        if(this.buttons[pGroup][pId]) {
            // button already added, dont add again
            return;
        }
        
        // create button to requested group with requested id
        this.buttons[pGroup][pId] = pConfig;
        var button = this.templateTool.clone();
        button.attr('tool', pId);
        button.attr('title', pConfig['tooltip']);
        button.addClass(pConfig['iconCls']);
        
        // handling for state setting if the button was not yet on toolbar on setState
        if(this.selectedButton) {
            if(this.selectedButton.id == pId &&
               this.selectedButton.group == pGroup) {
                    button.addClass('selected');
                    pConfig['callback']();
               }
        }
        else {
            if(pConfig['selected']) {
                button.addClass('selected');
                this.selectedButton = {
                    id : pId,
                    group : pGroup
                };
            }
        }
        // if button config states this to be selected -> use as default button
        if(pConfig['selected']) {
            this.defaultButton = {
                id : pId,
                group : pGroup
            };
        }
        button.bind('click', function(event) {
            me._clickButton(pId, pGroup);
        });

		/* add first or last to group (default last)*/        
        if( pConfig['prepend']) {
            group.prepend(button); 
        } else {
            group.append(button);
        }

        // if button states to be disabled, disable button
        if(pConfig['disabled'] === true) {
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
    _clickButton : function(pId, pGroup) {
        if(!pId) {
            // use default button if ID param not given
            pId = this.defaultButton.id;
            pGroup = this.defaultButton.group;
        }
        
        var btn = this.buttons[pGroup][pId];
        if(btn.enabled == false) {
            return;
        }
        if(btn.sticky == true) {
            // notify components that tool has changed
            var e = this.sandbox.getEventBuilder('Toolbar.ToolSelectedEvent')(pId, pGroup);
            this.sandbox.notifyAll(e);
            // button stays on (==sticky) -> remove previous "sticky"
            this._removeToolSelections(pGroup);
            
            // highlight the button
            var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
            var group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
            var button = group.find('div.tool[tool=' + pId +']');
            button.addClass('selected');
            
            this.selectedButton = {
                id : pId,
                group : pGroup
            };
        }
        //toggle selection of this button
        if(btn.toggleSelection) {
            // highlight the button
            var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
            var group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
            var button = group.find('div.tool[tool=' + pId +']');

            if(button.hasClass('selected')) {
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
    _removeToolSelections : function(pGroup) {
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
    removeToolButton : function(pId, pGroup) {
        if(!pGroup) {
            return;
        }
        if(this.buttons[pGroup]) {
            var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
            var group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
            if(pId) {
                var button = group.find('div.tool[tool=' + pId +']');
                button.remove();
                this.buttons[pGroup][pId] = null;
                delete this.buttons[pGroup][pId];
                // TODO: check if no buttons left -> delete group also?
            }
            else {
                // delete whole group
                group.remove();
                this.buttons[pGroup] = null;
                delete this.buttons[pGroup];
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
    changeToolButtonState : function(pId, pGroup, pState) {
        if(!pGroup) {
            return;
        }
        if(this.buttons[pGroup]) {
            var toolbar = this.getToolbarContainer(this.groupsToToolbars[pGroup]);
            var group = toolbar.find('div.toolrow[tbgroup=' + pGroup +']');
            if(pId) {
                var button = group.find('div.tool[tool=' + pId +']');
                this.buttons[pGroup][pId].enabled = pState;
                if(pState) {
                    button.removeClass('disabled');
                }
                else {
                    button.addClass('disabled');
                }
            }
            else {
                var buttonContainers = group.find('div.tool');
                if(pState) {
                    buttonContainers.removeClass('disabled');
                }
                else {
                    buttonContainers.addClass('disabled');
                }
                for(var b in this.buttons[pGroup]) {
                    this.buttons[pGroup][b].enabled = pState; 
                }
            }
        }
    }
});

	