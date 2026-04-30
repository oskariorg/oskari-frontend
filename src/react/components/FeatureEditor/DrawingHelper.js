
const DRAW_OPERATION_ID = 'FeatureEditor';
const EVENT_NAME = 'DrawingEvent'

let drawListener = null;
const cleanupDrawingListener = () => {
    const sandbox = Oskari.getSandbox();
    sandbox.unregisterFromEventByName(fakeModule, EVENT_NAME);
    drawListener = null;
};

const fakeModule = {
    getName: () => DRAW_OPERATION_ID + 'FeaturePanel',
    onEvent: (event) => {
        const isFinished = event.getIsFinished();
        if (event.getName() !== EVENT_NAME || !isFinished) {
            return;
        }
        const featureCollection = event.getGeoJson() || {};
        if (!featureCollection.features || !featureCollection.features.length) {
            if (isFinished) {
                cleanupDrawingListener();
            }
            return;
        }
        if (typeof drawListener === 'function') {
            drawListener(featureCollection.features[0]);
        }
    }
};

const startDrawing = (type, isMulti = false, currentGeometry, listener) => {

    const sandbox = Oskari.getSandbox();

    // clear old drawing in case there might a previous sketch on the map
    stopDrawing(true);

    const drawParams = {
        allowMultipleDrawing: true,
        showMeasureOnMap: true,
        geojson: currentGeometry,
        allowMultipleDrawing: isMulti ? 'multiGeom' : 'single'
    };
    sandbox.postRequestByName('DrawTools.StartDrawingRequest',
        [DRAW_OPERATION_ID, type.replace('Multi', ''), drawParams]);

    drawListener = listener;
    sandbox.registerForEventByName(fakeModule, EVENT_NAME);

};
const stopDrawing = (clearPrevious = false, finishDrawing = false) => {
    const sandbox = Oskari.getSandbox();
    if (finishDrawing) {
        // Call DrawPlugin.stopDrawing() directly with suppressEvent=false.
        // This runs forceFinishDrawing() (handles in-progress sketch, trims ghost point)
        // and then sendDrawingEvent(true) — the same path as a double-click on the map.
        // fakeModule.onEvent receives the isFinished=true event, updates geometry and does cleanup.
        const drawPlugin = sandbox.findRegisteredModuleInstance('DrawTools')?.getPlugin();
        drawPlugin?.stopDrawing(DRAW_OPERATION_ID, clearPrevious, false);
        // Fallback: if event was not sent (e.g. geometry too short), clean up listener here.
        cleanupDrawingListener();
    } else {
        sandbox.postRequestByName('DrawTools.StopDrawingRequest',
            [DRAW_OPERATION_ID, clearPrevious, true]);
        cleanupDrawingListener();
    }
};

export const DrawingHelper = {
    startDrawing,
    stopDrawing,
    DRAW_OPERATION_ID
};
