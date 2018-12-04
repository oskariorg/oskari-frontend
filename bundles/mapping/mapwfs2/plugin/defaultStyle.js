import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';

const normalFill = new olStyleFill({
    color: '#FAEBD7'
});
const normalStroke = new olStyleStroke({
    color: '#000000',
    width: 1
});

const selectedFill = new olStyleFill({
    color: '#e19b28'
});
const selectedStroke = new olStyleStroke({
    color: '#e19b28',
    width: 2
});

export const normalStyle = new olStyleStyle({
    image: new olStyleCircle({
        radius: 6,
        fill: normalFill,
        stroke: normalStroke
    }),
    fill: normalFill,
    stroke: normalStroke
});

const selectedLine = new olStyleStyle({
    stroke: selectedStroke
});

const selectedOther = new olStyleStyle({
    image: new olStyleCircle({
        radius: 6,
        fill: selectedFill,
        stroke: normalStroke
    }),
    fill: selectedFill,
    stroke: normalStroke
});

export function selectedStyle (feature, resolution) {
    switch (feature.getGeometry().getType()) {
    case 'LineString':
    case 'MultiLineString':
        return selectedLine;
    default:
        return selectedOther;
    }
}
