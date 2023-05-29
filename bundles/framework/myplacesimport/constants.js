export const BUNDLE_NAME = 'MyPlacesImport';
export const LAYER_TYPE = 'userlayer';
export const MAX_SIZE = 10;

export const TOOL = {
    NAME: 'import',
    GROUP: 'myplaces',
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
