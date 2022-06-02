

import { EDIT_OPTIONS, DRAW_OPTIONS, DRAW_ID } from '../constants';

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
        if (event.getId() === DRAW_ID && event.getIsFinished()) {
            this._drawing = event.getGeoJson();
        }
    }

    // DrawTools sends FeatureCollection with one Feature with multi geometry
    // It shouldn't send Feature with invalid geometry (no need to validate coordinates)
    hasValidGeometry () {
        return this._drawing && this._drawing.features.length > 0;
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
        console.log(this._drawing);
        const shape = geometry.type.replace('Multi', '');
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

    finishDrawing () {
        this.instance.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [DRAW_ID, false]);
    }
}
