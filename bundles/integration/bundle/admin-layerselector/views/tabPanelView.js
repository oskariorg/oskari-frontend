define([
    'text!_bundle/templates/filterLayersTemplate.html',
    'text!_bundle/templates/adminAddInspireBtnTemplate.html',
    'text!_bundle/templates/adminAddInspireTemplate.html',
    'text!_bundle/templates/adminAddOrgBtnTemplate.html',    
    'text!_bundle/templates/adminAddOrgTemplate.html',    
    'text!_bundle/templates/adminAddLayerBtnTemplate.html',
    'text!_bundle/templates/tabPanelTemplate.html',
    'text!_bundle/templates/accordionPanelTemplate.html',
    'text!_bundle/templates/layerRowTemplate.html',
    'text!_bundle/templates/adminLayerRowTemplate.html',    
    '_bundle/views/layerView'], 
    function(FilterLayersTemplate, 
        AdminAddInspireButtonTemplate,
        AdminAddInspireTemplate,
        AdminAddOrganizationButtonTemplate,
        AdminAddOrganizationTemplate,
        AdminAddLayerBtnTemplate,
        TabPanelTemplate, 
        AccordionPanelTemplate,
        LayerRowTemplate, 
        AdminLayerRowTemplate,
        LayerView) {
    return Backbone.View.extend({
        tagName: 'div',

        className: 'tab-content',

        events: {
            "click .accordion-header"       : "toggleLayerGroup",
            "click .admin-add-layer-btn"    : "toggleAddLayer",
            "click .admin-edit-class-btn"   : "toggleGroupingSettings",
            "click .admin-add-class-ok"     : "addOrganization"
        },
        initialize : function() {
            this.layerGroupingModel             = this.options.layerGroupingModel;

            this.addInspireButtonTemplate       = _.template(AdminAddInspireButtonTemplate);
            this.addInspireTemplate             = _.template(AdminAddInspireTemplate);
            this.addOrganizationButtonTemplate  = _.template(AdminAddOrganizationButtonTemplate);
            this.addOrganizationTemplate        = _.template(AdminAddOrganizationTemplate);
            this.addLayerBtnTemplate            = _.template(AdminAddLayerBtnTemplate);
            this.filterTemplate                 = _.template(FilterLayersTemplate);
            this.tabTemplate                    = _.template(TabPanelTemplate);
            this.accordionTemplate              = _.template(AccordionPanelTemplate);
            this.layerTemplate                  = _.template(LayerRowTemplate);
            this.adminLayerTemplate             = _.template(AdminLayerRowTemplate);

            this.groupNames = this.layerGroupingModel.getGroupTitles();
            this.render();
        },
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            console.log('render tab-content');
            this.$el.addClass(this.options.tabId);

            if(this.layerGroupingModel != null){
//                this.layerContainers = undefined;
                this.layerContainers = {};

                for(var i = 0; i < this.layerGroupingModel.layerGroups.length; ++i) {
                    var group = this.layerGroupingModel.layerGroups[i];
    //                var layers = group.getLayers();

        //            groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
        //            group.layerListPanel = groupPanel;

                    var visibleLayerCount = 0;
                    var groupPanel = jQuery(this.accordionTemplate({
                        title: group.getTitle() + ' (' + group.models.length + ')',
                        instance: this.options.instance
                        }));
                    var groupContainer = groupPanel.find('.content');
                    for(var n = 0; n < group.models.length; ++n) {
                        var layer = group.at(n);


                        var layerView = new LayerView({model:layer, instance: this.options.instance, layerGroupingNames: this.layerGroupingNames});
                        //var layerWrapper = //jQuery(this.layerTemplate({title: group.getTitle() + ' (' + layers.length + ')'}));
                        // var layerWrapper = 
                        //     Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.view.Layer',
                        //     layer, this.instance.sandbox, this.instance.getLocalization());
                        //var layerContainer = layerWrapper.find('.container');
                        if(visibleLayerCount%2 == 1) {
                            layerView.$el.addClass('odd');
                        } else {
                            layerView.$el.removeClass('odd');
                        }
                        visibleLayerCount++;

                        groupContainer.append(layerView.$el);
                        
                        this.layerContainers[layer.getId()] = layerView;
                    }
                    groupContainer.append(this.addLayerBtnTemplate({instance: this.options.instance}));

                    var tab = this.tabTemplate();
                    groupPanel.find('.accordion-header').append((this.options.tabId == 'inspire') ? 
                        this.addInspireTemplate({instance: this.options.instance}):
                        this.addOrganizationTemplate({instance: this.options.instance})
                        );
                    this.$el.append(jQuery(tab).append(groupPanel));

                }

                this.$el.prepend(this.filterTemplate({instance: this.options.instance}));
                if(this.options.tabId == 'inspire') {
                    this.$el.find('.oskarifield').append(
                        this.addInspireButtonTemplate({instance: this.options.instance})).append(
                        this.addInspireTemplate({instance: this.options.instance}));
                } else {
                    this.$el.find('.oskarifield').append(
                        this.addOrganizationButtonTemplate({instance: this.options.instance})).append(
                        this.addOrganizationTemplate({instance: this.options.instance}));
                }

                
    /*            var selectedLayers = this.options.instance.sandbox.findAllSelectedMapLayers();
                for(var i = 0; i < selectedLayers.length; ++i) {
                    this.setLayerSelected(selectedLayers[i].getId(), true);
                }
                            
                this.filterLayers(this.filterField.getValue());
    */


                this.$el.find('div.content').hide();
            }
        },
        toggleGroupingSettings : function(e) {
            //add layer
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            var grouping = element.parent();

            if(!grouping.find('.admin-add-class').hasClass('show-add-class')) {
                setTimeout(function(){
                    grouping.find('.admin-add-class').addClass('show-add-class');
                }, 30);
            } else {
                grouping.find('.admin-add-class').removeClass('show-add-class');
                setTimeout(function(){
                    grouping.find('.admin-add-class').remove();
                },300);

            }
        },
        hideGroupingSettings : function(e) {
            jQuery('.admin-add-class').removeClass('show-add-class');
        },

        toggleAddLayer : function(e) {
            //add layer
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            var layer = element.parent();

            if(!element.find('.admin-add-layer').hasClass('show-add-layer')) {
                var settings = this.adminLayerTemplate({instance : this.options.instance, model : null});
                layer.append(settings);
                setTimeout(function(){
                    jQuery('.admin-add-layer').addClass('show-add-layer');
                }, 30);
            } else {
                jQuery('.admin-add-layer').removeClass('show-add-layer');
                setTimeout(function(){
                    jQuery('.admin-add-layer').remove();
                },300);

            }
        },
        toggleLayerGroup : function(e) {
            var element = jQuery(e.currentTarget);
            var panel = element.parents('.accordion:first');
            var headerIcon = panel.find('.headerIcon');
            if(panel.hasClass('open')) {
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

        addOrganization: function(e) {
            var me = this;
            var element = jQuery(e.currentTarget);
            var addClass = element.parents('.admin-add-class');
debugger;
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "&action_route=SaveOrganization",
                id = "&layercl_id=",
                parentId = "&parent_id=",
                nameFi = "&name_fi=",
                nameSv = "&name_sv=",
                nameEn = "&name_en="
                fi = addClass.find("#add-class-fi-name").val(),
                sv = addClass.find("#add-class-sv-name").val(),
                en = addClass.find("#add-class-en-name").val();


            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : baseUrl + action_route+id+parentId+nameFi+fi+nameSv+sv+nameEn+en,
                success : function(resp) {
                    alert(resp);
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' false ');
                    }
                }
            });

        },
        //&action_route=DeleteOrganization&layercl_id=46&parent_id=
        removeOrganization: function(e) {
            var me = this;
            var element = jQuery(e.currentTarget);
            var addClass = element.parents('.admin-add-class');
debugger;
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "&action_route=DeleteOrganization",
                id = "&layercl_id=",
                parentId = "&parent_id=",
                idValue = element.attr('data-id'),
                parentIdValue = element.attr('data-parent-id');


            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : baseUrl + action_route+id+idValue+parentId+parentIdValue,
                success : function(resp) {
                    alert(resp);
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' false ');
                    }
                }
            });

        },






    });
});
