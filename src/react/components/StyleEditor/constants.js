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
            "name": "#ffffff",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#ffffff\"/></svg>"
        },
        {
            "name": "#cccccc",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#cccccc\"/></svg>"
        },
        {
            "name": "#818282",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#818282\"/></svg>"
        },
        {
            "name": "#666666",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#666666\"/></svg>"
        },
        {
            "name": "#000000",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#000000\"/></svg>"
        },
        {
            "name": "#f8931f",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#f8931f\"/></svg>"
        },
        {
            "name": "#ffde00",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#ffde00\"/></svg>"
        },
        {
            "name": "#ff3334",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#ff3334\"/></svg>"
        },
        {
            "name": "#bf2652",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#bf2652\"/></svg>"
        },
        {
            "name": "#652d90",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#652d90\"/></svg>"
        },
        {
            "name": "#3233ff",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#3233ff\"/></svg>"
        },
        {
            "name": "#2ba7ff",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#2ba7ff\"/></svg>"
        },
        {
            "name": "#26bf4b",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#26bf4b\"/></svg>"
        },
        {
            "name": "#00ff01",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#00ff01\"/></svg>"
        },
        {
            "name": "#ffff00",
            "data": "<svg viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"0\" y=\"0\" width=\"32\" height=\"32\" fill=\"#ffff00\"/></svg>"
        }
    ];
    