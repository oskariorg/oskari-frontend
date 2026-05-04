
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
    sandbox.postRequestByName('DrawTools.StopDrawingRequest',
            [DRAW_OPERATION_ID, clearPrevious, !finishDrawing]);

    if (!finishDrawing) {
        cleanupDrawingListener();
    }
};

export const DrawingHelper = {
    startDrawing,
    stopDrawing,
    DRAW_OPERATION_ID
};
