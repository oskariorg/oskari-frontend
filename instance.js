/**
 * @class Oskari.mapframework.bundle.dimension-change.DimensionChangeBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.dimension-change.DimensionChangeBundleInstance', function () {
    this.loc = Oskari.getMsg.bind(null, 'dimensionchange');
}, {
    __name: 'DimensionChangeBundleInstance',
    _unsupported3D: ['vectortile'],
    _unsupported2D: ['tiles3d'],

    /**
     * @method _startImpl bundle start hook. Called from superclass start()
     * @param sandbox
     */
    _startImpl: function (sandbox) {
        var me = this;
        me._sandbox = sandbox;
        var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
        var tooltip = me.conf.uuid ? me.loc('to3Dview') : me.loc('backTo2Dview');
        var iconCls = me.conf.uuid ? 'dimension-tool' : 'dimension-tool-back';
        var buttonConf = {
            iconCls: iconCls,
            tooltip: tooltip,
            sticky: true,
            callback: this._changeDimension.bind(this)
        };
        sandbox.request(me, addToolButtonBuilder('DimensionChange', 'dimensionviews', buttonConf));
        this._addLayerSupportedChecks();
    },
    _addLayerSupportedChecks: function () {
        const map = this._sandbox.getMap();
        const changeDimensionTxt = this.loc('change-dimension-' + (map.getSupports3D() ? '2D' : '3D'));
        const action = this._changeDimension.bind(this);

        const unuspportedDimension = Oskari.clazz.create('Oskari.mapframework.domain.LayerUnsupportedReason');
        unuspportedDimension.setActionText(changeDimensionTxt);
        unuspportedDimension.setAction(action);

        const mapLocalization = Oskari.getMsg.bind(null, 'MapModule');
        const unuspportedSrs = Oskari.clazz.create('Oskari.mapframework.domain.LayerUnsupportedReason');
        unuspportedSrs.setDescription(mapLocalization('unsupported-layer-projection'));
        unuspportedSrs.setActionText(changeDimensionTxt);
        unuspportedSrs.setAction(action);

        map.addLayerSupportedCheck('dimension', layer => {
            if (map.getSupports3D()) {
                if (this._unsupported3D.includes(layer.getLayerType())) {
                    return unuspportedDimension;
                }
                return true;
            }
            if (this._unsupported2D.includes(layer.getLayerType())) {
                return unuspportedDimension;
            }
            return true;
        });
        map.addLayerSupportedCheck('srs', layer => {
            if (layer.isSupportedSrs(map.getSrsName())) {
                return true;
            }
            return unuspportedSrs;
        });
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
        var layers = this._sandbox.getMap().getLayers();
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
