/**
 * @class Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance
 *
 * Hierarchical layerlist bundle for admins. This extends hierarchical-layerlist bundle.
 */
Oskari.clazz.define("Oskari.admin.bundle.admin.HierarchicalLayerListBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function() {}, {
        getName: function() {
            return "AdminHierarchicalLayerList";
        },
        start: function() {
            var me = this;
            var sandbox = Oskari.getSandbox();
            sandbox.register(this);
            /*
            var title = 'Metrics';
            var content = jQuery('<div></div>');
            jQuery.ajax({
                dataType: "json",
                type: "GET",
                url: sandbox.getAjaxUrl(),
                data: {
                    action_route: 'Metrics'
                },
                error: function() {
                    content.append('Error loading metrics');
                },
                success: function(response) {
                    content.tree({
                        'data': me.formatData(response)
                    });
                }
            });
            var reqBuilder = sandbox.getRequestBuilder('Admin.AddTabRequest');
            if (reqBuilder) {
                var request = reqBuilder(title, content, 2, 'metrics');
                sandbox.request(this, request);
            }
            */
        },
        /*
        formatData: function(metricsData) {
            var me = this;
            return _.map(metricsData, function(value, key) {
                var res = {
                    label: key
                };
                if (typeof value === 'object') {
                    res.children = me.formatData(value);
                } else {
                    res.label = res.label + ' : ' + value;
                }
                return res;
            });
        },*/
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