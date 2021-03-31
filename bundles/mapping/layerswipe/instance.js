import { getRenderPixel } from 'ol/render';
import { unByKey } from 'ol/Observable';
import VectorLayer from 'ol/layer/Vector';

Oskari.clazz.define(
    'Oskari.mapframework.bundle.layerswipe.LayerSwipeBundleInstance',

    function () {
        this.active = false;
        this.splitter = null;
        this.splitterWidth = 5;
        this.cropSize = null;
        this.map = null;
        this.loc = Oskari.getMsg.bind(null, 'LayerSwipe');
        this.eventListenerKeys = [];
    },
    {
        __name: 'LayerSwipe',

        _startImpl: function (sandbox) {
            this.map = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule').getMap();

            const addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            const buttonConf = {
                iconCls: 'tool-layer-swipe',
                tooltip: this.loc('toolLayerSwipe'),
                sticky: true,
                callback: () => this.setActive(!this.active)
            };
            sandbox.request(this, addToolButtonBuilder('LayerSwipe', 'basictools', buttonConf));
        },

        setActive: function (active) {
            if (active) {
                const layer = this.getTopmostLayer();
                if (layer) {
                    this.registerEventListeners(layer);
                }
                this.showSplitter();
                if (this.cropSize === null) {
                    const mapSize = this.map.getSize();
                    this.cropSize = mapSize[0] / 2;
                }
            } else {
                this.unregisterEventListeners();
                this.hideSplitter();
            }
            this.active = active;
            this.map.render();
        },

        updateSwipeLayer: function () {
            this.unregisterEventListeners();
            const layer = this.getTopmostLayer();
            if (layer) {
                this.registerEventListeners(layer);
            }
        },

        getTopmostLayer: function () {
            const layers = this.map.getLayers().getArray().filter(layer => layer.getVisible() && !(layer instanceof VectorLayer));
            return layers.length !== 0 ? layers[layers.length - 1] : null;
        },

        registerEventListeners: function (layer) {
            const prerenderKey = layer.on('prerender', (event) => {
                const ctx = event.context;
                if (!this.active) {
                    ctx.restore();
                    return;
                }

                const mapSize = this.map.getSize();
                const tl = getRenderPixel(event, [0, 0]);
                const tr = getRenderPixel(event, [this.cropSize, 0]);
                const bl = getRenderPixel(event, [0, mapSize[1]]);
                const br = getRenderPixel(event, [this.cropSize, mapSize[1]]);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(tl[0], tl[1]);
                ctx.lineTo(bl[0], bl[1]);
                ctx.lineTo(br[0], br[1]);
                ctx.lineTo(tr[0], tr[1]);
                ctx.closePath();
                ctx.clip();
            });
            this.eventListenerKeys.push(prerenderKey);
            const postrenderKey = layer.on('postrender', (event) => {
                event.context.restore();
            });
            this.eventListenerKeys.push(postrenderKey);
        },

        unregisterEventListeners: function () {
            this.eventListenerKeys.forEach(key => unByKey(key));
            this.eventListenerKeys = [];
        },

        getSplitterElement: function () {
            if (!this.splitter) {
                this.splitter = jQuery('<div class="layer-swipe-splitter"></div>');
                this.splitter.draggable({
                    containment: '#mapdiv',
                    axis: 'x',
                    drag: () => {
                        const mapOffset = jQuery('#mapdiv').offset();
                        const splitterOffset = jQuery('.layer-swipe-splitter').offset();
                        this.cropSize = splitterOffset.left - mapOffset.left + this.splitterWidth / 2;
                        this.map.render();
                    }
                });
            }
            return this.splitter;
        },

        showSplitter: function () {
            jQuery('#mapdiv').append(this.getSplitterElement());
        },

        hideSplitter: function () {
            this.getSplitterElement().detach();
        },

        eventHandlers: {
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getToolId() !== 'LayerSwipe') {
                    this.setActive(false);
                }
            },
            'AfterMapLayerAddEvent': function (event) {
                this.updateSwipeLayer();
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this.updateSwipeLayer();
            }
        }
    },
    {
        extend: ['Oskari.BasicBundle'],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    }
);
