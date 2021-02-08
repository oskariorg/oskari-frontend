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
        lineCap: 'round', // line cap, supported: mitre, round and square
        area: {
            color: '#000000', // area stroke color
            width: 3, // area stroke width
            lineDash: 'solid', // area line dash
            lineJoin: 'round' // area line corner
        }
    },
    text: { // text style
        fill: { // text fill style
            color: '#000000' // fill color
        },
        stroke: { // text stroke style
            color: '#ffffff', // stroke color
            width: 1 // stroke width
        },
        font: 'bold 12px Arial', // font
        textAlign: 'top', // text align
        offsetX: 12, // text offset x
        offsetY: 12, // text offset y
        labelText: 'example', // label text
        labelProperty: 'propertyName' // read label from feature property
    },
    image: { // image style
        shape: 5, // 0-6 for default markers. svg or external icon path
        size: 3, // Oskari icon size.
        sizePx: 20, // Exact icon px size. Used if 'size' not defined.
        offsetX: 0, // image offset x
        offsetY: 0, // image offset y
        opacity: 0.7, // image opacity
        radius: 2, // image radius
        fill: {
            color: '#ff00ff' // image fill color
        }
    },
    inherit: false, // For hover. Set true if you wan't to extend original feature style.
    effect: 'auto normal' // Requires inherit: true. Lightens or darkens original fill color. Values [darken, lighten, auto] and [minor, normal, major].
};
