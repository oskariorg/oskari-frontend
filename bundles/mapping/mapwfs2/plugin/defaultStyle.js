import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';

export default new olStyleStyle({
    image: new olStyleCircle({
        fill: new olStyleFill({
            color: '#FAEBD7'
        }),
        radius: 6,
        stroke: new olStyleStroke({
            color: '#000000',
            width: 1
        })
    }),
    fill: new olStyleFill({
        color: '#FAEBD7'
    }),
    stroke: new olStyleStroke({
        color: '#000000',
        width: 1
    })
});
