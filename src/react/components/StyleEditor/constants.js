export const LOCALIZATION_BUNDLE = 'oskariui';

// AntD width settings for grid
export const ANTD_FORMLAYOUT = {
    labelCol: { span: 24 }, // width of label column in AntD grid settings -> full width = own row inside element
    wrapperCol: { span: 24 } // width of wrapping column in AntD grid settings -> full width = own row inside element
};

export const LINE_STYLES = {
    "lineDash": [
        {
            "name": "solid",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,32 l32,-32\" stroke=\"#000000\" stroke-width=\"3\"/></svg>"
        },
        {
            "name": "dash",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,32 l32,-32\" stroke=\"#000000\" stroke-dasharray=\"4, 4\" stroke-width=\"3\"/></svg>"
        }
    ],
    "corners": [
        {
            "name": "miter",
            "data": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"32\" height=\"32\"><polygon points=\"32 9 9 9 9 16 9 23 9 32 23 32 23 23 32 23 32 9\"/><path d=\"M32,15.75H17.25v-1h-2.5v2.5h1V32h.5V17.25h1v-1H32Zm-15.25,1h-1.5v-1.5h1.5Z\" fill=\"#fff\"/></svg>"
        },
        {
            "name": "round",
            "data": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"32\" height=\"32\"><path d=\"M32,9H19.5A10.5,10.5,0,0,0,9,19.5V32H23V23h9Z\"/><path d=\"M32,15.75H17.25v-1h-2.5v2.5h1V32h.5V17.25h1v-1H32Zm-15.25,1h-1.5v-1.5h1.5Z\" fill=\"#fff\"/></svg>"
        }
    ],
    "linecaps": [
        {
            "name": "round",
            "data": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"32\" height=\"32\"><polygon points=\"9 32 23 32 23 21 18.17 16 13.94 16 9 21 9 32\"/></svg>",
        },

        {
            "name": "square",
            "data": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"32\" height=\"32\"><rect x=\"9\" y=\"21.04\" width=\"14\" height=\"10.96\"/></svg>"
        }
    ]
};

export const PRE_DEFINED_COLORS = [
        {
            "name": "#f8931f",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,16 l32,0\" stroke=\"#f8931f\" stroke-width=\"32\"/></svg>"
        },
        {
            "name": "#ff0000",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,16 l32,0\" stroke=\"#ff0000\" stroke-width=\"32\"/></svg>"
        },
        {
            "name": "#3233ff",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,16 l32,0\" stroke=\"#3233ff\" stroke-width=\"32\"/></svg>"
        },
        {
            "name": "#00ff00",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,16 l32,0\" stroke=\"#00ff00\" stroke-width=\"32\"/></svg>"
        },
        {
            "name": "#ffff00",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,16 l32,0\" stroke=\"#ffff00\" stroke-width=\"32\"/></svg>"
        }
    ];