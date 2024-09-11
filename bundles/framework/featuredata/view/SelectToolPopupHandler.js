import { SELECTION_SERVICE_CLASSNAME } from '../plugin/FeatureDataPluginHandler';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import { showSelectToolPopup } from './SelectToolPopup';
import { Messaging, StateHandler, controllerMixin } from 'oskari-ui/util';
import { getFeatureId } from '../../../mapping/mapmodule/util/vectorfeatures/feature';

export const DRAW_REQUEST_ID = 'FeatureData.featureselection';
export const DRAW_TOOLS = ['point', 'line', 'area', 'square', 'circle'];
export const SELECT_ALL_ID = -1;

const DRAW_REQUEST = {
    point: 'Point',
    line: 'LineString',
    area: 'Polygon',
    square: 'Square',
    circle: 'Circle'
};
const DRAW_OPTIONS = {
    allowMultipleDrawing: 'single'
};

class SelectToolPopupHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.selectionService = null;
        this.selectionPopup = null;
        this.setState(this.initState());
        this.eventHandlers = this.createEventHandlers();
        this.addStateListener(state => this.onStateUpdate(state));
    }

    getName () {
        return 'SelectToolPopupHandler';
    }

    initState () {
        const vectorLayerIds = this.getVectorLayerIds();
        return {
            layerId: vectorLayerIds[vectorLayerIds.length - 1],
            tool: null,
            vectorLayerIds
        };
    }

    createEventHandlers () {
        const onMapLayerEvent = evt => {
            if (!evt.getMapLayer().hasFeatureData()) {
                return;
            }
            const { layerId: current } = this.getState();
            const vectorLayerIds = this.getVectorLayerIds();
            const layerId = current === SELECT_ALL_ID ? current : vectorLayerIds[vectorLayerIds.length - 1];
            this.updateState({ vectorLayerIds, layerId });
        };
        const handlers = {
            AfterMapLayerAddEvent: onMapLayerEvent,
            AfterMapLayerRemoveEvent: onMapLayerEvent,
            MapLayerVisibilityChangedEvent: onMapLayerEvent,
            DrawingEvent: evt => {
                if (!evt.getIsFinished() || !this.selectionPopup || DRAW_REQUEST_ID !== evt.getId()) {
                    // only interested in finished own drawings when active
                    return;
                }
                this.onFinishedDrawing(evt.getGeoJson().features[0]);
            }
        };
        const sb = this.instance.getSandbox();
        Object.getOwnPropertyNames(handlers).forEach(p => sb.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    getVectorLayerIds () {
        return this.instance.getSandbox()
            .findAllSelectedMapLayers()
            .filter(layer => layer.isVisible() && layer.hasFeatureData())
            .map(layer => layer.getId());
    }

    setTool (newTool) {
        const { tool: current, vectorLayerIds } = this.getState();
        if (!vectorLayerIds.length) {
            // tools are disabled
            return;
        }
        // toggle if already selected
        const tool = current === newTool ? null : newTool;
        if (tool) {
            this.startDrawing(tool);
        } else {
            this.stopDrawing();
        }
        this.updateState({ tool });
    }

    clearSelectionPopup (resetTool = true) {
        if (this.selectionPopup) {
            this.selectionPopup.close();
        }
        if (resetTool) {
            const toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            if (toolbarRequest) {
                this.instance.getSandbox().request(this.instance, toolbarRequest());
            }
        }
        this.stopDrawing();
        this.selectionPopup = null;
        this.updateState(this.initState());
    }

    setLayerdId (layerId) {
        this.updateState({ layerId });
    }

    stopDrawing () {
        this.instance.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', [
            DRAW_REQUEST_ID,
            true,
            true
        ]);
    }

    startDrawing (tool) {
        this.instance.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', [
            DRAW_REQUEST_ID,
            DRAW_REQUEST[tool],
            DRAW_OPTIONS
        ]);
    }

    clearFinishedDrawing () {
        const { tool } = this.getState();
        this.stopDrawing();
        this.startDrawing(tool);
    }

    getSelectionService () {
        if (!this.selectionService) {
            this.selectionService = this.instance.getSandbox().getService(SELECTION_SERVICE_CLASSNAME);
        }
        return this.selectionService;
    }

    clearSelections () {
        this.getSelectionService()?.removeSelection();
    }

    onFinishedDrawing (feature) {
        const { geometry } = feature || {};
        if (!geometry) {
            return;
        }

        const { layerId, vectorLayerIds } = this.getState();
        const layers = layerId === SELECT_ALL_ID ? vectorLayerIds : [layerId];
        const { error, ...layerData } = this.instance.getMapModule().getVectorFeatures({ geometry }, { layers });
        const selectionService = this.getSelectionService();
        if (error || !selectionService) {
            Oskari.log(this.getName()).warn('Error querying features:', error || 'failed to get selection service');
            return;
        }
        Object.keys(layerData).forEach(layerId => {
            const fids = layerData[layerId]?.features.map(getFeatureId) || [];
            selectionService.setSelectedFeatureIds(layerId, fids);
        });

        this.clearFinishedDrawing();
    }

    onStateUpdate (state) {
        if (this.selectionPopup) {
            this.selectionPopup.update(state);
        }
    }

    /**
     * @method showSelectionTools
     * Handles tool button click -> opens selection tool dialog
     */
    showSelectionPopup () {
        if (this.selectionPopup) {
            return;
        }
        if (!this.getVectorLayerIds().length) {
            Messaging.warn(Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.noVectorLayers'));
        } else {
            // Set default draw mode active
            this.setTool(DRAW_TOOLS[0]);
        }

        const onClose = () => this.clearSelectionPopup();
        this.selectionPopup = showSelectToolPopup(this.getState(), this.getController(), onClose);
    }
}

const wrapped = controllerMixin(SelectToolPopupHandler, [
    'setTool',
    'setLayerId',
    'clearSelections'
]);

export { wrapped as SelectToolPopupHandler };
