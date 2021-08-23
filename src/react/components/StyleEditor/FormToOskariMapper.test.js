import { FormToOskariMapper } from './FormToOskariMapper';

describe('FormToOskariMapper', () => {
    test('flat simple object', () => {
        const result = FormToOskariMapper.createFlatFormObjectFromStyle({
            testing: 5
        });
        expect(Object.keys(result).length).toEqual(1);
        expect(result.testing).toEqual(5);
    });

    test('flat style object', () => {
        const result = FormToOskariMapper.createFlatFormObjectFromStyle({
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
            }
        });
        expect(Object.keys(result).length).toEqual(10);
        expect(Object.values(result).every(value => typeof value !== 'object')).toEqual(true);
        expect(result['fill.color']).toEqual('#b5b5b5');
        expect(result['fill.area.pattern']).toEqual('solid');
        expect(result['stroke.area.lineJoin']).toEqual('round');
    });
    test('adjust style object', () => {
        const originalStyle = {
            fill: { // fill styles
                color: '#b5b5b5', // fill color
                area: {
                    pattern: 4 // fill style - original default: -1
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
            }
        };
        const changeStyleValue = FormToOskariMapper.createStyleAdjuster(originalStyle);
        const newStyle = changeStyleValue({ 'fill.area.pattern': 3});
        expect(originalStyle.fill.area.pattern).toEqual(4);
        expect(newStyle.fill.area.pattern).toEqual(3);
    });
});
