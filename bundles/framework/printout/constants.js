export const SIZE_OPTIONS = [
    { value: 'A4', landscape: false },
    { value: 'A4_Landscape', landscape: true },
    { value: 'A3', landscape: false },
    { value: 'A3_Landscape', landscape: true }
];

export const FORMAT_OPTIONS = [
    { name: 'png', mime: 'image/png' },
    { name: 'pdf', mime: 'application/pdf' }
];

export const SCALE_OPTIONS = [
    'map',
    'configured'
];

export const PAGE_OPTIONS = [
    'pageScale',
    'pageDate'
];

// width, height
export const WINDOW_SIZE = [850, 1200];
export const PREVIEW_SCALED_WIDTH = 200;

export const COORDINATE_POSITIONS = [
    'center',
    'corners'
];

export const COORDINATE_PROJECTIONS = [
    'map',
    'EPSG:4326'
];

export const UNSUPPORTED_FOR_CONFIGURED_SCALE = ['wmts'];
