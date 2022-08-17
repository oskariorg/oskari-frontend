export const LOCALE_KEY = 'MyPlaces3';
export const LAYER_PREFIX = 'myplaces';
export const LAYER_METATYPE = 'MYPLACES';

export const LAYER_FORM = 'MyPlaces-layer';
export const PLACE_FORM = 'MyPlaces-place';

export const DRAW_ID = 'MyPlaces3';

export const DRAW_STYLE = {
    draw: {
        fill: {
            color: 'rgba(35, 216, 194, 0.3)'
        },
        stroke: {
            color: 'rgba(35, 216, 194, 1)',
            width: 2
        },
        image: {
            radius: 4,
            fill: {
                color: 'rgba(35, 216, 194, 0.7)'
            }
        }
    },
    modify: {
        fill: {
            color: 'rgba(0, 0, 238, 0.3)'
        },
        stroke: {
            color: 'rgba(0, 0, 238, 1)',
            width: 2
        },
        image: {
            radius: 4,
            fill: {
                color: 'rgba(0,0,0,1)'
            }
        }
    }
};

export const EDIT_OPTIONS = {
    drawControl: false,
    showMeasureOnMap: true,
    allowMultipleDrawing: 'multiGeom',
    style: DRAW_STYLE
};

export const DRAW_OPTIONS = {
    allowMultipleDrawing: 'multiGeom',
    showMeasureOnMap: true,
    style: DRAW_STYLE
};
