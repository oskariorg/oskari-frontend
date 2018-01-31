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

    //this._getLayerTypes();

    this._extraFlyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout');

    //this._step = 0;

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
    _init: function() {
        var requirementsConfig = {
            waitSeconds: 15,
            paths: {
                '_bundle': '../../../Oskari/bundles/admin/admin-hierarchical-layerlist'
            }
        };
        require.config(requirementsConfig);



    },

    getDataproviders: function(emptyCache, callback) {
        var me = this;
        if (me.dataProviders === null || emptyCache === true) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                url: me.sandbox.getAjaxUrl('GetMapLayerGroups'),
                error: function() {
                    var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    errorDialog.show(me.locale('errors.dataProvider.title'), me.locale('errors.dataProvider.message'));
                    errorDialog.fadeout();
                },
                success: function(response) {
                    me.dataProviders = [];
                    response.organization.forEach(function(org) {
                        me.dataProviders.push({
                            id: org.id,
                            name: Oskari.getLocalized(org.name)
                        });
                    });
                    callback();

                }
            });
        }
        callback();
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



    ///// OLD STUFF
    /*******************************************************************************************************************************
    /* PRIVATE METHODS
    *******************************************************************************************************************************/


    /*******************************************************************************************************************************
    /* PUBLIC METHODS
    *******************************************************************************************************************************/
    showLayerAddPopup: function(tool, layerId, groupId, opts) {
        var me = this;
        me.getDataproviders(false, function() {
            me._extraFlyout.move(100, 100, true);
            me._extraFlyout.makeDraggable({
                handle: '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                scroll: false
            });
            me._extraFlyout.addClass('admin-hierarchical-layerlist-add-layer');
            me._extraFlyout.bringToTop();
            me._extraFlyout.setTitle(me.locale('admin.addLayer'));
            me._extraFlyout.on('hide', function() {
                tool.removeClass('active');
            });

            require(['_bundle/views/adminLayerSettingsView'], function(adminLayerSettingsView) {
                // create layer settings view for adding or editing layer
                var settings = new adminLayerSettingsView({
                    model: null,
                    supportedTypes: me.supportedTypes,
                    instance: me.instance,
                    spinnerContainer: content,
                    groupId: groupId,
                    dataProviders: me.dataProviders,
                    flyout: me._extraFlyout
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
                /*
                // change the title of the button
                element.html(this.options.instance.getLocalization('cancel'));
                element.attr('title', this.options.instance.getLocalization('cancel'));
                setTimeout(function() {
                    layer.find('.admin-add-layer').addClass('show-add-layer');
                }, 30);*/

                me._extraFlyout.setContent(content);
                me._extraFlyout.show();
            });

        });


        return;
        var me = this;
        var popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        popup.addClass('admin-hierarchical-layerlist-layer');

        var content = me._templates.layerTypeSelection.clone();
        content.find('p').html(me.locale('layer.popup.selectLayerType'));

        Object.keys(me._types).forEach(function(type) {
            var layerType = me._types[type];
            var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            btn.setTitle(layerType.getLocalizedType());
            btn.addClass('layer-type');
            btn.addClass(type);
            btn.setHandler(function() {
                me._extraFlyout.move(100, 100, true);
                me._extraFlyout.makeDraggable({
                    handle: '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                    scroll: false
                });
                me._extraFlyout.addClass('admin-hierarchical-layerlist-add-layer');
                me._extraFlyout.bringToTop();
                me._extraFlyout.setTitle(me.locale('layer.add') + ' ' + layerType.getLocalizedType());
                me._extraFlyout.setContent(layerType.getElement());
                me._extraFlyout.show();
                popup.close();
                me._extraFlyout.on('hide', function() {
                    showPopup();
                });
            });
            content.find('.layers-type-selection').append(jQuery(btn.getElement()));
            layerType.btn = btn;
        });

        var btnCancel = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btnCancel.setTitle(me.locale('buttons.cancel'));
        btnCancel.addClass('cancel');
        btnCancel.setHandler(function() {
            popup.close();
            tool.removeClass('active');
        });
        var popupTitle = me.locale('layer.popup.title.add');
        if (layerId) {
            popupTitle = me.locale('layer.popup.title.edit');
        }
        var showPopup = function() {
            popup.show(popupTitle, content, [btnCancel]);
            popup.makeModal();
        };
        showPopup();


        if (layerId && opts.type) {
            // Trigger click
        }
    }
});