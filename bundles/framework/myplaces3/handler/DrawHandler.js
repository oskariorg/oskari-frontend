import { EDIT_OPTIONS, DRAW_OPTIONS, DRAW_ID } from '../constants';

/**
 * Maps geojson geometry type to a specific button id/"drawMode" in myplaces.
 * @param {String} shape geometry type from geojson
 * @returns drawmode to use for geometry in myplaces
 */
const getDrawModeFromGeometryType = (shape) => {
    if (shape === 'Polygon') {
        return 'area';
    } else if (shape === 'LineString') {
        return 'line';
    } else if (shape === 'Point') {
        return 'point';
    }
    return null;
};

export class DrawHandler {
    constructor (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.eventHandlers = this.createEventHandlers();
        this._drawing = null;
    }

    getName () {
        return 'DrawHandler';
    }

    createEventHandlers () {
        const handlers = {
            DrawingEvent: event => this.handleDrawingEvent(event)
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        const handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }

    handleDrawingEvent (event) {
        if (event.getId() !== DRAW_ID) {
            // not our drawing
            return;
        }
        if (!event.getIsFinished()) {
            // not finished yet
            return;
        }
        this._drawing = event.getGeoJson();
        if (typeof this._callback === 'function') {
            let geojson = this._drawing;
            if (!this.hasValidGeometry()) {
                geojson = undefined;
            }
            this._callback(geojson);
            this._callback = null;
        }
    }

    // DrawTools sends FeatureCollection with one Feature with multi geometry
    // It shouldn't send Feature with invalid geometry (no need to validate coordinates)
    hasValidGeometry () {
        return this._drawing && this._drawing.features.length > 0 && this._drawing.features[0].properties.valid;
    }

    setPlaceGeometry (place) {
        if (!this.hasValidGeometry()) {
            return;
        }
        const { geometry } = this._drawing.features[0];
        place.setGeometry(geometry);
    }

    stopDrawing () {
        this.instance.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [DRAW_ID, true, true]);
        this._drawing = null;
    }

    clearDrawing () {
        if (!this._drawing) {
            return;
        }
        this.stopDrawing();
    }

    startModify (geometry) {
        const shape = geometry.type.replace('Multi', '');
        this.instance.setupModifyMode(getDrawModeFromGeometryType(shape));
        const options = {
            ...EDIT_OPTIONS,
            geojson: JSON.stringify(geometry)
        };
        this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [DRAW_ID, shape, options]);
    }

    startDrawing (shape) {
        // user has drawn geometry and changes draw mode => clear before start
        this.clearDrawing();
        this.instance.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', [DRAW_ID, shape, DRAW_OPTIONS]);
    }
    /**
     * Finish a possible sketch from button press and call callback with finished geometry
     * @param {Function} callback function to call when we get the finished geometry
     */
    finishDrawing (callback) {
        this._callback = callback;
        this.instance.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [DRAW_ID, false]);
    }
}
