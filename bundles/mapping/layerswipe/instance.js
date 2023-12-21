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
        this.oskariLayerId = null;
        this.popupService = null;
        this.popup = null;
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

            if (Oskari.dom.isEmbedded()) {
                const plugin = Oskari.clazz.create('Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin', this.conf);
                this.mapModule.registerPlugin(plugin);
                this.mapModule.startPlugin(plugin);
            } else {
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
            }
        },

        setActive: function (active) {
            if (active) {
                this.updateSwipeLayer();
                if (this.layer === null) {
                    return;
                }
                this.showSplitter();
                if (this.cropSize === null) {
                    this.resetMapCropping();
                }
                Oskari.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService').setHoverEnabled(false);
            } else {
                this.unregisterEventListeners();
                this.hideSplitter();
                Oskari.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService').setHoverEnabled(true);
                this.setSwipeStatus(null, null);
            }
            this.active = active;
            this.mapModule.getMap().render();
        },

        setSwipeStatus: function (layerId, cropX) {
            this.oskariLayerId = layerId;
            const reqSwipeStatus = Oskari.requestBuilder('GetInfoPlugin.SwipeStatusRequest')(layerId, cropX);
            Oskari.getSandbox().request(this, reqSwipeStatus);
        },

        updateSwipeLayer: function () {
            this.unregisterEventListeners();
            const topLayer = this.getTopmostLayer();
            this.layer = topLayer.ol;

            if (topLayer.layerId !== null) {
                this.setSwipeStatus(topLayer.layerId, this.cropSize);
            }

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
        getAlertPopup: function () {
            if (this.popup) {
                this.popup.close();
            }
            this.popup = this.popupService.createPopup();
            return this.popup;
        },
        showAlert: function (alertType) {
            const popup = this.getAlertPopup();
            const title = this.alertTitles[alertType];
            const message = this.alertMessages[alertType];
            popup.show(title, message, [popup.createCloseButton()]);
        },
        showNotVisibleAlert: function (layerId, zoomToExtent) {
            const popup = this.getAlertPopup();
            const moveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            moveBtn.setTitle(this.loc('alert.move'));
            moveBtn.setHandler(() => {
                Oskari.getSandbox().postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layerId, zoomToExtent]);
                popup.close();
            });
            const title = this.alertTitles[SwipeAlertTypes.NOT_VISIBLE];
            const message = this.alertMessages[SwipeAlertTypes.NOT_VISIBLE];
            const buttons = [moveBtn, popup.createCloseButton()];
            popup.show(title, message, buttons);
        },
        isInGeometry: function (layer) {
            var geometries = layer.getGeometry();
            if (!geometries || geometries.length === 0) {
                // we might not have the coverage geometry so assume all is good if we don't know for sure
                return true;
            }
            var viewBounds = this.mapModule.getCurrentExtent();
            var olExtent = [viewBounds.left, viewBounds.bottom, viewBounds.right, viewBounds.top];
            return geometries[0].intersectsExtent(olExtent);
        },

        getTopmostLayer: function () {
            const layers = Oskari.getSandbox()
                .findAllSelectedMapLayers()
                .filter(l => l.isVisible());
            if (!layers.length) {
                return null;
            }
            const topLayer = layers[layers.length - 1];
            const layerId = topLayer.getId();
            const isInGeometry = this.isInGeometry(topLayer);
            if (!isInGeometry || !topLayer.isInScale(this.mapModule.getMapScale())) {
                this.showNotVisibleAlert(layerId, !isInGeometry);
            }
            const olLayers = this.mapModule.getOLMapLayers(layerId);
            return {
                ol: olLayers.length !== 0 ? olLayers[0] : null,
                layerId: layerId
            };
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
                this.splitter.draggable({
                    containment: this.mapModule.getMapEl(),
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
        resetMapCropping: function () {
            const { left: mapLeft } = this.mapModule.getMapEl().offset();
            const mapWidth = this.mapModule.getMap().getSize()[0];
            const left = (mapWidth - this.splitterWidth) / 2 + mapLeft;
            this.getSplitterElement().offset({ left });
            this.updateMapCropping();
        },

        updateMapCropping: function () {
            const mapOffset = this.mapModule.getMapEl().offset();
            const splitterOffset = this.getSplitterElement().offset();
            this.cropSize = splitterOffset.left - mapOffset.left + this.splitterWidth / 2;
            this.mapModule.getMap().render();
            this.setSwipeStatus(this.oskariLayerId, this.cropSize);
        },

        showSplitter: function () {
            this.mapModule.getMapEl().append(this.getSplitterElement());
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
            },
            'MapSizeChangedEvent': function (event) {
                if (this.active) {
                    const { left } = this.getSplitterElement().offset();
                    const width = jQuery(window).width() - this.splitterWidth;
                    if (left > width) {
                        this.getSplitterElement().offset({ left: width });
                        this.updateMapCropping();
                    }
                }
            }
        }
    },
    {
        extend: ['Oskari.BasicBundle'],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    }
);
