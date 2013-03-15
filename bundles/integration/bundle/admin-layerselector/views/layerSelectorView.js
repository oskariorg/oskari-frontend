define([
    "text!_bundle/templates/layerSelectorTemplate.html",
    "text!_bundle/templates/tabTitleTemplate.html",
    '_bundle/collections/allLayersCollection',
    '_bundle/models/layersTabModel',
    '_bundle/views/tabPanelView'], 
    function(ViewTemplate, TabTitleTemplate, LayerCollection, LayersTabModel, TabPanelView) {
    return Backbone.View.extend({

        events : {
            "click .admin-layer-tab"        : "toggleTab",
            "click .admin-add-class-btn"    : "toggleAddOrg",
            "click .admin-edit-layer-btn"   : "toggleAddOrg", 
            "click .admin-add-class-cancel" : "toggleAddOrg",
            "click .admin-edit-class-cancel": "toggleAddOrg"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.instance = this.options.instance;
            this.el = this.options.el;
            this.appTemplate = _.template(ViewTemplate);
            this.tabTitleTemplate = _.template(TabTitleTemplate)
            this.selectedType = 'organization';
//            this.layerTabs = [];
            this.render();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            this.el.html(this.appTemplate);
            this._renderLayerGroups(null, 'inspire');


        },
        _renderLayerGroups: function(layerGroupingTab, tabType) {
            if(layerGroupingTab != null)  {

                //we need a reference to organization side for selecting themes
                var inspire = null;
                if(tabType == 'organization') {
                    inspire = this.inspireTabModel;
                }
                //create tab container
                var tabContent = new TabPanelView({
                    layerGroupingModel: layerGroupingTab,
                    instance : this.instance,
                    tabId : tabType,
                    inspire : inspire
                });
                //create headers for tabs
                jQuery('.admin-layerselectorapp').find('.tabsContent').append(tabContent.$el);
                jQuery('.admin-layerselectorapp').find('.tabsHeader ul').append(
                    this.tabTitleTemplate({
                        title: tabContent.layerGroupingModel.getTitle(),
                        tabId: tabType
                    }));
            }
        },

        addToCollection: function(models) {
            this.collection = new LayerCollection(models);
            this.inspireGrouping    = this.collection.getLayerGroups('getInspireName');
            this.orgGrouping        = this.collection.getLayerGroups('getOrganizationName');

            this.el.html(this.appTemplate);
            this.inspireTabModel = new LayersTabModel({
                grouping : this.inspireGrouping, 
                type: 'inspire',
                title: this.instance.getLocalization('filter').inspire
            });
            this._renderLayerGroups(this.inspireTabModel, 'inspire', null);

            this.organizationTabModel = new LayersTabModel({
                grouping : this.orgGrouping, 
                type: 'organization',
                title: this.instance.getLocalization('filter').organization
            });
            this._renderLayerGroups(this.organizationTabModel, 'organization', this.inspireTabModel);

            //activate tab
            jQuery('.admin-layerselectorapp .tabsHeader').find('.organization').parent().addClass('active');
            jQuery('.tab-content.inspire').hide();
            jQuery('.tab-content.organization').show();
            
            // Check that data for classes is fetched
            this.inspireTabModel.getClasses(this.instance.getSandbox().getAjaxUrl(), "action_route=GetInspireThemes");
            this.organizationTabModel.getClasses(this.instance.getSandbox().getAjaxUrl(),"&action_route=GetMapLayerClasses");

        },

        toggleTab : function(e) {
            e.stopPropagation();
            var target  = jQuery(e.currentTarget);
            var type    = target.attr('data-tab');

            jQuery('.tabsHeader').find('.active').removeClass('active');
            target.parent().addClass('active');

            if(type == 'inspire') {
                jQuery('.tab-content.organization').hide();                
                jQuery('.tab-content.inspire').show();
                jQuery('.tab-content.inspire').find('.admin-filter-input').focus();
                this.selectedType = type;
            }
            else if(type == 'organization') {
                jQuery('.tab-content.inspire').hide();                
                jQuery('.tab-content.organization').show();
                jQuery('.tab-content.organization').find('.admin-filter-input').focus();
                this.selectedType = type;
            }

        }, 
        toggleAddOrg : function(e) {
            var elem = jQuery(e.currentTarget).parent().find('.admin-add-class');
            if(elem.hasClass('show-add-class')) {
                elem.removeClass('show-add-class');
            } else {
                elem.addClass('show-add-class');
            }
        },
        removeAddOrg : function(e) {
            jQuery('.admin-add-class').removeClass('show-add-class');
        }



    });
});
