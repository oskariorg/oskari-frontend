import { FilterSelector } from '../FilterSelector';
import { SELECTION_SERVICE_CLASSNAME } from '../plugin/FeatureDataPluginHandler';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import { showSelectToolPopup } from './SelectToolPopup';

export const DRAW_REQUEST_ID = 'FeatureData.featureselection';
const DRAW_MODES = {
    point: 'point',
    line: 'line',
    polygon: 'polygon',
    square: 'square',
    circle: 'circle'
};

const DRAW_REQUEST_TOOLS = {
    point: 'Point',
    line: 'LineString',
    polygon: 'Polygon',
    square: 'Square',
    circle: 'Circle'
};

export class SelectToolPopupHandler {
    constructor (instance) {
        this.buttons = {
            point: {
                iconCls: 'selection-point',
                name: DRAW_MODES.point,
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.point.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler(DRAW_MODES.point, start)
            },
            line: {
                iconCls: 'selection-line',
                name: DRAW_MODES.line,
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.line.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler(DRAW_MODES.line, start)
            },
            polygon: {
                iconCls: 'selection-area',
                name: DRAW_MODES.polygon,
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.polygon.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler(DRAW_MODES.polygon, start)
            },
            square: {
                iconCls: 'selection-square',
                name: DRAW_MODES.square,
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.square.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler(DRAW_MODES.square, start)
            },
            circle: {
                iconCls: 'selection-circle',
                name: DRAW_MODES.circle,
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.circle.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler(DRAW_MODES.circle, start)
            }
        };

        this.instance = instance;
        this.selectFromAllLayers = false;
        this.selectionService = this.instance.getMapModule().getSandbox().getService(SELECTION_SERVICE_CLASSNAME);
        const featureQueryFn = (geojson, opts) => this.instance.getMapModule().getVectorFeatures(geojson, opts);
        this.filterSelector = new FilterSelector(featureQueryFn, this.selectionService);
    }

    selectToolHandler (drawMode, startDrawing) {
        if (startDrawing) {
            this.selectedTool = drawMode;
            this.startDrawing({ drawMode });
        } else {
            this.selectedTool = null;
            this.stopDrawing();
        }
        if (this.selectionPopup) {
            this.selectionPopup.update(this.selectedTool, this.isSelectFromAllLayers());
        }
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
    }

    setSelectFromAllLayers (selectFromAll) {
        this.selectFromAllLayers = selectFromAll;
        this.selectionPopup.update(this.selectedTool, this.isSelectFromAllLayers());
    }

    isSelectFromAllLayers () {
        return this.selectFromAllLayers;
    }

    /*
        "Plugin"
    */
    startDrawing (params) {
        this.toggleControl(params.drawMode);
    }

    clearDrawing () {
        this.instance.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', [
            DRAW_REQUEST_ID,
            true,
            true
        ]);
    }

    /**
     * @method stopDrawing
     * Disables all draw controls and
     * clears the layer of any drawn features
     */
    stopDrawing (keepDrawMode = false) {
        this.clearDrawing();
        // disable all draw controls
        this.toggleControl(null, keepDrawMode);
    }

    /**
     * @method toggleControl
     * Enables the given draw control
     * Disables all the other draw controls
     * @param {String} drawMode draw control to activate (if undefined, disables all
     * controls)
     */
    toggleControl (drawMode, keepDrawMode = false) {
        if (keepDrawMode && !drawMode) {
            // keep previous draw mode active
        } else {
            this.currentDrawMode = drawMode;
        }

        Object.keys(DRAW_MODES).forEach((key) => {
            if (this.currentDrawMode === key) {
                this.instance.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', [
                    DRAW_REQUEST_ID,
                    DRAW_REQUEST_TOOLS[this.currentDrawMode]
                ]);
            }
        });
    }

    getSelectionService () {
        if (!this.selectionService) {
            this.selectionService = this.instance.getSandbox().getService(SELECTION_SERVICE_CLASSNAME);
        }
        return this.selectionService;
    }

    removeAllFeatureSelections () {
        const service = this.getSelectionService();
        if (!service) {
            return;
        }
        service.removeSelection();
    }

    selectWithGeometry (filterFeature = {}) {
        const layers = this.filterSelector.getLayersToQuery(
            this.instance.getSandbox().findAllSelectedMapLayers(),
            this.isSelectFromAllLayers());
        this.filterSelector.selectWithGeometry(filterFeature, layers);
        this.stopDrawing(true);
    }

    /**
     * @method showSelectionTools
     * Handles tool button click -> opens selection tool dialog
     */
    showSelectionTools () {
        if (this.selectionPopup) return;
        this.selectionPopup = showSelectToolPopup(
            this.selectedTool,
            this.isSelectFromAllLayers(),
            this.buttons,
            () => this.removeAllFeatureSelections(),
            (selectFromAll) => this.setSelectFromAllLayers(selectFromAll),
            () => this.clearSelectionPopup()
        );

        // Set default draw mode active
        this.selectToolHandler(DRAW_MODES.point, true);
    }
}
