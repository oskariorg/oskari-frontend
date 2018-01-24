/**
 * @class Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance
 *
 * Hierarchical layerlist bundle for admins. This extends hierarchical-layerlist bundle.
 */
Oskari.clazz.define("Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance",
    function() {
        this.sandbox = Oskari.getSandbox();
        this.service = this.sandbox.getService('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService');
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
                tool.removeClass('active');
                alert('Lisää ryhmä');
            }, {
                cls: 'add-group',
                tooltip: 'Lisää ryhmä'
            });
        },

        /*******************************************************************************************************************************
        /* PUBLIC METHODS
        *******************************************************************************************************************************/
        getName: function() {
            return "AdminHierarchicalLayerList";
        },
        start: function() {
            var me = this;
            me.sandbox.register(this);

            me._addMainTools();
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