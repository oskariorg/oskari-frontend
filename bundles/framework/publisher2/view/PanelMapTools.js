/**
 * @class Oskari.mapframework.bundle.publisher2.view.PanelMapTools
 *
 * Represents the basic info (name, domain, language) view for the publisher
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelMapTools',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (group, tools = [], instance, localization) {
        this.group = group;
        this.tools = tools;
        this.loc = localization;
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.templates = {
            tool: ({ title }) => `<div class="tool">
                <label><input type="checkbox"/>${title}</label>
                <div class="extraOptions"></div>
            </div>`,
            help: () => '<div class="help icon-info"></div>'
        };
        this.data = null;
    }, {
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         */
        init: function (pData) {
            const instance = this.instance;
            const sandbox = this.sandbox;
            this.data = pData;

            if (pData) {
                this.tools.forEach(tool => {
                    try {
                        tool.init(pData, instance);
                    } catch (e) {
                        Oskari.log('publisher2.view.PanelMapTools')
                            .error('Error initializing publisher tool:', tool.getTool().id);
                    }
                });
            }

            Object.keys(this.eventHandlers)
                .forEach(eventName => sandbox.registerForEventByName(this, eventName));
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             * Calls  handleDrawLayerSelectionChanged() functions
             */
            MapLayerEvent: function (event) {
                const toolbarTool = this._getToolbarTool('PublisherToolbarPlugin');
                if (toolbarTool && (event.getOperation() === 'add')) {
                    // handleDrawLayerSelectionChanged
                    toolbarTool.handleDrawLayerSelectionChanged(
                        event.getLayerId()
                    );
                }
            }
        },
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelMapTools';
        },
        /**
        * Sort tools
        * @method
        * @private
        */
        _sortTools: function () {
            const sortFunc = function (a, b) {
                    if (a.getIndex() < b.getIndex()) {
                        return -1;
                    }
                    if (a.getIndex() > b.getIndex()) {
                        return 1;
                    }
                    return 0;
                };

            this.tools.sort(sortFunc);
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            const me = this;
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            const contentPanel = panel.getContainer();
            const tooltipCont = jQuery(this.templates.help());

            panel.setTitle(me.loc[me.group].label);
            tooltipCont.attr('title', me.loc[me.group].tooltip);
            panel.getHeader().append(tooltipCont);

            // Sort tools
            me._sortTools();
            // Add tools to panel
            this.tools.forEach(tool => {
                const ui = jQuery(me.templates.tool({ title: tool.getTitle() }));
                // setup values when editing an existing map
                ui.find('input').prop('checked', !!tool.isEnabled());
                ui.find('input').prop('disabled', !!tool.isDisabled());

                contentPanel.append(ui);

                ui.find('input').first().on('change', function () {
                    var enabled = jQuery(this).is(':checked');
                    // TODO: maybe wrap in try catch and on error show the user a message about faulty functionality
                    tool.setEnabled(enabled);
                    if (enabled) {
                        ui.find('.extraOptions').show();
                        me._setToolLocation(tool);
                    } else {
                        ui.find('.extraOptions').hide();
                    }
                });

                const extraOptions = tool.getExtraOptions(ui);
                if (extraOptions) {
                    ui.find('.extraOptions').append(extraOptions);
                }

                const initStateEnabled = ui.find('input').first().is(':checked');
                tool.setEnabled(initStateEnabled);
                if (initStateEnabled) {
                    ui.find('.extraOptions').show();
                } else {
                    ui.find('.extraOptions').hide();
                }
            });
            me.panel = panel;
            return panel;
        },
        /**
         * @private
         * @method _setToolLocation
         * Sets the tool's location according to users selection. (lefhanded/righthanded/userlayout)
         */
        _setToolLocation: function (tool) {
            const layoutPanel = this.instance.publisher.panels.find(
                panel => panel.getName && panel.getName() === 'Oskari.mapframework.bundle.publisher2.view.PanelToolLayout');
            if (!layoutPanel || !tool[layoutPanel.activeToolLayout]) {
                return;
            }
            if (!tool.config) {
                tool.config = {};
            }
            if (!tool.config.location) {
                tool.config.location = {};
            }
            const layout = layoutPanel.activeToolLayout;
            tool.config.location.classes = tool[layout];
            var plugin = tool.getPlugin();
            if (plugin && plugin.setLocation) {
                plugin.setLocation(tool.config.location.classes);
            }
        },
        /**
         * Returns a hash containing ids of enabled plugins when restoring a published map.
         * @method _getEnabledTools
         * @private
         *
         * @return {Object} id's of the enabled plugins
         */
        _getEnabledTools: function () {
            if (!this.data) {
                return null;
            }
            const enabledTools = {};
            this.tools.forEach(tool => {
                if (tool.isEnabled()) {
                    enabledTools[tool.getTool().id] = true;
                }
            });
            return enabledTools;
        },
        /**
         * Returns the selections the user has done with the form inputs.
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            // just return empty -> tools and their plugins' configs get returned by the layout panel, which has all the tools
            return null;
        },
        /**
         * Get tool by name
         * @returns {Object} tool object
         */
        _getToolbarTool: function (name) {
            return this.tools.find(tool => tool.getTool().name === name) || null;
        },

        /**
         * Returns any errors found in validation or an empty
         * array if valid. Error object format is defined in Oskari.userinterface.component.FormInput
         * validate() function.
         *
         * @method validate
         * @return {Object[]}
         */
        validate: function () {
            return this.tools
                .filter(tool => !tool.validate())
                .map(tool => tool.getTool().id);
        },
        /**
         * @method setMode
         * @param {String} mode the mode
         */
        setMode: function (mode) {
            if (!this.panel) {
                return;
            }

            const cont = this.panel.getContainer();
            // update tools
            this.tools.forEach(tool => {
                if (tool.isDisplayedInMode(mode) === true) {
                    cont.find('#tool-' + tool.getTool().id).prop('disabled', true);
                    cont.find('#tool-' + tool.getTool().id).prop('checked', false);
                } else {
                    cont.find('#tool-' + tool.getTool().id).prop('disabled', false);
                }
            });
        },
        getTools: function () {
            return this.tools;
        },
        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function () {
            this.tools.forEach(tool => {
                try {
                    tool.stop();
                } catch (e) {
                    Oskari.log('publisher2.view.PanelMapTools')
                        .error('Error stopping publisher tool:', tool.getTool().id);
                }
            });

            Object.keys(this.eventHandlers)
                .forEach(eventName => this.sandbox.unregisterFromEventByName(this, eventName));
        }
    });
