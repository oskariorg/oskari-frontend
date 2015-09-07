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
    function (group, tools, sandbox, localization, instance) {
        this.group = group;
        this.tools = tools;
        this.loc = localization;
        this.sandbox = sandbox;
        this.instance = instance;
        this.templates = {
            tool: _.template('<div class="tool"><label><input type="checkbox"/>${name}</label><div class="extraOptions"></div></div>'),
            help: jQuery('<div class="help icon-info"></div>')
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
            var me = this;
            me.data = pData;
            _.each(me.tools, function (tool) {
                tool.init();
            });


            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }


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
                var me = this,
                    toolbarTool = me._getToolbarTool('PublisherToolbarPlugin');
                if (toolbarTool && (event.getOperation() === 'add')) {
                    // handleDrawLayerSelectionChanged
                    toolbarTool.handleDrawLayerSelectionChanged(
                        event.getLayerId()
                    );
                }
            }
        },
        getName: function() {
            return "Oskari.mapframework.bundle.publisher2.view.PanelMapTools";
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

                var extraOptions = tool.getExtraOptions(ui);
                if(extraOptions) {
                    ui.find('.extraOptions').append(extraOptions);
                }

                ui.find('input').change(function() {
                    var enabled = jQuery(this).is(':checked');
                    tool.setEnabled(enabled);
                    if(enabled) {
                        ui.find('.extraOptions').show();
                    } else {
                        ui.find('.extraOptions').hide();
                    }
                });

                var initStateEnabled = ui.find('input').is(':checked');
                tool.setEnabled(initStateEnabled);
                if(initStateEnabled) {
                    ui.find('.extraOptions').show();
                } else {
                    ui.find('.extraOptions').hide();
                }

                contentPanel.append(ui);
            });
            me.panel = panel;
            return panel;
        },

        /**
        * Extends object recursive for keeping defaults array.
        * @method _extendRecursive
        * @private
        *
        * @param {Object} defaults the default extendable object
        * @param {Object} extend extend object
        *
        * @return {Object} extended object
        */
        /*
        _extendRecursive: function(defaults, extend){
            var me = this;

            if (extend === null || jQuery.isEmptyObject(extend)) {
                return defaults;
            } else if (jQuery.isEmptyObject(defaults)) {
                return jQuery.extend(true, defaults, extend);
            } else if (jQuery.isArray(defaults)) {
                if(jQuery.isArray(extend)){
                    jQuery.each(extend, function(key, value) {
                        defaults.push(value);
                    });
                }
                return defaults;
            } else {
                jQuery.each(extend, function(key, value){
                    if(defaults[key] === null) {
                        defaults[key] = value;
                    } else {
                        defaults[key] = me._extendRecursive(defaults[key], value);
                    }

                });
                return defaults;
            }
        },
*/
        /**
         * Returns the selections the user has done with the form inputs.
         * @method getValues
         * @return {Object}
         */
         /*
        getValues: function () {
            var me = this,
                values = {};

            _.each(me.tools, function(tool){
                var value = tool.getValues();
                me._extendRecursive(values, value);
            });
            return values;
        },
        */
        getValues: function() {
            //just return empty -> tools and their plugins' configs get returned by the layout panel, which has all the tools
            return null;
        },
        /**
         * Get tool by name
         * @returns {Object} tool object
         */
        _getToolbarTool: function (name) {
            var me = this,
                bartool = null;
            _.each(me.tools, function (tool) {
                if( tool.getTool().name === name){
                  bartool = tool;
                }

            });
            return bartool;
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
        },
        /**
         * @method setMode
         * @param {String} mode the mode
         */
        setMode: function (mode) {
            var me = this,
                cont = me.panel.getContainer();

            // update tools
            _.each(me.tools, function(tool){
                if(tool.isDisplayedInMode(mode) === true){
                    cont.find('#tool-' + tool.getTool().id).attr('disabled', 'disabled');
                } else {
                    cont.find('#tool-' + tool.getTool().id).removeAttr('disabled');
                }

                if(typeof tool.setMode === 'function'){
                    tool.setMode(mode);
                }
            });
        },
        getTools: function() {
            return this.tools;
        },
        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function(){
            var me = this;
            _.each(me.tools, function(tool){
                tool.stop();
            });
        }
    });