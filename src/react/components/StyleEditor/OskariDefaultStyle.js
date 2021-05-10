export const OSKARI_BLANK_STYLE = {
    fill: { // fill styles
        color: '#b5b5b5', // fill color
        area: {
            pattern: 'solid' // fill style - original default: -1
        }
    },
    stroke: { // stroke styles
        color: '#000000', // stroke color
        width: 3, // stroke width
        lineDash: 'solid', // line dash, supported: dash, dashdot, dot, longdash, longdashdot and solid
        lineCap: 'square', // line cap, supported: mitre, round and square
        area: {
            color: '#000000', // area stroke color
            width: 3, // area stroke width
            lineDash: 'solid', // area line dash
            lineJoin: 'miter' // area line corner
        }
    },
    image: { // image style
        shape: 5, // 0-6 for default markers. svg or external icon path
        size: 3, // Oskari icon size.
        fill: {
            color: '#ff00ff' // image fill color
        }
    }
};
