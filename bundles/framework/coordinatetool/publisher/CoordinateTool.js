
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
        'toolOptions': '<div class="tool-options"></div>',
        'toolOptionSettingInput': '<div class="tool-option"><input type="checkbox" /><label></label></div>'
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
            if(me.supportedProjections) {
                pluginConfig.supportedProjections = me.supportedProjections;
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
            optionNoUI = jQuery(me.templates.toolOptionSettingInput).clone(),
            labelNoUI = loc.display.publisher.noUI;

        if(me.toolConfig && me.toolConfig.supportedProjections) {
            optionShowTransformationTools = jQuery(me.templates.toolOptionSettingInput).clone(),
            labelShowTransformationTools = loc.display.publisher.showTransformationTools,

            optionShowTransformationTools.find('label').html(labelShowTransformationTools);
            optionShowTransformationTools.find('input').change(function (e) {
                if(jQuery(this).is(':checked')) {
                    me.supportedProjections = me.toolConfig.supportedProjections;
                } else {
                    me.supportedProjections = null;
                }
            });

            if(me.projectionTrasformationIsCheckedInModifyMode) {
                optionShowTransformationTools.find('input').attr('checked', 'checked');
                me.supportedProjections = me.toolConfig.supportedProjections;
            }
            template.append(optionShowTransformationTools);
        }
        optionNoUI.find('label').html(labelNoUI);
        optionNoUI.find('input').change(function (e) {
            if(jQuery(this).is(':checked')) {
                me.noUI = true;
            } else {
                me.noUI = null;
            }
        });
        if(me.noUiIsCheckedInModifyMode) {
            optionNoUI.find('input').attr('checked', 'checked');
            me.noUI = true;
        }
        template.append(optionNoUI);
        return template;
     }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});