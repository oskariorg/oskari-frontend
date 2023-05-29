// This should match default style on server:
// https://github.com/oskariorg/oskari-server/blob/develop/service-base/src/main/java/fi/nls/oskari/domain/map/wfs/WFSLayerOptions.java#L136
export const OSKARI_BLANK_STYLE = {
    fill: { // fill styles
        color: '#FAEBD7', // fill color
        area: {
            pattern: 5 // fill style (5 == solid fill, matches -1 on server)
        }
    },
    stroke: { // stroke styles
        color: '#000000', // stroke color
        width: 1, // stroke width
        lineDash: 'solid', // line dash, supported: dash, dashdot, dot, longdash, longdashdot and solid
        lineCap: 'round', // line cap, supported: butt, round and square
        lineJoin: 'round', // line corner, supported: bevel, round and miter
        area: {
            color: '#000000', // area stroke color
            width: 1, // area stroke width
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

export const generateBlankStyle = (theme) => {
    return {
        ...OSKARI_BLANK_STYLE,
        fill: {
            ...OSKARI_BLANK_STYLE.fill,
            color: theme.color.primary
        },
        image: {
            ...OSKARI_BLANK_STYLE.image,
            fill: {
                ...OSKARI_BLANK_STYLE.image.fill,
                color: theme.color.primary
            }
        }
    };
};
