/**
 * @class Oskari.userinterface.component.TabContainer
 *
 * Provides a base layout/container for adding a set of
 * Oskari.userinterface.component.TabPanel.
 */
Oskari.clazz.define('Oskari.userinterface.component.TabContainer',

    /**
     * @method create called automatically on construction
     * @static
     * @param {String} pEmptyMsg message that will be displayed if there is no tabs added
     */
    function (pEmptyMsg) {
        this.extraContent = null;
        this.panels = [];
        this.tabChangeListeners = [];
        if (pEmptyMsg) {
            this.emptyMsg = pEmptyMsg;
        } else {
            this.emptyMsg = 'No content';
        }
        this.template = jQuery('<div class="oskariTabs">' + this.emptyMsg + '</div>');

        this.templateTabs = jQuery('<nav class="tabsHeader"><ul class="tabsItem"></ul></nav>' +
            '<div class="tabsContent tabsContentItem"></div>');

        this.templateExtra = jQuery('<div class="extraContent"></div>');

        this.ui = this.template.clone();
    }, {
        /**
         * @method addPanel
         * Adds the given panel to the set of tabs shown.
         * The first tab is selected as active immediately on add.
         * @param {Oskari.userinterface.component.TabPanel} panel
         */
        addPanel: function (panel, first) {
            var me = this,
                content,
                headerContainer,
                header,
                link;
            if (this.panels.length === 0) {
                content = this.templateTabs.clone();
                this.ui.html(content);
                if (typeof panel.getPriority() !== 'number') {
                    panel.setPriority(1.0);
                }
            } else {
                if (first) {
                    // Set as first item
                    panel.setPriority(this.panels[0].getPriority()-1.0);
                } else if (typeof panel.getPriority() !== 'number') {
                    // Set as last item
                    panel.setPriority(this.panels[this.panels.length-1].getPriority()+1.0);
                }
            }

            // check the correct panel index corresponding to the priority value
            var index = 0;
            while (index < this.panels.length) {
                if (panel.getPriority() < this.panels[index].getPriority()) {
                    break;
                }
                index = index+1;
            }

            // ensure order is correct
            headerContainer = this.ui.find('ul.tabsItem');
            header = panel.getHeader();
            if (index === 0) {
                headerContainer.prepend(header);
                this.select(panel);
            } else {
                headerContainer.children().eq(index-1).after(header);
            }

            panel.insertAt(this.ui.find('div.tabsContentItem'),index);
            this.panels.splice(index,0,panel);
            if (this.panels.length === 1) {
                // select first by default
                this.select(panel);
            }

            link = header.find('a');
            // bind tab changing
            link.bind('click', function () {
                me.select(panel);
                return false;
            });
        },

        setExtra: function (extra) {
            this.extraContent = this.templateExtra.clone();
            this.extraContent.append(extra);
            this.ui.find('.tabsHeader').append(this.extraContent);
        },

        removeExtra: function () {
            if (this.extraContent) {
                this.extraContent.remove();
            }
        },

        /**
         * @method addTabChangeListener
         * Adds a listener function that should be called when tab selection changes
         * (tab is selected).
         * The function will receive two parameters:
         * - first the previously selected panel
         * - second the newly selected panel
         * function(previousTab, newTab)
         * If previousTab is undefined, this was the first tab added.
         * If newTab is undefined, all tabs have been removed.
         * @param {Function} pCallback function to call when tabs are changed
         */
        addTabChangeListener: function (pCallback) {
            this.tabChangeListeners.push(pCallback);
        },

        /**
         * @method select
         * Selects the given panel programmatically and notifies tabChangeListeners if any.
         * @param {Oskari.userinterface.component.TabPanel} panel
         */
        select: function (panel) {
            var previousPanel = null,
                i,
                headerContainer,
                tabs;
            // get previous panel for listeners if any
            for (i = 0; i < this.panels.length; i += 1) {
                if (this.isSelected(this.panels[i])) {
                    previousPanel = this.panels[i];
                    previousPanel.handleSelection(false);
                    break;
                }
            }
            headerContainer = this.ui.find('ul');
            headerContainer.find('li').removeClass('active');
            // only direct children since we can have another tabcontainer inside
            tabs = this.ui.children().children('div.tab-content');
            tabs.hide();
            panel.getHeader().addClass('active');
            panel.getContainer().show();
            panel.handleSelection(true);
            // notify listeners
            for (i = 0; i < this.tabChangeListeners.length; i += 1) {
                this.tabChangeListeners[i](previousPanel, panel);
            }
        },

        /**
         * @method isSelected
         * Tests if given panel is currently selected/active
         * @param {Oskari.userinterface.component.TabPanel} pPanel
         * @return {Boolean} true if given panel is currently selected
         */
        isSelected: function (panel) {
            return panel.getHeader().hasClass('active');
        },

        /**
         * @method removePanel
         * Removes the given panel from the set of tabs shown.
         * The first tab is selected as active if currently selected tab is removed.
         * If the tab was the last one, tabchangelisteners will receive the second parameter as undefined.
         * @param {Oskari.userinterface.component.TabPanel} pPanel
         */
        removePanel: function (pPanel) {
            var panel = null,
                i;
            for (i = 0; i < this.panels.length; i += 1) {
                if (this.panels[i] === pPanel) {
                    panel = this.panels[i];
                    this.panels.splice(i, 1);
                    break;
                }
            }
            if (this.panels.length === 0) {
                this.ui.html(this.emptyMsg);
                for (i = 0; i < this.tabChangeListeners.length; i += 1) {
                    // notify tabs have changed
                    // giving only removed panel & new panel as undefined -> should be considered all tabs were removed
                    this.tabChangeListeners[i](pPanel);
                }
            } else {
                this.select(this.panels[0]);
            }
            if (panel) {
                panel.destroy();
                // TODO: remove header
                // notify components of layer removal
                return true;
            }
            return false;
        },

        getElement: function () {
            return this.ui;
        },

        /**
         * @method insertTo
         * Adds this set of tabs to given container.
         * @param {jQuery} container reference to DOM element
         */
        insertTo: function (container) {
            container.append(this.ui);
        },

        destroy: function () {
            var i;
            for (i = this.panels.length; i >= 0; i -= 1) {
                if (this.panels[i] && this.panels[i].destroy) {
                    this.panels[i].destroy();
                }
            }
            this.panels = [];
            this.ui.remove();
        }
    });
