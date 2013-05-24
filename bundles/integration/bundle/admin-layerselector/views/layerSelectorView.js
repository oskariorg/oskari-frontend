define([
    "text!_bundle/templates/layerSelectorTemplate.html",
    "text!_bundle/templates/tabTitleTemplate.html",
    '_bundle/collections/allLayersCollection',
    '_bundle/models/layersTabModel',
    '_bundle/views/tabPanelView'], 
    function(ViewTemplate, TabTitleTemplate, LayerCollection, LayersTabModel, TabPanelView) {
    return Backbone.View.extend({


        /**
         * This object contains backbone event-handling. 
         * It binds methods to certain events fired by different elements.
         * 
         * @property events
         * @type {Object}
         */
        events : {
            "click .admin-layer-tab"          : "toggleTab",
            "keydown .admin-layerselectorapp" : "catchInputs",
            "keyup .admin-layerselectorapp"   : "catchInputs"
        },

        /**
         * At initialization we bind passed container element as a root element
         * for this view, add templates and other initialization steps.
         *
         * @method initialize
         */
        initialize : function() {
            this.instance = this.options.instance;
            this.el = this.options.el;
            this.appTemplate = _.template(ViewTemplate);
            this.tabTitleTemplate = _.template(TabTitleTemplate)
            this.selectedType = 'organization';
            _.bindAll(this);
            //render this view immediately after initialization.
            this.render();
        },

        /**
         * Add HTML templates to this view (appTemplate & tabs)
         * 
         * @method render
         */
        render : function() {
            this.el.html(this.appTemplate);
            // TODO this is empty rendering for inspire tab - instead, we should render
            // somekind of notification that we are wating for data.
            this._renderLayerGroups(null, 'inspire');
        },

        /**
         * Add HTML templates to this view (appTemplate & tabs)
         * 
         * @method render
         * @param {Object} LayerGroupingTab contains layersTabModel
         * @param {String} tabType - what kind of tab this is (inspire vs. organization)
         */
        _renderLayerGroups: function(layerGroupingTab, tabType) {
            if(layerGroupingTab != null)  {

                // we need a reference to organization side for selecting themes
                // because adminLayerSettings needs to know about all the themes/classes
                // defined in inspire tab. This member is set in 'addToCollection'
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

        /**
         * Adds layer models and uses those to create layersTabModels
         * 
         * @method addToCollection
         * @param {Array} models which are created from layers.
         */
        addToCollection: function(models) {
            this.collection = new LayerCollection(models);
            // Get models grouped by tab type
            this.inspireGrouping    = this.collection.getLayerGroups('getInspireName');
            this.orgGrouping        = this.collection.getLayerGroups('getOrganizationName');
            // clear everything
            this.el.html(this.appTemplate);

            // create tabModel for inspire classes
            this.inspireTabModel = new LayersTabModel({
                grouping : this.inspireGrouping, 
                type: 'inspire',
                title: this.instance.getLocalization('filter').inspire
            });
            // render inspire classes
            this._renderLayerGroups(this.inspireTabModel, 'inspire', null);

            // create tabModel for organization
            this.organizationTabModel = new LayersTabModel({
                grouping : this.orgGrouping, 
                type: 'organization',
                title: this.instance.getLocalization('filter').organization
            });
            // render organizations
            this._renderLayerGroups(this.organizationTabModel, 'organization', this.inspireTabModel);

            // activate organization tab
            jQuery('.admin-layerselectorapp .tabsHeader').find('.organization').parent().addClass('active');
            jQuery('.tab-content.inspire').hide();
            jQuery('.tab-content.organization').show();
            
            // Check that data for classes is fetched
            // FIXME we shouldn't need to do this everytime, just once?
            this.inspireTabModel.getClasses(this.instance.getSandbox().getAjaxUrl(), "action_route=GetInspireThemes");
            this.organizationTabModel.getClasses(this.instance.getSandbox().getAjaxUrl(),"&action_route=GetMapLayerClasses");
        },

        /**
         * Changes tab when user clicks one of them
         * 
         * @method toggleTab
         * @param {Object} e - click event
         */
        toggleTab : function(e) {
            // this event does not need to bubble up.
            e.stopPropagation(); 
            var target  = jQuery(e.currentTarget);
            var type    = target.attr('data-tab');

            // change class 'active' to correct tab
            jQuery('.tabsHeader').find('.active').removeClass('active');
            target.parent().addClass('active');

            // change focus and visibility
            // TODO: part of this should be done through CSS classes
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
/*        toggleAddOrg : function(e) {
            var elem = jQuery(e.currentTarget).parent().find('.admin-add-class');
            if(elem.hasClass('show-add-class')) {
                elem.removeClass('show-add-class');
            } else {
                elem.addClass('show-add-class');
            }
        },
        removeAddOrg : function(e) {
            jQuery('.admin-add-class').removeClass('show-add-class');
        },
*/

        /**
         * Catches all the events that try to bubble outside of this admin tool.
         * 
         * @method catchInputs
         * @param {Object} e - click event
         */
        catchInputs : function(e) {
            e.stopPropagation();
        }

    });
});
