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
    function (group, tools, sandbox, localization) {
        this.group = group;
        this.tools = tools;
        this.loc = localization;
        this.sandbox = sandbox;
        this.templates = {
            tool: _.template('<div class="tool"><label><input type="checkbox"/>${name}</label><div class="extraOptions"></div></div>'),
            help: jQuery('<div class="help icon-info"></div>')
        };
    }, {
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         */
        init: function (pData) {
            this.data = pData;
        },
        /**
        * Sort tools
        * @method
        * @private
        */
        _sortTools: function(){
            var me = this,
                sortFunc = function(a,b) {
                    if (a.getIndex() < b.getIndex()) {
                        return -1;
                    }
                    if (a.getIndex() > b.getIndex()) {
                        return 1;
                    }
                    return 0;
                };

            me.tools.sort(sortFunc);
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                tools = this.tools,
                tooltipCont = me.templates.help.clone();

            panel.setTitle(me.loc[me.group].label);
            tooltipCont.attr('title', me.loc[me.group].tooltip);
            contentPanel.append(tooltipCont);

            // Sort tools
            me._sortTools();
            // content

            // Add tools to panel
            _.each(tools, function(tool) {
                var ui = jQuery(me.templates.tool({name : tool.getName() }));
                // TODO: setup values when editing an existing map
                ui.find('input').change(function() {
                    tool.setEnabled(jQuery(this).is(':checked'));
                });

                var extraOptions = tool.getExtraOptions();
                if(extraOptions) {
                    ui.find(".extraOptions").append(extraOptions);
                }
                contentPanel.append(ui);

            });

            return panel;
        },

        /**
         * Returns the selections the user has done with the form inputs.
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            // TODO: maybe merge the tool.getValues()
            // under-construction and all that
            var me = this,
                values = {
                    maptools: []
                };

            jQuery.each(me.tools, function(index, tool){
                values.maptools.push(tool.getValues());
            });

            return values;
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
            var errors = [];
            _.each(this.tools, function(tool) {
                if(!tool.validate()){
                    errors.push(tool.getTool().id);
                }
            });
            return errors;
        }
    });