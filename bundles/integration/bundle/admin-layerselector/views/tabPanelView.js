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
    '_bundle/views/adminLayerSettingsView',    
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
            "keyup .admin-filter-input"     : "filterLayers",
            "click .accordion-header"       : "toggleLayerGroup",
            "click .admin-add-layer-btn"    : "toggleAddLayer",
            "click .admin-add-layer-cancel" : "hideAddLayer",
 
            "click .admin-edit-class-btn"   : "toggleGroupingSettings",
            "click .admin-edit-org-btn"     : "toggleGroupingSettings",
            "click .admin-add-class-cancel" : "toggleGroupingSettings",
            "click .admin-add-org-cancel"   : "toggleGroupingSettings",

            "click .admin-add-org-btn"      : "toggleAddOrg",
            "click .admin-add-class-btn"    : "toggleAddClass",

            "click .admin-add-org-ok"       : "saveOrganization",
            "click .admin-remove-org"       : "removeOrganization",
            "click .admin-add-class-ok"     : "saveClass",
            "click .admin-remove-class"     : "removeClass",
            "click .show-add-class"         : "catchClicks"
        },

        /**
         * At initialization we add model for this tabPanelView, add templates
         * and do other initialization steps.
         *
         * @method initialize
         */
        initialize : function() {
            this.layerGroupingModel             = this.options.layerGroupingModel;
            // If model triggers change event we need to re-render this view
            this.layerGroupingModel.on("change:layerGroups", this.render, this);
            // inspireClasses is needed when creating a new layer
            this.inspireClasses = (this.options.inspire != null) ? 
                this.options.inspire : this.layerGroupingModel;

            this.addInspireButtonTemplate       = _.template(AdminAddInspireButtonTemplate);
            this.addInspireTemplate             = _.template(AdminAddInspireTemplate);
            this.addOrganizationButtonTemplate  = _.template(AdminAddOrganizationButtonTemplate);
            this.addOrganizationTemplate        = _.template(AdminAddOrganizationTemplate);
            this.addLayerBtnTemplate            = _.template(AdminAddLayerBtnTemplate);
            this.filterTemplate                 = _.template(FilterLayersTemplate);
            this.tabTemplate                    = _.template(TabPanelTemplate);
            this.accordionTemplate              = _.template(AccordionPanelTemplate);
            this.layerTemplate                  = _.template(LayerRowTemplate);
            _.bindAll(this);

            this.render();
        },

        /**
         * When rendering this app we need to loop through all the classes or organizations 
         * in the tabModel
         *
         * @method render
         */
        render : function() {
            this.$el.addClass(this.options.tabId);
            this.$el.empty();

            if(this.layerGroupingModel != null){
                this.layerContainers = {};

                // Loop through layer groupings
                for(var i = 0; i < this.layerGroupingModel.layerGroups.length; ++i) {
                    var group = this.layerGroupingModel.layerGroups[i];

                    var visibleLayerCount = 0;
                    //create groupPanel / accordion
                    var groupPanel = jQuery(this.accordionTemplate({
                        title: this.layerGroupingModel.getGroupingTitle(i, Oskari.getLang()),
                        instance: this.options.instance
                        }));
                    var groupContainer = groupPanel.find('.content');
                    if(group.models != null){
                        // Loop through layers in this group
                        for(var n = 0; n < group.models.length; ++n) {
                            var layer = group.at(n);

                            // create a new layerView with layer model.
                            var layerView = new LayerView({
                                model:layer, 
                                instance: this.options.instance,
                                classes: this.inspireClasses,
                                layerTabModel : this.layerGroupingModel
                            });

                            //odds and even rows
                            if(visibleLayerCount%2 == 1) {
                                layerView.$el.addClass('odd');
                            } else {
                                layerView.$el.removeClass('odd');
                            }
                            visibleLayerCount++;
                            // Add layerView to group container
                            groupContainer.append(layerView.$el);
                            // TODO remove this line
                            this.layerContainers[layer.getId()] = layerView;
                        }
                    }
                    // At this point we want to add new grouping button only for organization
                    if(this.options.tabId == 'organization') {
                        groupContainer.append(this.addLayerBtnTemplate({instance: this.options.instance}));
                    }
                    // add grouping template to group panel
                    var tab = this.tabTemplate({lcId: group.id});
                    groupPanel.find('.accordion-header').append((this.options.tabId == 'inspire') ? 
                        this.addInspireTemplate({data: group, instance: this.options.instance}):
                        this.addOrganizationTemplate({data: group, instance: this.options.instance})
                        );
                    // add group panel to this tab
                    this.$el.append(jQuery(tab).append(groupPanel));

                }
                // add new grouping button and settings template
                this.$el.prepend(this.filterTemplate({instance: this.options.instance}));
                if(this.options.tabId == 'inspire') {
                    this.$el.find('.oskarifield').append(
                        this.addInspireButtonTemplate({instance: this.options.instance})).append(
                        this.addInspireTemplate({data: null, instance: this.options.instance}));
                } else {
                    this.$el.find('.oskarifield').append(
                        this.addOrganizationButtonTemplate({instance: this.options.instance})).append(
                        this.addOrganizationTemplate({data: null, instance: this.options.instance}));
                }

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
         * This method should show only those layers that matches with filter
         * This is not ready yet.
         *
         * @method filterLayers
         */
        filterLayers: function(e) {
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
        toggleGroupingSettings : function(e) {
            //show grouping settings
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            var grouping = element.parents('.accordion-header');
            // if there is no accordion-header 
            if(grouping.length == 0) {
                element.parents('.admin-add-class').removeClass('show-add-class');;
            }
            // if there is accordion header, toggle visibility of settings
            else {
                var adminAddClass = grouping.find('.admin-add-class');

                if(!adminAddClass.hasClass('show-add-class')) {
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
        hideGroupingSettings : function(e) {
            jQuery('.admin-add-class').removeClass('show-add-class');
        },

        /**
         * Shows "add organization" settings when admin clicks 
         * add grouping (organization)
         * 
         * @method toggleAddOrg
         */
        toggleAddOrg : function(e) {
            var elem = jQuery(e.currentTarget).parent().find('.admin-add-class');
            if(elem.hasClass('show-add-class')) {
                elem.removeClass('show-add-class');
            } else {
                elem.addClass('show-add-class');
            }
        },
        /**
         * Shows "add class" settings when admin clicks 
         * add grouping (class)
         * 
         * @method toggleAddClass
         */
        toggleAddClass : function(e) {
            alert('Backend component is not ready yet.');
        },

        /**
         * Shows layer settings when admin clicks 
         * add or edit layer (class / organization)
         * 
         * @method toggleAddLayer
         */
        toggleAddLayer : function(e) {
            //add layer
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            var layer = element.parent();

            if(!layer.find('.admin-add-layer').hasClass('show-add-layer')) {
                // create layer settings view for adding or editing layer
                var settings = new AdminLayerSettingsView({
                    model: null,  
                    instance : this.options.instance, 
                    classes : this.inspireClasses
                });

                layer.append(settings.$el);
                // activate slider (opacity)
                layer.find('.layout-slider').slider({
                    min:0,
                    max: 100,
                    value:100,
                    slide: function( event, ui ) {
                        jQuery(ui.handle).parents('.left-tools').find( "#opacity-slider" ).val( ui.value );
                    }
                });
                // change the title of the button
                element.html(this.options.instance.getLocalization('cancel'));
                setTimeout(function(){
                    layer.find('.admin-add-layer').addClass('show-add-layer');
                }, 30);
            } else {
                layer.find('.admin-add-layer').removeClass('show-add-layer');
                element.html(this.options.instance.getLocalization('admin').addLayer);
                setTimeout(function(){
                    layer.find('.admin-add-layer').remove();
                },300);
            }
        },
        /**
         * Hides layer settings 
         * 
         * @method hideAddLayer
         */
        hideAddLayer : function(e) {
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            if(element.parents('.admin-add-layer').hasClass('show-add-layer')) {
                element.parents('.admin-add-layer').removeClass('show-add-layer');
                setTimeout(function(){
                    element.parents('.admin-add-layer').remove();
                },300);

            }
        },
        /**
         * toggle visibility of layerGroup (show and hide layers)
         * 
         * @method toggleLayerGroup
         */
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

        /**
         * Save organizations 
         * 
         * @method saveOrganization
         */
        saveOrganization: function(e) {
			//console.log("saveOrganisation");
            var me = this,
                element = jQuery(e.currentTarget),
                addClass = element.parents('.admin-add-class');
            // url for backend action_route
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "&action_route=SaveOrganization",
                id = "&layerclass_id=",
                // id = "&layercl_id=", // this param is used in remove 
                lcId = element.parents('.accordion').attr('lcid'),
                parentId = "&parent_id=",
                nameFi = "&name_fi=",
                nameSv = "&name_sv=",
                nameEn = "&name_en=",
                fi = addClass.find("#add-class-fi-name").val(),
                sv = addClass.find("#add-class-sv-name").val(),
                en = addClass.find("#add-class-en-name").val();

            var url = baseUrl + action_route + id;
            //add id of layer class
            if(lcId != null) {
                url += lcId;
            }
            url += parentId+nameFi+fi+nameSv+sv+nameEn+en;
            // make AJAX call
            me._save(e, url, function(response){
				//console.log("Save...");
                // callback functionality
                me.layerGroupingModel.getClasses(me.options.instance.getSandbox().getAjaxUrl(),"&action_route=GetMapLayerClasses");
                element.parents('.show-add-class').removeClass('show-add-class');
                addClass.find('.admin-edit-org-btn').html(me.options.instance.getLocalization('edit'))
            });

        },
        /**
         * Save class
         * 
         * @method saveOrganization
         */
        saveClass: function(e) {
            //TODO
            alert('Backend component is not ready yet.');
        },
       /**
         * Save grouping. Do not use this method, but saveOrganization or saveClass
         * 
         * @method _save
         */
         _save: function(e, url, successCallback) {
            var me = this,
                element = jQuery(e.currentTarget),
                addClass = element.parents('.admin-add-class');

            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : url,
                success : function(resp) {
                    if(successCallback && resp === null) {
                        successCallback(resp);
                    }
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' false ');
                    }
                }
            });

        },
        /**
         * Remove organizations 
         * 
         * @method removeOrganization
         */
        removeOrganization: function(e) {
            var me = this,
                element = jQuery(e.currentTarget);

            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "&action_route=DeleteOrganization",
                id = "&layercl_id=",
                parentId = "&parent_id=",
                idValue = element.attr('data-id'),
                parentIdValue = element.attr('data-parent-id');

            idValue = (idValue != null) ? idValue : '';
            parentIdValue = (parentIdValue != null) ? parentIdValue : '';
            var url = baseUrl + action_route+id+idValue+parentId+parentIdValue;
            // make AJAX call
            me._remove(e, url, function(response) {
                me.layerGroupingModel.removeClass(idValue);
                element.parents('.accordion').remove();
            });
        },
        /**
         * Remove class
         * 
         * @method removeClass
         */
        removeClass: function(e) {
            //TODO
            alert('Backend component is not ready yet.');
        },
        /**
         * Remove grouping. Do not use this method, but removeOrganization or removeClass
         * 
         * @method _remove
         */
        _remove: function(e, url, successCallback) {
            var me = this;
            var element = jQuery(e.currentTarget);
            var addClass = element.parents('.admin-add-class');
            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : url,
                success : function(resp) {
                    if(successCallback && resp === null) {
                        successCallback(resp);                        
                    }
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' false ');
                    }
                }
            });
        },

        /**
         * Stops propagation of click events
         * 
         * @method catchClicks
         */
        catchClicks: function(e) {
            e.stopPropagation();
        }


    });
});
