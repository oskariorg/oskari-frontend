/**
 * @class Oskari.mapframework.bundle.dimension-change.DimensionChangeBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.dimension-change.DimensionChangeBundleInstance', function () {
    this.loc = Oskari.getMsg.bind(null, 'dimensionchange');
}, {
    __name: 'DimensionChangeBundleInstance',
    /**
     * @method _startImpl bundle start hook. Called from superclass start()
     * @param sandbox
     */
    _startImpl: function (sandbox) {
        var me = this;
        var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
        var tooltip = me.conf.uuid ? me.loc('to3Dview') : me.loc('backTo2Dview');
        var iconCls = me.conf.uuid ? 'dimension-tool' : 'dimension-tool-back';
        var buttonConf = {
            iconCls: iconCls,
            tooltip: tooltip,
            sticky: true,
            callback: function () {
                var url = window.location.origin;
                if (window.location.pathname && window.location.pathname.length) {
                    url += window.location.pathname;
                }
                if (me.conf.uuid) {
                    url += '?uuid=' + me.conf.uuid;
                }
                window.location.href = url;
            }
        };
        sandbox.request(me, addToolButtonBuilder('DimensionChange', 'dimensionviews', buttonConf));
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
