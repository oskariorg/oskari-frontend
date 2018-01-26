/**
 * @class Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance
 *
 * Hierarchical layerlist bundle for admins. This extends hierarchical-layerlist bundle.
 */
Oskari.clazz.define("Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance",
    function() {
        this.locale = this.getLocalization();
        this.sandbox = Oskari.getSandbox();
        this.service = this.sandbox.getService('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService');
        this.group = Oskari.clazz.create('Oskari.admin.hierarchical-layerlist.Group', this.sandbox, this.locale);
    }, {
        /*******************************************************************************************************************************
        /* PRIVATE METHODS
        *******************************************************************************************************************************/
        /**
         * Add main tools
         * @method  _addMainTools
         * @private
         */
        _addMainTools: function() {
            var me = this;
            // Add new tool to adding groups
            me.service.addMainTool('add-group', function(tool) {
                var popupConf = me.group.getGroupAddingPopupConf(tool, null, null, {
                    type: 'group'
                });
                /*var popupConf = me.group.getGroupAddingPopupConf(tool, -1, {
                    locale: {
                        fi: 'testi fi',
                        en: 'testi en',
                        sv: 'testi sv'
                    },
                    selectable: true
                });*/
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale.groupTitles.addMainGroup, message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-group',
                tooltip: me.locale.tooltips.addMainGroup
            });
        },
        _addGroupTools: function() {
            var me = this;
            // Add new tool to adding sub-groups
            me.service.addGroupTool('add-subgroup', function(tool, parentId) {
                var popupConf = me.group.getGroupAddingPopupConf(tool, null, parentId, {
                    type: 'subgroup'
                });

                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale.groupTitles.addSubgroup, message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-subgroup',
                tooltip: me.locale.tooltips.addSubgroup
            });
        },
        /**
         * Add layertree options
         * @method  _addOptions
         * @private
         */
        _addOptions: function() {
            var me = this;

            // Add Drag & drop plugin
            me.service.addLayerlistOption('plugins', ['checkbox', 'changed', 'wholerow', 'types', 'search', 'state', 'conditionalselect', 'dnd'], false);
            me.service.addLayerlistOption('dnd', {
                use_html5: true
            });
        },


        /*******************************************************************************************************************************
        /* PUBLIC METHODS
        *******************************************************************************************************************************/
        getLocalization: function(key) {
            if (!this.locale) {
                this.locale = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this.locale[key];
            }
            return this.locale;
        },
        getName: function() {
            return "AdminHierarchicalLayerList";
        },
        start: function() {
            var me = this;
            me.sandbox.register(this);

            // set admin configured
            me.service.setAdmin(true);
            me._addMainTools();
            me._addGroupTools();
            me._addOptions();
            //Doesn't work.
            /*me.service.addEventHandler("dnd_stop.vakata", function(event, data){
                console.log(event);
                console.log(data);
            });*/
            jQuery(document).on("dnd_stop.vakata", function(event, data){
                //If the drag target group is not open, we have to open it.
                //Otherwise we can't get the necessary information of the drag operation.
                var targetGroup = data.data.origin.get_node(jQuery(data.event.target).prop("id").split("_")[0]);
                if(!data.data.origin.is_open(targetGroup)) {
                    data.data.origin.open_node(targetGroup);
                }
                var draggedNode = data.data.origin.get_node(data.element);
                //console.log(draggedNode);
                var parentNode = data.data.origin.get_node(draggedNode.parent);
                //console.log(parentNode);
                var draggedNodeId = draggedNode.id.split("-")[1];
                var draggedNodeNewParentId = parentNode.id.split("-")[1];
                //Get the new index inside the group's children
                var draggedNodeNewIndex = _.indexOf(_.values(parentNode.children), draggedNode.id);
                if(draggedNode.type === 'layer') {
                    //console.log("TASOA "+draggedNodeId+" RAAHATTU RYHMÄN "+draggedNodeNewParentId+" ALLE SIJAINTIIN "+draggedNodeNewIndex);
                } else if(draggedNode.type === 'subgroup') {
                    //console.log("ALIRYHMÄÄ "+draggedNodeId+" RAAHATTU RYHMÄN "+draggedNodeNewParentId+" ALLE SIJAINTIIN "+draggedNodeNewIndex);
                }
                /*var nodeItemId = draggedNode.id.split("-")[1];
                console.log("Dragged node: "+nodeItemId);
                var newTargetId = draggedNode.parent.split("-")[1];
                console.log("Target node: "+newTargetId);*/
            });


        },

        // module boilerplate methods
        init: function() {

        },
        stop: function() {

        },
        update: function() {

        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    });