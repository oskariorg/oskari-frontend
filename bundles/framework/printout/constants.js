// first is default selection
export const SIZE_OPTIONS = [
    { value: 'A4', landscape: false },
    { value: 'A4_Landscape', landscape: true },
    { value: 'A3', landscape: false },
    { value: 'A3_Landscape', landscape: true }
];
// 'pdf' is default selection
export const FORMAT_OPTIONS = [
    { name: 'png', mime: 'image/png' },
    { name: 'pdf', mime: 'application/pdf' }
];
// first is default selection
export const SCALE_OPTIONS = [
    'map',
    'configured'
];
// all selected by default
export const PAGE_OPTIONS = [
    'pageLogo',
    'pageScale',
    'pageDate'
];

export const TIME_OPTION = 'pageTimeSeriesTime';

export const PARAMS = {
    TIME: 'time',
    FORMATTED_TIME: 'formattedTime',
    SERIES_LABEL: 'timeseriesPrintLabel'
};
// width, height
export const WINDOW_SIZE = [850, 1200];
