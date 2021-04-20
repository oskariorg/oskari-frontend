import { getRenderPixel } from 'ol/render';
import { unByKey } from 'ol/Observable';

const SwipeAlertTypes = {
    NO_RASTER: 'noRaster',
    NOT_VISIBLE: 'notVisible'
};

Oskari.clazz.define(
    'Oskari.mapframework.bundle.layerswipe.LayerSwipeBundleInstance',

    function () {
        this.active = false;
        this.splitter = null;
        this.splitterWidth = 5;
        this.cropSize = null;
        this.mapModule = null;
        this.layer = null; // ol layer
        this.popupService = null;
        this.loc = Oskari.getMsg.bind(null, 'LayerSwipe');
        this.eventListenerKeys = [];

        this.alertTimer = null;
        this.alertDebounceTime = 500;

        this.alertTitles = {
            [SwipeAlertTypes.NO_RASTER]: this.loc('alert.swipeNoRasterTitle'),
            [SwipeAlertTypes.NOT_VISIBLE]: this.loc('alert.swipeLayerNotVisibleTitle')
        };
        this.alertMessages = {
            [SwipeAlertTypes.NO_RASTER]: this.loc('alert.swipeNoRasterMessage'),
            [SwipeAlertTypes.NOT_VISIBLE]: this.loc('alert.swipeLayerNotVisibleMessage')
        };
    },
    {
        __name: 'LayerSwipe',

        _startImpl: function (sandbox) {
            this.mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
            this.popupService = sandbox.getService('Oskari.userinterface.component.PopupService');

            const addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            const buttonConf = {
                iconCls: 'tool-layer-swipe',
                tooltip: this.loc('toolLayerSwipe'),
                sticky: true,
                callback: () => {
                    if (this.active) {
                        this.activateDefaultMapTool();
                    } else {
                        this.setActive(true);
                    }
                }
            };
            sandbox.request(this, addToolButtonBuilder('LayerSwipe', 'basictools', buttonConf));
        },

        setActive: function (active) {
            const map = this.mapModule.getMap();
            if (active) {
                this.updateSwipeLayer();
                if (this.layer === null) {
                    return;
                }
                this.showSplitter();
                if (this.cropSize === null) {
                    const mapSize = map.getSize();
                    this.cropSize = mapSize[0] / 2;
                }
            } else {
                this.unregisterEventListeners();
                this.hideSplitter();
            }
            this.active = active;
            map.render();
        },

        updateSwipeLayer: function () {
            this.unregisterEventListeners();
            this.layer = this.getTopmostLayer();

            if (this.alertTimer) {
                clearTimeout(this.alertTimer);
            }
            if (this.layer === null) {
                // When switching the background map, multiple events including
                // remove, add and re-arrange will be triggered in order. The remove
                // layer event causes the NO_RASTER alert to be shown when the
                // background map layer itself swipe layer. Using a timer to delay
                // the swipe tool deactivation and alert.
                this.alertTimer = setTimeout(() => {
                    this.activateDefaultMapTool();
                    this.showAlert(SwipeAlertTypes.NO_RASTER);
                }, this.alertDebounceTime);
                return;
            }
            this.registerEventListeners();
        },

        activateDefaultMapTool: function () {
            // reset toolbar to use the default tool
            Oskari.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', []);
        },

        showAlert: function (alertType) {
            const title = this.alertTitles[alertType];
            const message = this.alertMessages[alertType];
            const popup = this.popupService.createPopup();
            const closeBtn = popup.createCloseButton(this.loc('alert.ok'));
            popup.show(title, message, [closeBtn]);
        },

        isInGeometry: function (layer) {
            var geometries = layer.getGeometry();
            if (!geometries || geometries.length === 0) {
                return true;
            }
            var viewBounds = this.mapModule.getCurrentExtent();
            var olExtent = [viewBounds.left, viewBounds.bottom, viewBounds.right, viewBounds.top];
            if (geometries[0].intersectsExtent(olExtent)) {
                return true;
            }
            return false;
        },

        getTopmostLayer: function () {
            const layers = Oskari.getSandbox()
                .findAllSelectedMapLayers()
                .filter(l => l.isVisible());
            if (!layers.length) {
                return null;
            }
            const topLayer = layers[layers.length - 1];
            if (!topLayer.isInScale(this.mapModule.getMapScale()) || !this.isInGeometry(topLayer)) {
                this.showAlert(SwipeAlertTypes.NOT_VISIBLE);
            }
            const olLayers = this.mapModule.getOLMapLayers(topLayer.getId());
            return olLayers.length !== 0 ? olLayers[0] : null;
        },

        registerEventListeners: function () {
            if (this.layer === null) {
                return;
            }
            const prerenderKey = this.layer.on('prerender', (event) => {
                const ctx = event.context;
                if (!this.active) {
                    ctx.restore();
                    return;
                }

                const mapSize = this.mapModule.getMap().getSize();
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
            const postrenderKey = this.layer.on('postrender', (event) => {
                event.context.restore();
            });
            this.eventListenerKeys.push(postrenderKey);
        },

        unregisterEventListeners: function () {
            this.eventListenerKeys.forEach((key) => unByKey(key));
            this.eventListenerKeys = [];
        },

        getSplitterElement: function () {
            if (!this.splitter) {
                this.splitter = jQuery('<div class="layer-swipe-splitter"></div>');
                this.splitter.css('cursor', 'grab');
                this.splitter.draggable({
                    containment: '#mapdiv',
                    axis: 'x',
                    drag: () => {
                        this.updateMapCropping();
                    },
                    stop: () => {
                        this.updateMapCropping();
                    }
                });
            }
            return this.splitter;
        },

        updateMapCropping: function () {
            const mapOffset = jQuery('#mapdiv').offset();
            const splitterOffset = jQuery('.layer-swipe-splitter').offset();
            this.cropSize = splitterOffset.left - mapOffset.left + this.splitterWidth / 2;
            this.mapModule.getMap().render();
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
                if (this.active) {
                    this.updateSwipeLayer();
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                if (this.active) {
                    this.updateSwipeLayer();
                }
            },
            'AfterRearrangeSelectedMapLayerEvent': function (event) {
                if (this.active) {
                    this.updateSwipeLayer();
                }
            },
            'MapLayerVisibilityChangedEvent': function (event) {
                if (this.active) {
                    this.updateSwipeLayer();
                }
            }
        }
    },
    {
        extend: ['Oskari.BasicBundle'],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    }
);
