import { UnsupportedLayerType, isLayerSupported } from './domain/UnsupportedLayerType';

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
        var buttonConf = this._getButtonConf();
        sandbox.request(me, addToolButtonBuilder('DimensionChange', 'dimensionviews', buttonConf));
        this._addLayerSupportedChecks();
    },
    _getButtonConf: function () {
        const conf = {
            sticky: true,
            callback: this._changeDimension.bind(this)
        };
        if (this._sandbox.getMap().getSupports3D()) {
            conf.tooltip = this.loc('backTo2Dview');
            conf.iconCls = 'dimension-tool-back';
        } else {
            conf.tooltip = this.loc('to3Dview');
            conf.iconCls = 'dimension-tool';
        }
        return conf;
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
            noSavedState: true
        };
        if (this.conf.uuid) {
            extraParams.uuid = this.conf.uuid;
        }
        // coord is skipped because projections might be different and the current location coordinates would have different meaning
        // zoomlevels might differ from appsetup to another as well
        // rotate is not supported on 3d
        // cam and time are not supported in 2d
        const blackListed = ['coord', 'zoomLevel', 'rotate', 'cam', 'time'];
        if (!this._hasSupportedLayers()) {
            // skip map layers as current ones are unsupported and use the appsetups default layers instead
            blackListed.push('mapLayers');
        }
        const mapQueryStr = this._sandbox.generateMapLinkParameters(extraParams);
        const mapParams = Oskari.util.getRequestParameters(mapQueryStr);
        const { markers, uuid } = mapParams;
        if (markers && uuid) {
            mapParams.markers = this._transformMarkers(uuid, markers);
        }
        window.location.href = url + '?' + Object.keys(mapParams)
            .filter(key => !blackListed.includes(key))
            .map(key => `${key}=${mapParams[key]}`)
            .join('&');
    },
    _hasSupportedLayers: function () {
        const mapState = this._sandbox.getMap();
        // The whole bundle is based on if the current map supports 3d, the other option doesn't and vice versa
        const targetMapSupports3D = !mapState.getSupports3D();
        const supportedLayers = mapState.getLayers().filter(layer => isLayerSupported(layer, targetMapSupports3D));
        return supportedLayers.length > 0;
    },
    _transformMarkers: function (uuid, currentMarkers) {
        const targetApp = Oskari.app.getSystemDefaultViews().find(view => view.uuid === this.conf.uuid);
        const mapmodule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
        if (!targetApp || targetApp.srsName === mapmodule.getProjection()) {
            return currentMarkers;
        }
        const markerStr = mapmodule.getPluginInstances('MarkersPlugin').getTransformedStateParameters(targetApp.srsName);
        const { markers: targetMarkers } = Oskari.util.getRequestParameters(markerStr);
        if (targetMarkers) {
            return targetMarkers;
        }
        return '';
    },
    handleRequest: function (core, request) {
        this._changeDimension();
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
