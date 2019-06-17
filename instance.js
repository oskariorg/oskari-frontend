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
                me._changeDimension();
            }
        };
        sandbox.request(me, addToolButtonBuilder('DimensionChange', 'dimensionviews', buttonConf));
        sandbox.requestHandler('DimensionChangeRequest', this);
    },
    _changeDimension: function () {
        let url = window.location.origin;
        if (window.location.pathname && window.location.pathname.length) {
            url += window.location.pathname;
        }
        const params = [
            'noSavedState=true',
            'showIntro=false'
        ];
        const lyrParam = this._getSelectedMapLayersUrlParam();
        if (lyrParam) {
            params.unshift(lyrParam);
        }
        if (this.conf.uuid) {
            params.unshift('uuid=' + this.conf.uuid);
        }
        window.location.href = url + '?' + params.join('&');
    },
    _getSelectedMapLayersUrlParam: function () {
        var layers = this.sandbox.getMap().getLayers();
        if (layers.length === 0) {
            return;
        }
        var lyrValues = layers.map(layer => {
            if (layer.style) {
                return layer._id + '+' + layer._opacity + '+' + layer.style;
            }
            return layer._id + '+' + layer._opacity;
        });
        return 'mapLayers=' + lyrValues.join();
    },
    handleRequest: function (core, request) {
        this._changeDimension();
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
