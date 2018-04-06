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
        this.layerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.group = Oskari.clazz.create('Oskari.admin.hierarchical-layerlist.Group', this.sandbox, this.locale);
        this.layer = Oskari.clazz.create('Oskari.admin.hierarchical-layerlist.Layer', this, this.sandbox, this.locale);
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
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.addMainGroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-group',
                tooltip: me.locale('tooltips.addMainGroup')
            });

            // Add update all capabilities tool
            me.service.addMainTool('update-capabilities', function(tool) {
                me._recheckAllCapabilities(tool);
            }, {
                cls: 'update-capabilities',
                tooltip: me.locale('recheckAllButton')
            });

        },
        /**
         * Add group tools
         * @method  _addGroupTools
         * @private
         */
        _addGroupTools: function() {
            var me = this;

            // Add layer add tools
            me.service.addGroupTool('add-layer', function(tool, groupId) {
                var options = {};
                me.layer.showLayerAddPopup(tool, null, groupId, options);
            }, {
                cls: 'add-layer',
                tooltip: me.locale('tooltips.addLayer')
            });

            // Add edit tool to adding groups
            me.service.addGroupTool('edit-group', function(tool, groupId) {
                var group = me.layerService.getAllLayerGroups(groupId);
                var options = {
                    locale: group.name,
                    selectable: group.selectable
                };
                options.type = 'group';

                var popupConf = me.group.getGroupAddingPopupConf(tool, groupId, null, options);
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.editMainGroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'edit-group',
                tooltip: me.locale('tooltips.editMainGroup')
            });

            // Add new tool to adding sub-groups
            me.service.addGroupTool('add-subgroup', function(tool, parentId) {
                var popupConf = me.group.getGroupAddingPopupConf(tool, null, parentId, {
                    type: 'subgroup'
                });

                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.addSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-subgroup',
                tooltip: me.locale('tooltips.addSubgroup')
            });
        },
        /**
         * Add subgroup tools
         * @method  _addSubgroupTools
         * @private
         */
        _addSubgroupTools: function() {
            var me = this;
            // Add layer add tools
            me.service.addSubgroupTool('add-layer', function(tool, groupId, parentId) {
                var options = {};
                me.layer.showLayerAddPopup(tool, null, groupId, options);
            }, {
                cls: 'add-layer',
                tooltip: me.locale('tooltips.addLayer')
            });

            // Add edit tool to adding groups
            me.service.addSubgroupTool('edit-subgroup', function(tool, groupId, parentId) {
                var group = me.layerService.getAllLayerGroups(groupId);
                var options = {
                    locale: group.name,
                    selectable: group.selectable
                };
                options.type = 'subgroup';

                var popupConf = me.group.getGroupAddingPopupConf(tool, groupId, parentId, options);
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.editSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'edit-subgroup',
                tooltip: me.locale('tooltips.editSubgroup')
            });

            // Add new tool to adding sub-groups
            me.service.addSubgroupTool('add-subgroup-subgroup', function(tool, parentId) {
                var popupConf = me.group.getGroupAddingPopupConf(tool, null, parentId, {
                    type: 'subgroup-subgroup'
                });

                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.addSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'add-subgroup-subgroup',
                tooltip: me.locale('tooltips.addSubgroup')
            });
        },

        /**
         * Add subgroup  subgroup tools
         * @method  _addSubgroupSubgroupTools
         * @private
         */
        _addSubgroupSubgroupTools: function() {
            var me = this;
            // Add layer add tools
            me.service.addSubgroupSubgroupTool('add-layer', function(tool, groupId, parentId) {
                me.layer.showLayerAddPopup(tool, null, groupId);
            }, {
                cls: 'add-layer',
                tooltip: me.locale('tooltips.addLayer')
            });

            // Add edit tool to adding groups
            me.service.addSubgroupSubgroupTool('edit-subgroup-subgroup', function(tool, groupId, parentId) {
                var group = me.layerService.getAllLayerGroups(groupId);
                var options = {
                    locale: group.name,
                    selectable: group.selectable
                };
                options.type = 'subgroup-subgroup';

                var popupConf = me.group.getGroupAddingPopupConf(tool, groupId, parentId, options);
                var popup = popupConf.popup;
                var message = popupConf.message;
                popupConf.popup.show(me.locale('groupTitles.editSubgroup'), message, popupConf.buttons);
                popupConf.popup.makeModal();
            }, {
                cls: 'edit-subgroup-subgroup',
                tooltip: me.locale('tooltips.editSubgroup')
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
                use_html5: true,
                inside_pos: 'last'
            });
        },

        /**
         * Add layer tools
         * @method  _addLayerTools
         * @private
         */
        _addLayerTools: function() {
            var me = this;
            // Add edit tool for layers
            me.service.addLayerTool('edit-layer', function(tool, groupId, layerId) {
                me.layer.showLayerAddPopup(tool, layerId, groupId);
            }, {
                cls: 'edit-layer',
                tooltip: me.locale('tooltips.editLayer')
            });
        },

        /**
         * Assigns event handlers to the admin hierarchical layer list.
         */
        _addEventHandlers: function() {
            var me = this;
            // JStree event handler, see: https://www.jstree.com/api/#/?f=dnd_stop.vakata
            //  event is Jquery event and data object contains:
            //  - data: any data supplied with the call to $.vakata.dnd.start
            //  - element: the DOM element being dragged
            //  - helper: the helper shown next to the mouse
            //  - event: the event that caused the stop
            jQuery(document).on('dnd_stop.vakata', function(event, data) {
                //If the drag target group is not open, we have to open it.
                //Otherwise we can't get the necessary information of the drag operation.
                var targetGroup = data.data.origin.get_node(jQuery(data.event.target).prop('id').split('_anchor')[0]);
                var draggedNode = data.data.origin.get_node(data.data.nodes[0]);
                if (!draggedNode.type) {
                    return;
                }
                var originalParentNode = draggedNode.original;

                // Get ajax data
                var type = me._findJSTreeNodeActualType(draggedNode.type);
                var draggedId = (draggedNode.type === 'layer') ? draggedNode.a_attr['data-layer-id'] : draggedNode.a_attr['data-group-id'];
                var parentNode = data.data.origin.get_node(draggedNode.parent);

                var draggedNodeOldParentId = originalParentNode.a_attr["data-group-id"];

                var ajaxData = {
                    orders: [],
                    parent: (parentNode.a_attr && parentNode.a_attr['data-group-id']) ? parentNode.a_attr['data-group-id'] : -1
                };

                parentNode.children.forEach(function(nodeId) {
                    var node = data.data.origin.get_node(nodeId);
                    var order = {
                        type: node.type, // groups, subgroup, subgroups
                        id: (node.type === 'layer') ? node.a_attr['data-layer-id'] : node.a_attr['data-group-id']
                    };
                    if (ajaxData.parent != -1 && ajaxData.parent != draggedNodeOldParentId && draggedNode.type === node.type && order.id === draggedId) {
                        order.oldParent = draggedNodeOldParentId;
                    }
                    // check at id is number
                    if(!isNaN(order.id)) {
                        ajaxData.orders.push(order);
                    }
                });
                if (!data.data.origin.is_open(targetGroup)) {
                    data.data.origin.open_node(targetGroup);
                }

                me._saveOrder(ajaxData);
            });
        },
        /**
         * Find the nodes actual type which can be either layer or group (includes subgroups and subgroup-subgroups)
         * @param  {String} type The node type in the tree
         * @return {String}      The node actual type - layer or group.
         */
        _findJSTreeNodeActualType: function(type) {
            var actualType;
            if (type.indexOf('group') >= 0) {
                actualType = 'group';
            } else {
                actualType = 'layer';
            }
            return actualType;
        },

        /**
         * Save group or list ordering and grouping.
         * @method  _saveOrder
         * @param   {Object}   data  data for saving
         * @private
         */
        _saveOrder: function(data) {
            var me = this;
            jQuery.ajax({
                type: 'POST',
                contentType: 'application/json; charset=UTF-8',
                url: me.sandbox.getAjaxUrl('LayerAndGroupOrder'),
                data: JSON.stringify(data),
                error: function(response) {
                    var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    errorDialog.show(me.locale('errors.nodeDropSave.title'), me.locale('errors.nodeDropSave.message'));
                    errorDialog.fadeout();
                    me.service.trigger('order.changed', {
                        ajax: true,
                        success: false
                    });
                },
                success: function(response) {
                    var successDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    successDialog.show(me.locale('successMessages.nodeDropSave.title'), me.locale('successMessages.nodeDropSave.message'));
                    successDialog.fadeout();
                    me.service.trigger('order.changed', {
                        ajax: true,
                        success: true
                    });
                }
            });
            me.service.trigger('order.changed', data);
        },

        /**
         * Recheck all layer capabilities
         * @method  _recheckAllCapabilities
         * @param   {Object}                tool jQuery tool element
         * @private
         */
        _recheckAllCapabilities: function(tool){
            var loc = Oskari.getMsg.bind(null, 'admin-layerselector');

            var popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var closeButton = popup.createCloseButton(loc('close'));
            var primaryButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            primaryButton.setTitle(loc('query'));
            var me = this;
            var xhr;

            closeButton.setHandler(function() {
                if(xhr) {
                    xhr.abort();
                }
                popup.close();
                tool.removeClass('active');
            });

            var content = jQuery('<span>' + loc('recheckAll') + '<span>');
            primaryButton.setPrimary(true);
            primaryButton.setHandler(function () {
                xhr = jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        srs: me.sandbox.getMap().getSrsName()
                    },
                    url: me.sandbox.getAjaxUrl('UpdateCapabilities'),
                    success: function (resp) {
                        xhr = null;
                        var successCount = resp.success.length;
                        var failCount = Object.keys(resp.error).length;
                        content.append('<br><br><span>' + loc('recheckAllSucceeded', {success: successCount, fail: failCount}) + '<span>');
                        tool.removeClass('active');
                    },
                    error: function (xhr, status, error) {
                        xhr = null;
                        if(status === 'timeout') {
                            content.append('<br><br><span>' + loc('recheckFailTimeout') + '<span>');
                            return;
                        }
                        content.append('<br><br><span>' + loc('recheckFail') + '<span>');
                        tool.removeClass('active');
                    }
                });

                jQuery(primaryButton.getElement()).attr('disabled', true);
            });

            popup.show(loc('recheckTitle'), content, [closeButton, primaryButton]);
        },


        /*******************************************************************************************************************************
        /* PUBLIC METHODS
        *******************************************************************************************************************************/
        getLocalization: function(key) {
            if (!this.locale) {
                this.locale = Oskari.getMsg.bind(null, 'admin-layerselector');
            }
            if (key) {
                return this.locale(key);
            }
            return this.locale;
        },
        getName: function() {
            return "AdminHierarchicalLayerList";
        },
        start: function() {
            var me = this;
            // Only works with hierarchical layer selector,
            // if the service it provides is not available we cannot proceed
            if (!me.service) {
                return;
            }
            me.sandbox.register(this);
            // set show empty groups configured
            me.service.showEmptyGroups(true);
            me._addMainTools();
            me._addGroupTools();
            me._addSubgroupTools();
            me._addSubgroupSubgroupTools();
            me._addLayerTools();
            me._addOptions();
            me._addEventHandlers();
        },

        // module boilerplate methods
        init: function() {

        },
        stop: function() {

        },
        update: function() {

        },
        getSandbox: function(){
            return this.sandbox;
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