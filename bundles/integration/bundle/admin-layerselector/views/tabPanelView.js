define([
        'text!_bundle/templates/filterLayersTemplate.html',
        'text!_bundle/templates/addGroupingBtnTemplate.html',
        'text!_bundle/templates/addGroupingTemplate.html',
        'text!_bundle/templates/adminAddLayerBtnTemplate.html',
        'text!_bundle/templates/tabPanelTemplate.html',
        'text!_bundle/templates/accordionPanelTemplate.html',
        'text!_bundle/templates/layerRowTemplate.html',
        '_bundle/views/adminLayerSettingsView',
        '_bundle/views/layerView'
    ],
    function (FilterLayersTemplate,
        AddGroupingButtonTemplate,
        AddGroupingTemplate,
        AdminAddLayerBtnTemplate,
        TabPanelTemplate,
        AccordionPanelTemplate,
        LayerRowTemplate,
        AdminLayerSettingsView,
        LayerView) {

        return Backbone.View.extend({
            tagName: 'div',

            className: 'tab-content',

            /**
             * This object contains backbone event-handling.
             * It binds methods to certain events fired by different elements.
             *
             * @property events
             * @type {Object}
             */
            events: {
                "keyup .admin-filter-input": "filterLayers",
                "click .accordion-header": "toggleLayerGroup",
                "click .admin-add-layer-btn": "toggleAddLayer",
                "click .admin-add-layer-cancel": "hideAddLayer",

                "click .admin-edit-grouping-btn": "toggleGroupingSettings",
                "click .admin-add-grouping-cancel": "toggleGroupingSettings",

                "click .admin-add-grouping-btn": "toggleAddLayerGrouping",

                "click .admin-add-grouping-ok": "saveLayerGrouping",
                "click .admin-remove-grouping": "removeLayerGrouping",
                "click .show-add-class": "catchClicks"
            },

            /**
             * At initialization we add model for this tabPanelView, add templates
             * and do other initialization steps.
             *
             * @method initialize
             */
            initialize: function () {
                this.layerGroupingModel = this.options.layerGroupingModel;
                this.instance = this.options.instance;
                this.allowDeleteWhenNotEmpty = (this.options.tabId === 'inspire');
                // reference to possible error dialog
                this.__dialog = null;
                // If model triggers change event we need to re-render this view
                // listenTo will remove dead listeners, use it instead of on()
                this.listenTo(this.layerGroupingModel, 'change:layerGroups', this.render);
                this.listenTo(this.layerGroupingModel, 'adminAction', function(e) {
                    // route adminAction from model to an ui element that View.js listens
                    this.$el.trigger(e);
                });

                this.addGroupingButtonTemplate = _.template(AddGroupingButtonTemplate);
                this.addGroupingTemplate = _.template(AddGroupingTemplate);

                //this.addInspireTemplate = _.template(AdminAddInspireTemplate);
                //this.addOrganizationTemplate = _.template(AdminAddOrganizationTemplate);
                this.addLayerBtnTemplate = _.template(AdminAddLayerBtnTemplate);
                this.filterTemplate = _.template(FilterLayersTemplate);
                this.tabTemplate = _.template(TabPanelTemplate);
                this.accordionTemplate = _.template(AccordionPanelTemplate);
                this.layerTemplate = _.template(LayerRowTemplate);
                _.bindAll(this);
                this.__setupSupportedLayerTypes();
                this.render();
            },
            /**
             * Setup supported layer types based on what this bundle can handle and 
             * which layer types are supported by started application (layer models registered).
             *
             * NOTE! This must be done here so layer type specific templates have time to load.
             * They are used by AdminLayerSettingsView directly from this View for new layers and passed through LayerView
             * for existing layers
             */
            __setupSupportedLayerTypes : function() {
                var me = this;
                // generic list of layertypes supported
                this.supportedTypes = [
                    {id : "wmslayer", localeKey : "wms"},
                    {id : "wmtslayer", localeKey : "wmts"},
                    {id : "arcgislayer", localeKey : "arcgis", footer : false}
                ];
                // filter out ones that are not registered in current appsetup
                var sandbox = this.instance.sandbox,
                    mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
                this.supportedTypes = _.filter(this.supportedTypes, function(type){ 
                    return mapLayerService.hasSupportForLayerType(type.id) 
                });
                // setup templates for layer types/require only ones supported
                _.each(this.supportedTypes, function(type) {
                    if(type.header === false) {
                        return;
                    }
                    var file = 'text!_bundle/templates/layer/' + type.id + 'SettingsTemplateHeader.html';
                    require([file], function(header) {
                        type.headerTemplate = _.template(header);
                    }, function(err) {
                        sandbox.printWarn('No admin header template for layertype: ' + type.id + " file was: " + file);
                    });
                });
                _.each(this.supportedTypes, function(type) {
                    if(type.footer === false) {
                        return;
                    }
                    var file = 'text!_bundle/templates/layer/' + type.id + 'SettingsTemplateFooter.html';
                    require([file], function(footer) {
                        type.footerTemplate = _.template(footer);
                    }, function(err) {
                        sandbox.printWarn('No admin footer template for layertype: ' + type.id + " file was: " + file);
                    });
                });
            },
            /**
             * When rendering this app we need to loop through all the classes or organizations
             * in the tabModel
             *
             * @method render
             */
            render: function () {
                this.$el.addClass(this.options.tabId);
                this.$el.empty();
                var me = this;

                if (this.layerGroupingModel != null) {
                    this.layerContainers = {};

                    // Loop through layer groupings
                    for (var i = 0; i < this.layerGroupingModel.layerGroups.length; ++i) {
                        var group = this.layerGroupingModel.layerGroups[i],
                            visibleLayerCount = 0;
                        //create groupPanel / accordion
                        var groupPanel = jQuery(this.accordionTemplate({
                            title: this.layerGroupingModel.getGroupingTitle(i, Oskari.getLang()),
                            instance: this.options.instance
                        }));
                        var groupContainer = groupPanel.find('.content');
                        // render layers
                        if (group.models != null) {
                            // Loop through layers in this group
                            for (var n = 0; n < group.models.length; ++n) {
                                var layer = group.at(n);

                                // create a new layerView with layer model.
                                var layerView = new LayerView({
                                    model: layer,
                                    supportedTypes : me.supportedTypes,
                                    instance: this.options.instance
                                    //,layerTabModel: this.layerGroupingModel
                                });

                                visibleLayerCount++;
                                // Add layerView to group container
                                groupContainer.append(layerView.$el);
                                // store reference to dom
                                this.layerContainers[layer.getId()] = layerView;
                            }
                        }
                        // At this point we want to add new layer button only for organization
                        // if we enable on inspire tab -> layer will use the inspire theme id as organization id
                        if (this.options.tabId == 'organization') {
                            groupContainer.append(this.addLayerBtnTemplate({
                                instance: this.options.instance
                            }));
                        }
                        // add grouping template to group panel
                        var tab = this.tabTemplate({
                            "lcId" : group.id
                        });
                        
                        // grouping edit panels
                        groupPanel.find('.accordion-header')
                            .append(this.__createGroupingPanel(this.options.tabId, group));
                        // add group panel to this tab
                        this.$el.append(jQuery(tab).append(groupPanel));

                    }
                    // add new grouping button and settings template
                    this.$el.prepend(this.filterTemplate({
                        instance: this.options.instance
                    }));
                    
                    // grouping add panel
                    var newGroup = this.layerGroupingModel.getTemplateGroup();
                    var btnConfig = {};
                    if (this.options.tabId == 'inspire') {
                        btnConfig.title = this.options.instance.getLocalization('admin').addInspire;
                        btnConfig.desc = this.options.instance.getLocalization('admin').addInspireDesc;
                    }
                    else {
                        btnConfig.title = this.options.instance.getLocalization('admin').addOrganization;
                        btnConfig.desc = this.options.instance.getLocalization('admin').addOrganizationDesc;

                    }
                    var groupingPanelContainer = this.$el.find('.oskarifield');
                    groupingPanelContainer.append(this.addGroupingButtonTemplate({ loc: btnConfig }));
                    groupingPanelContainer.append(this.__createGroupingPanel(this.options.tabId, newGroup));



                    /*// TODO: at some point it could be nice to filter layers also.
                var selectedLayers = this.options.instance.sandbox.findAllSelectedMapLayers();
                for(var i = 0; i < selectedLayers.length; ++i) {
                    this.setLayerSelected(selectedLayers[i].getId(), true);
                }                            
                this.filterLayers(this.filterField.getValue());
                */

                    // hide layers
                    this.$el.find('div.content').hide();
                }
            },
            /**
             * Creates a panel for adding of editing data producer/inspire theme groupings
             * @param  {String} tabId ['inspire' | 'organization']
             * @param  {Object} model data to populate the form with
             * @return {DOMElement}  element ready to be added to UI
             */
            __createGroupingPanel : function(tabId, model) {
                var instance = this.options.instance,
                    adminLoc = instance.getLocalization('admin'),
                    groupingConfig = {
                        "data": model,
                        // localizations
                        "title": adminLoc.addOrganizationName,
                        "desc" : adminLoc.addOrganizationNameTitle,
                        "localeInput" : adminLoc,
                        "btnLoc" : {
                            "add" : {
                                "title" : instance.getLocalization('add'),
                                "desc" : adminLoc.addNewOrganization
                            },
                            "save" : {
                                "title" : instance.getLocalization('save')
                            },
                            "delete" : {
                                "title" : instance.getLocalization('delete')
                            },
                            "cancel" : {
                                "title" : instance.getLocalization('cancel')
                            }
                        }
                };
                // override some UI texts for inspire theme form
                if(tabId === 'inspire') {
                    groupingConfig.title = adminLoc.addInspireName;
                    groupingConfig.desc = adminLoc.addInspireNameTitle;
                    groupingConfig.btnLoc.add.desc = adminLoc.addNewClass;
                }
                return this.addGroupingTemplate(groupingConfig);
            },
            /**
             * This method should show only those layers that matches with filter
             * This is not ready yet.
             *
             * @method filterLayers
             */
            filterLayers: function (e) {
                e.stopPropagation();
                //var element = jQuery(e.currentTarget);
                //this.layerGroupingModel.getFilteredLayerGroups(element.val());
            },
            /**
             * Shows grouping settings (name localization) when admin clicks
             * edit grouping (class / organization)
             *
             * @method toggleGroupingSettings
             */
            toggleGroupingSettings: function (e) {
                //show grouping settings
                e.stopPropagation();
                var element = jQuery(e.currentTarget),
                    grouping = element.parents('.accordion-header');
                // if there is no accordion-header 
                if (grouping.length == 0) {
                    element.parents('.admin-add-class').removeClass('show-add-class');;
                }
                // if there is accordion header, toggle visibility of settings
                else {
                    var adminAddClass = grouping.find('.admin-add-class');

                    if (!adminAddClass.hasClass('show-add-class')) {
                        adminAddClass.addClass('show-add-class');
                        grouping.find('.admin-edit-class-btn').html(this.options.instance.getLocalization('cancel'));
                    } else {
                        adminAddClass.removeClass('show-add-class');
                        grouping.find('.admin-edit-class-btn').html(this.options.instance.getLocalization('admin').edit);
                    }
                }
            },
            /**
             * Hide grouping settings (name & localization)
             *
             * @method hideGroupingSettings
             */
            hideGroupingSettings: function (e) {
                jQuery('.admin-add-class').removeClass('show-add-class');
            },

            /**
             * Shows "add organization" settings when admin clicks
             * add grouping (organization/inspire theme)
             *
             * @method toggleAddLayerGrouping
             */
            toggleAddLayerGrouping: function (e) {
                var elem = jQuery(e.currentTarget).parent().find('.admin-add-class');
                if (elem.hasClass('show-add-class')) {
                    elem.removeClass('show-add-class');
                } else {
                    elem.addClass('show-add-class');
                }
            },
            /**
             * Shows layer settings when admin clicks
             * add or edit layer (class / organization)
             *
             * @method toggleAddLayer
             */
            toggleAddLayer: function (e) {
                //add layer
                var me = this;
                e.stopPropagation();
                var element = jQuery(e.currentTarget);
                var layer = element.parent();

                if (!layer.find('.admin-add-layer').hasClass('show-add-layer')) {
                    // create layer settings view for adding or editing layer
                    var settings = new AdminLayerSettingsView({
                        model: null,
                        supportedTypes : me.supportedTypes,
                        instance: this.options.instance
                    });

                    layer.append(settings.$el);
                    // activate slider (opacity)
                    layer.find('.layout-slider').slider({
                        min: 0,
                        max: 100,
                        value: 100,
                        slide: function (event, ui) {
                            jQuery(ui.handle).parents('.left-tools').find("#opacity-slider").val(ui.value);
                        }
                    });
                    // change the title of the button
                    element.html(this.options.instance.getLocalization('cancel'));
                    element.attr('title',this.options.instance.getLocalization('cancel'));
                    setTimeout(function () {
                        layer.find('.admin-add-layer').addClass('show-add-layer');
                    }, 30);
                } else {
                    layer.find('.admin-add-layer').removeClass('show-add-layer');
                    element.html(this.options.instance.getLocalization('admin').addLayer);
                    element.attr('title',this.options.instance.getLocalization('admin').addLayerDesc);
                    layer.find('.admin-add-layer').remove();
                }
            },
            /**
             * Hides layer settings
             *
             * @method hideAddLayer
             */
            hideAddLayer: function (e) {
                e.stopPropagation();
                var element = jQuery(e.currentTarget);
                if (element.parents('.admin-add-layer').hasClass('show-add-layer')) {
                    element.parents('.admin-add-layer').removeClass('show-add-layer');
                    element.parents('.admin-add-layer').remove();

                }
            },
            /**
             * toggle visibility of layerGroup (show and hide layers)
             *
             * @method toggleLayerGroup
             */
            toggleLayerGroup: function (e) {
                var element = jQuery(e.currentTarget),
                    panel = element.parents('.accordion:first'),
                    headerIcon = panel.find('.headerIcon');
                if (panel.hasClass('open')) {
                    panel.removeClass('open');
                    headerIcon.removeClass('icon-arrow-down');
                    headerIcon.addClass('icon-arrow-right');
                    jQuery(panel).find('div.content').hide();
                } else {
                    panel.addClass('open');
                    headerIcon.removeClass('icon-arrow-right');
                    headerIcon.addClass('icon-arrow-down');
                    jQuery(panel).find('div.content').show();
                }
            },

            /**
             * Save  LayerGrouping (Organization/inspire theme)
             *
             * @method saveLayerGrouping
             */
            saveLayerGrouping: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    addClass = element.parents('.admin-add-class');

                var data = {
                    id : element.parents('.accordion').attr('lcid')
                };

                addClass.find('[id$=-name]').filter('[id^=add-class-]').each(function (index) {
                    lang = this.id.substring(10, this.id.indexOf("-name"));
                    data["name_" + lang] = this.value;
                });

                this.layerGroupingModel.save(data, function(err) {
                    if(err) {
                        // TODO: handle error
                        alert("Error!! " + err);
                        return;
                    }
                    element.parents('.show-add-class').removeClass('show-add-class');
                });
            },
            /**
             * Remove LayerGrouping (Organization/inspire theme)
             *
             * @method removeLayerGrouping
             */
            removeLayerGrouping: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    groupId = element.attr('data-id'),
                    group = this.layerGroupingModel.getGroup(groupId),
                    layers = group.getLayers(),
                    loc = me.instance.getLocalization();

                if (this.allowDeleteWhenNotEmpty && layers.length > 0) {
                    this.__showDialog(loc.errors.title, loc.errors['not_empty'], element);
                    return;
                }
                var confirmMsg = loc.admin.confirmDeleteLayerGroup;
                if(!confirm(confirmMsg)) {
                    // user canceled
                    return;
                }

                this.layerGroupingModel.remove(groupId, function(err, info) {
                    if(info && info.responseText) {
                        try {
                            var obj = JSON.parse(info.responseText);
                            if(obj.info && obj.info.code && loc.errors[obj.info.code]) {
                                me.__showDialog(loc.errors.title, loc.errors[obj.info.code], element);
                            }
                            return;
                        } catch(ignored) {}
                    }
                    if(err) {
                        // TODO: handle error
                        alert("Error!! " + err);
                        return;
                    }
                });
            },
            __showDialog : function(title, content, elRef, alignment) {
                var me = this;
                if(this.__dialog) {
                    // close previous one if any
                    this.__dialog.close(true);
                    // TODO: or maybe reuse?
                    this.__dialog = null;
                }
                this.__dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                this.__dialog.show(title, content);
                if(elRef) {
                    this.__dialog.moveTo(elRef, alignment);
                }
                // clear reference this.__dialog on close
                this.__dialog.onClose(function() {
                    me.__dialog = null;
                });
            },
            /**
             * Stops propagation of click events
             *
             * @method catchClicks
             */
            catchClicks: function (e) {
                e.stopPropagation();
            }


        });
    });