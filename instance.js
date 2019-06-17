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

        const mapStateService = sandbox.getService('mapmodule.state');
        mapStateService.addLayerUnsupportedReasonFunction('dimension', layer => {
            const unuspportedReason = {
                text: this.loc('change-dimension-3D'),
                action: this._changeDimension.bind(this)
            };
            if (sandbox.getMap().getSupports3D()) {
                if (!this._unsupported3D.includes(layer.getLayerType())) {
                    return;
                }
                unuspportedReason.text = this.loc('change-dimension-2D');
                return unuspportedReason;
            }
            if (this._unsupported2D.includes(layer.getLayerType())) {
                return unuspportedReason;
            }
        });
    },
    eventHandlers: {
        'AfterMapLayerAddEvent': function (event) {
            this._addTool(event.getMapLayer());
        }
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
    _addLayerTools () {
        var layers = this.sandbox.getMap().getLayers();
        if (layers.length === 0) {
            return;
        }
        layers.forEach(this._addTool.bind(this));
    },
    _addTool (layer) {
        let linkText = '';
        if (this.sandbox.getMap().getSupports3D()) {
            linkText = this.loc('change-dimension-2D');
            if (this._unsupported3D.indexOf(layer.getLayerType()) === -1) {
                return;
            }
        } else {
            linkText = this.loc('change-dimension-3D');
            if (this._unsupported2D.indexOf(layer.getLayerType()) === -1) {
                return;
            }
        }
        const toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');
        const tool = toolBuilder();
        tool.setName('dimension-change');
        tool.setTitle(linkText);
        tool.setTooltip(linkText);
        tool.setCallback(this._changeDimension.bind(this));
        layer.addTool(tool);
    },
    handleRequest: function (core, request) {
        this._changeDimension();
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
