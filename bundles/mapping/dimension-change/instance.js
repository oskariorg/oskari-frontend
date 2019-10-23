import { UnsupportedLayerType } from './domain/UnsupportedLayerType';

const UnsupportedLayerReason = Oskari.clazz.get('Oskari.mapframework.domain.UnsupportedLayerReason');
const UnsupportedLayerSrs = Oskari.clazz.get('Oskari.mapframework.domain.UnsupportedLayerSrs');

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

        const type = new UnsupportedLayerType(UnsupportedLayerReason.FATAL);
        type.setAction(action);
        type.setActionText(changeDimensionTxt);

        const srs = new UnsupportedLayerSrs();
        srs.setAction(action);
        srs.setActionText(changeDimensionTxt);

        map.addLayerSupportCheck(type);
        map.addLayerSupportCheck(srs);
    },
    _changeDimension: function () {
        let url = window.location.origin;
        if (window.location.pathname && window.location.pathname.length) {
            url += window.location.pathname;
        }
        const extraParams = {
            noSavedState: true,
            showIntro: false
        };
        if (this.conf.uuid) {
            extraParams.uuid = this.conf.uuid;
        }
        const blackListed = ['coord', 'zoomLevel', 'rotate', 'cam'];
        const mapQueryStr = this._sandbox.generateMapLinkParameters(extraParams);
        const mapParams = Oskari.util.getRequestParameters(mapQueryStr);
        window.location.href = url + '?' + Object.keys(mapParams)
            .filter(key => !blackListed.includes(key))
            .map(key => `${key}=${mapParams[key]}`)
            .join('&');
    },
    handleRequest: function (core, request) {
        this._changeDimension();
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
