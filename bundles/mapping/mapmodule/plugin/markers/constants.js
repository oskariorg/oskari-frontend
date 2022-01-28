export const ID_PREFIX = 'M_';
export const TRANSIENT = false;
export const BUNDLE_KEY = 'MapModule';
export const PLUGIN_NAME = 'MarkersPlugin';
export const TOOL_GROUP = 'selectiontools';
export const STYLE_TYPE = 'point';
// export const SVGIconUrl = 'data:image/svg+xml;base64,';

// offsetX: 8 + 2 * size,
export const DEFAULT_STYLE = {
    image: {
        shape: 2,
        size: 1,
        fill: {
            color: '#ffde00'
        }
    },
    text: {
        font: 'bold 16px Arial',
        textAlign: 'left',
        textBaseline: 'middle',
        offsetX: 8 + 2 * 1,
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

export const DEFAULT_DATA = {
    color: 'ffde00',
    stroke: 'b4b4b4',
    msg: '',
    shape: 2,
    size: 1,
    transient: false
};

/*
    me._font = {
        name: 'dot-markers',
        baseIndex: 57344
    };
    me._defaultData = {
        x: 0,
        y: 0,
        color: 'ffde00',
        stroke: 'b4b4b4',
        msg: '',
        shape: 2,
        size: 1,
        transient: false
    }; 

    me._strokeStyle = {
        'stroke-width': 1,
        'stroke': '#b4b4b4'
    };

          // Is SVG supported?
            // DOMImplementation.hasFeature
            // Deprecated This feature is no longer recommended
            me._svg = document.implementation.hasFeature(
                'http://www.w3.org/TR/SVG11/feature#Image',
                '1.1'
            );
*/