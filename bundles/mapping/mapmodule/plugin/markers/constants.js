export const ID_PREFIX = 'M_';
export const BUNDLE_KEY = 'MapModule';
export const PLUGIN_NAME = 'MarkersPlugin';
export const TOOL_GROUP = 'selectiontools';
export const GEOMETRY_TYPE = 'point';

export const SEPARATORS = {
    FIELD: '|',
    MARKER: '___',
    COORD: '_'
};

export const DEFAULT_DATA = {
    color: 'ffde00',
    msg: '',
    shape: 2,
    size: 1,
    transient: false
};

// use size 3 for add marker UI
export const DEFAULT_STYLE = {
    image: {
        shape: DEFAULT_DATA.shape,
        size: 3,
        fill: {
            color: '#' + DEFAULT_DATA.color
        }
    },
    text: {
        font: 'bold 16px Arial',
        textAlign: 'left',
        textBaseline: 'middle',
        offsetX: 8 + 2 * DEFAULT_DATA.size,
        offsetY: 8,
        fill: {
            color: '#000000'
        },
        stroke: {
            color: '#ffffff',
            width: 3
        }
    }
};
