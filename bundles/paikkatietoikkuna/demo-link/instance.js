/**
 * @class Oskari.mapframework.bundle.demo-link.DemoLinkBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.demo-link.DemoLinkBundleInstance', function () {
    this.loc = Oskari.getMsg.bind(null, 'DemoLink');
}, {
    __name: 'DemoLinkBundleInstance',
    /**
     * @method _startImpl bundle start hook. Called from superclass start()
     * @param sandbox
     */
    _startImpl: function (sandbox) {
        var me = this;
        var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
        var buttonConf = {
            iconCls: 'demo-3D-view-tool',
            tooltip: me.loc('tooltip'),
            sticky: true,
            callback: function () {
                var url = window.location.origin;
                if (window.location.pathname && window.location.pathname.length) {
                    url += window.location.pathname;
                }
                url += '?uuid=' + me.conf.uuid;
                window.location.href = url;
            }
        };
        sandbox.request(me, addToolButtonBuilder('DemoLink', 'demoviews', buttonConf));
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
