/**
 * Contains new layer creation and also layer editing.
 */

Oskari.clazz.define('Oskari.admin.hierarchical-layerlist.Layer', function(instance, sandbox, locale) {
    this.instance = instance;
    this.sandbox = sandbox;
    this.locale = locale;
    this.service = this.sandbox.getService('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService');
    this.layerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
    this._types = {};

    this._templates = {
        layerTypeSelection: jQuery('<div><div class="layers-type-selection"><p></p></div></div>')
    };

    this._extraFlyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout');

    this.supportedTypes = [{
        id: "wfslayer",
        localeKey: "wfs"
    }, {
        id: "wmslayer",
        localeKey: "wms"
    }, {
        id: "wmtslayer",
        localeKey: "wmts"
    }, {
        id: "arcgislayer",
        localeKey: "arcgis",
        footer: false
    }, {
        id: "arcgis93layer",
        localeKey: "arcgis93",
        footer: false
    }];
    this._init();
    this._setupSupportedLayerTypes();
    this.log = Oskari.log('Oskari.admin.hierarchical-layerlist.Layer');
    this.dataProviders = null;

}, {

    /*******************************************************************************************************************************
    /* PRIVATE METHODS
    *******************************************************************************************************************************/
    /**
     * Init/configure require
     * @method  _init
     * @private
     */
    _init: function() {
        var requirementsConfig = {
            waitSeconds: 15,
            paths: {
                '_bundle': '../../../Oskari/bundles/integration/admin-layerselector'
            }
        };
        require.config(requirementsConfig);
    },

    /**
     * Setup supported layer types based on what this bundle can handle and
     * which layer types are supported by started application (layer models registered).
     *
     * NOTE! This must be done here so layer type specific templates have time to load.
     * They are used by AdminLayerSettingsView directly from this View for new layers and passed through LayerView
     * for existing layers
     */
    _setupSupportedLayerTypes: function() {
        var me = this;
        // generic list of layertypes supported


        me.supportedTypes = _.filter(this.supportedTypes, function(type) {
            return me.layerService.hasSupportForLayerType(type.id);
        });
        // setup templates for layer types/require only ones supported
        _.each(this.supportedTypes, function(type) {
            if (type.header === false) {
                return;
            }
            var file = 'text!_bundle/templates/layer/' + type.id + 'SettingsTemplateHeader.html';
            require([file], function(header) {
                type.headerTemplate = _.template(header);
            }, function() {
                me.log.warn('No admin header template for layertype: ' + type.id + " file was: " + file);
            });
        });
        _.each(this.supportedTypes, function(type) {
            if (type.footer === false) {
                return;
            }
            var file = 'text!_bundle/templates/layer/' + type.id + 'SettingsTemplateFooter.html';
            require([file], function(footer) {
                type.footerTemplate = _.template(footer);
            }, function() {
                me.log.warn('No admin footer template for layertype: ' + type.id + " file was: " + file);
            });
        });
    },

    /**
     * Get mapl layer groups for layer group selection
     * @method  _getMaplayerGroups
     * @return  {Array}           groups
     * @private
     */
    _getMaplayerGroups: function() {
        var me = this;
        var groups = [];
        me.layerService.getAllLayerGroups().forEach(function(group) {
            groups.push({
                id: group.id,
                cls: 'group',
                name: Oskari.getLocalized(group.name)
            });

            // subgroups
            group.groups.forEach(function(subgroup) {
                groups.push({
                    id: subgroup.id,
                    cls: 'subgroup',
                    name: Oskari.getLocalized(subgroup.name)
                });

                // subgroup subgroups
                subgroup.groups.forEach(function(subgroupsubgroup) {
                    groups.push({
                        id: subgroupsubgroup.id,
                        cls: 'subgroupsubgroup',
                        name: Oskari.getLocalized(subgroupsubgroup.name)
                    });
                });
            });
        });

        return groups;
    },

    /*******************************************************************************************************************************
    /* PUBLIC METHODS
    *******************************************************************************************************************************/
    /**
     * Get dataproviders
     * @method getDataproviders
     * @param  {Boolean}        emptyCache empty cache
     * @param  {Function}       callback   callback function
     */
    getDataproviders: function(emptyCache, callback) {
        var me = this;

        if(me.dataProviders !== null && !emptyCache) {
            callback(me.dataProviders);
            return;
        }

        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            url: me.sandbox.getAjaxUrl('GetMapLayerGroups'),
            error: function() {
                var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                errorDialog.show(me.locale('errors.dataProvider.title'), me.locale('errors.dataProvider.message'));
                errorDialog.fadeout();
                callback([]);
            },
            success: function(response) {
                me.dataProviders = [];
                response.organization.forEach(function(org) {
                    me.dataProviders.push({
                        id: org.id,
                        name: Oskari.getLocalized(org.name)
                    });
                });

                me.dataProviders.sort(function(a, b) {
                    return Oskari.util.naturalSort(a.name, b.name);
                });
                callback(me.dataProviders);
            }
        });
    },
    /**
     * Shows layer popup
     * @method showLayerAddPopup
     * @param  {String}          tool    tool identifier
     * @param  {String}          layerId layerId
     * @param  {String}          groupId groupId
     */
    showLayerAddPopup: function(tool, layerId, groupId) {
        var me = this;
        me.getDataproviders(false, function(dataProviders) {
            me._extraFlyout.move(100, 100, true);
            me._extraFlyout.makeDraggable();
            me._extraFlyout.addClass('admin-hierarchical-layerlist-add-layer');
            me._extraFlyout.bringToTop();
            me._extraFlyout.setTitle(me.locale('admin.addLayer'));
            me._extraFlyout.on('hide', function() {
                tool.removeClass('active');
            });

            var layerModel = null;
            if (layerId) {
                layerModel = me.sandbox.findMapLayerFromAllAvailable(layerId);
            }

            var groupDetails = me.layerService.getAllLayerGroups(groupId);
            require(['_bundle/views/adminLayerSettingsView', '_bundle/views/adminLayerSettingsView'], function(adminLayerSettingsView, sublayerView) {
                // create layer settings view for adding or editing layer
                var settings = new adminLayerSettingsView({
                    model: layerModel,
                    supportedTypes: me.supportedTypes,
                    instance: me.instance,
                    groupId: groupId,
                    dataProviders: dataProviders,
                    flyout: me._extraFlyout,
                    baseLayerId: null,
                    sublayerView: sublayerView,
                    allMaplayerGroups: me._getMaplayerGroups(),
                    maplayerGroups: (layerModel) ? layerModel.getGroups() : [{
                        id: groupDetails.id,
                        name: Oskari.getLocalized(groupDetails.name)
                    }]
                });
                var content = settings.$el;

                // activate slider (opacity)
                content.find('.layout-slider').slider({
                    min: 0,
                    max: 100,
                    value: 100,
                    slide: function(event, ui) {
                        jQuery(ui.handle).parents('.left-tools').find("#opacity-slider").val(ui.value);
                    }
                });

                me._extraFlyout.setContent(content);
                me._extraFlyout.show();
            });

        });
    }
});