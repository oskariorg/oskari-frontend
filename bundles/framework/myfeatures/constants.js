export const BUNDLE_KEY = 'myfeatures';
export const MY_FEATURES_LAYER_TYPE = 'myf';
export const MAX_SIZE = 10;

export const TOOL = {
    NAME: 'import2',
    GROUP: 'myfeatures',
    ICON: 'upload-material'
};

export const ADD_FEATURE_TOOL = {
    NAME: 'addfeatures',
    GROUP: 'myfeatures',
    ICON: 'myplaces-draw-point'
};

export const FILE_INPUT_PROPS = {
    multiple: false,
    allowedTypes: [
        'application/zip',
        'application/octet-stream',
        'application/x-zip-compressed',
        'multipart/x-zip',
        'application/gpx+xml',
        'application/vnd.google-earth.kml+xml',
        'application/geo+json',
        'application/json',
        'application/xml',
        'application/geopackage+sqlite3',
        'text/xml'
    ],
    allowedExtensions: ['zip', 'gpx', 'kml', 'geojson', 'json', 'gpkg']
};

export const ERRORS = {
    GENERIC: 'generic',
    PARSER: 'parser_error',
    NO_SRS: 'unknown_projection',
    FORMAT: 'format_failure'
};

export const FEATURE_EDITOR_TOOLNAME = 'myfeatures.FeatureEditor';
export const DELETE_FEATURE_TOOLNAME = 'myfeatures.deleteFeature';
