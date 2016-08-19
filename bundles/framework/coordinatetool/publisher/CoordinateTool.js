
Oskari.clazz.define('Oskari.mapframework.publisher.tool.CoordinateTool',
function() {
}, {
    index : 4,
    allowedLocations : ['top left', 'top right'],
    lefthanded: 'top left',
    righthanded: 'top right',
    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
        'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
    ],
    templates: {
        'toolOptions': '<div class="tool-options"></div>'
    },
    supportedProjections: null,
    noUI: null,
    projectionTrasformationIsCheckedInModifyMode: false,
    noUiIsCheckedInModifyMode: false,

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        var coordinatetool = this.__sandbox.findRegisteredModuleInstance('coordinatetool') || null;
        return {
            id: 'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
            title: 'CoordinateToolPlugin',
            config: {
                instance: coordinatetool
            }
        };
    },

    //Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
    bundleName: 'coordinatetool',

    /**
     * Initialise tool
     * @method init
     */
    init: function(data) {
        var me = this;
        if (!data || !data.configuration[me.bundleName]) {
            return;
        }
        me.setEnabled(true);
        var conf = data.configuration[me.bundleName].conf || {};
        me.projectionTrasformationIsCheckedInModifyMode = !!conf.supportedProjections;
        me.noUiIsCheckedInModifyMode = !!conf.noUI;
    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        var me = this;
        if(me.state.enabled) {
            var pluginConfig = this.getPlugin().getConfig();
            pluginConfig.instance = null;
            delete pluginConfig.instance;

            if(me.toolConfig){
                for(var configName in me.toolConfig) {
                    pluginConfig[configName] = me.toolConfig[configName];
                    // Not save supportedProjections if is not checked
                    if(configName === 'supportedProjections' && !me.supportedProjections) {
                        pluginConfig[configName] = null;
                        delete pluginConfig[configName];
                    }
                    // Not save noUI if is not checked
                    if(configName === 'noUI' && !me.noUI) {
                        pluginConfig[configName] = null;
                        delete pluginConfig[configName];
                    }
                }
            }

            if(me.noUI) {
                pluginConfig.noUI = me.noUI;
            }
            var json = {
                configuration: {}
            };
            json.configuration[me.bundleName] = {
                conf: pluginConfig,
                state: {}
            };
            return json;
        } else {
            return null;
        }
    },
     /**
     * Get extra options.
     * @method @public getExtraOptions
     * @param {Object} jQuery element toolContainer
     * @return {Object} jQuery element template
     */
     getExtraOptions: function (toolContainer) {
        var me = this,
            template = jQuery(me.templates.toolOptions).clone(),
            loc = Oskari.getLocalization('coordinatetool', Oskari.getLang() || Oskari.getDefaultLanguage()),
            labelNoUI = loc.display.publisher.noUI;

        var input = Oskari.clazz.create(
                'Oskari.userinterface.component.CheckboxInput'
            );

        if(me.toolConfig && me.toolConfig.supportedProjections) {
            var inputTransform = Oskari.clazz.create(
                'Oskari.userinterface.component.CheckboxInput'
            );
            inputTransform.setTitle(loc.display.publisher.showTransformationTools);
            inputTransform.setHandler(function(checked){
                if(checked === 'on') {
                    me.supportedProjections = me.toolConfig.supportedProjections;
                } else {
                    me.supportedProjections = null;
                }
            });


            if(me.projectionTrasformationIsCheckedInModifyMode) {
                inputTransform.setChecked(true);
                me.supportedProjections = me.toolConfig.supportedProjections;
            }
            template.append(inputTransform.getElement());
        }

        input.setTitle(labelNoUI);
        input.setHandler(function(checked){
            if(checked === 'on') {
                me.noUI = true;
                me.getPlugin().teardownUI();
                //me.getPlugin().toggleIconVisibility(false);
            } else {
                me.noUI = null;
                me.getPlugin().redrawUI(Oskari.util.isMobile());
                //me.getPlugin().toggleIconVisibility(true);
            }
        });

        if(me.noUiIsCheckedInModifyMode) {
            input.setChecked(true);
            me.noUI = true;
        }
        var inputEl = input.getElement();
        if(inputEl.style) {
            inputEl.style.width = 'auto';
        }

        template.append(inputEl);
        return template;
     }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});