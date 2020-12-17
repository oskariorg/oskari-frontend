import React from 'react';
import { storiesOf } from '@storybook/react';
import { StyleForm } from './StyleForm';

const oskariMarkers = [
    {
        "offsetX": 14.06,
        "offsetY": 5.38,
        "data": "<svg width='32' height='32'><path fill='#000000' stroke='#000000' d='m 17.662202,6.161625 c -2.460938,-0.46875 -4.101563,-0.234375 -4.921875,0.585937 -0.234375,0.234376 -0.234375,0.468751 -0.117188,0.820313 0.234375,0.585938 0.585938,1.171875 1.054688,2.109375 0.46875,0.9375 0.703125,1.523438 0.820312,1.757813 -0.351562,0.351562 -1.054687,1.054687 -2.109375,1.992187 -1.523437,1.40625 -1.523437,1.40625 -2.226562,2.109375 -0.8203126,0.820312 -0.117188,1.757812 2.109375,2.8125 0.9375,0.46875 1.992187,0.820312 3.046875,0.9375 2.695312,0.585937 4.570312,0.351562 5.742187,-0.585938 0.351563,-0.351562 0.46875,-0.703125 0.351563,-1.054687 0,0 -1.054688,-2.109375 -1.054688,-2.109375 -0.46875,-1.054688 -0.46875,-1.171875 -0.9375,-2.109375 -0.351562,-0.703125 -0.46875,-1.054687 -0.585937,-1.289062 0.234375,-0.234375 0.234375,-0.351563 1.289062,-1.289063 1.054688,-0.9375 1.054688,-0.9375 1.757813,-1.640625 0.703125,-0.585937 0.117187,-1.40625 -1.757813,-2.34375 -0.820312,-0.351563 -1.640625,-0.585938 -2.460937,-0.703125 0,0 0,0 0,0 M 14.615327,26.0835 c 0,0 1.054687,-5.625 1.054687,-5.625 0,0 -1.40625,-0.234375 -1.40625,-0.234375 0,0 -1.054687,5.859375 -1.054687,5.859375 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0' /></svg>"
    }, {
        "offsetX": 16,
        "offsetY": 6.84,
        "data": "<svg width='32' height='32'><path fill='#000000' stroke='#000000' d='m 22.20134,7.4273516 c 0,0 -12.40234,0 -12.40234,0 0,0 0,12.3046904 0,12.3046904 0,0 3.41797,0 3.41797,0 0,0 2.73437,4.39453 2.73437,4.39453 0,0 2.73438,-4.39453 2.73438,-4.39453 0,0 3.51562,0 3.51562,0 0,0 0,-12.3046904 0,-12.3046904 0,0 0,0 0,0'/></svg>"
    }, {
        "offsetX": 16,
        "offsetY": 5.19,
        "data": "<svg width='32' height='32'><path fill='#000000' stroke='#000000' d='m 16.00025,5.7495486 c -1.99219,0 -3.51562,0.58594 -4.92187,1.99219 C 9.67213,9.1479886 8.969,10.788619 8.969,12.780799 c 0,1.17188 0.58594,2.8125 1.75781,5.03907 1.17188,2.22656 2.34375,4.10156 3.51563,5.625 0,0 1.75781,2.46093 1.75781,2.46093 4.6875,-6.21093 7.03125,-10.54687 7.03125,-13.125 0,-1.99218 -0.70312,-3.6328104 -2.10937,-5.0390604 -1.40625,-1.40625 -2.92969,-1.99219 -4.92188,-1.99219 0,0 0,0 0,0 m 0,9.9609404 c -0.82031,0 -1.40625,-0.23437 -1.99219,-0.82031 -0.58593,-0.58594 -0.82031,-1.17188 -0.82031,-1.99219 0,-0.82031 0.23438,-1.52344 0.82031,-2.10937 0.58594,-0.58594 1.17188,-0.8203204 1.99219,-0.8203204 0.82031,0 1.52344,0.2343804 2.10938,0.8203204 0.58593,0.58593 0.82031,1.28906 0.82031,2.10937 0,0.82031 -0.23438,1.40625 -0.82031,1.99219 -0.58594,0.58594 -1.28907,0.82031 -2.10938,0.82031 0,0 0,0 0,0'/></svg>"
    }, {
        "offsetX": 12.74,
        "offsetY": 5.63,
        "data": "<svg width='32' height='32'><path fill='#000000' stroke='#000000' d='m 13.48113,25.7265 c 0,0 1.99218,-8.3203 1.99218,-8.3203 0,0 -1.40625,-0.2344 -1.40625,-0.2344 0,0 -1.99218,8.5547 -1.99218,8.5547 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0 M 10.903,11.3124 c 0,1.4063 0.46875,2.5782 1.40625,3.6329 0.9375,1.0546 2.22656,1.5234 3.63281,1.5234 1.40625,0 2.57813,-0.4688 3.63282,-1.5234 1.05468,-1.0547 1.52343,-2.2266 1.52343,-3.6329 0,-1.4062 -0.46875,-2.5781 -1.52343,-3.5156 -1.05469,-0.9375 -2.22657,-1.5234 -3.63282,-1.5234 -1.40625,0 -2.69531,0.5859 -3.63281,1.5234 -0.9375,0.9375 -1.40625,2.1094 -1.40625,3.5156 0,0 0,0 0,0'/></svg>"
    }, {
        "offsetX": 20.12,
        "offsetY": 5.41,
        "data": "<svg width='32' height='32'><g transform='translate(1.2364754,0.92819)'><path fill='#000000' stroke='#000000' d='m 19.50313,25.03281 c 0,0 4.80468,-19.80468 4.80468,-19.80468 0,0 -1.52343,0 -1.52343,0 0,0 -4.6875,19.80468 -4.6875,19.80468 0,0 1.40625,0 1.40625,0 0,0 0,0 0,0 M 8.01875,5.11094 c 0,0 2.10938,5.27344 2.10938,5.27344 0,0 -4.45313,5.15625 -4.45313,5.15625 0,0 13.47656,0 13.47656,0 0,0 2.46094,-10.42969 2.46094,-10.42969 0,0 -13.59375,0 -13.59375,0 0,0 0,0 0,0'/></g></svg>"
    }, {
        "data": "<svg width='32' height='32'><path fill='#000000' stroke='#000000' d='m 8.969,15.99975 c 0,1.99219 0.70313,3.51563 2.10938,4.92188 1.40625,1.40625 2.92968,2.10937 4.92187,2.10937 1.99219,0 3.51563,-0.70312 4.92188,-2.10937 1.40625,-1.40625 2.10937,-2.92969 2.10937,-4.92188 0,-1.99219 -0.70312,-3.51562 -2.10937,-4.92187 C 19.51588,9.67163 17.99244,8.9685 16.00025,8.9685 c -1.99219,0 -3.51562,0.70313 -4.92187,2.10938 -1.40625,1.40625 -2.10938,2.92968 -2.10938,4.92187 0,0 0,0 0,0'/></svg>"
    }, {
        "offsetX": 16,
        "offsetY": 5.41,
        "data": "<svg width='32' height='32'><path fill='#000000' stroke='#000000' d='m 19.280933,16.92943 c 0,0 0,-10.8984403 0,-10.8984403 0,0 -6.5625,0 -6.5625,0 0,0 0,10.8984403 0,10.8984403 0,0 -4.5703104,0 -4.5703104,0 0,0 7.8515604,8.78906 7.8515604,8.78906 0,0 7.85156,-8.78906 7.85156,-8.78906 0,0 -4.57031,0 -4.57031,0 0,0 0,0 0,0'/></svg>"
    }
];

let oskariLineSvgs = [
    {
        'data': '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32,9H19.5A10.5,10.5,0,0,0,9,19.5V32H23V23h9Z"/><path d="M32,15.75H17.25v-1h-2.5v2.5h1V32h.5V17.25h1v-1H32Zm-15.25,1h-1.5v-1.5h1.5Z" fill="#fff"/></svg>'
    },
    {
        'data': '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><polygon points="32 9 9 9 9 16 9 23 9 32 23 32 23 23 32 23 32 9"/><path d="M32,15.75H17.25v-1h-2.5v2.5h1V32h.5V17.25h1v-1H32Zm-15.25,1h-1.5v-1.5h1.5Z" fill="#fff"/></svg>'
    }
];



const oskariTestStyle = {
    "fill": { // fill styles
        "color": "#b5b5b5", // fill color
        "area": {
            "pattern": 'solid' // fill style - original default: -1
        }
    },
    "stroke": { // stroke styles
        "color": "#000000", // stroke color
        "width": 3, // stroke width
        "lineDash": "solid", // line dash, supported: dash, dashdot, dot, longdash, longdashdot and solid
        "lineCap": "round", // line cap, supported: mitre, round and square
        "area": {
            "color": "#000000", // area stroke color
            "width": 3, // area stroke width
            "lineDash": "solid", // area line dash
            "lineJoin": "round" // area line corner
        }
    },
    "text": { // text style
        "fill": { // text fill style
            "color": "#000000" // fill color
        },
        "stroke": { // text stroke style
            "color": "#ffffff", // stroke color
            "width": 1 // stroke width
        },
        "font": "bold 12px Arial", // font
        "textAlign": "top", // text align
        "offsetX": 12, // text offset x
        "offsetY": 12, // text offset y
        "labelText": "example", // label text
        "labelProperty": "propertyName" // read label from feature property
    },
    "image": { // image style
        "shape": 5, // 0-6 for default markers. svg or external icon path
        "size": 3, // Oskari icon size.
        "sizePx": 20, // Exact icon px size. Used if 'size' not defined.
        "offsetX": 0, // image offset x
        "offsetY": 0, // image offset y
        "opacity": 0.7, // image opacity
        "radius": 2, // image radius
        "fill": {
            "color": "#ff00ff" // image fill color
        }
    },
    "inherit": false, // For hover. Set true if you wan't to extend original feature style.
    "effect": "auto normal" // Requires inherit: true. Lightens or darkens original fill color. Values [darken, lighten, auto] and [minor, normal, major].
};

const testOptions = [
    {
        value: 'testi tyyli dd',
        format: 'area',
    },
    {
        value: 'tyyli 2',
        format: 'line'
    },
    {
        value: 'storybooktyyli',
        format: 'area'
    }
];

const styleList = [
    {
        value: 'testi tyyli ff',
        format: 'point',
        fill: {
            color: '#c5c5c5',
            area: {
                pattern: 'solid'
            }
        },
        stroke: {
            color: "#008720",
            width: 3,
            lineDash: "solid",
            lineCap: "round",
            area: {
                color: "#008720",
                width: 3,
                lineDash: "solid",
                lineJoin: "round"
            }
        },
        image: {
            shape: 2,
            size: 4,
        }
    },
    {
        value: 'tyyli 2',
        format: 'line',
        fill: {
            color: '#c5c5c5',
            area: {
                pattern: 'solid'
            }
        },
        stroke: {
            color: "#88f8c2",
            width: 3,
            lineDash: "solid",
            lineCap: "round",
            area: {
                color: "##88ffc9",
                width: 3,
                lineDash: "solid",
                lineJoin: "round"
            }
        },
        image: {
            shape: 2,
            size: 4,
        }
    },
    {
        value: 'storybooktyyli',
        format: 'area',
        fill: {
            color: '#4600b0',
            area: {
                pattern: 'solid'
            }
        },
        stroke: {
            color: "#78a300",
            width: 3,
            lineDash: "solid",
            lineCap: "round",
            area: {
                color: "#622eff",
                width: 3,
                lineDash: "solid",
                lineJoin: "round"
            }
        },
        image: {
            shape: 2,
            size: 4,
        }
    }
];


storiesOf('StyleForm', module)
    .add('Default', () => (
        <StyleForm
            icons={ testOptions }
            styleList={ styleList }
            markers={ oskariMarkers }
            styleSettings={ oskariTestStyle }
            lineIcons={ oskariLineSvgs }
        />
    ));
