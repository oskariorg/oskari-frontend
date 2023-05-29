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
        this.tools.sort((a, b) => a.getIndex() - b.getIndex());
        this.loc = localization;
        this.instance = instance;
        this.templates = {
            tool: ({ title }) => `<div class="tool">
                <label><input type="checkbox"/>${title}</label>
                <div class="extraOptions"></div>
            </div>`,
            help: () => '<div class="help icon-info"></div>'
        };
    }, {
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         * @returns {Boolean} if this panel has any tools/should be shown
         */
        init: function (pData) {
            this.data = pData;
            if (!pData) {
                return;
            }
            this.tools.forEach(tool => {
                try {
                    tool.init(pData);
                } catch (e) {
                    Oskari.log('publisher2.view.PanelMapTools')
                        .error('Error initializing publisher tool:', tool.getTool().id);
                }
            });
            return this.tools.some(tool => tool.isDisplayed(pData));
        },
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelMapTools';
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

            // Add tools to panel
            this.tools
                .filter(tool => tool.isDisplayed(this.data))
                .forEach(tool => {
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
         * Returns the selections the user has done with the form inputs.
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            // just return empty -> tools and their plugins' configs get returned by the layout panel, which has all the tools
            return null;
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
        }
    });
