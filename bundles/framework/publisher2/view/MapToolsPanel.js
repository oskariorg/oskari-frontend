/**
 * @class Oskari.mapframework.bundle.publisher2.view.MapToolsPanel
 *
 * Represents the basic info (name, domain, language) view for the publisher
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.MapToolsPanel',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.view.BasicPublisher} publisher
     *       publisher reference for language change
     */
    function (sandbox, mapmodule, localization, publisher) {
        this.group = 'maptools';
        this.loc = localization;
        this._publisher = publisher;
        this.sandbox = sandbox;
        this.mapmodule = mapmodule;
        this.tools = [];
        this.templates = {
            maptools: jQuery('<div class="tool "><label>' + '<input type="checkbox"/>' + '</label></div>'),
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
                fkey,
                data,
                tools = Oskari.clazz.protocol('Oskari.mapframework.publisher.Tool'),
                plugins,
                enabledPlugins = null,
                toolContainer,
                pluginKey,
                toolname,
                extraOptions,
                tooltipCont = me.templates.help.clone();

            panel.setTitle(me.loc[me.group].label);
            tooltipCont.attr('title', me.loc[me.group].tooltip);
            contentPanel.append(tooltipCont);

            // Add tools
            jQuery.each(tools, function(toolname, index){
                var tool = Oskari.clazz.create(toolname,
                    me.sandbox,
                    me.mapmodule,
                    me.loc[me.group]
                );
                // add only this panel tools
                if(tool.getGroup() === me.group) {
                    me.tools.push(tool);
                }
            });

            // Sort tools
            me._sortTools();

            if (me._publisher.data && me._publisher.data.state && me._publisher.data.state.mapfull &&
                me._publisher.data.state.mapfull.config &&
                me._publisher.data.state.mapfull.config.plugins) {
                plugins = me.data.state.mapfull.config.plugins;

                enabledPlugins = {};
                // set enabled plugins
                for (i = 0; i < plugins.length; i += 1) {
                    enabledPlugins[plugins[i].id] = true;
                    if (plugins[i].id === 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin') {
                        me.data.hasLayerSelectionPlugin = plugins[i].config;
                    }
                }
            }

            // content
            var closureMagic = function(tool) {
                return function() {
                    var checkbox = jQuery(this),
                        isChecked = checkbox.is(':checked');
                    tool.setEnabled(isChecked);
                };
            };

            // Create elements
            jQuery.each(me.tools, function(index, tool){
                extraOptions = tool.getExtraOptions();
                pluginKey = tool.getTool().id;
                pluginKey = pluginKey.substring(pluginKey.lastIndexOf('.') + 1);
                toolContainer = me.templates[tool.getGroup()].clone();
                
                // Default tool
                toolname = tool.getName();
                toolContainer.find('label').attr('for', 'tool-' + pluginKey).append(toolname);
                
                if (enabledPlugins !== null) {
                    var founded = jQuery.grep(enabledPlugins, function(plugin, indeksi) {
                        return plugin === tool.getTool().id;
                    });
                    if(founded.length>0) {
                        toolContainer.find('input').attr('checked', 'checked');
                    }
                }

                contentPanel.append(toolContainer);

                /**
                // TODO: How about this?!
                if (me._storedData) {
                    classes = this._publisher._getInitialPluginLocation(me._storedData, this.tools[i].id);
                    if (classes) {
                        this.tools[i].config.location.classes = classes;
                    }
                }
                */

                toolContainer.find('input').attr('id', 'tool-' + pluginKey).change(closureMagic(tool));

                // Extra tool
                if(extraOptions) {
                    contentPanel.append(extraOptions);
                }
            });


            return panel;
        },

        /**
         * Returns the selections the user has done with the form inputs.
         * {
         *     domain : <domain field value>,
         *     name : <name field value>,
         *     language : <language user selected>
         * }

         FIXME: fixed this
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var values = {},
                fkey,
                data;

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    values[fkey] = data.field.getValue();
                }
            }
            values.language = this.langField.field.getValue();
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
            var errors = [],
                fkey,
                data;

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    errors = errors.concat(data.field.validate());
                }
            }
            return errors;
        }
    });