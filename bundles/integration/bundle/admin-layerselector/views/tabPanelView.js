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

        events: {
            "keyup .admin-filter-input"  : "filterLayers",
            "click .accordion-header"       : "toggleLayerGroup",
            "click .admin-add-layer-btn"    : "toggleAddLayer",
            "click .admin-add-layer-cancel" : "hideAddLayer",
 
            "click .admin-edit-class-btn"   : "toggleGroupingSettings",
            "click .admin-edit-org-btn"     : "toggleGroupingSettings",
            "click .admin-add-class-cancel" : "toggleGroupingSettings",
            "click .admin-add-org-cancel"   : "toggleGroupingSettings",

            "click .admin-add-org-ok"       : "saveOrganization",
            "click .admin-remove-org"       : "removeOrganization",
            "click .admin-add-class-ok"     : "saveClass",
            "click .admin-remove-class"     : "removeClass",

            "click #add-layer-wms-button"   : "fetchCapabilities"
        },
        initialize : function() {
            this.layerGroupingModel             = this.options.layerGroupingModel;
            this.layerGroupingModel.on("change:layerGroups", this.render, this);
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
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            console.log('render tab-content');
            this.$el.addClass(this.options.tabId);
            this.$el.empty();

            if(this.layerGroupingModel != null){
//                this.layerContainers = undefined;
                this.layerContainers = {};

                for(var i = 0; i < this.layerGroupingModel.layerGroups.length; ++i) {
                    var group = this.layerGroupingModel.layerGroups[i];

                    var visibleLayerCount = 0;
                    var groupPanel = jQuery(this.accordionTemplate({
                        title: this.layerGroupingModel.getGroupingTitle(i, Oskari.getLang()),
                        instance: this.options.instance
                        }));
                    var groupContainer = groupPanel.find('.content');
                    if(group.models != null){
                        for(var n = 0; n < group.models.length; ++n) {
                            var layer = group.at(n);


                            var layerView = new LayerView({
                                model:layer, 
                                instance: this.options.instance,
                                classes: this.inspireClasses,
                                layerTabModel : this.layerGroupingModel
                            });

                            if(visibleLayerCount%2 == 1) {
                                layerView.$el.addClass('odd');
                            } else {
                                layerView.$el.removeClass('odd');
                            }
                            visibleLayerCount++;

                            groupContainer.append(layerView.$el);
                            
                            this.layerContainers[layer.getId()] = layerView;
                        }
                    }
                    groupContainer.append(this.addLayerBtnTemplate({instance: this.options.instance}));

                    var tab = this.tabTemplate({lcId: group.id});
                    groupPanel.find('.accordion-header').append((this.options.tabId == 'inspire') ? 
                        this.addInspireTemplate({data: group, instance: this.options.instance}):
                        this.addOrganizationTemplate({data: group, instance: this.options.instance})
                        );
                    this.$el.append(jQuery(tab).append(groupPanel));

                }

                this.$el.prepend(this.filterTemplate({instance: this.options.instance}));
                if(this.options.tabId == 'inspire') {
                    this.$el.find('.oskarifield').append(
                        this.addInspireButtonTemplate({instance: this.options.instance})).append(
                        this.addInspireTemplate({
                            data: null, 
                            instance: this.options.instance
                        }));
                } else {
                    this.$el.find('.oskarifield').append(
                        this.addOrganizationButtonTemplate({instance: this.options.instance})).append(
                        this.addOrganizationTemplate({data: null, instance: this.options.instance}));
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
        filterLayers: function(e) {
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
debugger;
            this.layerGroupingModel.getFilteredLayerGroups(element.val());
        },
        toggleGroupingSettings : function(e) {
            //add layer
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            var grouping = element.parents('.accordion-header');
            if(grouping.length == 0) {
                element.parents('.admin-add-class').removeClass('show-add-class');;
            } else {
                var adminAddClass = grouping.find('.admin-add-class');

                if(!adminAddClass.hasClass('show-add-class')) {
                    adminAddClass.addClass('show-add-class');
                    grouping.find('.admin-edit-class-btn').html('Peruuta')
                } else {
                    adminAddClass.removeClass('show-add-class');
                    grouping.find('.admin-edit-class-btn').html('Muokkaa')
                }
            }
        },
        hideGroupingSettings : function(e) {
            jQuery('.admin-add-class').removeClass('show-add-class');
        },

        toggleAddLayer : function(e) {
debugger;
            //add layer
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            var layer = element.parent();

            if(!layer.find('.admin-add-layer').hasClass('show-add-layer')) {
/*                var settings = this.adminLayerTemplate({
                    instance : this.options.instance, 
                    model : null, 
                    classNames: this.inspireClasses.getGroupTitles()
                });
*/
                var settings = new AdminLayerSettingsView({
                    model: null,  
                    instance : this.options.instance, 
                    classes : this.inspireClasses
                });

                layer.append(settings.$el);
                layer.find('.layout-slider').slider({
                    min:0, 
                    max: 100, 
                    value:100, 
                    slide: function( event, ui ) {
                        jQuery(ui.handle).parents('.left-tools').find( "#opacity-slider" ).val( ui.value );
                    }
                });
                element.html('Peruuta');
                setTimeout(function(){
                    layer.find('.admin-add-layer').addClass('show-add-layer');
                }, 30);
            } else {
                layer.find('.admin-add-layer').removeClass('show-add-layer');
                element.html('Lisää taso');
                setTimeout(function(){
                    layer.find('.admin-add-layer').remove();
                },300);

            }
        },
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

        saveOrganization: function(e) {
            var me = this,
                element = jQuery(e.currentTarget),
                addClass = element.parents('.admin-add-class');
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "&action_route=SaveOrganization",
                id = "&layercl_id=",
                lcId = element.parents('.accordion').attr('lcid'),
                parentId = "&parent_id=",
                nameFi = "&name_fi=",
                nameSv = "&name_sv=",
                nameEn = "&name_en=",
                fi = addClass.find("#add-class-fi-name").val(),
                sv = addClass.find("#add-class-sv-name").val(),
                en = addClass.find("#add-class-en-name").val();

            var url = baseUrl + action_route + id;
            if(lcId != null) {
                url += lcId;
            }
            url += parentId+nameFi+fi+nameSv+sv+nameEn+en;
            me._save(e, url, function(response){
                me.layerGroupingModel.getClasses(me.options.instance.getSandbox().getAjaxUrl(),"&action_route=GetMapLayerClasses");
                element.parents('.show-add-class').removeClass('show-add-class');
                addClass.find('.admin-edit-class-btn').html('Muokkaa')
            });

        },
        saveClass: function(e) {
            //TODO
            alert('Backend component is not ready yet.');
        },
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
            me._remove(e, url, function(response) {
                me.layerGroupingModel.removeClass(idValue);
                element.parents('.accordion.open').remove();
            });
        },
        removeClass: function(e) {
            //TODO
            alert('Backend component is not ready yet.');
        },
        _remove: function(e, url, successCallback) {
            var me = this;
            var element = jQuery(e.currentTarget);
            var addClass = element.parents('.admin-add-class');
debugger;
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

        fetchCapabilities: function(e){
            var me = this;
            var element = jQuery(e.currentTarget);
            var input = element.parents('.add-layer-wrapper').find('#add-layer-interface');
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                route = "action_route=GetWSCapabilities",
                type = "&wmsurl=";
            //add-layer-wms-button

            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : baseUrl + route + type + encodeURIComponent(input.val()),
                success : function(resp) {
                    me.addCapabilitySelect(resp, me, element);
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' false ');
                    }
                }
            });


        },
        addCapabilitySelect: function(capability, me, element) {
            me.capabilities = this.getValue(capability);
            if(me.capabilities == null || me.capabilities.Capability == null) {
                console.log("Could not find Capability from response");
                return;
            }

            var select = '<select id="admin-select-capability">';
            var layers = this.getValue(this.capabilities, 'Capability').Layer.Layer;
            for (var i = layers.length - 1; i >= 0; i--) {
                select += '<option value="'+i+'">' + layers[i].Title + '</option>';
            };
            select += '</select>';

            element.parent().find('#admin-select-capability').remove();
            element.parent().append(select);
            element.parent().find('#admin-select-capability').on('change', me.readCapabilities);

        },
        readCapabilities: function(e){
debugger;
            var selected = jQuery('#admin-select-capability').val();

            var capability = this.getValue(this.capabilities, 'Capability');
            var selectedLayer = capability.Layer.Layer[selected];

            var wmsname = selectedLayer.Name;
            jQuery('#add-layer-wms-id').val(wmsname);


            var styles = selectedLayer.Style;
            if(styles != null) {

                //LegendURL
                if(styles.LegendURL) {
                    var legendURL = styles.LegendURL.OnlineResource['xlink:href'];
                    jQuery('#add-layer-legendImage').val(legendURL);                    
                }

                //Styles
                var styleSelect = jQuery('#add-layer-style');
                if(Object.prototype.toString.call(styles) === '[object Array]') {
                    var s = [];
                    for (var i = 0; i < styles.length; i++) {
                        styleSelect.append('<option>' +styles[i].Title + '</option>');
                    };
                } else {
                    styleSelect.append('<option>' +styles.Title + '</option>');
                }
            }

            // GFI Type
            var gfiType = capability.Request.GetFeatureInfo.Format;
            var gfiTypeSelect = jQuery('#add-layer-responsetype');
            for (var i = 0; i < gfiType.length; i++) {
                gfiTypeSelect.append('<option>' + gfiType[i] + '</option>');
            };

            // WMS Metadata Id
            if(capability['inspire_vs:ExtendedCapabilities'] && 
                capability['inspire_vs:ExtendedCapabilities']['inspire_common:MetadataUrl'] &&
                capability['inspire_vs:ExtendedCapabilities']['inspire_common:MetadataUrl']['inspire_common:URL'].indexOf != null
                ) {
                var wmsMetadataId = capability['inspire_vs:ExtendedCapabilities']['inspire_common:MetadataUrl']['inspire_common:URL'];
                wmsMetadataId = wmsMetadataId.substring(wmsMetadataId.indexOf('id=') + 3);
                if( wmsMetadataId.indexOf('&') >= 0) {
                    wmsMetadataId = wmsMetadataId.substring (0, wmsMetadataId.indexOf('&'));
                }
                jQuery('#add-layer-metadataid').val(wmsMetadataId);
            }

            //metadata id == uuid
            //"http://www.paikkatietohakemisto.fi/geonetwork/srv/en/main.home?uuid=a22ec97f-d418-4957-9b9d-e8b4d2ec3eac"
            var uuid = this.capabilities.Service.OnlineResource['xlink:href'];
            if(uuid) {
                var idx = uuid.indexOf('uuid=');
                if(idx >= 0) {
                    uuid = uuid.substring(idx + 5);
                    if( uuid.indexOf('&') >= 0) {
                        uuid = uuid.substring(0, uuid.indexOf('&'));
                    }                    
                    jQuery('#add-layer-datauuid').val(uuid);
                }
            }

        },

        getValue: function(object, key) {
            for (var k in object){
                if(key != null) {
                    return object[key];
                } else {
                    return object[k];
                }
            }
        },


        updateModel: function(idValue) {
            var me = this;
            me.layerGroupingModel.removeClass(idValue);
        }


    });
});
