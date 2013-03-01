define([
    "text!_bundle/templates/layerSelectorTemplate.html",
    "text!_bundle/templates/tabTitleTemplate.html",
    '_bundle/collections/allLayersCollection',
    '_bundle/models/layersTabModel',
    '_bundle/views/tabPanelView'], 
    function(ViewTemplate, TabTitleTemplate, LayerCollection, LayersTabModel, TabPanelView) {
    return Backbone.View.extend({

        events : {
            "click .admin-layer-tab" : "toggleTab"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.instance = this.options.instance;
            this.el = this.options.el;
            this.appTemplate = _.template(ViewTemplate);
            this.tabTitleTemplate = _.template(TabTitleTemplate)
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
                var tabContent = new TabPanelView({
                    layerGroupingModel: layerGroupingTab,
                    instance : this.instance
                });
    //            this.layerTabs.push(tabContent);
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
            this._renderLayerGroups(new LayersTabModel({
                grouping : this.inspireGrouping, 
                title: this.instance.getLocalization('filter').inspire
            }), 'inspire');

            this._renderLayerGroups(new LayersTabModel({
                grouping : this.orgGrouping, 
                title: this.instance.getLocalization('filter').organization
            }), 'organization');
        },

        toggleTab : function(e) {
            e.stopPropagation();
            var target  = jQuery(e.currentTarget);
            var type    = target.attr('data-tab');
            var asdf = null;
        }

    });
});
