import { formatDegrees } from './helper';

describe('Coordinatetool.helper', () => {
    test('format degrees min default', () => {
        expect.assertions(4);
        const lon = 62.723013889;
        const lat = 26.145404444;
        const value = formatDegrees(lon, lat, 'min');
        expect(value.degreesX).toBe(62);
        expect(value.degreesY).toBe(26);

        expect(value.minutesX).toBe('43,38083');
        expect(value.minutesY).toBe('8,72427');
    });
    test('format degrees min with accuracy 3', () => {
        expect.assertions(4);
        const lon = 62.723013889;
        const lat = 26.145404444;
        const value = formatDegrees(lon, lat, 'min', 3);
        expect(value.degreesX).toBe(62);
        expect(value.degreesY).toBe(26);

        expect(value.minutesX).toBe('43,381');
        expect(value.minutesY).toBe('8,724');
    });
});
