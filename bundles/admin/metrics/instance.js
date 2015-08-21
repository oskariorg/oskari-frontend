/**
 * @class Oskari.admin.bundle.metrics.MetricsAdminBundleInstance
 *
 * Metrics bundle for admins. Displayes metrics gathered by serverside functions.
 */
Oskari.clazz.define("Oskari.admin.bundle.metrics.MetricsAdminBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
    }, {
        getName : function() {
            return "AdminMetrics";
        },
        start : function() {
            var me = this;
            var sandbox = Oskari.getSandbox();
            sandbox.register(this);
            var title = 'Metrics';
            var content = jQuery('<div></div>');
            jQuery.ajax({
                dataType : "json",
                type : "GET",
                url : sandbox.getAjaxUrl(),
                data : {
                    action_route : 'Metrics'
                },
                error : function() {
                    alert('Error getting metrics');
                },
                success : function(response) {
                    content.tree({ 'data' : me.formatData(response)});
                }
            });
            var reqBuilder = sandbox.getRequestBuilder('Admin.AddTabRequest');
            if(reqBuilder) {
                var request = reqBuilder(title, content, 2, 'metrics');
                sandbox.request(this, request);
            }
        },
        formatData : function(metricsData) {
            var f = function(data) {
               return  _.map(data, function(value, key) {
                    var res = {
                        label : key
                    };
                    if(typeof value === 'object') {
                        res.children = f(value);
                    }
                    else {
                        res.label = res.label + ' : ' + value;
                    }
                    return res;
                });

            }
            var result = f(metricsData);
            return result;
        },
        // module boilerplate methods
        init: function() {

        },
        stop : function() {

        },
        update : function() {

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