export const BUNDLE_KEY = 'myfeatures';
export const LAYER_TYPE = 'myf';
export const MAX_SIZE = 10;

export const TOOL = {
    NAME: 'import2',
    GROUP: 'myfeatures',
    ICON: 'upload-material'
};

export const FILE_INPUT_PROPS = {
    multiple: false,
    allowedTypes: ['application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'multipart/x-zip'],
    allowedExtensions: ['zip']
};

export const ERRORS = {
    GENERIC: 'generic',
    PARSER: 'parser_error',
    NO_SRS: 'unknown_projection',
    FORMAT: 'format_failure'
};
