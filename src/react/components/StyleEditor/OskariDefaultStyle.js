export const OSKARI_BLANK_STYLE = {
    fill: { // fill styles
        color: '#b5b5b5', // fill color
        area: {
            pattern: 5 // fill style
        }
    },
    stroke: { // stroke styles
        color: '#000000', // stroke color
        width: 3, // stroke width
        lineDash: 'solid', // line dash, supported: dash, dashdot, dot, longdash, longdashdot and solid
        lineCap: 'round', // line cap, supported: butt, round and square
        lineJoin: 'round', // line corner, supported: bevel, round and miter
        area: {
            color: '#000000', // area stroke color
            width: 3, // area stroke width
            lineDash: 'solid', // area line dash
            lineJoin: 'round' // area line corner, supported: bevel, round and miter
        }
    },
    image: { // image style
        shape: 5, // 0-6 for default markers. svg or external icon path
        size: 3, // Oskari icon size.
        fill: {
            color: '#FAEBD7' // image fill color
        }
    }
};
