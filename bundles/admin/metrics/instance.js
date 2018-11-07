/**
 * @class Oskari.admin.bundle.metrics.MetricsAdminBundleInstance
 *
 * Metrics bundle for admins. Displayes metrics gathered by serverside functions.
 */
Oskari.clazz.define('Oskari.admin.bundle.metrics.MetricsAdminBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
    }, {
        getName: function () {
            return 'AdminMetrics';
        },
        start: function () {
            var me = this;
            var sandbox = Oskari.getSandbox();
            sandbox.register(this);
            var title = 'Metrics';
            var content = jQuery('<div></div>');
            jQuery.ajax({
                dataType: 'json',
                type: 'GET',
                url: Oskari.urls.getRoute('Metrics'),
                error: function () {
                    content.append('Error loading metrics');
                },
                success: function (response) {
                    content.tree({'data': me.formatData(response)});
                }
            });
            if (sandbox.hasHandler('Admin.AddTabRequest')) {
                var reqBuilder = Oskari.requestBuilder('Admin.AddTabRequest');
                var request = reqBuilder(title, content, 2, 'metrics');
                sandbox.request(this, request);
            }
        },
        formatData: function (metricsData) {
            var me = this;
            return _.map(metricsData, function (value, key) {
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
        },
        // module boilerplate methods
        init: function () {

        },
        stop: function () {

        },
        update: function () {

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
