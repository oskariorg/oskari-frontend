
const DRAW_OPERATION_ID = 'ContentEditor';
const EVENT_NAME = 'DrawingEvent'

let drawListener = null;
const fakeModule = {
    getName: () => DRAW_OPERATION_ID + 'FeaturePanel',
    onEvent: (event) => {
        if (event.getName() !== EVENT_NAME || !event.getIsFinished()) {
            return;
        }
        const featureCollection = event.getGeoJson() || {};
        if (!featureCollection.features || !featureCollection.features.length) {
            return;
        }
        if (typeof drawListener === 'function') {
            drawListener(featureCollection.features[0]);
        }
    }
};

const startDrawing = (type, isMulti = false, currentGeometry, listener) => {
    const drawParams = {
        allowMultipleDrawing: true,
        showMeasureOnMap: true,
        geojson: currentGeometry,
        allowMultipleDrawing: isMulti ? 'multiGeom' : 'single'
    };
    const sandbox = Oskari.getSandbox();
    sandbox.postRequestByName('DrawTools.StartDrawingRequest',
        [DRAW_OPERATION_ID, type.replace('Multi', ''), drawParams]);

    drawListener = listener;
    sandbox.registerForEventByName(fakeModule, EVENT_NAME);

};
const stopDrawing = () => {
    const sandbox = Oskari.getSandbox();
    sandbox.postRequestByName('DrawTools.StopDrawingRequest',
        [DRAW_OPERATION_ID, true, true]);
    sandbox.unregisterFromEventByName(fakeModule, EVENT_NAME);
    drawListener = null;
};

export const DrawingHelper = {
    startDrawing,
    stopDrawing,
    DRAW_OPERATION_ID
};
