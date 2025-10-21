import React from 'react';
import { StateHandler, controllerMixin, ThemeProvider } from 'oskari-ui/util';
import { showAlertPopup } from '../view/AlertPopup';
import { LayerSwipe, SPLITTER_WIDTH } from '../view/LayerSwipe';
import { getRenderPixel } from 'ol/render';
import { unByKey } from 'ol/Observable';
import { createRoot } from 'react-dom/client';

const Alerts = {
    NO_RASTER: 'noRaster',
    NOT_VISIBLE: 'notVisible'
};

class UIHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        const mapSize = this.getMapSize();
        const { noUI = false } = instance.conf || {};
        this.setState({
            active: false,
            layerId: null,
            position: (mapSize.width - SPLITTER_WIDTH) / 2,
            mapSize,
            noUI
        });
        this.alertPopupControls = null;
        this.element = null;
        this.eventListenerKeys = [];
        this.addStateListener(() => this.render());
        this._reactRoot = null;
    };

    getMapSize () {
        return this.instance.getMapModule().getSize();
    }

    initTopmostLayer () {
        const { layerId: current } = this.getState();
        const sb = this.instance.getSandbox();
        const layer = sb.findAllSelectedMapLayers().findLast(l => l.isVisible());
        const layerId = layer?.getId();
        if (layerId && current === layerId) {
            // no need to update
            return;
        }
        this.unregisterEventListeners();
        if (!layerId) {
            this.showAlert(Alerts.NO_RASTER);
        }

        const olLayers = this.instance.getMapModule().getOLMapLayers(layerId) || [];
        this.registerEventListeners(olLayers);
        this.checkVisibility(layer);
        this.updateState({ layerId });
    }

    checkVisibility (layer) {
        if (!layer) {
            return;
        }
        const { inScale, geometryMatch, unsupported } = layer.getVisibilityInfo();
        if (unsupported) {
            const message = unsupported.getDescription() + ' ' + unsupported.getActionText();
            const action = unsupported.getAction();
            this.showAlert(Alerts.NOT_VISIBLE, action, message);
        }
        if (!inScale || !geometryMatch) {
            const zoomToExtent = !geometryMatch;
            const action = () => this.instance.getSandbox().postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layer.getId(), zoomToExtent]);
            this.showAlert(Alerts.NOT_VISIBLE, action);
        }
    }

    onMapLayerEvent () {
        if (this.getState().active) {
            this.initTopmostLayer();
        }
    }

    onMapSizeChange () {
        const { active, position } = this.getState();
        if (!active) {
            return;
        }
        const mapSize = this.getMapSize();
        const max = mapSize.width - SPLITTER_WIDTH;
        if (position < max) {
            this.updateState({ mapSize });
            return;
        }
        this.updateState({ mapSize, position: max });
    }

    setActive (active) {
        if (this.getState().active === active) {
            return;
        }
        let { layerId } = this.getState();
        const mapModule = this.instance.getMapModule();
        const root = mapModule.getMapDOMEl();
        if (active) {
            if (!this.element) {
                this.element = document.createElement('div');
                this.element.classList.add('oskari-react-splitter-container');
                root.appendChild(this.element);
            }
            this.initTopmostLayer();
        } else if (!active && this.element) {
            if (this._reactRoot) {
                this._reactRoot.unmount();
                this._reactRoot = null;
            }

            root.removeChild(this.element);
            this.element = null;
            layerId = null;
        }
        mapModule.getMap().render();
        this.instance.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService')?.setHoverEnabled(!active);
        this.updateState({ active, layerId });
    }

    toggleTool () {
        const { active } = this.getState();
        this.setActive(!active);
    }

    setHideUI (noUI) {
        this.updateState({ noUI });
    }

    getReactRoot (element) {
        if (!this._reactRoot) {
            this._reactRoot = createRoot(element);
        }
        return this._reactRoot;
    }

    render () {
        if (!this.element) {
            return;
        }
        this.getReactRoot(this.element).render(
            <ThemeProvider>
                <LayerSwipe { ...this.getState() } controller={this.getController()} isMobile={!Oskari.util.mouseExists()}/>
            </ThemeProvider>);
    }

    resetPosition () {
        const { width } = this.getMapSize();
        const position = (width - SPLITTER_WIDTH) / 2;
        this.setPosition(position);
    }

    setPosition (position) {
        const { layerId } = this.getState();
        this.instance.getMapModule().getMap().render();
        this.instance.getSandbox().postRequestByName('GetInfoPlugin.SwipeStatusRequest', [layerId, position]);
        this.updateState({ position });
    }

    showAlert (type, action, message) {
        if (this.alertPopupControls) {
            this.alertPopupControls.close();
        }
        this.alertPopupControls = showAlertPopup(type, action, message, () => this.closeAlert());
    }

    closeAlert () {
        if (this.alertPopupControls) {
            this.alertPopupControls.close();
        }
        this.alertPopupControls = null;
    }

    registerEventListeners (olLayers) {
        olLayers.forEach((olLayer) => {
            const prerenderKey = olLayer.on('prerender', (event) => {
                const { active, position, mapSize: { height } } = this.getState();
                const ctx = event.context;
                if (!active) {
                    ctx.restore();
                    return;
                }

                const tl = getRenderPixel(event, [0, 0]);
                const tr = getRenderPixel(event, [position, 0]);
                const bl = getRenderPixel(event, [0, height]);
                const br = getRenderPixel(event, [position, height]);

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
            const postrenderKey = olLayer.on('postrender', (event) => {
                event.context.restore();
            });
            this.eventListenerKeys.push(postrenderKey);
        });
    }

    unregisterEventListeners () {
        this.eventListenerKeys.forEach((key) => unByKey(key));
        this.eventListenerKeys = [];
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setActive',
    'setPosition',
    'toggleTool',
    'setHideUI'
]);

export { wrapped as SwipeHandler };
