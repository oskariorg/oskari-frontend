import { FILL_STYLE } from '../../../../bundles/mapping/mapmodule/oskariStyle/constants';
export const FILLS = FILL_STYLE;
export const FILL_ORDER = ['TRANSPARENT', 'SOLID', 'THIN_HORIZONTAL', 'THICK_HORIZONTAL', 'THIN_DIAGONAL', 'THICK_DIAGONAL'];
export const LOCALIZATION_BUNDLE = 'oskariui';

// AntD width settings for grid
export const ANTD_FORMLAYOUT = {
    labelCol: { span: 24 }, // width of label column in AntD grid settings -> full width = own row inside element
    wrapperCol: { span: 24 } // width of wrapping column in AntD grid settings -> full width = own row inside element
};

export const SUPPORTED_FORMATS = ['point', 'line', 'area'];

export const LINE_STYLES = {
    "lineDash": [
        {
            "name": "solid",
            "data": `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,32 l32,-32" stroke="#000000" stroke-width="3"/></svg>`
        },
        {
            "name": "dash",
            "data": `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,32 l32,-32" stroke="#000000" stroke-dasharray="4, 4" stroke-width="3"/></svg>`
        }
    ],
    "corners": [
        {
            "name": "miter",
            "data": `<svg version="1.1" viewBox="0 0 32 32" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg"
                        style="enable-background:new 0 0 32 32;">
                    <polygon points="32,9 9,9 9,32 23,32 23,23 32,23 "/>
                    <polygon fill="#fff" points="18.5,15.8 18.5,14 14,14 14,18.4 15.7,18.4 15.7,32 16.7,32 16.7,18.5 18.4,18.5 18.4,16.8 32,16.8 32,15.8 "/>
                </svg>`
        },
        {
            "name": "round",
            "data": `<svg version="1.1" viewBox="0 0 32 32" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg"
                        style="enable-background:new 0 0 32 32;">
               <path d="M32,9H18.3C13.2,9,9,13.2,9,18.3l0,0V32h14v-9h9V9z"/>
               <polygon fill="#fff" points="18.5,15.8 18.5,14 14,14 14,18.4 15.7,18.4 15.7,32 16.7,32 16.7,18.5 18.4,18.5 18.4,16.8 32,16.8 32,15.8 "/>
               </svg>`
        }
    ],
    "linecaps": [
        {
            "name": "butt",
            "data": `<svg version="1.1" viewBox="0 0 32 32" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg"
                        style="enable-background:new 0 0 32 32;">
                <polygon points="19.2,16 19.2,13 12.8,13 12.8,16 9,16 9,32 23,32 23,16 "/>
                <polygon fill="#fff" points="13.8,14 13.8,18.4 15.5,18.4 15.5,32 16.5,32 16.5,18.5 18.2,18.5 18.2,14 "/>
            </svg>`
        },
        {
            "name": "round",
            "data": `<svg version="1.1" viewBox="0 0 32 32" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg"
                    style="enable-background:new 0 0 32 32;">
                <path d="M9,32h14V15.8c0-3.9-3.1-7-7-7l0,0c-3.9,0-7,3.1-7,7V32z"/>
                <polygon fill="#fff" points="13.8,14 13.8,18.4 15.5,18.4 15.5,32 16.5,32 16.5,18.5 18.2,18.5 18.2,14 "/>
            </svg>`
        },

        {
            "name": "square",
            "data": `<svg version="1.1" viewBox="0 0 32 32" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg"
                        style="enable-background:new 0 0 32 32;">
                <polygon points="9,32 23,32 23,8.8 9,8.8 "/>
                <polygon fill="#fff" points="13.8,14 13.8,18.4 15.5,18.4 15.5,32 16.5,32 16.5,18.5 18.2,18.5 18.2,14 "/>
            </svg>`
        }
    ]
};

const COLOR_SELECTOR_COLORS = [
    '#ffffff',
    '#cccccc',
    '#818282',
    '#666666',
    '#000000',
    '#f8931f',
    '#ffde00',
    '#ff3334',
    '#bf2652',
    '#652d90',
    '#3233ff',
    '#2ba7ff',
    '#26bf4b',
    '#00ff01',
    '#ffff00',
];

// Make array of inline SVG for pre-defined color block
export const PRE_DEFINED_COLORS = COLOR_SELECTOR_COLORS.map((color) => {
    return {
        name: color,
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="32" height="32" fill="' + color + '" /></svg>'
    };
});
