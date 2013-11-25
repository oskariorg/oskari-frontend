/**
 * @class Oskari.userinterface.component.TabDropdownContainer
 *
 * Provides a base layout/container for adding a set of
 * Oskari.userinterface.component.TabPanel.
 */
Oskari.clazz.define('Oskari.userinterface.component.TabDropdownContainer',

    /**
     * @method create called automatically on construction
     * @static
     * @param {String} pEmptyMsg message that will be displayed if there is no tabs added
     */

    function (pEmptyMsg) {

        this.panels = [];
        this.tabChangeListeners = [];
        if (pEmptyMsg) {
            this.emptyMsg = pEmptyMsg;
        } else {
            this.emptyMsg = 'No content';
        }
        this.template = jQuery('<div class="oskariTabs">' + this.emptyMsg + '</div>');
        this.templateTabOption = jQuery('<option></option>');

        this.templateTabs = jQuery('<div class="tabsHeader"><ul><li><select name="tabs"></select></li></ul></div><br clear="all"/>' +
            '<div class="tabsContent"></div>');

        this.ui = this.template.clone();
    }, {
        /**
         * @method addPanel
         * Adds the given panel to the set of tabs shown.
         * The first tab is selected as active immediately on add.
         * @param {Oskari.userinterface.component.TabPanel} panel
         */
        addPanel: function (panel) {
            var me = this;
            if (this.panels.length === 0) {
                var content = this.templateTabs.clone();
                this.ui.html(content);
            }
            var headerContainer = this.ui.find('ul li select'),
                header = this.templateTabOption.clone();
            header.attr('id', 'layer-id-' + panel.getId());
            header.append(panel.getTitle());
            headerContainer.append(header);
            panel.setHeader(header);

            panel.insertTo(this.ui.find('div.tabsContent'));
            this.panels.push(panel);
            if (this.panels.length === 1) {
                // select first by default
                this.select(panel);
                headerContainer.bind("change", function () {
                    me.select(me.panels[this.selectedIndex]);
                });
            }
        },

        /**
         * @method updatePanel
         * Updates the header of the given panel.
         * @param {Oskari.userinterface.component.TabPanel} panel
         */
        updatePanel: function (panel) {
            var me = this,
                headerContainer = me.ui.find('ul li select'),
                i,
                header;

            for (i = 0; i < headerContainer.find('option').length; i++) {
                header = jQuery(headerContainer.find('option')[i]);
                if (header.attr('id') === 'layer-id-' + panel.getId()) {
                    header.html(panel.getTitle());
                }
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
                i;
            if (this.tabChangeListeners.length > 0) {
                // get previous panel for listeners if any
                for (i = 0; i < this.panels.length; i++) {
                    if (this.isSelected(this.panels[i])) {
                        previousPanel = this.panels[i];
                        break;
                    }
                }
            }
            //var tabs = this.ui.find('> div.tab-content');
            var tabs = this.ui.children().children('div.tab-content');
            tabs.hide();

            var headerContainer = this.ui.find('ul li select');
            var options = headerContainer.find('option');
            options.removeAttr('selected');
            var panelIndex = this._getPanelIndex(panel);
            jQuery(options[panelIndex]).attr('selected', 'selected');
            panel.getContainer().show();
            // notify listeners
            for (i = 0; i < this.tabChangeListeners.length; i++) {
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
            var headerContainer = this.ui.find('ul li select :selected');
            return headerContainer.index() === this._getPanelIndex(panel);
        },
        /**
         * @method _getPanelIndex
         * Returns the index location for the panel
         * @private
         * @param {Oskari.userinterface.component.TabPanel} pPanel
         * @return {Number} panels index or -1 if not found
         */
        _getPanelIndex: function (panel) {
            var i;
            for (i = 0; i < this.panels.length; i++) {
                // FIXME use === if possible, id or smthn if not
                if (this.panels[i].getId() === panel.getId()) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * @method addPanel
         * Removes the given panel from the set of tabs shown.
         * The first tab is selected as active if currently selected tab is removed.
         * If the tab was the last one, tabchangelisteners will receive the second parameter as undefined.
         * @param {Oskari.userinterface.component.TabPanel} pPanel
         */
        removePanel: function (pPanel) {
            var panel = null,
                i,
                header;
            for (i = 0; i < this.panels.length; i++) {
                if (this.panels[i].getId() === pPanel.getId()) {
                    panel = this.panels[i];
                    this.panels.splice(i, 1);
                    break;
                }
            }
            //remove header
            var headerContainer = this.ui.find('ul li select :selected');
            for (i = 0; i < headerContainer.length; i++) {
                header = jQuery(headerContainer[i]);
                if (header.attr('id') === 'layer-id-' + panel.getId()) {
                    header.remove();
                }
            }

            if (this.panels.length === 0) {
                this.ui.html(this.emptyMsg);
                for (i = 0; i < this.tabChangeListeners.length; i++) {
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
        /**
         * @method insertTo
         * Adds this set of tabs to given container.
         * @param {jQuery} container reference to DOM element
         */
        insertTo: function (container) {
            container.append(this.ui);
        }
    });